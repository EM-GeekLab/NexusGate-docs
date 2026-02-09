// Polyfill crypto.subtle.digest for non-secure contexts (HTTP).
// crypto.subtle is only available in secure contexts (HTTPS/localhost).
// The staticFunctionMiddleware from @tanstack/start-static-server-functions
// uses crypto.subtle.digest('SHA-1', ...) which fails on HTTP.

function sha1(buffer: Uint8Array): ArrayBuffer {
  const rotl = (n: number, s: number) => (n << s) | (n >>> (32 - s));

  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const msgLen = buffer.length;
  const bitLen = msgLen * 8;
  const paddingLen = (((55 - (msgLen % 64)) + 64) % 64) + 1;
  const padded = new Uint8Array(msgLen + paddingLen + 8);
  padded.set(buffer);
  padded[msgLen] = 0x80;

  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 4, bitLen, false);

  const w = new Int32Array(80);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getInt32(offset + i * 4, false);
    }
    for (let i = 16; i < 80; i++) {
      w[i] = rotl(w[i - 3]! ^ w[i - 8]! ^ w[i - 14]! ^ w[i - 16]!, 1);
    }

    let a = h0,
      b = h1,
      c = h2,
      d = h3,
      e = h4;

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

  const result = new ArrayBuffer(20);
  const resultView = new DataView(result);
  resultView.setUint32(0, h0, false);
  resultView.setUint32(4, h1, false);
  resultView.setUint32(8, h2, false);
  resultView.setUint32(12, h3, false);
  resultView.setUint32(16, h4, false);
  return result;
}

if (typeof globalThis.crypto !== 'undefined' && !globalThis.crypto.subtle) {
  (globalThis.crypto as any).subtle = {
    async digest(_algorithm: string, data: BufferSource): Promise<ArrayBuffer> {
      const buffer =
        data instanceof ArrayBuffer
          ? new Uint8Array(data)
          : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      return sha1(buffer);
    },
  };
}
