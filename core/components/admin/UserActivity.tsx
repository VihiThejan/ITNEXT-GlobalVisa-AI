import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface UserActivityProps {
  userId: string;
  onBack: () => void;
}

const UserActivity: React.FC<UserActivityProps> = ({ userId, onBack }) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const user = await api.admin.getUserActivity(userId);
        console.log('User data received:', user);
        setUserData(user);
      } catch (err) {
        console.error("Failed to fetch activity", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [userId]);

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-slate-100">
      <div className="font-bold text-slate-600 text-sm">{label}:</div>
      <div className="col-span-2 text-sm text-slate-800">{value || 'N/A'}</div>
    </div>
  );

  const CollapsibleSection = ({ title, children, sectionKey }: { title: string; children: React.ReactNode; sectionKey: string }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-[#FF8B60]">{title}</h3>
        <span className="text-2xl">{expandedSections[sectionKey] ? '−' : '+'}</span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="px-6 pb-6">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold uppercase text-xs tracking-widest">
        <span>← Back to Directory</span>
      </button>

      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10">User Details</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : userData ? (
        <div className="space-y-6">
          {/* Basic Information */}
          <CollapsibleSection title="Basic Information" sectionKey="basic">
            <DetailRow label="ID" value={userData.id || userData._id} />
            <DetailRow label="Full Name" value={userData.fullName} />
            <DetailRow label="Email" value={userData.email} />
            <DetailRow label="Role" value={userData.role} />
            <DetailRow label="Provider" value={userData.provider} />
            <DetailRow label="Verified" value={userData.isVerified ? 'Yes' : 'No'} />
            <DetailRow label="Created At" value={new Date(userData.createdAt).toLocaleString()} />
            <DetailRow label="Updated At" value={new Date(userData.updatedAt).toLocaleString()} />
          </CollapsibleSection>

          {/* Profile Information */}
          {userData.profile && Object.keys(userData.profile).length > 0 && (
            <CollapsibleSection title="Profile Information" sectionKey="profile">
              <DetailRow label="First Name" value={userData.profile.firstName} />
              <DetailRow label="Last Name" value={userData.profile.lastName} />
              <DetailRow label="Country" value={userData.profile.country} />
              <DetailRow label="Nationality" value={userData.profile.nationality} />
              <DetailRow label="Age Range" value={userData.profile.ageRange} />
              <DetailRow label="Education Level" value={userData.profile.educationLevel} />
              <DetailRow label="Field of Study" value={userData.profile.fieldOfStudy} />
              <DetailRow label="Years of Experience" value={userData.profile.yearsOfExperience} />
              <DetailRow label="Professional Background" value={userData.profile.professionalBackground} />
              <DetailRow label="Visa Intent" value={userData.profile.visaIntent} />
              <DetailRow label="Financial Savings" value={userData.profile.financialSavings ? `$${userData.profile.financialSavings}` : 'N/A'} />
              {userData.profile.languageScores && (
                <>
                  <DetailRow label="Language Test" value={userData.profile.languageScores.test} />
                  <DetailRow label="Language Score" value={userData.profile.languageScores.score} />
                </>
              )}
            </CollapsibleSection>
          )}

          {/* Assessment History */}
          {userData.assessmentHistory && userData.assessmentHistory.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Assessment History ({userData.assessmentHistory.length})</h3>
              {userData.assessmentHistory.map((assessment: any, index: number) => (
                <CollapsibleSection key={index} title={`Assessment #${index + 1}: ${assessment.countryName || assessment.targetCountry} - ${assessment.status}`} sectionKey={`assessment-${index}`}>
                  <div className="space-y-6">
                    {/* Basic Assessment Info */}
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3">Overview</h4>
                      <DetailRow label="Country" value={assessment.countryName || assessment.targetCountry} />
                      <DetailRow label="Visa Category" value={assessment.targetVisaCategory} />
                      <DetailRow label="Overall Score" value={`${assessment.overallScore}/100`} />
                      <DetailRow label="Status" value={assessment.status} />
                      <DetailRow label="Date" value={new Date(assessment.date).toLocaleString()} />
                      <DetailRow label="AI Advice" value={assessment.aiAdvice} />
                    </div>

                    {/* Eligible Visas */}
                    {assessment.eligibleVisas && assessment.eligibleVisas.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Eligible Visa Pathways ({assessment.eligibleVisas.length})</h4>
                        {assessment.eligibleVisas.map((visa: any, vIndex: number) => (
                          <div key={vIndex} className="mb-4 p-4 bg-slate-50 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-slate-800">{visa.visaName}</h5>
                              <span className="bg-[#FF8B60] text-white px-3 py-1 rounded-full text-xs font-bold">{visa.matchScore}%</span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">{visa.reason}</p>
                            {visa.missingCriteria && visa.missingCriteria.length > 0 && (
                              <div className="mb-2">
                                <p className="text-xs font-bold text-red-600 mb-1">Missing Criteria:</p>
                                <ul className="list-disc list-inside text-xs text-slate-600">
                                  {visa.missingCriteria.map((criteria: string, cIndex: number) => (
                                    <li key={cIndex}>{criteria}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {visa.officialLink && (
                              <a href={visa.officialLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                Official Link →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Roadmap */}
                    {assessment.roadmap && assessment.roadmap.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Settlement Roadmap</h4>
                        {assessment.roadmap.map((step: any, rIndex: number) => (
                          <div key={rIndex} className="mb-4 p-4 bg-blue-50 rounded-xl">
                            <h5 className="font-bold text-blue-900 mb-1">{step.title}</h5>
                            <p className="text-sm text-slate-700 mb-2">{step.description}</p>
                            <p className="text-xs text-slate-500 mb-2">Duration: {step.duration}</p>
                            {step.requirements && step.requirements.length > 0 && (
                              <div>
                                <p className="text-xs font-bold text-slate-700 mb-1">Requirements:</p>
                                <ul className="list-disc list-inside text-xs text-slate-600">
                                  {step.requirements.map((req: string, reqIndex: number) => (
                                    <li key={reqIndex}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Match Breakdown */}
                    {assessment.matchBreakdown && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3">Match Analysis</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {assessment.matchBreakdown.strengths && assessment.matchBreakdown.strengths.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-xl">
                              <h5 className="text-xs font-bold text-green-800 uppercase mb-2">Strengths</h5>
                              <ul className="list-disc list-inside text-xs text-green-700 space-y-1">
                                {assessment.matchBreakdown.strengths.map((s: string, sIndex: number) => (
                                  <li key={sIndex}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {assessment.matchBreakdown.weaknesses && assessment.matchBreakdown.weaknesses.length > 0 && (
                            <div className="p-4 bg-red-50 rounded-xl">
                              <h5 className="text-xs font-bold text-red-800 uppercase mb-2">Weaknesses</h5>
                              <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                                {assessment.matchBreakdown.weaknesses.map((w: string, wIndex: number) => (
                                  <li key={wIndex}>{w}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {assessment.matchBreakdown.improvementPoints && assessment.matchBreakdown.improvementPoints.length > 0 && (
                            <div className="p-4 bg-yellow-50 rounded-xl">
                              <h5 className="text-xs font-bold text-yellow-800 uppercase mb-2">Improvement Points</h5>
                              <ul className="list-disc list-inside text-xs text-yellow-700 space-y-1">
                                {assessment.matchBreakdown.improvementPoints.map((i: string, iIndex: number) => (
                                  <li key={iIndex}>{i}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleSection>
              ))}
            </div>
          )}

          {/* Raw JSON Export */}
          <CollapsibleSection title="Raw JSON Data" sectionKey="json">
            <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-auto text-xs max-h-96">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </CollapsibleSection>
        </div>
      ) : (
        <div className="text-center text-red-500">Failed to load user data</div>
      )}
    </div>
  );
};

export default UserActivity;
