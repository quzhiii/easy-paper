# Vercel 部署指南 | Vercel Deployment Guide

[中文](#中文) | [English](#english)

---

## <a id="中文"></a>🚀 中文版

### 问题说明

SciNavi AI使用浏览器直接调用LLM API，但部分服务商（如Gemini）存在CORS（跨域资源共享）限制，导致在Vercel等平台部署后无法正常工作。

### 解决方案

本项目已集成 **Vercel Serverless Functions** 作为API代理，自动绕过CORS限制。

---

### 📦 快速部署步骤

#### 1. 安装依赖

```bash
npm install
```

新增的依赖：
- `@vercel/node` - Vercel Serverless Functions类型定义

#### 2. 部署到Vercel

**方式A：通过GitHub自动部署（推荐）**

1. 将代码推送到GitHub仓库
2. 访问 https://vercel.com
3. 点击 "Import Project"
4. 选择你的GitHub仓库
5. Vercel会自动检测Vite项目并配置构建设置
6. 点击 "Deploy"

**方式B：使用Vercel CLI**

```bash
# 安装Vercel CLI
npm i -g vercel

# 登录Vercel
vercel login

# 部署
vercel --prod
```

#### 3. 配置说明

项目已包含以下配置文件：

**`vercel.json`** - Vercel平台配置
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [...]
}
```

**`api/llm-proxy.ts`** - Serverless Function代理
- 自动处理所有LLM API请求
- 支持Qwen、Kimi、DeepSeek、Zhipu、OpenAI、Gemini
- 无需额外配置

---

### 🔧 工作原理

#### 开发环境（localhost）
```
浏览器 → 直接调用 → LLM API
```

#### 生产环境（Vercel）
```
浏览器 → /api/llm-proxy → Vercel Serverless Function → LLM API
```

代码会自动检测环境并选择合适的调用方式：
- **Gemini**: 始终使用代理（CORS限制）
- **其他服务商**: 生产环境使用代理，开发环境直接调用

---

### ✅ 验证部署

部署完成后：

1. 访问您的Vercel域名（如 `https://your-app.vercel.app`）
2. 点击右上角 "API Key" 按钮
3. 选择任意服务商（推荐：Qwen、Kimi、DeepSeek）
4. 输入API Key
5. 测试评估功能

如果仍然遇到错误：
1. 检查浏览器控制台（F12）
2. 查看 [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. 在GitHub提Issue

---

### 🌐 推荐服务商配置

| 服务商 | 优点 | 获取API Key |
|--------|------|------------|
| **通义千问 (Qwen)** | 阿里云，国内最稳定 | https://dashscope.aliyun.com/ |
| **Kimi** | 月之暗面，用户体验好 | https://platform.moonshot.cn/ |
| **DeepSeek** | 深度求索，性价比高 | https://platform.deepseek.com/ |
| **智谱 GLM** | 清华系，功能丰富 | https://open.bigmodel.cn/ |
| OpenAI | GPT系列，效果最好 | https://platform.openai.com/ |
| Gemini | Google，需代理 | https://ai.google.dev/ |

---

### 📝 环境变量（可选）

如需在Vercel Dashboard配置环境变量：

1. 进入项目设置 → Environment Variables
2. 添加变量（如果需要服务端统一配置API Key）:

```
QWEN_API_KEY=sk-xxx
KIMI_API_KEY=sk-xxx
DEEPSEEK_API_KEY=sk-xxx
```

**注意**：当前版本使用客户端存储API Key，无需服务端环境变量。

---

### 🐛 常见部署问题

#### 问题1：部署后出现404错误
**解决**：确保 `vercel.json` 文件存在且格式正确

#### 问题2：API代理不工作
**解决**：
1. 检查 `api/llm-proxy.ts` 文件是否存在
2. 查看Vercel Functions日志：Dashboard → Deployments → 选择部署 → Functions

#### 问题3：构建失败
**解决**：
```bash
# 本地测试构建
npm run build

# 如果成功，删除 .vercel 文件夹重新部署
rm -rf .vercel
vercel --prod
```

---

### 📚 更多资源

- **Vercel文档**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **项目仓库**: https://github.com/quzhiii/easy-paper

---

---

## <a id="english"></a>🚀 English Version

### Problem Description

SciNavi AI calls LLM APIs directly from the browser, but some providers (like Gemini) have CORS (Cross-Origin Resource Sharing) restrictions that prevent the app from working when deployed on platforms like Vercel.

### Solution

This project integrates **Vercel Serverless Functions** as an API proxy to automatically bypass CORS restrictions.

---

### 📦 Quick Deployment Steps

#### 1. Install Dependencies

```bash
npm install
```

New dependency:
- `@vercel/node` - Type definitions for Vercel Serverless Functions

#### 2. Deploy to Vercel

**Method A: GitHub Auto-Deployment (Recommended)**

1. Push code to GitHub repository
2. Visit https://vercel.com
3. Click "Import Project"
4. Select your GitHub repository
5. Vercel will auto-detect Vite project and configure build settings
6. Click "Deploy"

**Method B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 3. Configuration

The project includes these configuration files:

**`vercel.json`** - Vercel platform configuration
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [...]
}
```

**`api/llm-proxy.ts`** - Serverless Function proxy
- Automatically handles all LLM API requests
- Supports Qwen, Kimi, DeepSeek, Zhipu, OpenAI, Gemini
- No additional configuration needed

---

### 🔧 How It Works

#### Development Environment (localhost)
```
Browser → Direct Call → LLM API
```

#### Production Environment (Vercel)
```
Browser → /api/llm-proxy → Vercel Serverless Function → LLM API
```

The code automatically detects the environment and chooses the appropriate method:
- **Gemini**: Always uses proxy (CORS restriction)
- **Other Providers**: Uses proxy in production, direct call in development

---

### ✅ Verify Deployment

After deployment:

1. Visit your Vercel domain (e.g., `https://your-app.vercel.app`)
2. Click "API Key" button in top-right corner
3. Select any provider (Recommended: Qwen, Kimi, DeepSeek)
4. Enter API Key
5. Test the evaluation function

If you still encounter errors:
1. Check browser console (F12)
2. Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Submit an Issue on GitHub

---

### 🌐 Recommended Provider Configuration

| Provider | Advantages | Get API Key |
|----------|-----------|-------------|
| **Qwen** | Alibaba Cloud, most stable in China | https://dashscope.aliyun.com/ |
| **Kimi** | Moonshot AI, great UX | https://platform.moonshot.cn/ |
| **DeepSeek** | Cost-effective | https://platform.deepseek.com/ |
| **Zhipu GLM** | Tsinghua, feature-rich | https://open.bigmodel.cn/ |
| OpenAI | GPT series, best quality | https://platform.openai.com/ |
| Gemini | Google, requires proxy | https://ai.google.dev/ |

---

### 📝 Environment Variables (Optional)

To configure environment variables in Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add variables (if you want server-side API key configuration):

```
QWEN_API_KEY=sk-xxx
KIMI_API_KEY=sk-xxx
DEEPSEEK_API_KEY=sk-xxx
```

**Note**: Current version uses client-side API key storage, server-side env vars not required.

---

### 🐛 Common Deployment Issues

#### Issue 1: 404 Error After Deployment
**Solution**: Ensure `vercel.json` exists and is properly formatted

#### Issue 2: API Proxy Not Working
**Solution**:
1. Check if `api/llm-proxy.ts` file exists
2. View Vercel Functions logs: Dashboard → Deployments → Select deployment → Functions

#### Issue 3: Build Failed
**Solution**:
```bash
# Test build locally
npm run build

# If successful, delete .vercel folder and redeploy
rm -rf .vercel
vercel --prod
```

---

### 📚 More Resources

- **Vercel Docs**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **Project Repository**: https://github.com/quzhiii/easy-paper

---

<div align="center">

**Happy Deploying! 🎉**

</div>
