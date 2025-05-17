import { useEffect } from 'react';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100 border-green-400 text-green-700' 
                   : type === 'error' ? 'bg-red-100 border-red-400 text-red-700' 
                   : 'bg-blue-100 border-blue-400 text-blue-700';

  return (
    <div className={`${bgColor} border px-4 py-3 rounded relative mb-4`} role="alert">
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <button onClick={onClose} className="text-xl">
          ×
        </button>
      </span>
    </div>
  );
};

export default Notification;