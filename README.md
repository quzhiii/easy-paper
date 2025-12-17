<div align="center">

# 🧭 SciNavi AI | 科研智导

**AI-Powered Research Design Copilot**  
**智能科研选题与方法学评估系统**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff)](https://vitejs.dev/)

### 🌐 在线使用

**Vercel:** https://traegb0c2a25.vercel.app/

[🚀 立即使用](https://traegb0c2a25.vercel.app/)

**GitHub Pages:** https://quzhiii.github.io/easy-paper/ 

[English](#english) | [中文](#chinese) | [📖 Troubleshooting](TROUBLESHOOTING.md)

</div>

---

## <a id="chinese"></a>🌟 项目概述

---

## <a id="english"></a>🌟 Overview

**SciNavi AI** is a next-generation research design copilot that leverages large language models to provide comprehensive methodological guidance for academic research. From topic selection to methodology design, from evidence tracing to journal fit—all powered by AI.

### 👥 Who Should Use SciNavi AI?

- **📚 PhD Students & Early-Career Researchers**: Validate research topics, design robust methodologies, avoid common pitfalls
- **🔬 Postdocs & Principal Investigators**: Rapidly assess feasibility of new research directions, optimize grant proposals
- **🏥 Clinical Researchers**: Design observational studies with proper causal inference methods (DiD, RD, PSM, IV)
- **📊 Health Policy Analysts**: Evaluate policy interventions using quasi-experimental designs
- **🧑‍🏫 Research Supervisors**: Guide students through methodological choices, identify data gaps early
- **📝 Systematic Reviewers**: Trace evidence chains, assess methodological quality across studies

### 🎯 Ideal Use Cases

#### 🔍 Scenario 1: Early-Stage Topic Exploration
**Problem**: "I have a vague research idea about telemedicine's impact on diabetes management, but don't know if it's feasible or novel."

**SciNavi AI Solution**:
- Traces recent literature (PubMed, Web of Science, CNKI) to verify novelty
- Identifies data requirements (e.g., patient ID, HbA1c levels, telemedicine usage logs)
- Suggests causal identification strategies (e.g., DiD if rollout is staggered, RD if eligibility has a cutoff)
- Rates feasibility based on your data availability

**Result**: A comprehensive research design pack in 60 seconds, saving weeks of literature review.

---

#### 🏥 Scenario 2: Policy Evaluation Study Design
**Problem**: "Need to evaluate the impact of long-term care insurance on household medical expenditure using CHARLS data."

**SciNavi AI Solution**:
- Auto-generates PICO framework (Population, Intervention, Comparison, Outcome)
- Designs DiD identification strategy with parallel trends diagnostics
- Creates causal DAG showing confounding paths and adjustment sets
- Produces executable Python code with TWFE regression and event study plots

**Result**: Publication-ready methodology section + reproducible code.

---

#### 📊 Scenario 3: Data Feasibility Check
**Problem**: "I want to use RDD to study air pollution's effect on mental health, but unsure if my data supports it."

**SciNavi AI Solution**:
- Scans your data dictionary for required variables (running variable, outcome, covariates)
- Checks for sufficient observations near the cutoff (Huai River boundary)
- Suggests bandwidth selection methods and robustness checks
- Flags missing variables that could threaten internal validity

**Result**: Clear go/no-go decision with specific data augmentation recommendations.

---

#### 🎓 Scenario 4: Journal Targeting Strategy
**Problem**: "Finished a manuscript on statins and CVD prevention in elderly patients, which journal should I target?"

**SciNavi AI Solution**:
- Matches your study design (PSM + survival analysis) to journal preferences
- Recommends 5-7 journals with tier classification (Q1/Q2) and fit reasoning
- Provides positioning tips (e.g., emphasize real-world evidence, heterogeneity analysis)
- Warns about potential rejection triggers (e.g., insufficient balance diagnostics)

**Result**: Strategic submission plan with backup options.

---

### 💡 Why Choose SciNavi AI?

**Compared to Manual Literature Review:**
- ⏱️ **60 seconds vs. 2 weeks**: Instant evidence tracing and novelty verification
- 🎯 **Comprehensive**: Covers methodology, data, publication strategy—not just "is this novel?"
- 🔄 **Iterative**: Refine your topic instantly based on AI feedback

**Compared to Statistical Consultants:**
- 💰 **Free vs. $200/hour**: No consultation fees
- 🕐 **24/7 Availability**: No scheduling conflicts
- 📝 **Reproducible**: Get Python code + LaTeX equations, not just verbal advice

**Compared to Generic AI Chatbots (ChatGPT, Claude):**
- 🎓 **Domain-Specialized**: Trained on epidemiology, health economics, causal inference
- 📊 **Structured Output**: JSON protocol, Mermaid DAG, executable code—not just text
- 🔗 **Evidence-Backed**: Cites real papers, no hallucinated references

### 🎯 Key Features

#### 1. **Evidence Tracing & Bibliometric Analysis**
- **Multi-Database Support**: Seamlessly integrates with PubMed, Web of Science, CNKI, Wanfang, and more
- **Upload-Based Analysis**: For restricted databases, upload exported citation files (RIS, BibTeX, EndNote, CSV, etc.)
- **Zero Hallucination Guarantee**: Strict evidence sourcing with transparent citation tracking
- **Comprehensive Literature Review**: Automated novelty verification against existing research

#### 2. **Intelligent Methodology Navigator**
- **Automated Causal DAG Generation**: Visual representation of causal relationships using Mermaid syntax
- **Identification Strategy Design**: Auto-generates difference-in-differences (DiD), instrumental variables (IV), regression discontinuity (RD), and propensity score matching (PSM) designs
- **PICO Framework Analysis**: Structured breakdown of Population, Intervention, Comparison, and Outcomes
- **Estimand Specification**: Clear definition of causal estimands (ATT, ATE) with treatment assignment mechanisms

#### 3. **Data Feasibility Assessment**
- **Smart Variable Detection**: Automatically scans data dictionaries to identify critical variables
- **Panel Data Readiness Check**: Evaluates whether your data supports advanced causal inference methods
- **Missing Variable Analysis**: Flags data gaps that could threaten internal validity
- **Data Quality Tags**: Heuristic assessment of ID, time, outcome, and intervention variables

#### 4. **Reproducible Code Generation**
- **Python Templates**: Auto-generates executable Python code for your primary identification strategy
- **Statistical Model Specification**: LaTeX-formatted model equations with clustering and fixed effects
- **Diagnostic Checklists**: Comprehensive robustness checks (parallel trends, balance tests, placebo tests)
- **Export Options**: One-click download of JSON protocols and Markdown reports

#### 5. **Publication Strategy Advisor**
- **Journal Fit Matching**: AI-powered recommendations based on your research design and field
- **Risk Assessment**: Identifies potential desk rejection triggers
- **Positioning Tips**: Strategic advice for manuscript framing and emphasis
- **Impact Route Planning**: Comparison of "MVP Safe" vs. "High-Impact Ambitious" pathways

#### 6. **Multi-LLM Engine Support**
- **Provider Flexibility**: Choose from Qwen, Kimi, DeepSeek, Zhipu (GLM), OpenAI, or Google Gemini
- **Model Customization**: Select specific models (e.g., GPT-4o, Gemini 2.5 Flash, DeepSeek V3)
- **Secure API Management**: Keys stored locally in browser storage, never transmitted to third parties
- **Proxy Support**: Custom base URL configuration for network-restricted environments

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm/yarn/pnpm
- An API key from one of the supported LLM providers (Qwen, Kimi, DeepSeek, Zhipu, OpenAI, or Gemini)

### Installation

```bash
# Clone the repository
git clone https://github.com/quzhiii/easy-paper.git
cd easy-paper

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Configuration

1. **Launch the App**: Open your browser and navigate to `http://localhost:3000`
2. **Open Settings**: Click the "API Key" button in the top-right navigation bar
3. **Select Provider**: Choose your preferred LLM provider (e.g., Qwen, OpenAI, Gemini)
4. **Enter API Key**: Paste your API key in the corresponding field
5. **Optional**: Customize the model name or base URL if needed
6. **Save**: Click "Save Configuration" to persist settings

> ⚠️ **Important**: Your API keys are stored securely in your browser's local storage and are only sent directly to the selected provider. They never pass through our servers.

---

## 📖 Usage Guide

### 1. Research Topic Input

Navigate to the input form and provide:

- **Candidate Topic**: Your research question or hypothesis (e.g., "Impact of telemedicine on diabetes management in rural areas")
- **Target Population**: Specific population, setting, and time frame (e.g., "Rural elderly patients aged 65+, 2020-2023")
- **Available Data**: List key variables you have access to (e.g., "Patient_ID, Date, HbA1c, Blood_Pressure, Telemedicine_Usage")
- **Literature Timeframe**: Number of years to trace back in literature search (default: 5 years)

### 2. Evidence Mode Selection

- **Upload References (Optional)**: Upload exported bibliography files from your previous searches
  - Supported formats: RIS, BibTeX (.bib), EndNote (.enw), CSV, TSV, PubMed, RDF/XML
  - Multiple files can be uploaded simultaneously
- **Enable Online Search**: Toggle to allow AI to supplement with internal academic knowledge base

### 3. Generate Research Pack

Click "Generate Research Pack" and wait 30-90 seconds for the AI to:
1. Trace evidence from literature databases
2. Verify novelty claims
3. Design identification strategies
4. Generate DAGs and model specifications
5. Write reproducible Python code
6. Match suitable journals

### 4. Review & Export

Navigate through the dashboard tabs:
- **Executive Summary**: Hypothesis, novelty verification, and recommendation
- **Methodology**: PICO, DAG, model specifications, and code templates
- **Refined Topics**: Optimized research directions with risk assessment
- **Journal Fit**: Target journals with submission strategies

Export options:
- **Markdown**: Human-readable report with all sections
- **JSON**: Structured protocol for programmatic use

---

## 🛠️ Technical Stack

- **Frontend**: React 19.2 + TypeScript 5.8
- **Build Tool**: Vite 6.2
- **LLM Integration**: Multi-provider SDK support (@google/genai for Gemini, OpenAI-compatible API for others)
- **Visualization**: Recharts (radar charts), Lucide React (icons)
- **Markdown Rendering**: react-markdown with math support (remark-math, rehype-katex)
- **Styling**: Tailwind CSS (embedded in components)

---

## 🎓 Use Cases

### 1. Health Policy Evaluation
**Scenario**: Assessing the impact of long-term care insurance on household medical expenditure  
**Data**: CHARLS panel data (2015-2020)  
**Method**: Difference-in-Differences (DiD) with city-level pilot rollout  
**Output**: ATT estimates, parallel trends tests, Python code for TWFE regression

### 2. Clinical Effectiveness Study
**Scenario**: Statin use and cardiovascular events in elderly hypertensive patients  
**Data**: Electronic medical records (EMR)  
**Method**: Propensity Score Matching (PSM) with survival analysis  
**Output**: Hazard ratios, balance diagnostics, code for Cox regression

### 3. Environmental Health Economics
**Scenario**: Air pollution's impact on mental health using Huai River Policy  
**Data**: CFPS survey + air quality monitoring stations  
**Method**: Regression Discontinuity Design (RD) at Huai River boundary  
**Output**: Local average treatment effects, bandwidth selection, RD plots

---

## 🔒 Privacy & Security

- **Local-First Storage**: All API keys and research history are stored in browser's localStorage
- **No Backend Server**: Direct client-to-LLM provider communication
- **No Data Collection**: We do not log, store, or transmit your research data
- **Open Source**: Full codebase available for audit

---

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs via GitHub Issues
- Suggest new features or methodologies
- Submit pull requests with improvements
- Share feedback on methodology recommendations

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Powered by state-of-the-art large language models (Qwen, Kimi, DeepSeek, Zhipu, OpenAI, Gemini)
- Inspired by evidence-based medicine and causal inference methodologies
- Built for the global research community

---

## 📧 Contact

- **GitHub**: [@quzhiii](https://github.com/quzhiii)
- **Project**: [easy-paper](https://github.com/quzhiii/easy-paper)

---

<div align="center">

**Made with ❤️ for Researchers, by Researchers**

⭐ Star us on GitHub if SciNavi AI helps your research journey!

</div>

---

---

## <a id="chinese"></a>🌟 项目简介

**SciNavi AI（科研智导）** 是一款基于大语言模型的新一代科研设计助手，为学术研究提供从选题到发表的全方位方法学指导。从证据溯源到方法学设计，从数据可行性到期刊匹配——全由AI驱动。

### 👥 适用人群

- **📚 博士生与青年学者**：验证选题可行性，设计稳健方法，规避常见陷阱
- **🔬 博士后与课题负责人**：快速评估新研究方向，优化基金申请书
- **🏥 临床研究者**：设计观察性研究，应用因果推断方法（DiD、RD、PSM、IV）
- **📊 卫生政策分析师**：使用准实验设计评估政策干预效果
- **🧑‍🏫 研究导师**：指导学生做出方法学选择，及早识别数据缺口
- **📝 系统综述作者**：追溯证据链，评估研究的方法学质量

### 🎯 典型应用场景

#### 🔍 场景1：早期选题探索
**问题**："我想研究远程医疗对糖尿病管理的影响，但不确定是否可行、是否新颖。"

**SciNavi AI方案**：
- 追溯近期文献（PubMed、Web of Science、CNKI）验证新颖性
- 识别数据需求（如患者ID、HbA1c水平、远程医疗使用记录）
- 建议因果识别策略（如分阶段推广用DiD，资格有截断点用RD）
- 根据数据可得性评分可行性

**结果**：60秒内生成完整研究设计包，节省数周文献调研时间。

---

#### 🏥 场景2：政策评估研究设计
**问题**："需要用CHARLS数据评估长护险对家庭医疗支出的影响。"

**SciNavi AI方案**：
- 自动生成PICO框架（人群、干预、对照、结局）
- 设计DiD识别策略，包含平行趋势诊断
- 创建因果DAG，展示混杂路径和调整集
- 生成可执行Python代码（TWFE回归 + 事件研究图）

**结果**：可发表的方法学章节 + 可复现代码。

---

#### 📊 场景3：数据可行性检查
**问题**："想用断点回归研究空气污染对心理健康的影响，但不确定数据是否支持。"

**SciNavi AI方案**：
- 扫描数据字典查找必需变量（驱动变量、结局、协变量）
- 检查截断点附近是否有足够观测值（淮河边界）
- 建议带宽选择方法和稳健性检验
- 标记可能威胁内部效度的缺失变量

**结果**：明确的可行/不可行判断，附具体数据补充建议。

---

#### 🎓 场景4：期刊投稿策略
**问题**："完成了他汀类药物与老年患者CVD预防的研究，应该投哪个期刊？"

**SciNavi AI方案**：
- 将您的研究设计（PSM + 生存分析）与期刊偏好匹配
- 推荐5-7个期刊，附分区（Q1/Q2）和匹配理由
- 提供定位建议（如强调真实世界证据、异质性分析）
- 警示潜在拒稿触发因素（如平衡性诊断不足）

**结果**：战略性投稿计划，附备选方案。

---

### 💡 为什么选择 SciNavi AI？

**对比人工文献综述：**
- ⏱️ **60秒 vs. 2周**：即时证据溯源和新颖性验证
- 🎯 **全面性**：覆盖方法学、数据、发表策略——不仅是"这个新颖吗？"
- 🔄 **可迭代**：根据AI反馈即时优化选题

**对比统计咨询师：**
- 💰 **免费 vs. ¥1500/小时**：无咨询费用
- 🕐 **7×24可用**：无需预约排期
- 📝 **可复现**：获得Python代码 + LaTeX公式，而非口头建议

**对比通用AI聊天机器人（ChatGPT、Claude）：**
- 🎓 **领域专精**：针对流行病学、卫生经济学、因果推断训练
- 📊 **结构化输出**：JSON协议、Mermaid DAG、可执行代码——而非纯文本
- 🔗 **证据支撑**：引用真实论文，无虚构参考文献

### 🎯 核心功能

#### 1. **全证据链溯源与文献计量分析**
- **多数据库支持**：无缝集成 PubMed、Web of Science、CNKI、万方等主流学术数据库
- **上传导出文件分析**：对于需要权限的数据库，支持上传导出的引文文件（RIS、BibTeX、EndNote、CSV 等）
- **零幻觉保证**：严格的证据来源追溯，透明的引文追踪机制
- **综合文献综述**：自动化的创新性核验，与现有研究进行对比

#### 2. **智能方法学导航器**
- **自动因果图生成**：使用 Mermaid 语法可视化因果关系路径
- **识别策略设计**：自动生成双重差分（DiD）、工具变量（IV）、断点回归（RD）、倾向得分匹配（PSM）等设计方案
- **PICO 框架分析**：结构化拆解人群（Population）、干预（Intervention）、对照（Comparison）、结局（Outcomes）
- **估计量规范化**：明确因果估计量（ATT、ATE）及干预分配机制

#### 3. **数据可行性评估**
- **智能变量检测**：自动扫描数据字典，识别关键变量
- **面板数据就绪性检查**：评估您的数据是否支持高级因果推断方法
- **缺失变量分析**：标记可能威胁内部效度的数据缺口
- **数据质量标签**：启发式评估 ID、时间、结局、干预变量的完整性

#### 4. **可复现代码生成**
- **Python 模板**：为您的主要识别策略自动生成可执行的 Python 代码
- **统计模型规范**：LaTeX 格式的模型方程，包含聚类标准误和固定效应
- **诊断检查清单**：全面的稳健性检验（平行趋势检验、平衡性检验、安慰剂检验）
- **导出选项**：一键下载 JSON 协议和 Markdown 报告

#### 5. **发表策略顾问**
- **期刊匹配**：基于您的研究设计和领域的 AI 驱动期刊推荐
- **风险评估**：识别潜在的桌面拒稿触发因素
- **定位建议**：稿件框架和强调重点的战略性建议
- **影响力路线规划**：比较"最小可行性（安全）"与"高影响力（进取）"路径

#### 6. **多 LLM 引擎支持**
- **服务商灵活性**：支持通义千问、Kimi、DeepSeek、智谱（GLM）、OpenAI、Google Gemini
- **模型自定义**：选择特定模型（如 GPT-4o、Gemini 2.5 Flash、DeepSeek V3）
- **安全的 API 管理**：密钥本地存储于浏览器，绝不传输给第三方
- **代理支持**：为网络受限环境提供自定义 Base URL 配置

---

## 🚀 快速开始

### 环境要求
- **Node.js** 18+ 及 npm/yarn/pnpm
- 来自支持的 LLM 服务商的 API Key（通义千问、Kimi、DeepSeek、智谱、OpenAI 或 Gemini）

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

应用将在 `http://localhost:3000` 上运行

### 配置指南

1. **启动应用**：打开浏览器并访问 `http://localhost:3000`
2. **打开设置**：点击右上角导航栏的 "API Key" 按钮
3. **选择服务商**：选择您偏好的 LLM 服务商（如通义千问、OpenAI、Gemini）
4. **输入 API Key**：在对应字段粘贴您的 API Key
5. **可选配置**：根据需要自定义模型名称或 Base URL
6. **保存**：点击"保存配置"以持久化设置

> ⚠️ **重要提示**：您的 API Key 安全地存储在浏览器的本地存储中，仅直接发送到所选服务商。它们绝不会经过我们的服务器。

---

## 📖 使用指南

### 1. 研究选题输入

在输入表单中提供以下信息：

- **候选选题**：您的研究问题或假设（例如："远程医疗对农村地区糖尿病管理的影响"）
- **目标人群**：具体的人群、场景和时间范围（例如："2020-2023 年 65 岁以上的农村老年患者"）
- **可用数据**：列出您可以访问的关键变量（例如："Patient_ID, Date, HbA1c, Blood_Pressure, Telemedicine_Usage"）
- **文献追溯时间**：文献检索回溯的年数（默认：5 年）

### 2. 证据模式选择

- **上传参考文献（可选）**：上传您之前检索导出的文献库文件
  - 支持格式：RIS、BibTeX (.bib)、EndNote (.enw)、CSV、TSV、PubMed、RDF/XML
  - 可同时上传多个文件
- **启用在线搜索**：切换开关以允许 AI 使用其内部学术知识库进行补充

### 3. 生成研究方案

点击"生成评估方案"，等待 30-90 秒，AI 将：
1. 从文献数据库追溯证据
2. 核验创新性声明
3. 设计识别策略
4. 生成 DAG 和模型规范
5. 编写可复现的 Python 代码
6. 匹配合适的期刊

### 4. 审阅与导出

在仪表板标签页中浏览：
- **总览**：假设、创新性核验和推荐意见
- **方法论导航**：PICO、DAG、模型规范和代码模板
- **选题优化**：优化后的研究方向及风险评估
- **期刊匹配**：目标期刊及投稿策略

导出选项：
- **Markdown**：包含所有章节的人类可读报告
- **JSON**：用于程序化使用的结构化协议

---

## 🛠️ 技术栈

- **前端框架**：React 19.2 + TypeScript 5.8
- **构建工具**：Vite 6.2
- **LLM 集成**：多服务商 SDK 支持（@google/genai 用于 Gemini，OpenAI 兼容 API 用于其他）
- **可视化**：Recharts（雷达图）、Lucide React（图标）
- **Markdown 渲染**：react-markdown，支持数学公式（remark-math、rehype-katex）
- **样式**：Tailwind CSS（嵌入组件）

---

## 🎓 应用场景

### 1. 卫生政策评估
**场景**：评估长期护理保险对家庭医疗支出的影响  
**数据**：CHARLS 面板数据（2015-2020）  
**方法**：基于城市级试点推广的双重差分法（DiD）  
**输出**：ATT 估计值、平行趋势检验、TWFE 回归的 Python 代码

### 2. 临床疗效研究
**场景**：他汀类药物使用与老年高血压患者心血管事件的关系  
**数据**：电子病历（EMR）  
**方法**：倾向得分匹配（PSM）结合生存分析  
**输出**：风险比、平衡性诊断、Cox 回归代码

### 3. 环境健康经济学
**场景**：利用淮河政策研究空气污染对心理健康的影响  
**数据**：CFPS 调查 + 空气质量监测站数据  
**方法**：以淮河为边界的断点回归设计（RD）  
**输出**：局部平均处理效应、带宽选择、RD 图表

---

## 🔒 隐私与安全

- **本地优先存储**：所有 API Key 和研究历史记录存储在浏览器的 localStorage
- **无后端服务器**：客户端直接与 LLM 服务商通信
- **不收集数据**：我们不记录、存储或传输您的研究数据
- **开源透明**：完整代码库可供审计

---

## 🤝 贡献指南

我们欢迎贡献！请随时：
- 通过 GitHub Issues 报告 bug
- 建议新功能或方法学改进
- 提交改进代码的 Pull Request
- 分享对方法学推荐的反馈

---

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- 由最先进的大语言模型驱动（通义千问、Kimi、DeepSeek、智谱、OpenAI、Gemini）
- 受循证医学和因果推断方法学启发
- 为全球科研社区打造

---

## 📧 联系方式

- **GitHub**：[@quzhiii](https://github.com/quzhiii)
- **项目地址**：[easy-paper](https://github.com/quzhiii/easy-paper)

---

<div align="center">

**由研究者为研究者用 ❤️ 打造**

如果 SciNavi AI 对您的科研之旅有所帮助，请在 GitHub 上给我们一个 ⭐！

</div>
