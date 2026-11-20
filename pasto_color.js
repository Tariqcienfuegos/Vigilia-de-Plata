var _dP=draw;
draw=function(t){
  _dP(t);
  const y0=horizon*CH-4;
  g.save();
  g.globalCompositeOperation="multiply";
  g.fillStyle="rgb(70,150,80)";
  g.fillRect(0,y0,COLS*CW,H-y0);
  g.restore();
};
