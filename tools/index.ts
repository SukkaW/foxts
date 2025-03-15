import fs from 'node:fs';
import path from 'node:path';

const pkgJsonPath = path.resolve(__dirname, '../package.json');

if (!fs.existsSync(pkgJsonPath)) {
  throw new Error('No package.json found in the root directory');
}

const packageJson = fs.readFileSync(pkgJsonPath, 'utf-8');
if (!packageJson.endsWith('}\n')) {
  fs.appendFileSync(pkgJsonPath, '\n');
}
