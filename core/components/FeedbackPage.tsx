import React, { useState } from 'react';
import { User } from '../types';
import UserFeedbackHistory from './UserFeedbackHistory';

interface FeedbackFormInlineProps {
  user: User;
  onSubmitSuccess: () => void;
}

const FeedbackFormInline: React.FC<FeedbackFormInlineProps> = ({ user, onSubmitSuccess }) => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      alert('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/feedback/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message: message.trim(),
          category
        })
      });

      if (!res.ok) throw new Error('Failed to submit feedback');

      const data = await res.json();
      console.log('Feedback submitted:', data);
      
      onSubmitSuccess();
      setMessage('');
      setCategory('general');

    } catch (error) {
      console.error('Submit feedback error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF8B60] focus:ring-0 outline-none transition-colors font-semibold"
        >
          <option value="general">General Feedback</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
          Your Feedback
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what's on your mind..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#FF8B60] focus:ring-0 outline-none transition-colors resize-none font-medium"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-[#FF8B60] text-white rounded-xl font-black hover:bg-[#e07a55] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending...' : 'Send Feedback'}
      </button>
    </form>
  );
};

interface Props {
  user: User;
}

const FeedbackPage: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('history');

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Feedback Center</h1>
        <p className="text-slate-600">We'd love to hear from you! Share your thoughts or view past conversations.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'submit'
              ? 'bg-[#FF8B60] text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📝 Submit Feedback
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-[#FF8B60] text-white shadow-lg'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          📋 My Feedback
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
        {activeTab === 'submit' ? (
          <div className="space-y-6">
            <FeedbackFormInline
              user={user}
              onSubmitSuccess={() => {
                alert('Thank you for your feedback! We appreciate your input.');
                setActiveTab('history');
              }}
            />
          </div>
        ) : (
          <UserFeedbackHistory user={user} />
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
