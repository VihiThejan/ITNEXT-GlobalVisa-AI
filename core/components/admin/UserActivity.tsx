import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

interface UserActivityProps {
  userId: string;
  onBack: () => void;
}

const UserActivity: React.FC<UserActivityProps> = ({ userId, onBack }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // @ts-ignore
        const data = await api.admin.getUserActivity(userId);
        setActivities(data);
      } catch (err) {
        console.error("Failed to fetch activity", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button onClick={onBack} className="mb-8 flex items-center space-x-2 text-slate-500 hover:text-slate-900 font-bold uppercase text-xs tracking-widest">
        <span>← Back to Directory</span>
      </button>

      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-10">Activity Log</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-6 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-slate-200">
          {activities.length === 0 && <div className="text-slate-500 italic pl-12">No activity recorded yet.</div>}
          {activities.map((act, i) => (
            <div key={i} className="relative pl-12">
              <div className="absolute left-0 top-1.5 w-8 h-8 rounded-full bg-white border-4 border-[#FF8B60] shadow-sm z-10"></div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF8B60]">{act.type.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-slate-400">{new Date(act.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-slate-700 font-medium">
                  {act.type === 'ASSESSMENT_GENERATED' && (
                    <>
                      User evaluated <span className="font-bold">{act.details?.country}</span> for <span className="font-bold">{act.details?.visa}</span>. 
                      Result: <span className={`font-bold ${act.details?.status?.includes('Not') ? 'text-red-500' : 'text-green-500'}`}>{act.details?.status}</span>
                    </>
                  )}
                  {act.type === 'COUNTRY_VIEWED' && (
                    <>Viewed details for <span className="font-bold">{act.details?.country}</span>.</>
                  )}
                  {(!['ASSESSMENT_GENERATED', 'COUNTRY_VIEWED'].includes(act.type)) && (
                    JSON.stringify(act.details)
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserActivity;
