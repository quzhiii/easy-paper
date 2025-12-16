

export type Language = 'en' | 'zh';

export type LLMProviderId = 'qwen' | 'kimi' | 'gemini' | 'deepseek' | 'zhipu' | 'openai';

export interface UserSettings {
  provider: LLMProviderId;
  keys: {
    qwen: string;
    kimi: string;
    gemini: string;
    deepseek: string;
    zhipu: string;
    openai: string;
  };
  models: {
    qwen: string;
    kimi: string;
    gemini: string;
    deepseek: string;
    zhipu: string;
    openai: string;
  };
  baseUrls: {
    qwen: string;
    kimi: string;
    gemini: string;
    deepseek: string;
    zhipu: string;
    openai: string;
  };
}

export interface EvaluationInput {
  topic: string;
  population: string;
  data: string;
  timeframe: number;
  references?: string; // New field for uploaded bibliography
  enableOnlineSearch: boolean; // New toggle for mixed mode
}

// --- Research Design Pack Interfaces ---

export interface ReportMetadata {
  project_id: string;
  version: string;
  generated_at: string;
  model_used: string;
  user_input_summary: string;
  assumptions: string;
  confidence_overall: 'High' | 'Medium' | 'Low';
  confidence_reason: string[];
}

export interface EvidenceTrace {
  status: 'complete' | 'partial' | 'missing'; // P0 Requirement
  search_sources: string[];
  search_time_window: string;
  queries: { en: string; zh: string };
  hits_count: Record<string, number | string>;
  screening_rule: string;
  key_references: Array<{
    title: string;
    year: string;
    journal: string;
    relevance_note: string;
    link?: string;
    doi?: string;
  }>;
}

export interface ExecutiveSummary {
  research_question: string;
  hypothesis_primary: string;
  hypothesis_secondary: string;
  why_it_matters: string[];
  novelty_claims: Array<{ claim: string; status: 'Verified' | 'Unverified' | 'Partial'; evidence: string }>;
  scores: {
    novelty: number;
    feasibility: number;
    value: number;
  };
  score_rationales: {
    novelty: string[];
    feasibility: string[];
    value: string[];
  };
  bottom_line: 'Recommended' | 'Not Recommended' | 'Conditional';
  next_steps: string[];
}

export interface DesignOption {
  name: string; // e.g. DiD, ITS
  type: 'Primary' | 'Alternative';
  description: string;
  data_requirement: string;
  key_assumptions: string;
  threats: string;
  diagnostics: string; // Checklist of tests
  python_code: string; // Reproducible code
}

export interface MethodDesign {
  pico: { P: string; E: string; C: string; O: string };
  estimand: {
    primary: string; // ATT/ATE
    treatment_assignment: string;
    time_zero: string;
    follow_up: string;
  };
  candidate_designs: DesignOption[];
  dag: {
    nodes: string[];
    mermaid_code: string;
    adjustment_set: string[];
    do_not_adjust: string[];
  };
  model_specification: {
    formula: string; // LaTeX
    se_clustering: string;
    fixed_effects: string;
    weights?: string;
    missing_data_strategy: string;
  };
  robustness_checks: Array<{ name: string; description: string; threshold: string }>;
}

export interface RefinedTopic {
  title: string;
  one_sentence_rq: string;
  estimand: string;
  design: string;
  data_gate: string;
  risk_level: 'Low' | 'Medium' | 'High';
  risk_reason: string;
  publishability: string;
  why_better: string[];
}

export interface JournalRecommendation {
  name: string;
  tier: string;
  fit_reason: string;
  similar_papers: string[]; // If empty, risk_notes must explain
  submission_requirements: string;
  positioning_tip: string;
  risk_notes: string;
}

export interface RadarMetrics {
  literatureCrowdedness: number;
  methodScarcity: number;
  sceneScarcity: number;
  dataQuality: number;
  ethicalRisk: number;
  methodReadiness: number;
}

export interface EvaluationResult {
  metadata: ReportMetadata;
  evidence_trace: EvidenceTrace;
  executive_summary: ExecutiveSummary;
  methodology: MethodDesign;
  refined_topics: RefinedTopic[];
  mvp_route: string;
  high_standard_route: string;
  journal_fit: JournalRecommendation[];
  radar_metrics?: RadarMetrics;
}

// History Item Interface
export interface HistoryItem {
  id: string;
  timestamp: number;
  topic: string;
  result: EvaluationResult;
  input: EvaluationInput;
}

export const LABELS = {
  en: {
    app_name: "SciNavi AI",
    hero_title: "Research Design Copilot",
    hero_subtitle: "AI-driven assessment based on real-time literature search—providing comprehensive research decision support from topic novelty and data feasibility to methodological rigor.",
    start_btn: "Start Evaluation",
    features: [
      { title: "Evidence Trace", desc: "Supports evidence tracing and review-level analysis based on open academic indices and user-uploaded search export results; for restricted databases, equivalent assessment can be completed by uploading export files." },
      { title: "Methodology Pilot", desc: "Auto-generate Causal DAGs, Estimands, and robust identification strategies (DiD/IV/RD)." },
      { title: "Design Pack Export", desc: "One-click download of JSON protocols and Python reproducibility code templates." },
      { title: "Feasibility Check", desc: "Deep assessment of data requirements, identifying critical missing variables." }
    ],
    input_section: "Research Design Input",
    history_btn: "History / Archives",
    history_empty: "No saved research packs found.",
    topic_label: "Candidate Topic",
    topic_placeholder: "e.g., Impact of Telemedicine on localized diabetes management",
    pop_label: "Target Population/Setting",
    pop_placeholder: "e.g., Rural elderly population, Community health centers",
    data_label: "Available Data",
    data_placeholder: "Describe variables, or upload a data dictionary (CSV/TXT)...",
    timeframe_label: "Literature Timeframe (Years)",
    submit: "Generate Research Pack",
    evaluating: "Simulating Research Process...",
    results_title: "Research Design Protocol",
    tab_overview: "Executive Summary",
    tab_method: "Methodology",
    tab_journals: "Journal Fit",
    tab_refined: "Refinement",
    upload_btn: "Upload Data Dictionary",
    guide_title: "Input Guide",
    export_md: "Export Bundle (MD)",
    export_json: "Export Protocol (JSON)",
    back_to_input: "Edit Input",
    footer_text: "Powered by Multi-LLM Engine",
    guide_content: [
      { label: "Step 1: Topic", text: "Define the Intervention (I) and Outcome (O)." },
      { label: "Step 2: Population", text: "Specify the setting and inclusion/exclusion criteria." },
      { label: "Step 3: Data", text: "Crucial. List key variables (Time, ID, Outcome) to enable DiD/PSM checks." }
    ],
    examples: {
      label: "Quick Start Examples:",
      btn1: "Policy (DiD)",
      btn2: "Clinical (PSM)",
      btn3: "Econ (IV)"
    },
    steps: [
      "Accessing Knowledge Base...",
      "Tracing Evidence (Evidence Trace)...",
      "Designing Identification Strategy...",
      "Writing Python Reproducibility Code...",
      "Compiling Design Pack..."
    ],
    settings: {
      title: "Model Settings",
      subtitle: "Configure AI providers and keys",
      provider_label: "Select Model Provider",
      key_label: "API Key Configuration",
      key_placeholder: "Enter your {name} API Key",
      key_note: "Your key is stored securely in your browser's local storage.",
      model_label: "Model Name (Optional)",
      model_placeholder: "Default: {model}",
      url_label: "Base URL (Optional)",
      url_placeholder: "Default: {url}",
      save: "Save Configuration",
      cancel: "Cancel"
    },
    dashboard: {
       hypothesis_title: "Hypothesis & Significance",
       primary_hypo: "Primary Hypothesis",
       why_matters: "Why It Matters",
       novelty_verify: "Novelty Claims Verification",
       next_steps: "Next Steps",
       pico_title: "PICO Framework",
       identification_strategy: "Identification Strategy",
       estimand: "Estimand",
       treatment_assign: "Treatment Assignment",
       time_zero: "Time Zero (T0)",
       follow_up: "Follow-up",
       design_selection: "Method Design Selector",
       data_needed: "Data Needed",
       assumptions: "Assumptions",
       diagnostics: "Diagnostics",
       causal_dag: "Causal DAG (Mermaid Syntax)",
       adjustment_set: "Min. Adjustment Set",
       do_not_adjust: "Do NOT Adjust (Collider/Mediator)",
       model_spec: "Model Specification",
       se_clustering: "SE Clustering",
       fixed_effects: "Fixed Effects",
       mvp_route: "MVP Route (Safe)",
       high_route: "High-Impact Route (Ambitious)",
       optimized_directions: "Optimized Research Directions",
       risk: "Risk",
       why_better: "Why Better?",
       positioning: "Positioning Tip",
       risk_note: "Risk Note",
       evidence_trace: "Evidence Trace",
       db_support: "Supported DBs: PubMed, WoS, CNKI, Wanfang",
       search_queries: "Search Queries",
       sources: "Sources",
       key_refs: "Key References",
       edit_dag: "Copy Syntax",
       update_dag: "Update Graph",
       primary_design: "Primary Design",
       alternative_design: "Alternative"
    }
  },
  zh: {
    app_name: "SciNavi AI | 科研智导",
    hero_title: "科研选题与设计智能评估系统",
    hero_subtitle: "基于实时文献检索的深度评估工具——从选题新颖性、数据可行性到方法科学性，为您提供全方位的科研决策支持。",
    start_btn: "开始评估",
    features: [
      { title: "全证据链溯源", desc: "支持基于公开学术索引与用户上传的检索导出结果进行证据追溯与综述级分析；对需权限数据库，可通过上传导出文件完成同等评估。" },
      { title: "方法学自动导航", desc: "自动构建因果图 (DAG)、明确估计量 (Estimand)，并生成 DiD/IV/RD 等识别策略。" },
      { title: "标准化科研交付包", desc: "一键生成完整科研交付包：含 JSON 结构化协议、Markdown 报告及可运行 Python 代码。" },
      { title: "数据可行性体检", desc: "深度扫描数据字典，自动识别关键变量缺失风险，预判面板数据分析可行性。" }
    ],
    input_section: "研究设计输入",
    history_btn: "历史记录 / 方案库",
    history_empty: "暂无保存的研究方案。",
    topic_label: "候选题 (Topic)",
    topic_placeholder: "例如：长护险政策对家庭医疗支出的影响——基于双重差分法",
    pop_label: "目标人群 (Population)",
    pop_placeholder: "例如：某省 2020-2023 年住院患者，排除肿瘤及意外伤害",
    data_label: "数据基础 (Data)",
    data_placeholder: "非常重要：请列出您有哪些关键变量（如时间、地区、费用明细、人口学特征）...",
    timeframe_label: "文献追溯 (年)",
    submit: "生成评估方案",
    evaluating: "正在进行方法学推演与证据溯源...",
    results_title: "科研选题评估报告",
    tab_overview: "总览 (Executive Summary)",
    tab_method: "方法论导航 (Methodology)",
    tab_journals: "期刊匹配 (Journal Fit)",
    tab_refined: "选题优化 (Refinement)",
    upload_btn: "上传变量表 (CSV/TXT)",
    guide_title: "填写指南",
    export_md: "导出报告 (Markdown)",
    export_json: "导出协议 (JSON)",
    back_to_input: "返回修改",
    footer_text: "Powered by Multi-LLM Engine",
    guide_content: [
      { label: "Step 1: 题目", text: "越具体越好。包含干预(I)、对照(C)和结局(O)。" },
      { label: "Step 2: 人群", text: "明确的时间窗和排除标准能提高评估的准确性。" },
      { label: "Step 3: 数据", text: "系统会自动检查变量覆盖率（如 ID、时间、结果）。请尽可能详细。" }
    ],
    examples: {
      label: "一键示例:",
      btn1: "政策评估 (DiD)",
      btn2: "临床队列 (PSM)",
      btn3: "卫经 (IV)"
    },
    steps: [
      "正在连接学术知识库...",
      "溯源证据链 (Evidence Trace)...",
      "构建因果识别策略...",
      "编写 Python 复现代码...",
      "生成最终研究设计包..."
    ],
    settings: {
      title: "模型设置",
      subtitle: "配置 AI 模型渠道与 API Key",
      provider_label: "选择模型服务商",
      key_label: "API Key 配置",
      key_placeholder: "请输入您的 {name} API Key",
      key_note: "您的 Key 仅加密存储在本地浏览器缓存中，直接发送至服务商。",
      model_label: "自定义模型 (可选)",
      model_placeholder: "默认: {model}",
      url_label: "代理地址 / Base URL (可选)",
      url_placeholder: "默认: {url}",
      save: "保存配置",
      cancel: "取消"
    },
    dashboard: {
       hypothesis_title: "核心假设与研究意义",
       primary_hypo: "主要假设",
       why_matters: "研究价值/意义",
       novelty_verify: "创新点核验",
       next_steps: "下一步行动建议",
       pico_title: "PICO 分析框架",
       identification_strategy: "因果识别策略",
       estimand: "估计量 (Estimand)",
       treatment_assign: "干预分配机制",
       time_zero: "随访起点 (Time Zero)",
       follow_up: "终点 (Follow-up)",
       design_selection: "研究设计方案选择器",
       data_needed: "所需数据",
       assumptions: "关键假设",
       diagnostics: "稳健性检验/诊断",
       causal_dag: "因果路径图 (Mermaid 代码)",
       adjustment_set: "建议调整集 (Adjustment Set)",
       do_not_adjust: "禁止调整 (Collider/Mediator)",
       model_spec: "模型设定",
       se_clustering: "标准误聚类",
       fixed_effects: "固定效应",
       mvp_route: "最小可行性方案 (稳妥路线)",
       high_route: "高影响力方案 (进阶路线)",
       optimized_directions: "优化后的选题方向",
       risk: "风险等级",
       why_better: "改进依据",
       positioning: "投稿定位建议",
       risk_note: "拒稿风险提示",
       evidence_trace: "全证据链溯源",
       db_support: "支持库: PubMed, Web of Science, CNKI, 万方",
       search_queries: "检索式",
       sources: "检索源",
       key_refs: "关键参考文献",
       edit_dag: "复制 Mermaid",
       update_dag: "更新图表",
       primary_design: "主选设计 (Primary)",
       alternative_design: "备选设计 (Alternative)"
    }
  }
};