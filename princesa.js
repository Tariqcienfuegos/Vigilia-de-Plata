const pimg=new Image(); pimg.src="princesa.jpg";
let pcells=null, psil=null;
function buildPrincess(){
  if(!pimg.complete||!pimg.naturalWidth||!kcells.length) return;
  let minX=1e9,minY=1e9,maxY=-1;
  for(const k of kcells){ if(k.x<minX)minX=k.x; if(k.y<minY)minY=k.y; if(k.y>maxY)maxY=k.y; }
  const kh=maxY-minY+1, ph=Math.floor(kh*0.85);
  const NW=pimg.naturalWidth, NH=pimg.naturalHeight;
  const sw=200, sh=Math.round(200*NH/NW);
  const a=document.createElement("canvas"); a.width=sw; a.height=sh;
  const ac=a.getContext("2d",{willReadFrequently:true});
  ac.drawImage(pimg,0,0,sw,sh);
  const ad=ac.getImageData(0,0,sw,sh).data;
  const L=(d,i)=>(d[i]+d[i+1]+d[i+2])/765;
  const light=(L(ad,0)+L(ad,(sw-1)*4)+L(ad,(sh-1)*sw*4))/3>0.6;
  const isBg=l=>light? l>0.85 : l<0.12;
  let x1=sw,y1=sh,x2=0,y2=0;
  for(let y=0;y<sh;y++)for(let x=0;x<sw;x++){
    if(!isBg(L(ad,(y*sw+x)*4))){ if(x<x1)x1=x; if(x>x2)x2=x; if(y<y1)y1=y; if(y>y2)y2=y; }
  }
  if(x2<=x1||y2<=y1) return;
  const f=NW/sw, cx=x1*f, cy=y1*f, cw=(x2-x1+1)*f, chh=(y2-y1+1)*f;
  const pw=Math.floor(ph*CH*(cw/chh)/CW);
  const b=document.createElement("canvas"); b.width=pw; b.height=ph;
  const bc=b.getContext("2d",{willReadFrequently:true});
  bc.imageSmoothingQuality="high";
  bc.drawImage(pimg,cx,cy,cw,chh,0,0,pw,ph);
  const px=bc.getImageData(0,0,pw,ph).data;
  const bg=new Uint8Array(pw*ph), st=[];
  const push=(x,y)=>{
    if(x<0||y<0||x>=pw||y>=ph) return;
    const k=y*pw+x;
    if(bg[k]||!isBg(L(px,k*4))) return;
    bg[k]=1; st.push(k);
  };
  for(let x=0;x<pw;x++){push(x,0);push(x,ph-1);}
  for(let y=0;y<ph;y++){push(0,y);push(pw-1,y);}
  while(st.length){
    const k=st.pop(), x=k%pw, y=(k-x)/pw;
    push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);
  }
  const ramp=".,:;+*#%@";
  const ox=Math.max(2,minX-pw-2), oy=maxY-ph+1;
  psil=document.createElement("canvas"); psil.width=COLS*CW; psil.height=H;
  const s=psil.getContext("2d"); s.fillStyle="#0d0d12";
  const cells=[];
  for(let y=0;y<ph;y++)for(let x=0;x<pw;x++){
    const k=y*pw+x; if(bg[k]) continue;
    const l=L(px,k*4);
    const n=Math.min(0.999,0.25+0.75*Math.pow(l,0.7));
    const v=Math.min(255,60+l*210)|0;
    s.fillRect((ox+x)*CW,(oy+y)*CH,CW,CH);
    cells.push({x:ox+x,y:oy+y,ch:ramp[Math.floor(n*ramp.length)],c:`rgb(${v},${v},${v})`});
  }
  pcells=cells;
}
const _drawP=draw;
draw=function(t){
  _drawP(t);
  if(!pcells) buildPrincess();
  if(!pcells) return;
  g.drawImage(psil,0,0,COLS*CW,H);
  for(const k of pcells){
    if(k.x*CW<VX0||k.x*CW>VX1) continue;
    g.fillStyle=k.c;
    g.fillText(k.ch,k.x*CW,k.y*CH);
  }
};
