
import React, { useState, useRef, useEffect } from 'react';
import { EvaluationInput, LABELS, Language, HistoryItem } from '../types';
import { Search, Loader2, Upload, HelpCircle, FileText, CheckCircle2, AlertCircle, Sparkles, History, Clock, ChevronRight, FileSpreadsheet, FileJson, X, FileCode, Plus, Globe, ShieldAlert, Info } from 'lucide-react';

interface Props {
  language: Language;
  isLoading: boolean;
  onSubmit: (input: EvaluationInput) => void;
  initialData?: EvaluationInput | null;
  history: HistoryItem[];
  onLoadHistory: (item: HistoryItem) => void;
}

interface UploadedFile {
    name: string;
    count: number;
    content: string; // The formatted references string
}

const EvaluatorForm: React.FC<Props> = ({ language, isLoading, onSubmit, initialData, history, onLoadHistory }) => {
  const [input, setInput] = useState<EvaluationInput>({
    topic: '',
    population: '',
    data: '',
    timeframe: 5,
    references: '',
    enableOnlineSearch: true
  });
  const [showGuide, setShowGuide] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [dataQualityTags, setDataQualityTags] = useState<string[]>([]);
  
  // Track individual files to allow removal
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refFileInputRef = useRef<HTMLInputElement>(null);

  const t = LABELS[language];

  // Reconstruct file list state if loading from history (approximation)
  useEffect(() => {
    if (initialData) {
      setInput(initialData);
      if (initialData.references && uploadedFiles.length === 0) {
          // If loaded from history, treat as one "Historic Upload"
          const count = initialData.references.split('\n').filter(l => l.trim().startsWith('[')).length;
          if (count > 0) {
              setUploadedFiles([{ name: 'Historic Data / Input', count, content: initialData.references }]);
          }
      }
    }
  }, [initialData]);

  // Sync uploadedFiles state to input.references string
  useEffect(() => {
      const combinedRefs = uploadedFiles.map(f => f.content).join('\n\n');
      setInput(prev => ({ ...prev, references: combinedRefs }));
  }, [uploadedFiles]);

  // Simple heuristic check for data variables
  useEffect(() => {
    const text = input.data.toLowerCase();
    const tags = [];
    if (text.includes('id') || text.includes('patient') || text.includes('subject')) tags.push('ID');
    if (text.includes('time') || text.includes('date') || text.includes('year')) tags.push('Time');
    if (text.includes('cost') || text.includes('outcome') || text.includes('status')) tags.push('Outcome');
    if (text.includes('treatment') || text.includes('intervention') || text.includes('policy')) tags.push('Intervention');
    setDataQualityTags(tags);
  }, [input.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
  };

  const loadExample = (type: 'policy' | 'clinical' | 'econ') => {
      if (type === 'policy') {
          setInput({
              topic: language === 'zh' ? '长期护理保险制度对家庭医疗支出的影响评估' : 'Impact of Long-term Care Insurance on Household Medical Expenditure',
              population: language === 'zh' ? '2015-2020年 45岁以上中老年家庭' : 'Households with members aged 45+ from 2015-2020',
              data: language === 'zh' ? 'CHARLS 面板数据：包含 Household_ID, Year, City_Code (实施试点), Medical_Exp, Out_of_pocket, Caregiving_Hours, ADL_Score' : 'CHARLS Panel Data: Household_ID, Year, City_Code (Pilot status), Medical_Exp, Out_of_pocket, Caregiving_Hours, ADL_Score',
              timeframe: 5,
              references: '',
              enableOnlineSearch: true
          });
      } else if (type === 'clinical') {
          setInput({
              topic: language === 'zh' ? '服用他汀类药物对老年高血压患者心血管事件的预防效果' : 'Effectiveness of Statins in Preventing CVD Events in Elderly Hypertensive Patients',
              population: language === 'zh' ? '65岁以上原发性高血压确诊患者，无CVD既往史' : 'Patients aged 65+ with primary hypertension, no history of CVD',
              data: language === 'zh' ? 'EMR 电子病历：Patient_ID, Age, Sex, BMI, BP_Level, Lipid_Profile, Statin_Use (Yes/No), CVD_Event_Date, Death_Date, Comorbidities_CCI' : 'EMR Data: Patient_ID, Age, Sex, BMI, BP_Level, Lipid_Profile, Statin_Use, CVD_Event_Date, Death_Date, Comorbidities_CCI',
              timeframe: 3,
              references: '',
              enableOnlineSearch: true
          });
      } else {
          setInput({
              topic: language === 'zh' ? '空气污染对居民心理健康的影响：基于断点回归设计' : 'Impact of Air Pollution on Mental Health: A Regression Discontinuity Design',
              population: language === 'zh' ? '淮河以南/以北居民' : 'Residents North/South of Huai River',
              data: language === 'zh' ? 'CFPS 数据 + 空气质量监测站数据：Individual_ID, CES-D Score, City, Distance_to_Huai_River, AQI, PM2.5, Temperature' : 'CFPS + Air Quality Station: Individual_ID, CES-D Score, City, Distance_to_Huai_River, AQI, PM2.5, Temperature',
              timeframe: 5,
              references: '',
              enableOnlineSearch: true
          });
      }
      setUploadedFiles([]);
  };

  const handleDataFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInput(prev => ({
          ...prev,
          data: (prev.data + '\n\n[Uploaded Data Dictionary]:\n' + content).trim()
        }));
      }
    };
    reader.readAsText(file);
  };

  // --- Bibliography Parsing Logic ---

  const parseRIS = (content: string) => {
      // RIS format: ER  - denotes end of record
      const entries = content.split(/ER\s{1,2}-/g);
      return entries.map(entry => {
          const title = (entry.match(/(?:TI|T1)\s{1,2}-\s+(.*)/)?.[1] || '').trim();
          const year = (entry.match(/(?:PY|Y1)\s{1,2}-\s+(\d{4})/)?.[1] || '').trim();
          const journal = (entry.match(/(?:JO|T2|JA)\s{1,2}-\s+(.*)/)?.[1] || '').trim();
          const abs = (entry.match(/(?:AB|N2)\s{1,2}-\s+(.*)/)?.[1] || '').trim();
          if (!title) return null;
          return { title, year, journal, abs };
      }).filter(Boolean);
  };

  const parseEndNote = (content: string) => {
    // EndNote Export format (.enw): blank lines separate records. Tags start with %
    const entries = content.split(/\n\s*\n/);
    return entries.map(entry => {
        const title = (entry.match(/^%T\s+(.*)/m)?.[1] || '').trim();
        const year = (entry.match(/^%D\s+(.*)/m)?.[1] || '').trim();
        const journal = (entry.match(/^%J\s+(.*)/m)?.[1] || '').trim();
        const abs = (entry.match(/^%X\s+(.*)/m)?.[1] || '').trim();
        if (!title) return null;
        return { title, year, journal, abs };
    }).filter(Boolean);
  };

  const parsePubMed = (content: string) => {
    const entries = content.split(/\n\s*\n/);
    return entries.map(entry => {
        const title = (entry.match(/^TI\s*-\s+(.*)/m)?.[1] || '').trim();
        const dateLine = (entry.match(/^DP\s*-\s+(.*)/m)?.[1] || '');
        const year = dateLine.match(/\d{4}/)?.[0] || '';
        const journal = (entry.match(/^JT\s*-\s+(.*)/m)?.[1] || '').trim();
        const abs = (entry.match(/^AB\s*-\s+(.*)/m)?.[1] || '').trim();
        if (!title) return null;
        return { title, year, journal, abs };
    }).filter(Boolean);
  };

  const parseBibTeX = (content: string) => {
      const matches = [...content.matchAll(/@\w+\s*\{([^,]+),[\s\S]*?\}/g)];
      return matches.map(match => {
          const block = match[0];
          const title = (block.match(/title\s*=\s*[\{"](.*?)[\}"]/i)?.[1] || '').replace(/[\{\}]/g, '');
          const year = (block.match(/year\s*=\s*[\{"]?(\d{4})[\}"]?/i)?.[1] || '');
          const journal = (block.match(/journal\s*=\s*[\{"](.*?)[\}"]/i)?.[1] || '').replace(/[\{\}]/g, '');
          const abs = (block.match(/abstract\s*=\s*[\{"](.*?)[\}"]/i)?.[1] || '').replace(/[\{\}]/g, '');
          if (!title) return null;
          return { title, year, journal, abs };
      }).filter(Boolean);
  };

  const parseDelimited = (content: string, separator: string) => {
      const lines = content.split('\n');
      if (lines.length < 2) return [];
      const headers = lines[0].toLowerCase().split(separator).map(h => h.trim().replace(/"/g, ''));
      
      const titleIdx = headers.findIndex(h => h.includes('title'));
      const yearIdx = headers.findIndex(h => h.includes('year') || h.includes('date'));
      const journalIdx = headers.findIndex(h => h.includes('journal') || h.includes('source'));
      const absIdx = headers.findIndex(h => h.includes('abstract'));

      if (titleIdx === -1) return [];

      return lines.slice(1).map(line => {
          const cols = line.split(separator); 
          const clean = (s: string) => s ? s.replace(/^"|"$/g, '').trim() : '';
          
          if (!cols[titleIdx]) return null;
          return {
              title: clean(cols[titleIdx]),
              year: yearIdx > -1 ? clean(cols[yearIdx]) : '',
              journal: journalIdx > -1 ? clean(cols[journalIdx]) : '',
              abs: absIdx > -1 ? clean(cols[absIdx]) : ''
          };
      }).filter(Boolean);
  };

  const parseRDF = (content: string) => {
      try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(content, "text/xml");
          const allElements = xmlDoc.getElementsByTagName("*");
          const result = [];
          
          for (let i = 0; i < allElements.length; i++) {
              const el = allElements[i];
              const titleNode = el.getElementsByTagName("dc:title")[0] || el.getElementsByTagName("bib:title")[0];
              
              if (titleNode && titleNode.textContent) {
                  const title = titleNode.textContent;
                  const dateNode = el.getElementsByTagName("dc:date")[0];
                  const year = dateNode ? dateNode.textContent?.slice(0, 4) : '';
                  const absNode = el.getElementsByTagName("dc:description")[0] || el.getElementsByTagName("bib:abstract")[0];
                  const sourceNode = el.getElementsByTagName("dc:source")[0] || el.getElementsByTagName("bib:journal")[0];
                  
                  if (title.length > 5) {
                    result.push({ 
                        title, 
                        year: year || '', 
                        journal: sourceNode?.textContent || '', 
                        abs: absNode?.textContent || '' 
                    });
                  }
              }
          }
          return result;
      } catch (e) {
          console.error("RDF Parse failed", e);
          return [];
      }
  };

  const handleMultipleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const targetFiles = e.target.files;
      if (!targetFiles) return;

      const files: File[] = Array.from(targetFiles);
      if (files.length === 0) return;

      const newFiles: UploadedFile[] = [];

      for (const file of files) {
          const content = await file.text();
          let parsed: any[] = [];
          const name = file.name.toLowerCase();

          try {
             if (name.endsWith('.ris')) parsed = parseRIS(content);
             else if (name.endsWith('.bib')) parsed = parseBibTeX(content);
             else if (name.endsWith('.csv')) parsed = parseDelimited(content, ',');
             else if (name.endsWith('.tsv')) parsed = parseDelimited(content, '\t');
             else if (name.endsWith('.enw')) parsed = parseEndNote(content);
             else if (name.endsWith('.rdf') || name.endsWith('.xml')) parsed = parseRDF(content);
             else if (name.endsWith('.txt')) {
                 if (content.includes('TI  -')) parsed = parsePubMed(content);
                 else parsed = content.split('\n').filter(l => l.length > 20).map(l => ({ title: l.trim(), year: '', journal: '', abs: '' }));
             }

             // Clean and Deduplicate per file
             const unique = parsed.filter((v, i, a) => v && v.title && a.findIndex(t => t?.title === v?.title) === i) as any[];

             if (unique.length > 0) {
                 const formattedText = unique.slice(0, 50).map((p, i) => 
                     `[${i+1}] ${p.title} (${p.year || 'n.d.'}) - ${p.journal || 'Unknown Source'}. ${p.abs ? 'Abs: ' + p.abs.slice(0, 200) + '...' : ''}`
                 ).join('\n');
                 
                 newFiles.push({
                     name: file.name,
                     count: unique.length,
                     content: formattedText
                 });
             }
          } catch (err) {
              console.error(`Failed to parse ${file.name}`, err);
          }
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      // Reset input
      if (refFileInputRef.current) refFileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
      setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const totalPaperCount = uploadedFiles.reduce((acc, f) => acc + f.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
      
      {/* History Modal */}
      {showHistory && (
          <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8 animate-in fade-in">
              <div className="bg-white border border-zinc-200 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[600px]">
                  <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                      <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                          <History className="w-4 h-4" /> {t.history_btn}
                      </h3>
                      <button onClick={() => setShowHistory(false)} className="text-zinc-400 hover:text-zinc-600">✕</button>
                  </div>
                  <div className="overflow-y-auto p-2">
                      {history.length === 0 ? (
                          <div className="p-8 text-center text-zinc-400 text-sm">{t.history_empty}</div>
                      ) : (
                          history.map((item) => (
                              <button 
                                key={item.id}
                                onClick={() => { onLoadHistory(item); setShowHistory(false); }}
                                className="w-full text-left p-4 hover:bg-zinc-50 rounded-xl transition-colors border-b border-zinc-50 last:border-0 group"
                              >
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="text-xs font-mono text-zinc-400">{new Date(item.timestamp).toLocaleString()}</span>
                                      <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-600" />
                                  </div>
                                  <div className="font-bold text-sm text-zinc-800 line-clamp-2">{item.topic}</div>
                                  <div className="flex gap-2 mt-2">
                                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-bold">
                                         {item.result.executive_summary.bottom_line}
                                      </span>
                                  </div>
                              </button>
                          ))
                      )}
                  </div>
              </div>
          </div>
      )}

      <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg shadow-zinc-200/50 border border-zinc-100 p-8">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                    {t.input_section}
                    <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Expert</span>
                </h2>
                <div className="flex gap-2 mt-2">
                    <span className="text-xs text-zinc-400 font-bold">{t.examples.label}</span>
                    <button type="button" onClick={() => loadExample('policy')} className="text-xs text-zinc-600 hover:text-zinc-900 underline decoration-dotted">{t.examples.btn1}</button>
                    <button type="button" onClick={() => loadExample('clinical')} className="text-xs text-zinc-600 hover:text-zinc-900 underline decoration-dotted">{t.examples.btn2}</button>
                    <button type="button" onClick={() => loadExample('econ')} className="text-xs text-zinc-600 hover:text-zinc-900 underline decoration-dotted">{t.examples.btn3}</button>
                </div>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowHistory(true)}
                    className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 px-3 py-2 rounded-lg transition-colors"
                >
                    <History className="w-4 h-4" /> {t.history_btn}
                </button>
                <button 
                    onClick={() => setShowGuide(!showGuide)}
                    className="lg:hidden text-zinc-500 hover:text-zinc-800 transition-colors p-2"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>
        </div>
      
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Step 1 */}
          <div className="relative pl-6 border-l-2 border-zinc-100 hover:border-zinc-300 transition-colors">
            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-100 border-2 border-white ring-1 ring-zinc-200"></span>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              1. {t.topic_label}
            </label>
            <textarea
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none h-24 text-zinc-800 placeholder-zinc-400 text-sm leading-relaxed"
              placeholder={t.topic_placeholder}
              value={input.topic}
              onChange={(e) => setInput({ ...input, topic: e.target.value })}
            />
          </div>

          {/* Step 2 */}
          <div className="relative pl-6 border-l-2 border-zinc-100 hover:border-zinc-300 transition-colors">
            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-100 border-2 border-white ring-1 ring-zinc-200"></span>
            <label className="block text-sm font-bold text-zinc-900 mb-2">
              2. {t.pop_label}
            </label>
            <input
              type="text"
              required
              className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-800 placeholder-zinc-400 text-sm"
              placeholder={t.pop_placeholder}
              value={input.population}
              onChange={(e) => setInput({ ...input, population: e.target.value })}
            />
          </div>
          
          {/* Step 3 */}
          <div className="relative pl-6 border-l-2 border-zinc-100 hover:border-zinc-300 transition-colors">
            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-100 border-2 border-white ring-1 ring-zinc-200"></span>
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-zinc-900">3. {t.data_label}</label>
                <div className="flex gap-2">
                     {/* Data Quality Indicators */}
                    {dataQualityTags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            <CheckCircle2 className="w-3 h-3" /> {tag}
                        </span>
                    ))}
                    <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                    >
                        <Upload className="w-3.5 h-3.5" />
                        {t.upload_btn}
                    </button>
                </div>
            </div>
            <div className="relative">
              <textarea
                required
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all h-36 text-sm font-mono text-zinc-600 placeholder-zinc-400"
                placeholder={t.data_placeholder}
                value={input.data}
                onChange={(e) => setInput({ ...input, data: e.target.value })}
              />
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.txt,.md" 
                onChange={handleDataFileUpload}
              />
            </div>
             {/* Data Check Warning */}
             {input.data.length > 20 && dataQualityTags.length < 2 && (
                 <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                     <AlertCircle className="w-4 h-4" />
                     {language === 'zh' ? '提示：似乎缺少时间(Year/Date)或ID变量，可能影响面板数据分析。' : 'Tip: Missing Time or ID variables may hinder panel data analysis.'}
                 </div>
             )}
          </div>

          {/* Step 4: Evidence Upload (Multi-File & Search Toggle) */}
          <div className="relative pl-6 border-l-2 border-zinc-100 hover:border-zinc-300 transition-colors">
            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-zinc-100 border-2 border-white ring-1 ring-zinc-200"></span>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <label className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    4. {language === 'zh' ? '上传检索文献包 (Evidence Pack)' : 'Evidence Pack Upload'}
                    <span className="text-[10px] bg-zinc-100 text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded font-medium uppercase">
                        {language === 'zh' ? '可选' : 'Optional'}
                    </span>
                </label>
                
                {/* Search Toggle Switch */}
                <div className="flex items-center gap-3 bg-zinc-50 p-1.5 rounded-lg border border-zinc-200">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${input.enableOnlineSearch ? 'text-zinc-400' : 'text-zinc-900'}`}>
                        {language === 'zh' ? '仅使用上传文件' : 'Upload Only'}
                    </span>
                    <button 
                        type="button"
                        onClick={() => setInput(prev => ({ ...prev, enableOnlineSearch: !prev.enableOnlineSearch }))}
                        className={`relative w-10 h-5 rounded-full transition-colors ${input.enableOnlineSearch ? 'bg-emerald-500' : 'bg-zinc-300'}`}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${input.enableOnlineSearch ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${input.enableOnlineSearch ? 'text-emerald-700' : 'text-zinc-400'}`}>
                        <Globe className="w-3 h-3" />
                        {language === 'zh' ? '启用 AI 联网知识库' : 'AI Online Search'}
                    </span>
                </div>
            </div>

            {/* Disclaimer for Internal Knowledge Base in Hybrid Mode */}
            {input.enableOnlineSearch && (
                 <div className="mb-4 animate-in fade-in slide-in-from-top-1">
                    <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100 text-xs leading-relaxed">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            {language === 'zh' 
                             ? <span><strong>注意：</strong>由于技术限制，混合模式下将使用 AI 的<strong>“内置学术知识库”</strong>（包含海量历史文献数据）对您的文件进行补充，而非调用实时爬虫。这能确保分析的稳定性和格式正确性。</span>
                             : <span><strong>Note:</strong> In Hybrid Mode, the AI uses its <strong>"Internal Academic Knowledge Base"</strong> (pre-trained on vast historical data) to supplement your files, rather than a live search crawler. This ensures analysis stability and JSON integrity.</span>
                            }
                        </div>
                    </div>
                 </div>
            )}

            {/* Upload Area */}
            <div className="space-y-3">
                
                {/* File List */}
                {uploadedFiles.length > 0 && (
                    <div className="flex flex-col gap-2 mb-3">
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-white border border-zinc-200 rounded-xl shadow-sm animate-in slide-in-from-top-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                        <FileText className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-zinc-800 line-clamp-1">{file.name}</div>
                                        <div className="text-[10px] text-zinc-500">Parsed {file.count} refs</div>
                                    </div>
                                </div>
                                <button onClick={() => removeFile(idx)} className="text-zinc-400 hover:text-red-500 p-2">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Dropzone */}
                <div 
                    className="w-full p-6 border-2 border-dashed border-zinc-200 rounded-xl transition-all flex flex-col items-center justify-center gap-3 hover:border-zinc-400 hover:bg-zinc-50 cursor-pointer bg-zinc-50/50"
                    onClick={() => refFileInputRef.current?.click()}
                >
                    <input 
                        type="file" 
                        ref={refFileInputRef} 
                        className="hidden" 
                        accept=".ris,.bib,.csv,.tsv,.enw,.rdf,.xml,.txt" 
                        multiple // Support multiple files
                        onChange={handleMultipleFiles}
                    />
                    
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-1">
                         <Plus className="w-5 h-5" />
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2 px-4 max-w-sm">
                            {[
                                { ext: 'RIS', name: 'Zotero/RefWorks' },
                                { ext: 'BibTeX', name: 'LaTeX/JabRef' },
                                { ext: 'EndNote', name: '.enw' },
                                { ext: 'CSV/TSV', name: 'Excel' },
                                { ext: 'Zotero/RDF', name: 'XML' },
                            ].map((f) => (
                                <span key={f.ext} className="text-[10px] bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-500 font-mono">
                                    {f.ext}
                                </span>
                            ))}
                    </div>
                    <p className="text-xs text-zinc-500 font-medium text-center">
                        {language === 'zh' ? '点击上传 WoS / PubMed / CNKI / Zotero / RefWorks 导出的文件 (支持多选)' : 'Click to upload multiple files (RIS, BibTeX, Zotero, RefWorks, CSV...)'}
                    </p>
                </div>
            </div>
            
            {/* Contextual Warning/Success Messages */}
            <div className="mt-3 space-y-2">
                {totalPaperCount > 0 && (
                    <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100 flex items-start gap-2">
                        <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5"/>
                        {language === 'zh' 
                            ? `已解析 ${totalPaperCount} 篇文献。AI 将基于这些文献进行分析。` 
                            : `Total ${totalPaperCount} references loaded. Analysis will be based on these papers.`}
                    </div>
                )}
                {!input.enableOnlineSearch && totalPaperCount === 0 && (
                    <div className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100 flex items-start gap-2">
                        <ShieldAlert className="w-3 h-3 shrink-0 mt-0.5"/>
                        {language === 'zh' 
                            ? '警告：您已关闭 AI 联网检索，且未上传任何文件。报告可能显示“未找到证据”。' 
                            : 'Warning: Online search is OFF and no files uploaded. Report may show "Missing Evidence".'}
                    </div>
                )}
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-semibold text-zinc-700 mb-3">
                {t.timeframe_label}: <span className="font-bold text-zinc-900">{input.timeframe}</span> {language === 'en' ? 'Years' : '年'}
            </label>
            <input 
                type="range" 
                min="1" 
                max="10" 
                value={input.timeframe} 
                onChange={(e) => setInput({...input, timeframe: parseInt(e.target.value)})}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl shadow-lg shadow-zinc-200 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.99] mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'en' ? 'Generating Design Pack...' : '生成研究设计包...'}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {t.submit}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Guide Column */}
      {showGuide && (
            <div className="hidden lg:block lg:col-span-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100/50 h-full">
                <h3 className="font-bold text-zinc-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-zinc-400" />
                    {t.guide_title}
                </h3>
                <div className="space-y-8 relative">
                    <div className="absolute left-[11px] top-4 bottom-4 w-px bg-zinc-200"></div>
                    {t.guide_content.map((item, idx) => (
                        <div key={idx} className="relative pl-8">
                            <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border border-zinc-200 rounded-full flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                            </div>
                            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                                {item.label}
                            </div>
                            <p className="text-sm text-zinc-600 leading-relaxed">
                                {item.text}
                            </p>
                        </div>
                    ))}
                    
                    {/* New Step 4 Guide */}
                    <div className="relative pl-8">
                         <div className="absolute left-0 top-1 w-[22px] h-[22px] bg-white border border-zinc-200 rounded-full flex items-center justify-center">
                             <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                         </div>
                         <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                             Step 4: Upload & Search
                         </div>
                         <p className="text-sm text-zinc-600 leading-relaxed">
                             {language === 'zh' 
                                ? '新增：支持 Zotero/RefWorks 等多文件上传。您可选择开启或关闭 AI 联网检索。关闭后系统将仅基于您上传的文件进行分析。' 
                                : 'New: Support multi-file upload (Zotero/RefWorks). You can toggle AI Online Search. If OFF, AI uses ONLY your files.'}
                         </p>
                    </div>

                </div>
            </div>
            </div>
      )}
    </div>
  );
};

export default EvaluatorForm;
