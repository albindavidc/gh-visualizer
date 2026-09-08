import React, { useState, useRef, useEffect } from 'react';
import { SpaceShooter } from './components/SpaceShooter';
import { ContributionGraph } from './components/ContributionGraph';
import { Github, Play, Loader2, LayoutGrid, Gamepad2, Check, Code } from 'lucide-react';
import { THEMES } from './themes';

export default function App() {
  const [username, setUsername] = useState('');
  const [strategy, setStrategy] = useState('random');
  const [theme, setTheme] = useState('github');
  const [font, setFont] = useState('inter');
  const [hideBorder, setHideBorder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'shooter' | 'classic'>('classic');
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('username') || 'zane-chen';
    setUsername(user);
    const mode = params.get('mode');
    if (mode === 'shooter' || mode === 'classic') {
      setViewMode(mode);
    }
    const urlFont = params.get('font');
    if (urlFont) setFont(urlFont);
    const urlHideBorder = params.get('hide_border') === 'true';
    if (urlHideBorder) setHideBorder(true);
    const urlTheme = params.get('theme');
    if (urlTheme && THEMES[urlTheme]) {
      setTheme(urlTheme);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGithubData(null);
    
    // Update URL for sharing
    window.history.pushState({}, '', `?username=${encodeURIComponent(username)}&mode=${viewMode}&theme=${theme}&font=${font}&hide_border=${hideBorder}`);

    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
      
      let data;
      const textResponse = await res.text();
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error('Received an invalid response from the server. Ensure the server is running correctly and the API route is accessible.');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setGithubData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyEmbed = async () => {
    if (!githubData?.username) return;
    
    // Using the official Vercel domain for embeds
    const baseUrl = 'https://gh-visualizer.vercel.app';
    const embedUrl = `${baseUrl}/api/graph?username=${encodeURIComponent(githubData.username)}&theme=${theme}&font=${font}&hide_border=${hideBorder}`;
    const linkUrl = `${baseUrl}/?username=${encodeURIComponent(githubData.username)}&theme=${theme}&font=${font}&hide_border=${hideBorder}`;
    const markdown = `[![GitHub Contributions](${embedUrl})](${linkUrl})`;
    
    try {
      await navigator.clipboard.writeText(markdown);
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } catch (err) {
      console.error('Failed to copy embed link', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 text-emerald-400 mb-4">
            <Github size={48} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            GitHub Visualizer
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            View your contribution graph or transform it into a retro arcade shooter.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                  GitHub Username
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">@</span>
                  </div>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-8 sm:text-sm border-gray-700 rounded-md bg-gray-800 text-white py-3"
                    placeholder="torvalds"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-300">
                  Color Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-gray-800 text-white capitalize"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  {Object.keys(THEMES).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              

              <div>
                <label htmlFor="font" className="block text-sm font-medium text-gray-300">
                  Font Family
                </label>
                <select
                  id="font"
                  name="font"
                  className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-gray-800 text-white capitalize"
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="mali">Mali</option>
                  <option value="roboto mono">Roboto Mono</option>
                  <option value="comic neue">Comic Neue</option>
                </select>
              </div>
              <div className="flex items-center justify-between mt-4">
                <label htmlFor="hideBorder" className="text-sm font-medium text-gray-300">
                  Hide Outer Border
                </label>
                <button
                  id="hideBorder"
                  type="button"
                  role="switch"
                  aria-checked={hideBorder}
                  onClick={() => setHideBorder(!hideBorder)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${hideBorder ? 'bg-emerald-500' : 'bg-gray-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${hideBorder ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div>
                <label htmlFor="strategy" className="block text-sm font-medium text-gray-300">
                  Attack Strategy
                </label>
                <select
                  id="strategy"
                  name="strategy"
                  className="mt-2 block w-full pl-3 pr-10 py-3 text-base border-gray-700 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md bg-gray-800 text-white"
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value)}
                >
                  <option value="random">Random Attack</option>
                  <option value="row">Row by Row</option>
                  <option value="column">Column by Column</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                ) : (
                  <Play className="-ml-1 mr-2 h-5 w-5" fill="currentColor" />
                )}
                {loading ? 'Fetching...' : 'Generate Visualization'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-900/50 border border-red-500/50 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">Mission Failed</h3>
                  <div className="mt-2 text-sm text-red-200">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {githubData && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Target Acquired: {githubData.username}</h2>
                <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-800/50">
                  {githubData.total_contributions} Contributions
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                  <button
                    onClick={() => setViewMode('classic')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'classic' 
                        ? 'bg-gray-700 text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Classic Graph
                  </button>
                  <button
                    onClick={() => setViewMode('shooter')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'shooter' 
                        ? 'bg-gray-700 text-white shadow-sm' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                    }`}
                  >
                    <Gamepad2 size={16} />
                    Space Shooter
                  </button>
                </div>

                <button
                  onClick={handleCopyEmbed}
                  disabled={viewMode === 'shooter'}
                  title={viewMode === 'shooter' ? 'Embedding is only supported in Classic mode' : 'Copy markdown embed link'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                    copiedEmbed
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
                      : viewMode === 'shooter'
                      ? 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                  }`}
                >
                  {copiedEmbed ? <Check size={16} /> : <Code size={16} />}
                  {copiedEmbed ? 'Copied Markdown!' : 'Copy Embed'}
                </button>
              </div>
            </div>
            
            <div 
              ref={graphRef}
              className={`w-full bg-black rounded-lg border border-gray-800 relative shadow-inner overflow-hidden flex items-center justify-center ${
                viewMode === 'shooter' ? 'aspect-[86/23]' : ''
              }`}
            >
              {viewMode === 'shooter' ? (
                <SpaceShooter data={githubData} strategy={strategy} theme={theme} />
              ) : (
                <ContributionGraph data={githubData} theme={theme} font={font} hideBorder={hideBorder} />
              )}
            </div>
            
            <p className="mt-4 text-sm text-gray-500 text-center">
              {viewMode === 'shooter' 
                ? 'Simulation running natively in your browser using HTML5 Canvas.' 
                : 'A clean, modern view of your GitHub contributions.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
