import fs from 'node:fs/promises';
import path from 'node:path';
import {
  createMiddleware,
  getDefaultSerovalPlugins,
} from '@tanstack/start-client-core';
import { fromJSON, toJSONAsync } from 'seroval';

// Pure JS SHA-1 fallback for non-secure contexts (HTTP)
// crypto.subtle is only available in secure contexts (HTTPS/localhost)
function sha1Sync(buffer: Uint8Array): string {
  const rotl = (n: number, s: number) => (n << s) | (n >>> (32 - s));

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const msgLen = buffer.length;
  const bitLen = msgLen * 8;
  const paddingLen = ((55 - (msgLen % 64)) + 64) % 64 + 1;
  const padded = new Uint8Array(msgLen + paddingLen + 8);
  padded.set(buffer);
  padded[msgLen] = 0x80;

  const view = new DataView(padded.buffer);
  // SHA-1 uses big-endian 64-bit length, but JS bitLen fits in 32 bits
  view.setUint32(padded.length - 4, bitLen, false);

  const w = new Int32Array(80);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getInt32(offset + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!, 1);
    }

    let a = h0, b = h1, c = h2, d = h3, e = h4;

    for (let i = 0; i < 80; i++) {
      let f: number, k: number;
      if (i < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (i < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (i < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }

      const temp = (rotl(a, 5) + f + e + k + w[i]!) | 0;
      e = d;
      d = c;
      c = rotl(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) | 0;
    h1 = (h1 + b) | 0;
    h2 = (h2 + c) | 0;
    h3 = (h3 + d) | 0;
    h4 = (h4 + e) | 0;
  }

  return [h0, h1, h2, h3, h4]
    .map((h) => (h >>> 0).toString(16).padStart(8, '0'))
    .join('');
}

async function sha1Hash(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);

  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Fallback for non-secure contexts (HTTP without localhost)
  return sha1Sync(msgBuffer);
}

const getStaticCacheUrl = async (opts: {
  functionId: string;
  hash: string;
}) => {
  const filename = await sha1Hash(`${opts.functionId}__${opts.hash}`);
  return `/__tsr/staticServerFnCache/${filename}.json`;
};

const jsonToFilenameSafeString = (json: unknown) => {
  const sortedKeysReplacer = (_key: string, value: unknown) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? Object.keys(value as Record<string, unknown>)
          .sort()
          .reduce(
            (acc, curr) => {
              acc[curr] = (value as Record<string, unknown>)[curr];
              return acc;
            },
            {} as Record<string, unknown>,
          )
      : value;
  const jsonString = JSON.stringify(json ?? '', sortedKeysReplacer);
  return jsonString.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
};

const staticClientCache =
  typeof document !== 'undefined' ? new Map() : null;

async function addItemToCache({
  functionId,
  data,
  response,
}: {
  functionId: string;
  data: unknown;
  response: { result: unknown; context: { sendContext: unknown } };
}) {
  const hash = jsonToFilenameSafeString(data);
  const url = await getStaticCacheUrl({ functionId, hash });
  const clientUrl = process.env.TSS_CLIENT_OUTPUT_DIR!;
  const filePath = path.join(clientUrl, url);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const stringifiedResult = JSON.stringify(
    await toJSONAsync(
      {
        result: response.result,
        context: response.context.sendContext,
      },
      { plugins: getDefaultSerovalPlugins() },
    ),
  );
  await fs.writeFile(filePath, stringifiedResult, 'utf-8');
}

const fetchItem = async ({
  data,
  functionId,
}: {
  data: unknown;
  functionId: string;
}) => {
  const hash = jsonToFilenameSafeString(data);
  const url = await getStaticCacheUrl({ functionId, hash });
  let result = staticClientCache?.get(url);
  result = await fetch(url, {
    method: 'GET',
  })
    .then((r) => r.json())
    .then((d) => fromJSON(d, { plugins: getDefaultSerovalPlugins() }));
  return result;
};

export const staticFunctionMiddleware = createMiddleware({ type: 'function' })
  .client(async (ctx: any) => {
    if (
      process.env.NODE_ENV === 'production' &&
      typeof document !== 'undefined'
    ) {
      const response = await fetchItem({
        functionId: ctx.functionId,
        data: ctx.data,
      });
      if (response) {
        return {
          result: (response as any).result,
          context: { ...ctx.context, ...(response as any).context },
        };
      }
    }
    return ctx.next();
  })
  .server(async (ctx: any) => {
    const response = await ctx.next();
    if (process.env.NODE_ENV === 'production') {
      await addItemToCache({
        functionId: ctx.functionId,
        response: { result: response.result, context: ctx },
        data: ctx.data,
      });
    }
    return response;
  });
