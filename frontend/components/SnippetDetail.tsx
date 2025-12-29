
import React, { useState, useEffect } from 'react';
import { Snippet, Comment, User } from '../types';
import { fetchSnippetBySlug, fetchComments, postComment, incrementView, likeSnippet } from '../services/storageService';
import { Copy, Download, Heart, MessageSquare, Eye, Calendar, User as UserIcon, Loader2, ArrowLeft, Terminal, Check } from 'lucide-react';

interface SnippetDetailProps {
  slug: string;
  onBack: () => void;
  onAuthorClick: (username: string) => void;
  currentUser: User | null;
}

const SnippetDetail: React.FC<SnippetDetailProps> = ({ slug, onBack, onAuthorClick, currentUser }) => {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
    incrementView(slug).catch(console.error);
  }, [slug]);

  const loadData = async () => {
    try {
      const s = await fetchSnippetBySlug(slug);
      setSnippet(s);
      const c = await fetchComments(slug);
      setComments(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!snippet) return;
    const blob = new Blob([snippet.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = snippet.filename;
    a.click();
  };

  const handleLike = async () => {
    if (!snippet) return;
    await likeSnippet(slug);
    setSnippet({ ...snippet, likes: snippet.likes + 1 });
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const comment = await postComment(slug, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (e) {
      alert("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin w-12 h-12 text-brute-neon" />
          <p className="font-mono font-bold animate-pulse text-zinc-500">FETCHING BYTES...</p>
      </div>
  );
  
  if (!snippet) return <div className="text-center p-20 font-bold text-red-500 text-2xl border-4 border-red-500 bg-zinc-900 text-zinc-100">404: SNIPPET VANISHED</div>;

  const codeLines = snippet.code.split('\n');

  return (
    <div className="animate-in slide-in-from-bottom-8 duration-500">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 font-bold hover:translate-x-[-4px] transition-transform uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
        <ArrowLeft className="w-5 h-5" /> Return to Feed
      </button>

      {}
      <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 shadow-hard dark:shadow-hard-dark p-8 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 dark:opacity-5">
            <Terminal className="w-64 h-64 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-brute-neon text-black px-3 py-1 text-sm font-black font-mono uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{snippet.language}</span>
                    <span className="text-zinc-500 font-mono text-sm font-bold border-b-2 border-zinc-300 dark:border-zinc-600">{snippet.filename}</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none dark:text-zinc-100">{snippet.title}</h1>
                
                <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed border-l-4 border-brute-blue pl-4">
                    {snippet.description}
                </p>
                
                <div className="flex flex-wrap gap-6 pt-4 text-sm font-bold uppercase tracking-wider">
                    <button onClick={() => onAuthorClick(snippet.author.username)} className="flex items-center gap-2 px-3 py-1 border-2 border-transparent hover:border-black dark:hover:border-zinc-100 transition-all dark:text-zinc-300">
                        <UserIcon className="w-4 h-4" /> @{snippet.author.username}
                    </button>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                        <Calendar className="w-4 h-4" /> {new Date(snippet.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500">
                        <Eye className="w-4 h-4" /> {snippet.views} Reads
                    </div>
                </div>
            </div>

            <div className="flex flex-row md:flex-col gap-4 justify-start min-w-[200px]">
                <button onClick={handleLike} className="group flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-zinc-900 border-4 border-black dark:border-zinc-700 font-black hover:bg-black hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors uppercase shadow-sm dark:text-zinc-100">
                    <Heart className={`w-6 h-6 transition-transform group-hover:scale-125 ${snippet.likes > 0 ? 'fill-brute-pink text-brute-pink' : ''}`} />
                    <span>{snippet.likes} Respects</span>
                </button>
                <button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-brute-blue text-black font-black border-4 border-black dark:border-zinc-700 hover:bg-white transition-colors uppercase shadow-sm">
                    <Download className="w-6 h-6" />
                    Download
                </button>
            </div>
        </div>
      </div>

      {}
      <div className="relative group mb-12">
        <div className="flex justify-between items-center bg-black text-white dark:bg-zinc-900 dark:text-zinc-100 px-4 py-2 border-t-4 border-x-4 border-black dark:border-zinc-700">
            <span className="font-mono font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Source Code
            </span>
            <button
                onClick={handleCopy}
                className="flex items-center gap-2 bg-brute-neon text-black px-3 py-1 text-xs font-black border-2 border-transparent hover:border-white transition-all uppercase"
            >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'COPIED!' : 'COPY'}
            </button>
        </div>

        <div className="relative bg-zinc-50 dark:bg-zinc-950 border-4 border-black dark:border-zinc-700 overflow-x-auto shadow-hard dark:shadow-hard-dark">
            <table className="w-full font-mono text-sm leading-6 border-collapse">
                <tbody>
                    {codeLines.map((line, index) => (
                        <tr key={index} className="hover:bg-zinc-200 dark:hover:bg-zinc-900 transition-colors">
                            <td className="select-none text-right text-zinc-400 dark:text-zinc-600 w-12 pr-4 bg-zinc-100 dark:bg-zinc-900/50 border-r-2 border-zinc-300 dark:border-zinc-800 py-0.5">
                                {index + 1}
                            </td>
                            <td className="pl-4 py-0.5 whitespace-pre text-zinc-900 dark:text-zinc-300">
                                {line || ' '}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {}
      <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-8 shadow-hard-sm dark:shadow-hard-sm-dark">
        <h3 className="text-3xl font-black italic uppercase mb-8 flex items-center gap-3 decoration-4 underline decoration-brute-neon underline-offset-4 dark:text-zinc-100">
            <MessageSquare className="w-8 h-8" /> 
            Discussion <span className="text-zinc-400 text-xl not-italic">({comments.length})</span>
        </h3>

        {currentUser ? (
            <form onSubmit={handlePostComment} className="mb-10 relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-6 bg-zinc-50 dark:bg-zinc-900/50 border-4 border-black dark:border-zinc-700 focus:outline-none focus:border-brute-blue transition-colors min-h-[120px] font-medium text-lg resize-none dark:text-zinc-100"
                    placeholder="Contribute to the discussion..."
                />
                <div className="absolute bottom-4 right-4">
                    <button disabled={posting} className="px-8 py-2 bg-black text-white dark:bg-zinc-100 dark:text-black font-bold uppercase hover:bg-brute-neon hover:text-black transition-colors border-2 border-transparent">
                        {posting ? 'TRANSMITTING...' : 'POST COMMENT'}
                    </button>
                </div>
            </form>
        ) : (
            <div className="mb-10 p-8 border-4 border-dashed border-zinc-300 dark:border-zinc-700 text-center">
                <p className="font-bold text-xl uppercase text-zinc-500 mb-4">Access Restricted</p>
                <button disabled className="px-6 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-500 font-bold uppercase cursor-not-allowed">
                    Login to Comment
                </button>
            </div>
        )}

        <div className="space-y-8">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="w-12 h-12 bg-brute-cyan border-2 border-black flex items-center justify-center font-black text-xl shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                        {comment.username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <div className="flex flex-wrap items-baseline gap-3 mb-2">
                            <span className="font-black text-lg uppercase tracking-wide dark:text-zinc-100">{comment.username}</span>
                            <span className="text-xs font-mono font-bold bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 dark:text-zinc-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-zinc-800 dark:text-zinc-400 text-lg leading-relaxed">{comment.content}</p>
                    </div>
                </div>
            ))}
            {comments.length === 0 && (
                <div className="text-center py-10 opacity-50">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 dark:text-zinc-500" />
                    <p className="font-mono uppercase font-bold dark:text-zinc-500">No signal detected yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SnippetDetail;
