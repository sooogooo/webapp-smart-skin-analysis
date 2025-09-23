// splashAnimations.ts

// FIX: Define a custom canvas context to allow for storing state properties like stars, particles, etc.
// This resolves multiple TypeScript errors about properties not existing on CanvasRenderingContext2D.
interface CustomCanvasRenderingContext2D extends CanvasRenderingContext2D {
  stars?: { x: number; y: number; z: number }[];
  particles?: { x: number; y: number; speed: number; size: number; color: string; wind: number }[];
  particlesType?: 'snow' | 'leaves' | 'rain';
  cells?: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[];
  drops?: number[];
  points?: { x: number; y: number; vx: number; vy: number; color: string }[];
  inkDrops?: { x: number; y: number; r: number; maxR: number; color: string }[];
  // FIX: Add a separate property for `flowingParticles` animation to resolve type conflict.
  flowingParticles?: { x: number; y: number; life: number }[];
}

type AnimationFn = (ctx: CustomCanvasRenderingContext2D, width: number, height: number, frame: number) => void;

// --- Helper Functions ---
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

// --- Animation Definitions ---

const starfield: AnimationFn = (ctx, width, height, frame) => {
  if (frame === 1 || !ctx.stars) {
    ctx.stars = Array.from({ length: 500 }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      z: rand(0, width),
    }));
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "white";
  ctx.stars.forEach(star => {
    star.z -= 2;
    if (star.z <= 0) {
      star.z = width;
      star.x = rand(0, width);
      star.y = rand(0, height);
    }
    const k = 128 / star.z;
    const px = star.x * k + width / 2;
    const py = star.y * k + height / 2;
    if (px > 0 && px < width && py > 0 && py < height) {
      const size = (1 - star.z / width) * 5;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
};

const seasonsFalling: (type: 'snow' | 'leaves' | 'rain') => AnimationFn = (type) => (ctx, width, height, frame) => {
  if (frame === 1 || !ctx.particles || ctx.particlesType !== type) {
    ctx.particles = Array.from({ length: 100 }, () => ({
      x: rand(0, width),
      y: rand(-height, 0),
      speed: rand(1, 5),
      size: rand(1, type === 'leaves' ? 6 : 3),
      color: type === 'leaves' ? `hsl(${rand(0, 50)}, 100%, 50%)` : 'white',
      wind: rand(-0.5, 0.5)
    }));
    ctx.particlesType = type;
  }
  ctx.fillStyle = `rgba(0, 0, 0, ${type === 'rain' ? 0.2 : 0.05})`;
  ctx.fillRect(0, 0, width, height);

  ctx.particles.forEach(p => {
    p.y += p.speed;
    p.x += p.wind;
    if (p.y > height) {
      p.y = -p.size;
      p.x = rand(0, width);
    }
    if (p.x > width || p.x < 0) {
        p.wind *= -1;
    }
    
    ctx.fillStyle = p.color;
    if (type === 'rain') {
        ctx.fillRect(p.x, p.y, 1, p.size * 3);
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
  });
};

const springBlossom: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    if (frame % 10 === 0) {
        const x = rand(0, width);
        const y = rand(0, height);
        const size = rand(5, 20);
        const color = `hsl(${rand(300, 360)}, 100%, ${rand(70, 90)}%)`;
        ctx.fillStyle = color;
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(x + Math.cos(angle) * size, y + Math.sin(angle) * size, size / 2, size / 4, angle, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

const summerHeatwave: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 10; i++) {
        ctx.strokeStyle = `rgba(255, ${rand(100, 200)}, 0, 0.2)`;
        ctx.lineWidth = rand(1, 3);
        ctx.beginPath();
        const y = rand(0, height);
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(width / 3, y + Math.sin(frame * 0.05 + i) * 20, width * 2/3, y - Math.sin(frame * 0.05 + i) * 20, width, y);
        ctx.stroke();
    }
};


const nestedLoops: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = `hsl(${frame % 360}, 100%, 70%)`;
    ctx.lineWidth = 2;
    const centerX = width / 2;
    const centerY = height / 2;
    for (let i = 0; i < 10; i++) {
        const radius = i * 20 + (frame % 20);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }
};

const topologicalTransform: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    const t = Math.sin(frame * 0.01) * 0.5 + 0.5; // 0 to 1
    const points = 5;
    const radius = Math.min(width, height) * 0.3;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        // Interpolate between a square (t=0) and a circle (t=1)
        const xCircle = width / 2 + radius * Math.cos(angle);
        const yCircle = height / 2 + radius * Math.sin(angle);
        const xSquare = width/2 + radius * (Math.abs(Math.cos(angle)) * Math.cos(angle) > 0 ? 1 : -1) * Math.pow(Math.abs(Math.cos(angle)), 0.1);
        const ySquare = height/2 + radius * (Math.abs(Math.sin(angle)) * Math.sin(angle) > 0 ? 1 : -1) * Math.pow(Math.abs(Math.sin(angle)), 0.1);
        
        const x = xCircle * t + xSquare * (1 - t);
        const y = yCircle * t + ySquare * (1 - t);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
};


const selfReference: AnimationFn = (ctx, width, height, frame) => {
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(0.98, 0.98);
    ctx.rotate(0.01);
    ctx.drawImage(ctx.canvas, -width / 2, -height / 2);
    ctx.restore();
    ctx.strokeStyle = `hsl(${frame % 360}, 80%, 60%)`;
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, width - 20, height - 20);
};

const microscopic: AnimationFn = (ctx, width, height, frame) => {
  if (frame === 1 || !ctx.cells) {
    ctx.cells = Array.from({ length: 50 }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      vx: rand(-1, 1),
      vy: rand(-1, 1),
      radius: rand(10, 40),
      color: `hsla(${rand(180, 240)}, 100%, 70%, 0.5)`,
    }));
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, width, height);
  ctx.cells.forEach(cell => {
    cell.x += cell.vx;
    cell.y += cell.vy;
    if (cell.x < 0 || cell.x > width) cell.vx *= -1;
    if (cell.y < 0 || cell.y > height) cell.vy *= -1;
    ctx.fillStyle = cell.color;
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
    ctx.fill();
  });
};

const detailedLines: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 20; i++) {
        ctx.strokeStyle = `hsla(${rand(0, 360)}, 100%, 80%, 0.5)`;
        ctx.lineWidth = rand(0.5, 2);
        ctx.beginPath();
        ctx.moveTo(rand(0, width), rand(0, height));
        ctx.lineTo(rand(0, width), rand(0, height));
        ctx.stroke();
    }
};

const cosmicNebula: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 5; i++) {
        const x = width / 2 + Math.sin(frame * 0.01 + i) * width * 0.3;
        const y = height / 2 + Math.cos(frame * 0.015 + i) * height * 0.3;
        const radius = rand(50, 200);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, `hsla(${180 + i * 30}, 100%, 70%, 0.2)`);
        grad.addColorStop(1, `hsla(${180 + i * 30}, 100%, 70%, 0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
    }
};

const digitalRain: AnimationFn = (ctx, width, height, frame) => {
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    if (frame === 1 || !ctx.drops) {
        ctx.drops = Array(columns).fill(1);
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#0F0';
    ctx.font = `${fontSize}px monospace`;
    for(let i = 0; i < ctx.drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        ctx.fillText(text, i * fontSize, ctx.drops[i] * fontSize);
        if(ctx.drops[i] * fontSize > height && Math.random() > 0.975) {
            ctx.drops[i] = 0;
        }
        ctx.drops[i]++;
    }
};

const lissajousCurve: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    const cx = width / 2;
    const cy = height / 2;
    const a = 3; 
    const b = 4; 
    ctx.beginPath();
    for (let i = 0; i < Math.PI * 2; i += 0.01) {
        const x = cx + Math.sin(a * i + frame * 0.01) * width * 0.4;
        const y = cy + Math.sin(b * i) * height * 0.4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
};

const fractalTree: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "white";
    
    function drawBranch(x1: number, y1: number, angle: number, depth: number) {
        if (depth === 0) return;
        const len = depth * 10;
        const x2 = x1 + Math.cos(angle) * len;
        const y2 = y1 + Math.sin(angle) * len;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        const angleChange = Math.sin(frame * 0.005) * 0.5 + 0.5; // 0 to 1
        drawBranch(x2, y2, angle - angleChange, depth - 1);
        drawBranch(x2, y2, angle + angleChange, depth - 1);
    }
    
    drawBranch(width / 2, height, -Math.PI / 2, 8);
};

const waveGrid: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    const gridSize = 30;
    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            const dist = Math.sqrt(Math.pow(x - width/2, 2) + Math.pow(y - height/2, 2));
            const size = Math.sin(dist * 0.05 - frame * 0.1) * 5 + 5;
            ctx.fillStyle = `hsl(${dist * 0.5}, 100%, 70%)`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

const plasma: AnimationFn = (ctx, width, height, frame) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const i = (x + y * width) * 4;
            const v = Math.sin(x * 0.1 + frame * 0.05) + Math.sin(y * 0.1 + frame * 0.05) + Math.sin((x+y)*0.1 + frame*0.05) + Math.sin(Math.sqrt(x*x+y*y)*0.1 + frame * 0.05);
            data[i] = Math.sin(v * Math.PI) * 128 + 128;
            data[i + 1] = Math.sin(v * Math.PI + 2 * Math.PI / 3) * 128 + 128;
            data[i + 2] = Math.sin(v * Math.PI + 4 * Math.PI / 3) * 128 + 128;
            data[i + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

const flowingParticles: AnimationFn = (ctx, width, height, frame) => {
  // FIX: Use `ctx.flowingParticles` to avoid conflict with `ctx.particles` used by another animation.
  if (frame === 1 || !ctx.flowingParticles) {
    ctx.flowingParticles = Array.from({ length: 1000 }, () => ({
      x: rand(0, width),
      y: rand(0, height),
      life: 1,
    }));
  }
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  ctx.fillRect(0, 0, width, height);

  ctx.flowingParticles.forEach(p => {
    const angle = (noise(p.x * 0.01, p.y * 0.01, frame * 0.005)) * Math.PI * 2;
    p.x += Math.cos(angle) * 2;
    p.y += Math.sin(angle) * 2;
    
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = rand(0, width);
      p.y = rand(0, height);
    }

    ctx.fillStyle = `hsl(${angle * (180/Math.PI)}, 100%, 70%)`;
    ctx.fillRect(p.x, p.y, 1, 1);
  });

  // Perlin noise function
  function noise(x: number, y: number, z: number) {
    const p = new Array(512);
    const permutation = [ 151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];
    for (let i=0; i < 256 ; i++) p[256+i] = p[i] = permutation[i];
    
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    const u = fade(x), v = fade(y), w = fade(z);
    const A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;
    return scale(lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ), grad(p[BA  ], x-1, y  , z   )),
                                     lerp(u, grad(p[AB  ], x  , y-1, z   ), grad(p[BB  ], x-1, y-1, z   ))),
                             lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ), grad(p[BA+1], x-1, y  , z-1 )),
                                     lerp(u, grad(p[AB+1], x  , y-1, z-1 ), grad(p[BB+1], x-1, y-1, z-1 )))));
    function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t: number, a: number, b: number) { return a + t * (b - a); }
    function grad(hash: number, x: number, y: number, z: number) {
      const h = hash & 15;
      const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
      return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    function scale(n: number) { return (1 + n) / 2; }
  }
};

const voronoi: AnimationFn = (ctx, width, height, frame) => {
    if (frame === 1 || !ctx.points) {
        ctx.points = Array.from({ length: 50 }, () => ({
            x: rand(0, width),
            y: rand(0, height),
            vx: rand(-0.5, 0.5),
            vy: rand(-0.5, 0.5),
            color: `hsl(${rand(0, 360)}, 100%, 70%)`
        }));
    }
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    ctx.points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if(p.x < 0 || p.x > width) p.vx *= -1;
        if(p.y < 0 || p.y > height) p.vy *= -1;
    });

    for (let x = 0; x < width; x+=5) {
        for (let y = 0; y < height; y+=5) {
            let minDist = Infinity;
            let closestPoint: { color: string, x: number, y: number } | null = null;
            for (const p of ctx.points) {
                const d = (p.x - x)**2 + (p.y - y)**2;
                if (d < minDist) {
                    minDist = d;
                    closestPoint = p;
                }
            }
            if (closestPoint) {
                const color = parseInt(closestPoint.color.slice(4), 10);
                const r = (color >> 16) & 255;
                const g = (color >> 8) & 255;
                const b = color & 255;

                for(let dx=0; dx<5; dx++) {
                    for(let dy=0; dy<5; dy++) {
                        const i = ((x+dx) + (y+dy) * width) * 4;
                        data[i] = Math.sin(minDist * 0.001 + frame * 0.05) * 128 + 128;
                        data[i+1] = g;
                        data[i+2] = b;
                        data[i+3] = 255;
                    }
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

const inkDrop: AnimationFn = (ctx, width, height, frame) => {
    if (frame % 100 === 1) {
      ctx.inkDrops = ctx.inkDrops || [];
      ctx.inkDrops.push({
        x: rand(0, width),
        y: rand(0, height),
        r: 0,
        maxR: rand(100, 300),
        color: `hsla(${rand(0, 360)}, 100%, 60%, 0.1)`,
      });
      if (ctx.inkDrops.length > 10) ctx.inkDrops.shift();
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,width,height);
    
    ctx.inkDrops?.forEach(drop => {
        drop.r += 1;
        if (drop.r < drop.maxR) {
            ctx.fillStyle = drop.color;
            ctx.beginPath();
            ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
            ctx.fill();
        }
    });
};

const aurora: AnimationFn = (ctx, width, height, frame) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 3; i++) {
        const x = width / 2;
        const y = height * 0.2 + i * 50;
        const grad = ctx.createLinearGradient(0, y, width, y);
        const color = `hsla(${140 + i*20 + Math.sin(frame*0.01)*20}, 100%, 60%, 0.05)`;
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(
            width * 0.3, y + Math.sin(frame * 0.02 + i) * 100,
            width * 0.7, y - Math.sin(frame * 0.02 + i) * 100,
            width, y
        );
        ctx.bezierCurveTo(
            width * 0.7, y - Math.sin(frame * 0.02 + i) * 100 - 100,
            width * 0.3, y + Math.sin(frame * 0.02 + i) * 100 - 100,
            0, y
        );
        ctx.closePath();
        ctx.fill();
    }
};

const glitch: AnimationFn = (ctx, width, height, frame) => {
    if (frame % 10 > 7) {
        const x = rand(0, width);
        const y = rand(0, height);
        const w = rand(50, width / 2);
        const h = rand(5, 50);
        const imageData = ctx.getImageData(x, y, w, h);
        ctx.putImageData(imageData, x + rand(-20, 20), y + rand(-10, 10));
    }
    if (frame % 20 === 0) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0,0,width,height);
        ctx.font = '80px monospace';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('美', width/2, height/2);
    }
};

export const ANIMATIONS: AnimationFn[] = [
  starfield,
  seasonsFalling('snow'),
  nestedLoops,
  topologicalTransform,
  microscopic,
  cosmicNebula,
  digitalRain,
  seasonsFalling('leaves'),
  springBlossom,
  summerHeatwave,
  lissajousCurve,
  fractalTree,
  waveGrid,
  plasma,
  flowingParticles,
  voronoi,
  selfReference,
  detailedLines,
  inkDrop,
  aurora,
  glitch,
  seasonsFalling('rain'),
];