#!/usr/bin/env node

/**
 * Vercel Setup Helper Script
 * This script helps you set up Vercel deployment for your project
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 ZenKoi Vercel Setup Helper\n');

// Check if Vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI is not installed');
  console.log('📦 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
  console.log('✅ Vercel CLI installed successfully');
}

// Check if user is logged in
try {
  execSync('vercel whoami', { stdio: 'pipe' });
  console.log('✅ You are logged in to Vercel');
} catch (error) {
  console.log('❌ You are not logged in to Vercel');
  console.log('🔐 Please login to Vercel:');
  execSync('vercel login', { stdio: 'inherit' });
}

// Check if project is already linked
const vercelConfig = path.join(process.cwd(), '.vercel');
if (fs.existsSync(vercelConfig)) {
  console.log('✅ Project is already linked to Vercel');
} else {
  console.log('🔗 Linking project to Vercel...');
  execSync('vercel link', { stdio: 'inherit' });
  console.log('✅ Project linked successfully');
}

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Set up your environment variables in Vercel dashboard');
console.log('2. Push your code to GitHub');
console.log('3. Enable automatic deployments in Vercel');
console.log('4. Add VERCEL_TOKEN, VERCEL_ORG_ID, and VERCEL_PROJECT_ID to GitHub secrets');
console.log('\n📖 For detailed instructions, see VERCEL_DEPLOYMENT.md');

console.log('\n🔗 Useful links:');
console.log('- Vercel Dashboard: https://vercel.com/dashboard');
console.log('- Project Settings: https://vercel.com/dashboard/integrations');
console.log('- GitHub Secrets: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions');