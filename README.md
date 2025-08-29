# 🚀 AI产品订阅管理系统 v2.0

<div align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-green" alt="Version">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/React-18-61dafb" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-3.0-38bdf8" alt="TailwindCSS">
</div>

## 📋 系统简介

AI产品订阅管理系统是一个现代化的企业级订阅管理平台，专为管理各种AI产品订阅而设计。系统支持月付制和年付制，提供个人版、团队版和企业版的灵活配置，通过智能公式自动计算费用，最大程度减少用户手动输入。

## ✨ 核心特性

### 🎯 订阅管理
- **多样化产品支持**：支持ChatGPT、Claude、Midjourney等主流AI产品
- **灵活计费模式**：支持月付制和年付制两种计费方式
- **版本管理**：个人版、团队版、企业版灵活配置
- **批量用户管理**：支持多用户数量配置和成本计算

### 💰 智能计算
- **自动费用计算**：根据计费周期和用户数自动计算总成本
- **月度等价换算**：将年付费用自动换算为月度等价
- **实时统计分析**：实时显示总订阅数、月度支出、年度支出等关键指标
- **剩余时间提醒**：自动计算并提醒订阅剩余天数

### 🎨 界面设计
- **深色/浅色模式**：支持主题切换，跟随系统偏好
- **响应式设计**：完美适配桌面、平板、手机等设备
- **现代化UI**：参考Linear App的简约设计风格
- **流畅动画**：精心设计的微交互和过渡动画

### 🔐 用户系统
- **用户认证**：支持登录、自动注册功能
- **权限管理**：区分管理员和普通用户角色
- **数据持久化**：使用localStorage本地存储数据
- **多用户支持**：支持多个用户独立管理订阅

## 🛠️ 技术架构

### 前端技术栈
- **React 18**：现代化的组件化开发框架
- **Tailwind CSS 3.0+**：实用优先的CSS框架
- **Lucide Icons**：精美的图标库
- **Babel Standalone**：实时JSX转换

### 数据存储
- **LocalStorage API**：浏览器本地存储
- **兼容Trickle API**：保留Trickle平台接口兼容性

### 开发工具
- **Node.js**：本地开发服务器
- **Git**：版本控制

## 📁 项目结构

```
ai-subscription-manager/
├── index.html              # 主应用页面
├── login.html              # 登录页面
├── app.js                  # 主应用逻辑
├── login-app.js            # 登录页逻辑
├── server.js               # Node.js开发服务器
├── start.sh                # 快速启动脚本
├── package.json            # 项目配置文件
├── components/             # React组件目录
│   ├── Header.js           # 顶部导航组件
│   ├── SubscriptionCard.js # 订阅卡片组件
│   ├── AddSubscriptionModal.js # 添加订阅弹窗
│   ├── StatsCard.js        # 统计卡片组件
│   └── LoginForm.js        # 登录表单组件
└── utils/                  # 工具函数目录
    ├── storage.js          # 数据存储管理
    ├── auth.js             # 用户认证功能
    └── calculations.js     # 费用计算逻辑
```

## 🚀 快速开始

### 方式一：使用启动脚本（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Ivor-NCUT/AI-.git
cd AI-

# 2. 运行启动脚本
./start.sh

# 3. 选择启动方式并访问系统
```

### 方式二：手动启动

#### 使用Node.js
```bash
# 安装Node.js后运行
node server.js

# 访问 http://localhost:8080
```

#### 使用Python
```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080

# 访问 http://localhost:8080
```

#### 直接打开文件
直接在浏览器中打开 `index.html` 文件

## 👤 默认账户

### 管理员账户
- 用户名：`admin`
- 密码：`123456`
- 权限：完全管理权限

### 普通用户账户
- 用户名：`user1`
- 密码：`password`
- 权限：基础使用权限

**注意**：新用户首次登录会自动完成注册

## 📖 使用指南

### 1. 登录系统
1. 访问登录页面
2. 输入用户名和密码（或使用快捷登录按钮）
3. 新用户将自动注册
4. 登录成功后跳转到主页面

### 2. 添加订阅
1. 点击"添加订阅"按钮
2. 选择或输入产品名称
3. 选择版本类型（个人版/团队版/企业版）
4. 选择计费周期（月付/年付）
5. 输入价格和用户数量
6. 系统自动计算总成本和结束日期
7. 点击"确认添加"保存

### 3. 管理订阅
- **查看详情**：订阅卡片显示所有关键信息
- **费用追踪**：实时显示月度等价和总成本
- **时间管理**：显示剩余天数和进度条
- **删除订阅**：点击删除图标并确认

### 4. 数据统计
- **总订阅数**：当前激活的订阅总数
- **月度支出**：所有订阅的月度费用总和
- **年度支出**：预计年度总支出
- **平均单价**：每个订阅的平均月度成本

### 5. 主题切换
- 点击右上角的主题切换开关
- 支持深色模式和浅色模式
- 自动跟随系统主题偏好

## 🎨 界面预览

### 主要功能
- ✅ 用户登录与自动注册
- ✅ 订阅添加与管理
- ✅ 自动费用计算
- ✅ 实时数据统计
- ✅ 深色/浅色主题切换
- ✅ 响应式移动端适配
- ✅ 数据本地持久化
- ✅ 订阅到期提醒

### 设计特点
- 🎯 Linear风格的简约现代设计
- 💫 流畅的动画和过渡效果
- 📱 完美的移动端体验
- 🌈 科技感的绿色配色方案
- 🎨 精心设计的卡片和组件

## 🔧 配置说明

### 自定义产品列表
编辑 `components/AddSubscriptionModal.js` 中的产品数组：
```javascript
const products = [
  { name: 'ChatGPT Plus', price: 20, cycle: '月付' },
  // 添加更多产品...
];
```

### 修改主题颜色
编辑 `index.html` 和 `login.html` 中的CSS变量：
```css
:root {
  --primary-color: #10b981;  /* 主色调 */
  --secondary-color: #059669; /* 次要色调 */
  --accent-color: #34d399;    /* 强调色 */
}
```

### 调整默认用户
编辑 `utils/storage.js` 中的默认用户配置

## 🔄 更新日志

### v2.0.0 (2024-08-29)
- 🎉 全新UI设计，参考Linear App风格
- ✨ 增强的动画和交互效果
- 🔧 修复Trickle API集成问题
- 💾 实现完整的本地存储方案
- 📱 改进响应式设计
- 🎨 优化深色/浅色模式切换
- 🚀 添加快速启动脚本
- 📊 增强统计功能显示

### v1.0.0 (2024-01-20)
- 初始版本发布
- 基础订阅管理功能
- 用户认证系统
- 响应式界面设计

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢以下开源项目的支持：
- [React](https://reactjs.org/) - 用户界面构建
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Linear](https://linear.app/) - UI设计灵感

## 📞 联系方式

- 项目维护者：AI Subscription Team
- GitHub：[https://github.com/Ivor-NCUT/AI-](https://github.com/Ivor-NCUT/AI-)
- 问题反馈：[Issues](https://github.com/Ivor-NCUT/AI-/issues)

---

⭐ **如果这个项目对您有帮助，请给它一个星标！**

<div align="center">
  Made with ❤️ by AI Subscription Team
</div>