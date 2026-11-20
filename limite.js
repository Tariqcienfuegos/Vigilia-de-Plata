var _dL=draw;
draw=function(t){
  if(kcells.length){
    let mx=0;
    for(const k of kcells){ if(k.x>mx)mx=k.x; }
    const lim=Math.min(COLS*CW,(mx+30)*CW);
    camX=Math.min(camX,Math.max(0,lim-W/zoom));
  }
  _dL(t);
};
