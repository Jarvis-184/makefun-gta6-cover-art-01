/**
 * GTA 6 Cover Art Maker - Main Application Logic
 * 
 * Improved implementation with clamped pan/zoom, enhanced caption rendering,
 * and robust error handling.
 */

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Application State
let state = {
    width: 1080,
    height: 1080,
    panels: [
        { id: 'hero', image: null, rect: { x: 0, y: 0, w: 1080, h: 600 }, offset: { x: 0, y: 0 }, scale: 1 },
        { id: 'strip1', image: null, rect: { x: 0, y: 600, w: 540, h: 480 }, offset: { x: 0, y: 0 }, scale: 1 },
        { id: 'strip2', image: null, rect: { x: 540, y: 600, w: 540, h: 480 }, offset: { x: 0, y: 0 }, scale: 1 }
    ],
    selectedPanel: 0,
    caption: { title: 'GTA VI', subtitle: 'VICE CITY' },
    grade: null,
    isDragging: false,
    dragStart: { x: 0, y: 0 }
};

function init() {
    canvas.width = state.width;
    canvas.height = state.height;
    
    document.getElementById('titleInput').addEventListener('input', e => { state.caption.title = e.target.value; draw(); });
    document.getElementById('subtitleInput').addEventListener('input', e => { state.caption.subtitle = e.target.value; draw(); });
    
    canvas.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    canvas.addEventListener('dblclick', resetPanel);
    
    draw();
}

function getPanelAt(x, y) {
    return state.panels.findIndex(p => 
        x >= p.rect.x && x <= p.rect.x + p.rect.w && 
        y >= p.rect.y && y <= p.rect.y + p.rect.h
    );
}

function getCanvasPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
}

function resetPanel(e) {
    const pos = getCanvasPos(e);
    const panelIdx = getPanelAt(pos.x, pos.y);
    if (panelIdx !== -1) {
        state.panels[panelIdx].offset = { x: 0, y: 0 };
        state.panels[panelIdx].scale = 1;
        draw();
    }
}

function draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    state.panels.forEach((panel, index) => {
        ctx.save();
        ctx.beginPath();
        ctx.rect(panel.rect.x, panel.rect.y, panel.rect.w, panel.rect.h);
        ctx.clip();
        
        if (panel.image) {
            const coverScale = Math.max(panel.rect.w / panel.image.width, panel.rect.h / panel.image.height) * panel.scale;
            const dw = panel.image.width * coverScale;
            const dh = panel.image.height * coverScale;
            
            // Clamping logic
            const maxOffsetX = Math.max(0, (dw - panel.rect.w) / 2);
            const maxOffsetY = Math.max(0, (dh - panel.rect.h) / 2);
            panel.offset.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, panel.offset.x));
            panel.offset.y = Math.max(-maxOffsetY, Math.min(maxOffsetY, panel.offset.y));
            
            const dx = panel.rect.x + (panel.rect.w - dw) / 2 + panel.offset.x;
            const dy = panel.rect.y + (panel.rect.h - dh) / 2 + panel.offset.y;
            
            ctx.drawImage(panel.image, dx, dy, dw, dh);
        } else {
            ctx.fillStyle = '#ccc';
            ctx.fillRect(panel.rect.x, panel.rect.y, panel.rect.w, panel.rect.h);
        }
        
        ctx.restore();
        
        ctx.strokeStyle = (index === state.selectedPanel) ? '#ff0000' : 'white';
        ctx.lineWidth = 15;
        ctx.strokeRect(panel.rect.x, panel.rect.y, panel.rect.w, panel.rect.h);
    });

    if (state.grade) {
        ctx.fillStyle = getGradeColor(state.grade);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Improved Caption
    const drawText = (text, size, x, y) => {
        ctx.font = `bold ${size}px Archivo Black, sans-serif`;
        ctx.lineWidth = size / 20;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    };
    
    drawText(state.caption.title, 120, 60, 180);
    drawText(state.caption.subtitle, 80, 60, 280);
}

function getGradeColor(grade) {
    if (grade === 'sunset') return 'rgba(255, 100, 0, 0.2)';
    if (grade === 'neon') return 'rgba(0, 100, 255, 0.2)';
    if (grade === 'golden') return 'rgba(255, 200, 0, 0.2)';
    return 'transparent';
}

function startDrag(e) {
    const pos = getCanvasPos(e);
    const panelIdx = getPanelAt(pos.x, pos.y);
    if (panelIdx !== -1) {
        state.selectedPanel = panelIdx;
        state.isDragging = true;
        state.dragStart = pos;
        draw();
    }
}

function drag(e) {
    if (!state.isDragging) return;
    const pos = getCanvasPos(e);
    const dx = pos.x - state.dragStart.x;
    const dy = pos.y - state.dragStart.y;
    state.panels[state.selectedPanel].offset.x += dx;
    state.panels[state.selectedPanel].offset.y += dy;
    state.dragStart = pos;
    draw();
}

function endDrag() { state.isDragging = false; }

function setSize(w, h) {
    state.width = w; state.height = h;
    canvas.width = w; canvas.height = h;
    state.panels[0].rect = { x: 0, y: 0, w: w, h: h * 0.6 };
    state.panels[1].rect = { x: 0, y: h * 0.6, w: w / 2, h: h * 0.4 };
    state.panels[2].rect = { x: w / 2, y: h * 0.6, w: w / 2, h: h * 0.4 };
    draw();
}

function setGrade(grade) { state.grade = grade; draw(); }

function loadSample(url) {
    const img = new Image();
    img.onload = () => { state.panels[state.selectedPanel].image = img; draw(); };
    img.onerror = () => { console.error(`Failed to load sample image: ${url}`); };
    img.src = url;
}

function exportCanvas() {
    const link = document.createElement('a');
    link.download = 'cover-art.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

document.getElementById('photoInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => { state.panels[state.selectedPanel].image = img; draw(); };
        img.onerror = () => { console.error("Failed to load user image"); };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function setZoom(scale) {
    state.panels[state.selectedPanel].scale = scale;
    draw();
}

init();
