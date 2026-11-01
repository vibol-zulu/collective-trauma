import{W as F,N as L,V as H,G as I,a5 as G,a6 as nt,ac as at,M as E,a as A,s as it,ad as rt,a7 as K,P as Q,d as tt,D as ct,u as lt,ae as Z,af as ht,ag as dt,B as pt,x as et,y as st,z as S,H as ft,K as ut,O as mt}from"./lighting-CMDhC0NK.js";const wt="#fffffa",xt="#ffd5c8",O='"Post Grotesk", "Helvetica Neue", system-ui, sans-serif',gt=.0041,M=120,k=14,z=24,yt=18,Rt={wasd:[[{label:"W",codes:["KeyW","ArrowUp"],x:1}],[{label:"A",codes:["KeyA","ArrowLeft"],x:0},{label:"S",codes:["KeyS","ArrowDown"],x:1},{label:"D",codes:["KeyD","ArrowRight"],x:2}]],shift:[[{label:"Shift",codes:["ShiftLeft","ShiftRight"],x:0,w:2.2}]],space:[[{label:"Space",codes:["Space"],x:0,w:4.5}]]};class Ct{constructor(e,t,{billboard:s=!0}={}){this.rows=e,this.caption=t,this.keys=e.flat();const o=Math.max(...this.keys.map(i=>i.x+(i.w??1)));this.captionSize=52,this.canvas=document.createElement("canvas");const a=o*M+(o-1)*k,l=this.canvas.getContext("2d");l.font=`300 ${this.captionSize}px ${O}`;const c=t?l.measureText(t).width:0;this.canvas.width=Math.ceil(z*2+Math.max(a,c)),this.keyOffset=(this.canvas.width-z*2-a)/2,this.keysHeight=e.length*M+(e.length-1)*k,this.canvas.height=Math.ceil(z*2+this.keysHeight+(t?k*2+this.captionSize*1.3:0)),this.pressed="",this.draw(new Set),this.view=new F(this.canvas,{width:this.canvas.width*gt,billboard:s})}draw(e){const t=this.canvas.getContext("2d");t.clearRect(0,0,this.canvas.width,this.canvas.height),t.lineWidth=5,t.textAlign="center",t.textBaseline="middle",this.rows.forEach((s,o)=>{for(const a of s){const l=z+this.keyOffset+a.x*(M+k),c=z+o*(M+k),i=(a.w??1)*M+((a.w??1)-1)*k;t.beginPath(),t.roundRect(l,c,i,M,yt),t.fillStyle=e.has(a.label)?xt:wt,t.fill(),t.strokeStyle=L,t.stroke(),t.fillStyle=L,t.font=`500 ${a.label.length>1?40:56}px ${O}`,t.fillText(a.label,l+i/2,c+M/2+2)}}),this.caption&&(t.font=`300 ${this.captionSize}px ${O}`,t.fillStyle=L,t.fillText(this.caption,this.canvas.width/2,z+this.keysHeight+k*2+this.captionSize*.65))}updatePressed(e){const t=new Set(this.keys.filter(o=>o.codes.some(a=>e.has(a))).map(o=>o.label)),s=[...t].join();s!==this.pressed&&(this.pressed=s,this.draw(t),this.view.refresh())}}const y=2.2,g=3.4,D=.3,N=.35,Y="#ebe6d8",_=140;function R(n,e,t){const s=g/2-y/2;return n.moveTo(-e,t),n.lineTo(e,t),n.lineTo(e,s),n.absarc(0,s,e,0,Math.PI,!1),n.lineTo(-e,t),n}const j=16,B=.45,V={uniforms:{time:{value:0},camLocal:{value:new H}},vertexShader:`
    varying vec2 vPos;
    void main() {
      vPos = position.xy;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,fragmentShader:`
    uniform float time;
    uniform vec3 camLocal;
    varying vec2 vPos;
    const float HW = ${(y/2).toFixed(3)};
    const float HH = ${(g/2).toFixed(3)};
    // Signed distance to the arch outline (negative inside)
    float archSdf(vec2 p) {
      float spring = HH - HW;
      if (p.y > spring) return length(p - vec2(0.0, spring)) - HW;
      return max(abs(p.x) - HW, -HH - p.y);
    }
    void main() {
      vec3 ray = vec3(vPos, 0.0) - camLocal;
      vec2 slope = ray.xy / max(abs(ray.z), 0.001);
      vec3 paper = vec3(1.0, 1.0, 0.98);
      vec3 blush = vec3(1.0, 0.86, 0.80);
      vec3 ringCol = vec3(0.97, 0.76, 0.70);
      const float FAR = ${(j*B).toFixed(2)};

      // Walls start only lightly tinted and fade to the far light, which uses
      // the same colour so there is no seam where they meet
      vec3 nearWall = mix(paper, blush, 0.3);
      vec3 farLight = mix(paper, blush, 0.08);
      vec3 col = farLight;
      float prev = archSdf(vPos);
      for (int i = 1; i <= ${j}; i++) {
        float d = float(i) * ${B.toFixed(2)};
        float s = archSdf(vPos + slope * d);
        if (s > 0.0) {
          // Exact depth where the ray meets the wall
          float depth = d - ${B.toFixed(2)} * (s / (s - prev));
          float k = depth / FAR;
          col = mix(nearWall, farLight, smoothstep(0.0, 1.0, k)); // walls brighten into the distance
          float f = fract(depth / 0.9 + time * 0.12);           // rings drift inward
          float ring = smoothstep(0.06, 0.0, min(f, 1.0 - f)) * (1.0 - k);
          col = mix(col, ringCol, 0.3 * ring);
          break;
        }
        prev = s;
      }

      gl_FragColor = vec4(col, 1.0);
    }`};function q(n,e){const t=document.createElement("canvas");t.width=t.height=128;const s=t.getContext("2d"),o=s.createRadialGradient(64,64,0,64,64,64);o.addColorStop(0,n),o.addColorStop(1,e),s.fillStyle=o,s.fillRect(0,0,128,128);const a=new et(t);return a.colorSpace=st,a}function Wt(){const n=new I,e=R(new G,y/2+D,-g/2-D);e.holes.push(R(new nt,y/2,-g/2));const t=new at(e,{depth:N,bevelEnabled:!0,bevelThickness:.04,bevelSize:.04,bevelSegments:2,curveSegments:40});t.translate(0,0,-N/2);const s=new E(t,new A({color:Y,roughness:.8}));n.add(s);const o=new it({...V,uniforms:rt.clone(V.uniforms)}),a=new E(new K(R(new G,y/2,-g/2),40),o);a.rotation.y=Math.PI;const l=new E(new K(R(new G,y/2,-g/2),40),new A({color:Y,roughness:.8}));l.position.z=.01,n.add(a,l);const c=new E(new Q(y*3.2,g*2.2),new tt({map:q("rgba(255,190,170,0.9)","rgba(255,213,200,0)"),transparent:!0,depthWrite:!1,toneMapped:!1,opacity:.7,side:ct}));n.add(c);const i=(v,x=0)=>Object.assign(v,{t:x,life:4.5+Math.random()*3,a:Math.random()*Math.PI*2,r0:1.8+Math.random()*1.6,r1:.15+Math.random()*.75,z0:1.2+Math.random()*2.8,spin:(.15+Math.random()*.2)*(Math.random()<.15?-1:1)}),b=Array.from({length:_},()=>i({},Math.random())),p=new Float32Array(_*3),f=new Float32Array(_*4).fill(1),u=new lt;u.setAttribute("position",new Z(p,3)),u.setAttribute("color",new Z(f,4));const d=new ht({map:q("rgba(235,140,120,1)","rgba(255,190,170,0)"),size:.12,vertexColors:!0,transparent:!0,depthWrite:!1,toneMapped:!1}),m=new dt(u,d);n.add(m);let w=0;function T(v,x){w+=v,o.uniforms.time.value=w,a.worldToLocal(o.uniforms.camLocal.value.copy(x.position));const ot=n.worldToLocal(x.position.clone()).z;c.position.z=-Math.sign(ot)*(N/2+.1),c.material.opacity=.6+.15*Math.sin(w*1.3),b.forEach((h,P)=>{h.t+=v/h.life,h.t>=1&&i(h);const $=h.t*h.t,U=h.r0+(h.r1-h.r0)*$;h.a+=h.spin*(.6+.6*$)*v,p[P*3]=Math.cos(h.a)*U*.8,p[P*3+1]=Math.sin(h.a)*U,p[P*3+2]=-1*h.z0*(1-$),f[P*4+3]=Math.min(1,h.t/.15)*Math.min(1,(1-h.t)/.08)}),u.attributes.position.needsUpdate=!0,u.attributes.color.needsUpdate=!0}const W=new pt(new H(-y/2,-g/2,-.6),new H(y/2,g/2,.6));return{group:n,opening:W,update:T,topY:g/2+D}}const bt=5,vt=70,St=750,Mt=`
#z-points {
  /* Styled like the design-system button: thin ink outline, paper fill, light text */
  position: fixed; top: 16px; right: 16px; display: flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 16px; box-sizing: border-box; border-radius: 999px; pointer-events: none;
  background: rgba(255,255,250,0.85); border: 1px solid var(--color-ink);
  color: var(--color-ink); font: 300 15px/1 var(--font-body);
  transition: opacity 0.6s ease, background-color 0.25s ease, border-color 0.25s ease;
}
#z-points .z-count { font-weight: 500; font-variant-numeric: tabular-nums; }
/* As each token lands: a quick blush flash, like the button's hover state */
#z-points.bump { background: var(--color-blush); border-color: var(--color-blush); animation: z-bump 0.3s ease; }
@keyframes z-bump { 40% { transform: scale(1.06); } }
.z-token {
  position: fixed; left: 0; top: 0; width: 22px; height: 22px; margin: -11px 0 0 -11px; border-radius: 50%;
  display: grid; place-items: center; pointer-events: none; z-index: 5;
  background: var(--color-blush); color: var(--color-ink); font: 400 14px/1 var(--font-title);
  box-shadow: 0 0 12px 4px rgba(255,213,200,0.9);
}
.z-plus {
  position: fixed; left: 0; top: 0; pointer-events: none; z-index: 5; transform: translate(-50%, -50%);
  color: var(--color-ink); font: 400 28px/1 var(--font-title); white-space: nowrap;
}
body:has(#status) #z-points, body:has(#start:not(.hidden)) #z-points { opacity: 0; }
`;class $t{constructor(e){this.camera=e,this.total=0,this.shown=0;const t=document.createElement("style");t.textContent=Mt,document.head.append(t),this.el=document.createElement("div"),this.el.id="z-points",this.el.innerHTML='<span class="z-count">0</span><span>Z points</span>',document.body.append(this.el),this.count=this.el.querySelector(".z-count")}carryOver(e){this.total=this.shown=e,this.count.textContent=String(e)}award(e,t,s=""){this.total+=e;const o=this.toScreen(t),a=this.count.getBoundingClientRect(),l={x:a.left+a.width/2,y:a.top+a.height/2},c=document.createElement("div");c.className="z-plus",c.textContent=s?`+${e} ${s}`:`+${e}`,document.body.append(c),c.animate([{transform:`translate(${o.x}px, ${o.y}px) translate(-50%, -50%) scale(0.6)`,opacity:0},{transform:`translate(${o.x}px, ${o.y-30}px) translate(-50%, -50%) scale(1)`,opacity:1,offset:.25},{transform:`translate(${o.x}px, ${o.y-70}px) translate(-50%, -50%) scale(1)`,opacity:0}],{duration:1300,easing:"ease-out"}).finished.then(()=>c.remove());const i=Math.min(12,Math.max(bt,Math.round(e/5))),b=e/i;for(let p=0;p<i;p++){const f=p/i*Math.PI*2+Math.random()*.6,u={x:o.x+Math.cos(f)*45,y:o.y+Math.sin(f)*45},d=document.createElement("div");d.className="z-token",d.textContent="Z",document.body.append(d);const m=(w,T=1)=>`translate(${w.x}px, ${w.y}px) scale(${T})`;d.animate([{transform:m(o,.3),opacity:0},{transform:m(u,1.1),opacity:1,offset:.3},{transform:m({x:(u.x+l.x)/2,y:Math.min(u.y,l.y)-40},.9),offset:.65},{transform:m(l,.6),opacity:.9}],{duration:St,delay:p*vt,easing:"ease-in-out",fill:"backwards"}).finished.then(()=>{d.remove(),this.setShown(Math.min(this.total,this.shown+b))})}}setShown(e){this.shown=e,this.count.textContent=Math.round(e),this.el.classList.remove("bump"),this.el.offsetWidth,this.el.classList.add("bump"),clearTimeout(this.unbump),this.unbump=setTimeout(()=>this.el.classList.remove("bump"),350)}toScreen(e){const t=e.clone().project(this.camera);return{x:(t.x+1)/2*innerWidth,y:(1-t.y)/2*innerHeight}}}const Lt=10,Gt=50,Ot=30,Dt=n=>n.getWorldPosition(new H),kt="#a8825c",zt="#d9b878",X="#ffd5c8",C={wood:"#b49c7b",dark:"#8c7658",seal:"#e9ad9f",lidHeight:.08},r={w:.7,h:.42,d:.48},Tt=.16,Et=1.6,At=1.9,J=(n,e,t,s)=>n+(e-n)*(1-Math.exp(-4*s));function Ht(){const n=document.createElement("canvas");n.width=n.height=128;const e=n.getContext("2d"),t=e.createRadialGradient(64,64,0,64,64,64);t.addColorStop(0,"rgba(255,225,190,1)"),t.addColorStop(.4,"rgba(255,210,190,0.5)"),t.addColorStop(1,"rgba(255,213,200,0)"),e.fillStyle=t,e.fillRect(0,0,128,128);const s=new et(n);return s.colorSpace=st,s}class Nt{constructor(e,t,{position:s,facing:o=0,text:a,enabled:l=!0,style:c="chest"}){this.opened=!1,this.enabled=l,this.time=0,this.lidAngle=0,this.crateStyle=c==="crate",this.lidHeight=this.crateStyle?C.lidHeight:Tt;const i=this.group=new I;i.position.copy(s),i.rotation.y=o,e.add(i);const b=new A({color:this.crateStyle?C.wood:kt,roughness:.85,flatShading:!0}),p=new A({color:this.crateStyle?C.dark:zt,roughness:this.crateStyle?1:.5,metalness:this.crateStyle?0:.3,flatShading:!0}),f=(d,m,w,T,W,v)=>{const x=new E(m,w);return x.position.set(T,W,v),x.castShadow=x.receiveShadow=!0,d.add(x),x},u=f(i,new S(r.w,r.h,r.d),b,0,r.h/2,0);if(this.crateStyle){for(const w of[.18,.82])f(i,new S(r.w+.03,r.h*.12,r.d+.03),p,0,r.h*w,0);const d=new A({color:C.seal,emissive:X,emissiveIntensity:.25,roughness:.85,flatShading:!0}),m=f(i,new S(.12,.12,.018),d,0,r.h*.55,-.48/2-.02);m.rotation.z=Math.PI/4}else{for(const d of[-.22,.22])f(i,new S(.06,r.h+.01,r.d+.01),p,d,r.h/2,0);f(i,new S(.1,.12,.03),p,0,r.h-.07,-.48/2-.01)}if(this.inner=f(i,new Q(r.w-.06,r.d-.06),new tt({color:X,toneMapped:!1}),0,r.h+.001,0),this.inner.rotation.x=-Math.PI/2,this.inner.castShadow=!1,this.lid=new I,this.lid.position.set(0,r.h,r.d/2),i.add(this.lid),f(this.lid,new S(r.w,this.lidHeight,r.d),b,0,this.lidHeight/2,-.48/2),!this.crateStyle)for(const d of[-.22,.22])f(this.lid,new S(.06,this.lidHeight+.01,r.d+.01),p,d,this.lidHeight/2,-.48/2);i.updateMatrixWorld(!0),t.addMesh(u),this.glow=new ft(new ut({map:Ht(),transparent:!0,depthWrite:!1,toneMapped:!1,opacity:0})),this.glow.position.set(0,r.h+.25,0),i.add(this.glow),this.label=new F("Click to open",{width:.9,weight:300,maxCharsWidth:520}),this.label.mesh.position.copy(s).setY(s.y+r.h+this.lidHeight+.4),e.add(this.label.mesh),this.scene=e,this.setText(a)}setText(e){this.text&&(this.scene.remove(this.text.mesh),this.text.material.map.dispose(),this.text.material.dispose(),this.text=null),e&&(this.text=new F(e,{width:3.2,fontSize:54,weight:300,maxCharsWidth:1150,sentencesPerSecond:.6,blankLine:.45}),this.text.mesh.position.copy(this.group.position).setY(this.group.position.y+2.2),this.scene.add(this.text.mesh))}get top(){return this.group.localToWorld(new H(0,r.h+this.lidHeight,0))}reachable(e){const t=this.group.position;return this.enabled&&!this.opened&&Math.hypot(e.x-t.x,e.z-t.z)<Et&&Math.abs(e.y-t.y)<.6}open(){this.opened=!0}update(e,t,s){this.time+=e;const o=this.group.position,a=Math.hypot(s.x-o.x,s.z-o.z),l=this.reachable(s);this.lidAngle=J(this.lidAngle,this.opened?At:0,4,e),this.lid.rotation.x=this.lidAngle;const c=.5+.5*Math.sin(this.time*2),i=this.crateStyle?.05+.08*c:.15+.2*c,b=this.enabled?this.opened?.85:i:0;return this.glow.material.opacity=J(this.glow.material.opacity,b,4,e),this.glow.scale.setScalar(this.opened?1.6:.6+.2*c),this.label.update(e,l?1:0,t,8),this.text?.update(e,this.opened&&a<mt?1:0,t,1.5),l}}export{Ct as K,Nt as T,$t as Z,Rt as a,Wt as b,Gt as c,Ot as d,Lt as e,Dt as t};
