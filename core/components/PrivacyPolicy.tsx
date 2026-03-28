
import React from 'react';
import { motion } from 'motion/react';
import ITNextLogo from './Logo';

const PrivacyPolicy: React.FC = () => {
  const sections = [
    {
      title: "Information We Collect",
      icon: "fa-database",
      content: [
        "Personal Information: When you create an account, we collect your name, email address, and profile details such as nationality, education, and professional background.",
        "Usage Data: We automatically collect information about how you interact with our platform, including pages visited, features used, and assessment history.",
        "Authentication Data: If you sign in via Google, we receive your basic profile information as authorized by your Google account settings.",
        "Assessment Data: Information you provide during eligibility checks, university searches, and job searches is stored to provide personalized results and maintain your history."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: "fa-gears",
      content: [
        "To provide, maintain, and improve our visa eligibility assessment services.",
        "To personalize your experience and deliver AI-powered recommendations based on your profile.",
        "To communicate with you about your account, service updates, and respond to your feedback.",
        "To analyze usage patterns and improve our platform's performance and accuracy.",
        "To protect against unauthorized access and ensure the security of our systems."
      ]
    },
    {
      title: "Data Storage & Security",
      icon: "fa-shield-halved",
      content: [
        "Your data is stored securely using MongoDB with encrypted connections and industry-standard security protocols.",
        "We use JWT (JSON Web Tokens) for secure authentication and session management.",
        "All data transmissions between your browser and our servers are encrypted using HTTPS/TLS.",
        "We implement access controls to ensure only authorized personnel can access user data.",
        "We regularly review and update our security practices to protect against emerging threats."
      ]
    },
    {
      title: "Third-Party Services",
      icon: "fa-handshake",
      content: [
        "Google Authentication: We use Google OAuth for secure sign-in. Google's privacy policy governs the data they collect.",
        "Google Gemini AI: Assessment data is processed through Google's Gemini API to generate eligibility reports. Data sent to the API is subject to Google's AI terms of service.",
        "Vercel: Our backend is hosted on Vercel's infrastructure. Vercel's privacy policy applies to data processed on their servers.",
        "Cloudflare: Our frontend is served via Cloudflare Pages, subject to Cloudflare's privacy policy."
      ]
    },
    {
      title: "Your Rights",
      icon: "fa-user-shield",
      content: [
        "Access: You can request a copy of the personal data we hold about you at any time.",
        "Correction: You can update your profile information directly through the platform.",
        "Deletion: You can request the deletion of your account and associated data by contacting us.",
        "Portability: You can request your data in a portable format.",
        "Opt-out: You can stop using our services at any time and request data removal."
      ]
    },
    {
      title: "Cookies & Tracking",
      icon: "fa-cookie-bite",
      content: [
        "We use essential cookies to maintain your session and authentication state.",
        "We use localStorage to persist your login session across browser sessions.",
        "We do not use third-party advertising trackers or sell your data to advertisers.",
        "You can clear cookies and local storage through your browser settings at any time."
      ]
    },
    {
      title: "Data Retention",
      icon: "fa-clock-rotate-left",
      content: [
        "We retain your account data for as long as your account is active.",
        "Assessment history and search records are kept to provide historical insights and improve recommendations.",
        "If you request account deletion, we will remove your data within 30 days.",
        "Anonymized and aggregated data may be retained for analytics and service improvement purposes."
      ]
    },
    {
      title: "Changes to This Policy",
      icon: "fa-pen-to-square",
      content: [
        "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.",
        "We will notify users of significant changes through email or an in-app notification.",
        "Continued use of our services after changes constitutes acceptance of the updated policy."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-5xl mx-auto px-4 space-y-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-3">
            <ITNextLogo hideText className="h-8" />
            <span className="text-[#FF8B60] font-black text-xs uppercase tracking-[0.3em]">Legal</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            Privacy <span className="text-[#FF8B60]">Policy.</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            Your privacy matters to us. This policy explains how ITNEXT GlobalVisa AI collects, uses, and protects your personal information.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-500 uppercase tracking-widest">
            <i className="fas fa-calendar-alt text-[#FF8B60]"></i>
            Last Updated: March 28, 2026
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 md:p-10 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#FF8B60] text-lg">
                  <i className={`fas ${section.icon}`}></i>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{section.title}</h2>
              </div>
              <ul className="space-y-4">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-slate-600 font-medium leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF8B60] mt-2.5 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">Have Questions?</h2>
          <p className="text-slate-400 font-medium max-w-xl mx-auto">
            If you have any questions about this Privacy Policy or wish to exercise your data rights, please reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:privacy@itnext-globalvisa.org" className="px-8 py-4 bg-[#FF8B60] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#ff7a4a] transition-all">
              <i className="fas fa-envelope mr-2"></i> Contact Privacy Team
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
