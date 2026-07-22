import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const mobileRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(mobileRoot, '..', '..');
const manifestPath = path.join(mobileRoot, 'web-boundary.json');

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const failures = [];

for (const [relativePath, expectedHash] of Object.entries(manifest.files)) {
  const absolutePath = path.join(repositoryRoot, relativePath);
  let contents;
  try {
    contents = await readFile(absolutePath);
  } catch (error) {
    failures.push(`${relativePath}: arquivo ausente (${error.code || error.message})`);
    continue;
  }

  const actualHash = createHash('sha256').update(contents).digest('hex');
  if (actualHash !== expectedHash) {
    failures.push(
      `${relativePath}: alterado (esperado ${expectedHash}, encontrado ${actualHash})`
    );
  }
}

if (failures.length) {
  console.error(
    `A fronteira web baseada em ${manifest.baseCommit} foi violada:\n- ${failures.join('\n- ')}`
  );
  process.exitCode = 1;
} else {
  console.log(
    `Fronteira web preservada: ${Object.keys(manifest.files).length} arquivos conferidos.`
  );
}
