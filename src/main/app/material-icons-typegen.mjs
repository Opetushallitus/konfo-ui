import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const directoryPath = path.resolve('./node_modules/@material-design-icons/svg/filled');

const files = await fs.readdir(directoryPath);
const iconNames = files
  .filter((fname) => fname.endsWith('.svg'))
  .map((f) => f.replace('.svg', ''));

const iconsTS = `// Generoitu "${path.basename(
  __filename
)}"-skriptillä. Älä muokkaa käsin!
type MaterialIconName =
${iconNames.map((name) => `  | '${name}'\n`).join('')}`;

await fs.writeFile(path.resolve('./src/types/material-icons.d.ts'), iconsTS);
