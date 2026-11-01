export class Landscape {
  constructor(canvas) {
    this.canvas=canvas;this.ctx=canvas.getContext('2d');this.scene='rain';this.night=false;this.reduced=matchMedia('(prefers-reduced-motion: reduce)');this.last=0;
    let seed=741;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    this.drops=Array.from({length:115},()=>({x:random()*1100,y:random()*850,s:random()*1.5+.4,p:random()*6.28}));
    this.stars=Array.from({length:70},()=>({x:random()*1000,y:random()*390,r:random()*1.4+.6}));
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(canvas);this.resize();
    this.animate=this.animate.bind(this);this.frame=requestAnimationFrame(this.animate);
  }
  resize(){const r=this.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.ctx.setTransform(this.canvas.width/1000,0,0,this.canvas.height/750,0,0);this.draw(performance.now()/1000);}
  set(scene,night){this.scene=scene;this.night=night;this.canvas.setAttribute('aria-label',`Illustrated ${night?'nighttime ':''}${scene} countryside through a window`);this.draw(performance.now()/1000);}
  animate(t){if(!document.hidden&&!this.reduced.matches&&t-this.last>32){this.last=t;this.draw(t/1000);}this.frame=requestAnimationFrame(this.animate);}
  polygon(points,color){const c=this.ctx;c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
  pine(x,y,size,color){const c=this.ctx;c.fillStyle=color;c.fillRect(x-size*.04,y,size*.08,size*.12);for(let i=0;i<4;i++){const top=y-size+i*size*.2,half=size*(.17+i*.04);this.polygon([[x,top],[x-half,top+size*.43],[x+half,top+size*.43]],color);}}
  cloud(x,y,w,color){const c=this.ctx;c.fillStyle=color;c.beginPath();c.ellipse(x,y,w*.5,w*.1,0,0,Math.PI*2);c.ellipse(x-w*.18,y-w*.035,w*.22,w*.11,0,0,Math.PI*2);c.ellipse(x+w*.1,y-w*.06,w*.24,w*.13,0,0,Math.PI*2);c.fill();}
  draw(t){
    const c=this.ctx,scene=this.scene,night=this.night,snow=scene==='snow',wet=['rain','storm'].includes(scene),fog=scene==='fog';
    const sky=c.createLinearGradient(0,0,0,620);
    const colors=night?['#1c304a','#65718b']:snow?['#b4c6cb','#e3e8dd']:wet?['#718e95','#c0cbbd']:scene==='clouds'||fog?['#9cadb1','#d5d8c7']:['#b1c9bf','#f4d39c'];
    sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);c.fillStyle=sky;c.fillRect(0,0,1000,750);
    if(night){c.fillStyle='#e9ecda';for(const star of this.stars){c.globalAlpha=.3+.4*Math.sin(t*.3+star.x);c.beginPath();c.arc(star.x,star.y,star.r,0,Math.PI*2);c.fill();}c.globalAlpha=1;}
    if(!wet&&!fog){c.fillStyle=night?'#ecedd5':'#f7dfa4';c.beginPath();c.arc(746,169,night?37:60,0,Math.PI*2);c.fill();if(night){c.fillStyle='#2b3c55';c.beginPath();c.arc(762,153,34,0,Math.PI*2);c.fill();}}
    const cloudColor=night?'#58657a77':wet?'#afbeb7aa':'#f1eddb99';
    for(let i=0;i<5;i++)this.cloud(((i*260+t*(wet?7:2))%1400)-200,105+(i%3)*65,220+(i%2)*100,cloudColor);
    this.polygon([[0,400],[90,333],[174,366],[294,237],[435,363],[561,283],[690,374],[830,260],[1000,362],[1000,600],[0,600]],night?'#53627a':snow?'#a8babe':'#8ca7a1');
    if(snow){this.polygon([[234,309],[294,237],[365,308],[320,293],[294,279],[271,307]],'#e9eee6');this.polygon([[778,316],[830,260],[890,311],[846,293],[825,304],[813,295]],'#e9eee6');}
    this.polygon([[0,468],[106,391],[232,443],[376,340],[503,425],[650,361],[793,449],[910,365],[1000,430],[1000,600],[0,600]],night?'#374c63':snow?'#8da9a7':'#6b9289');
    this.polygon([[0,491],[143,455],[292,479],[426,445],[570,487],[734,438],[891,470],[1000,454],[1000,600],[0,600]],night?'#2d4659':snow?'#c4d1c4':'#729780');
    const lake=c.createLinearGradient(0,480,0,750);lake.addColorStop(0,night?'#4c687a':snow?'#bbc9bf':'#b1c6b2');lake.addColorStop(1,night?'#243b50':snow?'#d4ded1':'#7caa99');c.fillStyle=lake;c.fillRect(0,493,1000,257);
    c.strokeStyle=night?'#a1b0bb26':'#eaf1dc50';c.lineWidth=2;for(let i=0;i<27;i++){const y=500+i*8,x=(i*173+Math.sin(t*.25+i)*20)%1000;c.beginPath();c.moveTo(x,y);c.lineTo(x+30+i*2,y);c.stroke();}
    this.polygon([[0,519],[135,492],[282,515],[358,552],[259,580],[117,568],[0,589]],night?'#31493e':snow?'#e3e8d9':'#8da77d');
    this.polygon([[1000,496],[891,478],[772,509],[817,534],[931,549],[1000,550]],night?'#2d473f':snow?'#d5dfd1':'#6e9173');
    for(let i=0;i<15;i++)this.pine(10+i*21,510+Math.sin(i)*10,45+i%4*13,night?'#243f39':snow?'#789c8b':'#4e7b64');
    for(let i=0;i<15;i++)this.pine(812+i*19,500+Math.sin(i)*9,55+i%4*14,night?'#243f39':snow?'#789c8b':'#537b61');
    // A tiny lakeside cottage; the scene is illustrative, not a real city view.
    this.polygon([[176,508],[176,457],[253,449],[275,477],[275,524]],night?'#675b4e':'#c7b28b');
    this.polygon([[163,460],[212,425],[283,457],[253,471]],snow?'#e3e5d6':'#657868');
    this.polygon([[253,471],[283,457],[283,511],[253,524]],night?'#615c4e':'#a3a17e');
    c.fillStyle='#e6c080';c.fillRect(192,476,16,19);c.fillStyle=night?'#e8c082':'#847959';c.fillRect(227,481,13,31);
    c.strokeStyle=night?'#d7d5c644':'#fff6db55';c.lineWidth=6;c.beginPath();c.moveTo(239,439);c.bezierCurveTo(223+Math.sin(t)*5,421,249,414,235,397);c.stroke();
    this.polygon([[0,655],[154,617],[306,667],[450,641],[620,688],[771,643],[1000,628],[1000,750],[0,750]],night?'#1e382e':snow?'#dce5d6':'#7e9b69');
    for(let i=0;i<7;i++)this.pine(i*32-10,690+Math.sin(i)*14,120+(i%3)*37,night?'#19352e':snow?'#567b6a':'#3e7154');
    for(let i=0;i<6;i++)this.pine(915+i*31,695+Math.cos(i)*15,155+(i%3)*31,night?'#19352e':snow?'#567b6a':'#39694e');
    if(fog){const haze=c.createLinearGradient(0,230,0,700);haze.addColorStop(0,'#d4dcd000');haze.addColorStop(.5,'#d4dcd0bb');haze.addColorStop(1,'#d4dcd022');c.fillStyle=haze;c.fillRect(0,230,1000,470);}
    if(wet){c.strokeStyle=night?'#b6ced24d':'#e6f1e877';c.lineWidth=1.5;for(const drop of this.drops){const y=(drop.y+t*330*drop.s)%870-60,x=(drop.x-y*.13+1100)%1100-50;c.beginPath();c.moveTo(x,y);c.lineTo(x-7*drop.s,y+25*drop.s);c.stroke();}}
    if(snow){c.fillStyle='#f7faf0cc';for(const drop of this.drops){const y=(drop.y+t*28*drop.s)%800-20,x=drop.x+Math.sin(t*.5+drop.p)*20;c.beginPath();c.arc(x,y,drop.s*2.4,0,Math.PI*2);c.fill();}}
    if(scene==='storm'){c.fillStyle='#54687533';c.fillRect(0,0,1000,750);}
    const shade=c.createRadialGradient(500,320,200,500,400,690);shade.addColorStop(0,'#192c2300');shade.addColorStop(1,'#192c2333');c.fillStyle=shade;c.fillRect(0,0,1000,750);
  }
  dispose(){cancelAnimationFrame(this.frame);this.observer.disconnect();}
}
