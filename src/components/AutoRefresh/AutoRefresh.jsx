import { useEffect } from 'react';

function AutoRefresh() {
  useEffect(() => {
    // Automatically refresh the page after 5000 milliseconds (5 seconds)
    const timeoutId = setTimeout(() => {
      window.location.reload();
    }, 120000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div>
      <p>This page will refresh automatically in 2 minutes.</p>
    </div>
  );
}

export default AutoRefresh;
