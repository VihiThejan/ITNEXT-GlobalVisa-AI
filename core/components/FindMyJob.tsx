
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter, 
  Heart, 
  ChevronRight, 
  Clock, 
  Globe, 
  CheckCircle2, 
  X, 
  Info,
  Building2,
  Zap,
  ShieldCheck,
  ArrowRight,
  Bookmark,
  Send,
  ExternalLink
} from 'lucide-react';
import { UserProfile, JobOffer } from '../types';
import { discoverJobs } from '../services/geminiService';
import { COUNTRIES } from '../constants';

interface FindMyJobProps {
  profile: UserProfile;
  onSearchComplete: (criteria: any, results: JobOffer[]) => void;
}

const FindMyJob: React.FC<FindMyJobProps> = ({ profile, onSearchComplete }) => {
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<JobOffer[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOffer | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const [searchParams, setSearchParams] = useState({
    keywords: '',
    location: '',
    industry: '',
    type: '',
    experienceLevel: '',
    salary: '',
    sponsorship: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!searchParams.keywords.trim()) newErrors.keywords = 'Required';
    if (!searchParams.location) newErrors.location = 'Required';
    if (!searchParams.industry) newErrors.industry = 'Required';
    if (!searchParams.type) newErrors.type = 'Required';
    if (!searchParams.experienceLevel) newErrors.experienceLevel = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = async () => {
    if (!validate()) return;
    setLoading(true);
    setHasSearched(true);
    setSelectedJob(null);
    try {
      const jobs = await discoverJobs(profile, searchParams);
      setResults(jobs);
      onSearchComplete(searchParams, jobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedJobs(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    if (!selectedJob) return;
    window.open(selectedJob.applyUrl, '_blank', 'noopener,noreferrer');
    setAppliedJobs(prev => [...prev, selectedJob.id]);
  };

  // Initial search removed to let user select filters one by one
  useEffect(() => {
    // No initial search
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full relative">
                  <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.keywords ? 'text-rose-500' : 'text-slate-400'}`} />
                  <input 
                    type="text"
                    placeholder="Job title, keywords, or company..."
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 font-medium text-slate-900 transition-all ${errors.keywords ? 'ring-2 ring-rose-500 bg-rose-50' : 'focus:ring-blue-500/20'}`}
                    value={searchParams.keywords}
                    onChange={(e) => {
                      setSearchParams({...searchParams, keywords: e.target.value});
                      if (errors.keywords) setErrors(prev => { const n = {...prev}; delete n.keywords; return n; });
                    }}
                  />
                  {errors.keywords && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-rose-500 uppercase tracking-widest">Required</span>}
                </div>
                <div className="w-full md:w-64 relative">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.location ? 'text-rose-500' : 'text-slate-400'}`} />
                  <select 
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 font-medium text-slate-900 appearance-none transition-all ${errors.location ? 'ring-2 ring-rose-500 bg-rose-50' : 'focus:ring-blue-500/20'}`}
                    value={searchParams.location}
                    onChange={(e) => {
                      setSearchParams({...searchParams, location: e.target.value});
                      if (errors.location) setErrors(prev => { const n = {...prev}; delete n.location; return n; });
                    }}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Zap className="w-5 h-5 animate-pulse" /> : <Search className="w-5 h-5" />}
              <span>{loading ? 'Searching...' : 'Find Jobs'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <button 
                  onClick={() => setSearchParams({
                    keywords: '',
                    location: '',
                    industry: '',
                    type: '',
                    experienceLevel: '',
                    salary: '',
                    sponsorship: ''
                  })}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider"
                >
                  Reset
                </button>
              </div>

              {/* Filter sections */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className={`text-xs font-black uppercase tracking-widest ${errors.industry ? 'text-rose-500' : 'text-slate-400'}`}>Industry</label>
                  <select 
                    className={`w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${errors.industry ? 'ring-2 ring-rose-500 bg-rose-50' : 'focus:ring-blue-500/10'}`}
                    value={searchParams.industry}
                    onChange={(e) => {
                      setSearchParams({...searchParams, industry: e.target.value});
                      if (errors.industry) setErrors(prev => { const n = {...prev}; delete n.industry; return n; });
                    }}
                  >
                    <option value="">Select Industry</option>
                    <option>Technology</option>
                    <option>Healthcare</option>
                    <option>Finance</option>
                    <option>Engineering</option>
                    <option>Education</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`text-xs font-black uppercase tracking-widest ${errors.type ? 'text-rose-500' : 'text-slate-400'}`}>Job Type</label>
                  <select 
                    className={`w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${errors.type ? 'ring-2 ring-rose-500 bg-rose-50' : 'focus:ring-blue-500/10'}`}
                    value={searchParams.type}
                    onChange={(e) => {
                      setSearchParams({...searchParams, type: e.target.value});
                      if (errors.type) setErrors(prev => { const n = {...prev}; delete n.type; return n; });
                    }}
                  >
                    <option value="">Select Type</option>
                    {['Full-time', 'Contract', 'Remote', 'Part-time'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`text-xs font-black uppercase tracking-widest ${errors.experienceLevel ? 'text-rose-500' : 'text-slate-400'}`}>Experience</label>
                  <select 
                    className={`w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 transition-all ${errors.experienceLevel ? 'ring-2 ring-rose-500 bg-rose-50' : 'focus:ring-blue-500/10'}`}
                    value={searchParams.experienceLevel}
                    onChange={(e) => {
                      setSearchParams({...searchParams, experienceLevel: e.target.value});
                      if (errors.experienceLevel) setErrors(prev => { const n = {...prev}; delete n.experienceLevel; return n; });
                    }}
                  >
                    <option value="">Select Level</option>
                    <option>Entry</option>
                    <option>Mid</option>
                    <option>Senior</option>
                    <option>Lead</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Sponsorship</label>
                  <div className="flex p-1 bg-slate-50 rounded-xl">
                    <button 
                      onClick={() => setSearchParams({...searchParams, sponsorship: 'Yes'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${searchParams.sponsorship === 'Yes' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Required
                    </button>
                    <button 
                      onClick={() => setSearchParams({...searchParams, sponsorship: 'No'})}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${searchParams.sponsorship === 'No' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
                    >
                      Not Needed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-3xl text-white space-y-4 shadow-xl shadow-blue-200">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg leading-tight">Visa Sponsorship Guide</h4>
              <p className="text-blue-100 text-sm leading-relaxed">
                Looking for jobs that offer sponsorship? Filter by "Required" to see roles with confirmed visa support.
              </p>
              <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-900">
                {loading ? 'Finding opportunities...' : `${results.length} Jobs Found`}
              </h2>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span>Sort by:</span>
                <select className="bg-transparent border-none font-bold text-slate-900 focus:ring-0 cursor-pointer">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                  <option>Highest Salary</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 animate-pulse space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-slate-100 rounded-lg"></div>
                        <div className="h-4 w-32 bg-slate-100 rounded-lg"></div>
                      </div>
                      <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-4 w-24 bg-slate-100 rounded-lg"></div>
                      <div className="h-4 w-24 bg-slate-100 rounded-lg"></div>
                    </div>
                  </div>
                ))
              ) : results.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {results.map((job, index) => (
                    <motion.div 
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedJob(job)}
                      className="group bg-white p-6 md:p-8 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-start justify-between md:justify-start md:gap-4">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Building2 className="w-8 h-8" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                {job.matchScore > 85 && (
                                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-md flex items-center gap-1">
                                    <Zap className="w-3 h-3 fill-emerald-600" />
                                    Top Match
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
                                <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</span>
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.postedAt}</span>
                                {job.sourceSite && (
                                  <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-100">
                                    <Globe className="w-3 h-3" /> {job.sourceSite}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => toggleSaveJob(job.id, e)}
                              className={`md:hidden p-3 rounded-xl transition-all ${savedJobs.includes(job.id) ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400'}`}
                            >
                              <Heart className={`w-5 h-5 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <p className="text-slate-600 line-clamp-2 text-sm leading-relaxed">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">{job.type}</span>
                            <span className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100">{job.experienceLevel}</span>
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-100 flex items-center gap-1.5">
                              <DollarSign className="w-3 h-3" />
                              {job.salary}
                            </span>
                            {job.sponsorshipAvailable && (
                              <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100 flex items-center gap-1.5">
                                <Globe className="w-3 h-3" />
                                Sponsorship Available
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-between items-center md:items-end gap-4 min-w-[120px]">
                          <button 
                            onClick={(e) => toggleSaveJob(job.id, e)}
                            className={`hidden md:flex p-3 rounded-2xl transition-all ${savedJobs.includes(job.id) ? 'bg-pink-50 text-pink-500' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <Heart className={`w-6 h-6 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                          </button>
                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Match Score</div>
                              <div className={`text-2xl font-black ${job.matchScore > 80 ? 'text-emerald-500' : 'text-blue-500'}`}>
                                {job.matchScore}%
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-blue-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                              View Details <ChevronRight className="w-4 h-4" />
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
                                setAppliedJobs(prev => [...prev, job.id]);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-100"
                            >
                              {job.sourceSite ? `View on ${job.sourceSite}` : 'View Listing'} <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : !hasSearched ? (
                <div className="bg-white p-16 rounded-[3rem] border border-slate-200 text-center space-y-6">
                  <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-600 mx-auto">
                    <Briefcase className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Ready to find your next role?</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Select your preferred location, industry, and other filters to discover tailored job opportunities.
                    </p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Select Filters
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                      Click Find Jobs
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-16 rounded-[3rem] border border-slate-200 text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto">
                    <Search className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">No matching jobs found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Try adjusting your filters or search keywords to find more opportunities.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchParams({
                        keywords: '',
                        location: '',
                        industry: '',
                        type: '',
                        experienceLevel: '',
                        salary: '',
                        sponsorship: ''
                      });
                      setHasSearched(false);
                    }}
                    className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setSelectedJob(null)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                <div className="flex gap-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Building2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{selectedJob.title}</h2>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-slate-500 font-medium">
                      <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {selectedJob.company}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {selectedJob.location}</span>
                      <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {selectedJob.type}</span>
                      {selectedJob.sourceSite && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-widest">
                          <Globe className="w-3 h-3" /> {selectedJob.sourceSite}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Salary Range</span>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      {selectedJob.salary}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Experience</span>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      {selectedJob.experienceLevel}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sponsorship</span>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      {selectedJob.sponsorshipAvailable ? 'Available' : 'Not Offered'}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">AI Match Analysis</h3>
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl font-black text-emerald-600">{selectedJob.matchScore}%</div>
                      <div className="text-sm font-medium text-emerald-800 leading-relaxed">
                        This role is a high match for your profile based on your {profile.yearsOfExperience} years of experience in {profile.fieldOfStudy}.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      Job Description
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedJob.description}
                    </p>
                    
                    {selectedJob.responsibilities && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Key Responsibilities</h4>
                        <ul className="space-y-3">
                          {selectedJob.responsibilities.map((r, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0"></div>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Requirements
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.keyRequirements.map((req, i) => (
                          <span key={i} className="px-3 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {selectedJob.benefits && (
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                          Benefits
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedJob.benefits.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => toggleSaveJob(selectedJob.id, e)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                      savedJobs.includes(selectedJob.id) 
                      ? 'bg-pink-50 text-pink-600' 
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${savedJobs.includes(selectedJob.id) ? 'fill-current' : ''}`} />
                    {savedJobs.includes(selectedJob.id) ? 'Saved' : 'Save Job'}
                  </button>
                </div>
                <button 
                  onClick={handleApply}
                  className={`w-full md:w-auto px-12 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl ${
                    appliedJobs.includes(selectedJob.id) 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {appliedJobs.includes(selectedJob.id) 
                      ? 'Visit Site Again' 
                      : `View on ${selectedJob.sourceSite || 'Source Site'}`} 
                    <ExternalLink className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindMyJob;
