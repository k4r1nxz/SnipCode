
import React, { useEffect, useState } from 'react';
import { fetchUserProfile, fetchSnippets } from '../services/storageService';
import { User, Snippet } from '../types';
import SnippetCard from './SnippetCard';
import { Loader2, User as UserIcon } from 'lucide-react';

interface ProfilePageProps {
    username: string;
    onSnippetClick: (slug: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ username, onSnippetClick }) => {
    const [user, setUser] = useState<User | null>(null);
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const u = await fetchUserProfile(username);
                setUser(u);
                const s = await fetchSnippets({ author: username });
                setSnippets(s);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-zinc-500" /></div>;
    if (!user) return <div className="text-center p-20 font-bold text-red-500 border-4 border-red-500 uppercase">USER NOT FOUND</div>;

    return (
        <div className="animate-in fade-in zoom-in-95">
             <div className="bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 p-8 mb-10 shadow-hard dark:shadow-hard-dark text-center">
                 <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-700 mx-auto rounded-full border-4 border-black dark:border-zinc-600 flex items-center justify-center mb-4 overflow-hidden">
                     {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-10 h-10 text-zinc-400" />}
                 </div>
                 <h2 className="text-3xl font-black uppercase italic mb-2 dark:text-zinc-100">@{user.username}</h2>
                 <p className="max-w-md mx-auto text-zinc-600 dark:text-zinc-400 font-medium mb-6">{user.bio || "No bio yet."}</p>
                 
                 <div className="flex justify-center gap-8 text-sm font-bold uppercase">
                     <div className="bg-black text-white dark:bg-zinc-100 dark:text-black px-4 py-2 border-2 border-black">
                        {user.totalViews || 0} Total Views
                     </div>
                     <div className="bg-brute-neon text-black px-4 py-2 border-2 border-black">
                        {snippets.length} Codes Shared
                     </div>
                 </div>
             </div>

             <h3 className="text-2xl font-black uppercase italic mb-6 border-b-4 border-black dark:border-zinc-700 inline-block pr-8 dark:text-zinc-200">Author's Snippets</h3>
             
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {snippets.map(s => (
                    <div key={s.id} className="relative cursor-pointer" onClick={() => onSnippetClick(s.slug)}>
                         <SnippetCard snippet={s} onLike={() => {}} onDelete={() => {}} />
                    </div>
                ))}
             </div>
        </div>
    );
};

export default ProfilePage;
