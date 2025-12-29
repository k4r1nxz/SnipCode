import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchSnippets } from '../services/storageService';
import { Snippet } from '../types';
import { FileCode, Heart, MessageSquare, Plus, Loader2, Eye } from 'lucide-react';

interface DashboardProps {
    onCreate: () => void;
    onEdit: (snippet: Snippet) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreate, onEdit }) => {
    const [stats, setStats] = useState<any>(null);
    const [mySnippets, setMySnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const s = await fetchDashboardStats();
                setStats(s);
                const snippets = await fetchSnippets({ author: 'me' }); 
                setMySnippets(snippets);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="flex justify-center p-20">
            <Loader2 className="animate-spin w-10 h-10 text-zinc-500" />
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-4xl font-black italic uppercase dark:text-zinc-100">Dashboard</h2>
                <button 
                    onClick={onCreate} 
                    className="flex items-center gap-2 px-4 py-2 bg-brute-neon text-black font-bold border-2 border-black shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                    <Plus className="w-5 h-5" /> NEW CODE
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-6 shadow-hard dark:shadow-hard-dark">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-brute-pink text-white border-2 border-black">
                            <FileCode className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold uppercase dark:text-zinc-200">Total Codes</h3>
                    </div>
                    <p className="text-4xl font-black dark:text-zinc-100">{stats?.total_snippets || mySnippets.length}</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-6 shadow-hard dark:shadow-hard-dark">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-brute-cyan text-black border-2 border-black">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold uppercase dark:text-zinc-200">Total Likes</h3>
                    </div>
                    <p className="text-4xl font-black dark:text-zinc-100">{stats?.total_likes || 0}</p>
                </div>
                <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-6 shadow-hard dark:shadow-hard-dark">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-black text-white dark:bg-zinc-100 dark:text-black border-2 border-black dark:border-zinc-700">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold uppercase dark:text-zinc-200">Comments</h3>
                    </div>
                    <p className="text-4xl font-black dark:text-zinc-100">{stats?.total_comments || 0}</p>
                </div>
            </div>

            {/* Uploads Table */}
            <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-8 shadow-hard dark:shadow-hard-dark">
                <h3 className="text-xl font-bold uppercase mb-6 border-b-4 border-black dark:border-zinc-600 pb-2 inline-block dark:text-zinc-100">My Uploads</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-sm">
                        <thead className="bg-zinc-100 dark:bg-zinc-900 uppercase border-b-2 border-black dark:border-zinc-600">
                            <tr>
                                <th className="p-4 dark:text-zinc-300">Title</th>
                                <th className="p-4 dark:text-zinc-300">Language</th>
                                <th className="p-4 dark:text-zinc-300">Stats</th>
                                <th className="p-4 dark:text-zinc-300">Date</th>
                                <th className="p-4 dark:text-zinc-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mySnippets.map(snippet => (
                                <tr key={snippet.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50">
                                    <td className="p-4 font-bold dark:text-zinc-200">{snippet.title}</td>
                                    <td className="p-4 uppercase dark:text-zinc-400">{snippet.language}</td>
                                    <td className="p-4 dark:text-zinc-400">
                                        <span className="mr-3 flex items-center gap-1 float-left">
                                            {snippet.views} <Eye className="w-3 h-3" />
                                        </span>
                                        <span className="flex items-center gap-1">
                                            {snippet.likes} <Heart className="w-3 h-3" />
                                        </span>
                                    </td>
                                    <td className="p-4 dark:text-zinc-500">
                                        {new Date(snippet.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => onEdit(snippet)} 
                                            className="text-brute-pink hover:underline font-bold"
                                        >
                                            EDIT
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {mySnippets.length === 0 && (
                        <p className="text-center py-8 text-zinc-500 font-bold uppercase">No codes uploaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
