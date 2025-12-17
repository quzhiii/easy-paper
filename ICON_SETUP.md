## 添加LLM服务商图标指南

### 图标文件放置位置

请将以下图标文件放入 `assets/` 目录：

1. `openai.png` - OpenAI logo (黑白编织图案)
2. `qwen.png` - 通义千问 logo (蓝色六边形)
3. `deepseek.png` - DeepSeek logo (蓝色鲸鱼)
4. `kimi.png` - Kimi logo (黑色K字)
5. `zhipu.png` - 智谱 logo (黑色Z字)
6. `gemini.png` - Gemini logo (彩色星星)

### 修改代码使用图片

在 `components/SettingsModal.tsx` 中，将 icon 字段改为图片路径：

```typescript
// 在文件顶部添加导入
import qwenIcon from '../assets/qwen.png';
import kimiIcon from '../assets/kimi.png';
import deepseekIcon from '../assets/deepseek.png';
import zhipuIcon from '../assets/zhipu.png';
import openaiIcon from '../assets/openai.png';
import geminiIcon from '../assets/gemini.png';

// 修改 providers 数组
const providers: { id: LLMProviderId; name: string; icon: string; iconType?: 'emoji' | 'image'; recommended?: boolean; warning?: string }[] = [
    { id: 'qwen', name: 'Qwen (通义千问)', icon: qwenIcon, iconType: 'image', recommended: true },
    { id: 'kimi', name: 'Kimi (月之暗面)', icon: kimiIcon, iconType: 'image', recommended: true },
    { id: 'deepseek', name: 'DeepSeek', icon: deepseekIcon, iconType: 'image', recommended: true },
    { id: 'zhipu', name: 'Zhipu GLM (智谱)', icon: zhipuIcon, iconType: 'image' },
    { id: 'openai', name: 'OpenAI (GPT)', icon: openaiIcon, iconType: 'image' },
    { id: 'gemini', name: 'Gemini (Google)', icon: geminiIcon, iconType: 'image', warning: '...' },
];
```

然后在渲染时检查 iconType，如果是 'image' 则使用 `<img>` 标签：

```tsx
{provider.iconType === 'image' ? (
    <img src={provider.icon} alt={provider.name} className="w-8 h-8 object-contain" />
) : (
    <span className="text-2xl">{provider.icon}</span>
)}
```
