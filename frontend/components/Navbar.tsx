
import React from 'react';
import { Sun, Moon, PlusSquare, Home, Code2, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import { PageView, User as UserType } from '../types';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  currentPage: PageView;
  setPage: (view: PageView) => void;
  currentUser: UserType | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme, currentPage, setPage, currentUser, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {}
        <div 
          className="flex items-center gap-2 cursor-pointer group select-none"
          onClick={() => setPage('home')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-black dark:bg-zinc-100 translate-x-1 translate-y-1 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
            <div className="relative bg-brute-neon border-2 border-black p-1.5 z-10">
                <Code2 className="w-6 h-6 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase dark:text-white flex items-baseline">
            Snip<span className="text-brute-blue">Code</span>
          </h1>
        </div>

        {}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('home')}
            className={`hidden md:flex items-center gap-2 font-bold px-5 py-2 border-2 border-black dark:border-zinc-600 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-hard-sm dark:shadow-hard-sm-dark
              ${currentPage === 'home' 
                ? 'bg-black text-white dark:bg-zinc-100 dark:text-black' 
                : 'bg-white text-black dark:bg-zinc-800 dark:text-zinc-100'}`}
          >
            <Home className="w-4 h-4" />
            FEED
          </button>

          {currentUser ? (
             <>
                <button
                    onClick={() => setPage('dashboard')}
                    className={`hidden sm:flex items-center gap-2 font-bold px-5 py-2 border-2 border-black dark:border-zinc-600 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-hard-sm dark:shadow-hard-sm-dark
                    ${currentPage === 'dashboard' 
                        ? 'bg-black text-white dark:bg-zinc-100 dark:text-black' 
                        : 'bg-white text-black dark:bg-zinc-800 dark:text-zinc-100'}`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    DASH
                </button>
                <button
                    onClick={() => setPage('create')}
                    className={`flex items-center gap-2 font-bold px-5 py-2 border-2 border-black dark:border-zinc-600 transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-hard-sm dark:shadow-hard-sm-dark
                    ${currentPage === 'create'
                        ? 'bg-brute-blue text-black'
                        : 'bg-brute-neon text-black'}`}
                >
                    <PlusSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">NEW SNIP</span>
                </button>
                <button
                    onClick={onLogout}
                    className="p-2 border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
             </>
          ) : (
            <button
                onClick={() => setPage('login')}
                className="flex items-center gap-2 font-bold px-5 py-2 border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 hover:bg-brute-blue hover:text-black transition-colors shadow-hard-sm dark:shadow-hard-sm-dark hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
                <LogIn className="w-4 h-4" />
                LOGIN
            </button>
          )}

          <div className="w-0.5 h-8 bg-black dark:bg-zinc-700 mx-1 opacity-20"></div>

          <button
            onClick={toggleTheme}
            className="group p-2 border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-black hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors shadow-hard-sm dark:shadow-hard-sm-dark hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
