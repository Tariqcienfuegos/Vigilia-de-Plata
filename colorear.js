var _cref=null;
var _drawC=draw;
draw=function(t){
  if(kcells.length && _cref!==kcells){
    _cref=kcells;
    for(const k of kcells){
      if(k.red) continue;
      const m=k.c.match(/\d+/g);
      if(!m) continue;
      const a=(+m[0]+ +m[1]+ +m[2])/3;
      const v=Math.min(255,Math.max(95,a*1.05))|0;
      k.c="rgb("+v+","+v+","+v+")";
    }
  }
  _drawC(t);
};
