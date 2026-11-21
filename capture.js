import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function waitForServer(url, timeout = 30000) {
    console.log(`Waiting for server at ${url}...`);
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            await new Promise((resolve, reject) => {
                http.get(url, (res) => {
                    if (res.statusCode === 200) resolve();
                    else reject();
                }).on('error', reject);
            });
            return true;
        } catch (e) {
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    return false;
}

async function capture() {
    const port = 8181;
    const server = spawn('node', ['serve.js', '--port', port.toString()], {
        detached: true,
        stdio: 'ignore'
    });

    let browser;
    try {
        if (!(await waitForServer(`http://127.0.0.1:${port}`))) {
            throw new Error('Server did not start');
        }

        browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(`http://127.0.0.1:${port}`);
        
        // Expose state to window for testing/waiting
        await page.evaluate(() => { window.state = state; });

        const samplePier = path.join(__dirname, 'app/samples/pier.jpg');
        const sampleBoulevard = path.join(__dirname, 'app/samples/boulevard.jpg');
        const canvas = page.locator('#canvas');

        // Helper to load image
        const loadToPanel = async (panelIndex, intrinsicX, intrinsicY, filePath) => {
            const box = await canvas.boundingBox();
            const { width: intrinsicWidth, height: intrinsicHeight } = await canvas.evaluate(el => ({
                width: el.width,
                height: el.height
            }));
            const scaleX = box.width / intrinsicWidth;
            const scaleY = box.height / intrinsicHeight;

            await canvas.click({ position: { x: intrinsicX * scaleX, y: intrinsicY * scaleY } });
            
            // Clear input first to ensure 'change' event fires
            await page.evaluate(() => { const i = document.getElementById('photoInput'); i.value = ''; });
            
            await page.setInputFiles('#photoInput', filePath);
            
            // Wait for the image to actually land in the app state
            await page.waitForFunction((idx) => window.state.panels[idx].image !== null, panelIndex);
        };

        try {
            await loadToPanel(0, 540, 300, samplePier); // Hero
            await loadToPanel(1, 270, 840, sampleBoulevard); // Strip 1
            await loadToPanel(2, 810, 840, sampleBoulevard); // Strip 2
        } catch (e) { throw new Error(`Failed to load panels: ${e.message}`); }

        try {
            await page.fill('#titleInput', 'GTA VI');
            await page.fill('#subtitleInput', 'VICE CITY');
            await page.click('text=Vice Sunset');
            await page.waitForTimeout(1000); // Allow grade/text
        } catch (e) { throw new Error(`Failed to set UI: ${e.message}`); }

        await page.evaluate(() => { state.selectedPanel = -1; draw(); });
        await page.waitForTimeout(500);

        // Ensure fonts
        await page.evaluate(() => document.fonts.ready);

        // Screenshot helper
        const saveScreenshot = async (name, locator, resizeFunc) => {
            const buffer = await locator.screenshot({ type: 'jpeg', quality: 80 });
            // Here I need to do the resizing if required.
            // The request says: "1-cover.jpg (square, scaled so the long side is 1280)"
            // "3-cover.jpg (portrait 1080x1350 canvas scaled to fit 1280)"
            // The original used dataURL then a canvas to resize.
            // I will use a similar approach inside the browser to get the buffer.
            
            const dataUrl = await page.evaluate(async (args) => {
                const canvas = document.querySelector('#canvas'); // Need to handle different locators
                // Actually the original used canvas.toDataURL.
                // The requirements say "square, scaled...". 
                // Let's stick to the approach that worked but refined.
                return ""; // Placeholder
            });
            // Actually, let's keep it simpler for now and follow the original logic
        };

        // Replicating original logic more closely but with the requested improvements
        
        // 1-cover.jpg
        console.log('Generating 1-cover.jpg...');
        const dataUrl1 = await page.evaluate(async () => {
            const canvas = document.querySelector('#canvas');
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const img = new Image();
            img.src = dataUrl;
            await img.decode();
            const canvas2 = document.createElement('canvas');
            // Square 1280x1280? The prompt says "square, scaled so the long side is 1280"
            // Wait, "square, scaled so the long side is 1280". 
            // If it's square, long side is the side. So 1280x1280.
            const size = 1280;
            canvas2.width = size;
            canvas2.height = size;
            const ctx2 = canvas2.getContext('2d');
            ctx2.drawImage(img, 0, 0, size, size);
            return canvas2.toDataURL('image/jpeg', 0.8);
        });
        fs.writeFileSync(path.join(__dirname, 'out/1-cover.jpg'), Buffer.from(dataUrl1.split(',')[1], 'base64'));

        // 2-editor.jpg
        console.log('Generating 2-editor.jpg...');
        await page.screenshot({ path: path.join(__dirname, 'out/2-editor.jpg'), type: 'jpeg', quality: 80 });

        // 3-cover.jpg
        console.log('Generating 3-cover.jpg...');
        await page.evaluate(() => setSize(1080, 1350));
        await page.waitForTimeout(1000); 
        
        const dataUrl2 = await page.evaluate(async () => {
            const canvas = document.querySelector('#canvas');
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            const img = new Image();
            img.src = dataUrl;
            await img.decode();
            const canvas2 = document.createElement('canvas');
            // Long side 1280, portrait.
            // Width 1080, Height 1350. Aspect ratio 1080/1350 = 0.8
            // Long side is 1350. If long side is 1280:
            // height = 1280. width = 1280 * 0.8 = 1024.
            canvas2.width = 1024;
            canvas2.height = 1280;
            const ctx2 = canvas2.getContext('2d');
            ctx2.drawImage(img, 0, 0, 1024, 1280);
            return canvas2.toDataURL('image/jpeg', 0.8);
        });
        fs.writeFileSync(path.join(__dirname, 'out/3-cover.jpg'), Buffer.from(dataUrl2.split(',')[1], 'base64'));
        
    } catch (err) {
        console.error('Error during capture:', err);
    } finally {
        if (browser) await browser.close();
        server.kill();
    }
}

capture();
