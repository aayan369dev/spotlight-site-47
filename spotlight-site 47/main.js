const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

/* scroll progress */
const bar=$('#bar');
const onScroll=()=>{const m=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(m>0?scrollY/m:0)+')'};
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menu */
const mb=$('.menu'),lk=$('#links');
mb.addEventListener('click',()=>{const o=lk.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
lk.addEventListener('click',e=>{if(e.target.tagName==='A'){lk.classList.remove('open');mb.setAttribute('aria-expanded','false')}});

/* split headings into words */
$$('h2').forEach(h=>{
  h.classList.remove('rv');h.classList.add('wsplit');
  const words=h.textContent.trim().split(/\s+/);
  h.setAttribute('aria-label',h.textContent.trim());
  h.innerHTML=words.map((w,i)=>'<span class="w'+(i===words.length-1?' hl':'')+'" aria-hidden="true" style="--i:'+i+'">'+w+'</span>').join(' ');
});

/* reveal on scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add('in');io.unobserve(t);if(t.matches('.card,.post'))setTimeout(()=>t.classList.add('ready'),1100)}}),{threshold:.15});
$$('.rv,#steps,#gantt,.panel,h2.wsplit').forEach(el=>io.observe(el));

/* 3D tilt on cards and magnetic buttons (fine pointers only) */
if(!RM&&matchMedia('(pointer:fine)').matches){
  $$('.card,.post').forEach(c=>{
    c.addEventListener('pointermove',e=>{
      if(!c.classList.contains('ready'))return;
      const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(900px) rotateX('+(-y*7)+'deg) rotateY('+(x*9)+'deg) translateY(-4px)';
    });
    c.addEventListener('pointerleave',()=>{c.style.transform=''});
  });
  $$('.btn').forEach(b=>{
    b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.22)+'px '+((e.clientY-r.top-r.height/2)*.35)+'px'});
    b.addEventListener('pointerleave',()=>{b.style.translate='0 0'});
  });
  const stg=$('.stage');
  addEventListener('pointermove',e=>{
    if(scrollY>innerHeight)return;
    const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    stg.querySelectorAll('img,canvas').forEach((n,i)=>{n.style.translate=(-x*(i?26:14))+'px '+(-y*(i?18:10))+'px'});
  },{passive:true});
}

/* pointer light: page glow, card glow, headline beam */
const root=document.documentElement.style, h1=$('#h1');
let px=innerWidth*.5,py=innerHeight*.3,last=0,t0=performance.now();
addEventListener('pointermove',e=>{
  px=e.clientX;py=e.clientY;last=performance.now();
  root.setProperty('--gx',px+'px');root.setProperty('--gy',py+'px');
  const c=e.target.closest&&e.target.closest('.card');
  if(c){const r=c.getBoundingClientRect();c.style.setProperty('--px',(e.clientX-r.left)+'px');c.style.setProperty('--py',(e.clientY-r.top)+'px')}
},{passive:true});
function beam(now){
  const r=h1.getBoundingClientRect();
  let x,y;
  if(now-last<2500&&last){x=px-r.left;y=py-r.top}
  else{const k=(now-t0)/1000;x=r.width*(.5+.55*Math.sin(k*.9));y=r.height*(.5+.3*Math.sin(k*1.7))}
  h1.style.setProperty('--hx',x+'px');h1.style.setProperty('--hy',y+'px');
  requestAnimationFrame(beam);
}
if(RM){h1.style.background='none';h1.style.webkitTextFillColor='#fff'}else requestAnimationFrame(beam);

/* counters */
$$('[data-n]').forEach(el=>{
  const n=+el.dataset.n,s=el.dataset.s||'';
  if(RM||n===0){el.textContent=n+s;return}
  const d=1400,st=performance.now()+700;
  (function f(t){const p=Math.min(Math.max((t-st)/d,0),1),e=1-Math.pow(1-p,3);el.textContent=Math.round(n*e)+s;if(p<1)requestAnimationFrame(f)})(performance.now());
});

/* light motes in the beam */
(function(){
  const cv=$('#dust'),cx=cv.getContext('2d');let W,H,P=[];
  function size(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;W=cv.width=r.width*d;H=cv.height=r.height*d;
    P=Array.from({length:70},()=>({x:Math.random()*W,y:H*(.4+Math.random()*.6),r:(.6+Math.random()*1.8)*d,v:(.1+Math.random()*.35)*d,a:Math.random()*6.28}))}
  function draw(t){
    cx.clearRect(0,0,W,H);
    for(const p of P){
      p.y-=p.v*.4;p.x+=Math.sin(t/1800+p.a)*.25;
      if(p.y<H*.38){p.y=H;p.x=Math.random()*W}
      const cone=Math.abs(p.x-W/2)<(p.y-H*.42)*.55+W*.05;
      cx.globalAlpha=(cone?.7:.2)*(.5+.5*Math.sin(t/700+p.a));
      cx.fillStyle='#ffe8b0';cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.28);cx.fill();
    }
    if(!RM)requestAnimationFrame(draw);
  }
  size();addEventListener('resize',size);requestAnimationFrame(draw);
})();

/* approval gate demo */
const V=[
 "Rain on the window, kulhad in hand. The 7 a.m. ritual you never skip. Tag someone who owes you a chai.",
 "Some mornings need more than caffeine. Our new Monsoon Masala lands Friday. Slow down. Sip. Repeat.",
 "Introducing Monsoon Masala: cardamom, ginger and a little black pepper, brewed for grey skies. In every Kulhad & Co. cup from Friday."
];
const ta=$('#caption'),post=$('#post'),stat=$('#stat'),ap=$('#approve'),tabs=$$('.tab');
let timer=null,cur=0;
function load(i){
  cur=i;clearInterval(timer);post.classList.remove('done');
  tabs.forEach((b,j)=>b.setAttribute('aria-selected',j===i));
  ta.readOnly=false;ta.value='';ap.disabled=true;
  stat.textContent='AI is drafting...';
  if(RM){ta.value=V[i];ready();return}
  let k=0;timer=setInterval(()=>{ta.value=V[i].slice(0,++k);if(k>=V[i].length){clearInterval(timer);ready()}},16);
}
function ready(){ap.disabled=false;stat.textContent='AI draft. Needs a human edit. Nothing publishes until you approve.'}
tabs.forEach((b,i)=>b.addEventListener('click',()=>load(i)));
ap.addEventListener('click',()=>{
  if(!ta.value.trim())return;
  ta.readOnly=true;ap.disabled=true;post.classList.add('done');
  stat.textContent='Approved by you. Scheduled for Thursday 7:30 PM on Instagram.';
});
$('#redo').addEventListener('click',()=>load(cur));
ta.addEventListener('input',()=>{if(!ta.readOnly){ap.disabled=!ta.value.trim()}});
/* start the first draft when the post scrolls into view */
new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){load(0);o.disconnect()}},{threshold:.4}).observe(post);
ta.value=V[0];ready();

/* ticker duplicate for seamless loop */
const tr=$('#track');tr.innerHTML+=tr.innerHTML;

/* chat assistant: rule-based, runs anywhere with no server */
(function(){
  const fab=$('#chatBtn'),box=$('#chat'),log=$('#log'),chips=$('#chips'),form=$('#chatForm'),inp=$('#chatIn'),nudge=$('#nudge');
  const EMAIL='hello@yourdomain.com';
  const START=['What do you do?','Is everything human-approved?','How long does a build take?','How do I get started?'];
  const KB=[
   {k:['hello','hi','hii','hey','namaste','hola'],t:'Hi! I can tell you what Spotlight does, how our approval process works, or how to start. What would you like to know?',c:START},
   {k:['approv','human','safe','publish','autopilot','without our','control','trust'],t:'Every post, caption and budget move is approved by a person before it goes live. The approval step is built into the tool itself. AI drafts, our team edits, you sign off. Try it in the demo section.',g:'#demo',gl:'See the approval demo',c:['Do you automate PR pitches?','Will ad budgets move on their own?','How do I get started?']},
   {k:['pitch','journalist','press','pr ','pr?','media relations','exchange4media','storyboard'],t:'Our PR work is monitoring and research: trade press and social mentions, sentiment scoring and a daily digest. We never automate pitching. Every pitch is written and sent by a person.',c:['What do you do?','How do I get started?']},
   {k:['budget','ads',' ad ','google ads','meta ads','spend','pacing','cpc','ctr'],t:'We connect to Meta and Google Ads, then recommend budget changes, for example moving spend away from an ad set whose CTR stays flat for three days. A person approves each move. Nothing auto-executes with your money.',c:['Is everything human-approved?','How do I get started?']},
   {k:['creative','resize','reel','shorts','video','design','canva','format'],t:'Creative production is execution-focused: one asset resized into every platform format, rough cuts trimmed for Reels and Shorts, and template-driven social design. Standard formatting drops from hours to minutes.',c:['What do you do?','How long does a build take?']},
   {k:['influencer','creator','creators','negotiat'],t:'We shortlist creators who fit your audience, usually within a day, then track briefs, timelines and approvals in one workflow. Negotiation and relationships stay with our people.',c:['What do you do?','How do I get started?']},
   {k:['digital','content','calendar','social','instagram','linkedin','caption','copy','schedule'],t:'Digital marketing is our flagship: content calendars built from your brief and past performance, brand-voice captions (2 to 3 variants per post), scheduling on Instagram, X, LinkedIn and Meta, ad pacing, and automatic weekly and monthly reports.',g:'#services',gl:'View services',c:['Is everything human-approved?','How do I get started?']},
   {k:['report','dashboard','analytics','metrics','numbers'],t:'Engagement, reach and spend data is pulled in daily from Meta, Google and Instagram. Weekly and monthly client reports are generated from live numbers, so nobody rebuilds charts by hand.',c:['What do you do?','How do I get started?']},
   {k:['how long','timeline','week','roadmap','phase','when','duration','time'],t:'The full platform is planned over 19 weeks. Foundation takes 2 weeks, digital marketing automation weeks 3 to 10, PR intelligence 4 weeks, creative tooling 3 weeks and influencer tooling 2 weeks.',g:'#roadmap',gl:'See the roadmap',c:['What do you do?','How do I get started?']},
   {k:['price','pricing','cost','how much','fee','retainer','budget for','charge','kitna','daam','rate'],t:'Pricing depends on which services you need and the scope. We will not guess a number here. Book a strategy call and we will come back with a clear plan and a quote.',g:'#contact',gl:'Book a strategy call',c:['What do you do?','How do I get started?']},
   {k:['start','book','call','contact','email','reach','talk','meeting','hire','get in touch','onboard'],t:'Easiest way: book a strategy call. Email us at '+EMAIL+' with your goals and we will reply with a plan, not a deck full of promises.',g:'#contact',gl:'Go to contact',c:['What do you do?','Is everything human-approved?']},
   {k:['what do you do','service','services','offer','help','about','who are you','spotlight'],t:'Spotlight is a digital media and marketing agency with four services: digital marketing, PR intelligence, creative production and influencer campaigns. AI drafts and monitors, people approve every decision.',g:'#services',gl:'View services',c:['Is everything human-approved?','How long does a build take?','How do I get started?']},
   {k:['thank','thanks','shukriya','dhanyavad','ok','okay'],t:'Happy to help! Anything else you want to know?',c:START},
   {k:['bye','goodbye','later'],t:'Bye! Whenever you are ready for your moment in the Spotlight, we are here.'}
  ];
  const norm=s=>' '+s.toLowerCase().replace(/[^a-z0-9? ]/g,' ')+' ';
  function find(q){
    const n=norm(q);let best=null,sc=0;
    for(const e of KB){let s=0;for(const k of e.k){if(n.includes(k.length<4?' '+k.trim()+' ':k))s+=k.length}if(s>sc){sc=s;best=e}}
    return best||{t:'I am not sure about that one. I can cover services, approvals, timelines and getting started, or you can email '+EMAIL+' and a person will answer.',c:START};
  }
  function add(txt,who,go){
    const d=document.createElement('div');d.className='msg '+who;d.textContent=txt;
    if(go){const a=document.createElement('a');a.className='go';a.tabIndex=0;a.textContent=go.l+' →';
      const run=()=>{box.hidden=true;fab.setAttribute('aria-expanded','false');document.querySelector(go.h).scrollIntoView({behavior:RM?'auto':'smooth'})};
      a.addEventListener('click',run);a.addEventListener('keydown',e=>{if(e.key==='Enter')run()});d.append(document.createElement('br'),a)}
    log.append(d);log.scrollTop=log.scrollHeight;return d;
  }
  function setChips(list){
    chips.innerHTML='';(list||[]).forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.textContent=c;b.style.animationDelay=(i*70)+'ms';b.addEventListener('click',()=>ask(c));chips.append(b)});
    log.scrollTop=log.scrollHeight;
  }
  let busy=false;
  function ask(q){
    if(busy||!q.trim())return;busy=true;
    add(q.trim(),'me');setChips([]);
    const r=find(q);
    const ty=document.createElement('div');ty.className='msg bot typing';ty.innerHTML='<i></i><i></i><i></i>';log.append(ty);log.scrollTop=log.scrollHeight;
    setTimeout(()=>{ty.remove();add(r.t,'bot',r.g?{h:r.g,l:r.gl}:null);setChips(r.c);busy=false},RM?0:650+Math.min(r.t.length*6,900));
  }
  let started=false;
  function open(){
    box.hidden=false;fab.setAttribute('aria-expanded','true');fab.setAttribute('aria-label','Close chat');nudge.classList.remove('show');
    if(!started){started=true;busy=true;
      const ty=document.createElement('div');ty.className='msg bot typing';ty.innerHTML='<i></i><i></i><i></i>';log.append(ty);
      setTimeout(()=>{ty.remove();add('Welcome to Spotlight! I am the studio assistant. Ask me anything about our services, how approvals work, or timelines.','bot');setChips(START);busy=false},RM?0:800)}
    setTimeout(()=>inp.focus({preventScroll:true}),50);
  }
  function close(){box.hidden=true;fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-label','Open chat');fab.focus()}
  fab.addEventListener('click',()=>box.hidden?open():close());
  $('#chatX').addEventListener('click',close);
  nudge.addEventListener('click',open);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&!box.hidden)close()});
  form.addEventListener('submit',e=>{e.preventDefault();const v=inp.value;inp.value='';ask(v)});
  setTimeout(()=>{if(box.hidden&&!started&&!document.body.classList.contains('cookie-open')){nudge.classList.add('show');setTimeout(()=>nudge.classList.remove('show'),7000)}},5000);
})();

/* copy email */
$('#copy').addEventListener('click',async e=>{
  const b=e.currentTarget,txt=$('#mail').textContent;
  try{await navigator.clipboard.writeText(txt);b.textContent='Copied'}
  catch(_){const r=document.createRange();r.selectNodeContents($('#mail'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press copy'}
  setTimeout(()=>b.textContent='Copy',2000);
});

/* footer year */
(function(){var y=document.getElementById('y');if(y)y.textContent=new Date().getFullYear()})();


/* enquiry form: validation, spam protection, honest send states */
(function(){
  const f=$('#enq');if(!f)return;
  const ENDPOINT=''; // Paste a form-handler URL here, e.g. 'https://formspree.io/f/yourid'. Empty = email fallback.
  const EMAIL=$('#mail').textContent.trim();
  const LOADED=Date.now(),COOL='spotlight_last_send',COOL_MS=60000;
  const F={name:$('#f-name'),email:$('#f-email'),company:$('#f-co'),service:$('#f-svc'),message:$('#f-msg'),ok:$('#f-ok'),web:$('#f-web')};
  const stat=$('#fstat'),go=$('#f-go'),cnt=$('#cnt');
  const RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const rules={
    name:v=>v.trim().length<2?'Please enter your name.':'',
    email:v=>!RE.test(v.trim())?'Please enter a valid email, like name@company.com.':'',
    message:v=>v.trim().length<20?'Please write at least 20 characters so we can help properly.':'',
    ok:()=>!F.ok.checked?'Please tick the box so we can reply to you.':''
  };
  const errEl={name:$('#e-name'),email:$('#e-email'),message:$('#e-msg'),ok:$('#e-ok')};
  function check(k){
    const el=F[k],msg=rules[k](k==='ok'?'':el.value);
    errEl[k].textContent=msg;el.setAttribute('aria-invalid',msg?'true':'false');return !msg;
  }
  Object.keys(rules).forEach(k=>{
    F[k].addEventListener('blur',()=>{if(k!=='ok'&&!F[k].value&&!F[k].dataset.touched)return;check(k)});
    F[k].addEventListener('input',()=>{F[k].dataset.touched='1';if(F[k].getAttribute('aria-invalid')==='true')check(k)});
    F[k].addEventListener('change',()=>{if(k==='ok')check(k)});
  });
  F.message.addEventListener('input',()=>{cnt.textContent=F.message.value.length+' / 1200'});
  const say=(t,c)=>{stat.className='fstat'+(c?' '+c:'');stat.textContent=t};
  function fallback(d){
    const body='Name: '+d.name+'\nEmail: '+d.email+(d.company?'\nCompany: '+d.company:'')+'\nInterested in: '+d.service+'\n\n'+d.message;
    const href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Spotlight strategy call: '+d.name)+'&body='+encodeURIComponent(body);
    stat.className='fstat ok';stat.innerHTML='';
    const p=document.createElement('div');p.textContent='Your message is ready. Nothing has been sent yet. Open it in your email app, or copy it and email '+EMAIL+'.';
    const row=document.createElement('div');row.className='row';
    const a=document.createElement('a');a.className='btn sm';a.href=href;a.textContent='Open email app';
    const c=document.createElement('button');c.type='button';c.className='btn sm ghost';c.textContent='Copy message';
    c.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(body);c.textContent='Copied'}catch(_){const t=document.createElement('textarea');t.value=body;t.style.cssText='position:fixed;opacity:0';document.body.append(t);t.select();try{document.execCommand('copy');c.textContent='Copied'}catch(e){c.textContent='Select and copy manually'}t.remove()}});
    row.append(a,c);stat.append(p,row);
  }
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const okAll=['name','email','message','ok'].map(check).every(Boolean);
    if(!okAll){const bad=f.querySelector('[aria-invalid="true"]');if(bad)bad.focus();say('Please fix the highlighted fields.','bad');return}
    if(F.web.value){say('Thank you. We will be in touch soon.','ok');f.reset();return} // honeypot: bots fill hidden fields
    if(Date.now()-LOADED<3000){say('That was very quick. Please check your details and press the button again.','bad');return}
    try{const last=+localStorage.getItem(COOL)||0;if(Date.now()-last<COOL_MS){say('You just sent a message. Please wait a minute before sending another.','bad');return}}catch(_){}
    const d={name:F.name.value.trim(),email:F.email.value.trim(),company:F.company.value.trim(),service:F.service.value,message:F.message.value.trim()};
    if(!ENDPOINT){fallback(d);return}
    go.classList.add('busy');go.textContent='Sending...';say('');
    try{
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(d)});
      if(!r.ok)throw new Error(r.status);
      try{localStorage.setItem(COOL,String(Date.now()))}catch(_){}
      f.reset();cnt.textContent='0 / 1200';say('Thank you, '+d.name.split(' ')[0]+'. We have your message and will reply within one working day.','ok');
    }catch(_){say('Sorry, that did not send. Please try again, or email '+EMAIL+'.','bad')}
    go.classList.remove('busy');go.textContent='Book a strategy call';
  });
})();
