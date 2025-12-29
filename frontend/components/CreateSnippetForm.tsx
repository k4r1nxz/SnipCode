
import React, { useState, useEffect } from 'react';
import { Save, X, FileCode, Code2 } from 'lucide-react';
import { Snippet } from '../types';

interface CreateSnippetFormProps {
  onSubmit: (snippet: any) => void;
  onCancel: () => void;
  initialData?: Snippet;
}

const LANGUAGE_MAP: Record<string, string> = {
  assembly: 'asm', bash: 'sh', c: 'c', 'c#': 'cs', 'c++': 'cpp', css: 'css',
  dart: 'dart', go: 'go', html: 'html', java: 'java', javascript: 'js',
  json: 'json', kotlin: 'kt', php: 'php', python: 'py', ruby: 'rb',
  rust: 'rs', sql: 'sql', swift: 'swift', typescript: 'ts', xml: 'xml', yaml: 'yaml'
};

const LANGUAGES = Object.keys(LANGUAGE_MAP).sort();

const CreateSnippetForm: React.FC<CreateSnippetFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [language, setLanguage] = useState(initialData?.language || 'javascript');
  const [filename, setFilename] = useState(initialData?.filename || '');
  const [tags, setTags] = useState(initialData?.tags.join(', ') || '');
  const [touched, setTouched] = useState(false);

  const getExtension = (lang: string) => LANGUAGE_MAP[lang as keyof typeof LANGUAGE_MAP] || lang;

  useEffect(() => {
    if (!touched && !initialData) {
        setFilename(`untitled.${getExtension(language)}`);
    }
  }, [language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ext = getExtension(language);
    let finalFilename = filename;
    if(!finalFilename.includes('.')) finalFilename += `.${ext}`;

    onSubmit({
      title, description, code, language,
      filename: finalFilename,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-zinc-800 border-4 border-black dark:border-zinc-700 shadow-hard dark:shadow-hard-dark p-6 sm:p-10 animate-slide-up">
      <div className="mb-10 flex items-center justify-between border-b-4 border-black dark:border-zinc-700 pb-6">
        <div className="flex items-center gap-4">
             <div className="bg-brute-neon p-2 border-2 border-black">
                 <Code2 className="w-8 h-8 text-black" />
             </div>
             <div>
                <h2 className="text-4xl font-black italic uppercase leading-none dark:text-zinc-100">{initialData ? 'Edit System' : 'New Entry'}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mt-1">Deploy code to global feed</p>
             </div>
        </div>
        <button onClick={onCancel} className="p-2 border-2 border-black dark:border-zinc-600 hover:bg-black hover:text-white dark:hover:bg-zinc-100 dark:hover:text-black transition-colors">
          <X className="w-8 h-8" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Title</label>
            <input
              type="text" required value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 focus:outline-none focus:shadow-[6px_6px_0px_0px_#DEFF00] transition-shadow font-bold text-lg dark:text-zinc-100"
              placeholder="e.g. Authentication Middleware"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Language</label>
            <div className="relative">
                <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 focus:outline-none focus:shadow-[6px_6px_0px_0px_#DEFF00] transition-shadow font-mono appearance-none uppercase font-bold text-lg cursor-pointer dark:text-zinc-100"
                >
                {LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl font-bold dark:text-zinc-400">▼</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Filename</label>
            <div className="relative">
                <FileCode className="absolute top-4 left-4 w-6 h-6 text-zinc-400" />
                <input
                type="text" required value={filename}
                onChange={(e) => { setFilename(e.target.value); setTouched(true); }}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 focus:outline-none focus:shadow-[6px_6px_0px_0px_#DEFF00] transition-shadow font-mono font-bold dark:text-zinc-100"
                placeholder="script.js"
                />
            </div>
          </div>
           <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Tags (Comma Separated)</label>
            <input
              type="text" value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 focus:outline-none focus:shadow-[6px_6px_0px_0px_#DEFF00] transition-shadow font-bold dark:text-zinc-100"
              placeholder="frontend, hook, api"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Description</label>
          <input
            type="text" required value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 focus:outline-none focus:shadow-[6px_6px_0px_0px_#DEFF00] transition-shadow font-medium dark:text-zinc-100"
            placeholder="Brief explanation..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500">Source Code</label>
          <div className="relative group">
            <div className="absolute top-0 right-0 bg-black text-white dark:bg-zinc-100 dark:text-black px-3 py-1 text-xs font-mono font-bold uppercase z-10 border-b-2 border-l-2 border-white dark:border-zinc-800">
                Editor Mode
            </div>
            <textarea
                required value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={20}
                className="w-full p-6 bg-zinc-950 text-zinc-200 border-4 border-black dark:border-zinc-700 focus:outline-none focus:border-brute-neon transition-colors font-mono text-sm leading-relaxed"
                spellCheck={false}
                placeholder="
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-6 border-t-4 border-zinc-100 dark:border-zinc-700">
          <button
            type="button" onClick={onCancel}
            className="px-8 py-4 font-black border-2 border-transparent hover:border-black dark:hover:border-zinc-200 text-zinc-500 hover:text-black dark:hover:text-zinc-100 transition-all uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-10 py-4 font-black bg-black text-white dark:bg-zinc-100 dark:text-black border-2 border-transparent hover:bg-brute-neon hover:text-black shadow-hard dark:shadow-hard-dark hover:shadow-none hover:translate-y-1 transition-all flex items-center gap-3 uppercase tracking-wider"
          >
            <Save className="w-5 h-5" />
            {initialData ? 'Save Changes' : 'Deploy Snip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSnippetForm;
