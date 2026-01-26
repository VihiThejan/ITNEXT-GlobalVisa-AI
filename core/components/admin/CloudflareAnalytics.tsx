import React from 'react';

interface Props {
  cloudflareToken?: string;
}

const CloudflareAnalytics: React.FC<Props> = ({ cloudflareToken }) => {
  if (!cloudflareToken) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6">
          🌐 Cloudflare Analytics
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">Setup Required</h3>
          <p className="text-sm text-slate-700 mb-4">
            To enable Cloudflare Web Analytics:
          </p>
          <ol className="list-decimal list-inside text-sm text-slate-700 space-y-2 mb-4">
            <li>Go to <a href="https://dash.cloudflare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">Cloudflare Dashboard</a></li>
            <li>Navigate to <strong>Web Analytics</strong></li>
            <li>Add your site and copy the token</li>
            <li>Update <code className="bg-slate-200 px-2 py-1 rounded text-xs font-mono">index.html</code> with your token</li>
          </ol>
          <div className="bg-white rounded-lg p-4 text-xs font-mono border border-slate-200">
            <code className="text-slate-700">
              data-cf-beacon='{"{"}\"token\": \"YOUR_TOKEN_HERE\"{"}"}
            </code>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Alternative: Dashboard Link</h3>
          <p className="text-sm text-slate-600 mb-3">
            Once configured, view your analytics on Cloudflare:
          </p>
          <a
            href="https://dash.cloudflare.com/?to=/:account/web-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <span>📊</span>
            <span>Open Cloudflare Dashboard</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-6 flex items-center space-x-3">
        <span>🌐</span>
        <span>Cloudflare Analytics</span>
        <span className="ml-auto">
          <a
            href="https://dash.cloudflare.com/?to=/:account/web-analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest transition-colors"
          >
            Full Dashboard →
          </a>
        </span>
      </h2>
      
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
          <span className="text-2xl">✅</span>
          <div>
            <h3 className="font-bold text-green-900">Analytics Active</h3>
            <p className="text-sm text-green-700">
              Cloudflare Web Analytics is tracking your site. View detailed metrics in your{' '}
              <a href="https://dash.cloudflare.com/?to=/:account/web-analytics" target="_blank" rel="noopener noreferrer" className="underline font-bold">
                Cloudflare Dashboard
              </a>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">What's Tracked</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Page views & visits</li>
              <li>• Unique visitors</li>
              <li>• Referral sources</li>
              <li>• Geographic data</li>
              <li>• Device & browser info</li>
            </ul>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Privacy-First</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• No cookies used</li>
              <li>• GDPR compliant</li>
              <li>• Lightweight ({"<"}10KB)</li>
              <li>• No performance impact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudflareAnalytics;
