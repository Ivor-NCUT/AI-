const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 默认路径处理
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // 获取文件扩展名
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // 读取文件
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>404 - 页面未找到</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                  backdrop-filter: blur(10px);
                }
                h1 { font-size: 4rem; margin: 0; }
                p { font-size: 1.2rem; margin: 1rem 0; }
                a {
                  color: white;
                  text-decoration: none;
                  padding: 0.5rem 1rem;
                  background: rgba(255, 255, 255, 0.2);
                  border-radius: 5px;
                  display: inline-block;
                  margin-top: 1rem;
                  transition: background 0.3s;
                }
                a:hover {
                  background: rgba(255, 255, 255, 0.3);
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>404</h1>
                <p>页面未找到</p>
                <a href="/">返回首页</a>
              </div>
            </body>
          </html>
        `);
      } else {
        // 服务器错误
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>500 - 服务器错误</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 10px;
                  backdrop-filter: blur(10px);
                }
                h1 { font-size: 4rem; margin: 0; }
                p { font-size: 1.2rem; margin: 1rem 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>500</h1>
                <p>服务器错误</p>
                <p style="font-size: 0.9rem; opacity: 0.8;">${error.code}</p>
              </div>
            </body>
          </html>
        `);
      }
    } else {
      // 成功读取文件
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content, 'utf-8');
    }
  });
});

// 启动服务器
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     管订 NoSam - 开发服务器                                  ║
║                                                            ║
║     服务器运行在: http://localhost:${PORT}                     ║
║                                                            ║
║     主页面: http://localhost:${PORT}/index.html                ║
║     登录页: http://localhost:${PORT}/login.html                ║
║                                                            ║
║     按 Ctrl+C 停止服务器                                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});