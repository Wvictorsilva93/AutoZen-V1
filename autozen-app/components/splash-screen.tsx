'use client';

import { useEffect, useState } from 'react';

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Mostra apenas uma vez por sessão
    if (typeof window !== 'undefined' && sessionStorage.getItem('az_splash')) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setFadeOut(true), 1400);
    const t2 = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem('az_splash', '1'); } catch {}
    }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1c] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-autozen.png"
        alt="AutoZen"
        onError={(e) => { e.currentTarget.src = '/logo.svg'; }}
        className="w-[300px] h-auto animate-splash"
      />
    </div>
  );
}
