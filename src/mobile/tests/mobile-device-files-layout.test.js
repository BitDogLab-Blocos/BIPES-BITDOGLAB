'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const layoutPath = path.resolve(
  __dirname,
  '..',
  'android',
  'app',
  'src',
  'main',
  'res',
  'raw',
  'mobile_layout.css'
);

const layout = fs.readFileSync(layoutPath, 'utf8');

test('mobile device files stack the list above the preview on narrow screens', () => {
  assert.match(
    layout,
    /html\.bipes-mobile-app #content_files \.device-files-body\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);[^}]*grid-template-rows:/s
  );
});

test('mobile device file actions remain in four visible columns', () => {
  assert.match(
    layout,
    /html\.bipes-mobile-app #content_files \.device-files-footer\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\);/s
  );
  assert.match(
    layout,
    /html\.bipes-mobile-app #content_files \.device-files-action\s*\{[^}]*width:\s*100%;/s
  );
});

test('mobile CSV preview keeps touch scrolling and compact cells', () => {
  assert.match(
    layout,
    /html\.bipes-mobile-app #content_files \.device-files-csv-scroll\s*\{[^}]*overscroll-behavior:\s*contain;[^}]*-webkit-overflow-scrolling:\s*touch;/s
  );
  assert.match(
    layout,
    /html\.bipes-mobile-app #content_files \.device-files-csv-table th,[\s\S]*?min-width:\s*5\.25rem;/
  );
});
