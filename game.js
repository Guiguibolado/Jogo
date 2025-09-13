// Mini Mario - jogo de plataforma simples em um único canvas
const platforms = [
new Rect(0,H-30,W,30),
new Rect(140,300,120,16),
new Rect(300,240,100,16),
new Rect(430,320,140,16),
new Rect(610,260,120,16),
new Rect(760,180,100,16)
];


// moedas e inimigos
let coins = [ {x:180,y:260,w:12,h:12, collected:false}, {x:330,y:200,w:12,h:12, collected:false}, {x:470,y:280,w:12,h:12, collected:false}, {x:640,y:220,w:12,h:12, collected:false}, {x:800,y:140,w:12,h:12, collected:false} ];


class Enemy{constructor(x,y){this.x=x;this.y=y;this.w=28;this.h=28;this.vx=1.2;}
get rect(){return new Rect(this.x,this.y,this.w,this.h)}
update(){this.x += this.vx; if(this.x < 200) this.vx = Math.abs(this.vx); if(this.x+this.w>W-40) this.vx = -Math.abs(this.vx);}
draw(){ctx.fillStyle='#2b2b2b'; ctx.fillRect(this.x,this.y,this.w,this.h); ctx.fillStyle='#fff'; ctx.fillRect(this.x+6,this.y+8,4,4); ctx.fillRect(this.x+18,this.y+8,4,4);} }


let enemies = [new Enemy(240,H-30-28), new Enemy(520, 320-28)];


const player = new Player();


function resetPlayer(){ player.x = 60; player.y = H - player.h - 40; player.vx = player.vy = 0; }


function updateHUD(){ document.getElementById('score').textContent = 'Pontos: '+score; document.getElementById('lives').textContent = 'Vidas: '+lives; }


function gameOver(){
// reiniciar jogo simples
alert('Game Over! Pontos: '+score);
score = 0; lives = 3; coins.forEach(c=>c.collected=false); updateHUD(); resetPlayer();
}


// loop de jogo
function update(){
player.update(platforms);
for(let e of enemies){ e.update(); if(player.rect.intersects(e.rect)){
// se bater por cima (stomp)
if(player.vy > 0 && (player.y + player.h - player.vy) <= e.y + 6){ score += 100; updateHUD(); e.x = -100; }
else { // perde vida
lives -= 1; updateHUD(); resetPlayer(); if(lives<=0) gameOver(); }
}}


// coleta de moedas
for(let c of coins){ if(!c.collected){ let r = new Rect(c.x,c.y,c.w,c.h); if(player.rect.intersects(r)){ c.collected = true; score += 10; updateHUD(); } }}
}


function draw(){
// fundo
ctx.clearRect(0,0,W,H);


// céu e nuvens (simples)
// terreno já é fundo do canvas, desenhamos plataformas
for(let p of platforms){ ctx.fillStyle='#6b4f2a'; ctx.fillRect(p.x,p.y,p.w,p.h); ctx.fillStyle='#3a2b1a'; ctx.fillRect(p.x,p.y,p.w,3); }


// moedas
for(let c of coins){ if(!c.collected){ ctx.fillStyle='gold'; ctx.beginPath(); ctx.arc(c.x + c.w/2, c.y + c.h/2, c.w/2, 0, Math.PI*2); ctx.fill(); ctx.closePath(); }}


// inimigos
for(let e of enemies){ e.draw(); }


// jogador
player.draw();
}


// loop principal com fixed timestep simples
let last = 0;
function loop(t){
if(!last) last = t;
const dt = t - last;
if(dt > 16){ update(); draw(); last = t; }
requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


// controles
window.addEventListener('keydown', e=>{ keys[e.key] = true; if([' ','Space'].includes(e.key)) e.preventDefault(); });
window.addEventListener('keyup', e=>{ keys[e.key] = false; });


// iniciar HUD
updateHUD();


// Dicas de personalização (comente no código):
// - Troque cores e formas para melhorar aparência.
// - Acrescente sprites, animações e som usando Audio() e imagens.
// - Para salvar progresso, use localStorage.