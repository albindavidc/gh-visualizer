import React, { useState } from 'react';
import { SpaceShooter } from './components/SpaceShooter';
import { ContributionGraph } from './components/ContributionGraph';
import { Github, Play, Loader2, LayoutGrid, Gamepad2 } from 'lucide-react';

export default function App() {
  const [username, setUsername] = useState('zane-chen');
  const [strategy, setStrategy] = useState('random');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [githubData, setGithubData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'shooter' | 'classic'>('classic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGithubData(null);

    try {
      const res = await fetch(`/api/github/${encodeURIComponent(username)}`);
      const data = await res.json();
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="strategy" className="block text-sm font-medium text-gray-300">
                  Attack Strategy (Shooter Mode)
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
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">Target Acquired: {githubData.username}</h2>
                <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-emerald-900/50 text-emerald-400 border border-emerald-800/50">
                  {githubData.total_contributions} Contributions
                </span>
              </div>
              
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
            </div>
            
            <div className="w-full bg-black rounded-lg border border-gray-800 relative shadow-inner overflow-hidden aspect-[86/23] flex items-center justify-center">
              {viewMode === 'shooter' ? (
                <SpaceShooter data={githubData} strategy={strategy} />
              ) : (
                <ContributionGraph data={githubData} />
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
