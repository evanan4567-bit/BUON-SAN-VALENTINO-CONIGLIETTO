// ═══════════════════════════════════════════════════════════════
// 💖 SAN VALENTÍN — SCRIPT FINAL BLINDADO + MUNDO 3D + HOLOGRAMA
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {

  const CONFIG = {
    fechaInicio: '2025-06-21T20:30:00',
    duracionFoto: 5000,
    duracionVideoMin: 6000,
    duracionVideoMax: 15000,
    volumenIntro: 0.45,
    volumenLove: 0.40,
    volumenFinal: 0.35,
    fadeMs: 1200,
  };

  const $ = id => document.getElementById(id);

  const introScreen=$('introScreen'),
    btnEntrar=$('btnEntrar'),
    mainWrapper=$('mainWrapper'),
    avatarDialog=$('avatarDialog'),
    seccionFinal=$('seccionFinal'),
    musicIntro=$('musicIntro'),
    musicLove=$('musicLove'),
    musicFinal=$('musicFinal'),
    musicToggle=$('musicToggle'),
    btnViajar=$('btnViajar'),
    viajeOverlay=$('viajeOverlay'),
    viajeItems=document.querySelectorAll('.viaje-item'),
    viajeTexto=$('viajeTexto'),
    btnSalirViaje=$('btnSalirViaje'),
    viajeContador=$('viajeContador'),
    viajeTotal=$('viajeTotal'),
    viajeBarraFill=$('viajeBarraFill'),
    btnSi=$('btnSi'),
    btnPensar=$('btnPensar'),
    finalMsg=$('finalMsg'),
    cierreFinal=$('cierreFinal'),
    cierreCanvas=$('cierreCanvas'),
    cierreSobre=$('cierreSobre'),
    cierreFase1=$('cierreFase1'),
    cierreFase2=$('cierreFase2'),
    cierreFase3=$('cierreFase3'),
    cierreFase4=$('cierreFase4'),
    cierreFase5=$('cierreFase5'),
    cartaTitulo=$('cartaTitulo'),
    cartaCuerpo=$('cartaCuerpo'),
    cartaFirma=$('cartaFirma'),
    promesasLista=$('promesasLista'),
    holoMedia=$('holoMedia'),
    holoTexto=$('holoTexto');

  const MENSAJES_AVATAR = [
    "Hola, soy tu guía personal de San Valentín. Prometo acompañarte en cada parte de este regalo que hice solo para ti. 💖",
    "Primero, respira... estás entrando a un lugar donde todo está hecho pensando en ti. ✨",
    "Desliza un poquito hacia abajo, tengo algo preparado para ti. 🌌",
    "¿Ya viste la sección del viaje? Dale, atrévete a pulsar ese botón. 🚀",
    "Cada recuerdo que vas a ver fue elegido con todo el corazón. 💕"
  ];

  const TEXTOS_VIAJE = [
    "Todo empezó con momentos simples, pero que para mí ya eran especiales.",
    "Luego vinieron días que no olvido, porque estabas tú ahí.",
    "Tu sonrisa se volvió mi lugar seguro en este universo.",
    "Entre fotos y videos, siempre hay algo en común: tú.",
    "Cada segundo Contigo es un tesoro que guardo para siempre.",
    "Y en algún punto del viaje entendí que ya no quería bajarme de esto Contigo.",
    "Mira cómo hemos crecido juntos... es hermoso.",
    "No cambiaría ni un solo momento de nuestra historia."
  ];

  const CARTA = {
    titulo: 'Mi amor hermoso...',
    cuerpo:
      "Sé que no somos perfectos. Sé que hay días difíciles, peleas que duelen, silencios que pesan. Pero también sé algo que vale más que todo eso: que cada vez que nos caemos, nos levantamos juntos.\n\n" +
      "Tú eres mi fuerza cuando no puedo más. Eres esa persona que me hace querer ser mejor cada día. No te elegí solo para los momentos bonitos, te elegí para TODO. Para las risas y las lágrimas, para las peleas y las reconciliaciones, para hoy y para siempre.\n\n" +
      "Gracias por no rendirte conmigo. Gracias por amarme tal como soy. Gracias por ser mi hogar.\n\n" +
      "Te amo con cada parte de mi ser. Hasta el final. 💕",
    firma: 'Tu enamorado, siempre ❤️'
  };

  const PROMESAS = [
    "Prometo amarte incluso cuando estemos enojados",
    "Prometo nunca irme a dormir sin arreglar las cosas",
    "Prometo ser tu refugio cuando el mundo sea demasiado",
    "Prometo elegirte todos los días, no solo los fáciles",
    "Prometo hacerte reír hasta en tus peores días",
    "Prometo luchar por nosotros, siempre",
    "Prometo nunca dejar de conquistarte",
    "Prometo estar contigo hasta el final 💍"
  ];

  // CANDADOS
  let cartaIniciada=false,
      clicSiEfectuado=false,
      clicPensarEfectuado=false,
      sobreAbierto=false,
      cierreActivado=false;

  // AUDIO
  let musicaActual=null,
      musicaActiva=false,
      fadeInterval=null;

  function fadeOut(a,d){
    return new Promise(r=>{
      if(!a||a.paused){r();return}
      const s=a.volume/(d/30);
      clearInterval(fadeInterval);
      fadeInterval=setInterval(()=>{
        if(a.volume-s<=0){
          a.volume=0;a.pause();
          clearInterval(fadeInterval);r()
        }else a.volume-=s;
      },30);
    });
  }

  function fadeIn(a,v,d){
    return new Promise(r=>{
      a.volume=0;
      a.play().then(()=>{
        const s=v/(d/30);
        const fi=setInterval(()=>{
          if(a.volume+s>=v){
            a.volume=v;clearInterval(fi);r();
          }else a.volume+=s;
        },30);
      }).catch(()=>r());
    });
  }

  async function reproducir(m){
    if(musicaActual===m && !m.paused) return;
    if(musicaActual && musicaActual!==m){
      await fadeOut(musicaActual,CONFIG.fadeMs);
      musicaActual.currentTime=0;
    }
    musicaActual=m;
    if(!m) return;
    let v=CONFIG.volumenIntro;
    if(m===musicLove) v=CONFIG.volumenLove;
    if(m===musicFinal) v=CONFIG.volumenFinal;
    try{
      await fadeIn(m,v,CONFIG.fadeMs);
      musicaActiva=true;
      musicToggle.classList.remove('paused');
    }catch(e){
      musicaActiva=false;
      musicToggle.classList.add('paused');
    }
  }

  // CANVAS GLOBAL DE FONDO
  function initBgCanvas(){
    const c=$('bgCanvas');
    if(!c) return;
    const ctx=c.getContext('2d');
    let ps=[];
    let mouse={x:-1e3,y:-1e3};

    function rs(){
      c.width=innerWidth;
      c.height=innerHeight;
    }
    rs();
    addEventListener('resize',rs);
    document.addEventListener('mousemove',e=>{
      mouse.x=e.clientX;mouse.y=e.clientY;
    });

    const CL=['255,107,157','255,215,0','255,194,209','200,150,255','255,255,255','0,255,255','255,105,180'];

    class P{
      constructor(){this.r()}
      r(){
        this.x=Math.random()*c.width;
        this.y=Math.random()*c.height;
        this.bs=Math.random()*2+.4;
        this.s=this.bs;
        this.vy=-(Math.random()*.25+.05);
        this.vx=(Math.random()-.5)*.15;
        this.op=Math.random()*.7+.2;
        this.ts=Math.random()*.012+.004;
        this.td=1;
        this.c=CL[Math.random()*CL.length|0];
      }
      u(){
        this.y+=this.vy;
        this.x+=this.vx;
        this.op+=this.ts*this.td;
        if(this.op>=.95||this.op<=.15) this.td*=-1;

        const dx=this.x-mouse.x,dy=this.y-mouse.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          const f=(120-d)/120;
          this.s=this.bs+f*3;
          this.op=Math.min(1,this.op+f*.3);
        }else{
          this.s+=(this.bs-this.s)*.05;
        }

        if(this.y<-10){this.r();this.y=c.height+10}
        if(this.x<-10||this.x>c.width+10) this.r();
      }
      d(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.s*4,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.c},${this.op*.06})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.c},${this.op})`;
        ctx.fill();
      }
    }

    for(let i=0;i<100;i++) ps.push(new P);

    function anim(){
      ctx.clearRect(0,0,c.width,c.height);
      ps.forEach(p=>{p.u();p.d()});
      for(let i=0;i<ps.length;i++){
        for(let j=i+1;j<ps.length;j++){
          const dx=ps[i].x-ps[j].x,dy=ps[i].y-ps[j].y;
          const d=Math.sqrt(dx*dx+dy*dy);
          if(d<80){
            ctx.beginPath();
            ctx.moveTo(ps[i].x,ps[i].y);
            ctx.lineTo(ps[j].x,ps[j].y);
            ctx.strokeStyle=`rgba(255,105,180,${.08*(1-d/80)})`;
            ctx.lineWidth=.5;ctx.stroke();
          }
        }
      }
      requestAnimationFrame(anim);
    }
    anim();
  }
  initBgCanvas();

  // SPARKLES
  const sparkE=['💖','✨','💕','⭐','💗','🌟','💫','🦋'];
  document.addEventListener('click',e=>{
    if(introScreen && !introScreen.classList.contains('hidden')) return;
    for(let i=0;i<7;i++)createSparkle(e.clientX,e.clientY);
  });

  function createSparkle(x,y){
    const el=document.createElement('div');
    el.textContent=sparkE[Math.random()*sparkE.length|0];
    const a=Math.random()*Math.PI*2,
          d=Math.random()*90+30,
          tx=Math.cos(a)*d,
          ty=Math.sin(a)*d;

    el.style.cssText=
      `position:fixed;left:${x}px;top:${y}px;pointer-events:none;`+
      `z-index:99998;font-size:${Math.random()*16+10}px;`+
      `transition:all .8s cubic-bezier(.23,1,.32,1);opacity:1`;

    document.body.appendChild(el);
    requestAnimationFrame(()=>{
      el.style.transform=`translate(${tx}px,${ty}px) scale(.2) rotate(${Math.random()*360}deg)`;
      el.style.opacity='0';
    });
    setTimeout(()=>el.remove(),900);
  }

  // AVATAR
  let indiceMensaje=0,avatarAutoTimer=null;

  function cambiarDialogo(t){
    if(!avatarDialog) return;
    avatarDialog.style.opacity='0';
    avatarDialog.style.transform='translateY(8px)';
    setTimeout(()=>{
      avatarDialog.textContent=t;
      avatarDialog.style.transition='all .5s ease';
      avatarDialog.style.opacity='1';
      avatarDialog.style.transform='translateY(0)';
    },300);
  }

  function siguienteMensajeAvatar(){
    indiceMensaje=(indiceMensaje+1)%MENSAJES_AVATAR.length;
    cambiarDialogo(MENSAJES_AVATAR[indiceMensaje]);
  }

  function iniciarAutoAvatar(){
    avatarAutoTimer=setInterval(siguienteMensajeAvatar,20000);
  }

  function detenerAutoAvatar(){
    if(avatarAutoTimer){
      clearInterval(avatarAutoTimer);
      avatarAutoTimer=null;
    }
  }

  // ENTRADA
  btnEntrar.addEventListener('click',async()=>{
    introScreen.style.transition='opacity 1.2s ease,filter 1.2s ease';
    introScreen.style.opacity='0';
    introScreen.style.filter='blur(10px)';

    setTimeout(()=>{
      introScreen.classList.add('hidden');
      mainWrapper.classList.add('visible');
      scrollTo({top:0,behavior:'instant'});
    },1200);

    await reproducir(musicIntro);

    setTimeout(()=>cambiarDialogo(MENSAJES_AVATAR[1]),4000);
    setTimeout(()=>cambiarDialogo(MENSAJES_AVATAR[2]),9000);
    setTimeout(()=>cambiarDialogo(MENSAJES_AVATAR[3]),15000);
    setTimeout(iniciarAutoAvatar,20000);
  });

  // MÚSICA TOGGLE
  musicToggle.addEventListener('click',async()=>{
    if(!musicaActual){
      await reproducir(musicIntro);
      return;
    }
    if(musicaActiva && !musicaActual.paused){
      musicaActual.pause();
      musicaActiva=false;
      musicToggle.classList.add('paused');
    }else{
      try{
        await musicaActual.play();
        musicaActiva=true;
        musicToggle.classList.remove('paused');
      }catch(e){}
    }
  });

  // SCROLL REVEAL
  const sO=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        sO.unobserve(e.target);
      }
    });
  },{threshold:.15,rootMargin:'0px 0px -40px 0px'});

  document.querySelectorAll('.seccion-entrada').forEach(el=>sO.observe(el));

  // ═══════ VIAJE WARP ═══════
  let warpCtx,warpStars=[],warpSpeed=0,warpTarget=0,warpRAF;
  let indiceRecuerdo=0,viajeEnCurso=false,recuerdoTimeout=null;

  if(viajeTotal) viajeTotal.textContent=viajeItems.length;

  const recuerdoContainer=document.createElement('div');
  recuerdoContainer.className='recuerdo-flotante';
  recuerdoContainer.innerHTML='<div class="recuerdo-marco"></div>';

  function initWarpCanvas(){
    const c=$('warpCanvas');
    if(!c) return;
    warpCtx=c.getContext('2d');
    warpStars=[];

    function rs(){
      c.width=innerWidth;
      c.height=innerHeight;
    }
    rs();
    addEventListener('resize',rs);

    const cx=()=>c.width/2,cy=()=>c.height/2;
    const cols=['255,255,255','255,182,255','255,215,0','200,150,255','255,105,180','0,255,255'];

    class W{
      constructor(){this.r()}
      r(){
        this.x=(Math.random()-.5)*c.width*2;
        this.y=(Math.random()-.5)*c.height*2;
        this.z=Math.random()*c.width;
        this.pz=this.z;
        this.c=cols[Math.random()*cols.length|0];
      }
      u(s){
        this.pz=this.z;
        this.z-=s;
        if(this.z<1) this.r();
      }
      d(){
        const sx=(this.x/this.z)*cx()+cx(),
              sy=(this.y/this.z)*cy()+cy(),
              px=(this.x/this.pz)*cx()+cx(),
              py=(this.y/this.pz)*cy()+cy(),
              sz=Math.max(0,(1-this.z/c.width)*3),
              al=Math.max(0,Math.min(1,(1-this.z/c.width)*1.5));

        if(warpSpeed>3){
          warpCtx.beginPath();
          warpCtx.moveTo(px,py);
          warpCtx.lineTo(sx,sy);
          warpCtx.strokeStyle=`rgba(${this.c},${al})`;
          warpCtx.lineWidth=sz*.8;
          warpCtx.stroke();
        }

        warpCtx.beginPath();
        warpCtx.arc(sx,sy,sz,0,Math.PI*2);
        warpCtx.fillStyle=`rgba(${this.c},${al})`;
        warpCtx.fill();

        if(sz>1){
          warpCtx.beginPath();
          warpCtx.arc(sx,sy,sz*3,0,Math.PI*2);
          warpCtx.fillStyle=`rgba(${this.c},${al*.08})`;
          warpCtx.fill();
        }
      }
    }

    for(let i=0;i<600;i++) warpStars.push(new W);

    function anim(){
      warpSpeed+=(warpTarget-warpSpeed)*.04;
      warpCtx.fillStyle=`rgba(0,0,0,${warpSpeed>3?.15:.3})`;
      warpCtx.fillRect(0,0,c.width,c.height);
      warpStars.forEach(s=>{s.u(warpSpeed);s.d()});
      warpRAF=requestAnimationFrame(anim);
    }
    anim();
  }

  function setWarpSpeed(s){warpTarget=s}

  btnViajar.addEventListener('click',()=>{
    viajeOverlay.classList.add('activo');
    viajeEnCurso=true;indiceRecuerdo=0;

    const cont=viajeOverlay.querySelector('.viaje-contenido');
    if(!cont.contains(recuerdoContainer)) cont.appendChild(recuerdoContainer);

    reproducir(musicLove);
    cambiarDialogo("Prepárate, vamos a viajar por todo lo que hemos vivido Contigo. 🚀");

    initWarpCanvas();

    setTimeout(()=>{
      setWarpSpeed(15);
      viajeOverlay.classList.add('warp-speed');
      recuerdoTimeout=setTimeout(()=>mostrarRecuerdo(),3000);
    },800);
  });

  function mostrarRecuerdo(){
    if(!viajeEnCurso || indiceRecuerdo>=viajeItems.length){
      if(viajeEnCurso){
        indiceRecuerdo=0;
        mostrarRecuerdo();
      }
      return;
    }

    setWarpSpeed(.3);
    viajeOverlay.classList.remove('warp-speed');

    const item=viajeItems[indiceRecuerdo],
          img=item.querySelector('img'),
          video=item.querySelector('video'),
          txt=item.querySelector('span')?.textContent||'',
          esV=!!video;

    const marco=recuerdoContainer.querySelector('.recuerdo-marco');
    marco.innerHTML='';

    let media;
    if(esV){
      media=document.createElement('video');
      media.src=video.src;
      media.muted=true;
      media.loop=true;
      media.playsInline=true;
      media.autoplay=true;
      marco.appendChild(media);
      media.play().catch(()=>{});
    }else{
      media=document.createElement('img');
      media.src=img.src;
      media.alt=img.alt||'Recuerdo';
      marco.appendChild(media);
    }

    const td=document.createElement('div');
    td.className='recuerdo-texto';
    td.innerHTML=`<p>${txt}</p><span class="recuerdo-numero">${indiceRecuerdo+1} / ${viajeItems.length}</span>`;
    marco.appendChild(td);

    recuerdoContainer.classList.remove('saliendo');
    requestAnimationFrame(()=>recuerdoContainer.classList.add('visible'));

    if(viajeContador) viajeContador.textContent=indiceRecuerdo+1;
    if(viajeBarraFill) viajeBarraFill.style.width=((indiceRecuerdo+1)/viajeItems.length*100)+'%';

    const ti=Math.floor((indiceRecuerdo/viajeItems.length)*TEXTOS_VIAJE.length);
    viajeTexto.style.opacity='0';
    setTimeout(()=>{
      viajeTexto.textContent=TEXTOS_VIAJE[Math.min(ti,TEXTOS_VIAJE.length-1)];
      viajeTexto.style.opacity='1';
    },500);

    let dur=CONFIG.duracionFoto;
    if(esV){
      if(media.duration && isFinite(media.duration)){
        dur=Math.min(Math.max(media.duration*1000,CONFIG.duracionVideoMin),CONFIG.duracionVideoMax);
      }else{
        dur=CONFIG.duracionVideoMin;
        media.addEventListener('loadedmetadata',()=>{
          if(!viajeEnCurso) return;
          clearTimeout(recuerdoTimeout);
          recuerdoTimeout=setTimeout(
            ()=>ocultarRecuerdoYAvanzar(),
            Math.min(Math.max(media.duration*1000,CONFIG.duracionVideoMin),CONFIG.duracionVideoMax)
          );
        },{once:true});
      }
    }
    recuerdoTimeout=setTimeout(()=>ocultarRecuerdoYAvanzar(),dur);
  }

  function ocultarRecuerdoYAvanzar(){
    if(!viajeEnCurso) return;
    recuerdoContainer.classList.remove('visible');
    recuerdoContainer.classList.add('saliendo');
    const v=recuerdoContainer.querySelector('video');
    if(v){v.pause();v.currentTime=0;}
    setWarpSpeed(15);
    viajeOverlay.classList.add('warp-speed');
    indiceRecuerdo++;
    recuerdoTimeout=setTimeout(()=>mostrarRecuerdo(),2500);
  }

  btnSalirViaje.addEventListener('click',()=>{
    viajeEnCurso=false;
    clearTimeout(recuerdoTimeout);
    setWarpSpeed(0);
    recuerdoContainer.classList.remove('visible');
    recuerdoContainer.classList.add('saliendo');
    const v=recuerdoContainer.querySelector('video');
    if(v) v.pause();
    viajeOverlay.classList.remove('activo','warp-speed');
    if(warpRAF) cancelAnimationFrame(warpRAF);
    if(viajeBarraFill) viajeBarraFill.style.width='0%';
    viajeTexto.textContent="Viajando por un universo lleno de momentos Contigo...";
    cambiarDialogo("¡Qué viaje tan hermoso! Ahora sigue bajando, todavía tengo algo más. ❤️");
    reproducir(musicIntro);
  });

  // SCROLL → MÚSICA FINAL
  let finalActivado=false;
  addEventListener('scroll',()=>{
    if(!seccionFinal||finalActivado) return;
    if(seccionFinal.getBoundingClientRect().top<innerHeight*.65){
      finalActivado=true;
      reproducir(musicFinal);
      cambiarDialogo("Llegamos a la parte importante... ❤️");
    }
  });

  // BOTONES FINALES BLINDADOS
  btnSi.addEventListener('click',()=>{
    if(clicSiEfectuado) return;
    clicSiEfectuado=true;
    btnSi.style.transform='scale(1.1)';
    btnSi.style.boxShadow='0 0 40px rgba(255,105,180,0.6)';
    finalMsg.textContent="Sabía que ibas a decir que sí... 💘";
    cambiarDialogo("Prepárate para lo más hermoso... 🥹");
    const r=btnSi.getBoundingClientRect();
    for(let i=0;i<20;i++){
      setTimeout(()=>createSparkle(
        r.left+r.width/2+(Math.random()-.5)*100,
        r.top+r.height/2+(Math.random()-.5)*100
      ),i*50);
    }
    setTimeout(activarCierre,3000);
  });

  btnPensar.addEventListener('click',()=>{
    if(clicPensarEfectuado) return;
    clicPensarEfectuado=true;
    finalMsg.textContent="No importa cuánto lo pienses... la respuesta siempre fue sí. 💫";
    cambiarDialogo("Igual te preparé algo... 🌙");
    btnPensar.style.transition='transform .3s ease';
    btnPensar.style.transform=`translate(${(Math.random()-.5)*60}px,${(Math.random()-.5)*30}px)`;
    setTimeout(()=>{
      btnPensar.textContent="Bueno ya, sí quiero 😍";
      btnPensar.style.transform='translate(0,0)';
      btnPensar.onclick=()=>{
        if(cierreActivado) return;
        finalMsg.textContent="¡Lo sabía! 💘";
        setTimeout(activarCierre,2000);
      };
    },1500);
  });

  // ═══════ CIERRE FINAL ═══════
  function activarCierre(){
    if(cierreActivado) return;
    cierreActivado=true;
    detenerAutoAvatar();

    mainWrapper.style.transition='opacity 1.8s ease,filter 1.8s ease';
    mainWrapper.style.opacity='0';
    mainWrapper.style.filter='blur(8px)';

    setTimeout(()=>{
      mainWrapper.style.display='none';
      cierreFinal.style.display='block';
      cierreFinal.style.opacity='0';
      cierreFinal.style.transition='opacity 2.5s ease';

      if(musicaActual!==musicFinal) reproducir(musicFinal);
      scrollTo({top:0,behavior:'instant'});

      requestAnimationFrame(()=>{
        cierreFinal.style.opacity='1';
        initCierreCanvas();
        crearCorazonesCierre();
      });
    },2000);
  }

  function initCierreCanvas(){
    const ctx=cierreCanvas.getContext('2d');
    let es=[];
    function rs(){
      cierreCanvas.width=innerWidth;
      cierreCanvas.height=innerHeight;
    }
    rs();
    addEventListener('resize',rs);

    const CL=['255,107,157','255,215,0','255,194,209','200,150,255','255,255,255','255,105,180','0,255,255'];

    class S{
      constructor(){this.r()}
      r(){
        this.x=Math.random()*cierreCanvas.width;
        this.y=Math.random()*cierreCanvas.height;
        this.s=Math.random()*2.5+.3;
        this.vy=-(Math.random()*.2+.03);
        this.vx=(Math.random()-.5)*.12;
        this.op=Math.random()*.8+.2;
        this.tw=Math.random()*.015+.004;
        this.td=1;
        this.c=CL[Math.random()*CL.length|0];
      }
      u(){
        this.y+=this.vy;
        this.x+=this.vx;
        this.op+=this.tw*this.td;
        if(this.op>=1||this.op<=.1) this.td*=-1;
        if(this.y<-10){this.r();this.y=cierreCanvas.height+10;}
      }
      d(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.s,0,Math.PI*2);
        ctx.fillStyle=`rgba(${this.c},${this.op})`;
        ctx.fill();
      }
    }

    for(let i=0;i<180;i++) es.push(new S);

    function loop(){
      ctx.clearRect(0,0,cierreCanvas.width,cierreCanvas.height);
      es.forEach(s=>{s.u();s.d()});
      requestAnimationFrame(loop);
    }
    loop();
  }

  function crearCorazonesCierre(){
    const cont=$('cierreCorazones');
    const em=['❤️','💕','💖','💗','💓','🌹','✨','💝','🦋','💫','🥀','💘','💞'];
    function sp(){
      const c=document.createElement('div');
      c.className='cierre-corazon-flotante';
      c.textContent=em[Math.random()*em.length|0];
      c.style.left=Math.random()*100+'%';
      c.style.fontSize=(Math.random()*18+10)+'px';
      c.style.animationDuration=(Math.random()*9+7)+'s';
      c.style.animationDelay=Math.random()*2+'s';
      cont.appendChild(c);
      setTimeout(()=>c.remove(),18000);
    }
    setInterval(sp,800);
    for(let i=0;i<12;i++) setTimeout(sp,i*200);
  }

  // FASE 1: Sobre
  cierreSobre.addEventListener('click',()=>{
    if(sobreAbierto) return;
    sobreAbierto=true;
    cierreSobre.classList.add('abierto');

    const r=cierreSobre.getBoundingClientRect();
    for(let i=0;i<15;i++)
      setTimeout(()=>createSparkle(
        r.left+r.width/2,
        r.top+r.height/2
      ),i*60);

    setTimeout(()=>{
      cierreFase1.style.transition='opacity .8s ease';
      cierreFase1.style.opacity='0';
      setTimeout(()=>{
        cierreFase1.style.display='none';
        cierreFase2.style.display='block';
        typewriterCarta();
      },900);
    },1200);
  });

  // FASE 2: Carta blindada
  function typewriterCarta(){
    if(cartaIniciada) return;
    cartaIniciada=true;
    let i=0;
    cartaTitulo.textContent='';
    cartaCuerpo.textContent='';
    cartaCuerpo.innerText='';
    cartaFirma.textContent='';
    cartaFirma.style.opacity='0';

    function eT(){
      if(i<CARTA.titulo.length){
        cartaTitulo.textContent=CARTA.titulo.substring(0,i+1);
        i++;setTimeout(eT,70);
      }else{
        i=0;setTimeout(eC,600);
      }
    }

    function eC(){
      if(i<CARTA.cuerpo.length){
        cartaCuerpo.innerText=CARTA.cuerpo.substring(0,i+1);
        i++;
        let ch=CARTA.cuerpo[i-1],dl=35;
        if(ch==='.'){dl=400}
        else if(ch===','){dl=200}
        else if(ch==='\n'){dl=300}
        setTimeout(eC,dl);
      }else{
        cartaFirma.textContent=CARTA.firma;
        cartaFirma.style.transition='opacity 2s ease';
        cartaFirma.style.opacity='1';
        setTimeout(mostrarFase3,12000);
      }
    }
    eT();
  }

  // ═══════ FASE 3: MUNDO 3D DEL AMOR + HOLOGRAMA ═══════
  function mostrarFase3(){
    cierreFase2.style.transition='opacity 1.2s ease,transform 1.2s ease';
    cierreFase2.style.opacity='0';
    cierreFase2.style.transform='translateY(-30px)';
    setTimeout(()=>{
      cierreFase2.style.display='none';
      cierreFase3.style.display='flex';
      construirMundo3D();
      iniciarHologramaMundo();
      setTimeout(mostrarFase4,10000);
    },1300);
  }

  function construirMundo3D(){
    const esfera=$('mundoEsfera');
    if(!esfera) return;

    const items=[
      {t:'emoji',v:'❤️'},{t:'emoji',v:'💕'},{t:'emoji',v:'💖'},{t:'emoji',v:'💗'},
      {t:'emoji',v:'🌹'},{t:'emoji',v:'🌸'},{t:'emoji',v:'🦋'},{t:'emoji',v:'✨'},
      {t:'emoji',v:'💫'},{t:'emoji',v:'🌺'},{t:'emoji',v:'💘'},{t:'emoji',v:'🥀'},
      {t:'emoji',v:'💝'},{t:'emoji',v:'💞'},{t:'emoji',v:'🌷'},{t:'emoji',v:'🌻'},
      {t:'text',v:'Te amo'},{t:'text',v:'Eres mi todo'},
      {t:'text',v:'Siempre tú'},{t:'text',v:'Mi vida'},
      {t:'text',v:'Por siempre'},{t:'text',v:'Contigo'},
      {t:'text',v:'Mi amor'},{t:'text',v:'Te adoro'},
      {t:'text',v:'Mi corazón'},{t:'text',v:'Eres perfecta'},
    ];

    const total=items.length;
    const radius=Math.min(esfera.offsetWidth,esfera.offsetHeight)/2.2;

    items.forEach((item,i)=>{
      const phi=Math.acos(-1+(2*i)/total);
      const theta=Math.sqrt(total*Math.PI)*phi;

      const x=radius*Math.cos(theta)*Math.sin(phi);
      const y=radius*Math.sin(theta)*Math.sin(phi);
      const z=radius*Math.cos(phi);

      const el=document.createElement('div');

      if(item.t==='emoji'){
        el.className='orbita-elem';
        el.textContent=item.v;
        el.style.cssText=
          `--tz:${z}px;font-size:${1.2+Math.random()*1.2}rem;`+
          `animation-delay:${Math.random()*2}s;animation-duration:${1.5+Math.random()*2}s`;
      } else {
        el.className='orbita-elem orbita-texto';
        el.textContent=item.v;
        el.style.cssText=
          `--tz:${z}px;animation-delay:${Math.random()*2}s;animation-duration:${2+Math.random()*2}s`;
      }

      el.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px)`;
      esfera.appendChild(el);
    });
  }

  function iniciarHologramaMundo(){
    if(!holoMedia || !holoTexto) return;

    const RECUERDOS_MUNDO = [
      {
        src: 'img/anillos_promesa.jpg',
        tipo: 'img',
        texto: 'Nuestros anillos, nuestro sí silencioso al “para siempre”.'
      },
      {
        src: 'img/picnic_noche.jpg',
        tipo: 'img',
        texto: 'Nuestro picnic de noche, prometiéndonos no soltarnos nunca.'
      },
      {
        src: 'img/ano_nuevo.jpg',
        tipo: 'img',
        texto: 'Año Nuevo Contigo, soñando muchos años más a tu lado.'
      },
      {
        src: 'img/primera_navidad.jpg',
        tipo: 'img',
        texto: 'Nuestra primera Navidad, el inicio de todas las que quiero contigo.'
      }
    ];

    let idx = 0;

    function mostrarUno(){
      const r = RECUERDOS_MUNDO[idx];
      holoMedia.innerHTML = '';

      let el;
      if(r.tipo === 'img'){
        el = document.createElement('img');
        el.src = r.src;
        el.alt = 'Recuerdo';
      }else{
        el = document.createElement('video');
        el.src = r.src;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.autoplay = true;
        el.play().catch(()=>{});
      }
      holoMedia.appendChild(el);

      holoTexto.style.opacity = '0';
      setTimeout(()=>{
        holoTexto.textContent = r.texto + ' Por siempre tú y yo. ♾️';
        holoTexto.style.transition = 'opacity .6s ease';
        holoTexto.style.opacity = '1';
      },200);

      idx = (idx + 1) % RECUERDOS_MUNDO.length;
    }

    mostrarUno();
    setInterval(mostrarUno, 28000);
  }

  // FASE 4: Promesas
  function mostrarFase4(){
    cierreFase3.style.transition='opacity 1.2s ease';
    cierreFase3.style.opacity='0';
    setTimeout(()=>{
      cierreFase3.style.display='none';
      cierreFase4.style.display='block';

      PROMESAS.forEach((p,i)=>{
        const d=document.createElement('div');
        d.className='promesa-item';
        d.innerHTML=`<span>✦</span> ${p}`;
        promesasLista.appendChild(d);
        setTimeout(()=>d.classList.add('visible'),i*700);
      });

      setTimeout(mostrarFase5,PROMESAS.length*700+3500);
    },1300);
  }

  // FASE 5: Te Amo + Contador
  function mostrarFase5(){
    cierreFase4.style.transition='opacity 1.5s ease';
    cierreFase4.style.opacity='0';
    setTimeout(()=>{
      cierreFase4.style.display='none';
      cierreFase5.style.display='block';
      const cx=innerWidth/2,cy=innerHeight/3;
      for(let i=0;i<30;i++)
        setTimeout(()=>createSparkle(
          cx+(Math.random()-.5)*300,
          cy+(Math.random()-.5)*200
        ),i*80);
      iniciarContador();
    },1600);
  }

  function iniciarContador(){
    const inicio=new Date(CONFIG.fechaInicio);
    function act(){
      const d=new Date()-inicio;
      an('cDias',Math.floor(d/864e5));
      an('cHoras',Math.floor((d%864e5)/36e5));
      an('cMins',Math.floor((d%36e5)/6e4));
      an('cSegs',Math.floor((d%6e4)/1e3));
    }
    function an(id,v){
      const el=$(id);
      if(!el) return;
      if((parseInt(el.textContent)||0)!==v){
        el.style.transform='translateY(-5px)';
        el.style.opacity='.5';
        setTimeout(()=>{
          el.textContent=v;
          el.style.transition='all .3s ease';
          el.style.transform='translateY(0)';
          el.style.opacity='1';
        },150);
      }
    }
    act();
    setInterval(act,1000);
  }

  // PRECARGAR VIDEOS DEL VIAJE
  viajeItems.forEach(item=>{
    const v=item.querySelector('video');
    if(v){v.preload='metadata';v.load();}
  });

  console.log('💖 San Valentín FINAL + Mundo 3D + Holograma cargado');
});
