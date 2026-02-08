import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface Feedback {
  _id: string;
  message: string;
  category: string;
  status: 'pending' | 'replied' | 'closed';
  replies: {
    admin: {
      fullName: string;
      email: string;
    };
    message: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Props {
  user: User;
}

const UserFeedbackHistory: React.FC<Props> = ({ user }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/feedback/user/${user.id}`);

      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      setFeedbacks(data.feedbacks);
    } catch (error) {
      console.error('Fetch feedback error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      replied: 'bg-blue-100 text-blue-700',
      closed: 'bg-slate-100 text-slate-700'
    };
    return colors[status] || colors.pending;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      bug: 'bg-red-100 text-red-700',
      feature: 'bg-blue-100 text-blue-700',
      general: 'bg-slate-100 text-slate-700',
      other: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || colors.other;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-spinner fa-spin text-3xl text-slate-400"></i>
        <p className="text-slate-500 mt-4">Loading your feedback...</p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-inbox text-3xl text-slate-400"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Feedback Yet</h3>
        <p className="text-slate-500">You haven't submitted any feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-slate-900 mb-4">
        Your Feedback History ({feedbacks.length})
      </h3>

      {feedbacks.map((feedback) => (
        <div
          key={feedback._id}
          className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden transition-all hover:border-slate-300"
        >
          {/* Header */}
          <div
            onClick={() => setExpandedId(expandedId === feedback._id ? null : feedback._id)}
            className="p-6 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getCategoryColor(feedback.category)}`}>
                  {feedback.category}
                </span>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getStatusColor(feedback.status)}`}>
                  {feedback.status}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                {new Date(feedback.createdAt).toLocaleDateString()}
              </div>
            </div>

            <p className="text-sm text-slate-700 mb-3">{feedback.message}</p>

            {feedback.replies.length > 0 && (
              <div className="flex items-center space-x-2 text-xs text-blue-600">
                <i className="fas fa-reply"></i>
                <span className="font-semibold">
                  {feedback.replies.length} {feedback.replies.length === 1 ? 'reply' : 'replies'} from admin
                </span>
                <i className={`fas fa-chevron-${expandedId === feedback._id ? 'up' : 'down'} ml-auto text-slate-400`}></i>
              </div>
            )}

            {feedback.replies.length === 0 && (
              <div className="text-xs text-slate-400 italic">
                No replies yet
              </div>
            )}
          </div>

          {/* Expanded Replies */}
          {expandedId === feedback._id && feedback.replies.length > 0 && (
            <div className="px-6 pb-6 space-y-3 border-t border-slate-200 pt-4">
              <h4 className="text-xs font-black text-slate-600 uppercase">Admin Replies</h4>
              {feedback.replies.map((reply, idx) => (
                <div key={idx} className="bg-blue-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {reply.admin.fullName[0]}
                      </div>
                      <p className="text-xs font-bold text-blue-900">{reply.admin.fullName}</p>
                    </div>
                    <p className="text-[9px] text-blue-600">
                      {new Date(reply.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{reply.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserFeedbackHistory;
