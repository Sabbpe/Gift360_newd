import { useEffect, useState } from 'react';

type ScriptStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useEasebuzzScript() {
  const [status, setStatus] = useState<ScriptStatus>('idle');

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="easebuzz"]');
    
    if (existingScript) {
      setStatus('ready');
      return;
    }

    setStatus('loading');
    
    // Create script tag for Easebuzz
    const script = document.createElement('script');
    script.src = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js';
    script.async = true;

    script.onload = () => setStatus('ready');
    script.onerror = () => setStatus('error');

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return status;
}
