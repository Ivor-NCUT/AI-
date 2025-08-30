# 🗓️ 管订 NoSam - AI 产品订阅管理工具

<div align="center">
  <img src="assets/images/管订NoSam 产品图标.png" alt="管订 NoSam Logo" width="128" height="128" />
  <h3>优雅地管理你的 AI 订阅</h3>
  <p>告别订阅混乱，掌控 AI 支出</p>
</div>

## 📖 项目简介

**管订 NoSam** 是一款专门为管理 AI 产品订阅而设计的工具。

### 为什么叫 NoSam？

这个名字背后有一个有趣的故事：作者曾经被 ChatGPT 意外扣费，因此萌生了开发一个订阅管理工具的想法。"NoSam" 寓意当 Sam Altman（OpenAI CEO）来找你续费时，你可以清楚地知道自己的订阅情况，理性地说"No"。

- **管订**：简洁明了，管理你的订阅
- **NoSam**：掌控订阅自主权的幽默表达

## ✨ 核心功能

### 📊 仪表盘统计
- **总订阅数** - 快速了解订阅产品数量
- **月度费用** - 每月 AI 产品总支出
- **年度费用** - 预估年度总花费
- **平均单价** - 单个订阅平均成本

### 💼 订阅管理
- ✅ 添加/编辑/删除订阅
- 🔍 快速搜索订阅
- 📅 查看到期时间
- 🔄 自动续费标记
- 🏷️ 自定义产品支持

### 💱 多币种支持
支持 20+ 种货币实时转换：
- 人民币 (CNY)
- 美元 (USD)
- 欧元 (EUR)
- 英镑 (GBP)
- 日元 (JPY)
- 韩元 (KRW)
- 港币 (HKD)
- 更多...

### 🎨 界面特色
- 🌊 清新的青绿渐变设计
- 🎯 圆润的卡片式布局
- 🌓 深色/浅色主题切换
- 📱 完美的移动端适配
- ✨ 流畅的动画效果

## 🚀 快速开始

### 在线体验

默认账号：
- 用户名：`admin`
- 密码：`123456`

> 💡 新用户输入任意用户名密码即可自动注册

### 本地部署

1. **克隆仓库**
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
# 开发模式
npm start

# 使用 PM2（推荐）
pm2 start ecosystem.config.js
```

4. **访问系统**
```
http://localhost:8080
```

## 🛠️ 技术架构

### 前端技术
- **React 18** - 用户界面框架
- **Tailwind CSS** - 原子化 CSS 框架
- **Babel Standalone** - JSX 实时编译

### 后端技术
- **Node.js** - 服务器环境
- **PM2** - 进程管理工具
- **LocalStorage** - 本地数据存储

### 开发工具
- **Git** - 版本控制
- **GitHub** - 代码托管
- **GenSpark AI** - AI 辅助开发

## 📱 支持的 AI 产品

### 国际产品
- ChatGPT Plus / Team / Enterprise
- Claude Pro / Team
- GitHub Copilot
- Midjourney
- Perplexity Pro
- Poe Premium
- Notion AI
- Jasper AI

### 国内产品
- 文心一言
- 通义千问
- Kimi+
- 讯飞星火
- 智谱清言

### 自定义产品
支持添加任何 AI 产品，灵活配置：
- 产品名称
- 订阅套餐
- 计费周期（月/年）
- 价格和币种
- 用户数量

## 🎯 使用场景

- **个人用户** - 管理个人 AI 工具订阅
- **创业团队** - 统计团队 AI 工具成本
- **企业部门** - 管控部门 AI 预算
- **自由职业者** - 优化 AI 工具组合

## 🔧 自定义配置

### 更换 Logo
1. 准备 logo 图片（PNG 格式，建议 128x128px）
2. 上传至 `assets/images/logo.png`
3. 刷新页面即可看到新 logo

### 修改主题色
编辑 `index.html` 中的 Tailwind 配置：
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // 自定义颜色
      }
    }
  }
}
```

## 🤝 参与贡献

欢迎各种形式的贡献！

### 如何贡献
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m '添加某个很棒的功能'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 贡献方向
- 🐛 修复 Bug
- ✨ 新增功能
- 📝 完善文档
- 🌐 添加国际化
- 🎨 优化界面
- ⚡ 性能优化

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源。

## 🎯 开发故事

本项目使用 [GenSpark AI 开发者](https://www.genspark.ai/) 辅助开发，从构思到实现的全过程都有 AI 的参与。

📖 **查看完整开发对话**：[GenSpark AI 开发全过程](https://www.genspark.ai/agents?id=ec827c0d-2366-4152-8f4b-ce9146e5e50a)

## 👨‍💻 关于作者

- **GitHub**: [Ivor-NCUT](https://github.com/Ivor-NCUT)
- **微信**: FH01xy
- **交流内容**: 
  - AI 产品使用经验
  - AI 行业发展趋势
  - AI 相关工作机会

## 🌟 支持项目

如果这个项目对你有帮助：
- ⭐ 给个 Star 支持一下
- 🐛 提交 Issue 反馈问题
- 💡 贡献代码或建议
- 📣 分享给需要的朋友

## 📈 项目统计

![GitHub stars](https://img.shields.io/github/stars/Ivor-NCUT/AI-?style=social)
![GitHub forks](https://img.shields.io/github/forks/Ivor-NCUT/AI-?style=social)
![GitHub issues](https://img.shields.io/github/issues/Ivor-NCUT/AI-)
![GitHub license](https://img.shields.io/github/license/Ivor-NCUT/AI-)

---

<div align="center">
  <p>用 ❤️ 制作 by Ivor-NCUT</p>
  <p>由 GenSpark AI 提供技术支持</p>
  <p>
    <a href="README.md">English</a> | 
    <strong>简体中文</strong>
  </p>
</div>