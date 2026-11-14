/* DamasVIP · mariposas interactivas (canvas). Se acercan al cursor, huyen si te pasas, y salen al hacer clic. */
(()=>{const cv=document.getElementById('bf-canvas');if(!cv)return;
const cx=cv.getContext('2d'),RM=matchMedia('(prefers-reduced-motion:reduce)').matches,R=(a,b)=>a+Math.random()*(b-a);
const DARK=['#FFB6D2','#FF8FB8','#FF4F8B','#E7A8FF','#FFD1A8','#FFE0F0'],LIGHT=['#E0508C','#C0082C','#B65AD6','#FF7FAE'];
let W,H,dpr,t=0,sy=scrollY,mx=-999,my=-999,go=true;const fs=[];
const N=()=>innerWidth<768?11:24,pal=()=>document.documentElement.dataset.theme==='light'?LIGHT:DARK;
const mk=(x,y,burst)=>{const d=R(.45,1.25),a=burst?R(0,6.28):R(0,6.28);return{x:x??R(0,W),y:y??R(0,H),d,s:(R(.55,1)*d+.3)*.75,a,v:R(.35,.85)*(.6+d*.5)+(burst?2.4:0),ph:R(0,6.28),fr:R(.9,1.4),c:pal()[(Math.random()*pal().length)|0],life:burst?900:1/0,wob:R(.6,1.6)}};
const size=()=>{dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cx.setTransform(dpr,0,0,dpr,0,0);while(fs.filter(f=>f.life===1/0).length<N())fs.push(mk());};
const wrap=a=>{while(a>Math.PI)a-=6.283;while(a<-Math.PI)a+=6.283;return a};
const wing=s=>{cx.beginPath();cx.moveTo(0,-2);cx.bezierCurveTo(10,-26,36,-30,34,-8);cx.bezierCurveTo(33,0,16,4,0,0);cx.fill();cx.beginPath();cx.moveTo(0,0);cx.bezierCurveTo(14,4,28,10,22,26);cx.bezierCurveTo(14,34,4,18,0,2);cx.fill();cx.globalAlpha*=.55;cx.fillStyle='#fff';cx.beginPath();cx.arc(24,-14,3.2,0,6.283);cx.arc(17,16,2.4,0,6.283);cx.fill()};
function draw(f,alpha){const fl=RM?1:.18+.82*Math.abs(Math.sin(f.ph+t*.2*f.fr*(f.boost>0?1.8:1)));
 cx.save();cx.translate(f.x,f.y);cx.rotate(f.a+Math.PI/2);cx.scale(f.s,f.s);
 cx.globalAlpha=alpha*(.35+.4*f.d/1.25);
 for(const side of[1,-1]){cx.save();cx.scale(side*fl,1);cx.fillStyle=f.c;wing();cx.restore();cx.globalAlpha=alpha*(.35+.4*f.d/1.25)}
 cx.fillStyle=f.c;cx.globalAlpha=Math.min(1,alpha*.9);cx.beginPath();cx.ellipse(0,0,2.2,9,0,0,6.283);cx.fill();cx.strokeStyle=f.c;cx.lineWidth=.9;cx.beginPath();cx.moveTo(0,-8);cx.quadraticCurveTo(-4,-17,-8,-18);cx.moveTo(0,-8);cx.quadraticCurveTo(4,-17,8,-18);cx.stroke();cx.restore()}
function tick(){if(!go)return;t++;const ds=scrollY-sy;sy=scrollY;cx.clearRect(0,0,W,H);
 for(let i=fs.length-1;i>=0;i--){const f=fs[i];f.boost=Math.max(0,(f.boost||0)-1);f.a+=Math.sin(t*.012*f.wob+f.ph)*.03;
  const dx=mx-f.x,dy=my-f.y,dist=Math.hypot(dx,dy);
  if(dist<240){const ang=Math.atan2(dy,dx);if(dist<80){f.a+=wrap(ang+Math.PI-f.a)*.12;f.boost=40}else f.a+=wrap(ang-f.a)*.028}
  const sp=f.v*(f.boost>0?2.2:1);f.x+=Math.cos(f.a)*sp;f.y+=Math.sin(f.a)*sp-.06-ds*.14*f.d;
  if(f.x<-80)f.x=W+80;if(f.x>W+80)f.x=-80;if(f.y<-80)f.y=H+80;if(f.y>H+80)f.y=-80;
  if(f.life!==1/0&&--f.life<=0){fs.splice(i,1);continue}
  draw(f,f.life<120?f.life/120:1)}
 requestAnimationFrame(tick)}
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});document.addEventListener('pointerleave',()=>{mx=my=-999});
addEventListener('pointerup',e=>{if(e.pointerType==='touch')mx=my=-999});
window.DVBF={burst:(x,y,n=7)=>{for(let i=0;i<n;i++)fs.push(mk(x,y,true));while(fs.length>N()+45)fs.splice(fs.findIndex(f=>f.life!==1/0),1)}};
document.addEventListener('pointerdown',e=>{if(!e.target.closest('button,a,input,select,textarea,label,.profile-card,.modal,#search-drawer,.ck'))DVBF.burst(e.clientX,e.clientY,7)});
document.addEventListener('visibilitychange',()=>{go=!document.hidden;if(go&&!RM)requestAnimationFrame(tick)});
addEventListener('resize',size);size();RM?(fs.forEach(f=>draw(f,1))):requestAnimationFrame(tick)})();
