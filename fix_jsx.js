import fs from 'fs';
let code = fs.readFileSync('src/components/ContributionGraph.tsx', 'utf8');

const errorBlock = `          ))}
        </div>
          ))}
        </div>
      </div>`;

const correctBlock = `          ))}
        </div>
      </div>`;

if (code.includes(errorBlock)) {
  code = code.replace(errorBlock, correctBlock);
} else {
  // Manual string search
  const start = code.indexOf('          ))}\n        </div>');
  const end = code.indexOf('<div className="w-full max-w-[800px] h-px');
  code = code.substring(0, start) + correctBlock + '\n\n      ' + code.substring(end);
}

fs.writeFileSync('src/components/ContributionGraph.tsx', code);
