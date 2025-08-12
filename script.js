// Simple top-down RC car demo
const canvas = document.getElementById('track');
const ctx = canvas.getContext('2d');

const W = canvas.width, H = canvas.height;

// Track: simple oval path defined by outer & inner radii
const centerX = W/2, centerY = H/2;
const outerR = 250, innerR = 140;

let keys = {};
let startTime = null;
let lapCount = 0;
let lastLapAngle = null;

const car = {
  x: centerX - outerR + 50,
  y: centerY,
  angle: 0, // radians, 0 pointing right
  speed: 0,
  maxSpeed: 3.0,
  accel: 0.06,
  friction: 0.02,
  turnSpeed: 0.04,
  width: 24,
  height: 12
};

document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup', e => { keys[e.key] = false; });

function pointOnEllipse(cx, cy, rx, ry, angle){
  return { x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) };
}

function drawTrack(){
  // outer
  ctx.fillStyle = '#2d2d2d';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, outerR, outerR*0.6, 0, 0, Math.PI*2);
  ctx.fill();
  // inner (grass)
  ctx.fillStyle = '#3b8b3b';
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, innerR, innerR*0.6, 0, 0, Math.PI*2);
  ctx.fill();
  // racing line (center)
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, (outerR+innerR)/2, ((outerR+innerR)/2)*0.6, 0, 0, Math.PI*2);
  ctx.stroke();
}

function drawCar(){
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);
  // body
  ctx.fillStyle = '#e74c3c';
  roundRect(ctx, -car.width/2, -car.height/2, car.width, car.height, 3, true, false);
  // windows
  ctx.fillStyle = '#111';
  ctx.fillRect(-6, -car.height/2+1, 12, 4);
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r, fill, stroke){
  if (typeof stroke === 'undefined'){ stroke = true; }
  if (typeof r === 'undefined'){ r = 5; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if(fill) ctx.fill();
  if(stroke) ctx.stroke();
}

function update(dt){
  // controls
  if (keys['ArrowUp'] || keys['w']) {
    car.speed += car.accel;
  } else if (keys['ArrowDown'] || keys['s']) {
    car.speed -= car.accel;
  } else {
    // friction
    if (car.speed > 0) car.speed = Math.max(0, car.speed - car.friction);
    else car.speed = Math.min(0, car.speed + car.friction);
  }
  // clamp speed
  car.speed = Math.max(-car.maxSpeed/2, Math.min(car.maxSpeed, car.speed));

  // turning
  if (keys['ArrowLeft'] || keys['a']) {
    car.angle -= car.turnSpeed * (car.speed / car.maxSpeed || 1);
  }
  if (keys['ArrowRight'] || keys['d']) {
    car.angle += car.turnSpeed * (car.speed / car.maxSpeed || 1);
  }

  // movement
  car.x += Math.cos(car.angle) * car.speed * dt;
  car.y += Math.sin(car.angle) * car.speed * dt;

  // keep car inside area (wrap-around)
  if (car.x < 0) car.x = W;
  if (car.x > W) car.x = 0;
  if (car.y < 0) car.y = H;
  if (car.y > H) car.y = 0;

  // lap counting logic: check angle from center
  const ang = Math.atan2(car.y - centerY, car.x - centerX);
  if (lastLapAngle === null) lastLapAngle = ang;
  // detect crossing near angle = -Math.PI/2 (top of ellipse)
  const crossAngle = -Math.PI/2;
  const diff = angleDiff(lastLapAngle, ang);
  // detect direction (clockwise)
  if (Math.abs(diff) > Math.PI/4){
    // big jump, ignore
  } else {
    // if car crosses the crossAngle region moving forward, increment lap
    if (isCrossing(lastLapAngle, ang, crossAngle) && car.speed > 0.6){
      lapCount++;
      document.getElementById('lap').textContent = lapCount;
      if (lapCount === 1){
        startTime = performance.now();
      }
    }
  }
  lastLapAngle = ang;
}

function isCrossing(a1, a2, target){
  // normalize to -PI..PI
  const n1 = normalize(a1), n2 = normalize(a2), t = normalize(target);
  // check if segment crosses target going forward
  if (n1 < t && n2 >= t) return true;
  if (n1 > n2 && (n1 < t || n2 >= t)) return true;
  return false;
}
function normalize(a){ while(a <= -Math.PI) a += Math.PI*2; while(a > Math.PI) a -= Math.PI*2; return a; }
function angleDiff(a,b){ return Math.atan2(Math.sin(b-a), Math.cos(b-a)); }

let lastTime = performance.now();
function loop(now){
  const dt = Math.min(1/30, (now - lastTime)/16.6667); // normalized to 60fps step
  lastTime = now;

  update(dt);
  render();

  // update time display
  if (startTime){
    const t = (performance.now() - startTime)/1000;
    document.getElementById('time').textContent = t.toFixed(1);
  }

  requestAnimationFrame(loop);
}

function render(){
  // clear
  ctx.clearRect(0,0,W,H);
  // draw track and center
  drawTrack();
  // draw car
  drawCar();
}

render();
requestAnimationFrame(loop);
console.log('Game loaded');

