/**
 * GoogleSignInButton
 *
 * Uses the One Tap / GSI button rendering API.
 * Loads the Google Identity Services (GSI) script on mount.
 * Calls the supplied `onSuccess` callback with the ID token on success.
 *
 * Requires:
 *  - VITE_GOOGLE_CLIENT_ID environment variable to be set.
 *
 * Security note: this component only retrieves the credential (ID token)
 * from Google and passes it to the caller. All cryptographic validation
 * happens server-side in `POST /auth/google`.
 */

import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onSuccess: (idToken: string) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  width?: number;
}

const GSI_SCRIPT_URL = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

let scriptLoaded = false;
let scriptLoading = false;
const callbacks: Array<() => void> = [];

function loadGsiScript(onReady: () => void) {
  if (scriptLoaded) {
    onReady();
    return;
  }

  callbacks.push(onReady);

  if (!scriptLoading) {
    scriptLoading = true;
    const script = document.createElement('script');
    script.src = GSI_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded = true;
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };
    script.onerror = () => {
      scriptLoading = false;
      console.error('[GoogleSignInButton] Failed to load GSI script.');
    };
    document.head.appendChild(script);
  }
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
  disabled = false,
  text = 'continue_with',
  width = 340,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [missingConfig, setMissingConfig] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) {
      setMissingConfig(true);
      return;
    }

    loadGsiScript(() => {
      if (!window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential?: string; error?: string }) => {
          if (response.credential) {
            onSuccess(response.credential);
          } else {
            onError?.(response.error || 'Google sign-in was cancelled or failed.');
          }
        },
        // Disable automatic sign-in pop-up — user must explicitly click button
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (containerRef.current) {
        window.google.accounts.id.renderButton(containerRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          width,
          locale: 'en',
        });
      }

      setReady(true);
    });

    return () => {
      // Prevent stale callbacks if component unmounts before script loads
      window.google?.accounts?.id?.cancel?.();
      window.google?.accounts?.id?.disableAutoSelect?.();
    };
  }, [onSuccess, onError, text, width]);

  if (missingConfig) {
    return (
      <div className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-surface-400 dark:text-surface-500 text-xs font-medium cursor-not-allowed">
        <span>Google Sign-In not configured</span>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="w-full flex items-center justify-center h-11 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-100 dark:bg-surface-800 opacity-50 cursor-not-allowed select-none">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 48 48" aria-hidden>
          <path fill="#4285F4" d="M45.12 24.5c0-1.57-.14-3.08-.39-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
          <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
        </svg>
        <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Continue with Google</span>
      </div>
    );
  }

  return (
    <div
      className="w-full flex items-center justify-center"
      style={{ minHeight: 44, visibility: ready ? 'visible' : 'hidden' }}
    >
      <div ref={containerRef} />
    </div>
  );
};

export default GoogleSignInButton;
