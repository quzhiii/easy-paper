# 故障排除指南 | Troubleshooting Guide

[中文](#中文) | [English](#english)

---

## <a id="中文"></a>🔧 中文版

### 常见问题

#### 1. ❌ CORS 错误 / 网络连接失败（Status 0）

**错误提示示例：**
```
Connection Failed (Status 0): Likely a CORS issue, proxy issue, or network timeout.
Network Error: Could not connect to API. Check your internet connection or CORS settings.
```

**原因：**
浏览器的同源策略（CORS）限制了前端应用直接调用第三方API。这是浏览器的安全机制，不是代码bug。

**解决方案：**

##### 方案 A：使用国内API服务商（推荐）✅
使用不受CORS限制或有更好支持的服务商：
- **通义千问 (Qwen)** - 阿里云，国内稳定
- **Kimi (Moonshot)** - 月之暗面，体验优秀
- **DeepSeek** - 深度求索，性价比高
- **智谱 GLM** - 清华系，功能完善

**配置步骤：**
1. 点击右上角"API Key"按钮
2. 选择上述任一服务商
3. 输入对应的API Key
4. 保存并重试

##### 方案 B：使用开发代理（开发者）
在 `vite.config.ts` 中添加代理配置：

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/gemini': {
            target: 'https://generativelanguage.googleapis.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/gemini/, '')
          },
          '/api/openai': {
            target: 'https://api.openai.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/openai/, '')
          }
        }
      },
      plugins: [react()],
      // ... rest of config
    };
});
```

然后在 Settings 中将 Base URL 改为 `http://localhost:3000/api/gemini` 或 `/api/openai`。

##### 方案 C：部署后端服务（生产环境）
创建一个简单的后端代理服务：

**Node.js + Express 示例：**
```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/llm', async (req, res) => {
  const { provider, apiKey, model, messages, baseUrl } = req.body;
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.1 })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

---

#### 2. 🔑 API Key 无效

**错误提示：**
```
API Key Error: API_KEY_INVALID
Invalid or Missing API Key
```

**解决方案：**
1. 检查API Key是否完整复制（没有多余空格）
2. 确认API Key对应的服务商是否正确
3. 检查API Key是否已过期或被禁用
4. 验证账户余额是否充足

**获取API Key：**
- **通义千问**: https://dashscope.aliyun.com/
- **Kimi**: https://platform.moonshot.cn/
- **DeepSeek**: https://platform.deepseek.com/
- **智谱**: https://open.bigmodel.cn/
- **OpenAI**: https://platform.openai.com/
- **Gemini**: https://ai.google.dev/

---

#### 3. 📄 文件上传失败

**问题：** 上传的RIS/BibTeX文件未被正确解析

**解决方案：**
1. 确认文件格式正确：
   - RIS 文件应包含 `TI  -` (标题) 和 `ER  -` (记录结束) 标记
   - BibTeX 文件应以 `@article{` 或 `@inproceedings{` 开头
   - EndNote 文件应包含 `%T` (标题) 标记

2. 检查文件编码为 UTF-8

3. 尝试重新从数据库导出文件

---

#### 4. ⚡ 评估速度慢

**原因：** 
- 大语言模型生成内容需要时间（通常30-90秒）
- 网络延迟
- 模型负载高

**优化建议：**
1. 使用更快的模型（如 Qwen-Turbo、GPT-4o-mini）
2. 减少文献追溯年限（默认5年可调低到3年）
3. 使用国内服务商减少网络延迟

---

#### 5. 🧪 生成的方法学不准确

**注意：** SciNavi AI是辅助工具，生成的内容需要人工审核和验证。

**改进建议：**
1. 提供更详细的数据描述（变量名、数据类型、时间跨度）
2. 上传相关领域的参考文献以提高准确性
3. 在"候选选题"中明确干预(I)、对照(C)、结局(O)
4. 尝试不同的LLM服务商，对比结果

---

### 技术支持

如果以上方案都无法解决问题：

1. **查看浏览器控制台**：按 F12 查看详细错误信息
2. **提交Issue**：https://github.com/quzhiii/easy-paper/issues
3. **包含以下信息**：
   - 使用的LLM服务商
   - 完整的错误信息截图
   - 浏览器类型和版本
   - 操作系统

---

---

## <a id="english"></a>🔧 English Version

### Common Issues

#### 1. ❌ CORS Error / Network Connection Failed (Status 0)

**Error Examples:**
```
Connection Failed (Status 0): Likely a CORS issue, proxy issue, or network timeout.
Network Error: Could not connect to API. Check your internet connection or CORS settings.
```

**Cause:**
Browser's Same-Origin Policy (CORS) prevents frontend apps from directly calling third-party APIs. This is a browser security mechanism, not a code bug.

**Solutions:**

##### Solution A: Use CORS-Friendly Providers (Recommended) ✅
Use providers with better CORS support:
- **Qwen** - Alibaba Cloud, stable in China
- **Kimi (Moonshot)** - Great user experience
- **DeepSeek** - Cost-effective
- **Zhipu GLM** - Feature-rich

**Configuration Steps:**
1. Click "API Key" button in top-right corner
2. Select one of the above providers
3. Enter the corresponding API Key
4. Save and retry

##### Solution B: Use Development Proxy (Developers)
Add proxy configuration in `vite.config.ts`:

```typescript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/gemini': {
            target: 'https://generativelanguage.googleapis.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/gemini/, '')
          },
          '/api/openai': {
            target: 'https://api.openai.com',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api\/openai/, '')
          }
        }
      },
      plugins: [react()],
      // ... rest of config
    };
});
```

Then change Base URL in Settings to `http://localhost:3000/api/gemini` or `/api/openai`.

##### Solution C: Deploy Backend Service (Production)
Create a simple backend proxy service:

**Node.js + Express Example:**
```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/llm', async (req, res) => {
  const { provider, apiKey, model, messages, baseUrl } = req.body;
  
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ model, messages, temperature: 0.1 })
    });
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy running on port 3001'));
```

---

#### 2. 🔑 Invalid API Key

**Error Messages:**
```
API Key Error: API_KEY_INVALID
Invalid or Missing API Key
```

**Solutions:**
1. Check if API Key is fully copied (no extra spaces)
2. Confirm API Key matches the selected provider
3. Check if API Key has expired or been disabled
4. Verify account balance is sufficient

**Get API Keys:**
- **Qwen**: https://dashscope.aliyun.com/
- **Kimi**: https://platform.moonshot.cn/
- **DeepSeek**: https://platform.deepseek.com/
- **Zhipu**: https://open.bigmodel.cn/
- **OpenAI**: https://platform.openai.com/
- **Gemini**: https://ai.google.dev/

---

#### 3. 📄 File Upload Failed

**Issue:** Uploaded RIS/BibTeX files not parsed correctly

**Solutions:**
1. Confirm file format:
   - RIS files should contain `TI  -` (title) and `ER  -` (end of record) markers
   - BibTeX files should start with `@article{` or `@inproceedings{`
   - EndNote files should contain `%T` (title) markers

2. Check file encoding is UTF-8

3. Try re-exporting from database

---

#### 4. ⚡ Slow Evaluation

**Causes:** 
- LLM content generation takes time (typically 30-90 seconds)
- Network latency
- High model load

**Optimization Tips:**
1. Use faster models (e.g., Qwen-Turbo, GPT-4o-mini)
2. Reduce literature timeframe (default 5 years → 3 years)
3. Use domestic providers to reduce network latency

---

#### 5. 🧪 Inaccurate Methodology

**Note:** SciNavi AI is an assistive tool. Generated content requires human review and validation.

**Improvement Suggestions:**
1. Provide more detailed data descriptions (variable names, data types, time span)
2. Upload relevant domain literature to improve accuracy
3. Clearly specify Intervention (I), Comparison (C), Outcome (O) in topic
4. Try different LLM providers and compare results

---

### Technical Support

If none of the above solutions work:

1. **Check Browser Console**: Press F12 to view detailed error messages
2. **Submit Issue**: https://github.com/quzhiii/easy-paper/issues
3. **Include the following information**:
   - LLM provider used
   - Full error message screenshot
   - Browser type and version
   - Operating system

---

## 📚 Additional Resources

- **Project Repository**: https://github.com/quzhiii/easy-paper
- **Documentation**: Check README.md for setup instructions
- **Community**: Join discussions in GitHub Issues

---

<div align="center">

**Made with ❤️ for Researchers**

</div>
