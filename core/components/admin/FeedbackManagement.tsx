import React, { useState, useEffect } from 'react';
import { User } from '../../types';

interface Feedback {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
  message: string;
  category: string;
  status: 'pending' | 'replied' | 'closed';
  replies: {
    admin: {
      _id: string;
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

const FeedbackManagement: React.FC<Props> = ({ user }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'replied' | 'closed'>('all');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFeedbacks();
  }, [filter]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${API_URL}/feedback/admin/all` 
        : `${API_URL}/feedback/admin/all?status=${filter}`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch feedbacks');
      const data = await res.json();
      setFeedbacks(data.feedbacks);
    } catch (error) {
      console.error('Fetch feedbacks error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedFeedback || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/feedback/admin/${selectedFeedback._id}/reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          adminId: user.id,
          message: replyMessage.trim()
        })
      });

      if (!res.ok) throw new Error('Failed to send reply');
      const data = await res.json();
      
      // Update local state
      setFeedbacks(prev => prev.map(f => 
        f._id === data.feedback._id ? data.feedback : f
      ));
      setSelectedFeedback(data.feedback);
      setReplyMessage('');
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Reply error:', error);
      alert('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  const handleStatusUpdate = async (feedbackId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/feedback/admin/${feedbackId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Failed to update status');
      const data = await res.json();
      
      setFeedbacks(prev => prev.map(f => 
        f._id === data.feedback._id ? data.feedback : f
      ));
      if (selectedFeedback?._id === feedbackId) {
        setSelectedFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  const filteredFeedbacks = filter === 'all' 
    ? feedbacks 
    : feedbacks.filter(f => f.status === filter);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      bug: 'bg-red-100 text-red-700',
      feature: 'bg-blue-100 text-blue-700',
      general: 'bg-slate-100 text-slate-700',
      other: 'bg-purple-100 text-purple-700'
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      replied: 'bg-blue-100 text-blue-700',
      closed: 'bg-slate-100 text-slate-700'
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900">User Feedback</h2>
        <div className="flex space-x-2">
          {(['all', 'pending', 'replied', 'closed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all ${
                filter === f
                  ? 'bg-[#FF8B60] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
              {f !== 'all' && ` (${feedbacks.filter(fb => fb.status === f).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-3xl text-slate-400"></i>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <i className="fas fa-inbox text-4xl text-slate-300 mb-4"></i>
              <p className="text-slate-500 font-medium">No feedback found</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div
                key={feedback._id}
                onClick={() => setSelectedFeedback(feedback)}
                className={`bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all ${
                  selectedFeedback?._id === feedback._id
                    ? 'border-[#FF8B60] shadow-lg'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={feedback.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.user.fullName)}&background=FF8B60&color=fff`}
                      alt={feedback.user.fullName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-slate-900">{feedback.user.fullName}</p>
                      <p className="text-xs text-slate-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getCategoryColor(feedback.category)}`}>
                      {feedback.category}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 line-clamp-2">{feedback.message}</p>
                {feedback.replies.length > 0 && (
                  <div className="mt-3 flex items-center space-x-2 text-xs text-blue-600">
                    <i className="fas fa-reply"></i>
                    <span className="font-semibold">{feedback.replies.length} {feedback.replies.length === 1 ? 'reply' : 'replies'}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Feedback Details & Reply */}
        {selectedFeedback && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-6 h-fit">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedFeedback.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedFeedback.user.fullName)}&background=FF8B60&color=fff`}
                    alt={selectedFeedback.user.fullName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-bold text-slate-900">{selectedFeedback.user.fullName}</p>
                    <p className="text-xs text-slate-500">{selectedFeedback.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center"
                >
                  <i className="fas fa-times text-slate-400"></i>
                </button>
              </div>

              {/* Message */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedFeedback.message}</p>
              </div>

              {/* Status Actions */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-600 uppercase">Status:</span>
                <select
                  value={selectedFeedback.status}
                  onChange={(e) => handleStatusUpdate(selectedFeedback._id, e.target.value)}
                  className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#FF8B60] outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="replied">Replied</option>
                  <option value="closed">Closed</option>
                </select>
                <a
                  href={`mailto:${selectedFeedback.user.email}?subject=Re: Your Feedback&body=Hi ${selectedFeedback.user.fullName},%0D%0A%0D%0AThank you for your feedback.%0D%0A%0D%0A`}
                  className="ml-auto px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-all flex items-center space-x-1"
                >
                  <i className="fas fa-envelope"></i>
                  <span>Email User</span>
                </a>
              </div>

              {/* Previous Replies */}
              {selectedFeedback.replies.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-600 uppercase">Previous Replies</h3>
                  {selectedFeedback.replies.map((reply, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-blue-900">{reply.admin.fullName}</p>
                        <p className="text-[9px] text-blue-600">{new Date(reply.timestamp).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-slate-700">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-600 uppercase">Send Reply</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#FF8B60] focus:ring-0 outline-none resize-none text-sm"
                />
                <button
                  onClick={handleReply}
                  disabled={isReplying || !replyMessage.trim()}
                  className="w-full py-3 bg-[#FF8B60] text-white rounded-xl font-bold hover:bg-[#e07a55] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReplying ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
