import { useEffect } from 'react';

export default function useIdleTimer(timeout = 1 * 60 * 1000, onIdle) {
  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdle, timeout);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Mulai timer

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle, timeout]);
}
