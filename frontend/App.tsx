import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SnippetCard from './components/SnippetCard';
import SnippetDetail from './components/SnippetDetail';
import CreateSnippetForm from './components/CreateSnippetForm';
import AuthForms from './components/AuthForms';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import { Snippet, PageView, Toast, User, RouteParams } from './types';
import { fetchSnippets, getCurrentUser, logout, deleteSnippet, likeSnippet, updateSnippet, createSnippet } from './services/storageService';
import { AlertCircle, CheckCircle, Search, Flame, Clock, Code, Sparkles, Trophy, Plus } from 'lucide-react';


const SkeletonCard = () => (
    <div className="w-full bg-white dark:bg-[#18181b] border-4 border-gray-200 dark:border-gray-800 h-[350px] animate-pulse flex flex-col">
        <div className="h-12 bg-gray-200 dark:bg-gray-800 border-b-4 border-gray-200 dark:border-gray-800"></div>
        <div className="p-5 flex-1 space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2"></div>
            <div className="mt-8 h-32 bg-gray-100 dark:bg-gray-900"></div>
        </div>
    </div>
);

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [routeParams, setRouteParams] = useState<RouteParams>({});
  
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');
  const [editingSnippet, setEditingSnippet] = useState<Snippet | undefined>(undefined);

  
  const [easterEggFound, setEasterEggFound] = useState(false);
  const [repoEasterEgg, setRepoEasterEgg] = useState(false);

  useEffect(() => {
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    getCurrentUser().then(setCurrentUser);
    
    
    loadSnippets();

    
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let cursor = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
            cursor = 0;
            return;
        }

        if (e.key === konamiCode[cursor]) {
            cursor++;
            if (cursor === konamiCode.length) {
                setEasterEggFound(true);
                cursor = 0;
            }
        } else {
            cursor = 0;
            if (e.key === konamiCode[0]) cursor = 1;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadSnippets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSnippets({ popular: sortBy === 'popular', search: searchQuery });
      setSnippets(data);
    } catch (e) { 
        console.error("Error loading snippets:", e);
        showToast("Connection Interrupted", 'error');
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, [sortBy, searchQuery]);

  
  const navigate = (page: PageView, params: RouteParams = {}) => {
    setCurrentPage(page);
    setRouteParams(params);
    window.scrollTo(0, 0);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    navigate('home');
    showToast(`Access Granted: ${user.username}`);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    navigate('home');
    showToast('Session Terminated');
  };

  const handleCreate = async (data: any) => {
    try {
        if (editingSnippet) {
            await updateSnippet(editingSnippet.slug, data);
            showToast('Codebase Updated');
        } else {
            await createSnippet(data);
            showToast('Snippet Deployed');
        }
        setEditingSnippet(undefined);
        loadSnippets();
        navigate('home');
    } catch (e) {
        showToast('Deployment Failed', 'error');
    }
  };

  const handleDelete = async (slug: string) => {
      if(confirm('CONFIRM DELETION? This action is irreversible.')) {
          await deleteSnippet(slug);
          loadSnippets();
          showToast('Data Purged');
      }
  };

  

  const renderHome = () => (
    <div className="animate-slide-up">
      <div className="mb-14">
        {}
        <div className="relative bg-white dark:bg-black border-4 border-black dark:border-white p-8 md:p-12 shadow-hard dark:shadow-hard-dark mb-10 overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brute-neon rounded-full blur-3xl opacity-20 dark:opacity-10 pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <span 
                            onClick={() => setRepoEasterEgg(true)}
                            className="bg-black text-white dark:bg-white dark:text-black px-3 py-1 text-xs font-black border-2 border-transparent uppercase tracking-wider transform -rotate-2 cursor-pointer hover:scale-110 hover:bg-brute-neon hover:text-black hover:rotate-0 transition-all select-none"
                        >
                            Public Repository v2.0
                        </span>
                    </div>
                    <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] mb-2">
                    Snip<br/>
                    <span className="text-brute-blue">Code</span>
                    </h2>
                </div>
                <div className="hidden md:block">
                    <div className="w-24 h-24 border-4 border-black dark:border-white bg-brute-neon flex items-center justify-center shadow-hard dark:shadow-hard-dark animate-[spin_10s_linear_infinite]">
                        <Sparkles className="w-12 h-12 text-black" />
                    </div>
                </div>
            </div>
        </div>
        
        {}
        <div className="relative group mb-10 z-20">
          <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none z-10">
             <div className="h-full bg-black text-white dark:bg-white dark:text-black px-6 flex items-center justify-center border-y-4 border-l-4 border-black dark:border-white">
                <Search className={`h-6 w-6`} />
             </div>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH CODEBASE..."
            className="w-full pl-24 pr-4 py-5 bg-white dark:bg-[#121212] border-4 border-black dark:border-white shadow-hard dark:shadow-hard-dark text-xl font-black font-mono placeholder:text-gray-400 focus:outline-none focus:translate-x-1 focus:translate-y-1 focus:shadow-none transition-all uppercase"
          />
        </div>

        {}
        <div className="flex flex-wrap gap-4 mb-8">
            <button 
                onClick={() => setSortBy('latest')}
                className={`flex items-center gap-2 px-8 py-3 font-black uppercase border-2 border-black dark:border-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-hard-sm dark:shadow-hard-sm-dark
                ${sortBy === 'latest' ? 'bg-brute-neon text-black' : 'bg-white dark:bg-black text-gray-500'}`}
            >
                <Clock className="w-5 h-5" /> Latest
            </button>
            <button 
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-2 px-8 py-3 font-black uppercase border-2 border-black dark:border-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-hard-sm dark:shadow-hard-sm-dark
                ${sortBy === 'popular' ? 'bg-brute-blue text-black' : 'bg-white dark:bg-black text-gray-500'}`}
            >
                <Flame className="w-5 h-5" /> Popular
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[300px]">
          {isLoading ? (
              
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
          ) : (
             <>
              {snippets.length > 0 ? (
                snippets.map(snippet => (
                  <div key={snippet.id} className="relative cursor-pointer group h-full" onClick={(e) => {
                      if((e.target as HTMLElement).closest('button')) return;
                      navigate('detail', { slug: snippet.slug });
                  }}>
                      <SnippetCard 
                          snippet={snippet} 
                          onLike={(id) => likeSnippet(snippet.slug)}
                          onDelete={() => currentUser?.id === snippet.author.id ? handleDelete(snippet.slug) : null}
                      />
                  </div>
                ))
              ) : (
                  <div className="col-span-1 lg:col-span-2 border-4 border-dashed border-zinc-400 dark:border-zinc-700 p-20 text-center animate-in fade-in flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900/30">
                      <div className="mb-6 p-4 bg-zinc-200 dark:bg-zinc-800 border-2 border-black dark:border-zinc-700">
                        <Code className="w-16 h-16 text-zinc-400 dark:text-zinc-600" />
                      </div>
                      <p className="font-black text-2xl uppercase text-zinc-500 dark:text-zinc-500 mb-6 tracking-tighter">Database Response: Empty</p>
                      <button 
                        onClick={() => navigate(currentUser ? 'create' : 'login')} 
                        className="flex items-center gap-2 px-10 py-4 bg-black text-white dark:bg-zinc-100 dark:text-black font-black uppercase hover:bg-brute-neon hover:text-black transition-all shadow-hard dark:shadow-hard-dark hover:shadow-none hover:translate-y-1"
                      >
                        <Plus className="w-6 h-6" /> 
                        {currentUser ? 'Deploy First Entry' : 'Login to Contribute'}
                      </button>
                  </div>
              )}
             </>
          )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen pb-24 font-sans selection:bg-brute-neon selection:text-black bg-brute-bg dark:bg-brute-dark-bg transition-colors duration-200`}>
      <Navbar 
        darkMode={darkMode} 
        toggleTheme={() => { setDarkMode(!darkMode); document.documentElement.classList.toggle('dark'); }} 
        currentPage={currentPage} 
        setPage={navigate}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {currentPage === 'home' && renderHome()}
        
        {currentPage === 'detail' && routeParams.slug && (
            <SnippetDetail 
                slug={routeParams.slug} 
                onBack={() => navigate('home')}
                onAuthorClick={(username) => navigate('profile', { username })}
                currentUser={currentUser}
            />
        )}

        {currentPage === 'profile' && routeParams.username && (
            <ProfilePage 
                username={routeParams.username} 
                onSnippetClick={(slug) => navigate('detail', { slug })}
            />
        )}

        {currentPage === 'dashboard' && currentUser && (
            <Dashboard 
                onCreate={() => { setEditingSnippet(undefined); navigate('create'); }}
                onEdit={(snippet) => { setEditingSnippet(snippet); navigate('create'); }}
            />
        )}

        {(currentPage === 'create') && (
             <CreateSnippetForm 
                onSubmit={handleCreate}
                onCancel={() => navigate(currentUser ? 'dashboard' : 'home')}
                initialData={editingSnippet}
             />
        )}

        {(currentPage === 'login' || currentPage === 'register') && (
            <AuthForms 
                type={currentPage === 'login' ? 'login' : 'register'}
                onSuccess={handleLoginSuccess}
                onSwitch={() => navigate(currentPage === 'login' ? 'register' : 'login')}
            />
        )}
      </main>

      <div className="fixed bottom-16 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 border-4 border-black dark:border-white shadow-hard dark:shadow-hard-dark animate-in slide-in-from-right font-black uppercase tracking-wide
              ${toast.type === 'success' ? 'bg-brute-neon text-black' : 'bg-red-600 text-white'}`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-6 h-6 stroke-[3]" /> : <AlertCircle className="w-6 h-6 stroke-[3]" />}
            {toast.message}
          </div>
        ))}
      </div>

      <div className="fixed bottom-12 left-0 w-full text-center pointer-events-none z-[30]">
        <p className="text-[10px] font-black font-mono uppercase text-black/20 dark:text-white/20 tracking-[0.3em]">
          ALL RIGHTS RESERVED | CREDITS: KARIN & SYAII
        </p>
      </div>

      {repoEasterEgg && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="max-w-xl w-full border-4 border-brute-blue bg-black p-8 relative shadow-[0_0_50px_rgba(0,240,255,0.3)] text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase mb-8 leading-none">
                    CONGRATULATIONS! <span className="text-brute-blue">EASTER EGG</span><br/>UNLOCKED
                </h2>
                
                <div className="mb-8 p-1 border-2 border-white bg-white rotate-1 hover:rotate-0 transition-transform duration-300">
                    <img src="https:
                </div>

                <button 
                    onClick={() => setRepoEasterEgg(false)}
                    className="px-8 py-3 bg-brute-blue text-black font-black uppercase text-lg hover:bg-white hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                >
                    AWESOME
                </button>
            </div>
        </div>
      )}

      {easterEggFound && (
          <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-500">
              <div className="max-w-2xl w-full border-4 border-brute-neon bg-black p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(222,255,0,0.3)]">
                   <div className="relative z-10 text-center space-y-8">
                       <div className="inline-block p-6 border-4 border-white rounded-full bg-brute-neon mb-4 animate-bounce">
                          <Trophy className="w-16 h-16 text-black stroke-[3]" />
                       </div>
                       
                       <div>
                           <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase mb-4">
                               Secret <span className="text-brute-neon">Found</span>
                           </h2>
                           <p className="text-xl text-gray-300 font-mono uppercase tracking-wide">
                               You entered the legendary Konami Code.
                           </p>
                       </div>

                       <button 
                          onClick={() => setEasterEggFound(false)}
                          className="px-10 py-4 bg-white text-black font-black uppercase text-xl hover:bg-brute-neon hover:scale-105 transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]"
                       >
                          Close
                       </button>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;