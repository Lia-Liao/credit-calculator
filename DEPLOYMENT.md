# Cloudflare Pages 部署指南

## 前置准备

1. 注册 Cloudflare 账号：https://dash.cloudflare.com/sign-up
2. 安装 Wrangler CLI（如果想本地测试）：
   ```bash
   npm install -g wrangler
   ```

## 部署步骤

### 第一步：创建 Cloudflare Pages 项目

1. 访问 https://dash.cloudflare.com/
2. 点击 **Workers & Pages** → **Create application** → **Pages**
3. 选择 **Connect to Git**
4. 选择你的 GitHub 仓库 `Lia-Liao/credit-calculator`

### 第二步：配置构建设置

在 **Build settings** 中配置：

| 配置项 | 填写内容 |
|--------|----------|
| **Project name** | `credit-calculator`（随便起） |
| **Production branch** | `main` |
| **Framework preset** | `None` |
| **Build command** | 留空 |
| **Build output directory** | `frontend` |

### 第三步：创建 KV 命名空间

1. 在 Cloudflare Dashboard，点击 **Workers & Pages** → **KV**
2. 点击 **Create namespace**
3. 名称填写：`credit-calculator-data`
4. 点击 **Add**

### 第四步：绑定 KV 到 Pages 项目

1. 回到你的 Pages 项目
2. 点击 **Settings** → **Functions**
3. 找到 **KV namespace bindings**
4. 点击 **Add binding**
   - **Variable name**: `DATA_KV`
   - **KV namespace**: 选择刚才创建的 `credit-calculator-data`

### 第五步：初始化数据（可选）

1. 在 KV 命名空间页面，点击 **Add key-value pair**
2. **Key**: `data`
3. **Value**: 把 `backend/data/sample-data.json` 的内容复制进去
4. 点击 **Add entry**

（其实代码里已经写了自动初始化，如果没有数据会自动用 sample-data.json）

### 第六步：部署！

1. 回到 Pages 项目的 **Deployments** 页面
2. 点击 **Save and Deploy**
3. 等待部署完成（约 1-2 分钟）

## 访问你的应用

部署完成后，Cloudflare 会给你一个 URL，类似：
`https://credit-calculator.pages.dev`

---

## Git 版本管理使用

### 查看历史版本
```bash
git log --oneline
```

### 回退到上个版本
```bash
git reset --hard HEAD~1
git push -f origin main
```

### 查看修改内容
```bash
git diff
```

### 提交新修改
```bash
git add .
git commit -m "描述你的修改"
git push origin main
```

---

## 本地开发测试（可选）

如果你想在本地测试 Cloudflare Pages Functions：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 登录 Wrangler：
   ```bash
   wrangler login
   ```

3. 创建本地 KV 命名空间（或绑定远程的）：
   ```bash
   wrangler kv:namespace create "credit-calculator-data" --preview
   ```

4. 更新 `wrangler.toml` 中的 `id`

5. 启动本地开发服务器：
   ```bash
   npm run pages:dev
   ```

6. 访问 http://localhost:3000
