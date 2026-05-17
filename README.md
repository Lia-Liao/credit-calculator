# 信用卡借款成本计算器

一个帮助用户计算最优信用卡借款方案的工具。

## 项目结构

```
credit-calculator/
├── PRD.md                         # 产品需求文档
├── 技术文档.md                     # 技术文档
├── README.md                       # 本文件
├── frontend/                      # 前端H5页面
│   ├── index.html                # 主页面
│   ├── css/
│   │   └── style.css             # 样式文件
│   └── js/
│       ├── app.js                # 主应用逻辑
│       └── api.js                # API接口封装
├── backend/                       # 后端服务
│   ├── package.json              # 依赖配置
│   ├── server.js                 # 服务启动文件
│   ├── config/
│   │   └── database.js           # 数据库配置
│   ├── models/
│   │   ├── CreditCard.js         # 信用卡模型
│   │   └── InstallmentProduct.js # 分期产品模型
│   ├── controllers/
│   │   ├── creditCardController.js
│   │   ├── installmentProductController.js
│   │   └── calculatorController.js
│   ├── routes/
│   │   ├── api.js                # API路由总入口
│   │   ├── creditCards.js        # 信用卡路由
│   │   ├── installmentProducts.js # 分期产品路由
│   │   └── calculate.js          # 计算路由
│   └── services/
│       └── calculatorService.js  # 计算服务
└── admin/                         # 管理后台
    └── admin.html                # 管理页面
```

## 功能特性

1. **信用卡信息展示** - 展示所有银行信用卡的账单出账金额和现金授信额度
2. **最优融资方案计算** - 根据用户输入计算最优的融资成本方案
3. **一键填入** - 自动计算并填入所有信用卡账单出账金额的总和
4. **后端管理界面** - 用于管理信用卡数据和产品利率数据

## 技术栈

- **后端**: Node.js + Express + Sequelize + SQLite3
- **前端**: 纯 HTML5 + CSS3 + JavaScript (无框架)
- **UI**: 响应式设计，支持手机H5

## 安装和运行

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装步骤

1. 进入后端目录：
```bash
cd credit-calculator/backend
```

2. 安装依赖：
```bash
npm install
```

3. 启动服务：
```bash
npm start
```

或者使用开发模式（自动重启）：
```bash
npm run dev
```

### 访问地址

- 前端页面: http://localhost:3000
- 管理后台: http://localhost:3000/admin

## 使用说明

### 前端使用

1. **查看信用卡列表** - 点击"信用卡列表"标签查看所有信用卡信息
2. **计算最优方案** - 点击"计算最优"标签：
   - 输入借款金额或点击"一键填入"按钮
   - 选择借款期数范围
   - 点击"计算最优方案"按钮
3. **查看结果** - 系统会显示最优方案的详细信息

### 管理后台使用

访问 http://localhost:3000/admin 可以：
- 添加/编辑/删除信用卡信息
- 管理分期产品数据

## 数据库

项目使用SQLite数据库，数据库文件位于 `backend/data/database.sqlite`。首次运行时会自动创建数据库并插入示例数据。

## 注意事项

- 计算结果仅供参考，实际以银行为准
- 不涉及真实的金融交易
