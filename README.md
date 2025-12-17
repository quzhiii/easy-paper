<div align="center">

# 🧭 SciNavi AI | 科研智导

**AI-Powered Research Design Copilot**  
**智能科研选题与方法学评估系统**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff)](https://vitejs.dev/)

### 🌐 在线使用

Vercel: https://easypaper-gh0yhg4t8-quzhiiis-projects.vercel.app/

[🚀 立即使用]

GitHub Pages:https://quzhiii.github.io/easy-paper/

[English](#english) | [中文](#chinese) | [📖 Troubleshooting](TROUBLESHOOTING.md)

</div>

---

## <a id="chinese"></a>🌟 项目概述

**SciNavi AI** 是新一代 AI 驱动的科研设计助手，通过大语言模型为学术研究提供全方位的方法学指导。从选题论证到方法设计，从文献溯源到期刊匹配——一切由 AI 赋能。

### 🎯 核心功能

#### 1. **文献溯源与文献计量分析**
- **多数据库支持**：无缝对接 PubMed、Web of Science、CNKI、万方等
- **上传分析模式**：支持上传 RIS、BibTeX、EndNote、CSV 等格式文献导出文件
- **零幻觉保证**：严格证据溯源，透明引用追踪
- **⚠️ 重要提示**：
  - **推荐使用 Qwen（通义千问）/Kimi/DeepSeek** 进行文献上传分析，稳定可靠
  - **Gemini** 仅支持在线搜索模式，**不支持上传文件分析**

#### 2. **智能方法学导航器**
- **自动生成因果 DAG 图**：使用 Mermaid 语法可视化因果关系
- **识别策略设计**：自动生成双重差分(DiD)、工具变量(IV)、断点回归(RD)、倾向评分匹配(PSM)设计
- **PICO 框架分析**：结构化拆解人群、干预、对照、结局
- **估计量规范**：明确定义因果估计量(ATT/ATE)及分配机制

#### 3. **数据可行性评估**
- **智能变量检测**：自动扫描数据字典识别关键变量
- **面板数据就绪检查**：评估数据是否支持高级因果推断方法
- **缺失变量分析**：标记可能威胁内部效度的数据缺口

#### 4. **可重现代码生成**
- **Python 模板**：自动生成可执行的主识别策略代码
- **统计模型规范**：LaTeX 格式化模型方程，含聚类与固定效应
- **诊断清单**：全面稳健性检验(平行趋势、平衡性、安慰剂检验)

#### 5. **发表策略顾问**
- **期刊匹配**：基于研究设计和领域的 AI 推荐
- **风险评估**：识别潜在拒稿触发点
- **定位建议**：稿件框架和强调点的战略建议

#### 6. **多 LLM 引擎支持**
- **服务商选择**：Qwen、Kimi、DeepSeek、智谱(GLM)、OpenAI、Google Gemini
- **模型自定义**：选择特定模型(如 GPT-4o、Gemini 2.5 Flash、DeepSeek V3)
- **安全 API 管理**：密钥本地存储，不经过第三方服务器

---

## 🚀 快速开始

### 前置要求
- **Node.js** 18+ 和 npm/yarn/pnpm
- 支持的 LLM 服务商的 API 密钥(推荐 Qwen、Kimi 或 DeepSeek)

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/quzhiii/easy-paper.git
cd easy-paper

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

应用将在 `http://localhost:3000` 运行

### 配置说明

1. **启动应用**：浏览器打开 `http://localhost:3000`
2. **打开设置**：点击右上角 "API Key" 按钮
3. **选择服务商**：推荐选择 Qwen（通义千问）、Kimi 或 DeepSeek
4. **输入 API Key**：在对应字段粘贴您的 API 密钥
5. **保存**：点击 "保存配置"

> ⚠️ **重要**：API 密钥安全存储在浏览器本地，仅直接发送给所选服务商，不经过我们的服务器。

---

## 📖 使用指南

### 1. 研究主题输入

填写输入表单：

- **候选题目**：您的研究问题或假设
- **目标人群**：具体人群、场景和时间范围
- **可用数据**：列出您可访问的关键变量
- **文献时间跨度**：文献搜索回溯年限(默认 5 年)

### 2. 证据模式选择

- **上传文献（可选）**：上传您之前检索导出的文献文件
  - 支持格式：RIS、BibTeX (.bib)、EndNote (.enw)、CSV、TSV、PubMed、RDF/XML
  - **限制**：最多 10 个文件，总内容 300KB 以内，建议不超过 100 篇文献
- **混合模式**：结合上传文件 + AI 内置学术知识库
- **仅文件模式**：仅基于您上传的文献进行分析
- **⚠️ 服务商建议**：上传文件分析请使用 **Qwen/Kimi/DeepSeek**，Gemini 不支持此模式

### 3. 生成研究方案

点击 "生成评估方案" 按钮，系统将在 60-120 秒内生成包含以下内容的完整研究设计包：

- **执行摘要**：研究问题、假设、新颖性声明、评分（新颖性/可行性/价值）
- **方法学设计**：PICO 框架、候选设计、因果 DAG、模型规范、Python 代码
- **精炼主题**：3-5 个衍生研究方向，含风险评估和可发表性预测
- **期刊推荐**：5-7 个目标期刊，含层级、匹配理由和投稿建议
- **证据溯源**：文献来源、检索策略、关键参考文献

### 4. 审阅与导出

- **Markdown 报告**：完整研究方案，可直接用于项目申请书
- **JSON 协议**：结构化数据，便于程序化处理
- **Python 代码**：可执行的统计分析模板

---

## 🎨 技术栈

- **前端框架**：React 19 + TypeScript 5.8
- **构建工具**：Vite 6.2
- **样式方案**：Tailwind CSS + Lucide Icons
- **图表库**：Recharts (雷达图、趋势图)
- **Markdown 渲染**：react-markdown + rehype-katex + remark-math
- **LLM 集成**：多服务商 API 支持

---

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

感谢以下开源项目和服务：

- **LLM 服务商**：[Qwen (通义千问)](https://tongyi.aliyun.com/)、[Kimi (月之暗面)](https://kimi.ai/)、[DeepSeek](https://www.deepseek.com/)、[智谱AI](https://www.zhipuai.cn/)、[OpenAI](https://openai.com/)、[Google Gemini AI Studio](https://ai.google.dev/)
- **开发框架**：React、Vite、TypeScript、Tailwind CSS
- **部署平台**：Vercel、GitHub Pages

特别感谢 **Google Gemini AI Studio** 提供的强大 API 能力支持。

---

## 📧 联系方式

- **GitHub**：[@quzhiii](https://github.com/quzhiii)
- **项目地址**：[easy-paper](https://github.com/quzhiii/easy-paper)

---

<div align="center">

**由研究者为研究者用 ❤️ 打造**

如果 SciNavi AI 对您的科研之旅有所帮助，请在 GitHub 上给我们一个 ⭐！

</div>

---

## <a id="english"></a>🌟 Project Overview

**SciNavi AI** is a next-generation AI-powered research design assistant that leverages large language models to provide comprehensive methodological guidance for academic research. From topic validation to methodology design, from evidence tracing to journal matching—all empowered by AI.

### 🎯 Key Features

#### 1. **Evidence Tracing & Bibliometric Analysis**
- **Multi-Database Support**: Seamlessly integrates with PubMed, Web of Science, CNKI, Wanfang, and more
- **Upload-Based Analysis**: Upload exported citation files (RIS, BibTeX, EndNote, CSV, etc.)
- **Zero Hallucination Guarantee**: Strict evidence sourcing with transparent citation tracking
- **⚠️ Important Note**:
  - **Recommended: Use Qwen/Kimi/DeepSeek** for file upload analysis (stable and reliable)
  - **Gemini** only supports online search mode, **does NOT support file upload analysis**

#### 2. **Intelligent Methodology Navigator**
- **Automated Causal DAG Generation**: Visual representation using Mermaid syntax
- **Identification Strategy Design**: Auto-generates DiD, IV, RD, and PSM designs
- **PICO Framework Analysis**: Structured breakdown of Population, Intervention, Comparison, Outcomes
- **Estimand Specification**: Clear definition of causal estimands (ATT/ATE) and assignment mechanisms

#### 3. **Data Feasibility Assessment**
- **Smart Variable Detection**: Automatically scans data dictionaries for critical variables
- **Panel Data Readiness Check**: Evaluates data support for advanced causal inference
- **Missing Variable Analysis**: Flags data gaps threatening internal validity

#### 4. **Reproducible Code Generation**
- **Python Templates**: Auto-generates executable code for primary identification strategy
- **Statistical Model Specification**: LaTeX-formatted equations with clustering and fixed effects
- **Diagnostic Checklists**: Comprehensive robustness checks (parallel trends, balance, placebo tests)

#### 5. **Publication Strategy Advisor**
- **Journal Fit Matching**: AI recommendations based on research design and field
- **Risk Assessment**: Identifies potential desk rejection triggers
- **Positioning Tips**: Strategic advice for manuscript framing

#### 6. **Multi-LLM Engine Support**
- **Provider Options**: Qwen, Kimi, DeepSeek, Zhipu (GLM), OpenAI, Google Gemini
- **Model Customization**: Select specific models (e.g., GPT-4o, Gemini 2.5 Flash, DeepSeek V3)
- **Secure API Management**: Keys stored locally, never transmitted through third parties

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- API key from supported LLM providers (recommended: Qwen, Kimi, or DeepSeek)

### Installation

```bash
# Clone repository
git clone https://github.com/quzhiii/easy-paper.git
cd easy-paper

# Install dependencies
npm install

# Start development server
npm run dev
```

Application runs at `http://localhost:3000`

### Configuration

1. **Launch App**: Open browser at `http://localhost:3000`
2. **Open Settings**: Click "API Key" button in top-right corner
3. **Select Provider**: Recommended: Qwen, Kimi, or DeepSeek
4. **Enter API Key**: Paste your API key in corresponding field
5. **Save**: Click "Save Configuration"

> ⚠️ **Important**: API keys are securely stored in browser local storage and sent only to selected provider, never through our servers.

---

## 📖 Usage Guide

### 1. Research Topic Input

Fill in the input form:

- **Candidate Topic**: Your research question or hypothesis
- **Target Population**: Specific population, setting, and timeframe
- **Available Data**: List key variables you have access to
- **Literature Timeframe**: Years to trace back (default: 5 years)

### 2. Evidence Mode Selection

- **Upload References (Optional)**: Upload exported bibliography files
  - Supported formats: RIS, BibTeX (.bib), EndNote (.enw), CSV, TSV, PubMed, RDF/XML
  - **Limits**: Max 10 files, 300KB total content, ~100 references recommended
- **Hybrid Mode**: Combines uploaded files + AI's internal academic knowledge base
- **File-Only Mode**: Analysis based solely on uploaded literature
- **⚠️ Provider Recommendation**: Use **Qwen/Kimi/DeepSeek** for file uploads; Gemini does not support this mode

### 3. Generate Research Pack

Click "Generate Evaluation Plan" button. System generates a complete research design pack in 60-120 seconds:

- **Executive Summary**: Research question, hypotheses, novelty claims, scores (novelty/feasibility/value)
- **Methodology Design**: PICO framework, candidate designs, causal DAG, model specifications, Python code
- **Refined Topics**: 3-5 derivative research directions with risk assessment and publishability predictions
- **Journal Recommendations**: 5-7 target journals with tier classification, fit reasoning, and submission tips
- **Evidence Trace**: Literature sources, search strategies, key references

### 4. Review & Export

- **Markdown Report**: Complete research plan for project proposals
- **JSON Protocol**: Structured data for programmatic processing
- **Python Code**: Executable statistical analysis templates

---

## 🎨 Tech Stack

- **Frontend**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS + Lucide Icons
- **Charts**: Recharts (radar charts, trend plots)
- **Markdown Rendering**: react-markdown + rehype-katex + remark-math
- **LLM Integration**: Multi-provider API support

---

## 📜 License

This project is open-sourced under [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Thanks to the following open-source projects and services:

- **LLM Providers**: [Qwen (Tongyi Qianwen)](https://tongyi.aliyun.com/), [Kimi (Moonshot AI)](https://kimi.ai/), [DeepSeek](https://www.deepseek.com/), [Zhipu AI](https://www.zhipuai.cn/), [OpenAI](https://openai.com/), [Google Gemini AI Studio](https://ai.google.dev/)
- **Development Frameworks**: React, Vite, TypeScript, Tailwind CSS
- **Deployment Platforms**: Vercel, GitHub Pages

Special thanks to **Google Gemini AI Studio** for providing powerful API capabilities.

---

## 📧 Contact

- **GitHub**: [@quzhiii](https://github.com/quzhiii)
- **Project Repository**: [easy-paper](https://github.com/quzhiii/easy-paper)

---

<div align="center">

**Built by Researchers, for Researchers with ❤️**

If SciNavi AI helps your research journey, please give us a ⭐ on GitHub!

</div>
