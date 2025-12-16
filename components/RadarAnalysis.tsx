import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { RadarMetrics, Language } from '../types';

interface Props {
  metrics: RadarMetrics;
  language: Language;
}

const RadarAnalysis: React.FC<Props> = ({ metrics, language }) => {
  // Translate keys for display
  const data = [
    { subject: language === 'en' ? 'Low Crowdedness' : '文献蓝海度', A: 100 - metrics.literatureCrowdedness, fullMark: 100 },
    { subject: language === 'en' ? 'Method Novelty' : '方法稀缺度', A: metrics.methodScarcity, fullMark: 100 },
    { subject: language === 'en' ? 'Setting Novelty' : '场景稀缺度', A: metrics.sceneScarcity, fullMark: 100 },
    { subject: language === 'en' ? 'Data Quality' : '数据质量', A: metrics.dataQuality, fullMark: 100 },
    { subject: language === 'en' ? 'Low Risk' : '低伦理风险', A: 100 - metrics.ethicalRisk, fullMark: 100 },
    { subject: language === 'en' ? 'Method Ready' : '方法就绪度', A: metrics.methodReadiness, fullMark: 100 },
  ];

  return (
    <div className="w-full h-[400px] flex justify-center items-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#0ea5e9"
            strokeWidth={3}
            fill="#0ea5e9"
            fillOpacity={0.4}
          />
          <Tooltip 
             contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
             formatter={(value: number) => [`${value}/100`, language === 'en' ? 'Score' : '得分']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarAnalysis;
