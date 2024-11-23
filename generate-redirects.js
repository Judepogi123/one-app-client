import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the content for the _redirects file
const redirectsContent = `
/*    /index.html   200
`;

// Define the path to the build folder
const buildPath = path.join(__dirname, 'build', '_redirects');

// Write the content to the _redirects file in the build folder
fs.writeFileSync(buildPath, redirectsContent, 'utf8');

console.log('_redirects file created successfully in build folder.');
