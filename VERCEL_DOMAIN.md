# Vercel域名配置指南

## 📝 将Vercel域名改为项目名（easy-paper）

### 方法1：在Vercel Dashboard配置（推荐）

1. **登录Vercel**：https://vercel.com/dashboard

2. **进入项目设置**：
   - 点击您的项目（当前名称：`traegb0c2a25`）
   - 点击顶部的 "Settings" 标签

3. **修改项目名称**：
   - 在左侧菜单选择 "General"
   - 找到 "Project Name" 部分
   - 将名称改为：`easy-paper`
   - 点击 "Save"

4. **配置域名**：
   - 在左侧菜单选择 "Domains"
   - 您会看到自动生成的域名：`easy-paper.vercel.app`
   - 可以选择设置为主域名

5. **（可选）删除旧域名**：
   - 在 Domains 页面找到 `traegb0c2a25.vercel.app`
   - 点击右侧的 "..." 菜单
   - 选择 "Remove"

### 方法2：通过Vercel CLI

```bash
# 安装Vercel CLI（如果尚未安装）
npm i -g vercel

# 登录
vercel login

# 在项目目录运行（会自动检测并更新）
cd "e:\BaiduSyncdisk\koni电脑\创业\科研小工具\scinavi-ai (1)"
vercel --prod

# 在提示时选择：
# ? What's your project name? easy-paper
# ? In which directory is your code located? ./
```

### 方法3：通过vercel.json配置

在 `vercel.json` 中添加项目名称：

```json
{
  "name": "easy-paper",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [...]
}
```

然后重新部署：
```bash
git add vercel.json
git commit -m "chore: Set Vercel project name to easy-paper"
git push origin main
```

Vercel会自动检测配置并更新。

---

## 🌐 配置后的访问地址

配置完成后，您的应用将可通过以下地址访问：

- **主域名**：https://easy-paper.vercel.app
- **GitHub仓库**：https://github.com/quzhiii/easy-paper

---

## ⚠️ 注意事项

1. **域名唯一性**：如果 `easy-paper` 已被其他Vercel用户使用，需要选择其他名称，如：
   - `scinavi-ai`
   - `easy-paper-ai`
   - `research-copilot`

2. **DNS传播时间**：域名更改后可能需要5-10分钟生效

3. **旧域名重定向**：旧域名（`traegb0c2a25.vercel.app`）会自动重定向到新域名

---

## 📸 操作截图参考

### Step 1: 进入项目设置
```
Vercel Dashboard > 选择项目 > Settings
```

### Step 2: 修改项目名称
```
Settings > General > Project Name
[输入框] easy-paper
[按钮] Save
```

### Step 3: 配置域名
```
Settings > Domains
[显示] easy-paper.vercel.app (Production)
[可选] 点击 "Set as Primary" 设为主域名
```

---

## ✅ 验证配置成功

配置完成后，访问：https://easy-paper.vercel.app

如果能正常打开应用，说明配置成功！

---

## 🆘 常见问题

### Q: 域名已被占用怎么办？
A: 尝试以下备选名称：
- `scinavi-ai-app`
- `easy-paper-research`
- `sci-design-copilot`

### Q: 旧域名还能用吗？
A: 可以，旧域名会自动重定向到新域名

### Q: 可以使用自定义域名吗？
A: 可以！在 Domains 设置中添加您自己的域名（如 `www.yourdomain.com`）

---

## 📝 更新README中的链接

域名配置成功后，README中的链接已自动更新为：

```markdown
### 🌐 Try It Now

**[🚀 Launch App on Vercel](https://easy-paper.vercel.app)** | **[📦 View on GitHub](https://github.com/quzhiii/easy-paper)**
```

用户可以直接点击访问！
