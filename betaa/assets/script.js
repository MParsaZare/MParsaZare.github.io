(() => {
  "use strict";
  const $ = (s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  const root=document.documentElement, saved=localStorage.getItem("devfolio-theme")||"auto";
  function applyTheme(mode){
    root.dataset.theme=mode==="auto"?(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"):mode;
    $$(".theme-option").forEach(b=>b.classList.toggle("active",b.dataset.themeChoice===mode));
    localStorage.setItem("devfolio-theme",mode);
  }
  applyTheme(saved); matchMedia("(prefers-color-scheme:dark)").addEventListener?.("change",()=>{if((localStorage.getItem("devfolio-theme")||"auto")==="auto")applyTheme("auto")});

  const loader=$("#preloader"),bar=$("#loaderBar"),percent=$("#loaderPercent"); let p=0;
  const t=setInterval(()=>{p+=Math.max(1,Math.round((100-p)*.14)); if(p>=100){p=100;clearInterval(t);setTimeout(()=>loader.classList.add("done"),240)} bar.style.width=p+"%";percent.textContent=String(p).padStart(3,"0")+"%"},40);

  const menuBtn=$("#menuBtn"),drawer=$("#drawer"),backdrop=$("#drawerBackdrop"),closeBtn=$("#drawerClose");
  function toggleMenu(open=!drawer.classList.contains("open")){drawer.classList.toggle("open",open);backdrop.classList.toggle("open",open);menuBtn.classList.toggle("open",open);menuBtn.setAttribute("aria-expanded",String(open));drawer.setAttribute("aria-hidden",String(!open));document.body.style.overflow=open?"hidden":""}
  menuBtn.addEventListener("click",()=>toggleMenu());closeBtn.addEventListener("click",()=>toggleMenu(false));backdrop.addEventListener("click",()=>toggleMenu(false));$$('[data-close-menu]').forEach(a=>a.addEventListener("click",()=>toggleMenu(false)));addEventListener("keydown",e=>{if(e.key==="Escape")toggleMenu(false)});

  const nav=$(".nav");addEventListener("scroll",()=>nav.classList.toggle("scrolled",scrollY>35),{passive:true});
  const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%5,4)*70}ms`;observer.observe(el)});

  $$(".theme-option").forEach(btn=>btn.addEventListener("click",()=>applyTheme(btn.dataset.themeChoice)));

  const track=$(".project-track"),cards=$$(".project-card"),progress=$(".slider-progress i");let index=0;
  function updateSlider(){if(!cards.length)return;const gap=18,w=cards[0].getBoundingClientRect().width;track.style.transform=`translate3d(-${index*(w+gap)}px,0,0)`;progress.style.width=`${((index+1)/cards.length)*100}%`}
  $("#nextProject").addEventListener("click",()=>{index=(index+1)%cards.length;updateSlider()});$("#prevProject").addEventListener("click",()=>{index=(index-1+cards.length)%cards.length;updateSlider()});addEventListener("resize",updateSlider);
  let sx=0;track.addEventListener("pointerdown",e=>{sx=e.clientX;track.setPointerCapture(e.pointerId)});track.addEventListener("pointerup",e=>{const dx=e.clientX-sx;if(Math.abs(dx)>50)index=dx<0?(index+1)%cards.length:(index-1+cards.length)%cards.length;updateSlider()});

  const fine=matchMedia("(pointer:fine)").matches;
  if(fine){
    const cursor=$(".cursor-orbit");let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;}, {passive:true});
    const tick=()=>{cx+=(mx-cx)*.16;cy+=(my-cy)*.16;cursor.style.left=cx+"px";cursor.style.top=cy+"px";requestAnimationFrame(tick)};tick();
    $$("a,button,.stack-card,.project-card").forEach(el=>{el.addEventListener("pointerenter",()=>document.body.classList.add("cursor-hover"));el.addEventListener("pointerleave",()=>document.body.classList.remove("cursor-hover"));el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();el.style.setProperty("--mx",(e.clientX-r.left)/r.width*100+"%");el.style.setProperty("--my",(e.clientY-r.top)/r.height*100+"%");})});
    const orb=$(".hero-orb");addEventListener("pointermove",e=>{const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;orb.style.transform=`translate3d(${x*12}px,calc(-50% + ${y*10}px),0)`},{passive:true});
    $$(".stack-card").forEach(card=>{card.addEventListener("pointermove",e=>{const r=card.getBoundingClientRect(),rx=((e.clientY-r.top)/r.height-.5)*-7,ry=((e.clientX-r.left)/r.width-.5)*7;card.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`});card.addEventListener("pointerleave",()=>card.style.transform="")});
  }
  const sections=$$("main section[id]"),navLinks=$$(".drawer-links a");new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.style.color=a.getAttribute("href")==="#"+e.target.id?"var(--accent)":"")}),{rootMargin:"-45% 0px -45% 0px"}).observe(sections[0]);sections.slice(1).forEach(s=>new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)navLinks.forEach(a=>a.style.color=a.getAttribute("href")==="#"+e.target.id?"var(--accent)":"")}),{rootMargin:"-45% 0px -45% 0px"}).observe(s));
  addEventListener("visibilitychange",()=>document.body.classList.toggle("tab-hidden",document.hidden));updateSlider();
})();
