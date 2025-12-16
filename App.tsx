
import React, { useState, useEffect } from 'react';
import { Compass, Globe2, ArrowLeft, Settings, Zap } from 'lucide-react';
import { EvaluationInput, EvaluationResult, LABELS, Language, UserSettings, HistoryItem } from './types';
import { evaluateResearchTopic } from './services/geminiService';
import EvaluatorForm from './components/EvaluatorForm';
import ResultsDashboard from './components/ResultsDashboard';
import ProcessVisualizer from './components/ProcessVisualizer';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { DEFAULT_ENDPOINTS, DEFAULT_MODELS } from './services/llmService';

type ViewState = 'landing' | 'input' | 'processing' | 'result';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('zh');
  const [view, setView] = useState<ViewState>('landing');
  const [inputData, setInputData] = useState<EvaluationInput | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    // Load from local storage or defaults
    const saved = localStorage.getItem('sci_settings');
    const defaultSettings = {
      provider: 'qwen' as const,
      keys: { qwen: '', kimi: '', gemini: '', deepseek: '', zhipu: '', openai: '' },
      models: { qwen: '', kimi: '', gemini: '', deepseek: '', zhipu: '', openai: '' },
      baseUrls: { 
          qwen: DEFAULT_ENDPOINTS.qwen, 
          kimi: DEFAULT_ENDPOINTS.kimi, 
          gemini: DEFAULT_ENDPOINTS.gemini,
          deepseek: DEFAULT_ENDPOINTS.deepseek,
          zhipu: DEFAULT_ENDPOINTS.zhipu,
          openai: DEFAULT_ENDPOINTS.openai,
      }
    };

    if (saved) {
        const parsed = JSON.parse(saved);
        // Deep merge to ensure new keys/providers are present even if old settings exist
        return { 
            ...defaultSettings, 
            ...parsed, 
            keys: { ...defaultSettings.keys, ...(parsed.keys || {}) },
            models: { ...defaultSettings.models, ...(parsed.models || {}) }, 
            baseUrls: { ...defaultSettings.baseUrls, ...(parsed.baseUrls || {}) } 
        };
    }
    return defaultSettings;
  });

  const t = LABELS[language];

  // Load History on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('sci_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (input: EvaluationInput, result: EvaluationResult) => {
    const newItem: HistoryItem = {
      id: result.metadata.project_id || Date.now().toString(),
      timestamp: Date.now(),
      topic: input.topic,
      input: input,
      result: result
    };
    
    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 20); // Keep last 20
      localStorage.setItem('sci_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSettingsSave = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    localStorage.setItem('sci_settings', JSON.stringify(newSettings));
  };

  const handleEvaluation = async (input: EvaluationInput) => {
    // Basic validation: Check if current provider has a key
    if (!userSettings.keys[userSettings.provider]) {
      setError(language === 'en' ? 'Please configure API Key in settings.' : '请在设置中配置 API Key。');
      setIsSettingsOpen(true);
      return;
    }

    setInputData(input);
    setView('processing');
    setError(null);
    setResult(null);
    try {
      const data = await evaluateResearchTopic(input, language, userSettings);
      setResult(data);
      setView('result');
      saveToHistory(input, data);
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('API Key') || msg.includes('Missing API Key')) {
         setError(language === 'en' ? 'Invalid or Missing API Key.' : 'API Key 无效或未配置。');
         setIsSettingsOpen(true);
      } else {
         setError(language === 'en' ? 'Failed to generate evaluation. Please try again.' : '评估生成失败，请重试。');
      }
      setView('input'); // Go back to input on error
      console.error(err);
    }
  };

  const handleLoadHistory = (item: HistoryItem) => {
    setInputData(item.input);
    setResult(item.result);
    setView('result');
  };

  const handleBackToInput = () => {
    setView('input');
  };

  if (view === 'landing') {
    return (
      <LandingPage 
        language={language} 
        onStart={() => setView('input')} 
        onLanguageChange={setLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pb-12">
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={userSettings}
        onSave={handleSettingsSave}
        language={language}
      />

      {/* Navigation / Header - Clean, Glassy */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
              <div className="bg-zinc-900 p-1.5 rounded-lg text-white group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-zinc-900 hidden sm:block">
                  {t.app_name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {view === 'result' && (
                <button 
                  onClick={handleBackToInput}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t.back_to_input}
                </button>
              )}
              
              {/* Settings Trigger */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors group"
              >
                 <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-600">
                   <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                   API Key
                 </span>
                <div className="w-px h-3 bg-zinc-300 mx-1"></div>
                <Settings className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900" />
              </button>

              <button
                onClick={() => setLanguage(prev => prev === 'en' ? 'zh' : 'en')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors text-xs font-medium text-zinc-600"
              >
                <Globe2 className="w-3.5 h-3.5" />
                {language === 'en' ? '中文' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Input View */}
        {view === 'input' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EvaluatorForm 
              language={language} 
              isLoading={false} 
              onSubmit={handleEvaluation}
              initialData={inputData}
              history={history}
              onLoadHistory={handleLoadHistory}
            />
             {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2">
                   <div className="flex-1">{error}</div>
                   <button 
                       onClick={() => setIsSettingsOpen(true)}
                       className="text-xs font-bold underline hover:text-red-900"
                     >
                       Settings
                   </button>
                </div>
              )}
          </div>
        )}

        {/* Processing View */}
        {view === 'processing' && (
          <div className="max-w-2xl mx-auto mt-20 animate-in fade-in zoom-in-95 duration-500">
            <ProcessVisualizer language={language} />
          </div>
        )}

        {/* Result View */}
        {view === 'result' && result && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <ResultsDashboard 
              result={result} 
              language={language} 
              onBack={handleBackToInput}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
