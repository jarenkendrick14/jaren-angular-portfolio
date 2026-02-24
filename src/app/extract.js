const fs = require('fs');
const path = require('path');

// Configuration: Add files or folders you want to ignore
const IGNORE_LIST = [
  'node_modules',
  '.git',
  '.env',
  'environment.ts',
  'environment.prod.ts',
  'dist',
  '.angular',
  'package-lock.json',
  'extract.js' // Ignore this script itself
];

const OUTPUT_FILE = 'project_bundle.txt';

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (IGNORE_LIST.includes(file)) return;

    if (stat.isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function bundleProject() {
  const allFiles = getFiles('.');
  let combinedContent = '';

  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    combinedContent += `\n--- DIRECTORY: ${file} ---\n`;
    combinedContent += content + '\n';
  });

  fs.writeFileSync(OUTPUT_FILE, combinedContent);
  console.log(`Success! Your project is bundled in ${OUTPUT_FILE}`);
}

bundleProject();