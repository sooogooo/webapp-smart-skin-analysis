# 🚀 SmartSkinAnalysis 部署指南

本指南将详细介绍如何部署SmartSkinAnalysis应用到各种平台。

## 📋 部署前准备

### 1. 环境要求
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 或 **yarn** >= 1.22.0
- **Google Gemini API Key** (从 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取)

### 2. 项目构建
```bash
# 克隆项目
git clone https://github.com/your-username/SmartSkinAnalysis.git
cd SmartSkinAnalysis

# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，`dist/` 目录包含所有部署所需的静态文件。

---

## 🌐 Vercel 部署（推荐）

Vercel是部署React应用的最佳选择，提供零配置部署和自动HTTPS。

### 方法一：通过GitHub自动部署

1. **Fork项目到GitHub**
   - 访问项目仓库并点击"Fork"
   - 将项目fork到你的GitHub账户

2. **连接Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账户登录
   - 点击"New Project"

3. **导入项目**
   - 选择你fork的SmartSkinAnalysis仓库
   - 点击"Import"

4. **配置环境变量**
   ```
   GEMINI_API_KEY = your_gemini_api_key_here
   ```

5. **部署**
   - 点击"Deploy"
   - 等待构建完成（通常1-3分钟）

### 方法二：通过CLI部署

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署项目
vercel

# 设置环境变量
vercel env add GEMINI_API_KEY
```

### Vercel配置文件（可选）

创建 `vercel.json` 文件：
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

---

## 🚀 Netlify 部署

Netlify提供出色的静态站点托管服务，支持自动部署和表单处理。

### 方法一：拖拽部署

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传到Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 将 `dist` 文件夹拖拽到部署区域

3. **配置环境变量**
   - 进入Site settings → Environment variables
   - 添加：`GEMINI_API_KEY = your_api_key_here`

### 方法二：Git自动部署

1. **连接Git仓库**
   - 在Netlify中点击"New site from Git"
   - 选择你的GitHub仓库

2. **构建设置**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **环境变量配置**
   ```
   GEMINI_API_KEY = your_gemini_api_key_here
   ```

### Netlify配置文件

创建 `netlify.toml` 文件：
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## ☁️ 阿里云OSS部署

适合中国用户的高性价比部署方案。

### 1. 准备OSS Bucket

```bash
# 创建Bucket（通过阿里云控制台或CLI）
# 设置为静态网站托管
# 配置自定义域名（可选）
```

### 2. 构建并上传

```bash
# 构建项目
npm run build

# 安装阿里云CLI工具
npm install -g @alicloud/cli

# 配置访问密钥
aliyun configure

# 上传文件
aliyun oss cp dist/ oss://your-bucket-name/ --recursive
```

### 3. 配置静态网站

在OSS控制台中：
- 开启静态网站托管
- 设置默认首页：`index.html`
- 设置404页面：`index.html`

---

## 🐳 Docker 部署

适合需要容器化部署的场景。

### Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # 处理SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### Docker构建和运行

```bash
# 构建镜像
docker build -t smartskinanalysis .

# 运行容器
docker run -d -p 80:80 \
  -e GEMINI_API_KEY=your_api_key_here \
  smartskinanalysis
```

### Docker Compose

创建 `docker-compose.yml`：
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
```

---

## 🖥️ 传统服务器部署

适合使用自己服务器的场景。

### Apache配置

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/smartskinanalysis

    # 处理SPA路由
    <Directory /var/www/smartskinanalysis>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # 缓存静态资源
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </LocationMatch>
</VirtualHost>
```

### Nginx配置

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/smartskinanalysis;
    index index.html;

    # 处理SPA路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

---

## 📱 PWA配置

让应用支持离线使用和安装到设备。

### Service Worker（已包含在构建中）

构建过程会自动生成Service Worker，支持：
- 静态资源缓存
- 离线访问
- 应用更新通知

### 自定义配置

在 `public/manifest.json` 中配置PWA属性：
```json
{
  "name": "SmartSkinAnalysis",
  "short_name": "皮肤诊断",
  "description": "AI智能皮肤诊断助手",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔧 环境变量配置

### 生产环境变量

```env
# 必需变量
GEMINI_API_KEY=your_gemini_api_key_here

# 可选变量
NODE_ENV=production
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=SmartSkinAnalysis

# 分析工具（可选）
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 平台特定配置

**Vercel:**
```bash
vercel env add GEMINI_API_KEY production
```

**Netlify:**
```bash
netlify env:set GEMINI_API_KEY your_api_key_here
```

**Docker:**
```bash
docker run -e GEMINI_API_KEY=your_key app
```

---

## 🚨 部署后检查

### 1. 功能测试
- [ ] 首页正常加载
- [ ] 诊断表单可以提交
- [ ] 图片上传功能正常
- [ ] AI诊断生成正常
- [ ] 主题切换功能正常
- [ ] 移动端适配正常

### 2. 性能测试
```bash
# 使用Lighthouse进行性能测试
npm install -g lighthouse
lighthouse https://your-deployed-url.com
```

### 3. 安全检查
- [ ] HTTPS配置正确
- [ ] 安全头设置正确
- [ ] API密钥未暴露
- [ ] CSP策略配置

### 4. 监控设置
- 设置正常运行时间监控
- 配置错误日志收集
- 启用性能监控

---

## 🆘 常见问题

### 1. 构建失败
```bash
# 清除缓存重新构建
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 2. API密钥问题
- 确保环境变量名称正确：`GEMINI_API_KEY`
- 检查API密钥是否有效
- 验证API配额和限制

### 3. 路由问题
确保服务器配置了SPA路由回退到 `index.html`

### 4. 静态资源404
检查构建输出路径和服务器配置路径是否一致

---

## 📞 部署支持

如果在部署过程中遇到问题：

- 📧 **邮件支持**: yuxiaodong@beaucare.org
- 📝 **GitHub Issues**: [提交问题](https://github.com/your-username/SmartSkinAnalysis/issues)
- 💬 **讨论区**: [GitHub Discussions](https://github.com/your-username/SmartSkinAnalysis/discussions)

---

*部署成功后，记得测试所有核心功能确保正常运行！🎉*