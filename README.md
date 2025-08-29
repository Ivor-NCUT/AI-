# AI产品订阅管理系统

一个现代化的企业级AI产品订阅管理系统，支持多种计费模式和用户管理功能。

## 🚀 功能特性

- **用户认证系统**：支持用户登录、注册和权限管理
- **订阅管理**：支持添加、编辑、删除AI产品订阅
- **多种计费模式**：支持月付制和年付制
- **用户管理**：支持多用户数量配置
- **数据统计**：实时显示订阅统计信息
- **响应式设计**：支持桌面端和移动端
- **主题切换**：支持明暗主题切换
- **数据持久化**：基于Trickle平台的数据存储

## 🛠️ 技术栈

- **前端框架**：React 18
- **样式框架**：Tailwind CSS
- **图标库**：Lucide Icons
- **数据存储**：Trickle Platform API
- **构建工具**：Babel Standalone
- **部署**：静态文件部署

## 📁 项目结构

```
AI产品订阅管理系统/
├── index.html              # 主页面
├── login.html              # 登录页面
├── app.js                  # 主应用逻辑
├── login-app.js            # 登录应用逻辑
├── components/             # React组件
│   ├── Header.js           # 头部组件
│   ├── SubscriptionCard.js # 订阅卡片组件
│   ├── AddSubscriptionModal.js # 添加订阅模态框
│   ├── StatsCard.js        # 统计卡片组件
│   └── LoginForm.js        # 登录表单组件
├── utils/                  # 工具函数
│   ├── auth.js             # 认证相关函数
│   └── calculations.js     # 计算相关函数
└── trickle/                # Trickle平台配置
    ├── notes/
    └── rules/
```

## 🚀 快速开始

### 环境要求

- 现代浏览器（支持ES6+）
- 网络连接（用于加载CDN资源）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/Ivor-NCUT/AI-.git
   cd AI-
   ```

2. **启动本地服务器**
   ```bash
   # 使用Python启动简单HTTP服务器
   python -m http.server 8000
   
   # 或使用Node.js的http-server
   npx http-server -p 8000
   ```

3. **访问应用**
   - 主应用：http://localhost:8000/index.html
   - 登录页面：http://localhost:8000/login.html

### 默认账户

系统提供以下默认测试账户：

- **管理员账户**
  - 用户名：`admin`
  - 密码：`123456`
  - 角色：管理员

- **普通用户账户**
  - 用户名：`user1`
  - 密码：`password`
  - 角色：普通用户

## 📖 使用说明

### 登录系统

1. 访问登录页面
2. 输入用户名和密码
3. 点击登录按钮
4. 登录成功后自动跳转到主页面

### 管理订阅

1. **添加订阅**
   - 点击"添加订阅"按钮
   - 填写产品信息（名称、计划、计费周期等）
   - 点击保存

2. **查看订阅**
   - 主页面显示所有订阅卡片
   - 每个卡片显示详细的订阅信息
   - 包括费用计算和剩余天数

3. **删除订阅**
   - 点击订阅卡片右上角的删除按钮
   - 确认删除操作

### 数据统计

- 总订阅数量
- 月度总费用
- 年度总费用
- 平均每用户成本

## 🎨 主题定制

系统支持明暗主题切换，主题变量定义在CSS中：

```css
:root {
  --primary-color: #10b981;
  --secondary-color: #059669;
  --accent-color: #34d399;
  /* 更多主题变量... */
}
```

## 🔧 配置说明

### Trickle平台配置

项目使用Trickle平台进行数据存储，相关配置文件位于`trickle/`目录下。

### 自定义配置

- 修改`utils/auth.js`中的默认用户信息
- 调整`components/`中的组件样式
- 更新主题变量以匹配品牌色彩

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-20)
- 初始版本发布
- 基础订阅管理功能
- 用户认证系统
- 响应式界面设计

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者：Ivor-NCUT
- GitHub：https://github.com/Ivor-NCUT
- 项目地址：https://github.com/Ivor-NCUT/AI-

## 🙏 致谢

感谢以下开源项目的支持：

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Trickle Platform](https://trickle.so/)

---

⭐ 如果这个项目对你有帮助，请给它一个星标！