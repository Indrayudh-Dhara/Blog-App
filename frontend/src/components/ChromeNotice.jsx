import { useEffect, useState } from 'react';

const ChromeNotice = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (navigator.userAgent.includes('Chrome')) {
      setShowNotice(true);
    }
  }, []);

  if (!showNotice) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded shadow-lg max-w-xs">
      <p>For best experience, please enable third-party cookies in Chrome settings</p>
      <button 
        onClick={() => setShowNotice(false)}
        className="mt-2 text-blue-600 hover:underline"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ChromeNotice;