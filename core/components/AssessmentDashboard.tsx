
import React, { useState } from 'react';
import { AssessmentResult, UserProfile } from '../types';
import { COUNTRIES } from '../constants';
import ITNextLogo from './Logo';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface AssessmentDashboardProps {
  result: AssessmentResult;
  onReset: () => void;
  userProfile?: UserProfile;
  onCompare: (countries: string[]) => void;
}

const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ result, onReset, userProfile, onCompare }) => {
  const [showComparePicker, setShowComparePicker] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const roadmapArray = Array.isArray(result.roadmap) ? result.roadmap : [];
  const pathwaysArray = Array.isArray(result.eligibleVisas) ? result.eligibleVisas : [];
  
  // Support both profileAnalysis and matchBreakdown for backward compatibility
  const analysis = result.profileAnalysis 
    ? result.profileAnalysis 
    : result.matchBreakdown 
      ? { strengths: result.matchBreakdown.strengths, weaknesses: result.matchBreakdown.weaknesses, improvements: result.matchBreakdown.improvementPoints }
      : { strengths: [], weaknesses: [], improvements: [] };

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

  const handlePrint = () => {
    window.focus();
    setTimeout(() => {
      try { window.print(); } catch (e) { console.error('Print failed:', e); }
    }, 200);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('ITNEXT GLOBAL RELOCATION', 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Confidential Strategy Dossier', 20, 30);
    doc.text(`Ref: ${result.id.toUpperCase()}`, pageWidth - 70, 20);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 70, 30);

    // Executive Summary
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, 55);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate: ${userProfile?.firstName} ${userProfile?.lastName}`, 20, 65);
    doc.text(`Target Destination: ${result.countryName || result.targetCountry}`, 20, 72);
    doc.text(`Eligibility Status: ${result.status}`, 20, 79);
    
    // Score
    doc.setFillColor(255, 139, 96);
    doc.roundedRect(pageWidth - 60, 50, 40, 35, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('MATCH SCORE', pageWidth - 40, 60, { align: 'center' });
    doc.setFontSize(24);
    doc.text(`${result.overallScore}%`, pageWidth - 40, 75, { align: 'center' });

    // Profile DNA
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('I. Strategic Profile DNA', 20, 100);
    
    const dnaData = [
      ['Strengths', (analysis.strengths || []).join('\n')],
      ['Gaps', (analysis.weaknesses || []).join('\n')],
      ['Optimizations', (analysis.improvements || []).join('\n')]
    ];

    autoTable(doc, {
      startY: 105,
      head: [['Category', 'Analysis Details']],
      body: dnaData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    // Execution Roadmap
    const finalY1 = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('II. Execution Roadmap', 20, finalY1);

    const roadmapData = roadmapArray.map(step => [
      step.title,
      step.duration,
      step.description,
      (step.requirements || []).join(', ')
    ]);

    autoTable(doc, {
      startY: finalY1 + 5,
      head: [['Phase', 'Duration', 'Description', 'Requirements']],
      body: roadmapData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { cellWidth: 25 } }
    });

    // Visa Pathways
    const finalY2 = (doc as any).lastAutoTable.finalY + 15;
    if (finalY2 > 240) doc.addPage();
    const startY3 = finalY2 > 240 ? 20 : finalY2;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('III. Recommended Visa Pathways', 20, startY3);

    const pathwaysData = pathwaysArray.map(visa => [
      visa.visaName, `${visa.matchScore}%`, visa.reason
    ]);

    autoTable(doc, {
      startY: startY3 + 5,
      head: [['Visa Category', 'Match', 'Strategic Reason']],
      body: pathwaysData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] },
      styles: { fontSize: 9, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 20 } }
    });

    // Final Advice
    const finalY3 = (doc as any).lastAutoTable.finalY + 15;
    if (finalY3 > 250) doc.addPage();
    const startY4 = finalY3 > 250 ? 20 : finalY3;
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(20, startY4, pageWidth - 40, 30, 5, 5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('FINAL STRATEGIC DIRECTIVE', 30, startY4 + 10);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    const splitAdvice = doc.splitTextToSize(result.aiAdvice, pageWidth - 60);
    doc.text(splitAdvice, 30, startY4 + 18);

    // Footer
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by ITNEXT Global Mobility Intelligence Engine', pageWidth / 2, 285, { align: 'center' });

    doc.save(`ITNEXT_Strategy_Dossier_${result.id}.pdf`);
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
              {COUNTRIES.filter(c => c.name !== (result.countryName || result.targetCountry)).map(c => (
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

      {/* Action Bar - Hidden in Print */}
      <div className="flex flex-col sm:flex-row justify-between items-end gap-4 no-print bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Dossier Management</p>
           <h2 className="text-xl font-black text-slate-900">Strategy Export Options</h2>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handlePrint}
            className="bg-[#FF8B60] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e07a55] transition-all shadow-xl flex items-center space-x-3"
          >
            <i className="fas fa-print"></i>
            <span>Print Strategy Dossier</span>
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl flex items-center space-x-3"
          >
            <i className="fas fa-file-pdf"></i>
            <span>Download Strategy Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Display UI */}
      <div className="no-print space-y-10">
        {/* Result Header Card */}
        <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100">
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Profile Analysis Result</span>
            </div>
            <div className="flex items-center gap-4">
              {result.countryId && (
                <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                  <img 
                    src={`https://flagcdn.com/w80/${result.countryId === 'uk' ? 'gb' : result.countryId}.png`} 
                    alt={`${result.countryName || result.targetCountry} flag`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <h1 className="text-5xl font-black text-slate-900 tracking-tight">{result.countryName || result.targetCountry}</h1>
            </div>
            <div className="flex items-center space-x-4 pt-2">
              <span className={`px-5 py-2 rounded-2xl text-sm font-black tracking-wide ${getStatusBg(result.status || 'Not Eligible')}`}>
                {result.status || 'Processing'}
              </span>
              <button onClick={() => setShowComparePicker(true)} className="px-5 py-2 rounded-2xl text-sm font-black text-[#FF8B60] bg-orange-50 hover:bg-orange-100 transition-all">
                <i className="fas fa-columns mr-2"></i> Compare Destinations
              </button>
            </div>
          </div>
          <div className="relative z-10 mt-8 md:mt-0 flex items-center space-x-6">
            <div className="text-right">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Eligibility Match</p>
              <p className={`text-6xl font-black ${getScoreColor(result.overallScore || 0)}`}>{result.overallScore || 0}%</p>
            </div>
            <button 
              onClick={onReset}
              className="w-16 h-16 rounded-3xl bg-slate-50 text-slate-400 hover:text-[#FF8B60] hover:bg-orange-100 transition-all flex items-center justify-center shadow-inner"
            >
              <i className="fas fa-redo text-xl"></i>
            </button>
          </div>
        </div>

        {/* Strategic Profile Analysis DNA */}
        <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-[#FF8B60]/10 rounded-2xl flex items-center justify-center text-[#FF8B60] shadow-sm">
              <i className="fas fa-dna text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900">Strategic Profile DNA</h3>
              <p className="text-slate-500 text-sm">Synthetic analysis of your academic and professional lineage.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-emerald-50/50 border border-emerald-100 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center space-x-3 text-emerald-700 font-black text-xs uppercase tracking-[0.2em]">
                <i className="fas fa-check-circle"></i>
                <span>Key Strengths</span>
              </div>
              <ul className="space-y-4">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start group">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-check text-[10px] text-emerald-600"></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center space-x-3 text-amber-700 font-black text-xs uppercase tracking-[0.2em]">
                <i className="fas fa-exclamation-triangle"></i>
                <span>Profile Gaps</span>
              </div>
              <ul className="space-y-4">
                {analysis.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start group">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-minus text-[10px] text-amber-600"></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-[2.5rem] space-y-6">
              <div className="flex items-center space-x-3 text-[#FF8B60] font-black text-xs uppercase tracking-[0.2em]">
                <i className="fas fa-lightbulb"></i>
                <span>Strategic Improvements</span>
              </div>
              <ul className="space-y-4">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start group">
                    <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mr-3 mt-0.5">
                      <i className="fas fa-arrow-up text-[10px] text-[#FF8B60]"></i>
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Roadmap & Advice */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#FF8B60] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <i className="fas fa-route text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Settlement Roadmap</h3>
                  <p className="text-slate-500 text-sm">A multi-year progression plan for your relocation.</p>
                </div>
              </div>

              <div className="relative pl-10 space-y-12">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                {roadmapArray.map((step, i) => (
                  <div key={i} className="relative group">
                    <div className="absolute -left-[38px] top-1 w-5 h-5 rounded-full bg-white border-4 border-[#FF8B60] z-10 shadow-sm"></div>
                    <div className="bg-slate-50/50 p-6 rounded-3xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                        <h4 className="font-black text-lg text-slate-900">{step.title}</h4>
                        <span className="text-[10px] font-black text-[#FF8B60] bg-orange-50 px-3 py-1 rounded-full uppercase tracking-widest">{step.duration}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.requirements?.map((req, j) => (
                          <span key={j} className="text-[10px] font-bold bg-white text-slate-700 border border-slate-100 px-2.5 py-1 rounded-lg uppercase shadow-sm">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <h3 className="text-xl font-black mb-6 flex items-center">
                <i className="fas fa-brain text-[#FF8B60] mr-3"></i> Expert Strategy Advice
              </h3>
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-slate-300 text-lg leading-relaxed italic">"{result.aiAdvice}"</p>
              </div>
            </section>
          </div>

          {/* Pathways Sidebar */}
          <div className="space-y-10">
            <section className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
              <h3 className="text-xl font-black text-slate-900 flex items-center">
                <i className="fas fa-passport text-[#FF8B60] mr-3"></i> Eligible Pathways
              </h3>
              <div className="space-y-4">
                {pathwaysArray.map((visa, i) => (
                  <a key={i} href={visa.officialLink} target="_blank" rel="noopener noreferrer" className="block p-5 rounded-3xl border border-slate-50 bg-slate-50/50 space-y-3 hover:bg-white hover:border-orange-100 transition-all group">
                    <div className="flex justify-between items-start">
                      <span className="font-black text-slate-900 group-hover:text-[#FF8B60] transition-colors">{visa.visaName}</span>
                      <span className="text-xs font-black text-[#FF8B60]">{visa.matchScore}% Match</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{visa.reason}</p>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* PRINTER-ONLY VIEW */}
      <div className="print-only p-12 space-y-12">
        <div className="flex justify-between items-center border-b-2 border-[#FF8B60] pb-8 mb-8">
          <ITNextLogo className="h-10" />
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confidential Strategy Dossier</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref: {result.id.toUpperCase()}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Executive Summary</h1>
          <p className="text-lg text-slate-600 font-medium">Immigration & Professional Alignment Assessment for {userProfile?.firstName} {userProfile?.lastName}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 border-y-2 border-slate-100 py-10">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Target Destination</p>
            <p className="text-3xl font-black text-slate-900">{result.countryName || result.targetCountry}</p>
            <p className={`text-sm font-bold mt-2 ${getStatusBg(result.status)} px-3 py-1 rounded-full inline-block`}>{result.status}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Aggregate Match Score</p>
            <p className={`text-6xl font-black ${getScoreColor(result.overallScore)}`}>{result.overallScore}%</p>
          </div>
        </div>

        <div className="space-y-8 pt-6">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-2">I. Strategic Profile DNA</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Strengths</p>
              <ul className="space-y-2 text-xs text-slate-700 font-bold list-disc pl-4">
                {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Gaps</p>
              <ul className="space-y-2 text-xs text-slate-700 font-bold list-disc pl-4">
                {analysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-[#FF8B60] uppercase tracking-widest">Optimizations</p>
              <ul className="space-y-2 text-xs text-slate-700 font-bold list-disc pl-4">
                {analysis.improvements.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-8 pt-6 print-break-before-always">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b border-slate-200 pb-2">II. Execution Roadmap</h2>
          <div className="space-y-6">
            {roadmapArray.map((step, i) => (
              <div key={i} className="border-l-4 border-[#FF8B60] pl-6 py-2 space-y-2">
                <div className="flex justify-between font-black">
                   <p className="text-slate-900">{step.title}</p>
                   <p className="text-[#FF8B60] text-xs uppercase tracking-widest">{step.duration}</p>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-3xl mt-12">
           <p className="text-[10px] font-black text-[#FF8B60] uppercase tracking-[0.3em] mb-4">Final Strategic Directive</p>
           <p className="text-xl font-medium leading-relaxed italic">"{result.aiAdvice}"</p>
        </div>

        <div className="text-center pt-20">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated by ITNEXT Global Mobility Intelligence Engine</p>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
