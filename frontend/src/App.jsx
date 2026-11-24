import React, { useEffect, useRef } from 'react';
import markup from './markup.html?raw';
import startApp from './legacy.js';
import { pullProgress, installSync } from './progress.js';

export default function App() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    (async () => {
      await pullProgress();
      installSync();
      startApp();
    })();
  }, []);

  return (
    <>
      <canvas id="bg" aria-hidden="true" />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </>
  );
}
