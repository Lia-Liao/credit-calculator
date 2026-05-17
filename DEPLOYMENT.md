# 信用卡借款计算器 - 部署指南

## 项目结构

```
credit-calculator/
├── src/                      # 源代码（共享）
│   ├── frontend/             # 前端页面
│   ├── admin/                # 管理后台
│   └── shared/               # 共享业务逻辑
├── cloudflare/               # Cloudflare Pages 专用
│   └── functions/            # Pages Functions API
├── local/                    # 本地开发专用
│   ├── server.js             # Express 服务器
│   └── data/                 # 本地数据文件
└── docs/                     # 文档
```

## 本地开发

### 安装依赖

```bash
pnpm install
```

### 启动本地服务器

```bash
pnpm dev
```

服务启动后访问：
- 前端页面: http://localhost:3000
- 管理后台: http://localhost:3000/admin

### Cloudflare Pages 本地预览

```bash
pnpm pages:dev
```

## Cloudflare Pages 部署

### 前置条件

1. 拥有 Cloudflare 账号
2. 在 GitHub 创建独立仓库 `credit-calculator`
3. 创建 KV 命名空间

### 部署步骤

#### 1. 创建 KV 命名空间

在 Cloudflare Dashboard 中：
- 进入 **Workers & Pages** → **KV**
- 点击 **Create namespace**
- 名称：`credit-calculator-data`（或任意名称）

#### 2. 配置 Pages 项目

在 Cloudflare Dashboard 中：
- 进入 **Workers & Pages** → **Pages**
- 点击 **Create a project** → **Connect to Git**
- 选择你的 GitHub 仓库 `credit-calculator`

#### 3. 构建配置

| 配置项 | 值 |
|--------|-----|
| Framework preset | `None` |
| Build command | 留空 |
| Build output directory | `src/frontend` |

#### 4. 环境变量和绑定

进入项目的 **Settings** → **Environment variables**：

**添加 KV 绑定：**
- Variable name: `DATA_KV`
- KV namespace: 选择你创建的命名空间

#### 5. 部署

点击 **Save and Deploy**

### wrangler.toml 配置说明

```toml
name = "credit-calculator"
compatibility_date = "2024-04-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[functions]
directory = "cloudflare/functions"

[[kv_namespaces]]
binding = "DATA_KV"
id = "你的 KV 命名空间 ID"
```

> **注意**：`id` 字段需要在 Cloudflare 控制台获取并填写

### 使用 wrangler CLI 部署

```bash
# 登录 Cloudflare
wrangler login

# 部署
pnpm pages:deploy
```

## API 接口

### 基础路径

```
https://<your-pages-domain>.pages.dev/api
```

### 接口列表

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/credit-cards` | 获取所有信用卡数据 |
| GET | `/api/credit-cards/:id` | 获取单个信用卡 |
| POST | `/api/credit-cards` | 创建信用卡 |
| PUT | `/api/credit-cards/:id` | 更新信用卡 |
| DELETE | `/api/credit-cards/:id` | 删除信用卡 |
| POST | `/api/calculate` | 计算最优融资方案 |

### 计算接口示例

```bash
curl -X POST https://<domain>.pages.dev/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "minTerm": 3, "maxTerm": 12}'
```

## 数据存储

### 本地开发

数据存储在 `local/data/data.json`，首次启动时会从 `sample-data.json` 初始化。

### Cloudflare 生产环境

数据存储在 KV 命名空间中，键为 `data`。首次访问时会自动初始化示例数据。

## Git 工作流

1. 在本地开发修改代码
2. 提交到 GitHub `main` 分支
3. Cloudflare 自动触发部署
4. 部署完成后可在 Pages 控制台查看日志

## 注意事项

1. **数据持久化**：KV 存储可能有秒级延迟，数据更新后可能不会立即生效
2. **环境变量**：确保 `DATA_KV` 绑定正确配置
3. **CORS**：已在 middleware 中配置，支持跨域访问
4. **Node.js 兼容性**：使用 `nodejs_compat` flag 确保兼容性