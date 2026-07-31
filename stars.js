const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let w, h, stars, links;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}

function makeStar() {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.5 + 0.4,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    baseAlpha: Math.random() * 0.55 + 0.25,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.015 + 0.004,
    life: Math.random() * 400 + 200,
    age: Math.random() * 400
  };
}

function initStars() {
  stars = [];
  const count = Math.floor((w * h) / 8000);
  for (let i = 0; i < count; i++) stars.push(makeStar());
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

    if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
    if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

    // slow fade in / out over the star's lifetime, plus a fast twinkle on top
    const lifeRatio = s.age / s.life;
    let lifeFade = 1;
    if (lifeRatio < 0.15) lifeFade = lifeRatio / 0.15;
    else if (lifeRatio > 0.85) lifeFade = (1 - lifeRatio) / 0.15;
    if (lifeRatio >= 1) {
      stars[i] = makeStar();
      stars[i].age = 0;
      continue;
    }

    const twinkle = 0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.phase);
    const alpha = s.baseAlpha * twinkle * Math.max(0, lifeFade);

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,215,255,${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

window.addEventListener('resize', () => { resize(); initStars(); });
resize(); initStars(); draw();
