
import React, { useState, useEffect } from 'react';
import { EvaluationResult, LABELS, Language, ExecutiveSummary, ReportMetadata, DesignOption } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { 
  CheckCircle2, AlertTriangle, XCircle, BookOpen, Layers, 
  Lightbulb, Activity, Download, ExternalLink,
  ShieldCheck, ArrowLeft, Stethoscope, Scale, FileCode, Network, Fingerprint, Calendar,
  Copy, RefreshCw, ChevronDown, ChevronUp, FileJson, AlertOctagon, Database, FileText
} from 'lucide-react';

interface Props {
  result: EvaluationResult;
  language: Language;
  onBack: () => void;
}

// Helper for safe array mapping from potentially malformed JSON
const ensureArray = (item: any): any[] => {
  if (!item) return [];
  if (Array.isArray(item)) return item;
  if (typeof item === 'string') return [item];
  if (typeof item === 'object') return [item]; // Handle single object instead of array of objects
  return [];
};

const ResultsDashboard: React.FC<Props> = ({ result, language, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'method' | 'refined' | 'journals'>('overview');
  const [showTrace, setShowTrace] = useState(false); // Collapsed by default
  const [selectedDesignIndex, setSelectedDesignIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Safe Accessors
  const dag = result.methodology?.dag || { mermaid_code: '', adjustment_set: [], do_not_adjust: [] };
  const candidateDesigns = ensureArray(result.methodology?.candidate_designs);
  
  const selectedDesign = candidateDesigns[selectedDesignIndex] || candidateDesigns[0] || {
    name: 'Standard Design',
    type: 'Primary',
    description: '',
    data_requirement: 'No design details generated.',
    key_assumptions: 'N/A',
    threats: 'N/A',
    diagnostics: 'N/A',
    python_code: '# No code generated'
  };

  // DAG State
  const [dagCode, setDagCode] = useState(dag.mermaid_code || 'graph TD\nA[Start] --> B[End]');
  
  const t = LABELS[language];

  // Initialize DAG code on result change
  useEffect(() => {
    if (dag.mermaid_code) {
      setDagCode(sanitizeMermaid(dag.mermaid_code));
    }
    setSelectedDesignIndex(0);
  }, [result, dag.mermaid_code]);

  const sanitizeMermaid = (code: string) => {
    if (!code) return 'graph TD\nError[No Code]';
    let clean = code.replace(/```mermaid/g, '').replace(/```/g, '').trim();
    if (!clean.startsWith('graph')) {
        clean = 'graph TD\n' + clean;
    }
    return clean;
  };

  const getFormulaContent = () => {
      const formula = result.methodology?.model_specification?.formula || '';
      if (!formula) return 'No model formula generated.';
      // Force block math display if strictly latex
      const trimmed = formula.trim();
      if (!trimmed.startsWith('$$')) {
          return `$$
${trimmed}
$$`;
      }
      return trimmed;
  };

  const handleCopyCode = () => {
    if (selectedDesign.python_code) {
        navigator.clipboard.writeText(selectedDesign.python_code);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // --- Export Functions ---

  const handleDownloadMarkdown = () => {
    const r = result;
    const mdContent = `
# ${t.results_title}: ${r.executive_summary?.research_question}

## Metadata
- **ID**: ${r.metadata?.project_id}
- **Date**: ${r.metadata?.generated_at}
- **Confidence**: ${r.metadata?.confidence_overall}

## 1. Executive Summary
**Primary Hypothesis**: ${r.executive_summary?.hypothesis_primary}
**Recommendation**: ${r.executive_summary?.bottom_line}

### Next Steps
${ensureArray(r.executive_summary?.next_steps).map(s => `- ${s}`).join('\n')}

## 2. Methodology
### PICO
- P: ${r.methodology?.pico?.P}
- I: ${r.methodology?.pico?.E}
- C: ${r.methodology?.pico?.C}
- O: ${r.methodology?.pico?.O}

### Selected Design: ${selectedDesign.name} (${selectedDesign.type})
${selectedDesign.description}

**Requirements**: ${selectedDesign.data_requirement}
**Diagnostics**: ${selectedDesign.diagnostics}

### DAG (Mermaid)
\`\`\`mermaid
${dagCode}
\`\`\`

### Model Specification (LaTeX)
$$
${r.methodology?.model_specification?.formula}
$$

### Code Template (Python)
\`\`\`python
${selectedDesign.python_code}
\`\`\`

## 3. Evidence Trace (Status: ${r.evidence_trace?.status})
${ensureArray(r.evidence_trace?.key_references).map((ref: any) => `- ${ref.title} (${ref.year}) - ${ref.journal}`).join('\n')}
    `;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    downloadBlob(blob, `DesignPack_${r.metadata?.project_id?.slice(0,8)}.md`);
  };

  const handleDownloadJSON = () => {
      const jsonContent = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      downloadBlob(blob, `DesignPack_${result.metadata?.project_id?.slice(0,8)}.json`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- UI Components ---

  const getRecommendationBadge = (rec: string = '') => {
    const text = language === 'zh' 
        ? (rec.includes('Recommended') && !rec.includes('Not') ? '推荐开展' : rec.includes('Not') ? '不推荐' : '有条件推荐')
        : rec;

    if (rec.includes('Recommended') && !rec.includes('Not')) {
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs tracking-wide border border-emerald-200"><CheckCircle2 className="w-4 h-4"/> {text}</span>;
    } else if (rec.includes('Not')) {
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs tracking-wide border border-red-200"><XCircle className="w-4 h-4"/> {text}</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs tracking-wide border border-amber-200"><AlertTriangle className="w-4 h-4"/> {text}</span>;
  };

  const ScoreCard = ({ label, value, rationale }: { label: string, value: number, rationale: string[] }) => (
    <div className="bg-white rounded-2xl p-6 border border-zinc-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Activity className="w-16 h-16" />
      </div>
      <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">{label}</span>
          <span className={`text-2xl font-black ${value >= 8 ? 'text-emerald-600' : value >= 5 ? 'text-amber-500' : 'text-red-500'}`}>{value}/10</span>
      </div>
      <ul className="space-y-2 mt-auto">
        {ensureArray(rationale).slice(0, 3).map((r, i) => (
            <li key={i} className="text-xs text-zinc-600 flex gap-2 leading-relaxed">
                <span className="text-zinc-300">•</span> {r}
            </li>
        ))}
      </ul>
    </div>
  );

  const MetadataHeader = ({ meta }: { meta: ReportMetadata }) => (
    <div className="flex flex-wrap gap-4 text-[10px] text-zinc-400 font-mono uppercase tracking-wider mb-6 pb-4 border-b border-zinc-100/50 print:border-zinc-200">
        <div className="flex items-center gap-1">
            <Fingerprint className="w-3 h-3" /> ID: {meta?.project_id?.slice(0,8)}
        </div>
        <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {meta?.generated_at}
        </div>
        <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" /> Confidence: <span className={meta?.confidence_overall === 'High' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{meta?.confidence_overall}</span>
        </div>
        <div className="flex items-center gap-1">
            Mode: Expert
        </div>
    </div>
  );

  const EvidenceTraceCard = () => {
      const trace = result.evidence_trace;
      const isMissing = trace?.status === 'missing';
      const sources = ensureArray(trace?.search_sources);
      // Heuristic to detect if it's purely upload based
      const isUploadOnly = sources.some(s => s.toLowerCase().includes('user') || s.toLowerCase().includes('file'));
      
      return (
        <div className={`mb-8 rounded-2xl border transition-all duration-300 overflow-hidden ${isMissing ? 'bg-red-50 border-red-200' : 'bg-zinc-50 border-zinc-200'}`}>
            <div 
                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-black/5 gap-4"
                onClick={() => setShowTrace(!showTrace)}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isMissing ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-700'}`}>
                        <Scale className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${isMissing ? 'text-red-800' : 'text-zinc-700'}`}>
                            {t.dashboard.evidence_trace}
                        </h3>
                        <div className="flex gap-2 items-center mt-1">
                             <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${isMissing ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-700'}`}>
                                 Status: {trace?.status || 'Unknown'}
                             </span>
                             {isMissing && <span className="text-xs text-red-600 font-medium">{language === 'zh' ? '警告：未检索到直接文献' : 'Warning: No direct refs found'}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     {/* Supported DBs Visual - DYNAMIC NOW based on actual result */}
                     <div className="hidden md:flex flex-wrap gap-1.5 opacity-80">
                        {sources.length > 0 ? (
                            sources.slice(0, 4).map((source, idx) => (
                                <span key={idx} className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${source.toLowerCase().includes('user') ? 'bg-blue-100 text-blue-700' : 'bg-zinc-200 text-zinc-600'}`}>
                                    {source.toLowerCase().includes('user') && <FileText className="w-3 h-3" />}
                                    {source}
                                </span>
                            ))
                        ) : (
                            <span className="text-[10px] font-bold bg-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded">No Sources</span>
                        )}
                     </div>
                     {showTrace ? <ChevronUp className="w-4 h-4 text-zinc-400"/> : <ChevronDown className="w-4 h-4 text-zinc-400"/>}
                </div>
            </div>

            {showTrace && (
                <div className="p-6 pt-0 border-t border-zinc-200/50 mt-4 animate-in slide-in-from-top-2">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div>
                            {/* Hide Queries if it is strictly file analysis (denoted by N/A) */}
                            {(!trace?.queries?.en?.includes('N/A') && !isUploadOnly) && (
                                <>
                                <p className="font-semibold text-zinc-700 mb-2">{t.dashboard.search_queries}:</p>
                                <div className="bg-white p-3 rounded-lg border border-zinc-200 font-mono text-xs text-zinc-600 mb-4 break-words shadow-sm">
                                    {trace?.queries?.en} <br/>
                                    {trace?.queries?.zh}
                                </div>
                                </>
                            )}
                            
                            <p className="font-semibold text-zinc-700 mb-2">{t.dashboard.sources}:</p>
                            <div className="flex gap-2 flex-wrap mb-4">
                                {sources.map((s, i) => (
                                    <span key={i} className={`px-2 py-1 border rounded text-xs flex items-center gap-1 ${s.toLowerCase().includes('user') ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-white border-zinc-200 text-zinc-600'}`}>
                                        {s.toLowerCase().includes('user') && <FileText className="w-3 h-3" />}
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-zinc-700 mb-2">{t.dashboard.key_refs}:</p>
                            {ensureArray(trace?.key_references).length === 0 ? (
                                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-xs border border-amber-100">
                                    {language === 'zh' ? '未找到直接参考文献。AI 基于一般方法论原则生成。' : 'No direct references found. AI generated based on general methodological principles.'}
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {ensureArray(trace?.key_references).map((ref: any, i) => (
                                        <li key={i} className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="font-medium text-zinc-900 leading-snug">{ref.title}</div>
                                            <div className="text-xs text-zinc-500 mt-1 flex flex-wrap gap-2 justify-between">
                                                <span>{ref.journal}, {ref.year}</span>
                                                {ref.doi && <span className="font-mono text-zinc-300">DOI: {ref.doi}</span>}
                                            </div>
                                            <div className="text-xs text-emerald-700 mt-2 bg-emerald-50 px-2 py-1 rounded inline-block border border-emerald-100">
                                                {ref.relevance_note}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  };

  return (
    <div className="min-h-screen mb-20 font-sans print:bg-white print:mb-0">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl shadow-lg shadow-zinc-200/50 border border-zinc-100 p-8 mb-8 print:shadow-none print:border-b print:rounded-none print:p-0 print:mb-4">
        <MetadataHeader meta={result.metadata} />
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
               <button onClick={onBack} className="md:hidden p-1.5 bg-zinc-100 rounded-full text-zinc-600 no-print"><ArrowLeft className="w-4 h-4" /></button>
               <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-tight">
                 {result.executive_summary?.research_question}
               </h1>
            </div>
            <div className="flex gap-3 items-center">
                 {getRecommendationBadge(result.executive_summary?.bottom_line)}
            </div>
          </div>
          
          <div className="flex gap-2 shrink-0 no-print">
              <button onClick={handleDownloadJSON} className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors">
                  <FileJson className="w-4 h-4"/> {t.export_json}
              </button>
              <button onClick={handleDownloadMarkdown} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-zinc-200">
                  <Download className="w-4 h-4"/> {t.export_md}
              </button>
          </div>
        </div>
      </div>

      {/* Tab A: Evidence Trace (Collapsible) */}
      <EvidenceTraceCard />

      {/* Navigation Tabs - Highlighted */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-print">
        {[
          { id: 'overview', icon: Activity, label: t.tab_overview },
          { id: 'method', icon: Layers, label: t.tab_method },
          { id: 'refined', icon: Lightbulb, label: t.tab_refined },
          { id: 'journals', icon: BookOpen, label: t.tab_journals }
        ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-5 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 shadow-sm
               ${activeTab === tab.id 
                 ? 'bg-zinc-900 text-white shadow-md scale-[1.02]' 
                 : 'bg-white text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 border border-zinc-100'
               }`}
           >
             <tab.icon className="w-4 h-4" /> <span>{tab.label}</span>
           </button>
        ))}
      </div>

      <div className="space-y-8">
        
        {/* === TAB 1: EXECUTIVE SUMMARY === */}
        <div className={`${activeTab === 'overview' ? 'block' : 'hidden'} animate-in fade-in print:block`}>
            
            {/* Scores */}
            {result.executive_summary?.scores && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:grid-cols-3">
              <ScoreCard 
                label={language === 'zh' ? '新颖性' : 'Novelty'} 
                value={result.executive_summary.scores.novelty} 
                rationale={result.executive_summary.score_rationales.novelty} 
              />
              <ScoreCard 
                label={language === 'zh' ? '可行性' : 'Feasibility'} 
                value={result.executive_summary.scores.feasibility} 
                rationale={result.executive_summary.score_rationales.feasibility} 
              />
              <ScoreCard 
                label={language === 'zh' ? '研究价值' : 'Value'} 
                value={result.executive_summary.scores.value} 
                rationale={result.executive_summary.score_rationales.value} 
              />
            </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm print:break-inside-avoid print:p-0 print:border-none print:shadow-none">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">{t.dashboard.hypothesis_title}</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs font-bold text-zinc-500 uppercase">{t.dashboard.primary_hypo}</span>
                                <p className="text-zinc-900 font-medium">{result.executive_summary?.hypothesis_primary}</p>
                            </div>
                             <div>
                                <span className="text-xs font-bold text-zinc-500 uppercase">{t.dashboard.why_matters}</span>
                                <ul className="list-disc list-inside text-zinc-700 text-sm mt-1 space-y-1">
                                    {ensureArray(result.executive_summary?.why_it_matters).map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-zinc-100 shadow-sm print:break-inside-avoid print:p-0 print:border-none print:shadow-none">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">{t.dashboard.novelty_verify}</h3>
                        <div className="space-y-3">
                            {ensureArray(result.executive_summary?.novelty_claims).map((claim, i) => (
                                <div key={i} className="flex gap-4 items-start p-3 bg-zinc-50 rounded-xl print:bg-transparent print:p-0">
                                    <div className={`shrink-0 px-2 py-1 rounded text-[10px] font-bold uppercase ${claim.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-600'}`}>
                                        {claim.status}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900">{claim.claim}</p>
                                        <p className="text-xs text-zinc-500 mt-1">{claim.evidence}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 print:hidden">
                    <div className="bg-zinc-900 text-white rounded-2xl p-6 shadow-xl print:bg-black print:text-white">
                        <h3 className="font-bold text-lg mb-4 text-white">{t.dashboard.next_steps}</h3>
                        <ul className="space-y-3">
                            {ensureArray(result.executive_summary?.next_steps).map((step, i) => (
                                <li key={i} className="flex gap-3 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-xs shrink-0">{i+1}</span>
                                    <span className="text-zinc-300">{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        {/* === TAB 2: METHODOLOGY === */}
        <div className={`${activeTab === 'method' ? 'block' : 'hidden'} animate-in fade-in space-y-8 print:hidden`}>
            
            {/* PICO & Estimand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:break-inside-avoid">
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><Layers className="w-4 h-4"/> {t.dashboard.pico_title}</h3>
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-[30px_1fr] gap-2"><span className="font-bold text-zinc-400">P</span> <span>{result.methodology?.pico?.P}</span></div>
                        <div className="grid grid-cols-[30px_1fr] gap-2"><span className="font-bold text-zinc-400">I</span> <span>{result.methodology?.pico?.E}</span></div>
                        <div className="grid grid-cols-[30px_1fr] gap-2"><span className="font-bold text-zinc-400">C</span> <span>{result.methodology?.pico?.C}</span></div>
                        <div className="grid grid-cols-[30px_1fr] gap-2"><span className="font-bold text-zinc-400">O</span> <span>{result.methodology?.pico?.O}</span></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                     <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {t.dashboard.identification_strategy}</h3>
                     <div className="space-y-3 text-sm">
                         <div>
                            <span className="block text-xs font-bold text-zinc-400 uppercase mb-1">{t.dashboard.estimand}</span>
                            <div className="font-medium bg-zinc-50 p-2 rounded">{result.methodology?.estimand?.primary}</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <span className="block text-xs font-bold text-zinc-400 uppercase mb-1">{t.dashboard.time_zero}</span>
                                <div className="text-zinc-600">{result.methodology?.estimand?.time_zero}</div>
                             </div>
                             <div>
                                <span className="block text-xs font-bold text-zinc-400 uppercase mb-1">{t.dashboard.follow_up}</span>
                                <div className="text-zinc-600">{result.methodology?.estimand?.follow_up}</div>
                             </div>
                         </div>
                     </div>
                </div>
            </div>

            {/* Design Selector Tabs (Primary / Backup) */}
            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm print:break-inside-avoid overflow-hidden">
                <div className="bg-zinc-50 border-b border-zinc-100 px-6 pt-6 pb-0 flex gap-2 overflow-x-auto">
                    {candidateDesigns.map((design: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedDesignIndex(idx)}
                            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                                selectedDesignIndex === idx 
                                ? 'border-zinc-900 text-zinc-900' 
                                : 'border-transparent text-zinc-400 hover:text-zinc-600'
                            }`}
                        >
                            {design.name}
                            {design.type === 'Primary' 
                                ? <span className="text-[10px] bg-zinc-900 text-white px-1.5 py-0.5 rounded uppercase">{t.dashboard.primary_design}</span>
                                : <span className="text-[10px] bg-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded uppercase">{t.dashboard.alternative_design}</span>
                            }
                        </button>
                    ))}
                </div>
                
                <div className="p-8">
                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                        {t.dashboard.design_selection}: <span className="text-blue-600">{selectedDesign.name}</span>
                    </h3>
                    <p className="text-sm text-zinc-500 mb-6">{selectedDesign.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 text-sm">
                            <div className="bg-zinc-50 p-4 rounded-xl">
                                <span className="font-bold text-zinc-900 block mb-1">{t.dashboard.data_needed}</span>
                                <p className="text-zinc-600">{selectedDesign.data_requirement}</p>
                            </div>
                            <div>
                                <span className="font-bold text-zinc-900 block mb-1">{t.dashboard.assumptions}</span>
                                <p className="text-zinc-600">{selectedDesign.key_assumptions}</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-sm">
                             <div>
                                <span className="font-bold text-zinc-900 block mb-1">{t.dashboard.diagnostics}</span>
                                <p className="text-zinc-600">{selectedDesign.diagnostics}</p>
                            </div>
                            <div>
                                <span className="font-bold text-zinc-900 block mb-1">Threats</span>
                                <p className="text-red-600">{selectedDesign.threats}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DAG & Model */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid">
                 <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2"><Network className="w-4 h-4"/> {t.dashboard.causal_dag}</h3>
                        <div 
                             onClick={() => {navigator.clipboard.writeText(dagCode);}}
                             className="text-xs cursor-pointer flex items-center gap-1 text-zinc-500 hover:text-zinc-900 bg-zinc-100 px-2 py-1 rounded"
                        >
                            <Copy className="w-3 h-3" /> {t.dashboard.edit_dag}
                        </div>
                    </div>
                    
                    {/* Simplified DAG Display: Just Code */}
                    <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-lg p-4 overflow-auto min-h-[200px]">
                        <pre className="font-mono text-xs text-zinc-600 whitespace-pre-wrap">
                            {dagCode}
                        </pre>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                        <div className="flex gap-2 text-xs">
                             <div className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">{t.dashboard.adjustment_set}:</div>
                             <div className="text-zinc-600">{ensureArray(dag.adjustment_set).join(', ')}</div>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Scale className="w-4 h-4"/> {t.dashboard.model_spec}</h3>
                    <div className="prose prose-zinc prose-sm max-w-none overflow-x-auto p-4 bg-zinc-50 rounded-xl mb-4">
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {getFormulaContent()}
                        </ReactMarkdown>
                    </div>
                    
                    {/* Raw LaTeX Code Block for Word */}
                     <div className="mb-4">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block">LaTeX Source (Copy for Word)</span>
                        <div className="bg-zinc-900 text-zinc-300 p-3 rounded-lg font-mono text-xs overflow-x-auto select-all cursor-text" onClick={() => navigator.clipboard.writeText(result.methodology?.model_specification?.formula)}>
                            {result.methodology?.model_specification?.formula || "N/A"}
                        </div>
                    </div>

                    <div className="space-y-2 text-sm">
                         <div className="flex justify-between border-b border-zinc-50 py-2">
                             <span className="text-zinc-500">{t.dashboard.se_clustering}</span>
                             <span className="font-medium">{result.methodology?.model_specification?.se_clustering}</span>
                         </div>
                         <div className="flex justify-between border-b border-zinc-50 py-2">
                             <span className="text-zinc-500">{t.dashboard.fixed_effects}</span>
                             <span className="font-medium">{result.methodology?.model_specification?.fixed_effects}</span>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Dynamic Code Template Based on Selection */}
            <div className="bg-zinc-900 rounded-3xl p-8 shadow-xl print:break-inside-avoid">
                <div className="flex justify-between items-center mb-4 text-zinc-400">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <FileCode className="w-4 h-4"/> 
                        {selectedDesign.name} - Python Implementation
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono opacity-50 hidden md:inline-block">pandas / linearmodels</span>
                        <button 
                             onClick={handleCopyCode}
                             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border ${copiedCode ? 'bg-emerald-900/30 text-emerald-400 border-emerald-900' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border-transparent'}`}
                        >
                            {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedCode ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制代码' : 'Copy Code')}
                        </button>
                    </div>
                </div>
                <pre className="font-mono text-xs md:text-sm text-zinc-300 overflow-x-auto p-4 bg-black/30 rounded-xl border border-zinc-700/50">
                    {selectedDesign.python_code || "# Code not available for this design"}
                </pre>
            </div>
        </div>

        {/* === TAB 3: REFINEMENT === */}
        <div className={`${activeTab === 'refined' ? 'block' : 'hidden'} animate-in fade-in space-y-8 print:hidden`}>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                     <h3 className="font-bold text-emerald-900 mb-2">{t.dashboard.mvp_route}</h3>
                     <p className="text-sm text-emerald-800 leading-relaxed">{result.mvp_route}</p>
                 </div>
                 <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100">
                     <h3 className="font-bold text-purple-900 mb-2">{t.dashboard.high_route}</h3>
                     <p className="text-sm text-purple-800 leading-relaxed">{result.high_standard_route}</p>
                 </div>
             </div>
             
             {/* Refined Topics List */}
             <div className="grid grid-cols-1 gap-6">
                 {ensureArray(result.refined_topics).map((topic: any, i) => (
                     <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-all">
                         <div className="flex justify-between items-start mb-4">
                             <h4 className="font-bold text-lg text-zinc-900">{topic.title}</h4>
                             <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${topic.risk_level === 'Low' ? 'bg-green-100 text-green-700' : topic.risk_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                 {topic.risk_level} {t.dashboard.risk}
                             </span>
                         </div>
                         <p className="text-sm text-zinc-500 font-mono mb-4 bg-zinc-50 p-2 rounded">{topic.one_sentence_rq}</p>
                         <div className="grid grid-cols-2 gap-4 text-sm text-zinc-600 mb-4">
                             <div><span className="font-bold text-zinc-900">Design:</span> {topic.design}</div>
                             <div><span className="font-bold text-zinc-900">Data Gate:</span> {topic.data_gate}</div>
                         </div>
                         <div>
                             <span className="font-bold text-xs text-zinc-400 uppercase">{t.dashboard.why_better}</span>
                             <ul className="list-disc list-inside text-sm text-zinc-600 mt-1">
                                 {ensureArray(topic.why_better).map((r: any,idx: number) => <li key={idx}>{r}</li>)}
                             </ul>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

        {/* === TAB 4: JOURNALS === */}
        <div className={`${activeTab === 'journals' ? 'block' : 'hidden'} animate-in fade-in print:hidden`}>
             <div className="grid grid-cols-1 gap-6">
                 {ensureArray(result.journal_fit).map((j: any, i) => (
                     <div key={i} className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm print:break-inside-avoid">
                         <div className="flex justify-between items-center mb-6">
                             <div>
                                 <h3 className="font-bold text-xl text-zinc-900">{j.name}</h3>
                                 <span className="text-xs font-bold bg-zinc-900 text-white px-2 py-1 rounded mt-1 inline-block">{j.tier}</span>
                             </div>
                             <a 
                                href={`https://scholar.google.com/scholar?q=source:"${encodeURIComponent(j.name)}"`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-zinc-50 rounded-full hover:bg-zinc-100 transition-colors"
                             >
                                 <ExternalLink className="w-4 h-4 text-zinc-500" />
                             </a>
                         </div>
                         <div className="space-y-4">
                             <div className="bg-zinc-50 p-4 rounded-xl">
                                 <p className="text-sm text-zinc-700"><span className="font-bold">Why Fit:</span> {j.fit_reason}</p>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                 <div>
                                     <span className="font-bold text-zinc-900 block mb-1">{t.dashboard.positioning}</span>
                                     <p className="text-zinc-600">{j.positioning_tip}</p>
                                 </div>
                                 <div>
                                     <span className="font-bold text-zinc-900 block mb-1">{t.dashboard.risk_note}</span>
                                     <p className="text-red-600 flex items-center gap-1">
                                         <AlertOctagon className="w-3 h-3"/> {j.risk_notes}
                                     </p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;
