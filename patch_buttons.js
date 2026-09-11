import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `                <button
                  onClick={handleCopyUrl}
                  disabled={platform === 'github' && viewMode === 'shooter'}
                  title={platform === 'github' && viewMode === 'shooter' ? 'Embedding is only supported in Classic mode' : 'Copy direct image URL'}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border \${
                    copiedUrl
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
                      : (platform === 'github' && viewMode === 'shooter')
                      ? 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                  }\`}
                >
                  {copiedUrl ? <Check size={16} /> : <Link size={16} />}
                  {copiedUrl ? 'Copied URL!' : 'Copy URL'}
                </button>
                <button
                  onClick={handleCopyEmbed}
                  disabled={platform === 'github' && viewMode === 'shooter'}
                  title={platform === 'github' && viewMode === 'shooter' ? 'Embedding is only supported in Classic mode' : 'Copy markdown embed link'}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border \${
                    copiedEmbed
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
                      : (platform === 'github' && viewMode === 'shooter')
                      ? 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                  }\`}
                >
                  {copiedEmbed ? <Check size={16} /> : <Code size={16} />}
                  {copiedEmbed ? 'Copied Markdown!' : 'Copy Embed'}
                </button>`;

const replacement = `                <button
                  onClick={handleCopyUrl}
                  disabled={true}
                  title={'Disabled'}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border \${
                    copiedUrl
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
                      : true
                      ? 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                  }\`}
                >
                  {copiedUrl ? <Check size={16} /> : <Link size={16} />}
                  {copiedUrl ? 'Copied URL!' : 'Disabled'}
                </button>
                <button
                  onClick={handleCopyEmbed}
                  disabled={true}
                  title={'Disabled'}
                  className={\`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border \${
                    copiedEmbed
                      ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800'
                      : true
                      ? 'bg-gray-800/50 text-gray-600 border-gray-800 cursor-not-allowed'
                      : 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 border-gray-700'
                  }\`}
                >
                  {copiedEmbed ? <Check size={16} /> : <Code size={16} />}
                  {copiedEmbed ? 'Copied Markdown!' : 'Disabled'}
                </button>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Success');
} else {
  console.log('Target not found');
}
