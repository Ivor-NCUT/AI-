# 🗓️ 管订 NoSam - AI 产品订阅管理工具

<div align="center">
  <img src="assets/images/管订NoSam 产品图标.png" alt="管订 NoSam Logo" width="128" height="128" />
  <h3>优雅地管理你的 AI 订阅</h3>
  <p>告别订阅混乱，掌控 AI 支出</p>
</div>

## 📖 项目简介

**管订 NoSam** 是一款专为 AI 产品订阅管理而设计的工具。产品名称寓意深刻：
- **管订**：简洁明了，表达"管理订阅"的核心功能
- **NoSam**：向 Sam Altman 说"No"的幽默表达，象征用户对订阅的自主掌控

## ✨ 功能特点

### 🎯 核心功能
- 📊 **订阅概览** - 一目了然查看所有 AI 产品订阅状态
- 💰 **费用统计** - 实时统计月度、年度费用和平均单价
- 🌍 **多币种支持** - 支持 20+ 种货币自动转换
- 📝 **自定义产品** - 灵活添加任何 AI 产品订阅
- 🔄 **自动续费提醒** - 及时了解订阅到期情况
- 🌓 **深色模式** - 保护眼睛，适应不同使用场景

### 🎨 设计特色
- 清新的青绿色渐变主题
- 圆润的卡片式设计
- 流畅的动画效果
- 响应式布局，完美适配移动端

## 🚀 快速开始

### 在线体验
访问演示地址：[https://your-domain.com](https://your-domain.com)

默认测试账号：
- 用户名：`admin`
- 密码：`123456`

### 本地部署

1. **克隆项目**
```bash
git clone https://github.com/Ivor-NCUT/AI-.git
cd AI-
```

2. **安装依赖**
```bash
npm install
```

3. **启动服务**
```bash
npm start
# 或使用 PM2
pm2 start ecosystem.config.js
```

4. **访问系统**
打开浏览器访问：`http://localhost:8080`

## 🛠️ 技术栈

- **前端框架**: React 18 (CDN引入)
- **样式框架**: Tailwind CSS
- **数据存储**: LocalStorage API
- **进程管理**: PM2
- **开发语言**: JavaScript (ES6+)
- **构建工具**: Babel Standalone

## 📱 支持的 AI 产品

### 预设产品
- ChatGPT Plus / Team
- Claude Pro / Team
- GitHub Copilot
- Midjourney
- Perplexity Pro
- Poe Premium
- 文心一言
- 通义千问
- Kimi+
- 更多...

### 自定义产品
支持添加任何 AI 产品订阅，灵活配置计费周期和价格。

## 💱 支持的货币

支持 20+ 种主流货币，包括：
- 🇨🇳 CNY (人民币)
- 🇺🇸 USD (美元)
- 🇪🇺 EUR (欧元)
- 🇬🇧 GBP (英镑)
- 🇯🇵 JPY (日元)
- 更多...

## 🔧 配置说明

### 更换 Logo
1. 准备一张 PNG 格式的 logo 图片（推荐 128x128px）
2. 上传到 `assets/images/logo.png`
3. 系统会自动在登录页和导航栏使用新 logo

### 自定义主题
编辑 `index.html` 中的 Tailwind 配置，可自定义颜色主题。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议开源，详见 [LICENSE](LICENSE) 文件。

## 🎯 开发历程

本项目使用 [GenSpark AI 开发者](https://www.genspark.ai/) 协助开发。

查看完整开发对话记录：[GenSpark AI 开发对话](https://www.genspark.ai/agents?id=ec827c0d-2366-4152-8f4b-ce9146e5e50a)

## 👥 作者信息

- **作者**: Ivor-NCUT
- **GitHub**: [https://github.com/Ivor-NCUT](https://github.com/Ivor-NCUT)
- **微信**: FH01xy（了解更多 AI 产品、行业知识和工作机会）

## 🌟 Star History

如果这个项目对您有帮助，请给个 Star ⭐️ 支持一下！

---

<div align="center">
  <p>Made with ❤️ by Ivor-NCUT</p>
  <p>Powered by GenSpark AI</p>
</div>