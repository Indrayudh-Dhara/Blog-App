import { useEffect } from 'react';

const ChromeSessionFix = () => {
  useEffect(() => {
    if (localStorage.getItem('chrome_session_workaround')) {
      localStorage.removeItem('chrome_session_workaround');
      window.location.reload();
    }
  }, []);

  return null;
};

export default ChromeSessionFix;