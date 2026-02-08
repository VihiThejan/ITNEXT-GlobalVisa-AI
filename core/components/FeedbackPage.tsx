import React, { useState } from 'react';
import { User } from '../types';
import FeedbackForm from './FeedbackForm';
import UserFeedbackHistory from './UserFeedbackHistory';

interface Props {
  user: User;
}

const FeedbackPage: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

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
          <FeedbackForm
            user={user}
            onClose={() => {}}
            onSubmitSuccess={() => {
              alert('Thank you for your feedback! We appreciate your input.');
              setActiveTab('history');
            }}
          />
        ) : (
          <UserFeedbackHistory user={user} />
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
