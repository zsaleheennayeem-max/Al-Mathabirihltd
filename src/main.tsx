// Ensure window.fetch has a setter in environments with getter-only fetch property
try {
  if (typeof window !== 'undefined') {
    let _f = window.fetch;
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc || !desc.set) {
      Object.defineProperty(window, 'fetch', {
        get: () => _f,
        set: (fn) => {
          _f = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  }
} catch (_) {}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
