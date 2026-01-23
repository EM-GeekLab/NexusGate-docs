# NexusGate Documentation

NexusGate 的官方文档站点，支持中英文双语。

## 技术栈

- [Fumadocs](https://fumadocs.vercel.app/) - 文档框架
- [TanStack Start](https://tanstack.com/start) - 全栈框架
- [Vite](https://vitejs.dev/) - 构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 样式

## 开发

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev
```

## 构建

```bash
bun run build
```

构建产物会自动复制到 `../NexusGate/backend/docs/` 目录（如果存在）。

## 项目结构

```
├── content/docs/      # MDX 文档内容
│   ├── guide/         # 使用指南
│   ├── integrations/  # 集成指南
│   └── compatibility/ # 兼容性说明
├── src/
│   ├── components/    # React 组件
│   └── routes/        # 路由配置
└── vite.config.ts     # Vite 配置
```

## 贡献指南

欢迎参与文档贡献！请注意以下事项：

### 双语要求

本文档支持中英文双语，**每篇文档都需要提供两个语言版本**：

- `example.mdx` - 英文版本
- `example.zh.mdx` - 中文版本

### 文档结构

```
content/docs/
├── guide/
│   ├── introduction.mdx      # 英文
│   ├── introduction.zh.mdx   # 中文
│   ├── meta.json             # 英文导航配置
│   └── meta.zh.json          # 中文导航配置
└── ...
```

### 添加新文档

1. 在对应目录下创建 `.mdx` 和 `.zh.mdx` 两个文件
2. 更新 `meta.json` 和 `meta.zh.json` 配置导航顺序
3. 确保两个语言版本内容一致

### MDX 组件

文档中可使用以下自定义组件：

- `<ApiKeyLink />` - 显示 API Key 选择器
- `<ConfigCode>` - 带复制功能的配置代码块

## 相关链接

- [NexusGate 主仓库](https://github.com/EM-GeekLab/NexusGate)
