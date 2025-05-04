#!/usr/bin/env node

import { createServer } from 'vite';
import electronPath from 'electron';
import { spawn } from 'child_process';
import { execSync } from 'child_process';
import { watch } from 'fs';

/** @type 'production' | 'development'' */
const mode = (process.env.MODE = process.env.MODE || 'development');

/** @type {import('vite').LogLevel} */
const logLevel = 'warn';

/**
 * Setup watcher for main process
 * @param {import('vite').ViteDevServer} watchServer Renderer watch server instance.
 */
function setupMainPackageWatcher({ resolvedUrls, ws }) {
    process.env.VITE_DEV_SERVER_URL = resolvedUrls.local[0];

    /** @type {ChildProcess | null} */
    let electronApp = null;

    const restartElectron = () => {
        // Transpile Electron code
        try {
            console.log('🔄 Compiling Electron...');
            execSync('npm run transpile:electron', { stdio: 'inherit' });

            // Kill electron if process already exists
            if (electronApp !== null) {
                electronApp.removeListener('exit', process.exit);
                electronApp.kill('SIGINT');
                electronApp = null;
            }

            // Spawn new electron process
            console.log('🚀 Starting Electron...');
            electronApp = spawn(String(electronPath), ['--inspect', '.'], {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    NODE_ENV: 'development',
                }
            });

            // Stop the watch script when the application has been quit
            electronApp.addListener('exit', process.exit);
        } catch (error) {
            console.error('❌ Error during compilation:', error);
        }
    };

    // Watch for changes in the main process files
    console.log('👀 Watching for Electron file changes...');
    const mainWatcher = watch('./src/electron', { recursive: true }, (eventType, filename) => {
        if (!filename) return;

        if (filename.includes('preload')) {
            // For preload script changes, compile and reload renderer
            console.log(`🔄 Detected change in ${filename}, recompiling preload...`);
            try {
                execSync('npm run transpile:electron', { stdio: 'inherit' });
                console.log('🔄 Reloading renderer...');
                ws.send({
                    type: 'full-reload'
                });
            } catch (error) {
                console.error('❌ Error during preload compilation:', error);
            }
        } else {
            // For other main process files, restart electron
            console.log(`🔄 Detected change in ${filename}, restarting Electron...`);
            restartElectron();
        }
    });

    // Initial start
    restartElectron();

    return { close: () => mainWatcher.close() };
}

/**
 * Dev server for UI/Renderer
 * This must be first because setupMainPackageWatcher
 * depends on the dev server properties
 */
console.log('🚀 Starting development server...');
const rendererWatchServer = await createServer({
    mode,
    logLevel,
    configFile: './vite.config.ts',
}).then(s => s.listen());

console.log(`🌐 Development server running at: ${rendererWatchServer.resolvedUrls.local[0]}`);

await setupMainPackageWatcher(rendererWatchServer);

// Clean up on process exit
process.on('SIGINT', () => {
    console.log('🛑 Shutting down...');
    process.exit();
});