import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const PublicLayout = () => {
  const { pathname } = useLocation();
  // LandingPage has its own built-in Nav — avoid double header on '/'
  const isLanding = pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-surface-900 transition-colors">
      {!isLanding && (
        <header className="fixed top-0 inset-x-0 h-16 bg-white/90 dark:bg-surface-900/90 backdrop-blur-md border-b border-surface-200 dark:border-surface-800 z-40 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-0">
              <span className="text-xl font-black text-surface-900 dark:text-white tracking-tight">ROME</span>
              <span className="text-xl font-black text-rome-500 tracking-tight">find</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white hidden sm:block">
                How it works
              </Link>
              <div className="h-4 w-px bg-surface-300 dark:bg-surface-700 hidden sm:block mx-2"></div>
              <Link to="/login" className="text-sm font-medium text-surface-600 hover:text-surface-900 dark:text-surface-300 dark:hover:text-white">
                Log in
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className={`flex-1 flex flex-col ${!isLanding ? 'pt-16' : ''}`}>
        <Outlet />
      </main>

      {/* Only show this minimal footer on non-landing pages.
          LandingPage renders its own full footer. */}
      {!isLanding && (
        <footer className="bg-surface-50 dark:bg-surface-950 py-10 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-0">
              <span className="text-lg font-black text-surface-900 dark:text-white tracking-tight">ROME</span>
              <span className="text-lg font-black text-rome-500 tracking-tight">find</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-surface-500 dark:text-surface-400">
              <Link to="/about" className="hover:text-rome-500 transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-rome-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-rome-500 transition-colors">Terms</Link>
              <Link to="/community-guidelines" className="hover:text-rome-500 transition-colors">Community Guidelines</Link>
            </div>
            <p className="text-sm text-surface-400 dark:text-surface-500">
              &copy; {new Date().getFullYear()} ROMEfind
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
