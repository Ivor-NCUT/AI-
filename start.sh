#!/bin/bash

# AI产品订阅管理系统启动脚本

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        AI产品订阅管理系统 - 启动脚本                         ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"
echo ""

# 检查Python是否安装（备选方案）
if command -v python3 &> /dev/null; then
    echo "✅ Python3 已安装: $(python3 --version)"
    USE_PYTHON=true
else
    USE_PYTHON=false
fi

echo ""
echo "请选择启动方式:"
echo "1) 使用 Node.js 服务器 (推荐)"
if [ "$USE_PYTHON" = true ]; then
    echo "2) 使用 Python 服务器"
fi
echo "3) 直接打开文件 (无服务器)"
echo ""

read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 正在启动 Node.js 服务器..."
        node server.js
        ;;
    2)
        if [ "$USE_PYTHON" = true ]; then
            echo ""
            echo "🚀 正在启动 Python 服务器..."
            python3 -m http.server 8080
        else
            echo "❌ Python 未安装"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "📂 正在打开文件..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            open index.html
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            xdg-open index.html 2>/dev/null || echo "请手动打开 index.html 文件"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
            # Windows
            start index.html
        else
            echo "请手动打开 index.html 文件"
        fi
        ;;
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac