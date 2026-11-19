import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';

const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const postJsonPath = path.join(botDir, 'POST.json');

try {
  if (!fs.existsSync(postJsonPath)) {
    console.error(`Error: POST.json not found at ${postJsonPath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(postJsonPath, 'utf8');
  const post = JSON.parse(rawData);

  if (!post || typeof post.url !== 'string') {
    console.error('Error: POST.json must contain a valid "url" string property.');
    process.exit(1);
  }

  const urlPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/;
  if (!urlPattern.test(post.url)) {
    console.error(`Error: URL "${post.url}" does not match required pattern.`);
    process.exit(1);
  }

  fs.mkdirSync(outputDir, { recursive: true });
  const outputFilePath = path.join(outputDir, 'POST.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(post, null, 2));

  console.log(post.url);
} catch (err: any) {
  console.error(`Error processing post: ${err.message}`);
  process.exit(1);
}
