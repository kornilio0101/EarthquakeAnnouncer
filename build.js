import { execSync } from 'child_process';
import { readFileSync } from 'fs';

try {
    // 1. Read version from package.json
    const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
    const version = pkg.version;
    const outputDir = `release/v${version}`;

    console.log(`\n🚀 Starting build for version: ${version}`);
    console.log(`📂 Output directory: ${outputDir}\n`);

    // 2. Run Vite build
    console.log('--- Running Vite Build ---');
    execSync('npx vite build', { stdio: 'inherit' });

    // 3. Run Electron Builder with output override
    console.log('\n--- Running Electron Builder ---');
    // -c.directories.output overrides the config in electron-builder.json5
    execSync(`npx electron-builder --win --dir -c.directories.output=${outputDir}`, { stdio: 'inherit' });

    console.log(`\n✅ Build completed successfully! Check the ${outputDir} folder.\n`);
} catch (error) {
    console.error('\n❌ Build failed:', error);
    process.exit(1);
}
