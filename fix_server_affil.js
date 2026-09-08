import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(/ownerAffiliations: OWNER/g, 'ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER]');
fs.writeFileSync('server.ts', code);
