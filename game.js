const $=i=>document.getElementById(i),K={l:0,r:0,u:0,d:0,n:0},M={ArrowLeft:'l',a:'l',ArrowRight:'r',d:'r',ArrowUp:'u',w:'u',ArrowDown:'d',s:'d',Shift:'n',' ':'n'};
const kk=e=>M[e.key.length>1||e.key===' '?e.key:e.key.toLowerCase()],rnd=(a,b)=>a+Math.random()*(b-a),v3=(x,y,z)=>new THREE.Vector3(x,y,z),wrap=a=>a-6.2832*Math.round(a/6.2832);
let best=0,ready=true,S;try{best=+localStorage.getItem('voltBest')||0}catch(e){}
addEventListener('keydown',e=>{const k=kk(e);if(k){K[k]=1;e.preventDefault()}if(e.key==='Enter'&&ready)start()});
addEventListener('keyup',e=>{const k=kk(e);if(k)K[k]=0});
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.onpointerdown=e=>{e.preventDefault();K[k]=1};['pointerup','pointercancel','pointerleave'].forEach(t=>b['on'+t]=()=>K[k]=0)});
document.addEventListener('contextmenu',e=>e.preventDefault());
// ---------- renderer / scene
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.outputEncoding=THREE.sRGBEncoding;
R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.15;R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x03050f);scene.fog=new THREE.FogExp2(0x060b1f,.0042);
const cam=new THREE.PerspectiveCamera(62,1,.1,2500);
const rs=()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener('resize',rs);rs();
scene.add(new THREE.HemisphereLight(0x5577ff,0x0a0a18,.7));
const moon=new THREE.DirectionalLight(0x9db4ff,1.1);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);moon.shadow.bias=-.0005;
Object.assign(moon.shadow.camera,{left:-45,right:45,top:45,bottom:-45,near:1,far:200});scene.add(moon,moon.target);
const tex=(w,h,f,rx,ry)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t};
// ---------- track
const L=6000,RW=16,ramps=[];
for(let i=0;i<18;i++){const a=260+i*320,len=34+i*1.5+rnd(0,6);ramps.push({a,b:a+len,h:Math.min(7+i*.9+rnd(0,2),22)})}
const H=s=>{for(const r of ramps)if(s>=r.a&&s<=r.b)return r.h*(s-r.a)/(r.b-r.a);return 0},dH=s=>{for(const r of ramps)if(s>=r.a&&s<=r.b)return r.h/(r.b-r.a);return 0};
const roadT=tex(256,256,(g,w,h)=>{g.fillStyle='#13151c';g.fillRect(0,0,w,h);for(let i=0;i<4000;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.05})`;g.fillRect(Math.random()*w,Math.random()*h,2,2)}
 g.fillStyle='#e8f1ff';g.fillRect(w/2-3,0,6,h/2);g.fillStyle='#00e5ff';g.fillRect(5,0,4,h);g.fillRect(w-9,0,4,h)},1,L/16);
const road=new THREE.Mesh(new THREE.PlaneGeometry(RW,L).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({map:roadT,roughness:.35,metalness:.3}));road.position.z=-L/2+50;road.receiveShadow=true;scene.add(road);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(1200,1200).rotateX(-Math.PI/2),new THREE.MeshStandardMaterial({color:0x070a12,roughness:1}));ground.position.y=-.05;ground.receiveShadow=true;scene.add(ground);
const neon=(c)=>new THREE.MeshBasicMaterial({color:c});
[-1,1].forEach(s=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,L),neon(0x00e5ff));m.position.set(s*8.2,.15,-L/2+50);scene.add(m)});
const rampMat=new THREE.MeshStandardMaterial({color:0x2a3350,roughness:.45,metalness:.5,emissive:0x061a33});
ramps.forEach(r=>{const len=r.b-r.a,sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(len,0);sh.lineTo(len,r.h);sh.closePath();
 const g=new THREE.ExtrudeGeometry(sh,{depth:RW,bevelEnabled:false}).translate(0,0,-RW/2).rotateY(Math.PI/2);
 const m=new THREE.Mesh(g,rampMat);m.position.z=-r.a;m.castShadow=m.receiveShadow=true;scene.add(m);
 const e=new THREE.LineSegments(new THREE.EdgesGeometry(g),new THREE.LineBasicMaterial({color:0x00e5ff}));e.position.z=-r.a;scene.add(e);
 const lip=new THREE.Mesh(new THREE.BoxGeometry(RW,.2,.7),neon(0xff2bd6));lip.position.set(0,r.h+.05,-r.b+.35);scene.add(lip);
 for(let k=1;k<5;k++){const st=new THREE.Mesh(new THREE.BoxGeometry(RW,.08,.4),neon(0x7c4dff));const s=r.a+len*k/5;st.position.set(0,H(s)+.06,-s);st.rotation.x=Math.atan(r.h/len);scene.add(st)}});
const d=new THREE.Object3D(),lp=new THREE.InstancedMesh(new THREE.CylinderGeometry(.12,.15,9,6),new THREE.MeshStandardMaterial({color:0x222a3a}),240),lb=new THREE.InstancedMesh(new THREE.SphereGeometry(.45,8,8),neon(0xffe2a8),240);
for(let i=0;i<240;i++){const z=-Math.floor(i/2)*50;d.position.set((i%2?1:-1)*10.5,4.5,z);d.updateMatrix();lp.setMatrixAt(i,d.matrix);d.position.y=9.2;d.updateMatrix();lb.setMatrixAt(i,d.matrix)}scene.add(lp,lb);
const win=tex(128,256,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);for(let y=4;y<h;y+=10)for(let x=4;x<w;x+=10)if(Math.random()<.4){g.fillStyle=Math.random()<.8?'#ffd98a':'#6fd8ff';g.fillRect(x,y,5,6)}},1,1);
const bm=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x070b16,emissive:0xffffff,emissiveMap:win,emissiveIntensity:.8,roughness:.8}),700);
for(let i=0;i<700;i++){const h=rnd(25,130);d.position.set((Math.random()<.5?-1:1)*rnd(30,110),h/2,-rnd(0,L));d.scale.set(rnd(10,26),h,rnd(10,26));d.updateMatrix();bm.setMatrixAt(i,d.matrix)}scene.add(bm);
const sky=new THREE.Group(),sp=new Float32Array(3600);for(let i=0;i<1200;i++){const u=Math.random()*6.28,v=Math.random()*1.4,r=900;sp.set([r*Math.cos(u)*Math.cos(v),r*Math.sin(v)+20,r*Math.sin(u)*Math.cos(v)],i*3)}
sky.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(sp,3)),new THREE.PointsMaterial({size:2,sizeAttenuation:false,fog:false})));
const mn=new THREE.Mesh(new THREE.SphereGeometry(32,24,24),new THREE.MeshBasicMaterial({color:0xdfe8ff,fog:false}));mn.position.set(-300,320,-800);sky.add(mn);scene.add(sky);
// ---------- car
const car=new THREE.Group(),wheels=[];
const paint=new THREE.MeshPhysicalMaterial({color:0xc8102e,metalness:.55,roughness:.28,clearcoat:1,clearcoatRoughness:.08}),glass=new THREE.MeshPhysicalMaterial({color:0x04060c,metalness:.9,roughness:.06,clearcoat:1});
const ext=(pts,w,mat,b)=>{const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(...p):s.moveTo(...p));const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:w,bevelSize:b,bevelThickness:b,bevelSegments:4}).translate(0,0,-w/2).rotateY(Math.PI/2),mat);m.castShadow=true;return m};
car.add(ext([[-2.35,.4],[2.3,.4],[2.45,.62],[2.3,.82],[1.2,.98],[-1.5,1],[-2.3,.9],[-2.45,.65]],1.7,paint,.1),ext([[1.3,.96],[.1,1.46],[-1,1.44],[-2.1,.98]],1.5,glass,.05));
const tl=new THREE.Mesh(new THREE.BoxGeometry(1.7,.09,.06),neon(0xff1133));tl.position.set(0,.86,2.52);car.add(tl);
[-.7,.7].forEach(x=>{const h=new THREE.Mesh(new THREE.BoxGeometry(.5,.08,.06),neon(0xffffff));h.position.set(x,.76,-2.53);car.add(h);
 const sl=new THREE.SpotLight(0xdfeaff,2.2,90,.5,.5);sl.position.set(x,.8,-2.3);sl.target.position.set(x,0,-30);car.add(sl,sl.target)});
const glow=new THREE.PointLight(0x00e5ff,1.6,9);glow.position.y=.15;car.add(glow);
[[-.95,-1.5],[.95,-1.5],[-.95,1.5],[.95,1.5]].forEach(([x,z])=>{const w=new THREE.Group(),t=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.28,20).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:0x0c0c0e,roughness:.9}));
 const r=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,.3,16).rotateZ(Math.PI/2),new THREE.MeshStandardMaterial({color:0xcfd8e6,metalness:1,roughness:.2})),sk=new THREE.Mesh(new THREE.BoxGeometry(.32,.4,.07),new THREE.MeshStandardMaterial({color:0x222}));
 w.add(t,r,sk);w.position.set(x,.38,z);t.castShadow=true;car.add(w);wheels.push(w)});scene.add(car);
// ---------- particles
const N=700,PP=new Float32Array(N*3).fill(-999),PC=new Float32Array(N*3),BC=new Float32Array(N*3),PV=Array.from({length:N},()=>v3(0,0,0)),LF=new Float32Array(N),ML=new Float32Array(N).fill(1),GR=new Float32Array(N);let pi=0;
const pg=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(PP,3)).setAttribute('color',new THREE.BufferAttribute(PC,3));
const pts=new THREE.Points(pg,new THREE.PointsMaterial({size:.8,vertexColors:true,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));pts.frustumCulled=false;scene.add(pts);
const emit=(p,v,c,l,g=0)=>{const i=pi++%N,C=new THREE.Color(c);PP.set([p.x,p.y,p.z],i*3);PV[i].copy(v);BC.set([C.r,C.g,C.b],i*3);LF[i]=ML[i]=l;GR[i]=g},W=(x,y,z)=>car.localToWorld(v3(x,y,z));
const boom=()=>{for(let i=0;i<150;i++)emit(car.position.clone().add(v3(0,1,0)),v3(rnd(-1,1),rnd(0,1),rnd(-1,1)).normalize().multiplyScalar(rnd(4,26)),[0xff5a00,0xffc400,0xffffff,0x00e5ff][i%4],rnd(.5,1.5),14)};
// ---------- game
const pop=t=>{const p=$('pop');p.textContent=t;p.classList.remove('on');void p.offsetWidth;p.classList.add('on')};
function reset(){S={x:0,s:0,y:0,vs:0,vx:0,vy:0,pitch:0,roll:0,pv:0,rv:0,fa:0,ra:0,fc:0,rc:0,air:false,airT:0,bonus:0,nitro:100,run:false,dead:false,shake:0};car.visible=true;$('bs').textContent=best;$('bs0').textContent=best}
function start(){reset();S.run=true;ready=false;$('start').classList.add('hide');$('over').classList.add('hide');$('hud').classList.remove('hide')}
function finish(win){if(!S.run)return;S.run=false;S.dead=!win;if(!win){car.visible=false;boom()}const sc=Math.floor(S.s)+S.bonus+(win?5000:0);
 if(sc>best){best=sc;try{localStorage.setItem('voltBest',best)}catch(e){}}
 setTimeout(()=>{$('ot').textContent=win?'COURSE COMPLETE':'CRASHED';$('os').textContent=sc;$('ob').textContent=best;$('hud').classList.add('hide');$('over').classList.remove('hide');ready=true},1400)}
$('go').onclick=start;$('re').onclick=start;reset();
function step(dt){if(!S.run)return;const st=K.r-K.l,nit=K.n&&S.nitro>0;let ns,ny;
 if(!S.air){const sl=dH(S.s),ang=Math.atan(sl);let a=12+(K.u?16:0);if(nit){a+=55;S.nitro=Math.max(0,S.nitro-32*dt)}else S.nitro=Math.min(100,S.nitro+5*dt);
  if(K.d)a-=40;a-=.004*S.vs*S.vs+25*Math.sin(ang);S.vs=Math.max(0,S.vs+a*dt);const mx=nit?95:62;if(S.vs>mx)S.vs-=(S.vs-mx)*2*dt;
  S.vx+=(st*16*Math.min(1,S.vs/25)-S.vx)*6*dt;S.pitch+=(ang-S.pitch)*Math.min(1,14*dt);S.roll+=(-S.vx*.012-S.roll)*Math.min(1,8*dt);S.vy=sl*S.vs}
 else{S.vy-=24*dt;if(K.u||K.d)S.pv+=((K.d-K.u)*5.5-S.pv)*Math.min(1,5*dt);else S.pv*=1-.2*dt;if(st)S.rv+=(-st*5-S.rv)*Math.min(1,5*dt);else S.rv*=1-.2*dt;
  if(nit)S.nitro=Math.max(0,S.nitro-32*dt),S.vs=Math.min(95,S.vs+20*dt);S.pitch+=S.pv*dt;S.roll+=S.rv*dt;S.fa+=S.pv*dt;S.ra+=S.rv*dt;S.airT+=dt;
  const nf=Math.floor((Math.abs(S.fa)+1)/6.283),nr=Math.floor((Math.abs(S.ra)+1)/6.283);
  if(nf>S.fc){S.fc=nf;pop((S.fa>0?'BACKFLIP':'FRONT FLIP')+(nf>1?' x'+nf:''))}else if(nr>S.rc){S.rc=nr;pop('BARREL ROLL'+(nr>1?' x'+nr:''))}}
 ns=S.s+S.vs*dt;S.x+=S.vx*dt;ny=S.y+S.vy*dt;
 if(Math.abs(S.x)>7.2){S.x=Math.sign(S.x)*7.2;S.vx=0;S.vs*=1-.4*dt;if(!S.air)for(let i=0;i<2;i++)emit(W(Math.sign(S.x)*1,.2,rnd(-1,1)),v3(rnd(-4,4),rnd(2,6),rnd(-3,3)),0xffc400,.4,10)}
 const gh=H(ns);S.s=ns;
 if(!S.air){if(ny>gh+.08){S.air=true;S.fa=S.ra=S.fc=S.rc=S.airT=0;S.y=ny}else S.y=gh}
 else if(ny<=gh){const ang=Math.atan(dH(ns)),pe=wrap(S.pitch-ang),re=wrap(S.roll);
  if(Math.abs(pe)<1.05&&Math.abs(re)<1)ok:{S.air=false;S.y=gh;S.vy=0;S.pitch=ang+pe;S.roll=re;S.pv=S.rv=0;S.vs*=1-Math.min(.3,Math.abs(pe)*.3);
   const f=S.fc+S.rc,pts=Math.floor(S.airT*120)+S.fc*500+S.rc*350+(Math.abs(pe)<.25?200:0);S.bonus+=pts;S.shake=Math.min(1.2,.3+S.airT*.2);
   if(f)S.nitro=Math.min(100,S.nitro+20*f);if(pts>150)setTimeout(()=>pop((Math.abs(pe)<.25?'PERFECT LANDING +':'+')+pts),f?900:0);
   for(let i=0;i<40;i++)emit(W(rnd(-1,1),.1,rnd(-1.5,1.5)),v3(rnd(-8,8),rnd(2,9),rnd(-8,8)),i%2?0x00e5ff:0xffe14d,.7,12)}
  else{S.y=gh;finish(false)}}
 else S.y=ny;
 if(S.s>L-120)finish(true)}
let t0=performance.now();const cp=v3(0,5,12);
(function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-t0)/1e3,.033);t0=t;step(dt);
 car.position.set(S.x,S.y,-S.s);car.rotation.set(S.pitch,-Math.atan2(S.vx,Math.max(S.vs,1)),S.roll,'YXZ');car.updateMatrixWorld();wheels.forEach(w=>w.rotation.x-=S.vs*dt/.38);
 if(S.run&&K.n&&S.nitro>0)for(let i=0;i<5;i++)emit(W((i%2?.5:-.5),.5,2.6),v3(rnd(-1,1),rnd(-.5,.8),S.vs*.3+rnd(6,14)).applyEuler(car.rotation),i%3?0x2b8cff:0xffffff,rnd(.25,.5));
 if(S.run&&!S.air&&S.vs>12&&Math.random()<.6)emit(W(rnd(-1,1),.1,2),v3(rnd(-2,2),rnd(.5,2),rnd(0,3)),0x445577,.5);
 const k=1-Math.exp(-7*dt);S.shake*=1-6*dt;cp.x+=(S.x*.8-cp.x)*k;cp.y+=(Math.max(S.y*.75+4.6,3.2)-cp.y)*k;cp.z+=(-S.s+11+S.vs*.05-cp.z)*k;
 cam.position.set(cp.x+rnd(-1,1)*S.shake*.4,cp.y+rnd(-1,1)*S.shake*.4,cp.z);cam.lookAt(S.x*.9,S.y+1.3,-S.s-12);
 const fv=62+S.vs*.22+(K.n&&S.run&&S.nitro>0?8:0);cam.fov+=(fv-cam.fov)*k;cam.updateProjectionMatrix();
 moon.position.set(S.x+30,S.y+60,-S.s+20);moon.target.position.set(S.x,S.y,-S.s);ground.position.z=-S.s;sky.position.set(S.x,0,-S.s);
 for(let i=0;i<N;i++)if(LF[i]>0){LF[i]-=dt;const j=i*3;if(LF[i]<=0){PP[j+1]=-999;continue}PV[i].y-=GR[i]*dt;PP[j]+=PV[i].x*dt;PP[j+1]+=PV[i].y*dt;PP[j+2]+=PV[i].z*dt;const f=LF[i]/ML[i];PC[j]=BC[j]*f;PC[j+1]=BC[j+1]*f;PC[j+2]=BC[j+2]*f}
 pg.attributes.position.needsUpdate=pg.attributes.color.needsUpdate=true;
 $('sc').textContent=Math.floor(S.s)+S.bonus;$('sp').textContent=Math.round(S.vs*3.6);$('al').textContent=Math.max(0,Math.round(S.y));$('nb').style.width=S.nitro+'%';
 R.render(scene,cam)})(t0);
