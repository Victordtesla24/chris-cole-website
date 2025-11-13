import React, { useState } from 'react';

interface EmailCopyButtonProps {
  email: string;
  className?: string;
  showEmail?: boolean;
}

/**
 * EmailCopyButton Component
 * 
 * Email copy-to-clipboard with success animation
 * 
 * Requirements:
 * - Email address displayed
 * - Copy icon/button visible
 * - Click copies email to clipboard
 * - Success animation: Icon morphs to checkmark
 * - Toast message: "Copied to clipboard!" appears
 * - Toast fades out after 2s
 * - Resets to copy icon after timeout
 * - Works in all browsers (fallback for unsupported browsers)
 * - Hover state: Icon brightens, tooltip "Copy email"
 */
const EmailCopyButton: React.FC<EmailCopyButtonProps> = ({ 
  email, 
  className = '',
  showEmail = true 
}) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setShowToast(true);
      
      // Reset button after 2 seconds
      setTimeout(() => setCopied(false), 2000);
      
      // Hide toast after 2 seconds
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setShowToast(true);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setShowToast(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {showEmail && (
        <p className="text-xl md:text-2xl text-white mb-4">{email}</p>
      )}
      
      <button
        onClick={handleCopyEmail}
        className="group relative px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-mono text-sm inline-flex items-center"
        title={copied ? 'Copied!' : 'Copy email to clipboard'}
      >
        <span className="relative z-10">
          {copied ? (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
          {copied ? '✓ Copied!' : 'Copy Email'}
        </span>
        
        {/* Hover effect background */}
        <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </button>

      {/* Toast message */}
      {showToast && (
        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="text-sm flex items-center">
            <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied to clipboard!
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* Tailwind animation for fade-in */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmailCopyButton;
