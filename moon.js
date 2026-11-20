let mcv=null, mhalo=null, mpos=null;
function hsh(a,b){const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s);}
function vn(x,y){
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
  const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  const a=hsh(ix,iy),b=hsh(ix+1,iy),c=hsh(ix,iy+1),d=hsh(ix+1,iy+1);
  return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;
}
function fbm(x,y){let s=0,a=0.5;for(let i=0;i<4;i++){s+=a*vn(x,y);x*=2.03;y*=2.03;a*=0.5;}return s;}
function buildMoon(){
  if(!kcells.length) return;
  let maxX=0,minX=1e9;
  for(const k of kcells){ if(k.x>maxX)maxX=k.x; if(k.x<minX)minX=k.x; }
  const pr=(typeof pcells!=="undefined"&&pcells&&pcells.length)?Math.max(...pcells.map(c=>c.x)):Math.max(2,minX-40);
  const Rr=Math.max(12,Math.round(ROWS*0.075)), Rpx=Rr*CH, Rc=Math.round(Rpx/CW);
  let cx=Math.round((pr+minX)/2);
  cx=Math.max(Rc+3,Math.min(cx,COLS-Rc-3));
  const cy=Rr+Math.round(ROWS*0.05);
  mpos={cx,cy,Rpx};
  const cr=[]; let sd=7;
  const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647;};
  for(let i=0;i<18;i++){
    const a=rnd()*6.283,d=Math.sqrt(rnd())*0.85;
    cr.push({u:Math.cos(a)*d,v:Math.sin(a)*d,r:0.04+rnd()*rnd()*0.14});
  }
  const ramp=" .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  mcv=document.createElement("canvas"); mcv.width=COLS*CW; mcv.height=H;
  const m=mcv.getContext("2d");
  m.font="bold "+(CH+1)+"px monospace"; m.textBaseline="top";
  m.fillStyle="#050507";
  m.beginPath(); m.arc(cx*CW,cy*CH,Rpx,0,6.2832); m.fill();
  const x0=cx-Rc-2,x1=cx+Rc+2,y0=cy-Rr-2,y1=cy+Rr+2;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const dx=((x+0.5)-cx)*CW,dy=((y+0.5)-cy)*CH;
    const u=dx/Rpx,v=dy/Rpx,r2=u*u+v*v;
    if(r2>=1) continue;
    const z=Math.sqrt(1-r2);
    let lam=u*-0.45+v*-0.35+z*0.82; if(lam<0)lam=0;
    let alb=0.95;
    const mar=fbm(u*1.8+4.2,v*1.8+1.3);
    if(mar<0.47) alb*=0.5+mar*0.9;
    alb*=0.9+0.2*fbm(u*9,v*9);
    for(const c of cr){
      const d=Math.hypot(u-c.u,v-c.v);
      if(d<c.r*0.85) alb*=0.62;
      else if(d<c.r*1.1) alb*=1.35;
    }
    let b=alb*(0.12+0.88*Math.pow(lam,0.8));
    b=Math.max(0,Math.min(1,b*(1-0.25*r2)));
    const ch=ramp[Math.floor(b*(ramp.length-1))];
    if(ch===" ") continue;
    const q=Math.min(255,35+b*120)|0;
    m.fillStyle="rgb("+q+","+((q*0.96)|0)+","+((q*0.78)|0)+")";
    m.fillText(ch,x*CW,y*CH);
  }
  mhalo=document.createElement("canvas"); mhalo.width=COLS*CW; mhalo.height=H;
  const h=mhalo.getContext("2d");
  const gr=h.createRadialGradient(cx*CW,cy*CH,Rpx*0.9,cx*CW,cy*CH,Rpx*1.7);
  gr.addColorStop(0,"rgba(200,190,150,0.10)");
  gr.addColorStop(1,"rgba(235,225,170,0)");
  h.fillStyle=gr; h.fillRect(0,0,mhalo.width,mhalo.height);
}
const _drawM=draw;
draw=function(t){
  _drawM(t);
  if(!mcv) buildMoon();
  if(!mcv) return;
  g.globalAlpha=0.75+0.25*Math.sin(t*1.2);
  g.drawImage(mhalo,0,0);
  g.globalAlpha=1;
  g.drawImage(mcv,0,0);
};
