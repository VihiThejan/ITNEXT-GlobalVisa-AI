
import React, { useState } from 'react';
import { AssessmentResult, UserProfile } from '../types';
import { COUNTRIES } from '../constants';

interface AssessmentDashboardProps {
  result: AssessmentResult;
  onReset: () => void;
  userProfile?: UserProfile;
  onCompare: (countries: string[]) => void;
}

const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ result, onReset, userProfile, onCompare }) => {
  const [showComparePicker, setShowComparePicker] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const toggleCountry = (id: string) => {
    setSelectedForCompare(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : prev
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getStatusBg = (status: string) => {
    switch(status) {
      case 'Fully Eligible': return 'bg-emerald-100 text-emerald-700';
      case 'Partially Eligible': return 'bg-amber-100 text-amber-700';
      default: return 'bg-rose-100 text-rose-700';
    }
  };

  const downloadRoadmap = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = 1200;
    const padding = 80;
    const stepSpacing = 160;
    const headerHeight = 350;
    const breakdownLineHeight = 30;
    const breakdownTitleHeight = 60;
    const strengthHeight = result.matchBreakdown.strengths.length * breakdownLineHeight + (result.matchBreakdown.strengths.length > 0 ? breakdownTitleHeight : 0);
    const weaknessHeight = result.matchBreakdown.weaknesses.length * breakdownLineHeight + (result.matchBreakdown.weaknesses.length > 0 ? breakdownTitleHeight : 0);
    const improvementHeight = result.matchBreakdown.improvementPoints.length * breakdownLineHeight + (result.matchBreakdown.improvementPoints.length > 0 ? breakdownTitleHeight : 0);
    const breakdownSectionHeightTotal = strengthHeight + weaknessHeight + improvementHeight + 100;
    const adviceSectionHeight = 220;
    const footerHeight = 100;
    const totalHeight = headerHeight + (result.roadmap.length * stepSpacing) + breakdownSectionHeightTotal + adviceSectionHeight + footerHeight;
    canvas.width = width;
    canvas.height = totalHeight;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, totalHeight);
    ctx.fillStyle = '#FF8B60';
    ctx.font = 'black 32px Inter, sans-serif';
    ctx.fillText('ITNEXT', padding, 70);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'black 64px Inter, sans-serif';
    ctx.fillText('Relocation Blueprint', padding, 170);
    const link = document.createElement('a');
    link.download = `ITNEXT-Blueprint-${result.countryName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Compare Modal */}
      {showComparePicker && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-12 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Compare Ecosystems</h2>
                <p className="text-slate-500 mt-2 font-medium">Select up to 2 additional countries to run a comparative synthesis.</p>
              </div>
              <button onClick={() => setShowComparePicker(false)} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center"><i className="fas fa-times"></i></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {COUNTRIES.filter(c => c.name !== result.countryName).map(c => (
                <div 
                  key={c.id} 
                  onClick={() => toggleCountry(c.id)}
                  className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${selectedForCompare.includes(c.id) ? 'border-[#FF8B60] bg-orange-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
                >
                  <div className="text-4xl mb-3">{c.flag}</div>
                  <div className="font-black text-slate-900 text-sm truncate">{c.name}</div>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <div className="text-slate-400 font-bold text-sm uppercase tracking-widest">{selectedForCompare.length} / 2 Selected</div>
              <button 
                disabled={selectedForCompare.length === 0}
                onClick={() => onCompare(selectedForCompare)}
                className="bg-[#FF8B60] text-white px-10 py-4 rounded-2xl font-black disabled:opacity-50 hover:bg-[#e07a55] transition-all"
              >
                Synthesize Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Result Summary */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Analysis Result</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">{result.countryName}</h1>
          <div className="flex items-center space-x-4 pt-2">
            <span className={`px-5 py-2 rounded-2xl text-sm font-black tracking-wide ${getStatusBg(result.status)}`}>{result.status}</span>
            <button onClick={() => setShowComparePicker(true)} className="px-5 py-2 rounded-2xl text-sm font-black text-[#FF8B60] bg-orange-50 hover:bg-orange-100 transition-all">
              <i className="fas fa-columns mr-2"></i> Compare Destinations
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-8 md:mt-0 flex items-center space-x-6">
          <div className="text-right">
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Eligibility Match</p>
            <p className={`text-6xl font-black ${getScoreColor(result.overallScore)}`}>{result.overallScore}%</p>
          </div>
          <button onClick={onReset} className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-100 transition-all flex items-center justify-center shadow-inner"><i className="fas fa-redo text-xl"></i></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><i className="fas fa-route text-xl"></i></div>
                <div><h3 className="text-2xl font-black text-slate-900">Settlement Roadmap</h3><p className="text-slate-500 text-sm">A multi-year progression plan for your relocation.</p></div>
              </div>
              <button onClick={downloadRoadmap} className="bg-[#FF8B60] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e07a55] transition-all shadow-xl shadow-orange-50 flex items-center justify-center space-x-2">
                <i className="fas fa-download"></i><span>Download Blueprint</span>
              </button>
            </div>
            <div className="relative pl-10 space-y-12">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
              {result.roadmap?.map((step, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[38px] top-1 w-5 h-5 rounded-full bg-white border-4 border-blue-600 z-10 shadow-sm"></div>
                  <div className="bg-slate-50/50 p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                      <h4 className="font-black text-lg text-slate-900">{step.title}</h4>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">{step.duration}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
            <h3 className="text-2xl font-black text-slate-900 flex items-center"><i className="fas fa-chart-pie text-[#FF8B60] mr-4"></i> Profile Match Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest"><i className="fas fa-check-circle mr-2"></i> Strengths</p>
                <ul className="space-y-3">{result.matchBreakdown.strengths.map((s, i) => (<li key={i} className="text-sm text-slate-600 font-medium">• {s}</li>))}</ul>
              </div>
              <div className="space-y-4">
                <p className="text-rose-500 font-black text-[10px] uppercase tracking-widest"><i className="fas fa-times-circle mr-2"></i> Friction Points</p>
                <ul className="space-y-3">{result.matchBreakdown.weaknesses.map((w, i) => (<li key={i} className="text-sm text-slate-600 font-medium">• {w}</li>))}</ul>
              </div>
              <div className="space-y-4">
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest"><i className="fas fa-lightbulb mr-2"></i> Improvements</p>
                <ul className="space-y-3">{result.matchBreakdown.improvementPoints.map((p, i) => (<li key={i} className="text-sm text-slate-600 font-medium">• {p}</li>))}</ul>
              </div>
            </div>
          </section>
        </div>
        <div className="space-y-10">
          <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center"><i className="fas fa-passport text-blue-600 mr-3"></i> Available Pathways</h3>
            <div className="space-y-4">
              {result.eligibleVisas?.map((visa, i) => (
                <a key={i} href={visa.officialLink} target="_blank" rel="noopener noreferrer" className="block p-5 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-100 transition-all group space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-black text-slate-900 group-hover:text-blue-600">{visa.visaName}</span>
                    <span className="text-xs font-black text-blue-600">{visa.matchScore}%</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{visa.reason}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
