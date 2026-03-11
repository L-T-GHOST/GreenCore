import { useState, useEffect, useRef, useCallback } from "react";
import {
  Leaf, Building2, TrendingUp, Zap, Globe, Power, Moon, Sun,
  AlertTriangle, Download, CheckCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

/* ── Design Tokens ── */
const C = {
  bg:"#06080f", card:"#0d1424", cardHi:"#111c30", border:"#1e2d45",
  green:"#00e5a0", cyan:"#38bdf8", indigo:"#818cf8", amber:"#fbbf24",
  red:"#f87171", text:"#e2e8f0", muted:"#64748b", dim:"#334155",
};

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *,*::before,*::after{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{margin:0;padding:0;background:${C.bg};font-family:'Space Mono',monospace;overflow-x:hidden;color:${C.text}}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:${C.bg}}
  ::-webkit-scrollbar-thumb{background:${C.cyan};border-radius:3px}

  /* ── Sliders ── */
  input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;outline:none;cursor:pointer;background:${C.border}}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:${C.cyan};border:3px solid ${C.bg};box-shadow:0 0 0 2px ${C.cyan},0 0 12px ${C.cyan}88;cursor:pointer;transition:transform .15s}
  input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2)}
  input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:${C.cyan};border:3px solid ${C.bg};box-shadow:0 0 0 2px ${C.cyan},0 0 12px ${C.cyan}88;cursor:pointer}
  input[type=range].green-thumb::-webkit-slider-thumb{background:${C.green};box-shadow:0 0 0 2px ${C.green},0 0 12px ${C.green}88}
  input[type=range].amber-thumb::-webkit-slider-thumb{background:${C.amber};box-shadow:0 0 0 2px ${C.amber},0 0 12px ${C.amber}88}
  input[type=range].indigo-thumb::-webkit-slider-thumb{background:${C.indigo};box-shadow:0 0 0 2px ${C.indigo},0 0 12px ${C.indigo}88}

  /* ── Keyframes ── */
  @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:.7}100%{transform:translateY(-65px) scale(.2);opacity:0}}
  @keyframes scanline{0%{top:-5%}100%{top:105%}}
  @keyframes ping-dot{0%{transform:scale(1);opacity:1}75%,100%{transform:scale(2.5);opacity:0}}
  @keyframes glitch{0%,100%{transform:translate(0);filter:hue-rotate(0deg)}20%{transform:translate(-2px,1px);filter:hue-rotate(90deg)}40%{transform:translate(2px,-1px);filter:hue-rotate(180deg)}60%{transform:translate(-1px,2px);filter:hue-rotate(270deg)}80%{transform:translate(1px,-2px);filter:hue-rotate(360deg)}}
  @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
  @keyframes countUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes redFlash{0%,100%{background:${C.bg}}15%{background:#2a0a0a}30%{background:${C.bg}}45%{background:#1f0808}60%{background:${C.bg}}}
  @keyframes heatRise{0%{transform:translateY(0) scaleX(1);opacity:.8}100%{transform:translateY(-55px) scaleX(.2);opacity:0}}
  @keyframes coolPulse{0%,100%{opacity:.2;transform:scale(1)}50%{opacity:.8;transform:scale(1.2)}}
  @keyframes treeGrow{0%{transform:scaleY(0);transform-origin:bottom}100%{transform:scaleY(1);transform-origin:bottom}}
  @keyframes fadeSlide{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

  .scan-line{position:absolute;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${C.cyan}35,transparent);animation:scanline 5s linear infinite;pointer-events:none}
  .glow-green{text-shadow:0 0 22px ${C.green},0 0 44px ${C.green}55}
  .glow-cyan{text-shadow:0 0 18px ${C.cyan},0 0 36px ${C.cyan}55}
  .glitch-anim{animation:glitch .35s steps(1) infinite}

  /* ── Buttons ── */
  .btn-primary{display:inline-flex;align-items:center;gap:8px;background:${C.cyan};color:#020810;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:2px;border:none;border-radius:8px;padding:12px 24px;cursor:pointer;transition:all .2s;box-shadow:0 0 20px ${C.cyan}44}
  .btn-primary:hover{background:#7ee8ff;box-shadow:0 0 28px ${C.cyan}77;transform:translateY(-1px)}
  .btn-danger{display:inline-flex;align-items:center;gap:8px;background:rgba(248,113,113,.15);color:${C.red};font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:2px;border:2px solid ${C.red}88;border-radius:8px;padding:11px 22px;cursor:pointer;transition:all .2s}
  .btn-danger:hover{background:rgba(248,113,113,.28);border-color:${C.red};box-shadow:0 0 18px ${C.red}44}
  .btn-toggle{display:inline-flex;align-items:center;gap:10px;background:${C.card};border:2px solid ${C.border};font-family:'Space Mono',monospace;font-size:12px;font-weight:700;letter-spacing:2px;border-radius:8px;padding:11px 20px;cursor:pointer;transition:all .3s;color:${C.muted}}
  .btn-toggle.on{border-color:${C.green}77;background:rgba(0,229,160,.08);color:${C.green};box-shadow:0 0 18px ${C.green}28}
  .btn-toggle.off-state{color:${C.amber};border-color:${C.amber}55}
`;

/* ── Particle Canvas ── */
function ParticleCanvas({ color=C.cyan, count=50, speed=.3 }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d");
    const resize = () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; };
    resize();
    const pts = Array.from({length:count}, () => ({
      x:Math.random()*cv.width, y:Math.random()*cv.height,
      r:Math.random()*1.4+.4, dx:(Math.random()-.5)*speed, dy:(Math.random()-.5)*speed, a:Math.random()
    }));
    let raf;
    const h = n => Math.floor(n).toString(16).padStart(2,"0");
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = color+h(p.a*175); ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0||p.x>cv.width) p.dx*=-1;
        if(p.y<0||p.y>cv.height) p.dy*=-1;
      });
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const d=Math.hypot(pts[i].x-pts[j].x,pts[i].y-pts[j].y);
        if(d<95){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=color+h((1-d/95)*50);ctx.lineWidth=.35;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);}
  },[color,count,speed]);
  return <canvas ref={ref} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.4,pointerEvents:"none"}}/>;
}

/* ── Animated Counter ── */
function AnimatedCounter({target,prefix="",suffix="",duration=2000,decimals=0}) {
  const [val,setVal]=useState(0);
  const [on,setOn]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setOn(true)},{threshold:.3});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  useEffect(()=>{
    if(!on)return;
    const t0=performance.now();
    const tick=now=>{
      const t=Math.min((now-t0)/duration,1);
      setVal(+((1-Math.pow(1-t,3))*target).toFixed(decimals));
      if(t<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },[on,target,duration,decimals]);
  return <span ref={ref}>{prefix}{val.toLocaleString("en-IN")}{suffix}</span>;
}

/* ── Badge ── */
function Badge({text,color=C.cyan}) {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:7,marginBottom:16,
      background:`${color}0e`,border:`1px solid ${color}44`,borderRadius:20,padding:"5px 16px"}}>
      <div style={{width:7,height:7,borderRadius:"50%",background:color,animation:"ping-dot 2s ease infinite"}}/>
      <span style={{color,fontSize:11,letterSpacing:3}}>{text}</span>
    </div>
  );
}

/* ── Labeled Slider ── */
function LabeledSlider({label,min,max,value,onChange,thumbClass="",color=C.cyan,unit=""}) {
  const pct = ((value-min)/(max-min))*100;
  return (
    <div>
      {label && (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{color:C.muted,fontSize:12,letterSpacing:1}}>{label}</span>
          <span style={{color,fontSize:"1.1rem",fontFamily:"'Space Mono',monospace",fontWeight:700,
            background:`${color}14`,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 10px"}}>
            {value}{unit}
          </span>
        </div>
      )}
      <div style={{position:"relative",height:24,display:"flex",alignItems:"center"}}>
        <div style={{position:"absolute",left:0,right:0,height:6,background:C.dim,borderRadius:3,pointerEvents:"none"}}/>
        <div style={{position:"absolute",left:0,height:6,width:`${pct}%`,
          background:`linear-gradient(90deg,${color}99,${color})`,borderRadius:3,pointerEvents:"none",transition:"width .08s"}}/>
        <input type="range" className={thumbClass} min={min} max={max} value={value}
          onChange={e=>onChange(+e.target.value)}
          style={{position:"relative",zIndex:2,background:"transparent",height:6}}/>
      </div>
    </div>
  );
}

/* ══ PAGE 1: HERO ══ */
function HeroSection() {
  const [year,setYear]=useState(2026);
  const [mouse,setMouse]=useState({x:0,y:0});
  const secRef=useRef(null);
  const p=(year-2026)/21;
  const pue=(2.0-p*0.65).toFixed(2);

  const onMove=useCallback(e=>{
    const r=secRef.current?.getBoundingClientRect();
    if(!r)return;
    setMouse({x:((e.clientX-r.left)/r.width-.5)*18,y:((e.clientY-r.top)/r.height-.5)*10});
  },[]);

  const blds=[
    {x:15,w:55,h:175},{x:80,w:38,h:115},{x:128,w:75,h:215},{x:215,w:42,h:145},
    {x:268,w:95,h:255},{x:375,w:50,h:135},{x:435,w:65,h:195},{x:512,w:47,h:165},
    {x:570,w:85,h:235},{x:668,w:37,h:108},{x:716,w:70,h:180},{x:798,w:52,h:150},
    {x:862,w:80,h:205},{x:954,w:55,h:140},{x:1020,w:75,h:190},{x:1108,w:42,h:120},
  ];
  const cr=Math.round(40+(1-p)*55);
  const cg=Math.round(55+p*115);
  const cb=Math.round(80+(1-p)*55+p*35);

  return (
    <section ref={secRef} onMouseMove={onMove} style={{
      position:"relative",minHeight:"100vh",overflow:"hidden",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"80px 24px 0",background:`radial-gradient(ellipse at 50% -5%,#0a2040 0%,${C.bg} 65%)`
    }}>
      <ParticleCanvas color={C.cyan} count={65} speed={.22}/>
      <div className="scan-line"/>

      {/* Grid */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`linear-gradient(${C.cyan}07 1px,transparent 1px),linear-gradient(90deg,${C.cyan}07 1px,transparent 1px)`,
        backgroundSize:"55px 55px",
        transform:`translate(${mouse.x*.18}px,${mouse.y*.1}px)`,transition:"transform .12s linear"}}/>

      {/* Cityscape */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"52%",
        transform:`translate(${mouse.x*.7}px,${mouse.y*.35}px)`,transition:"transform .1s linear"}}>
        <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet"
          style={{position:"absolute",bottom:0,width:"100%",height:"100%"}}>
          <defs>
            <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`rgb(${cr},${cg},${cb})`} stopOpacity=".9"/>
              <stop offset="100%" stopColor="#040810" stopOpacity="1"/>
            </linearGradient>
            <filter id="cglow1"><feGaussianBlur stdDeviation={p*2.5} result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {blds.map((b,i)=>(
            <g key={i} filter="url(#cglow1)">
              <rect x={b.x} y={300-b.h} width={b.w} height={b.h} rx={2} fill="url(#cg1)" opacity={.9}/>
              {Array.from({length:Math.floor(b.h/26)}).map((_,j)=>
                Array.from({length:Math.floor(b.w/14)}).map((_,k)=>(
                  <rect key={`${j}-${k}`} x={b.x+4+k*13} y={300-b.h+8+j*24} width={6} height={9} rx={1}
                    fill={p>.25
                      ?`rgba(${Math.round(60+p*80)},${Math.round(180+p*55)},${Math.round(220+p*30)},${.12+p*.42})`
                      :"rgba(160,175,210,.1)"}/>
                ))
              )}
              {b.h>170&&<>
                <line x1={b.x+b.w/2} y1={300-b.h} x2={b.x+b.w/2} y2={300-b.h-20}
                  stroke={p>.4?C.green:"#445"} strokeWidth="1.5"/>
                <circle cx={b.x+b.w/2} cy={300-b.h-22} r={2.5}
                  fill={p>.4?C.green:"#445"} opacity={.45+p*.5}/>
              </>}
            </g>
          ))}
          <rect x={0} y={298} width={1200} height={3}
            fill={`rgba(${Math.round(40+p*50)},${Math.round(90+p*130)},${Math.round(190+p*35)},${.2+p*.35})`}/>
        </svg>
      </div>

      {/* Content */}
      <div style={{position:"relative",zIndex:10,textAlign:"center",maxWidth:860}}>
        <Badge text="AI-POWERED GREEN DATA INFRASTRUCTURE" color={C.green}/>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,
          fontSize:"clamp(2.8rem,6.5vw,6rem)",lineHeight:1.0,
          color:C.text,margin:"0 0 10px",letterSpacing:-2}}>
          Green<span className="glow-green" style={{color:C.green}}>Core</span>{" "}
          <span style={{color:C.cyan}} className="glow-cyan">AI</span>
        </h1>
        <p style={{color:C.muted,fontSize:"clamp(.9rem,1.7vw,1.05rem)",
          maxWidth:560,margin:"14px auto 28px",lineHeight:1.75}}>
          Autonomous thermal intelligence for next-generation green data centers —
          cutting energy waste, reducing emissions, and achieving Net-Zero by 2047.
        </p>

        {/* Stats */}
        <div style={{display:"inline-flex",gap:0,marginBottom:34,
          background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
          {[
            {label:"PUE Score",    value:pue,                    color:+pue<1.6?C.green:C.amber},
            {label:"Year",         value:year,                   color:C.cyan},
            {label:"Emissions Cut",value:`${Math.round(p*32)}%`, color:C.indigo},
          ].map((d,i)=>(
            <div key={d.label} style={{padding:"14px 26px",textAlign:"center",
              borderRight:i<2?`1px solid ${C.border}`:"none"}}>
              <div style={{color:d.color,fontSize:"1.55rem",fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{d.value}</div>
              <div style={{color:C.muted,fontSize:10,letterSpacing:2,marginTop:3}}>{d.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline slider */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,
          borderRadius:14,padding:"22px 28px",maxWidth:540,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
            <span style={{color:C.dim,fontSize:11,letterSpacing:2,fontWeight:700}}>2026</span>
            <span style={{color:C.cyan,fontSize:11,letterSpacing:2}}>▶ DRAG THE TIMELINE</span>
            <span style={{color:C.green,fontSize:11,letterSpacing:2,fontWeight:700}}>2047</span>
          </div>
          <LabeledSlider label="" min={2026} max={2047} value={year}
            onChange={setYear} thumbClass="green-thumb" color={C.green} unit=""/>
        </div>
      </div>

    </section>
  );
}

/* ══ PAGE 2: STRATEGY HUB ══ */
const PILLARS=[
  {icon:Globe,    label:"Digital Future",  color:C.cyan,   stat:"50+ Hyperscale DCs",
   desc:"Supporting 50+ new hyperscale data centers in the Vizag IT Corridor, positioning AP as Asia's premier digital infrastructure destination.",
   points:["Vizag Smart Data Park","AI-managed server clusters","5G-integrated edge nodes"]},
  {icon:Leaf,     label:"Net-Zero 2047",   color:C.green,  stat:"32% Emission Cut",
   desc:"Directly cutting 30%+ carbon emissions per facility through real-time AI thermal optimization and renewable energy switching.",
   points:["Solar + Wind load balancing","Carbon credit automation","Real-time PUE tracking"]},
  {icon:Building2,label:"Infrastructure",  color:C.indigo, stat:"₹12,000 Cr Infra",
   desc:"Enabling smart infrastructure with AI-driven predictive maintenance, reducing downtime by 78% across state-owned data facilities.",
   points:["Predictive hardware failure","Automated cooling systems","Distributed power grids"]},
  {icon:TrendingUp,label:"Economic Growth",color:C.amber,  stat:"2.4L Jobs Created",
   desc:"Generating 2.4 lakh high-skill jobs in green tech, AI operations, and renewable energy sectors across Andhra Pradesh by 2035.",
   points:["AI Operations Centers","Green tech export hubs","Skill development pipelines"]},
  {icon:Zap,      label:"Energy Security", color:"#f472b6",stat:"40% Renewable Mix",
   desc:"Achieving 40% renewable energy mix for all state data centers through AI-orchestrated solar, wind, and battery storage systems.",
   points:["Dynamic renewable switching","Battery arbitrage AI","Grid stability algorithms"]},
];

function PillarCard({pillar,index}) {
  const [hov,setHov]=useState(false);
  const [tilt,setTilt]=useState({x:0,y:0});
  const ref=useRef(null);
  const Icon=pillar.icon;
  const onMove=e=>{
    const r=ref.current.getBoundingClientRect();
    setTilt({x:((e.clientX-r.left)/r.width-.5)*20,y:((e.clientY-r.top)/r.height-.5)*-15});
  };
  return (
    <div ref={ref}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0})}} onMouseMove={onMove}
      style={{
        transform:hov?`perspective(700px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) translateY(-4px) scale(1.03)`:"perspective(700px) scale(1)",
        transition:"transform .15s ease,box-shadow .3s,border-color .3s,background .3s",
        background:hov?`${pillar.color}0b`:C.card,
        border:`1.5px solid ${hov?pillar.color+"66":C.border}`,
        borderRadius:14,padding:"22px 20px 24px",cursor:"default",position:"relative",overflow:"hidden",
        boxShadow:hov?`0 8px 40px ${pillar.color}25,0 0 0 1px ${pillar.color}1a`:`0 2px 10px rgba(0,0,0,.4)`,
        minHeight:hov?300:185,
      }}>
      {hov&&<div style={{position:"absolute",inset:0,pointerEvents:"none",
        background:`radial-gradient(ellipse at ${50+tilt.x*2}% ${50-tilt.y*2}%,${pillar.color}12,transparent 68%)`}}/>}
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
        <div style={{width:42,height:42,borderRadius:10,background:`${pillar.color}12`,
          border:`1.5px solid ${pillar.color}${hov?"66":"2a"}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:hov?`0 0 14px ${pillar.color}40`:"none",transition:"all .3s"}}>
          <Icon size={18} color={pillar.color}/>
        </div>
        <div>
          <div style={{color:pillar.color,fontSize:10,letterSpacing:2.5,fontWeight:700}}>PILLAR {index+1}</div>
          <div style={{color:C.text,fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:700}}>{pillar.label}</div>
        </div>
      </div>
      <div style={{display:"inline-block",background:`${pillar.color}12`,border:`1px solid ${pillar.color}30`,
        borderRadius:5,padding:"3px 10px",marginBottom:11,
        color:pillar.color,fontSize:11,fontWeight:700}}>{pillar.stat}</div>
      <p style={{color:C.muted,fontSize:12.5,lineHeight:1.65,margin:"0 0 6px",
        maxHeight:hov?160:68,overflow:"hidden",transition:"max-height .4s ease"}}>{pillar.desc}</p>
      {hov&&(
        <ul style={{margin:"10px 0 0",padding:0,listStyle:"none"}}>
          {pillar.points.map((pt,i)=>(
            <li key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,
              color:"rgba(255,255,255,.6)",fontSize:12,
              animation:"fadeSlide .25s ease both",animationDelay:`${i*.07}s`}}>
              <span style={{color:pillar.color}}>▸</span>{pt}
            </li>
          ))}
        </ul>
      )}
      <div style={{position:"absolute",top:0,right:0,width:30,height:30,
        borderTop:`2px solid ${pillar.color}${hov?"77":"1a"}`,borderRight:`2px solid ${pillar.color}${hov?"77":"1a"}`,
        borderRadius:"0 14px 0 0",transition:"border-color .3s"}}/>
    </div>
  );
}

function StrategyHub() {
  return (
    <section style={{padding:"100px 24px",background:`linear-gradient(180deg,${C.bg} 0%,#070c1a 100%)`,position:"relative",overflow:"hidden"}}>
      <ParticleCanvas color={C.indigo} count={32} speed={.16}/>
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:54}}>
          <Badge text="CORE ALIGNMENT STRATEGY" color={C.indigo}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2rem,4vw,3.2rem)",color:C.text,margin:0,letterSpacing:-1}}>
            Five Pillars of <span className="glow-cyan" style={{color:C.cyan}}>Swarna Andhra</span>
          </h2>
          <p style={{color:C.muted,marginTop:10,fontSize:13}}>Hover each pillar to reveal GreenCore AI's contribution</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:18}}>
          {PILLARS.map((p,i)=><PillarCard key={i} pillar={p} index={i}/>)}
        </div>
      </div>
    </section>
  );
}

/* ══ PAGE 3: DIGITAL TWIN ══ */
const NODES=[
  {id:0,x:14,y:9},{id:1,x:44,y:9},{id:2,x:74,y:9},
  {id:3,x:14,y:44},{id:4,x:44,y:44},{id:5,x:74,y:44},
  {id:6,x:29,y:77},{id:7,x:59,y:77},
];

function DigitalTwin() {
  const [aiOn,setAiOn]=useState(false);
  const [traffic,setTraffic]=useState(50);
  const [waste,setWaste]=useState(0);
  const [nds,setNds]=useState(NODES.map(()=>({load:40,hot:false})));

  useEffect(()=>{
    const iv=setInterval(()=>{
      setNds(NODES.map((_,i)=>{
        let load=aiOn
          ?Math.min(traffic*.58+(i%3)*4+Math.random()*8,87)
          :Math.min(traffic*.84+(i<3?16:0)+Math.random()*17,99);
        load=Math.round(load);
        return{load,hot:load>73};
      }));
      if(!aiOn) setWaste(w=>w+Math.round(traffic/100*46*(.85+Math.random()*.28)));
    },700);
    return()=>clearInterval(iv);
  },[aiOn,traffic]);

  const hotCount=nds.filter(n=>n.hot).length;
  const livePUE=aiOn?(1.36+hotCount*.025+traffic/900).toFixed(2):(1.88+hotCount*.035+traffic/350).toFixed(2);
  const avgLoad=Math.round(nds.reduce((a,n)=>a+n.load,0)/nds.length);

  return (
    <section style={{padding:"100px 24px",background:"#070c1a",position:"relative",overflow:"hidden"}}>
      <div className="scan-line"/>
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:46}}>
          <Badge text="LIVE DIGITAL TWIN" color={C.green}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2rem,4vw,3.2rem)",color:C.text,margin:0,letterSpacing:-1}}>
            Interactive <span className="glow-green" style={{color:C.green}}>Server Floor</span> Simulation
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,alignItems:"start"}}>

          {/* Map panel */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22,position:"relative",overflow:"hidden"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <span style={{color:C.muted,fontSize:11,letterSpacing:2}}>SERVER FLOOR MAP</span>
              <button className={`btn-toggle ${aiOn?"on":"off-state"}`}
                onClick={()=>{setAiOn(v=>!v);if(aiOn)setWaste(0);}}>
                <Power size={13}/> GreenCore AI: {aiOn?"ON":"OFF"}
              </button>
            </div>
            {/* SVG server map — fixed height, no overlap */}
            <div style={{width:"100%",height:240}}>
              <svg viewBox="0 0 100 100" style={{width:"100%",height:"100%",display:"block"}}>
                {[20,40,60,80].map(x=><line key={x} x1={x} y1={0} x2={x} y2={100} stroke={`${C.border}55`} strokeWidth=".25"/>)}
                {[25,55,85].map(y=><line key={y} x1={0} y1={y} x2={100} y2={y} stroke={`${C.border}55`} strokeWidth=".25"/>)}
                {NODES.map((nd,i)=>{
                  const s=nds[i]||{load:40,hot:false};
                  return(
                    <g key={nd.id}>
                      {!aiOn&&s.hot&&[0,1,2].map(j=>(
                        <circle key={j} cx={nd.x+5+j*2} cy={nd.y+2} r={.7} fill={C.red}
                          style={{animation:`heatRise ${.9+j*.25}s ease-out infinite`,animationDelay:`${j*.18}s`}}/>
                      ))}
                      {aiOn&&!s.hot&&[0,1].map(j=>(
                        <circle key={j} cx={nd.x+3+j*6} cy={nd.y-.5} r={1.4}
                          fill={`${C.cyan}55`}
                          style={{animation:`coolPulse ${1.6+j*.4}s ease infinite`,animationDelay:`${j*.3}s`}}/>
                      ))}
                      <rect x={nd.x} y={nd.y} width={14} height={10} rx={1.5}
                        fill={s.hot?`${C.red}18`:`${C.cyan}0e`}
                        stroke={s.hot?C.red:C.cyan} strokeWidth={s.hot?1.1:.7}
                        style={{filter:s.hot?`drop-shadow(0 0 ${s.load/28}px ${C.red})`:`drop-shadow(0 0 ${s.load/55}px ${C.cyan})`}}/>
                      <rect x={nd.x+1} y={nd.y+7.5} width={Math.round(s.load/100*12)} height={1.5} rx={.7}
                        fill={s.load>74?C.red:s.load>52?C.amber:C.green}/>
                      {aiOn&&!s.hot&&(
                        <text x={nd.x+1.5} y={nd.y-1.5} fontSize={1.9} fill={C.green} fontFamily="monospace">AI✓</text>
                      )}
                      <text x={nd.x+7} y={nd.y+5} textAnchor="middle" fontSize={1.8}
                        fill={s.hot?C.red:C.muted} fontFamily="monospace">{s.load}%</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Status bar — sits below the map, never overlaps */}
            <div style={{marginTop:10,
              background:aiOn?`${C.green}0e`:`${C.red}10`,
              border:`1px solid ${aiOn?C.green+"44":C.red+"44"}`,
              borderRadius:8,padding:"8px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:aiOn?C.green:C.red,fontSize:10,letterSpacing:1}}>
                {aiOn?"✓ AI OPTIMIZED":"⚠ ENERGY WASTE"}
              </span>
              <span style={{color:aiOn?C.green:C.red,fontSize:13,fontFamily:"'Space Mono',monospace",fontWeight:700}}>
                {aiOn?`PUE: ${livePUE}`:`₹${waste.toLocaleString("en-IN")} / hr`}
              </span>
            </div>
          </div>

          {/* Controls panel */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:22}}>
              <LabeledSlider label="TRAFFIC LOAD SIMULATION" min={10} max={100}
                value={traffic} onChange={setTraffic} color={C.cyan} unit="%"
                thumbClass={traffic>75?"amber-thumb":""}/>
              <div style={{marginTop:8,textAlign:"right"}}>
                <span style={{fontSize:11,color:traffic>75?C.amber:C.muted,letterSpacing:1}}>
                  {traffic>75?"⚠ HIGH STRESS ZONE":traffic>50?"MODERATE LOAD":"NORMAL OPERATIONS"}
                </span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[
                {label:"Live PUE",  value:livePUE,          color:aiOn?C.green:C.red},
                {label:"Hot Nodes", value:`${hotCount}/8`,  color:hotCount>3?C.red:C.green},
                {label:"Avg Load",  value:`${avgLoad}%`,    color:C.cyan},
                {label:"AI Status", value:aiOn?"ACTIVE":"IDLE",color:aiOn?C.green:C.dim},
              ].map(s=>(
                <div key={s.label} style={{background:C.card,border:`1.5px solid ${s.color}20`,borderRadius:12,padding:"14px 16px"}}>
                  <div style={{color:C.muted,fontSize:10,letterSpacing:2,marginBottom:5}}>{s.label}</div>
                  <div style={{color:s.color,fontSize:"1.3rem",fontWeight:700,fontFamily:"'Space Mono',monospace"}}>{s.value}</div>
                </div>
              ))}
            </div>
            <div style={{background:aiOn?`${C.green}07`:`${C.red}07`,
              border:`1px solid ${aiOn?C.green+"2a":C.red+"2a"}`,borderRadius:12,padding:16}}>
              <div style={{color:aiOn?C.green:C.red,fontSize:10,letterSpacing:2,marginBottom:7}}>
                {aiOn?"● AI RECOMMENDATION":"● THERMAL ALERT"}
              </div>
              <p style={{color:C.muted,fontSize:12,margin:0,lineHeight:1.65}}>
                {aiOn
                  ?`Workload redistributed across ${8-hotCount} optimal nodes. Estimated ₹${Math.round(traffic*27).toLocaleString("en-IN")}/hr saved.`
                  :`${hotCount} server(s) above thermal threshold. Enabling GreenCore AI will reduce PUE from ${livePUE} to ~1.42.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ PAGE 4: ECONOMIC IMPACT ══ */
const CHART_DATA=[
  {year:"2026",standard:2200,greencore:1800},{year:"2027",standard:2500,greencore:1950},
  {year:"2028",standard:2900,greencore:1900},{year:"2029",standard:3300,greencore:1850},
  {year:"2030",standard:3800,greencore:1780},{year:"2032",standard:4600,greencore:1700},
  {year:"2035",standard:5800,greencore:1600},{year:"2040",standard:7200,greencore:1450},
  {year:"2047",standard:9500,greencore:1350},
];

function Tree({delay,h,color}) {
  return(
    <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",marginRight:2,
      animation:`treeGrow 1.1s ease ${delay}s both`,transformOrigin:"bottom"}}>
      <div style={{width:0,height:0,borderLeft:`${h*.33}px solid transparent`,borderRight:`${h*.33}px solid transparent`,borderBottom:`${h*.52}px solid ${color}`,marginBottom:1}}/>
      <div style={{width:0,height:0,borderLeft:`${h*.25}px solid transparent`,borderRight:`${h*.25}px solid transparent`,borderBottom:`${h*.42}px solid ${color}`,marginBottom:1}}/>
      <div style={{width:h*.11,height:h*.2,background:"#7c4a1e",borderRadius:1}}/>
    </div>
  );
}

function EconomicImpact() {
  const [dc,setDc]=useState(20);
  const [vis,setVis]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold:.2});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[]);
  const savings=dc*5,co2=dc*10,trees=Math.min(Math.round(co2/8),42);
  const tc=[C.green,"#22d3a0","#4ade80","#86efac","#34d399"];
  return(
    <section ref={ref} style={{padding:"100px 24px",background:C.bg,position:"relative",overflow:"hidden"}}>
      <ParticleCanvas color={C.green} count={25} speed={.12}/>
      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        <div style={{textAlign:"center",marginBottom:54}}>
          <Badge text="ECONOMIC IMPACT ANALYSIS" color={C.amber}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(2rem,4vw,3.2rem)",color:C.text,margin:0,letterSpacing:-1}}>
            The <span style={{color:C.amber}}>₹500 Crore</span> Opportunity
          </h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18,marginBottom:44}}>
          {[
            {label:"Projected State Savings by 2030",target:500,prefix:"₹",suffix:" Cr",color:C.amber},
            {label:"Annual CO₂ Reduction",           target:500,prefix:"", suffix:"T / yr",color:C.green},
            {label:"Data Centers Enabled",           target:50, prefix:"", suffix:"+",    color:C.cyan},
          ].map(c=>(
            <div key={c.label} style={{background:C.card,border:`1px solid ${c.color}20`,borderRadius:14,
              padding:"26px 22px",textAlign:"center",animation:vis?"countUp .5s ease both":"none"}}>
              <div style={{color:c.color,fontFamily:"'Space Mono',monospace",fontSize:"clamp(1.7rem,3vw,2.6rem)",fontWeight:700}}>
                {vis&&<AnimatedCounter target={c.target} prefix={c.prefix} suffix={c.suffix} duration={2400}/>}
              </div>
              <div style={{color:C.muted,fontSize:12,marginTop:8,letterSpacing:.5}}>{c.label}</div>
            </div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:22,marginBottom:44}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24}}>
            <div style={{color:C.muted,fontSize:11,letterSpacing:2,marginBottom:16}}>ENERGY COST TRAJECTORY (₹ Crore)</div>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="gs1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.red} stopOpacity={.35}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gg1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.cyan} stopOpacity={.3}/><stop offset="95%" stopColor={C.cyan} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={`${C.border}88`}/>
                <XAxis dataKey="year" tick={{fill:C.muted,fontSize:10}}/>
                <YAxis tick={{fill:C.muted,fontSize:10}}/>
                <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}}
                  labelStyle={{color:C.cyan}}/>
                <Area type="monotone" dataKey="standard" stroke={C.red} fill="url(#gs1)" strokeWidth={2} name="Standard Ops"/>
                <Area type="monotone" dataKey="greencore" stroke={C.cyan} fill="url(#gg1)" strokeWidth={2} name="GreenCore AI"/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:20,marginTop:10}}>
              {[{c:C.red,l:"Standard Operations"},{c:C.cyan,l:"GreenCore AI"}].map(x=>(
                <div key={x.l} style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:14,height:3,background:x.c,borderRadius:2}}/>
                  <span style={{color:C.muted,fontSize:11}}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:24,display:"flex",flexDirection:"column"}}>
            <div style={{color:C.muted,fontSize:11,letterSpacing:2,marginBottom:6}}>CO₂ OFFSET VISUALIZATION</div>
            <p style={{color:C.dim,fontSize:11,margin:"0 0 14px"}}>{co2}T CO₂ ≈ {trees*8} trees planted</p>
            <div style={{flex:1,background:"#0a1f10",borderRadius:10,border:`1px solid ${C.green}1a`,
              padding:"14px 10px",display:"flex",alignItems:"flex-end",flexWrap:"wrap",gap:1,minHeight:145,overflow:"hidden"}}>
              {vis&&Array.from({length:trees}).map((_,i)=>(
                <Tree key={i} delay={i*.04} h={14+(i%5)*4} color={tc[i%tc.length]}/>
              ))}
            </div>
            <div style={{marginTop:10,color:C.green,fontSize:11,textAlign:"center"}}>
              {vis&&<AnimatedCounter target={co2} suffix="T CO₂ Offset" duration={1800}/>}
            </div>
          </div>
        </div>
        {/* Calculator */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:32,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,right:0,bottom:0,width:3,background:`linear-gradient(to bottom,${C.cyan},transparent)`}}/>
          <div style={{color:C.cyan,fontSize:11,letterSpacing:3,marginBottom:22}}>STATE-WIDE SCALABILITY CALCULATOR</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:32,alignItems:"center"}}>
            <LabeledSlider label="Number of Data Centers" min={1} max={100}
              value={dc} onChange={setDc} color={C.indigo} unit=" DCs" thumbClass="indigo-thumb"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {label:"Total ₹ Savings",  value:`₹${savings} Cr`,               color:C.amber},
                {label:"CO₂ Reduction",    value:`${co2}T/yr`,                   color:C.green},
                {label:"PUE Improvement",  value:(0.65*Math.min(dc/20,1)).toFixed(2),color:C.cyan},
                {label:"Jobs Created",     value:(dc*4800).toLocaleString("en-IN"),color:C.indigo},
              ].map(s=>(
                <div key={s.label} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                  <div style={{color:C.muted,fontSize:9,letterSpacing:1.5,marginBottom:5}}>{s.label}</div>
                  <div style={{color:s.color,fontSize:"1.05rem",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ PAGE 5: NIGHT MODE — MISSION CONTROL ══ */
function EnergyRing({night,emerg}) {
  const pct = emerg ? 95 : night ? 28 : 72;
  const color = emerg ? C.red : night ? C.green : C.cyan;
  const r = 70, cx = 90, cy = 90;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={180} height={180} style={{display:"block",margin:"0 auto"}}>
      <defs>
        <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity=".15"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Glow backdrop */}
      <circle cx={cx} cy={cy} r={r+8} fill="url(#ringGlow)"/>
      {/* Track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth={8} opacity={.5}/>
      {/* Progress arc */}
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth={8} strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        style={{transition:"stroke-dasharray 1.2s ease, stroke 0.6s ease",
          filter:`drop-shadow(0 0 8px ${color})`}}
      />
      {/* Inner ring */}
      <circle cx={cx} cy={cy} r={r-18} fill="none" stroke={`${color}22`} strokeWidth={1}/>
      {/* Center value */}
      <text x={cx} y={cy-8} textAnchor="middle" fontSize={28} fontWeight="700"
        fill={color} fontFamily="'Space Mono',monospace"
        style={{filter:`drop-shadow(0 0 6px ${color})`}}>{pct}%</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize={9} fill={C.muted}
        fontFamily="'Space Mono',monospace" letterSpacing="2">POWER DRAW</text>
      <text x={cx} y={cy+28} textAnchor="middle" fontSize={9} fill={color}
        fontFamily="'Space Mono',monospace" letterSpacing="1">
        {emerg?"CRITICAL":night?"ECO MODE":"PEAK"}
      </text>
    </svg>
  );
}

function AIFeed({night, emerg}) {
  const [lines, setLines] = useState([]);
  const feedRef = useRef(null);

  const nightLines = [
    {t:300,  msg:"[00:00] Scanning non-critical workload queue...", color:C.muted},
    {t:900,  msg:"[00:00] Deferring 47 batch jobs → 03:00 window", color:C.cyan},
    {t:1600, msg:"[00:01] Thermal sensors nominal. Reducing fan RPM 40%", color:C.green},
    {t:2400, msg:"[01:30] Switching cooling pumps to eco profile", color:C.cyan},
    {t:3200, msg:"[01:30] Power draw: 3.8 MW → 1.2 MW  ✓", color:C.green},
    {t:4100, msg:"[03:00] DB backup jobs executing in low-cost slot", color:C.muted},
    {t:5000, msg:"[04:45] Model retraining queued for 05:00 start", color:C.cyan},
    {t:5800, msg:"[05:59] Night window closing. Resuming peak config.", color:C.amber},
    {t:6500, msg:"► Total saved: ₹2,800  |  PUE delta: −0.43", color:C.green},
  ];
  const emergLines = [
    {t:0,   msg:"[ALERT] Thermal threshold exceeded on RACK-02!", color:C.red},
    {t:400, msg:"[ALERT] Core temp 94°C — initiating emergency protocol", color:C.red},
    {t:900, msg:"[AI]   Throttling RACK-02 to 20% capacity", color:C.amber},
    {t:1400,msg:"[AI]   Redistributing load → RACK-05, RACK-07", color:C.amber},
    {t:2000,msg:"[AI]   Spinning up emergency cooling vent #3", color:C.cyan},
    {t:2800,msg:"[SYS]  Core temp falling: 94° → 71° → 58°", color:C.cyan},
    {t:3600,msg:"[SYS]  Thermal failure averted. System stable. ✓", color:C.green},
  ];

  useEffect(()=>{
    setLines([]);
    if(!night&&!emerg) return;
    const src = emerg ? emergLines : nightLines;
    const timers = src.map(l => setTimeout(()=>{
      setLines(prev=>[...prev, l]);
      if(feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }, l.t));
    return ()=> timers.forEach(clearTimeout);
  },[night, emerg]);

  return (
    <div ref={feedRef} style={{
      fontFamily:"'Space Mono',monospace", fontSize:11, lineHeight:1.8,
      height:220, overflowY:"auto", padding:"12px 14px",
      background:"#040810", borderRadius:10,
      border:`1px solid ${emerg?C.red+"44":night?C.cyan+"22":C.border}`,
      scrollbarWidth:"thin",
    }}>
      {lines.length===0 && (
        <span style={{color:C.dim}}>{">"} Awaiting activation...<span style={{animation:"blink 1s step-end infinite",color:C.cyan}}>█</span></span>
      )}
      {lines.map((l,i)=>(
        <div key={i} style={{color:l.color, animation:"fadeSlide .2s ease both"}}>
          {l.msg}
        </div>
      ))}
      {(night||emerg) && lines.length > 0 && (
        <span style={{color:C.cyan,animation:"blink 1s step-end infinite"}}>█</span>
      )}
    </div>
  );
}

function NightModeSection() {
  const [night,setNight]=useState(false);
  const [emerg,setEmerg]=useState(false);
  const [flash,setFlash]=useState(false);
  const [stable,setStable]=useState(false);
  const [emergKey,setEmergKey]=useState(0);

  const handleEmergency=()=>{
    setEmerg(true); setFlash(true); setStable(false);
    setEmergKey(k=>k+1);
    setTimeout(()=>setFlash(false),1600);
    setTimeout(()=>setStable(true),3800);
    setTimeout(()=>setEmerg(false),7000);
  };

  const savings = [
    {label:"Batch Jobs Deferred",  cost:"₹840",  energy:"1.2 MWh", pct:30, color:C.cyan},
    {label:"Cooling Optimisation", cost:"₹620",  energy:"0.9 MWh", pct:22, color:C.green},
    {label:"DB Backup Window",     cost:"₹490",  energy:"0.7 MWh", pct:17, color:C.indigo},
    {label:"Model Retraining",     cost:"₹850",  energy:"1.4 MWh", pct:31, color:C.amber},
  ];

  return(
    <section style={{
      padding:"100px 24px",
      background: flash ? undefined : night ? "#040d14" : C.bg,
      animation: flash ? "redFlash 1.6s ease" : "none",
      transition:"background 1s", position:"relative", overflow:"hidden",
    }}>
      {night && <ParticleCanvas color={C.cyan} count={25} speed={.1}/>}
      <div className="scan-line"/>

      <div style={{maxWidth:1100,margin:"0 auto",position:"relative",zIndex:2}}>
        {/* Header */}
        <div style={{textAlign:"center",marginBottom:48}}>
          <Badge text="NIGHT MODE AUTOMATION" color={C.cyan}/>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,
            fontSize:"clamp(2rem,4vw,3.2rem)",color:C.text,margin:0,letterSpacing:-1}}>
            AI <span className="glow-cyan" style={{color:C.cyan}}>Mission Control</span>
          </h2>
          <p style={{color:C.muted,marginTop:10,fontSize:13}}>
            Autonomous off-peak optimisation · 12 AM – 6 AM smart window
          </p>
        </div>

        {/* Controls row */}
        <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:40,flexWrap:"wrap"}}>
          <button className={`btn-toggle ${night?"on":"off-state"}`}
            onClick={()=>setNight(v=>!v)} style={{fontSize:13,padding:"11px 24px"}}>
            {night?<Moon size={15}/>:<Sun size={15}/>}
            Night Mode: {night?"ACTIVE":"OFF"}
            <div style={{width:36,height:20,borderRadius:10,
              background:night?`${C.green}55`:C.border,position:"relative",transition:"background .3s"}}>
              <div style={{width:14,height:14,borderRadius:"50%",background:night?C.green:C.dim,
                position:"absolute",top:3,left:night?19:3,transition:"left .3s,background .3s"}}/>
            </div>
          </button>
          <button className="btn-danger" onClick={handleEmergency} style={{padding:"11px 24px"}}>
            <AlertTriangle size={15}/>
            {emerg?(stable?"✓ SYSTEMS STABLE":"⚡ AI RESPONDING..."):"SIMULATE EMERGENCY"}
          </button>
        </div>

        {/* Main 3-column grid */}
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr 1fr",gap:20,alignItems:"start"}}>

          {/* Col 1 — Energy Ring */}
          <div style={{background:C.card,border:`1px solid ${emerg?C.red+"44":night?C.cyan+"33":C.border}`,
            borderRadius:16,padding:"24px 16px",textAlign:"center",transition:"border-color .6s"}}>
            <div style={{color:C.muted,fontSize:10,letterSpacing:2,marginBottom:18}}>FACILITY POWER</div>
            <EnergyRing night={night} emerg={emerg}/>
            <div style={{marginTop:18,display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"PUE",    val:night?"1.38":"1.91", color:night?C.green:C.amber},
                {label:"MW Used",val:night?"1.2":"3.8",   color:night?C.cyan:C.red},
              ].map(s=>(
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",
                  background:C.bg,borderRadius:8,padding:"7px 12px",
                  border:`1px solid ${C.border}`}}>
                  <span style={{color:C.muted,fontSize:10,letterSpacing:1}}>{s.label}</span>
                  <span style={{color:s.color,fontSize:12,fontFamily:"'Space Mono',monospace",fontWeight:700,
                    transition:"color .6s"}}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 — AI Terminal Feed */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <div style={{width:8,height:8,borderRadius:"50%",
                background:night||emerg?C.green:C.dim,
                boxShadow:night||emerg?`0 0 8px ${C.green}`:"none",
                animation:night||emerg?"ping-dot 1.5s ease infinite":"none"}}/>
              <span style={{color:C.muted,fontSize:10,letterSpacing:2}}>AI DECISION LOG</span>
              <span style={{marginLeft:"auto",color:emerg?C.red:night?C.green:C.dim,
                fontSize:10,letterSpacing:1}}>{emerg?"EMERGENCY":night?"ACTIVE":"STANDBY"}</span>
            </div>
            <AIFeed key={`feed-${night}-${emergKey}`} night={night} emerg={emerg}/>
            <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[
                {label:"Jobs Deferred", val:night?"47":"0",   color:C.cyan},
                {label:"Alerts Resolved",val:emerg&&stable?"1":"0",color:emerg&&stable?C.green:C.dim},
              ].map(s=>(
                <div key={s.label} style={{background:C.bg,borderRadius:8,padding:"9px 12px",
                  border:`1px solid ${C.border}`}}>
                  <div style={{color:C.muted,fontSize:9,letterSpacing:1.5,marginBottom:4}}>{s.label}</div>
                  <div style={{color:s.color,fontSize:"1.2rem",fontFamily:"'Space Mono',monospace",fontWeight:700}}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3 — Savings Breakdown */}
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
            <div style={{color:C.muted,fontSize:10,letterSpacing:2,marginBottom:14}}>NIGHTLY SAVINGS BREAKDOWN</div>

            {/* Column headers */}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,
              paddingBottom:8,borderBottom:`1px solid ${C.border}`}}>
              <span style={{color:C.dim,fontSize:9,letterSpacing:2}}>TASK</span>
              <div style={{display:"flex",gap:28}}>
                <span style={{color:C.amber,fontSize:9,letterSpacing:2}}>COST SAVED</span>
                <span style={{color:C.cyan,fontSize:9,letterSpacing:2}}>ENERGY SAVED</span>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
              {savings.map((s,i)=>(
                <div key={i}>
                  {/* Label + two values */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <span style={{color:C.muted,fontSize:11}}>{s.label}</span>
                    <div style={{display:"flex",gap:16,alignItems:"center"}}>
                      <span style={{color:C.amber,fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700}}>
                        {s.cost}
                      </span>
                      <span style={{
                        color:C.cyan,fontFamily:"'Space Mono',monospace",fontSize:11,fontWeight:700,
                        background:`${C.cyan}10`,border:`1px solid ${C.cyan}33`,
                        borderRadius:4,padding:"1px 7px",
                      }}>
                        {s.energy}
                      </span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{height:5,background:C.border,borderRadius:3,overflow:"hidden"}}>
                    <div style={{
                      height:"100%",borderRadius:3,
                      width:night?`${s.pct*3.2}%`:"0%",
                      background:`linear-gradient(90deg,${s.color}77,${s.color})`,
                      transition:`width 1.2s ease ${i*.15}s`,
                      boxShadow:`0 0 6px ${s.color}55`,
                    }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals row */}
            <div style={{
              background:`linear-gradient(135deg,${C.green}10,${C.cyan}07)`,
              border:`1px solid ${night?C.green+"44":C.border}`,
              borderRadius:12,padding:"14px 16px",
              transition:"border-color .6s",
            }}>
              <div style={{color:C.muted,fontSize:9,letterSpacing:2,marginBottom:10}}>TOTAL SAVED TONIGHT</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                <div>
                  <div style={{color:C.dim,fontSize:9,letterSpacing:1,marginBottom:3}}>COST</div>
                  <div style={{
                    fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:"1.8rem",
                    color:night?C.amber:C.dim,
                    textShadow:night?`0 0 16px ${C.amber}88`:"none",
                    transition:"color .6s,text-shadow .6s",
                  }}>₹2,800</div>
                </div>
                <div style={{width:1,height:40,background:C.border,margin:"0 16px"}}/>
                <div>
                  <div style={{color:C.dim,fontSize:9,letterSpacing:1,marginBottom:3}}>ENERGY</div>
                  <div style={{
                    fontFamily:"'Space Mono',monospace",fontWeight:700,fontSize:"1.8rem",
                    color:night?C.cyan:C.dim,
                    textShadow:night?`0 0 16px ${C.cyan}88`:"none",
                    transition:"color .6s,text-shadow .6s",
                  }}>4.2 MWh</div>
                </div>
                <div style={{
                  marginLeft:"auto",textAlign:"right",
                  color:night?C.green:C.dim,fontSize:10,
                  transition:"color .6s",
                }}>
                  {night?"← Live":"Activate\nNight Mode"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══ FOOTER ══ */
function Footer() {
  const [glitch,setGlitch]=useState(false);
  return(
    <footer style={{padding:"80px 24px 40px",background:"#050810",borderTop:`1px solid ${C.border}`,position:"relative",overflow:"hidden"}}>
      <ParticleCanvas color={C.indigo} count={20} speed={.11}/>
      <div style={{maxWidth:860,margin:"0 auto",position:"relative",zIndex:2,textAlign:"center"}}>
        <div className="glow-cyan" style={{fontFamily:"'Space Mono',monospace",fontSize:"1.3rem",color:C.cyan,letterSpacing:3,marginBottom:10}}>
          GREEN<span style={{color:C.green}}>CORE</span> AI
        </div>
        <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:"clamp(1.4rem,2.5vw,2rem)",color:C.text,margin:"0 0 12px"}}>
          Built for the Swarna Andhra Vision 2047
        </h3>
        <p style={{color:C.muted,fontSize:12,marginBottom:34}}>
          by Team <span style={{color:C.green}}>EcoByte</span> — Powering Tomorrow's Green Grid Today
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:34}}>
          {["#SwarnaAndhra2047","#GreenDataCenters","#NetZeroAP","#AIforSustainability","#EcoByte"].map(t=>(
            <div key={t} style={{background:`${C.cyan}09`,border:`1px solid ${C.cyan}2a`,borderRadius:20,padding:"4px 14px",color:C.muted,fontSize:11}}>{t}</div>
          ))}
        </div>
        <div style={{marginTop:54,paddingTop:20,borderTop:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <span style={{color:C.dim,fontSize:11}}>© 2026 GreenCore AI — Team EcoByte</span>
          <span style={{color:C.dim,fontSize:11}}>Swarna Andhra Pradesh 2047 Initiative</span>
        </div>
      </div>
    </footer>
  );
}

/* ══ QUICK-LINK NAVBAR (top) ══ */
function QuickLinks() {
  const [active,setActive]=useState("hero");
  const [sc,setSc]=useState(false);
  const links=[
    {id:"hero",    label:"Vision",    color:C.green},
    {id:"strategy",label:"Strategy",  color:C.cyan},
    {id:"twin",    label:"Dashboard", color:C.indigo},
    {id:"impact",  label:"Impact",    color:C.amber},
    {id:"night",   label:"Automation",color:"#f472b6"},
  ];
  useEffect(()=>{
    const onScroll=()=>setSc(window.scrollY>50);
    window.addEventListener("scroll",onScroll);
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);});
    },{threshold:0.4});
    links.forEach(l=>{const el=document.getElementById(l.id);if(el)obs.observe(el);});
    return()=>{window.removeEventListener("scroll",onScroll);obs.disconnect();};
  },[]);
  return(
    <nav style={{
      position:"fixed",top:0,left:0,right:0,zIndex:999,
      padding:"10px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",
      background:sc?`${C.card}f2`:"transparent",
      borderBottom:sc?`1px solid ${C.border}`:"none",
      backdropFilter:sc?"blur(18px)":"none",transition:"all .3s",
    }}>
      {/* Logo */}
      <div style={{fontFamily:"'Space Mono',monospace",color:C.cyan,fontSize:12,fontWeight:700,letterSpacing:2,flexShrink:0}}>
        GREEN<span style={{color:C.green}}>CORE</span> AI
      </div>

      {/* Quick-link chips */}
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        {links.map(lk=>{
          const isActive=active===lk.id;
          return(
            <a key={lk.id} href={`#${lk.id}`} style={{textDecoration:"none"}}>
              <div style={{
                display:"flex",alignItems:"center",gap:6,
                padding:"5px 13px", borderRadius:20,
                border:`1px solid ${isActive?lk.color+"99":C.border}`,
                background:isActive?`${lk.color}14`:"transparent",
                transition:"all .22s ease",cursor:"pointer",
                boxShadow:isActive?`0 0 12px ${lk.color}33`:"none",
              }}
                onMouseEnter={e=>{
                  e.currentTarget.style.background=`${lk.color}14`;
                  e.currentTarget.style.borderColor=`${lk.color}88`;
                }}
                onMouseLeave={e=>{
                  e.currentTarget.style.background=isActive?`${lk.color}14`:"transparent";
                  e.currentTarget.style.borderColor=isActive?`${lk.color}99`:C.border;
                }}
              >
                {/* Active indicator dot */}
                <div style={{
                  width:5,height:5,borderRadius:"50%",flexShrink:0,
                  background:isActive?lk.color:C.dim,
                  boxShadow:isActive?`0 0 6px ${lk.color}`:"none",
                  transition:"all .22s ease",
                }}/>
                <span style={{
                  fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:1.5,
                  color:isActive?lk.color:C.muted,fontWeight:isActive?700:400,
                  transition:"color .22s ease",
                }}>{lk.label}</span>
              </div>
            </a>
          );
        })}
      </div>

      {/* Live ping */}
      <div style={{display:"flex",alignItems:"center",gap:7,flexShrink:0}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:C.green,boxShadow:`0 0 8px ${C.green}`,animation:"ping-dot 2s ease infinite"}}/>
        <span style={{color:C.muted,fontSize:10,letterSpacing:1}}>LIVE</span>
      </div>
    </nav>
  );
}

/* ══ ROOT ══ */
export default function App() {
  useEffect(()=>{
    const s=document.createElement("style");s.textContent=GLOBAL_STYLES;document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);
  return(
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <QuickLinks/>
      <div id="hero"><HeroSection/></div>
      <div id="strategy"><StrategyHub/></div>
      <div id="twin"><DigitalTwin/></div>
      <div id="impact"><EconomicImpact/></div>
      <div id="night"><NightModeSection/></div>
      <Footer/>
    </div>
  );
}
