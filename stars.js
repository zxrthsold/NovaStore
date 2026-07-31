const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function makeStar() {
  const types = ['circle', 'sparkle', 'diamond'];
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    baseAlpha: Math.random() * 0.55 + 0.3,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.006,
    type: types[Math.floor(Math.random() * types.length)],
    life: Math.random() * 350 + 180,
    age: Math.random() * 350
  };
}

function initStars() {
  stars = [];
  const count = Math.floor((w * h) / 7500);
  for (let i = 0; i < count; i++) stars.push(makeStar());
}

function drawSparkle(x, y, size, alpha) {
  // 4-point sparkle / twinkle shape
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = `rgba(200,215,255,${alpha})`;
  ctx.beginPath();
  ctx.moveTo(0, -size * 2.4);
  ctx.quadraticCurveTo(size * 0.3, -size * 0.3, size * 2.4, 0);
  ctx.quadraticCurveTo(size * 0.3, size * 0.3, 0, size * 2.4);
  ctx.quadraticCurveTo(-size * 0.3, size * 0.3, -size * 2.4, 0);
  ctx.quadraticCurveTo(-size * 0.3, -size * 0.3, 0, -size * 2.4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawDiamond(x, y, size, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillStyle = `rgba(180,200,255,${alpha})`;
  ctx.fillRect(-size, -size, size * 2, size * 2);
  ctx.restore();
}

function drawCircle(x, y, r, alpha) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(210,220,255,${alpha})`;
  ctx.fill();
}

let t = 0;
function draw() {
  t += 1;
  ctx.clearRect(0, 0, w, h);

  // faint constellation lines between nearby stars
  ctx.lineWidth = 0.5;
  for (let i = 0; i < stars.length; i++) {
    const a = stars[i];
    const b = stars[(i + 1) % stars.length];
    const dx = a.x - b.x, dy = a.y - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 90) {
      ctx.strokeStyle = `rgba(150,175,255,${0.08 * (1 - dist / 90)})`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.x += s.vx; s.y += s.vy;
    s.age += 1;

    if (s.x < -20) s.x = w + 20; if (s.x > w + 20) s.x = -20;
    if (s.y < -20) s.y = h + 20; if (s.y > h + 20) s.y = -20;

    const lifeRatio = s.age / s.life;
    let lifeFade = 1;
    if (lifeRatio < 0.15) lifeFade = lifeRatio / 0.15;
    else if (lifeRatio > 0.85) lifeFade = (1 - lifeRatio) / 0.15;
    if (lifeRatio >= 1) {
      stars[i] = makeStar();
      stars[i].age = 0;
      continue;
    }

    const twinkle = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.phase);
    const alpha = s.baseAlpha * twinkle * Math.max(0, lifeFade);

    if (s.type === 'sparkle') drawSparkle(s.x, s.y, s.r, alpha);
    else if (s.type === 'diamond') drawDiamond(s.x, s.y, s.r * 1.3, alpha);
    else drawCircle(s.x, s.y, s.r, alpha);
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => { resize(); initStars(); });
resize(); initStars(); draw();
