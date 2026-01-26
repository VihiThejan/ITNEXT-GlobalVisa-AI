
import React from 'react';
import { AssessmentResult, UserProfile } from '../types';

interface ComparisonDashboardProps {
  results: AssessmentResult[];
  onBack: () => void;
  userProfile?: UserProfile;
}

const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({ results, onBack, userProfile }) => {
  const downloadComparisonReport = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1600;
    const padding = 100;
    const colWidth = (width - 2 * padding) / results.length;
    const headerHeight = 300;
    const sectionHeight = 250;
    const totalHeight = headerHeight + sectionHeight * 3 + 200;

    canvas.width = width;
    canvas.height = totalHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, totalHeight);

    // ITNEXT Header
    ctx.fillStyle = '#FF8B60';
    ctx.font = 'black 32px Inter, sans-serif';
    ctx.fillText('ITNEXT', padding, 80);
    ctx.font = 'black 64px Inter, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Comparative Relocation Blueprint', padding, 180);
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Synthesized for ${userProfile?.firstName} ${userProfile?.lastName} | ${new Date().toLocaleDateString()}`, padding, 230);

    results.forEach((res, i) => {
      const x = padding + i * colWidth;
      
      // Country Header
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(x + 10, headerHeight - 50, colWidth - 20, sectionHeight * 4);
      
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 36px Inter, sans-serif';
      ctx.fillText(res.countryName || 'Destination', x + 30, headerHeight);
      
      // Overall Score
      ctx.fillStyle = '#FF8B60';
      ctx.font = 'black 72px Inter, sans-serif';
      ctx.fillText(`${res.overallScore}%`, x + 30, headerHeight + 120);
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ELIGIBILITY SCORE', x + 30, headerHeight + 145);

      // Strengths
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 20px Inter, sans-serif';
      ctx.fillText('Key Strengths', x + 30, headerHeight + 250);
      ctx.font = '500 14px Inter, sans-serif';
      ctx.fillStyle = '#475569';
      res.matchBreakdown.strengths.slice(0, 3).forEach((s, j) => {
        ctx.fillText(`• ${s}`, x + 30, headerHeight + 280 + j * 25);
      });

      // Improvement
      ctx.fillStyle = '#0f172a';
      ctx.font = 'black 20px Inter, sans-serif';
      ctx.fillText('Improvement Points', x + 30, headerHeight + 450);
      ctx.font = '500 14px Inter, sans-serif';
      ctx.fillStyle = '#475569';
      res.matchBreakdown.improvementPoints.slice(0, 3).forEach((p, j) => {
        ctx.fillText(`• ${p}`, x + 30, headerHeight + 480 + j * 25);
      });
    });

    const link = document.createElement('a');
    link.download = `ITNEXT-Comparison-Report.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <button onClick={onBack} className="text-slate-400 font-black text-xs uppercase tracking-widest hover:text-[#FF8B60] transition-all"><i className="fas fa-arrow-left mr-2"></i> Back to Assessment</button>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Global <span className="text-[#FF8B60]">Synthesis.</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">Side-by-side comparative analysis of your top relocation hubs based on current AI-processed immigration models.</p>
        </div>
        <button 
          onClick={downloadComparisonReport}
          className="bg-[#FF8B60] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-100 hover:scale-105 transition-all"
        >
          <i className="fas fa-file-download mr-3"></i> Download Comparison Blueprint
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {results.map((res, i) => (
          <div key={i} className={`bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl space-y-10 relative overflow-hidden ${i === 0 ? 'ring-4 ring-[#FF8B60]/20' : ''}`}>
            {i === 0 && <div className="absolute top-0 right-0 bg-[#FF8B60] text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Primary Match</div>}
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{res.countryName}</h2>
              <div className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${res.status === 'Fully Eligible' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {res.status}
              </div>
            </div>

            <div className="space-y-1">
              <div className={`text-7xl font-black tracking-tighter ${res.overallScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {res.overallScore}%
              </div>
              <div className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">AI Ecosystem Match</div>
            </div>

            <div className="space-y-8 pt-6 border-t border-slate-50">
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center"><i className="fas fa-check-circle text-emerald-500 mr-3"></i> Strengths</h4>
                <ul className="space-y-2">{res.matchBreakdown.strengths.slice(0, 3).map((s, j) => (<li key={j} className="text-sm text-slate-600 font-medium">• {s}</li>))}</ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest flex items-center"><i className="fas fa-lightbulb text-blue-500 mr-3"></i> Growth Area</h4>
                <ul className="space-y-2">{res.matchBreakdown.improvementPoints.slice(0, 3).map((p, j) => (<li key={j} className="text-sm text-slate-600 font-medium">• {p}</li>))}</ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest mb-4">Top Pathway</h4>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="font-black text-slate-900 text-sm">{res.eligibleVisas[0]?.visaName}</div>
                <p className="text-xs text-slate-500 mt-1">{res.eligibleVisas[0]?.matchScore}% Accuracy</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonDashboard;
