const kimg = new Image();
let kcells = [];
let ksil = null;

function buildKnight(){
  if(!kimg.complete || !kimg.naturalWidth) return;
  const asp = kimg.naturalWidth/kimg.naturalHeight;
  let kh = Math.floor(ROWS*0.6);
  let kw = Math.floor(kh*CH*asp/CW);
  if(kw > SCOLS){ kw = SCOLS; kh = Math.floor(kw*CW/(CH*asp)); }
  const oc = document.createElement("canvas");
  oc.width = kw; oc.height = kh;
  const o = oc.getContext("2d", {willReadFrequently:true});
  o.imageSmoothingQuality = "high";
  o.drawImage(kimg,0,0,kw,kh);
  const px = o.getImageData(0,0,kw,kh).data;
  const lum = k => (px[k*4]+px[k*4+1]+px[k*4+2])/765;

  // Fondo: negro conectado con los bordes (el de adentro se queda)
  const bg = new Uint8Array(kw*kh);
  const stack = [];
  const push = (x,y)=>{
    if(x<0||y<0||x>=kw||y>=kh) return;
    const k=y*kw+x;
    if(bg[k] || lum(k)>0.12) return;
    bg[k]=1; stack.push(k);
  };
  for(let x=0;x<kw;x++){ push(x,0); push(x,kh-1); }
  for(let y=0;y<kh;y++){ push(0,y); push(kw-1,y); }
  while(stack.length){
    const k=stack.pop(), x=k%kw, y=(k-x)/kw;
    push(x+1,y); push(x-1,y); push(x,y+1); push(x,y-1);
  }

  const x0 = Math.floor((COLS-kw)/2);
  // Bolsillos oscuros grandes (entre la espada y el cuerpo) = fondo
  const seen = new Uint8Array(kw*kh);
  for(let s0=0;s0<kw*kh;s0++){
    if(bg[s0] || seen[s0] || lum(s0)>0.12) continue;
    const comp=[s0]; seen[s0]=1;
    for(let i=0;i<comp.length;i++){
      const k=comp[i], x=k%kw, y=(k-x)/kw;
      const ns=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]];
      for(const n of ns){
        if(n[0]<0||n[1]<0||n[0]>=kw||n[1]>=kh) continue;
        const nk=n[1]*kw+n[0];
        if(bg[nk] || seen[nk] || lum(nk)>0.12) continue;
        seen[nk]=1; comp.push(nk);
      }
    }
    let sx=0; for(const k of comp) sx+=k%kw; if(comp.length>1500 || sx/comp.length<kw*0.3) for(const k of comp) bg[k]=1;
  }
  const y0 = horizon + Math.floor((ROWS-horizon)*0.85) - kh;
  const ramp = ".,:;+*#%@";

  // Silueta oscura detrás, para que el pasto no se meta dentro
  ksil = document.createElement("canvas");
  ksil.width = COLS*CW; ksil.height = H;
  const s = ksil.getContext("2d");
  s.fillStyle = "#0d0d12";

  kcells = [];
  for(let y=0;y<kh;y++) for(let x=0;x<kw;x++){
    const k=y*kw+x;
    if(bg[k]) continue;
    const r=px[k*4], gg=px[k*4+1], b=px[k*4+2];
    const vb = Math.pow(lum(k), 0.6);          // sube el brillo de los grises
    const red = r>gg*1.6 && r>90;
    const n = Math.min(0.999, Math.max(0.5+0.5*vb, red?0.8:0));
    const cr = Math.min(255, 85+r*1.4), cg = Math.min(255, 85+gg*1.4), cb = Math.min(255, 85+b*1.4);
    s.fillRect((x0+x)*CW, (y0+y)*CH, CW, CH);
    kcells.push({
      x:x0+x, y:y0+y, red,
      ch:ramp[Math.floor(n*ramp.length)],
      c: red ? `rgb(${Math.min(255,r*1.5)|0},${gg*.5|0},${b*.5|0})` : `rgb(${cr|0},${cg|0},${cb|0})`
    });
  }
}

const _setup = setup, _draw = draw;
setup = function(){ _setup(); buildKnight(); };
draw = function(t){
  _draw(t);
  if(ksil) g.drawImage(ksil, 0, 0, COLS*CW, H);
  for(const k of kcells){ if(k.x*CW<VX0 || k.x*CW>VX1) continue;
    const dx = k.red ? Math.sin(t*2.5 + k.x*.15)*1.5 : 0;
    g.fillStyle = k.c;
    g.fillText(k.ch, (k.x+dx)*CW, k.y*CH);
  }
};

kimg.onload = buildKnight;
kimg.src = "caballero.png";
