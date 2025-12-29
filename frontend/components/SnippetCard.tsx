
import React, { useState } from 'react';
import { Copy, Heart, Trash2, Terminal, Hash } from 'lucide-react';
import { Snippet } from '../types';

interface SnippetCardProps {
  snippet: Snippet;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
}

const getLangColor = (lang: string) => {
    const l = lang.toLowerCase();
    if (['javascript', 'js', 'typescript', 'ts'].includes(l)) return 'bg-yellow-300 text-black';
    if (['html', 'xml'].includes(l)) return 'bg-orange-500 text-white';
    if (['css', 'scss'].includes(l)) return 'bg-blue-500 text-white';
    if (['python', 'py'].includes(l)) return 'bg-green-500 text-black';
    if (['php'].includes(l)) return 'bg-purple-500 text-white';
    if (['java', 'c#', 'c++'].includes(l)) return 'bg-red-500 text-white';
    if (['go', 'rust'].includes(l)) return 'bg-cyan-400 text-black';
    if (['sql'].includes(l)) return 'bg-zinc-500 text-white';
    return 'bg-brute-neon text-black';
};

const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onLike, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onLike(snippet.id);
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(snippet.id);
  }

  const langColorClass = getLangColor(snippet.language);

  return (
    <div className="w-full bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 shadow-hard dark:shadow-hard-dark transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex flex-col h-full group overflow-hidden">
      {}
      <div className="flex justify-between items-stretch border-b-4 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900">
         <div className="flex-1 px-4 py-3 flex items-center gap-3 bg-white text-black dark:bg-zinc-900 dark:text-zinc-100 truncate">
            <Terminal className="w-4 h-4 shrink-0" />
            <h3 className="text-lg font-black uppercase truncate tracking-tight" title={snippet.title}>{snippet.title}</h3>
         </div>
         <div className={`px-4 py-3 border-l-4 border-black dark:border-zinc-700 font-mono font-bold uppercase text-sm flex items-center ${langColorClass}`}>
            {snippet.language}
         </div>
      </div>

      {}
      <div className="p-5 border-b-4 border-black dark:border-zinc-700 bg-white dark:bg-zinc-800 grow">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {snippet.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
            {snippet.tags.slice(0, 3).map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[10px] font-bold border-2 border-black dark:border-zinc-600 px-2 py-0.5 uppercase bg-transparent text-zinc-500 dark:text-zinc-500 hover:bg-black hover:text-white dark:hover:bg-zinc-200 dark:hover:text-black transition-colors">
                <Hash className="w-3 h-3" />{tag}
              </span>
            ))}
        </div>
      </div>

      {}
      <div className="relative flex-1 bg-zinc-100 dark:bg-zinc-950 border-b-4 border-black dark:border-zinc-700 h-[180px] overflow-hidden">
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 bg-white dark:bg-zinc-800 text-black dark:text-zinc-100 px-3 py-1 text-[10px] font-bold border-2 border-black dark:border-zinc-600 hover:bg-brute-cyan hover:text-black transition-colors uppercase shadow-sm"
          >
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>
        
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-zinc-200 dark:bg-zinc-900 border-r-2 border-zinc-300 dark:border-zinc-800 flex flex-col items-center pt-5 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono select-none">
            {Array.from({length: 8}).map((_, i) => <div key={i}>{i+1}</div>)}
        </div>

        <pre className="pl-12 p-5 h-full text-xs font-mono leading-relaxed text-zinc-800 dark:text-zinc-400 opacity-90 select-none pointer-events-none whitespace-pre-wrap break-all">
          <code>{snippet.code.substring(0, 300)}</code>
        </pre>
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-100 dark:from-zinc-950 to-transparent"></div>
      </div>

      {}
      <div className="flex items-center divide-x-4 divide-black dark:divide-zinc-700 bg-white dark:bg-zinc-900 h-14">
        <button
            onClick={handleLikeClick}
            className="flex-1 h-full flex items-center justify-center gap-2 font-bold hover:bg-brute-pink hover:text-white dark:hover:bg-zinc-800 transition-colors group text-black dark:text-zinc-100"
        >
            <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${snippet.likes > 0 ? 'fill-black dark:fill-zinc-100' : ''}`} />
            <span className="text-sm">{snippet.likes}</span>
        </button>
        
        <div className="flex-[1.5] h-full flex items-center justify-center font-mono text-xs font-bold text-zinc-500 dark:text-zinc-500 bg-white dark:bg-zinc-800">
             {new Date(snippet.createdAt).toLocaleDateString()}
        </div>

        <button 
            onClick={handleDeleteClick}
            className="w-14 h-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors text-black dark:text-zinc-100 bg-white dark:bg-zinc-900"
        >
            <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default SnippetCard;
