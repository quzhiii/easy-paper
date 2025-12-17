
import React, { useState } from 'react';
import { Settings, X, Key, ShieldCheck, Server, Cpu, ChevronDown, RotateCcw } from 'lucide-react';
import { UserSettings, LLMProviderId, Language, LABELS } from '../types';
import { DEFAULT_MODELS, PROVIDER_MODELS, DEFAULT_ENDPOINTS } from '../services/llmService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  language: Language;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onSave, language }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(() => ({
      ...settings,
      models: settings.models || { qwen: '', kimi: '', gemini: '', deepseek: '', zhipu: '', openai: '' },
      keys: {
          qwen: settings.keys.qwen || '',
          kimi: settings.keys.kimi || '',
          gemini: settings.keys.gemini || '',
          deepseek: settings.keys.deepseek || '',
          zhipu: settings.keys.zhipu || '',
          openai: settings.keys.openai || '',
      },
      // Ensure defaults are pre-filled if empty
      baseUrls: {
          qwen: settings.baseUrls?.qwen || DEFAULT_ENDPOINTS.qwen,
          kimi: settings.baseUrls?.kimi || DEFAULT_ENDPOINTS.kimi,
          gemini: settings.baseUrls?.gemini || DEFAULT_ENDPOINTS.gemini,
          deepseek: settings.baseUrls?.deepseek || DEFAULT_ENDPOINTS.deepseek,
          zhipu: settings.baseUrls?.zhipu || DEFAULT_ENDPOINTS.zhipu,
          openai: settings.baseUrls?.openai || DEFAULT_ENDPOINTS.openai,
      }
  }));
  
  // Track which providers are in manual input mode
  const [manualModeState, setManualModeState] = useState<Record<string, boolean>>({});

  const t = LABELS[language].settings;

  if (!isOpen) return null;

  const handleKeyChange = (provider: LLMProviderId, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      keys: { ...prev.keys, [provider]: value }
    }));
  };

  const handleModelChange = (provider: LLMProviderId, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      models: { ...prev.models, [provider]: value }
    }));
  };

  const handleUrlChange = (provider: LLMProviderId, value: string) => {
    setLocalSettings(prev => ({
      ...prev,
      baseUrls: { ...prev.baseUrls, [provider]: value }
    }));
  };

  const providers: { id: LLMProviderId; name: string; icon: string; recommended?: boolean; warning?: string }[] = [
    { id: 'qwen', name: 'Qwen (通义千问)', icon: 'CN', recommended: true },
    { id: 'kimi', name: 'Kimi (月之暗面)', icon: '🌙', recommended: true },
    { id: 'deepseek', name: 'DeepSeek', icon: '📚', recommended: true },
    { id: 'zhipu', name: 'Zhipu GLM (智谱)', icon: '🧠' },
    { id: 'openai', name: 'OpenAI (GPT)', icon: 'US' },
    { id: 'gemini', name: 'Gemini (Google)', icon: '💎', warning: language === 'zh' ? '⚠️ Gemini仅支持联网搜索，不支持上传文件分析。建议上传文件时使用Qwen/Kimi/DeepSeek' : '⚠️ Gemini only supports online search, not file upload analysis. Use Qwen/Kimi/DeepSeek for file uploads.' },
  ];

  const toggleManualMode = (providerId: string, isManual: boolean) => {
      setManualModeState(prev => ({ ...prev, [providerId]: isManual }));
      if (!isManual) {
          // Reset to default when going back to dropdown
          handleModelChange(providerId as LLMProviderId, '');
      }
  };

  const isManualModel = (providerId: string) => {
      if (manualModeState[providerId]) return true;
      const current = localSettings.models[providerId as LLMProviderId];
      if (!current) return false; 
      const options = PROVIDER_MODELS[providerId as LLMProviderId];
      return !options?.some(o => o.value === current);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 text-white rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{t.title}</h2>
              <p className="text-xs text-zinc-500">{t.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                
                {/* Provider Cards */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-zinc-900">{t.provider_label}</label>
                    <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100">
                        {language === 'zh' ? '⭐ 推荐使用通义千问、Kimi或DeepSeek，无CORS问题，稳定可靠' : '⭐ Recommended: Qwen, Kimi, or DeepSeek - No CORS issues, stable and reliable'}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {providers.map(p => (
                        <button
                        key={p.id}
                        onClick={() => setLocalSettings(prev => ({ ...prev, provider: p.id }))}
                        className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${localSettings.provider === p.id ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}
                        >
                        {p.recommended && (
                            <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {language === 'zh' ? '推荐' : 'TOP'}
                            </span>
                        )}
                        {p.warning && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                ⚠️
                            </span>
                        )}
                        <span className="text-xl">{p.icon}</span>
                        <span className="text-xs font-bold text-center">{p.name}</span>
                        </button>
                    ))}
                    </div>
                </div>

                {/* Configuration Inputs */}
                {providers.map(p => {
                    const availableModels = PROVIDER_MODELS[p.id] || [];
                    const currentModelValue = localSettings.models[p.id] || DEFAULT_MODELS[p.id as keyof typeof DEFAULT_MODELS];
                    const isManual = isManualModel(p.id);

                    return (
                    <div key={p.id} className={`${localSettings.provider === p.id ? 'block' : 'hidden'} space-y-5 animate-in fade-in`}>
                        
                        <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 mb-4">
                            <h4 className="font-bold text-zinc-900 text-sm mb-1">{p.name} Configuration</h4>
                            <p className="text-xs text-zinc-500">Configure your API access for {p.name}.</p>
                        </div>

                        {/* API Key */}
                        <div>
                            <label className="text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                                <Key className="w-3.5 h-3.5" />
                                {t.key_label}
                            </label>
                            <input 
                                type="password"
                                placeholder={t.key_placeholder.replace('{name}', p.name)}
                                value={localSettings.keys[p.id]}
                                onChange={(e) => handleKeyChange(p.id, e.target.value)}
                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-sm font-mono"
                            />
                        </div>

                        {/* Model Selection */}
                        <div>
                            <label className="text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5" />
                                {t.model_label}
                            </label>
                            
                            {isManual ? (
                                <div className="flex gap-2">
                                    <input 
                                        type="text"
                                        placeholder="e.g. gpt-4-turbo"
                                        value={localSettings.models[p.id]}
                                        onChange={(e) => handleModelChange(p.id, e.target.value)}
                                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-sm"
                                    />
                                    <button 
                                        onClick={() => toggleManualMode(p.id, false)}
                                        className="p-3 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                                        title="Reset to list"
                                    >
                                        <RotateCcw className="w-4 h-4 text-zinc-600" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <select 
                                        value={currentModelValue}
                                        onChange={(e) => {
                                            if (e.target.value === 'custom_option') {
                                                toggleManualMode(p.id, true);
                                                handleModelChange(p.id, '');
                                            } else {
                                                handleModelChange(p.id, e.target.value);
                                            }
                                        }}
                                        className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer pr-10"
                                    >
                                        {availableModels.map(m => (
                                            <option key={m.value} value={m.value}>{m.label}</option>
                                        ))}
                                        <option value="custom_option">Custom Model (Manually Enter)...</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                </div>
                            )}
                        </div>

                        {/* Base URL */}
                        <div>
                            <label className="text-xs font-bold text-zinc-700 mb-1.5 flex items-center gap-1.5">
                                <Server className="w-3.5 h-3.5" />
                                {t.url_label}
                            </label>
                            <input 
                                type="text"
                                placeholder={t.url_placeholder.replace('{url}', DEFAULT_ENDPOINTS[p.id as keyof typeof DEFAULT_ENDPOINTS] || '')}
                                value={localSettings.baseUrls[p.id]}
                                onChange={(e) => handleUrlChange(p.id, e.target.value)}
                                className="w-full p-3 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-sm font-mono text-zinc-600"
                            />
                        </div>
                    </div>
                    )
                })}

                {/* Security Note */}
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3">
                   <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-green-800 leading-relaxed">
                     {t.key_note}
                   </p>
                </div>

            </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-100 flex gap-3 shrink-0 bg-white">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-zinc-600 hover:bg-zinc-50 transition-colors text-sm"
          >
            {t.cancel}
          </button>
          <button 
            onClick={() => { onSave(localSettings); onClose(); }}
            className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200 text-sm"
          >
            {t.save}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsModal;
