
import React from 'react';
import { Compass, BookOpen, BrainCircuit, Search, ArrowRight, Activity, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { LABELS, Language } from '../types';

interface Props {
  language: Language;
  onStart: () => void;
  onLanguageChange: (lang: Language) => void;
}

const LandingPage: React.FC<Props> = ({ language, onStart, onLanguageChange }) => {
  const t = LABELS[language];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-zinc-900 text-white p-1.5 rounded-lg">
               <Compass className="w-5 h-5" />
             </div>
             <span className="text-sm font-bold tracking-tight">{t.app_name}</span>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={() => onLanguageChange(language === 'en' ? 'zh' : 'en')}
               className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
             >
               {language === 'en' ? '中文' : 'English'}
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 flex flex-col items-center text-center max-w-7xl mx-auto">
         <div className="flex gap-2 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold uppercase tracking-wider border border-zinc-200">
                <Sparkles className="w-3 h-3 text-zinc-900" />
                AI-Powered Research Methodologist
            </div>
         </div>
         
         <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 leading-tight">
           {language === 'zh' ? '科研选题，' : 'Research Journey,'}
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500">
              {language === 'zh' ? '智能导航' : 'Navigated by AI'}
           </span>
         </h1>
         
         <p className="text-xl md:text-2xl text-zinc-500 max-w-3xl mb-12 leading-relaxed font-normal animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
           {t.hero_subtitle}
         </p>

         <button 
           onClick={onStart}
           className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-200 bg-zinc-900 rounded-full hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 animate-in fade-in zoom-in-95 duration-700 delay-300 shadow-lg shadow-zinc-200 hover:shadow-xl"
         >
           {t.start_btn}
           <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
         </button>

         {/* Features Grid - Enriched */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 w-full max-w-7xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {[
              { icon: Search, title: t.features[0].title, desc: t.features[0].desc, bg: "bg-white" },
              { icon: BrainCircuit, title: t.features[1].title, desc: t.features[1].desc, bg: "bg-white" },
              { icon: ShieldCheck, title: t.features[3].title, desc: t.features[3].desc, bg: "bg-white" },
              { icon: BookOpen, title: t.features[2].title, desc: t.features[2].desc, bg: "bg-white" },
            ].map((f, i) => (
              <div key={i} className={`flex flex-col items-start p-6 ${f.bg} rounded-3xl border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all duration-300`}>
                 <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-900 mb-4 shadow-sm border border-zinc-100">
                   <f.icon className="w-5 h-5" />
                 </div>
                 <h3 className="text-lg font-bold text-zinc-900 mb-2">{f.title}</h3>
                 <p className="text-zinc-500 text-sm leading-relaxed text-left">{f.desc}</p>
              </div>
            ))}
         </div>
      </main>

      {/* Footer */}
      <footer className="py-12 text-center border-t border-zinc-100 mt-12">
        <div className="text-zinc-400 text-sm flex flex-col gap-2">
           <span>&copy; {new Date().getFullYear()} {t.app_name}</span>
           <span>{t.footer_text}</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
