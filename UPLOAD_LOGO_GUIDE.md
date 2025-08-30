# 📦 如何上传您的 Logo 图标

## 上传位置
请将您的 logo 图片上传到：`/home/user/webapp/assets/images/logo.png`

## 上传方法

### 方法 1：通过命令行（如果您有图片URL）
```bash
cd /home/user/webapp/assets/images
wget -O logo.png "您的图片URL"
```

### 方法 2：Base64 编码
如果您的图片是 base64 格式，我可以帮您转换并保存。

### 方法 3：直接复制文件
如果您有本地文件，可以直接复制到 `assets/images` 目录。

## 图片要求
- **格式**: PNG (推荐) 或 SVG
- **尺寸**: 
  - 最小: 48x48px
  - 推荐: 96x96px 或 128x128px
  - 最大: 256x256px
- **背景**: 透明背景最佳
- **文件名**: `logo.png`

## 已配置的使用位置
1. **登录页面** - 大图标显示（96x96px）
2. **导航栏** - 小图标显示（40x40px）

## 验证上传
上传后，访问以下URL验证图片是否可访问：
`https://[您的域名]/assets/images/logo.png`

## 备用方案
如果图片加载失败，系统会自动显示默认的 SVG 图标。

## 需要帮助？
如果您提供图片的 base64 编码或 URL，我可以帮您直接保存到正确位置。