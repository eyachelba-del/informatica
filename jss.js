
 const matrixCanvas = document.getElementById('matrix'); 
 const mctx = matrixCanvas.getContext('2d');
let M = { w: window.innerWidth, h: window.innerHeight, font: 16, letters: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$/\\<>[]=+-'.split(''), cols: 0, drops: [] }; 
function initMatrix() { M.w = window.innerWidth;
     M.h = window.innerHeight; 
     matrixCanvas.width = M.w;
    matrixCanvas.height = M.h; 
    M.cols = Math.floor(M.w / M.font);
    M.drops = Array.from({length: M.cols}, ()=> Math.floor(Math.random()*M.h / M.font)); }
    function drawMatrix() { mctx.fillStyle = 'rgba(0,0,0,0.07)';
    mctx.fillRect(0,0,M.w,M.h); 
    mctx.font = '${M.font}px monospace';
    for (let i=0;i<M.cols;i++){ const txt = M.letters[Math.floor(Math.random()*M.letters.length)];
         const x = i * M.font;
        const y = M.drops[i] * M.font; 
        mctx.fillStyle = 'rgba(180,255,180,0.98)';
        mctx.fillText(txt, x, y); 
        if (Math.random() > 0.85) { mctx.fillStyle = 'rgba(0,255,80,0.25)'; 
        mctx.fillText(M.letters[Math.floor(Math.random()*M.letters.length)], x, y - M.font*0.6); } 
        if (y > M.h && Math.random() > 0.975) M.drops[i] = 0;
         M.drops[i]++; } }
          /* ----------------------- Glowing circuits + moving current + nodes ----------------------- */ 
          const circuitCanvas = document.getElementById('circuit'); const cctx = circuitCanvas.getContext('2d'); 
          let C = { w: window.innerWidth, h: window.innerHeight, wires: [], count: 40 }; 
          function rand(min,max){ return Math.random()*(max-min)+min; } 
          function initCircuits(){ C.w = window.innerWidth; C.h = window.innerHeight; 
            circuitCanvas.width = C.w; 
            circuitCanvas.height = C.h;
            C.wires = []; for (let i=0;
            i<C.count;i++){ const horiz = Math.random()>0.5;
                 const len = rand(80, 320); const x = rand(0, C.w); const y = rand(0, C.h);
                  const speed = rand(0.6, 2.2) * (Math.random()>0.5?1:-1); const glow = rand(0.28, 0.9); 
                  const dots = Math.floor(rand(2,6)); const phase = rand(0, Math.PI*2);
                C.wires.push({x,y,len,horiz,speed,glow,dots,phase,offset: rand(0,1)}); } } 
                function drawCircuits(time){ cctx.clearRect(0,0,C.w,C.h); 
                    cctx.globalCompositeOperation = 'lighter'; 
                    C.wires.forEach((w, idx)=>{ w.phase += 0.007 * Math.sign(w.speed);
                         const wob = Math.sin(w.phase) * 6; const x1 = w.x + (w.horiz?0: wob); 
                         const y1 = w.y + (w.horiz? wob:0); const x2 = w.horiz? w.x + w.len : w.x + wob*0.5;
                          const y2 = w.horiz? w.y + wob*0.2 : w.y + w.len; 
                        cctx.beginPath();
                           cctx.moveTo(x1,y1); cctx.lineTo(x2,y2); cctx.lineWidth = 1;
                            cctx.strokeStyle = 'rgba(0,200,80,0.06)'; cctx.shadowBlur = 0; cctx.stroke();
                      cctx .beginPath(); cctx.moveTo(x1,y1); cctx.lineTo(x2,y2); 
                     const pulse = 0.5 + 0.5 * Math.sin((time*0.002) + idx);
                      const alpha = 0.12 + 0.6 * w.glow * pulse; cctx.lineWidth = 1.6; 
                      cctx.strokeStyle ='rgba(0,255,140,${alpha})' ; cctx.shadowColor = 'rgba(0,255,80,0.9)';
                       cctx.shadowBlur = 18 * w.glow * pulse; cctx.stroke(); const total = w.len; 
                       for (let d=0; d<w.dots; d++){ const base = (w.offset + (d/w.dots) + (time*0.00018*w.speed)) % 1; const t = base * total; let dx = w.horiz? (x1 + t) : x1; let dy = w.horiz? y1 : (y1 + t); const jitter = Math.sin(time*0.003 + d*2 + idx) * 1.6; dx += w.horiz? 0 : jitter; dy += w.horiz? jitter : 0; cctx.beginPath(); cctx.arc(dx, dy, 2.4, 0, Math.PI*2); cctx.fillStyle = 'rgba(200,255,200,${0.88 - d*0.12})'; cctx.shadowBlur = 12; 
                       cctx.shadowColor = 'rgba(160,255,160,0.9)'; cctx.fill(); } 
                      const nodePulse = 0.6 + 0.4 * Math.sin((time*0.003) + idx);
                       cctx.beginPath(); cctx.arc(x2, y2, 2.2 + nodePulse*1.6, 0, Math.PI*2); 
                       cctx.fillStyle = 'rgba(140,255,140,$,{0.18 + 0.45*nodePulse})';
                        cctx.shadowBlur = 18 * nodePulse; cctx.shadowColor = 'rgba(120,255,120,0.9)'; cctx.fill();
                          w.offset = (w.offset + 0.0016 * Math.abs(w.speed)) % 1; })
                         ; cctx.globalCompositeOperation = 'source-over'; } 
                         /* ----------------------- Particles (floating glowing points) ----------------------- */ 
                         const particlesCanvas = document.getElementById('particles'); const pctx = particlesCanvas.getContext('2d'); 
                         let P = { w: window.innerWidth, h: window.innerHeight, points: [] }; 
                         function initParticles(){ P.w = window.innerWidth; P.h = window.innerHeight; 
                            particlesCanvas.width = P.w; particlesCanvas.height = P.h;
                             P.points = []; 
                             for (let i=0;i<80;i++){ P.points.push({ x: rand(0,P.w), y: rand(0,P.h), r: rand(0.8,3.2), dx: rand(-0.35,0.35), dy: rand(-0.35,0.35), alpha: rand(0.4,0.95), dhal: rand(0.002,0.01) }); } }
                 function drawParticles(){ pctx.clearRect(0,0,P.w,P.h); P.points.forEach(pt=>{ pctx.beginPath();
                     pctx.arc(pt.x, pt.y, pt.r, 0, Math.PI*2); pctx.fillStyle =' rgba(180,255,180,${pt.alpha})'; 
                     pctx.shadowColor = '#0f0'; pctx.shadowBlur = 10; pctx.fill(); pt.x += pt.dx; pt.y += pt.dy; pt.alpha += pt.dhal; 
                     if (pt.x < 0 || pt.x > P.w) pt.dx *= -1; if (pt.y < 0 || pt.y > P.h) pt.dy *= -1; 
                     if (pt.alpha > 1 || pt.alpha < 0.2) pt.dhal *= -1; }); }
                      function resizeAll(){ initMatrix(); initCircuits(); 
                        initParticles(); } window.addEventListener('resize', resizeAll); let last = 0; 
                    function loop(ts){ drawMatrix(); drawCircuits(ts); drawParticles(); requestAnimationFrame(loop); } initMatrix(); initCircuits(); initParticles(); requestAnimationFrame(loop); 
                         const msgEl = document.getElementById('message'); 

let wrongAttempts = 0; 

function checkAnswer(choice){
  if (choice === 'informatique') {
    msgEl.style.color = '#bfffbf';
    msgEl.textContent = '✔ baseee info la prima   ! 💚';
    msgEl.animate([ { transform: 'scale(1)', opacity: 0.95 }, { transform: 'scale(1.06)', opacity: 1 }, { transform: 'scale(1)', opacity: 0.95 } ], { duration: 900, iterations: 1 });
    wrongAttempts = 0; // إعادة تعيين المحاولات عند الإجابة الصحيحة
  }
  else {
    wrongAttempts++;
    msgEl.style.color = '#ff6b6b';
    if (wrongAttempts === 1) {
      msgEl.textContent = 'LA 8ALET TRY AGAIN ';
    } else if (wrongAttempts === 2) {
      msgEl.textContent = 'TI LE FI9 3AD  ';
    } else if (wrongAttempts === 3) {
      msgEl.textContent = 'MAW 9OLNA 8ALET 3AD  ';
    }else if (wrongAttempts ===4 ) {
      msgEl.textContent = 'OOO LEEEEE LEEE ';
    }else if (wrongAttempts === 5) {
      msgEl.textContent = 'MAAHA2AHH !!! ';
    }
    else if (wrongAttempts === 6) {
      msgEl.textContent = 'HAW CHN9RBLK TIBDA BIL "IN" W TOUFA BIL"FO" ';
    }
    else if (wrongAttempts === 7) {
      msgEl.textContent = 'LE TI HAK BHYM INTY MEKCH BICH TAL3HAA  ';}
     else {
      msgEl.textContent = ' NooOOooOooOoOOOo 🗣️ ';
    }
    const card = document.querySelector('.card');
    card.animate([ { transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' } ], { duration: 260, iterations: 1 });
    clearTimeout(msgEl._t);
    msgEl._t = setTimeout(()=>{ msgEl.textContent = ''; }, 10000);
  }
}