import {readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync} from 'fs';
import {join, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const siteDir = join(__dirname, '..');
const dbPath = join(siteDir, '..', 'ci-error-db.json');

// Read raw JSON to compute line numbers
const raw = readFileSync(dbPath, 'utf-8');
const db = JSON.parse(raw);

// Compute line numbers: find the opening `{` of each error object
const lines = raw.split('\n');
const lineMap = {};
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/"id":\s*"(COMPOSER-\d+)"/);
  if (match) {
    // Walk backwards to find the opening brace of this error object
    for (let j = i; j >= 0; j--) {
      if (lines[j].trim().startsWith('{')) {
        lineMap[match[1]] = j + 1; // 1-indexed
        break;
      }
    }
  }
}

// Write line map
const dataDir = join(siteDir, 'src', 'data');
mkdirSync(dataDir, {recursive: true});
writeFileSync(join(dataDir, 'db.json'), JSON.stringify(db, null, 2));
writeFileSync(join(dataDir, 'lineMap.json'), JSON.stringify(lineMap, null, 2));

// Generate error detail page stubs
const pagesDir = join(siteDir, 'src', 'pages', 'errors');
mkdirSync(pagesDir, {recursive: true});

// Clean existing generated pages
try {
  for (const file of readdirSync(pagesDir)) {
    if (file.endsWith('.tsx')) {
      unlinkSync(join(pagesDir, file));
    }
  }
} catch {
  // directory might not exist yet
}

// Generate one stub per error
for (const error of db.errors) {
  const content = [
    "import ErrorDetailPage from '../../components/ErrorDetailPage';",
    `export default function Page() { return <ErrorDetailPage errorId="${error.id}" />; }`,
    '',
  ].join('\n');
  writeFileSync(join(pagesDir, `${error.id}.tsx`), content);
}

console.log(`Generated ${db.errors.length} error page(s) and line map.`);
