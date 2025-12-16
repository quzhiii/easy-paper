import React, { useEffect, useState } from 'react';
import { Language, LABELS } from '../types';
import { Database, Search, FileCog, ShieldCheck, PenTool } from 'lucide-react';

interface Props {
  language: Language;
}

const icons = [Database, Search, FileCog, ShieldCheck, PenTool];

const ProcessVisualizer: React.FC<Props> = ({ language }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = LABELS[language].steps;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500); // Change step every 2.5 seconds
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-zinc-200/50 p-12 border border-zinc-100 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md space-y-8">
        <h3 className="text-center font-bold text-zinc-900 text-xl tracking-tight mb-8">
          {LABELS[language].evaluating}
        </h3>
        
        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-zinc-100 -z-10"></div>
          {steps.map((step, index) => {
             const Icon = icons[index % icons.length];
             const isActive = index === currentStep;
             const isCompleted = index < currentStep;

             return (
               <div key={index} className={`flex items-center gap-5 mb-8 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100' : 'opacity-30'}`}>
                 <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300
                    ${isActive ? 'bg-zinc-900 border-zinc-900 text-white scale-110 shadow-lg' : ''}
                    ${isCompleted ? 'bg-zinc-100 border-zinc-200 text-zinc-700' : ''}
                    ${!isActive && !isCompleted ? 'bg-white border-zinc-100 text-zinc-300' : ''}
                 `}>
                    <Icon className="w-5 h-5" />
                 </div>
                 <div className="flex-1">
                   <p className={`font-medium text-sm md:text-base ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                     {step}
                   </p>
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessVisualizer;