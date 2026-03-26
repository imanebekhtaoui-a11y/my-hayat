import { useState, useEffect, useRef } from "react";



// ═══════════════════════════════════════════════════════
// PALETTE & STYLES GLOBAUX
// ═══════════════════════════════════════════════════════
const P = {
  bg:"#F7F3EF",card:"#FFFFFF",beige:"#EDE8E2",beigeDeep:"#DDD5CB",
  taupe:"#B5A49A",brown:"#7D6258",darkBrown:"#4A3228",gold:"#C9A96E",
  goldLight:"#F0DFB8",text:"#3D2B1F",textLight:"#A09088",soft:"#FAF8F5",
};

// ── SHARED STYLE HELPERS (used by all sections) ──────────
const card  = (x={}) => ({background:P.card,borderRadius:16,padding:16,border:`1px solid ${P.beige}`,marginBottom:14,...x});
const inp   = {width:"100%",border:`1px solid ${P.beige}`,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:P.text,background:P.soft,outline:"none",boxSizing:"border-box"};
const btn   = (bg=P.darkBrown,fg="#fff",x={}) => ({background:bg,color:fg,border:"none",borderRadius:12,padding:"11px 18px",fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600,transition:"all 0.2s",...x});
const icBtn = (x={}) => ({width:30,height:30,borderRadius:8,border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.taupe,flexShrink:0,...x});
const h2    = {fontSize:15,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif",marginBottom:10};
const h3    = {fontSize:10,fontWeight:700,color:P.textLight,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"};
const Svg   = ({children,size=22}) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size}>{children}</svg>;
const Ico = {
  back:    ()=><Svg size={16}><polyline points="15 18 9 12 15 6"/></Svg>,
  check:   ()=><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>,
  trash:   ()=><Svg size={15}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></Svg>,
  plus:    ()=><Svg size={18}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>,
  lock:    ()=><Svg size={15}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>,
  unlock:  ()=><Svg size={15}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></Svg>,
  refresh: ()=><Svg size={15}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></Svg>,
  star:    ()=><Svg size={14}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>,
  heart:   ()=><Svg><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>,
  home:    ()=><Svg><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>,
  baby:    ()=><Svg><circle cx="12" cy="8" r="4"/><path d="M8 14s-4 1-4 5h16c0-4-4-5-4-5"/></Svg>,
  clock:   ()=><Svg size={15}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>,
  fork:    ()=><Svg><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6h3.5a2.5 2.5 0 0 1 0 5H16v2"/></Svg>,
  link:    ()=><Svg size={14}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></Svg>,
  close:   ()=><Svg size={16}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>,
  run:     ()=><Svg><circle cx="12" cy="4" r="2"/><path d="M15 8l-3 3-2-3-4 5"/><path d="M9 19l2-5"/><path d="M15 19l-2-5"/></Svg>,
  moon:    ()=><Svg><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></Svg>,
  sun:     ()=><Svg size={18}><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></Svg>,
  drop:    ()=><Svg size={18}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></Svg>,
  book:    ()=><Svg><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Svg>,
  medic:   ()=><Svg><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></Svg>,
};

const S={
  card:(x={})=>({background:P.card,borderRadius:16,padding:16,border:`1px solid ${P.beige}`,marginBottom:14,...x}),
  inp:{width:"100%",border:`1px solid ${P.beige}`,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:P.text,background:P.soft,outline:"none",boxSizing:"border-box"},
  btn:(bg=P.darkBrown,fg="#fff",x={})=>({background:bg,color:fg,border:"none",borderRadius:12,padding:"11px 18px",fontSize:13,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600,transition:"all 0.2s",...x}),
  icb:(x={})=>({width:30,height:30,borderRadius:8,border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.taupe,flexShrink:0,...x}),
  h2:{fontSize:15,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif",marginBottom:10},
  h3:{fontSize:10,fontWeight:700,color:P.textLight,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"},
};

// ═══════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════
const SvgRaw=({ch,size=22})=>(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} dangerouslySetInnerHTML={{__html:ch}}/>);

const ICONS = {
  back:    `<polyline points="15 18 9 12 15 6"/>`,
  check:   null,
  trash:   `<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>`,
  plus:    `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  lock:    `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  unlock:  `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>`,
  refresh: `<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>`,
  sun:     `<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>`,
  moon:    `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
  heart:   `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  home2:   `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
  chart:   `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
  msg:     `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
  user:    `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
  star:    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  rocket:  `<path d="M12 2s-5 4-5 11l5 3 5-3c0-7-5-11-5-11z"/><path d="M7 13c-2 1-3 3-3 5h4"/><path d="M17 13c2 1 3 3 3 5h-4"/><circle cx="12" cy="10" r="2"/>`,
  fork:    `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6h3.5a2.5 2.5 0 0 1 0 5H16v2"/>`,
  spray:   `<path d="M5 3h6v6H5z"/><path d="M11 5h3l2 3v7h-5V8"/><line x1="14" y1="2" x2="14" y2="5"/><line x1="17" y1="8" x2="20" y2="6"/>`,
  chat2:   `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/>`,
};
// Ico defined in shared helpers

// ═══════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════
let NID=1000;
const fmtDate=d=>`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;

function EC({items,setItems,placeholder="Ajouter...",emptyMsg="Vide ✨"}){
  const [editing,setEditing]=useState(false);
  const [newText,setNewText]=useState("");
  const [checks,setChecks]=useState({});
  const toggle    =id=>setChecks(p=>({...p,[id]:!p[id]}));
  const toggleLock=id=>setItems(p=>p.map(i=>i.id===id?{...i,locked:!i.locked}:i));
  const del       =id=>setItems(p=>p.filter(i=>i.id!==id));
  const add       =()=>{if(newText.trim()){setItems(p=>[...p,{id:NID++,text:newText,locked:false}]);setNewText("");}};
  const reset     =()=>setChecks({});
  const sorted=[...items.filter(i=>i.locked),...items.filter(i=>!i.locked)];
  const done=sorted.filter(i=>checks[i.id]).length;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{done}/{sorted.length} {done===sorted.length&&sorted.length>0?"🎉":""}</span>
        <div style={{display:"flex",gap:5}}>
          <button onClick={reset} style={S.btn(P.beige,P.darkBrown,{padding:"5px 9px",fontSize:10})}><Ico.refresh size={12}/> Reset</button>
          <button onClick={()=>setEditing(!editing)} style={S.btn(editing?P.darkBrown:P.beige,editing?"#fff":P.darkBrown,{padding:"5px 9px",fontSize:10})}>{editing?"✓ Ok":"✏️"}</button>
        </div>
      </div>
      <div style={S.card({padding:0,overflow:"hidden"})}>
        {sorted.length===0&&<div style={{padding:18,textAlign:"center",color:P.textLight,fontSize:13,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>{emptyMsg}</div>}
        {sorted.map((item,i)=>(
          <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderBottom:i<sorted.length-1?`1px solid ${P.beige}`:"none",background:item.locked?`${P.goldLight}20`:"transparent"}}>
            <div onClick={()=>!editing&&toggle(item.id)} style={{width:22,height:22,borderRadius:7,border:`1.5px solid ${checks[item.id]?P.gold:P.beigeDeep}`,background:checks[item.id]?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:editing?"default":"pointer",transition:"all 0.2s"}}>
              {checks[item.id]&&<Ico.check/>}
            </div>
            {item.locked&&!editing&&<span style={{color:P.gold,flexShrink:0}}><Ico.lock size={14}/></span>}
            <span style={{flex:1,fontSize:13,color:checks[item.id]?P.textLight:P.text,textDecoration:checks[item.id]?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{item.text}</span>
            {editing&&<div style={{display:"flex",gap:5}}>
              <div style={S.icb({color:item.locked?P.gold:P.taupe,background:item.locked?P.goldLight:P.soft})} onClick={()=>toggleLock(item.id)}>{item.locked?<Ico.lock size={14}/>:<Ico.unlock size={14}/>}</div>
              {!item.locked&&<div style={S.icb({color:"#E07B6A"})} onClick={()=>del(item.id)}><Ico.trash size={14}/></div>}
            </div>}
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <input style={{...S.inp,flex:1}} placeholder={placeholder} value={newText} onChange={e=>setNewText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
        <button style={S.btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={add}><Ico.plus size={16}/></button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PAGE HEADER
// ═══════════════════════════════════════════════════════
function PageHeader({title,sub,icon,onBack,tabs,activeTab,setTab}){
  return(
    <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:tabs?14:0,paddingBottom:tabs?0:16}}>
        {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><Ico.back size={15}/></div>}
        <div style={{color:P.gold}}>{icon}</div>
        <div><div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{title}</div>{sub&&<div style={{fontSize:12,color:P.textLight,marginTop:1}}>{sub}</div>}</div>
      </div>
      {tabs&&<div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
        {tabs.map(t=>(
          <div key={t.id} onClick={()=>setTab(t.id)} style={{flex:"0 0 auto",padding:"10px 13px 9px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",color:activeTab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${activeTab===t.id?P.gold:"transparent"}`,fontWeight:activeTab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.label}</div>
        ))}
      </div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SECTION: DAILY PLANNER
// ═══════════════════════════════════════════════════════
const today=new Date();
const JOURS=["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const MOIS=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const heure=today.getHours();
const SALUT=heure<12?"Bonjour":heure<18?"Bon après-midi":"Bonsoir";
const MOTS=[
  {ar:"صَبْر",fr:"Sabr",def:"La patience active. Tenir sans se briser."},
  {ar:"بَرَكَة",fr:"Barakah",def:"La bénédiction dans le peu."},
  {ar:"نِيَّة",fr:"Niyyah",def:"L'intention. Tout commence là."},
  {ar:"تَوَكُّل",fr:"Tawakkul",def:"Faire sa part, puis lâcher prise."},
  {ar:"رَحْمَة",fr:"Rahma",def:"La miséricorde. Envers les autres, envers soi."},
  {ar:"شُكْر",fr:"Shukr",def:"La gratitude. Reconnaître les bienfaits."},
];
const HUMEURS_D=[
  {label:"Fatiguée",ico:"😮‍💨",msg:"Mode douceur. Une tâche suffit. 🤍",color:"#F5EEEE"},
  {label:"Calme",ico:"😌",msg:"Belle énergie calme. À ton rythme. 🌿",color:"#EEF5EE"},
  {label:"Motivée",ico:"🔥",msg:"C'est ton moment. Lance-toi ! 🚀",color:"#FDF3E8"},
  {label:"Stressée",ico:"😤",msg:"Respire. Une chose à la fois. 💛",color:"#F5F5EE"},
  {label:"Au top",ico:"✨",msg:"Journée en or. Profites-en ! ⭐",color:"#EEF5E8"},
];
const CAT_COLORS={"🏠 Maison":"#F5F2EE","🌸 Moi":"#FDF0F5","👧 Enfants":"#F0F8F0","💼 Travail":"#EEF2FA","🕌 Deen":"#F5F0FA"};

function SectionDaily({onBack, priorities, setPriorities}){
  const [tab,setTab]=useState("aujourd_hui");
  const TABS=[{id:"aujourd_hui",label:"✨ Aujourd'hui"},{id:"agenda",label:"📅 Agenda"},{id:"taches",label:"✅ Tâches"},{id:"habits",label:"🔥 Habitudes"},{id:"shukr",label:"شُكْر Shukr"}];

  // Aujourd'hui state
  const [intention,setIntention]=useState("");
  const [humeur,setHumeur]=useState(null);
  // priorities & setPriorities come from props (shared with HomeScreen via MyHayat)
  const [todos,setTodos]=useState([]);
  const motJour=MOTS[today.getDate()%MOTS.length];

  // Rocket
  const [phase,setPhase]=useState("idle");
  const [count,setCount]=useState(5);
  const [task,setTask]=useState("");
  const [timer,setTimer]=useState(300);
  const [running,setRunning]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(phase==="countdown"&&count>0){const t=setTimeout(()=>setCount(c=>c-1),1000);return()=>clearTimeout(t);}if(phase==="countdown"&&count===0)setTimeout(()=>setPhase("go"),600);},[phase,count]);
  useEffect(()=>{if(running&&timer>0){ref.current=setTimeout(()=>setTimer(t=>t-1),1000);}else if(timer===0)setRunning(false);return()=>clearTimeout(ref.current);},[running,timer]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

  // Habits
  const [habits,setHabits]=useState([
    {id:1,label:"Hydratation 💧",locked:true,days:Array(7).fill(false)},
    {id:2,label:"Mouvement 🚶‍♀️",locked:true,days:Array(7).fill(false)},
    {id:3,label:"Lecture 📖",locked:false,days:Array(7).fill(false)},
    {id:4,label:"Gratitude 🤍",locked:false,days:Array(7).fill(false)},
    {id:5,label:"Prière 🤲",locked:true,days:Array(7).fill(false)},
  ]);
  const [editH,setEditH]=useState(false);
  const [newHabit,setNewHabit]=useState("");
  const toggleH=(id,di)=>setHabits(p=>p.map(h=>h.id===id?{...h,days:h.days.map((d,j)=>j===di?!d:d)}:h));
  const toggleLockH=id=>setHabits(p=>p.map(h=>h.id===id?{...h,locked:!h.locked}:h));
  const delH=id=>setHabits(p=>p.filter(h=>h.id!==id));
  const addH=()=>{if(newHabit.trim()){setHabits(p=>[...p,{id:NID++,label:newHabit,locked:false,days:Array(7).fill(false)}]);setNewHabit("");}};
  const DAYS7=["L","M","M","J","V","S","D"];
  const sortedH=[...habits.filter(h=>h.locked),...habits.filter(h=>!h.locked)];

  // Shukr
  const [gratitude,setGratitude]=useState(["","",""]);
  const [victoire,setVictoire]=useState("");
  const [moodSoir,setMoodSoir]=useState(null);
  const [journalSoir,setJournalSoir]=useState("");

  // Todos
  const [newTodo,setNewTodo]=useState("");
  const [newCat,setNewCat]=useState("🌸 Moi");
  const [newWhen,setNewWhen]=useState("today");
  const tm=new Date(today);tm.setDate(today.getDate()+1);
  function sDay(a,b){const da=new Date(a);da.setHours(0,0,0,0);const db=new Date(b);db.setHours(0,0,0,0);return da.getTime()===db.getTime();}
  const addTodo=()=>{if(newTodo.trim()&&todos.length<5){setTodos(p=>[...p,{id:NID++,text:newTodo,cat:newCat,done:false,date:newWhen==="today"?new Date(today):new Date(tm),locked:false}]);setNewTodo("");}};
  const toggleTodo=id=>setTodos(p=>p.map(t=>t.id===id?{...t,done:!t.done}:t));
  const todayTodos=todos.filter(t=>!t.done&&sDay(t.date,today));

  // Agenda
  const [events,setEvents]=useState([
    {id:1,title:"Pédiatre Tasnim",date:today,start:"10:00",end:"11:00",cat:"🏥 Médical"},
    {id:2,title:"Déposer Rym",date:today,start:"08:30",end:"09:00",cat:"👧 Enfants"},
  ]);
  const [agView,setAgView]=useState("semaine");
  const [showEvt,setShowEvt]=useState(false);
  const [newEvt,setNewEvt]=useState({title:"",date:today.toISOString().slice(0,10),start:"09:00",end:"10:00",cat:"🌸 Moi"});
  const CAT_EVT={"🏠 Maison":P.beige,"🌸 Moi":"#F5D5E0","👧 Enfants":"#D5EDD5","💼 Travail":"#D5E0F5","🕌 Deen":"#E8D5F5","🏥 Médical":"#FFE5D5"};
  const addEvt=()=>{if(newEvt.title.trim()){setEvents(p=>[...p,{id:NID++,...newEvt,date:new Date(newEvt.date)}]);setShowEvt(false);setNewEvt({title:"",date:today.toISOString().slice(0,10),start:"09:00",end:"10:00",cat:"🌸 Moi"});}};
  function getMonday(d){const dt=new Date(d);const day=dt.getDay();const diff=day===0?-6:1-day;dt.setDate(dt.getDate()+diff);dt.setHours(0,0,0,0);return dt;}
  function addDays(d,n){const dt=new Date(d);dt.setDate(dt.getDate()+n);return dt;}
  const [weekStart,setWeekStart]=useState(getMonday(today));
  const weekDays=Array.from({length:7},(_,i)=>addDays(weekStart,i));
  const eventsFor=d=>events.filter(e=>sDay(e.date,d)).sort((a,b)=>a.start.localeCompare(b.start));

  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,paddingBottom:24}}>
      <PageHeader title="Daily Planner" sub={`${JOURS[today.getDay()]} ${today.getDate()} ${MOIS[today.getMonth()]}`}
        icon={<svg viewBox="0 0 24 24" fill="none" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>}
        onBack={onBack} tabs={TABS} activeTab={tab} setTab={setTab}/>

      <div style={{padding:"18px 16px 0"}}>

        {/* ── AUJOURD'HUI ── */}
        {tab==="aujourd_hui"&&(
          <div>
            {/* Bonjour */}
            <div style={{...S.card({background:`linear-gradient(135deg,#FDF6EE,${P.goldLight})`,textAlign:"center",padding:"18px"})}}>
              <div style={{fontSize:20,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{SALUT}, Imane 🤍</div>
              <div style={{fontSize:12,color:P.brown,marginTop:4,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>{heure<12?"Une nouvelle page commence.":heure<18?"L'après-midi est encore là.":"Tu as fait de ton mieux."}</div>
            </div>
            {/* Mot du jour */}
            <div style={{...S.card({background:P.soft,textAlign:"center",padding:"14px"})}}>
              <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif",marginBottom:4,letterSpacing:"0.1em",textTransform:"uppercase"}}>Mot du jour</div>
              <div style={{fontSize:28,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:2}}>{motJour.ar}</div>
              <div style={{fontSize:16,fontWeight:700,color:P.gold,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{motJour.fr}</div>
              <div style={{fontSize:12,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>"{motJour.def}"</div>
            </div>
            {/* Intention */}
            <div style={S.card()}>
              <div style={S.h2}>✨ Mon intention du jour</div>
              <input style={S.inp} placeholder="Quelle est ton intention pour aujourd'hui ?" value={intention} onChange={e=>setIntention(e.target.value)}/>
            </div>
            {/* Humeur */}
            <div style={S.card()}>
              <div style={S.h2}>🌡️ Comment je me sens</div>
              <div style={{display:"flex",gap:5,marginBottom:10}}>
                {HUMEURS_D.map(h=>(
                  <div key={h.label} onClick={()=>setHumeur(humeur===h.label?null:h.label)}
                    style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"9px 3px",borderRadius:12,cursor:"pointer",border:`1.5px solid ${humeur===h.label?P.gold:"transparent"}`,background:humeur===h.label?h.color:P.soft,transition:"all 0.2s"}}>
                    <span style={{fontSize:20}}>{h.ico}</span>
                    <span style={{fontSize:9,color:humeur===h.label?P.darkBrown:P.textLight,fontWeight:humeur===h.label?600:400,textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>{h.label}</span>
                  </div>
                ))}
              </div>
              {humeur&&<div style={{padding:"10px 14px",borderRadius:10,background:HUMEURS_D.find(h=>h.label===humeur)?.color,fontSize:13,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",textAlign:"center"}}>{HUMEURS_D.find(h=>h.label===humeur)?.msg}</div>}
            </div>
            {/* 3 Priorités */}
            <div style={S.card()}>
              <div style={S.h2}>🎯 Mes 3 priorités</div>
              {priorities.map((p,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:P.darkBrown,fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <input style={{...S.inp,flex:1}} placeholder={`Priorité ${i+1}...`} value={p.text} onChange={e=>setPriorities(prev=>prev.map((x,j)=>j===i?{...x,text:e.target.value}:x))}/>
                </div>
              ))}
              <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Max 3. Tout le reste est bonus.</div>
            </div>
            {/* Fusée */}
            <div style={{...S.card({background:phase==="idle"?P.card:P.darkBrown,textAlign:"center",padding:"22px",transition:"background 0.5s"})}}>
              {phase==="idle"&&(<><div style={{fontSize:12,color:P.textLight,marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>🚀 Anti-procrastination — 5 · 4 · 3 · 2 · 1</div><input style={{...S.inp,textAlign:"center",marginBottom:12}} placeholder="Sur quoi tu travailles ?" value={task} onChange={e=>setTask(e.target.value)}/><button style={S.btn(P.darkBrown)} onClick={()=>{if(task.trim())setPhase("countdown");}}>Je me lance maintenant</button></>)}
              {phase==="countdown"&&<div style={{fontSize:80,fontWeight:900,color:"#fff",fontFamily:"'Cormorant Garamond',serif",lineHeight:1,animation:"pulse 0.8s ease infinite"}}>{count||"🚀"}</div>}
              {phase==="go"&&(<><div style={{fontSize:18,color:P.goldLight,fontFamily:"'Cormorant Garamond',serif",marginBottom:6}}>🚀 Tu es lancée ! — {task}</div><div style={{fontSize:48,fontWeight:700,color:timer<60?"#E07B6A":P.goldLight,fontFamily:"'DM Sans',sans-serif",marginBottom:12}}>{fmt(timer)}</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button style={S.btn(P.gold,P.darkBrown)} onClick={()=>setRunning(!running)}>{running?"⏸ Pause":"▶ Start"}</button><button style={S.btn("rgba(255,255,255,0.15)","#fff")} onClick={()=>{setPhase("idle");setCount(5);setTimer(300);setRunning(false);}}>Reset</button></div></>)}
            </div>
          </div>
        )}

        {/* ── AGENDA ── */}
        {tab==="agenda"&&(
          <div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <button onClick={()=>setAgView("semaine")} style={S.btn(agView==="semaine"?P.darkBrown:P.beige,agView==="semaine"?"#fff":P.darkBrown,{flex:1,padding:"8px",fontSize:12})}>Semaine</button>
              <button onClick={()=>setAgView("jour")} style={S.btn(agView==="jour"?P.darkBrown:P.beige,agView==="jour"?"#fff":P.darkBrown,{flex:1,padding:"8px",fontSize:12})}>Jour</button>
              <button onClick={()=>setShowEvt(!showEvt)} style={S.btn(P.gold,P.darkBrown,{padding:"8px 14px",fontSize:12})}>+ Ajouter</button>
            </div>
            {showEvt&&(
              <div style={S.card({border:`2px solid ${P.gold}`})}>
                <input style={{...S.inp,marginBottom:8}} placeholder="Titre" value={newEvt.title} onChange={e=>setNewEvt(p=>({...p,title:e.target.value}))} autoFocus/>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="date" style={{...S.inp,flex:1}} value={newEvt.date} onChange={e=>setNewEvt(p=>({...p,date:e.target.value}))}/>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:8}}>
                  <input type="time" style={{...S.inp,flex:1}} value={newEvt.start} onChange={e=>setNewEvt(p=>({...p,start:e.target.value}))}/>
                  <input type="time" style={{...S.inp,flex:1}} value={newEvt.end} onChange={e=>setNewEvt(p=>({...p,end:e.target.value}))}/>
                </div>
                <select style={{...S.inp,marginBottom:12,padding:"9px 10px",fontSize:12}} value={newEvt.cat} onChange={e=>setNewEvt(p=>({...p,cat:e.target.value}))}>
                  {Object.keys(CAT_EVT).map(c=><option key={c}>{c}</option>)}
                </select>
                <div style={{display:"flex",gap:8}}><button style={S.btn(P.darkBrown,"#fff",{flex:1})} onClick={addEvt}>Ajouter</button><button style={S.btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowEvt(false)}>Annuler</button></div>
              </div>
            )}
            {agView==="semaine"&&(
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <div style={S.icb()} onClick={()=>setWeekStart(addDays(weekStart,-7))}><Ico.back size={15}/></div>
                  <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{weekStart.getDate()} {MOIS[weekStart.getMonth()].slice(0,3)} — {addDays(weekStart,6).getDate()} {MOIS[addDays(weekStart,6).getMonth()].slice(0,3)}</div>
                  <div style={S.icb()} onClick={()=>setWeekStart(addDays(weekStart,7))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="9 18 15 12 9 6"/></svg></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:5,marginBottom:14}}>
                  {weekDays.map((d,i)=>{const isT=sDay(d,today);const evts=eventsFor(d);return(
                    <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"8px 4px",borderRadius:12,background:isT?P.goldLight:P.card,border:`1.5px solid ${isT?P.gold:P.beige}`,cursor:"pointer",transition:"all 0.2s"}}>
                      <div style={{fontSize:9,color:isT?P.darkBrown:P.textLight,fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase"}}>{["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"][d.getDay()]}</div>
                      <div style={{fontSize:15,fontWeight:700,color:isT?P.darkBrown:P.text,fontFamily:"'Cormorant Garamond',serif"}}>{d.getDate()}</div>
                      {evts.length>0&&<div style={{width:5,height:5,borderRadius:"50%",background:P.gold}}/>}
                    </div>
                  );})}
                </div>
                {weekDays.map((d,di)=>{const evts=eventsFor(d);if(!evts.length)return null;return(
                  <div key={di} style={S.card({padding:0,overflow:"hidden"})}>
                    <div style={{padding:"8px 14px",background:P.soft,borderBottom:`1px solid ${P.beige}`,fontSize:11,fontWeight:700,color:sDay(d,today)?P.gold:P.brown,fontFamily:"'DM Sans',sans-serif"}}>{JOURS[d.getDay()]} {d.getDate()}{sDay(d,today)&&" · Aujourd'hui"}</div>
                    {evts.map(e=>(
                      <div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",background:CAT_EVT[e.cat]||P.beige,borderBottom:`1px solid ${P.beige}`}}>
                        <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{e.title}</div><div style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{e.start} — {e.end} · {e.cat}</div></div>
                        <div style={S.icb()} onClick={()=>setEvents(p=>p.filter(x=>x.id!==e.id))}><Ico.trash size={13}/></div>
                      </div>
                    ))}
                  </div>
                );})}
              </div>
            )}
          </div>
        )}

        {/* ── TÂCHES ── */}
        {tab==="taches"&&(
          <div>
            {todos.length===0&&(
              <div style={{...S.card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"28px"})}}>
                <div style={{fontSize:28,marginBottom:8}}>✨</div>
                <div style={{fontSize:14,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",marginBottom:16}}>Ta liste est vide. Ajoute tes propres tâches.</div>
                <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>🔒 Bloque celles qui reviennent chaque jour · ↩ Report auto à minuit</div>
              </div>
            )}
            {todos.length>0&&(
              <div style={S.card({padding:"0 16px"})}>
                {todos.map((t,i)=>(
                  <div key={t.id} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0",borderBottom:i<todos.length-1?`1px solid ${P.beige}`:"none"}}>
                    <div onClick={()=>toggleTodo(t.id)} style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${t.done?P.gold:P.beigeDeep}`,background:t.done?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>{t.done&&<Ico.check/>}</div>
                    <span style={{fontSize:10,padding:"2px 7px",borderRadius:10,background:CAT_COLORS[t.cat]||P.soft,color:P.brown,flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>{t.cat}</span>
                    <span style={{flex:1,fontSize:13,color:t.done?P.textLight:P.text,textDecoration:t.done?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{t.text}</span>
                    <div style={S.icb()} onClick={()=>setTodos(p=>p.filter(x=>x.id!==t.id))}><Ico.trash size={13}/></div>
                  </div>
                ))}
              </div>
            )}
            {todos.length<5&&(
              <div style={S.card({border:`2px solid ${P.gold}`})}>
                <input style={{...S.inp,marginBottom:8}} placeholder="Que dois-tu faire ?" value={newTodo} onChange={e=>setNewTodo(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTodo()} autoFocus/>
                <div style={{display:"flex",gap:8,marginBottom:10}}>
                  <select style={{...S.inp,flex:1,padding:"9px 8px",fontSize:12}} value={newCat} onChange={e=>setNewCat(e.target.value)}>{Object.keys(CAT_COLORS).map(c=><option key={c}>{c}</option>)}</select>
                  <div style={{display:"flex",gap:6}}>
                    {[{id:"today",l:"Aujourd'hui"},{id:"tomorrow",l:"Demain"}].map(o=>(
                      <div key={o.id} onClick={()=>setNewWhen(o.id)} style={{padding:"9px 10px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${newWhen===o.id?P.gold:P.beige}`,background:newWhen===o.id?P.goldLight:P.soft,fontSize:11,fontFamily:"'DM Sans',sans-serif",color:newWhen===o.id?P.darkBrown:P.textLight,transition:"all 0.2s"}}>{o.l}</div>
                    ))}
                  </div>
                </div>
                <button style={S.btn(P.gold,P.darkBrown,{width:"100%"})} onClick={addTodo}>Ajouter</button>
              </div>
            )}
            {todos.length>=5&&<div style={{textAlign:"center",fontSize:12,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",padding:"8px"}}>5 tâches, c'est assez. Tu es sûre ? 🌿</div>}
          </div>
        )}

        {/* ── HABITS ── */}
        {tab==="habits"&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>🔥 Mes habitudes</div>
              <button onClick={()=>setEditH(!editH)} style={S.btn(editH?P.darkBrown:P.beige,editH?"#fff":P.darkBrown,{padding:"7px 13px",fontSize:11})}>{editH?"✓ Terminer":"✏️ Modifier"}</button>
            </div>
            <div style={S.card({padding:0,overflow:"hidden"})}>
              <div style={{display:"grid",gridTemplateColumns:"1fr repeat(7, 30px)",gap:3,padding:"8px 12px 6px",background:P.soft,borderBottom:`1px solid ${P.beige}`}}>
                <div/>{DAYS7.map((d,i)=><div key={i} style={{textAlign:"center",fontSize:9,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{d}</div>)}
              </div>
              {sortedH.map((h,hi)=>(
                <div key={h.id} style={{display:"grid",gridTemplateColumns:"1fr repeat(7, 30px)",gap:3,padding:"9px 12px",borderBottom:hi<sortedH.length-1?`1px solid ${P.beige}`:"none",background:h.locked?`${P.goldLight}20`:"transparent",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,minWidth:0}}>
                    {editH&&(<><div onClick={()=>toggleLockH(h.id)} style={{color:h.locked?P.gold:P.taupe,cursor:"pointer",flexShrink:0}}>{h.locked?<Ico.lock size={13}/>:<Ico.unlock size={13}/>}</div>{!h.locked&&<div onClick={()=>delH(h.id)} style={{color:"#E07B6A",cursor:"pointer",flexShrink:0}}><Ico.trash size={13}/></div>}</>)}
                    {!editH&&h.locked&&<span style={{color:P.gold,flexShrink:0}}><Ico.lock size={13}/></span>}
                    <span style={{fontSize:11,color:P.text,fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.label}</span>
                  </div>
                  {h.days.map((done,di)=>(
                    <div key={di} onClick={()=>toggleH(h.id,di)} style={{width:24,height:24,borderRadius:6,border:`1.5px solid ${done?P.gold:P.beige}`,background:done?P.gold:"transparent",cursor:"pointer",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                      {done&&<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="10" height="10"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input style={{...S.inp,flex:1}} placeholder="Nouvelle habitude..." value={newHabit} onChange={e=>setNewHabit(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addH()}/>
              <button style={S.btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={addH}><Ico.plus size={16}/></button>
            </div>
          </div>
        )}

        {/* ── SHUKR ── */}
        {tab==="shukr"&&(
          <div>
            <div style={{...S.card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"18px"})}}>
              <div style={{fontSize:20,marginBottom:4}}>شُكْر</div>
              <div style={{fontSize:13,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>"La gratitude transforme ce qu'on a en suffisance. 🤍"</div>
            </div>
            <div style={S.card()}>
              <div style={S.h2}>🏆 Ma victoire du jour</div>
              <textarea style={{...S.inp,minHeight:70,resize:"none",lineHeight:1.6}} placeholder="Quelque chose dont tu es fière..." value={victoire} onChange={e=>setVictoire(e.target.value)}/>
            </div>
            <div style={S.card()}>
              <div style={S.h2}>🙏 3 choses pour lesquelles je suis reconnaissante</div>
              {gratitude.map((g,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:P.gold,fontWeight:700,flexShrink:0}}>✦</div>
                  <input style={S.inp} placeholder="Je suis reconnaissante pour..." value={g} onChange={e=>setGratitude(p=>p.map((x,j)=>j===i?e.target.value:x))}/>
                </div>
              ))}
            </div>
            <div style={S.card()}>
              <div style={S.h2}>🌙 Ma journée</div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                {[{ico:"💛",l:"Bien"},{ico:"😮‍💨",l:"Difficile"},{ico:"🌊",l:"Compliquée"}].map(m=>(
                  <div key={m.l} onClick={()=>setMoodSoir(m.l)} style={{flex:1,textAlign:"center",padding:"10px 6px",borderRadius:12,border:`1.5px solid ${moodSoir===m.l?P.gold:P.beige}`,background:moodSoir===m.l?P.beige:P.soft,cursor:"pointer",transition:"all 0.2s"}}>
                    <div style={{fontSize:20}}>{m.ico}</div><div style={{fontSize:10,color:P.text,marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>{m.l}</div>
                  </div>
                ))}
              </div>
              <textarea style={{...S.inp,minHeight:70,resize:"none",lineHeight:1.6}} placeholder="Quelques mots..." value={journalSoir} onChange={e=>setJournalSoir(e.target.value)}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// TILES DATA
// ═══════════════════════════════════════════════════════
const TILE_ICONS={
  daily:   `<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>`,
  orga:    `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
  self:    `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
  famille: `<circle cx="9" cy="6" r="2.5"/><circle cx="17" cy="7" r="2"/><path d="M4 21v-2a4 4 0 0 1 4-4h3a4 4 0 0 1 4 4v2"/><path d="M17 11c1.7 0 3 1.3 3 3v3"/>`,
  alim:    `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/><path d="M21 15V2a5 5 0 0 0-5 5v6h3.5a2.5 2.5 0 0 1 0 5H16v2"/>`,
  projets: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
  outils:  `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  spirit:  `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`,
};
const TILES=[
  {id:"daily",   label:"Daily Planner",  sub:"Aujourd'hui",    bg:"#FDF6EE"},
  {id:"orga",    label:"Organisation",   sub:"Maison & agenda", bg:"#F5F2EE"},
  {id:"self",    label:"Self Care",      sub:"Corps & âme",    bg:"#FDF0F0"},
  {id:"famille", label:"Famille",        sub:"Rym & Tasnim",   bg:"#F0F6F1"},
  {id:"alim",    label:"Alimentation",   sub:"Repas & santé",  bg:"#FEFAEE"},
  {id:"projets", label:"Projets & Vie",  sub:"Rêves & budget", bg:"#F3F0FA"},
  {id:"outils",  label:"Outils & Focus", sub:"Boost TDAH",     bg:"#EEF3FA"},
  {id:"spirit",  label:"Spiritualité",   sub:"Deen & cœur",    bg:"#F5F0FA"},
];


// ═══════════════════════════════════════════════════════
// HOME SCREEN
// ═══════════════════════════════════════════════════════
function HomeScreen({onNavigate, priorities=[]}){
  const [doneMap,setDoneMap]=useState(()=>{
    try{const r=window.storage?.get?.('home:done');if(r?.value)return JSON.parse(r.value);}catch{}
    return {};
  });
  const [editTasks,setEditTasks]=useState(false);
  const [taskTexts,setTaskTexts]=useState(()=>{
    try{const r=window.storage?.get?.('home:tasks');if(r?.value)return JSON.parse(r.value);}catch{}
    return null;
  });
  
  const baseTasks=priorities.filter(p=>p.text.trim()).map((p,i)=>p.text);
  const displayTexts=taskTexts||baseTasks;
  const tasks=displayTexts.slice(0,3).map((text,i)=>({id:i,text,done:!!doneMap[i]}));
  
  const toggleTask=(i)=>{
    const nd={...doneMap,[i]:!doneMap[i]};
    setDoneMap(nd);
    try{window.storage?.set?.('home:done',JSON.stringify(nd));}catch{}
  };
  const saveTaskTexts=(texts)=>{
    setTaskTexts(texts);
    try{window.storage?.set?.('home:tasks',JSON.stringify(texts));}catch{}
  };
  const [humeur,setHumeur]=useState(null);
  const [nav,setNav]=useState("home");
  const HUMEURS=[{label:"Fatiguée",ico:"😮‍💨",msg:"Mode douceur. Une tâche suffit. 🤍",color:"#F5EEEE"},{label:"Calme",ico:"😌",msg:"Belle énergie calme. À ton rythme. 🌿",color:"#EEF5EE"},{label:"Motivée",ico:"🔥",msg:"C'est ton moment. Lance-toi ! 🚀",color:"#FDF3E8"},{label:"Stressée",ico:"😤",msg:"Respire. Une chose à la fois. 💛",color:"#F5F5EE"},{label:"Au top",ico:"✨",msg:"Journée en or. Profites-en ! ⭐",color:"#EEF5E8"}];
  const CITATIONS=["Un petit pas chaque jour mène à une grande transformation.","Fait vaut mieux que parfait. Toujours.","Tu n'as pas à tout faire. Juste l'essentiel.","Commence. Le reste suivra."];

  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:84}}>
      {/* HEADER */}
      <div style={{background:P.card,padding:"52px 20px 16px",borderBottom:`1px solid ${P.beige}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:`linear-gradient(135deg,${P.beigeDeep},${P.taupe})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🌸</div>
            <div>
              <div style={{fontSize:20,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>{SALUT}, Imane 🤍</div>
              <div style={{fontSize:12,color:P.textLight,marginTop:1}}>Nouvelle journée, nouveau départ ✨</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[ICONS.moon,ICONS.star].map((ch,i)=>(
              <div key={i} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown}}>
                <SvgRaw ch={ch} size={18}/>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:P.soft,borderRadius:12,padding:"10px 16px"}}>
          <SvgRaw ch={ICONS.sun} size={18}/>
          <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{JOURS[today.getDay()]} {today.getDate()} {MOIS[today.getMonth()]}</div>
          <SvgRaw ch={`<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`} size={18}/>
        </div>
      </div>

      <div style={{padding:"16px 16px 0"}}>
        {/* 3 TÂCHES */}
        <div style={{fontSize:11,fontWeight:700,color:P.textLight,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:7}}>
          LES 3 TÂCHES DU JOUR
          <div style={{background:P.gold,color:"#fff",borderRadius:"50%",width:20,height:20,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{tasks.filter(t=>!t.done).length}</div>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:6}}>
          {!editTasks
            ?<button onClick={()=>setEditTasks(true)} style={{fontSize:11,color:P.textLight,background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✏️ Modifier</button>
            :<button onClick={()=>setEditTasks(false)} style={{fontSize:11,color:P.gold,background:"none",border:"none",cursor:"pointer",fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>✓ Enregistrer</button>
          }
        </div>
        <div style={{background:P.card,borderRadius:16,marginBottom:16,border:`1px solid ${P.beige}`,overflow:"hidden"}}>
          {tasks.map((t,i)=>(
            <div key={t.id}
              style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:editTasks?"default":"pointer",background:t.done?P.soft:P.card,borderBottom:i<tasks.length-1?`1px solid ${P.beige}`:"none",transition:"background 0.2s"}}>
              <div onClick={()=>!editTasks&&toggleTask(i)}
                style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${t.done?P.gold:P.beigeDeep}`,background:t.done?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>
                {t.done&&<Ico.check/>}
              </div>
              {editTasks
                ?<input style={{flex:1,border:`1px solid ${P.beige}`,borderRadius:8,padding:"6px 10px",fontSize:13,fontFamily:"'DM Sans',sans-serif",color:P.text,background:P.soft,outline:"none"}}
                  value={displayTexts[i]||""} onChange={e=>{const arr=[...displayTexts];arr[i]=e.target.value;saveTaskTexts(arr);}}/>
                :<span onClick={()=>toggleTask(i)} style={{flex:1,fontSize:14,color:t.done?P.textLight:P.text,textDecoration:t.done?"line-through":"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>{t.text}</span>
              }
            </div>
          ))}
          {editTasks&&tasks.length<3&&(
            <div style={{padding:"10px 16px",borderTop:`1px solid ${P.beige}`}}>
              <button onClick={()=>{const arr=[...displayTexts,""];saveTaskTexts(arr);}} style={{fontSize:12,color:P.gold,background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>+ Ajouter une tâche</button>
            </div>
          )}
        </div>

        {/* NIVEAU DE FORME */}
        <div style={{fontSize:11,fontWeight:700,color:P.textLight,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10}}>NIVEAU DE FORME</div>
        <div style={{background:P.card,borderRadius:16,padding:"14px 16px",marginBottom:16,border:`1px solid ${P.beige}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <span style={{fontSize:13,color:P.text}}>Comment tu te sens aujourd'hui ?</span>
            <span style={{fontSize:11,color:P.gold,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Aujourd'hui ✏️</span>
          </div>
          <div style={{display:"flex",gap:4}}>
            {HUMEURS.map(h=>(
              <div key={h.label} onClick={()=>setHumeur(humeur===h.label?null:h.label)}
                style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"8px 3px",borderRadius:12,cursor:"pointer",border:`1.5px solid ${humeur===h.label?P.gold:"transparent"}`,background:humeur===h.label?h.color:P.soft,transition:"all 0.2s"}}>
                <span style={{fontSize:20}}>{h.ico}</span>
                <span style={{fontSize:9,color:humeur===h.label?P.darkBrown:P.textLight,fontWeight:humeur===h.label?600:400,textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>{h.label}</span>
              </div>
            ))}
          </div>
          {humeur&&<div style={{marginTop:10,padding:"9px 12px",borderRadius:10,background:HUMEURS.find(h=>h.label===humeur)?.color,fontSize:12,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",textAlign:"center"}}>{HUMEURS.find(h=>h.label===humeur)?.msg}</div>}
        </div>

        {/* TUILES */}
        <div style={{fontSize:11,fontWeight:700,color:P.textLight,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <SvgRaw ch={ICONS.star} size={13}/>
          ACCÈS RAPIDE
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {TILES.map(tile=>(
            <div key={tile.id} onClick={()=>onNavigate(tile.id)}
              style={{background:tile.bg,borderRadius:18,padding:"16px 14px",cursor:"pointer",border:`1px solid ${P.beige}`,boxShadow:"0 2px 8px rgba(74,50,40,0.05)",transition:"transform 0.2s, box-shadow 0.2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 6px 20px rgba(74,50,40,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 8px rgba(74,50,40,0.05)";}}>
              <div style={{color:P.brown,marginBottom:10}}><SvgRaw ch={TILE_ICONS[tile.id]} size={26}/></div>
              <div style={{fontSize:14,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif",lineHeight:1.2}}>{tile.label}</div>
              <div style={{fontSize:10,color:P.textLight,marginTop:3}}>{tile.sub}</div>
            </div>
          ))}
        </div>

        {/* CITATION */}
        <div style={{background:P.card,borderRadius:16,padding:"18px 20px",marginBottom:16,border:`1px solid ${P.beige}`,textAlign:"center"}}>
          <div style={{fontSize:13,color:P.brown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.7}}>
            "{CITATIONS[today.getDate()%CITATIONS.length]}"
          </div>
          <div style={{marginTop:8,color:P.gold}}>♡</div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:P.card,borderTop:`1px solid ${P.beige}`,display:"flex",alignItems:"center",justifyContent:"space-around",padding:"10px 0 20px",zIndex:100}}>
        {[{id:"home",ch:ICONS.home2,l:"Accueil"},{id:"stats",ch:ICONS.chart,l:"Suivi"}].map(({id,ch,l})=>(
          <div key={id} onClick={()=>setNav(id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",color:nav===id?P.darkBrown:P.textLight}}>
            <SvgRaw ch={ch} size={22}/><span style={{fontSize:9,fontWeight:nav===id?700:400,letterSpacing:"0.05em",textTransform:"uppercase"}}>{l}</span>
          </div>
        ))}
        <div style={{width:48,height:48,borderRadius:"50%",background:P.darkBrown,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",boxShadow:"0 4px 14px rgba(74,50,40,0.3)",cursor:"pointer",marginTop:-10}}>
          <SvgRaw ch={ICONS.plus} size={22}/>
        </div>
        {[{id:"messages",ch:ICONS.msg,l:"Messages"},{id:"profil",ch:ICONS.user,l:"Profil"}].map(({id,ch,l})=>(
          <div key={id} onClick={()=>setNav(id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",color:nav===id?P.darkBrown:P.textLight}}>
            <SvgRaw ch={ch} size={22}/><span style={{fontSize:9,fontWeight:nav===id?700:400,letterSpacing:"0.05em",textTransform:"uppercase"}}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// APP ROOT — NAVIGATION
// ═══════════════════════════════════════════════════════
function MyHayat(){
  const [screen,setScreen]=useState("home");
  const go   =id=>setScreen(id);
  const back =()=>setScreen("home");
  const [priorities,setPriorities]=useState(()=>{
    try{const r=window.storage?.get?.('app:priorities');if(r?.value)return JSON.parse(r.value);}catch{}
    return [{text:"",cat:"🌸 Moi"},{text:"",cat:"🏠 Maison"},{text:"",cat:"👧 Enfants"}];
  });
  const savePriorities=(p)=>{
    setPriorities(p);
    try{window.storage?.set?.('app:priorities',JSON.stringify(p));}catch{}
  };

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
        input:focus,select:focus,textarea:focus{border-color:${P.gold}!important;outline:none}
        input[type=date],input[type=time]{color-scheme:light}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
      `}</style>

      {screen==="home"    && <HomeScreen onNavigate={go} priorities={priorities} savePriorities={savePriorities}/>}
      {screen==="daily"   && <SectionDaily onBack={back} priorities={priorities} setPriorities={savePriorities}/>}
      {screen==="orga"    && <Organisation onBack={back}/>}
      {screen==="self"    && <SelfCare onBack={back}/>}
      {screen==="famille" && <Famille onBack={back}/>}
      {screen==="alim"    && <Alimentation onBack={back}/>}
      {screen==="projets" && <ProjetVie onBack={back}/>}
      {screen==="outils"  && <OutilsFocus onBack={back}/>}
      {screen==="spirit"  && <Spiritualite onBack={back}/>}
      {screen==="journal" && <JournalJours onBack={back}/>}
    </>
  );
}


// ── ICONS ──────────────────────────────────────────────


// ════════════════════════════════════════════════
// 1. MÉNAGE — Planning zones + Timer
// ════════════════════════════════════════════════
const ZONES_INIT = [
  { id:1, nom:"Cuisine 🍳",      freq:"Quotidien", taches:["Vaisselle","Plan de travail","Sol rapide"], locked:true },
  { id:2, nom:"Salon 🛋️",        freq:"2x/semaine", taches:["Aspirer","Dépoussiérer","Ranger"], locked:false },
  { id:3, nom:"SDB & WC 🚿",     freq:"Hebdo",      taches:["Lavabo","WC","Douche","Sol"], locked:true },
  { id:4, nom:"Chambres 🛏️",     freq:"Hebdo",      taches:["Faire les lits","Ranger","Aspirer"], locked:false },
  { id:5, nom:"Entrée & Couloir",freq:"Hebdo",      taches:["Sol","Chaussures","Manteaux"], locked:false },
];

function TabMenage() {
  const [zones,     setZones]    = useState(ZONES_INIT);
  const [checks,    setChecks]   = useState({});
  const [editing,   setEditing]  = useState(false);
  const [newZone,   setNewZone]  = useState("");
  const [newTaches, setNewTaches]= useState({});
  const [timer,     setTimer]    = useState(600);
  const [running,   setRunning]  = useState(false);
  const [timerZone, setTimerZone]= useState(null);
  const [customMin, setCustomMin]= useState({});  // {zoneId: "15"}
  const [showTimer, setShowTimer]= useState({});  // {zoneId: true}
  const ref = useRef(null);

  useEffect(()=>{
    if(running&&timer>0){ ref.current=setTimeout(()=>setTimer(t=>t-1),1000); }
    else if(timer===0) setRunning(false);
    return()=>clearTimeout(ref.current);
  },[running,timer]);

  const fmt = s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const pct  = timerZone ? Math.round((1-(timer/(((parseInt(customMin[timerZone])||10)*60))))*100) : 0;

  const toggleCheck = (zid,ti) => setChecks(p=>({...p,[`${zid}-${ti}`]:!p[`${zid}-${ti}`]}));
  const toggleLock  = id => setZones(p=>p.map(z=>z.id===id?{...z,locked:!z.locked}:z));
  const delZone     = id => setZones(p=>p.filter(z=>z.id!==id));
  const delTache    = (zid,ti) => {
    setZones(p=>p.map(z=>z.id===zid?{...z,taches:z.taches.filter((_,j)=>j!==ti)}:z));
    setChecks(p=>{ const n={...p}; delete n[`${zid}-${ti}`]; return n; });
  };
  const addTache = zid => {
    const txt=(newTaches[zid]||"").trim();
    if(!txt) return;
    setZones(p=>p.map(z=>z.id===zid?{...z,taches:[...z.taches,txt]}:z));
    setNewTaches(p=>({...p,[zid]:""}));
  };
  const addZone = () => {
    if(newZone.trim()){
      setZones(p=>[...p,{id:NID++,nom:newZone,freq:"Hebdo",taches:[],locked:false}]);
      setNewZone("");
    }
  };
  const startTimer = (znom) => {
    const mins = parseInt(customMin[znom])||10;
    setTimerZone(znom);
    setTimer(mins*60);
    setRunning(true);
    setShowTimer(p=>({...p,[znom]:false}));
  };
  const toggleShowTimer = znom => setShowTimer(p=>({...p,[znom]:!p[znom]}));

  const DUREES_RAPIDES = ["5","10","15","20","30","45","60"];

  return (
    <div>
      {/* Timer actif */}
      {running&&timer>0&&(
        <div style={{...card({background:P.darkBrown,padding:"20px",textAlign:"center"})}}>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>
            ⏱ {timerZone}
          </div>
          <div style={{fontSize:52,fontWeight:700,color:P.goldLight,fontFamily:"'DM Sans',sans-serif",marginBottom:10}}>{fmt(timer)}</div>
          <div style={{height:6,borderRadius:3,background:"rgba(255,255,255,0.2)",marginBottom:14}}>
            <div style={{height:"100%",borderRadius:3,background:P.gold,width:`${Math.min(pct,100)}%`,transition:"width 1s linear"}}/>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button style={btn(P.gold,P.darkBrown)} onClick={()=>setRunning(!running)}>{running?"⏸ Pause":"▶ Reprendre"}</button>
            <button style={btn("rgba(255,255,255,0.15)","#fff")} onClick={()=>{setTimer(0);setRunning(false);}}>Terminer</button>
          </div>
        </div>
      )}
      {!running&&timer===0&&timerZone&&(
        <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"16px"})}}>
          <div style={{fontSize:20,marginBottom:4}}>🎉</div>
          <div style={{fontSize:14,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>Temps écoulé pour {timerZone} !</div>
          <button style={btn(P.beige,P.darkBrown,{padding:"7px 14px",fontSize:12,marginTop:10})} onClick={()=>setTimerZone(null)}>Fermer</button>
        </div>
      )}

      {/* Toolbar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>🧹 Mes zones ménage</div>
        <button onClick={()=>setEditing(!editing)}
          style={btn(editing?P.darkBrown:P.beige,editing?"#fff":P.darkBrown,{padding:"7px 13px",fontSize:11})}>
          {editing?"✓ Terminer":"✏️ Modifier"}
        </button>
      </div>

      {zones.map(z=>{
        const done  = z.taches.filter((_,ti)=>checks[`${z.id}-${ti}`]).length;
        const total = z.taches.length;
        const mins  = customMin[z.nom]||"10";
        const timerOpen = showTimer[z.nom];
        return (
          <div key={z.id} style={card({padding:0,overflow:"hidden"})}>
            {/* En-tête zone */}
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:`1px solid ${P.beige}`,background:z.locked?`${P.goldLight}30`:P.soft}}>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{z.nom}</div>
                <div style={{fontSize:11,color:P.textLight,marginTop:2,fontFamily:"'DM Sans',sans-serif"}}>{z.freq} · {done}/{total}</div>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {!editing&&(
                  <button onClick={()=>toggleShowTimer(z.nom)}
                    style={btn(timerOpen?P.darkBrown:P.beige,timerOpen?"#fff":P.darkBrown,{padding:"6px 11px",fontSize:11,display:"flex",alignItems:"center",gap:4})}>
                    <Ico.clock/> {mins} min
                  </button>
                )}
                {editing&&(
                  <>
                    <div style={icBtn({color:z.locked?P.gold:P.taupe,background:z.locked?P.goldLight:P.soft})}
                      onClick={()=>toggleLock(z.id)}>{z.locked?<Ico.lock/>:<Ico.unlock/>}</div>
                    {!z.locked&&<div style={icBtn({color:"#E07B6A"})} onClick={()=>delZone(z.id)}><Ico.trash/></div>}
                  </>
                )}
              </div>
            </div>

            {/* Sélecteur durée */}
            {timerOpen&&!running&&(
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${P.beige}`,background:"#FFFDF8"}}>
                <div style={{fontSize:10,fontWeight:700,color:P.textLight,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8,fontFamily:"'DM Sans',sans-serif"}}>Choisir la durée</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
                  {DUREES_RAPIDES.map(d=>(
                    <div key={d} onClick={()=>setCustomMin(p=>({...p,[z.nom]:d}))}
                      style={{padding:"5px 11px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${mins===d?P.gold:P.beige}`,background:mins===d?P.goldLight:P.soft,color:mins===d?P.darkBrown:P.textLight,fontWeight:mins===d?700:400,transition:"all 0.2s"}}>
                      {d} min
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <input style={{...inp,flex:1,padding:"8px 12px",fontSize:13}} type="number"
                    placeholder="Autre durée (min)"
                    value={customMin[z.nom]||""}
                    onChange={e=>setCustomMin(p=>({...p,[z.nom]:e.target.value}))}/>
                  <span style={{fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif",flexShrink:0}}>min</span>
                </div>
                <button style={btn(P.darkBrown,"#fff",{width:"100%",padding:"10px"})} onClick={()=>startTimer(z.nom)}>
                  ▶ Lancer {mins} min pour {z.nom.split(" ")[0]}
                </button>
              </div>
            )}

            {/* Tâches */}
            <div style={{padding:"8px 16px 0"}}>
              {z.taches.map((t,ti)=>(
                <div key={ti} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:ti<z.taches.length-1?`1px solid ${P.beige}`:"none"}}>
                  <div onClick={()=>!editing&&toggleCheck(z.id,ti)}
                    style={{width:20,height:20,borderRadius:6,border:`1.5px solid ${checks[`${z.id}-${ti}`]?P.gold:P.beigeDeep}`,background:checks[`${z.id}-${ti}`]?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:editing?"default":"pointer",transition:"all 0.2s"}}>
                    {checks[`${z.id}-${ti}`]&&<Ico.check/>}
                  </div>
                  <span style={{flex:1,fontSize:13,color:checks[`${z.id}-${ti}`]?P.textLight:P.text,textDecoration:checks[`${z.id}-${ti}`]?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{t}</span>
                  {editing&&<div style={icBtn({color:"#E07B6A"})} onClick={()=>delTache(z.id,ti)}><Ico.trash/></div>}
                </div>
              ))}
              <div style={{display:"flex",gap:8,padding:"10px 0"}}>
                <input style={{...inp,flex:1,fontSize:12,padding:"8px 12px"}}
                  placeholder={`+ Tâche dans ${z.nom.split(" ")[0]}...`}
                  value={newTaches[z.id]||""}
                  onChange={e=>setNewTaches(p=>({...p,[z.id]:e.target.value}))}
                  onKeyDown={e=>e.key==="Enter"&&addTache(z.id)}/>
                <button style={btn(P.gold,P.darkBrown,{padding:"8px 12px"})} onClick={()=>addTache(z.id)}><Ico.plus/></button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Ajouter zone */}
      <div style={card()}>
        <div style={h3}>+ Nouvelle zone</div>
        <div style={{display:"flex",gap:8}}>
          <input style={{...inp,flex:1}} placeholder="Ex: Bureau 🖥️"
            value={newZone} onChange={e=>setNewZone(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addZone()}/>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={addZone}><Ico.plus/></button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 2. ROUTINES
// ════════════════════════════════════════════════
const ROUTINES_INIT = {
  matin: [
    {id:1,text:"Se lever sans téléphone 📵",locked:true},
    {id:2,text:"Verre d'eau 💧",locked:true},
    {id:3,text:"Se préparer",locked:false},
    {id:4,text:"Préparer les enfants",locked:false},
    {id:5,text:"Petit-déjeuner",locked:false},
  ],
  soir: [
    {id:6,text:"Ranger 10 min 🧹",locked:false},
    {id:7,text:"Préparer tenues du lendemain",locked:false},
    {id:8,text:"Skincare 🌙",locked:true},
    {id:9,text:"Préparer liste de demain",locked:false},
    {id:10,text:"Couper les écrans",locked:false},
  ],
  menage: [
    {id:11,text:"Cuisine (10 min)",locked:false},
    {id:12,text:"WC + SDB rapide",locked:false},
    {id:13,text:"Aspirer salon",locked:false},
    {id:14,text:"Lancer machine",locked:false},
  ],
};

function TabRoutines() {
  const [active,   setActive]  = useState("matin");
  const [routines, setRoutines]= useState(ROUTINES_INIT);
  const [checks,   setChecks]  = useState({});
  const [editing,  setEditing] = useState(false);
  const [newItem,  setNewItem] = useState("");

  const toggle    = id => setChecks(p=>({...p,[id]:!p[id]}));
  const toggleLock= (cat,id) => setRoutines(p=>({...p,[cat]:p[cat].map(r=>r.id===id?{...r,locked:!r.locked}:r)}));
  const del       = (cat,id) => setRoutines(p=>({...p,[cat]:p[cat].filter(r=>r.id!==id)}));
  const add       = (cat)    => {
    if(newItem.trim()){
      setRoutines(p=>({...p,[cat]:[...p[cat],{id:NID++,text:newItem,locked:false}]}));
      setNewItem("");
    }
  };
  const resetCat = (cat) => {
    const keys = routines[cat].map(r=>r.id);
    setChecks(p=>{ const n={...p}; keys.forEach(k=>delete n[k]); return n; });
  };

  const cats = [
    {id:"matin", label:"☀️ Matin"},
    {id:"soir",  label:"🌙 Soir"},
    {id:"menage",label:"🧹 Ménage"},
  ];

  const items = routines[active]||[];
  const done  = items.filter(r=>checks[r.id]).length;
  const locked = items.filter(r=>r.locked);
  const unlocked = items.filter(r=>!r.locked);
  const sorted = [...locked,...unlocked];

  return (
    <div>
      {/* Sélecteur routine */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {cats.map(c=>(
          <div key={c.id} onClick={()=>setActive(c.id)}
            style={{ flex:1, textAlign:"center", padding:"11px 8px", borderRadius:14, cursor:"pointer",
              border:`1.5px solid ${active===c.id?P.gold:P.beige}`,
              background:active===c.id?P.goldLight:P.card,
              color:active===c.id?P.darkBrown:P.textLight,
              fontSize:12, fontFamily:"'DM Sans',sans-serif",
              fontWeight:active===c.id?700:400, transition:"all 0.2s" }}>
            {c.label}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontSize:13, color:P.textLight, fontFamily:"'DM Sans',sans-serif" }}>
          {done}/{items.length} étapes
          {done===items.length&&items.length>0&&<span style={{ color:P.gold, marginLeft:6 }}>🎉 Terminée !</span>}
        </div>
        <div style={{ display:"flex", gap:6 }}>
          <button onClick={()=>resetCat(active)}
            style={btn(P.beige,P.darkBrown,{padding:"6px 11px",fontSize:11,display:"flex",alignItems:"center",gap:4})}>
            <Ico.refresh/> Reset
          </button>
          <button onClick={()=>setEditing(!editing)}
            style={btn(editing?P.darkBrown:P.beige,editing?"#fff":P.darkBrown,{padding:"6px 11px",fontSize:11})}>
            {editing?"✓ Ok":"✏️ Modifier"}
          </button>
        </div>
      </div>

      <div style={card({padding:0,overflow:"hidden"})}>
        {sorted.map((r,i)=>(
          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 16px",
            borderBottom:i<sorted.length-1?`1px solid ${P.beige}`:"none",
            background:r.locked?`${P.goldLight}20`:"transparent" }}>
            <div onClick={()=>!editing&&toggle(r.id)}
              style={{ width:22, height:22, borderRadius:7,
                border:`1.5px solid ${checks[r.id]?P.gold:P.beigeDeep}`,
                background:checks[r.id]?P.gold:"transparent",
                flexShrink:0, display:"flex", alignItems:"center",
                justifyContent:"center", cursor:editing?"default":"pointer", transition:"all 0.2s" }}>
              {checks[r.id]&&<Ico.check/>}
            </div>
            {r.locked&&!editing&&<div style={{ color:P.gold, flexShrink:0 }}><Ico.lock/></div>}
            <span style={{ flex:1, fontSize:13, color:checks[r.id]?P.textLight:P.text,
              textDecoration:checks[r.id]?"line-through":"none",
              fontFamily:"'DM Sans',sans-serif" }}>{r.text}</span>
            {editing&&(
              <div style={{ display:"flex", gap:5 }}>
                <div style={icBtn({color:r.locked?P.gold:P.taupe,background:r.locked?P.goldLight:P.soft})}
                  onClick={()=>toggleLock(active,r.id)}>
                  {r.locked?<Ico.lock/>:<Ico.unlock/>}
                </div>
                {!r.locked&&(
                  <div style={icBtn({color:"#E07B6A"})} onClick={()=>del(active,r.id)}><Ico.trash/></div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ajouter */}
      <div style={card()}>
        <div style={h3}>+ Ajouter une étape</div>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ ...inp, flex:1 }} placeholder="Ex: Méditation 5 min 🧘‍♀️"
            value={newItem} onChange={e=>setNewItem(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add(active)} />
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={()=>add(active)}><Ico.plus/></button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 3. INVENTAIRE
// ════════════════════════════════════════════════
const CATS_INVENT = ["🧴 Salle de bain","🧹 Ménage","🍽️ Cuisine","👶 Bébé","💊 Pharmacie","🛒 Divers"];

function TabInventaire() {
  const [items,   setItems]   = useState([
    {id:1,nom:"Lessive",cat:"🧹 Ménage",stock:"Faible",note:""},
    {id:2,nom:"Gel douche",cat:"🧴 Salle de bain",stock:"Ok",note:""},
    {id:3,nom:"Couches T2",cat:"👶 Bébé",stock:"Faible",note:"Taille 2"},
  ]);
  const [newNom,  setNewNom]  = useState("");
  const [newCat,  setNewCat]  = useState("🧹 Ménage");
  const [filterC, setFilterC] = useState("Tout");
  const [showAdd, setShowAdd] = useState(false);

  const add = () => {
    if(newNom.trim()){
      setItems(p=>[...p,{id:NID++,nom:newNom,cat:newCat,stock:"Ok",note:""}]);
      setNewNom(""); setShowAdd(false);
    }
  };
  const cycleStock = id => setItems(p=>p.map(i=>i.id===id?{...i,stock:i.stock==="Ok"?"Faible":i.stock==="Faible"?"Vide":"Ok"}:i));
  const del = id => setItems(p=>p.filter(i=>i.id!==id));

  const STOCK_STYLE = {
    "Ok":    {bg:"#E8F5E9",color:"#2E7D32"},
    "Faible":{bg:"#FFF3E0",color:"#E65100"},
    "Vide":  {bg:"#FFEBEE",color:"#C62828"},
  };

  const filtered = filterC==="Tout" ? items : items.filter(i=>i.cat===filterC);
  const faibles  = items.filter(i=>i.stock!=="Ok").length;

  return (
    <div>
      {faibles>0&&(
        <div style={{ ...card({background:"#FFF3E0",border:"1px solid #FFE082",padding:"11px 16px"}),
          display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>⚠️</span>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:"#E65100", fontFamily:"'DM Sans',sans-serif" }}>
              {faibles} produit{faibles>1?"s":""} à racheter
            </div>
            <div style={{ fontSize:11, color:P.textLight, fontFamily:"'DM Sans',sans-serif" }}>
              Pense à les ajouter à ta liste de courses
            </div>
          </div>
        </div>
      )}

      {/* Filtres catégories */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, scrollbarWidth:"none" }}>
        {["Tout",...CATS_INVENT].map(c=>(
          <span key={c} onClick={()=>setFilterC(c)}
            style={{ padding:"5px 12px", borderRadius:20, fontSize:11, cursor:"pointer", flexShrink:0,
              fontFamily:"'DM Sans',sans-serif",
              border:`1.5px solid ${filterC===c?P.gold:P.beige}`,
              background:filterC===c?P.goldLight:P.soft,
              color:filterC===c?P.darkBrown:P.textLight,
              fontWeight:filterC===c?600:400, transition:"all 0.2s" }}>
            {c}
          </span>
        ))}
      </div>

      <div style={card({padding:0,overflow:"hidden"})}>
        {filtered.map((item,i)=>(
          <div key={item.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
            borderBottom:i<filtered.length-1?`1px solid ${P.beige}`:"none" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, color:P.text, fontFamily:"'DM Sans',sans-serif",
                fontWeight:500 }}>{item.nom}</div>
              <div style={{ fontSize:10, color:P.textLight, fontFamily:"'DM Sans',sans-serif",
                marginTop:2 }}>{item.cat}</div>
            </div>
            <div onClick={()=>cycleStock(item.id)}
              style={{ padding:"4px 10px", borderRadius:20, fontSize:11, cursor:"pointer",
                background:STOCK_STYLE[item.stock].bg, color:STOCK_STYLE[item.stock].color,
                fontFamily:"'DM Sans',sans-serif", fontWeight:600, flexShrink:0 }}>
              {item.stock}
            </div>
            <div style={icBtn()} onClick={()=>del(item.id)}><Ico.trash/></div>
          </div>
        ))}
        {filtered.length===0&&(
          <div style={{ padding:"24px", textAlign:"center", color:P.textLight, fontSize:13,
            fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>
            Aucun produit dans cette catégorie
          </div>
        )}
      </div>

      {/* Ajouter */}
      {showAdd?(
        <div style={card({border:`2px solid ${P.gold}`})}>
          <div style={h3}>Nouveau produit</div>
          <input style={{ ...inp, marginBottom:8 }} placeholder="Nom du produit"
            value={newNom} onChange={e=>setNewNom(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add()} autoFocus />
          <select style={{ ...inp, marginBottom:12 }} value={newCat} onChange={e=>setNewCat(e.target.value)}>
            {CATS_INVENT.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{ display:"flex", gap:8 }}>
            <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={add}>Ajouter</button>
            <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowAdd(false)}>Annuler</button>
          </div>
        </div>
      ):(
        <button style={btn(P.beige,P.darkBrown,{width:"100%",marginBottom:14})}
          onClick={()=>setShowAdd(true)}>+ Ajouter un produit</button>
      )}

      <div style={{ fontSize:11, color:P.textLight, textAlign:"center",
        fontFamily:"'DM Sans',sans-serif" }}>
        Appuie sur le stock pour changer : Ok → Faible → Vide
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 4. LISTE DE COURSES
// ════════════════════════════════════════════════
const RAYON = ["🥦 Fruits & Légumes","🥩 Viandes & Poissons","🧀 Frais","🥫 Épicerie","🧴 Hygiène","🍼 Bébé","🛒 Autre"];

function TabCourses() {
  const [items,   setItems]   = useState([]);
  const [newText, setNewText] = useState("");
  const [newRay,  setNewRay]  = useState("🥦 Fruits & Légumes");
  const [filter,  setFilter]  = useState("Tout");
  const [budget,  setBudget]  = useState("");
  const [depense, setDepense] = useState("");
  const [editing, setEditing] = useState(false);

  const add = () => {
    if(newText.trim()){
      setItems(p=>[...p,{id:NID++,text:newText,rayon:newRay,done:false,doneAt:null}]);
      setNewText("");
    }
  };
  const toggle = id => setItems(p=>p.map(i=>i.id===id
    ? {...i, done:!i.done, doneAt:!i.done ? new Date().toLocaleDateString("fr-FR") : null}
    : i
  ));
  const del      = id => setItems(p=>p.filter(i=>i.id!==id));
  const resetAll = ()  => setItems(p=>p.map(i=>({...i,done:false,doneAt:null})));
  const clearDone= ()  => setItems(p=>p.filter(i=>!i.done));

  const filterFn = it => filter==="Tout" ? true : filter==="✅ Cochés" ? it.done : filter==="🛒 À prendre" ? !it.done : it.rayon===filter;

  const grouped = RAYON.reduce((acc,r)=>{
    const its = items.filter(i=>i.rayon===r && filterFn(i));
    if(its.length) acc[r]=its;
    return acc;
  },{});

  const total   = items.length;
  const done    = items.filter(i=>i.done).length;
  const aPrend  = total - done;

  const FILTERS = ["Tout","🛒 À prendre","✅ Cochés",...RAYON];

  return (
    <div>
      {/* Résumé */}
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,padding:"14px 16px"})}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:total>0?10:0}}>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>🛒 Ma liste de courses</div>
            {total>0&&<div style={{fontSize:12,color:P.brown,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>
              {aPrend} à prendre · {done} déjà cochés
            </div>}
          </div>
          <div style={{display:"flex",gap:6}}>
            {done>0&&<button onClick={resetAll} style={btn(P.beige,P.darkBrown,{padding:"6px 10px",fontSize:11})}>↩ Tout décocher</button>}
            {done>0&&<button onClick={clearDone} style={btn("#FFEBEE","#C62828",{padding:"6px 10px",fontSize:11})}>🗑 Vider cochés</button>}
          </div>
        </div>
        {total>0&&(
          <div>
            <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.5)"}}>
              <div style={{height:"100%",borderRadius:4,background:P.gold,width:`${Math.round(done/total*100)}%`,transition:"width 0.3s"}}/>
            </div>
            {done===total&&total>0&&<div style={{textAlign:"center",marginTop:6,fontSize:12,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>🎉 Toutes les courses faites !</div>}
          </div>
        )}
      </div>

      {/* Budget */}
      <div style={card({padding:"12px 16px"})}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={h3}>Budget prévu</div>
            <input style={inp} placeholder="0 €" type="number" value={budget} onChange={e=>setBudget(e.target.value)}/>
          </div>
          <div style={{flex:1}}>
            <div style={h3}>Dépensé</div>
            <input style={inp} placeholder="0 €" type="number" value={depense} onChange={e=>setDepense(e.target.value)}/>
          </div>
        </div>
        {budget&&depense&&(
          <div style={{marginTop:10,padding:"8px 12px",borderRadius:10,
            background:Number(depense)>Number(budget)?"#FFEBEE":"#E8F5E9",
            color:Number(depense)>Number(budget)?"#C62828":"#2E7D32",
            fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>
            {Number(depense)>Number(budget)
              ? `⚠️ Dépassement de ${(Number(depense)-Number(budget)).toFixed(2)}€`
              : `✓ Il reste ${(Number(budget)-Number(depense)).toFixed(2)}€`}
          </div>
        )}
      </div>

      {/* Ajout rapide */}
      <div style={card()}>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <input style={{...inp,flex:1}} placeholder="Ajouter un article..."
            value={newText} onChange={e=>setNewText(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add()} autoFocus={false}/>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={add}><Ico.plus/></button>
        </div>
        <select style={inp} value={newRay} onChange={e=>setNewRay(e.target.value)}>
          {RAYON.map(r=><option key={r}>{r}</option>)}
        </select>
      </div>

      {/* Filtres */}
      {total>0&&(
        <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",marginBottom:14,paddingBottom:2}}>
          {["Tout","🛒 À prendre","✅ Cochés"].map(f=>(
            <span key={f} onClick={()=>setFilter(f)}
              style={{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",flexShrink:0,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${filter===f?P.gold:P.beige}`,background:filter===f?P.goldLight:P.soft,color:filter===f?P.darkBrown:P.textLight,fontWeight:filter===f?600:400,transition:"all 0.2s"}}>{f}
            </span>
          ))}
        </div>
      )}

      {/* Liste par rayon */}
      {Object.entries(grouped).map(([rayon,its])=>(
        <div key={rayon} style={card({padding:0,overflow:"hidden"})}>
          <div style={{padding:"10px 16px 8px",background:P.soft,borderBottom:`1px solid ${P.beige}`,fontSize:11,fontWeight:700,color:P.brown,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>
            {rayon} <span style={{color:P.textLight,fontWeight:400}}>({its.filter(i=>!i.done).length}/{its.length})</span>
          </div>
          {its.map((item,i)=>(
            <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<its.length-1?`1px solid ${P.beige}`:"none",background:item.done?`${P.soft}80`:"transparent",transition:"background 0.2s"}}>
              <div onClick={()=>toggle(item.id)}
                style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${item.done?P.gold:P.beigeDeep}`,background:item.done?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>
                {item.done&&<Ico.check/>}
              </div>
              <div style={{flex:1}}>
                <span style={{fontSize:14,color:item.done?P.textLight:P.text,textDecoration:item.done?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{item.text}</span>
                {item.done&&item.doneAt&&<div style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>✓ Acheté le {item.doneAt}</div>}
              </div>
              <div style={icBtn()} onClick={()=>del(item.id)}><Ico.trash/></div>
            </div>
          ))}
        </div>
      ))}

      {total===0&&(
        <div style={{...card({textAlign:"center",padding:"32px 20px",background:`linear-gradient(135deg,${P.soft},${P.goldLight})`})}}>
          <div style={{fontSize:32,marginBottom:8}}>🛒</div>
          <div style={{fontSize:14,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>
            Ajoute tes articles au fur et à mesure.<br/>Ils restent jusqu'à ce que tu les supprimes. 🌿
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 5. PLANNING SEMAINE MAISON
// ════════════════════════════════════════════════
function TabPlanningSemaine() {
  const [plan, setPlan] = useState(
    JOURS.reduce((acc,j)=>({...acc,[j]:{matin:"",aprem:"",soir:""}}),{})
  );
  const [checks, setChecks] = useState({});

  const update = (j,slot,val) => setPlan(p=>({...p,[j]:{...p[j],[slot]:val}}));
  const toggleCheck = (j,slot) => setChecks(p=>({...p,[`${j}-${slot}`]:!p[`${j}-${slot}`]}));

  const SLOTS = [{id:"matin",label:"Matin ☀️"},{id:"aprem",label:"Après-midi 🌤️"},{id:"soir",label:"Soir 🌙"}];

  return (
    <div>
      <div style={{ ...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"14px"}) }}>
        <div style={{ fontSize:13, color:P.darkBrown, fontFamily:"'Cormorant Garamond',serif",
          fontStyle:"italic" }}>
          "Planifie ta semaine maison. Adapte sans culpabilité. 🌿"
        </div>
      </div>

      {JOURS.map(jour=>(
        <div key={jour} style={card({padding:0,overflow:"hidden"})}>
          <div style={{ padding:"10px 16px", background:P.soft, borderBottom:`1px solid ${P.beige}`,
            fontSize:13, fontWeight:700, color:P.darkBrown,
            fontFamily:"'Cormorant Garamond',serif" }}>{jour}</div>
          {SLOTS.map((slot,si)=>(
            <div key={slot.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
              borderBottom:si<2?`1px solid ${P.beige}`:"none" }}>
              <div onClick={()=>plan[jour][slot.id]&&toggleCheck(jour,slot.id)}
                style={{ width:20, height:20, borderRadius:6,
                  border:`1.5px solid ${checks[`${jour}-${slot.id}`]?P.gold:P.beigeDeep}`,
                  background:checks[`${jour}-${slot.id}`]?P.gold:"transparent",
                  flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", transition:"all 0.2s" }}>
                {checks[`${jour}-${slot.id}`]&&<Ico.check/>}
              </div>
              <div style={{ fontSize:10, color:P.gold, fontFamily:"'DM Sans',sans-serif",
                width:80, flexShrink:0 }}>{slot.label}</div>
              <input style={{ ...inp, flex:1, padding:"7px 10px", fontSize:12 }}
                placeholder="Tâche maison..."
                value={plan[jour][slot.id]}
                onChange={e=>update(jour,slot.id,e.target.value)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════
// 6. CHECKLIST SAISONNIÈRE
// ════════════════════════════════════════════════
const SAISONS = {
  "🌸 Printemps": [
    "Grand ménage de printemps","Laver les vitres","Ranger les vêtements d'hiver",
    "Sortir les vêtements légers","Nettoyer les placards","Aérer literie & matelas",
    "Nettoyer le réfrigérateur","Ranger le garage / cave","Renouveler produits périmés",
  ],
  "☀️ Été": [
    "Préparer valises vacances","Ranger affaires de plage","Vérifier crèmes solaires",
    "Nettoyer ventilateurs","Ranger couvertures épaisses","Préparer trousse voyage",
  ],
  "🍂 Rentrée": [
    "Préparer cartables & fournitures","Acheter vêtements rentrée","Réviser agenda scolaire",
    "Organiser les espaces de travail","Renouveler stock pharmacie","Préparer menus de la semaine",
    "Mettre en place nouvelles routines","Faire le point budget",
  ],
  "❄️ Hiver": [
    "Sortir vêtements chauds","Ranger vêtements d'été","Vérifier chauffage",
    "Préparer décorations Noël","Faire les cadeaux à l'avance","Renouveler stock de bougies 🕯️",
    "Préparer menus festifs","Vérifier couvertures & plaids",
  ],
};

function TabSaison() {
  const [saison,  setSaison]  = useState("🌸 Printemps");
  const [checks,  setChecks]  = useState({});
  const [newItem, setNewItem] = useState("");

  const [custom, setCustom] = useState(Object.keys(SAISONS).reduce((acc,s)=>({...acc,[s]:[]}),{}));

  const toggle  = k => setChecks(p=>({...p,[k]:!p[k]}));
  const addItem = () => {
    if(newItem.trim()){
      setCustom(p=>({...p,[saison]:[...p[saison],newItem]}));
      setNewItem("");
    }
  };
  const resetSaison = () => {
    const keys = [...SAISONS[saison],...(custom[saison]||[])].map((_,i)=>`${saison}-${i}`);
    setChecks(p=>{ const n={...p}; keys.forEach(k=>delete n[k]); return n; });
  };

  const allItems = [...SAISONS[saison], ...(custom[saison]||[])];
  const done = allItems.filter((_,i)=>checks[`${saison}-${i}`]).length;

  const SAISON_ICONS = {"🌸 Printemps":P.gold,"☀️ Été":"#E65100","🍂 Rentrée":P.brown,"❄️ Hiver":"#5C8FA8"};

  return (
    <div>
      {/* Sélecteur saison */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
        {Object.keys(SAISONS).map(s=>(
          <div key={s} onClick={()=>setSaison(s)}
            style={{ textAlign:"center", padding:"12px 8px", borderRadius:14, cursor:"pointer",
              border:`1.5px solid ${saison===s?SAISON_ICONS[s]:P.beige}`,
              background:saison===s?`${SAISON_ICONS[s]}20`:P.card,
              color:saison===s?SAISON_ICONS[s]:P.textLight,
              fontSize:13, fontFamily:"'DM Sans',sans-serif",
              fontWeight:saison===s?700:400, transition:"all 0.2s" }}>
            {s}
          </div>
        ))}
      </div>

      {/* Progression */}
      <div style={card({padding:"12px 16px"})}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div style={{ fontSize:12, color:P.textLight, fontFamily:"'DM Sans',sans-serif" }}>
            {done}/{allItems.length} tâches
            {done===allItems.length&&allItems.length>0&&<span style={{ color:P.gold, marginLeft:6 }}>🎉</span>}
          </div>
          <button onClick={resetSaison}
            style={btn(P.beige,P.darkBrown,{padding:"5px 10px",fontSize:11,display:"flex",alignItems:"center",gap:4})}>
            <Ico.refresh/> Reset
          </button>
        </div>
        <div style={{ height:6, borderRadius:3, background:P.beige }}>
          <div style={{ height:"100%", borderRadius:3, background:SAISON_ICONS[saison]||P.gold,
            width:`${allItems.length?Math.round(done/allItems.length*100):0}%`,
            transition:"width 0.3s" }}/>
        </div>
      </div>

      <div style={card({padding:0,overflow:"hidden"})}>
        {allItems.map((item,i)=>(
          <div key={i} onClick={()=>toggle(`${saison}-${i}`)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
              borderBottom:i<allItems.length-1?`1px solid ${P.beige}`:"none", cursor:"pointer" }}>
            <div style={{ width:22, height:22, borderRadius:7,
              border:`1.5px solid ${checks[`${saison}-${i}`]?SAISON_ICONS[saison]||P.gold:P.beigeDeep}`,
              background:checks[`${saison}-${i}`]?SAISON_ICONS[saison]||P.gold:"transparent",
              flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all 0.2s" }}>
              {checks[`${saison}-${i}`]&&<Ico.check/>}
            </div>
            <span style={{ fontSize:13, color:checks[`${saison}-${i}`]?P.textLight:P.text,
              textDecoration:checks[`${saison}-${i}`]?"line-through":"none",
              fontFamily:"'DM Sans',sans-serif" }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Ajouter */}
      <div style={card()}>
        <div style={h3}>+ Ajouter à {saison}</div>
        <div style={{ display:"flex", gap:8 }}>
          <input style={{ ...inp, flex:1 }} placeholder="Ex: Nettoyer les gouttières"
            value={newItem} onChange={e=>setNewItem(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addItem()} />
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={addItem}><Ico.plus/></button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════
const TABS_ORGA = [
  {id:"menage",  label:"🧹 Ménage"},
  {id:"routines",label:"🧺 Routines"},
  {id:"inventaire",label:"🏠 Inventaire"},
  {id:"courses", label:"🛒 Courses"},
  {id:"semaine", label:"🗓️ Semaine"},
  {id:"saison",  label:"🌸 Saison"},
];

function Organisation({ onBack }) {
  const [tab, setTab] = useState("menage");

  return (
    <>
      
      <div style={{ maxWidth:420, margin:"0 auto", minHeight:"100vh",
        background:P.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:24 }}>

        {/* HEADER */}
        <div style={{ background:P.card, padding:"52px 20px 0",
          borderBottom:`1px solid ${P.beige}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            {onBack&&(
              <div onClick={onBack} style={{ width:36,height:36,borderRadius:"50%",
                border:`1px solid ${P.beige}`,background:P.soft,
                display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:P.brown,flexShrink:0 }}>
                <Ico.back/>
              </div>
            )}
            <div style={{ color:P.gold }}><Ico.home/></div>
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:P.darkBrown,
                fontFamily:"'Cormorant Garamond',Georgia,serif" }}>Organisation</div>
              <div style={{ fontSize:12, color:P.textLight }}>Maison & quotidien</div>
            </div>
          </div>
          {/* TABS */}
          <div style={{ display:"flex", overflowX:"auto", scrollbarWidth:"none" }}>
            {TABS_ORGA.map(t=>(
              <div key={t.id} onClick={()=>setTab(t.id)}
                style={{ flex:"0 0 auto", padding:"10px 13px 9px", cursor:"pointer",
                  fontSize:11, fontFamily:"'DM Sans',sans-serif",
                  color:tab===t.id?P.darkBrown:P.textLight,
                  borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,
                  fontWeight:tab===t.id?600:400, whiteSpace:"nowrap",
                  transition:"all 0.2s" }}>
                {t.label}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding:"18px 16px 0" }}>
          {tab==="menage"     && <TabMenage/>}
          {tab==="routines"   && <TabRoutines/>}
          {tab==="inventaire" && <TabInventaire/>}
          {tab==="courses"    && <TabCourses/>}
          {tab==="semaine"    && <TabPlanningSemaine/>}
          {tab==="saison"     && <TabSaison/>}
        </div>
      </div>
    </>
  );
}

// ── Composant liste éditable générique ──────────────────
function EditableList({ items, setItems, placeholder="Ajouter...", emptyMsg="Liste vide" }) {
  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState("");
  const [checks,  setChecks]  = useState({});

  const toggle     = id => setChecks(p=>({...p,[id]:!p[id]}));
  const toggleLock = id => setItems(p=>p.map(i=>i.id===id?{...i,locked:!i.locked}:i));
  const del        = id => setItems(p=>p.filter(i=>i.id!==id));
  const add        = () => { if(newText.trim()){ setItems(p=>[...p,{id:NID++,text:newText,locked:false}]); setNewText(""); } };
  const reset      = () => setChecks({});

  const sorted = [...items.filter(i=>i.locked), ...items.filter(i=>!i.locked)];
  const done   = sorted.filter(i=>checks[i.id]).length;

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <div style={{ fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif" }}>
          {done}/{sorted.length} {done===sorted.length&&sorted.length>0?"🎉":""}
        </div>
        <div style={{ display:"flex",gap:6 }}>
          <button onClick={reset} style={btn(P.beige,P.darkBrown,{padding:"5px 10px",fontSize:11,display:"flex",alignItems:"center",gap:4})}>
            <Ico.refresh/> Reset
          </button>
          <button onClick={()=>setEditing(!editing)} style={btn(editing?P.darkBrown:P.beige,editing?"#fff":P.darkBrown,{padding:"5px 10px",fontSize:11})}>
            {editing?"✓ Ok":"✏️ Modifier"}
          </button>
        </div>
      </div>

      <div style={card({padding:0,overflow:"hidden"})}>
        {sorted.length===0&&(
          <div style={{ padding:20,textAlign:"center",color:P.textLight,fontSize:13,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif" }}>{emptyMsg}</div>
        )}
        {sorted.map((item,i)=>(
          <div key={item.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"12px 16px",
            borderBottom:i<sorted.length-1?`1px solid ${P.beige}`:"none",
            background:item.locked?`${P.goldLight}25`:"transparent" }}>
            <div onClick={()=>!editing&&toggle(item.id)}
              style={{ width:22,height:22,borderRadius:7,
                border:`1.5px solid ${checks[item.id]?P.gold:P.beigeDeep}`,
                background:checks[item.id]?P.gold:"transparent",
                flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                cursor:editing?"default":"pointer",transition:"all 0.2s" }}>
              {checks[item.id]&&<Ico.check/>}
            </div>
            {item.locked&&!editing&&<div style={{ color:P.gold,flexShrink:0 }}><Ico.lock/></div>}
            <span style={{ flex:1,fontSize:13,color:checks[item.id]?P.textLight:P.text,
              textDecoration:checks[item.id]?"line-through":"none",fontFamily:"'DM Sans',sans-serif" }}>
              {item.text}
            </span>
            {editing&&(
              <div style={{ display:"flex",gap:5 }}>
                <div style={icBtn({color:item.locked?P.gold:P.taupe,background:item.locked?P.goldLight:P.soft})}
                  onClick={()=>toggleLock(item.id)}>
                  {item.locked?<Ico.lock/>:<Ico.unlock/>}
                </div>
                {!item.locked&&<div style={icBtn({color:"#E07B6A"})} onClick={()=>del(item.id)}><Ico.trash/></div>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display:"flex",gap:8,marginTop:8 }}>
        <input style={{ ...inp,flex:1 }} placeholder={placeholder}
          value={newText} onChange={e=>setNewText(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()} />
        <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={add}><Ico.plus/></button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 1. SOINS BEAUTÉ — tout personnalisable
// ════════════════════════════════════════════════
function TabSoins() {
  const [active, setActive] = useState("quotidien");
  const [soins,  setSoins]  = useState({
    quotidien: [
      {id:1,text:"Skincare matin ☀️",locked:true},
      {id:2,text:"Skincare soir 🌙",locked:true},
      {id:3,text:"Hydratation corps 🧴",locked:false},
      {id:4,text:"Protéger cheveux la nuit 🌙",locked:false},
    ],
    semaine: [
      {id:5,text:"Masque visage 🫧",locked:false},
      {id:6,text:"Masque cheveux 💆‍♀️",locked:false},
      {id:7,text:"Épilation",locked:false},
      {id:8,text:"Gommage corps 🫧",locked:false},
      {id:9,text:"Lissage Maison Iliss 💛",locked:true},
    ],
    mois: [
      {id:10,text:"Soin des mains 💅",locked:false},
      {id:11,text:"Soin des pieds 🦶",locked:false},
      {id:12,text:"Sourcils ✂️",locked:false},
      {id:13,text:"Massage 💆‍♀️",locked:false},
      {id:14,text:"Soin visage chez l'esthéticienne",locked:false},
      {id:15,text:"Coupe / coiffeur ✂️",locked:false},
    ],
  });

  const CATS = [
    {id:"quotidien",label:"☀️ Quotidien"},
    {id:"semaine",  label:"📅 Semaine"},
    {id:"mois",     label:"🗓️ Mois"},
  ];

  return (
    <div>
      <div style={{ display:"flex",gap:8,marginBottom:14 }}>
        {CATS.map(c=>(
          <div key={c.id} onClick={()=>setActive(c.id)}
            style={{ flex:1,textAlign:"center",padding:"11px 8px",borderRadius:14,cursor:"pointer",
              border:`1.5px solid ${active===c.id?P.gold:P.beige}`,
              background:active===c.id?P.goldLight:P.card,
              color:active===c.id?P.darkBrown:P.textLight,
              fontSize:11,fontFamily:"'DM Sans',sans-serif",
              fontWeight:active===c.id?700:400,transition:"all 0.2s" }}>
            {c.label}
          </div>
        ))}
      </div>
      <EditableList
        items={soins[active]}
        setItems={items=>setSoins(p=>({...p,[active]:items}))}
        placeholder="Ex: Bain relaxant 🛁"
        emptyMsg="Aucun soin — ajoute le tien ✨"
      />
      <div style={{ ...card({background:P.soft,textAlign:"center",padding:"12px"}) }}>
        <div style={{ fontSize:12,color:P.brown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
          "Prendre soin de toi, c'est prendre soin de tout le monde. 🤍"
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 2. SPORT — planning personnalisable
// ════════════════════════════════════════════════

function TabSport() {
  const [seances, setSeances] = useState([
    {id:1,sport:"Marche 🚶‍♀️",    freq:"2x/semaine", jours:[0,3], duree:"30 min", locked:true},
    {id:2,sport:"Pilates 🧘‍♀️",   freq:"1x/semaine", jours:[2],   duree:"45 min", locked:false},
    {id:3,sport:"Piscine 🏊‍♀️",   freq:"1x/semaine", jours:[5],   duree:"1h",     locked:false},
  ]);
  const [checks,   setChecks]  = useState({});
  const [editing,  setEditing] = useState(false);
  const [showForm, setShowForm]= useState(false);
  const [newS,     setNewS]    = useState({sport:"",freq:"1x/semaine",jours:[],duree:"30 min"});

  const SPORTS_SUGGEST = ["Marche 🚶‍♀️","Pilates 🧘‍♀️","Piscine 🏊‍♀️","Yoga 🌿","Running 🏃‍♀️","Vélo 🚴‍♀️","Danse 💃","Gym 💪","Stretching 🌸"];
  const FREQS = ["Quotidien","2x/semaine","3x/semaine","1x/semaine","1x/mois"];
  const JOURS_C = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

  const toggleCheck = id => setChecks(p=>({...p,[id]:!p[id]}));
  const toggleLock  = id => setSeances(p=>p.map(s=>s.id===id?{...s,locked:!s.locked}:s));
  const del         = id => setSeances(p=>p.filter(s=>s.id!==id));
  const toggleJour  = j  => setNewS(p=>({...p, jours: p.jours.includes(j)?p.jours.filter(x=>x!==j):[...p.jours,j]}));
  const add = () => {
    if(newS.sport.trim()){
      setSeances(p=>[...p,{id:NID++,...newS,locked:false}]);
      setNewS({sport:"",freq:"1x/semaine",jours:[],duree:"30 min"});
      setShowForm(false);
    }
  };

  const todayDow = new Date().getDay();
  const todayIdx = todayDow===0?6:todayDow-1;
  const todaySeances = seances.filter(s=>s.jours.includes(todayIdx));

  return (
    <div>
      {todaySeances.length>0?(
        <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,padding:"14px 16px"})}}>
          <div style={h3}>💪 Aujourd'hui</div>
          {todaySeances.map(s=>(
            <div key={s.id} onClick={()=>toggleCheck(s.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${checks[s.id]?P.gold:P.beigeDeep}`,background:checks[s.id]?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                {checks[s.id]&&<Ico.check/>}
              </div>
              <span style={{flex:1,fontSize:14,color:checks[s.id]?P.textLight:P.darkBrown,textDecoration:checks[s.id]?"line-through":"none",fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>
                {s.sport}
              </span>
              <span style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{s.duree}</span>
            </div>
          ))}
        </div>
      ):(
        <div style={{...card({background:P.soft,textAlign:"center",padding:"14px"})}}>
          <div style={{fontSize:13,color:P.textLight,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>
            Pas de sport prévu aujourd'hui. Repos actif ou marche douce ? 🌿
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={h2}>🗓️ Mon planning sport</div>
        <button onClick={()=>setEditing(!editing)} style={btn(editing?P.darkBrown:P.beige,editing?"#fff":P.darkBrown,{padding:"6px 11px",fontSize:11})}>
          {editing?"✓ Ok":"✏️ Modifier"}
        </button>
      </div>

      {seances.map(s=>(
        <div key={s.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:s.locked?`${P.goldLight}30`:P.card}}>
            {s.locked&&!editing&&<div style={{color:P.gold,flexShrink:0}}><Ico.lock/></div>}
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{s.sport}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:P.goldLight,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{s.freq}</span>
                <span style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>⏱ {s.duree}</span>
              </div>
              <div style={{display:"flex",gap:4,marginTop:8,flexWrap:"wrap"}}>
                {JOURS_C.map((j,idx)=>(
                  <span key={idx} style={{fontSize:10,padding:"3px 7px",borderRadius:8,fontFamily:"'DM Sans',sans-serif",background:s.jours.includes(idx)?P.gold:P.beige,color:s.jours.includes(idx)?"#fff":P.textLight,fontWeight:s.jours.includes(idx)?600:400}}>{j}</span>
                ))}
              </div>
            </div>
            {editing&&(
              <div style={{display:"flex",gap:5}}>
                <div style={icBtn({color:s.locked?P.gold:P.taupe,background:s.locked?P.goldLight:P.soft})} onClick={()=>toggleLock(s.id)}>
                  {s.locked?<Ico.lock/>:<Ico.unlock/>}
                </div>
                {!s.locked&&<div style={icBtn({color:"#E07B6A"})} onClick={()=>del(s.id)}><Ico.trash/></div>}
              </div>
            )}
          </div>
        </div>
      ))}

      {showForm?(
        <div style={card({border:`2px solid ${P.gold}`})}>
          <div style={h3}>+ Nouvelle séance</div>
          <div style={h3}>Sport</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {SPORTS_SUGGEST.map(s=>(
              <span key={s} onClick={()=>setNewS(p=>({...p,sport:s}))}
                style={{padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${newS.sport===s?P.gold:P.beige}`,background:newS.sport===s?P.goldLight:P.soft,color:newS.sport===s?P.darkBrown:P.textLight,transition:"all 0.2s"}}>{s}</span>
            ))}
            <input style={{...inp,flex:1,minWidth:120}} placeholder="Autre sport..."
              value={SPORTS_SUGGEST.includes(newS.sport)?"":newS.sport}
              onChange={e=>setNewS(p=>({...p,sport:e.target.value}))}/>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1}}>
              <div style={h3}>Fréquence</div>
              <select style={inp} value={newS.freq} onChange={e=>setNewS(p=>({...p,freq:e.target.value}))}>
                {FREQS.map(f=><option key={f}>{f}</option>)}
              </select>
            </div>
            <div style={{flex:1}}>
              <div style={h3}>Durée</div>
              <input style={inp} placeholder="30 min" value={newS.duree} onChange={e=>setNewS(p=>({...p,duree:e.target.value}))}/>
            </div>
          </div>
          <div style={h3}>Jours</div>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {JOURS_C.map((j,idx)=>(
              <div key={idx} onClick={()=>toggleJour(idx)}
                style={{flex:1,textAlign:"center",padding:"8px 4px",borderRadius:10,cursor:"pointer",border:`1.5px solid ${newS.jours.includes(idx)?P.gold:P.beige}`,background:newS.jours.includes(idx)?P.goldLight:P.soft,fontSize:10,fontFamily:"'DM Sans',sans-serif",color:newS.jours.includes(idx)?P.darkBrown:P.textLight,transition:"all 0.2s"}}>{j}</div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={add}>Ajouter</button>
            <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button>
          </div>
        </div>
      ):(
        <button style={btn(P.beige,P.darkBrown,{width:"100%",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8})} onClick={()=>setShowForm(true)}>
          <Ico.plus/> Ajouter une activité
        </button>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 3. CYCLE
// ════════════════════════════════════════════════
const PHASES = [
  {id:"menstruelle",label:"🔴 Menstruelle",jours:"J1–J5",energie:"Basse 🌙",conseil:"Repos, chaleur, soupe réconfortante",humeur:"Sensible, introspective",sport:"Yoga doux, marche légère",alimentation:"Fer, chocolat noir, tisanes"},
  {id:"folliculaire",label:"🌱 Folliculaire",jours:"J6–J13",energie:"En hausse ☀️",conseil:"Lance tes projets, commence les choses difficiles",humeur:"Optimiste, créative",sport:"Cardio, danse, sport intense",alimentation:"Légumes, protéines légères"},
  {id:"ovulation",label:"✨ Ovulation",jours:"J14–J16",energie:"Haute 🔥",conseil:"Tes meilleurs jours ! Rendez-vous importants",humeur:"Confiante, sociable",sport:"HIIT, running, force",alimentation:"Fibres, légumes crucifères"},
  {id:"luteale",label:"🍂 Lutéale",jours:"J17–J28",energie:"Baisse progressive 🌤️",conseil:"Finalise tes projets, ralentis en fin de phase",humeur:"Variable, besoin de calme",sport:"Pilates, natation, marche",alimentation:"Magnésium, oméga-3"},
];

function TabCycle() {
  const [phase,setPhase]=useState("folliculaire");
  const [debut,setDebut]=useState("");
  const [duree,setDuree]=useState(28);
  const [symptoms,setSymptoms]=useState([]);
  const [newSymp,setNewSymp]=useState("");
  const [humeur,setHumeur]=useState(null);
  const HUMEURS = ["😊","😌","😔","😤","😮‍💨","🤗","😢","🔥"];
  const SYMPS   = ["Crampes","Fatigue","Ballonnements","Maux de tête","Fringales","Irritabilité"];
  const p = PHASES.find(x=>x.id===phase);
  const joursDepuis = debut ? Math.floor((new Date()-new Date(debut))/(1000*60*60*24))+1 : null;
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
        {PHASES.map(ph=>(
          <div key={ph.id} onClick={()=>setPhase(ph.id)}
            style={{ padding:"12px 10px",borderRadius:14,cursor:"pointer",
              border:`1.5px solid ${phase===ph.id?P.gold:P.beige}`,
              background:phase===ph.id?P.goldLight:P.card,transition:"all 0.2s" }}>
            <div style={{ fontSize:13,fontWeight:700,color:phase===ph.id?P.darkBrown:P.text,fontFamily:"'Cormorant Garamond',serif",marginBottom:2 }}>{ph.label}</div>
            <div style={{ fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif" }}>{ph.jours}</div>
          </div>
        ))}
      </div>
      {p&&(
        <div style={card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`})}>
          {[{label:"⚡ Énergie",val:p.energie},{label:"💭 Humeur",val:p.humeur},{label:"💡 Conseil",val:p.conseil},{label:"🏃‍♀️ Sport",val:p.sport},{label:"🥗 Alim.",val:p.alimentation}].map(({label,val})=>(
            <div key={label} style={{ display:"flex",gap:8,marginBottom:8,padding:"8px 0",borderBottom:`1px solid ${P.beige}` }}>
              <span style={{ fontSize:11,fontWeight:700,color:P.gold,fontFamily:"'DM Sans',sans-serif",width:100,flexShrink:0 }}>{label}</span>
              <span style={{ fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif",lineHeight:1.4 }}>{val}</span>
            </div>
          ))}
        </div>
      )}
      <div style={card()}>
        <div style={h2}>📅 Mon cycle</div>
        <div style={{ display:"flex",gap:8,marginBottom:10 }}>
          <div style={{ flex:1 }}><div style={h3}>Début règles</div><input type="date" style={inp} value={debut} onChange={e=>setDebut(e.target.value)}/></div>
          <div style={{ flex:1 }}><div style={h3}>Durée (j)</div><input type="number" style={inp} value={duree} onChange={e=>setDuree(e.target.value)}/></div>
        </div>
        {joursDepuis&&<div style={{ padding:"10px 14px",borderRadius:12,background:P.goldLight,fontSize:13,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif",textAlign:"center" }}>Jour {joursDepuis} de ton cycle ✨</div>}
      </div>
      <div style={card()}>
        <div style={h2}>🌡️ Symptômes & humeur</div>
        <div style={{ display:"flex",gap:8,marginBottom:10 }}>
          {HUMEURS.map(h=>(
            <span key={h} onClick={()=>setHumeur(h)} style={{ fontSize:22,cursor:"pointer",opacity:humeur===h?1:0.4,transform:humeur===h?"scale(1.2)":"scale(1)",display:"inline-block",transition:"all 0.2s" }}>{h}</span>
          ))}
        </div>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
          {[...SYMPS,...symptoms.filter(s=>!SYMPS.includes(s))].map(s=>{
            const active=symptoms.includes(s);
            return <span key={s} onClick={()=>setSymptoms(p=>active?p.filter(x=>x!==s):[...p,s])}
              style={{ padding:"5px 11px",borderRadius:20,fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${active?P.gold:P.beige}`,background:active?P.goldLight:P.soft,color:active?P.darkBrown:P.textLight,transition:"all 0.2s" }}>{s}</span>;
          })}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input style={{ ...inp,flex:1 }} placeholder="Autre symptôme..." value={newSymp} onChange={e=>setNewSymp(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&newSymp.trim()){ setSymptoms(p=>[...p,newSymp]); setNewSymp(""); }}} />
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={()=>{ if(newSymp.trim()){ setSymptoms(p=>[...p,newSymp]); setNewSymp(""); }}}><Ico.plus/></button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// 4. SOMMEIL
// ════════════════════════════════════════════════
function TabSommeil() {
  const [entries,setEntries]=useState([{id:1,date:"Hier",coucher:"22:30",lever:"06:30",qualite:4,note:""}]);
  const [coucher,setCoucher]=useState("");
  const [lever,setLever]=useState("");
  const [qualite,setQualite]=useState(3);
  const [note,setNote]=useState("");
  const QUALITES=["😴","😐","🙂","😊","🌟"];
  const duree=(c,l)=>{
    const [ch,cm]=c.split(":").map(Number);
    const [lh,lm]=l.split(":").map(Number);
    let min=(lh*60+lm)-(ch*60+cm);
    if(min<0) min+=24*60;
    return `${Math.floor(min/60)}h${String(min%60).padStart(2,"0")}`;
  };
  const save=()=>{
    if(coucher&&lever){
      setEntries(p=>[{id:NID++,date:"Aujourd'hui",coucher,lever,qualite,note},...p]);
      setCoucher(""); setLever(""); setNote("");
    }
  };
  return (
    <div>
      <div style={card({border:`2px solid ${P.gold}`})}>
        <div style={h2}>🌙 Cette nuit</div>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          <div style={{ flex:1 }}><div style={h3}>Coucher</div><input type="time" style={inp} value={coucher} onChange={e=>setCoucher(e.target.value)}/></div>
          <div style={{ flex:1 }}><div style={h3}>Réveil</div><input type="time" style={inp} value={lever} onChange={e=>setLever(e.target.value)}/></div>
        </div>
        {coucher&&lever&&<div style={{ textAlign:"center",fontSize:14,fontWeight:700,color:P.gold,fontFamily:"'Cormorant Garamond',serif",marginBottom:10 }}>⏱ {duree(coucher,lever)} de sommeil</div>}
        <div style={h3}>Qualité</div>
        <div style={{ display:"flex",gap:8,marginBottom:12 }}>
          {QUALITES.map((q,i)=>(
            <div key={i} onClick={()=>setQualite(i+1)} style={{ flex:1,textAlign:"center",padding:"10px 4px",borderRadius:12,cursor:"pointer",border:`1.5px solid ${qualite===i+1?P.gold:P.beige}`,background:qualite===i+1?P.goldLight:P.soft,transition:"all 0.2s" }}>
              <div style={{ fontSize:20 }}>{q}</div>
              <div style={{ fontSize:9,color:P.textLight,fontFamily:"'DM Sans',sans-serif",marginTop:2 }}>{i+1}/5</div>
            </div>
          ))}
        </div>
        <input style={{ ...inp,marginBottom:12 }} placeholder="Note..." value={note} onChange={e=>setNote(e.target.value)} />
        <button style={btn(P.darkBrown,"#fff",{width:"100%"})} onClick={save}>Enregistrer</button>
      </div>
      {entries.length>0&&(
        <div style={card()}>
          <div style={h2}>📊 Mes dernières nuits</div>
          {entries.map(e=>(
            <div key={e.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${P.beige}` }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif" }}>{e.date}</div>
                <div style={{ fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif" }}>{e.coucher} → {e.lever} · {duree(e.coucher,e.lever)}</div>
              </div>
              <span style={{ fontSize:22 }}>{QUALITES[e.qualite-1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 5. SHUKR
// ════════════════════════════════════════════════
function TabShukr() {
  const [gratitude,setGratitude]=useState(["","",""]);
  const [victoire,setVictoire]=useState("");
  const [humeur,setHumeur]=useState(null);
  const [journal,setJournal]=useState("");
  const [lettres,setLettres]=useState([]);
  const [newLettre,setNewLettre]=useState("");
  const [showLettre,setShowLettre]=useState(false);
    const dateStr=`${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
  return (
    <div>
      <div style={{ ...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"18px 20px"}) }}>
        <div style={{ fontSize:22,marginBottom:6 }}>شُكْر</div>
        <div style={{ fontSize:13,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6 }}>"La gratitude transforme ce qu'on a en suffisance. 🤍"</div>
      </div>
      <div style={card()}>
        <div style={h2}>🏆 Ma victoire du jour</div>
        <textarea style={{ ...inp,minHeight:70,resize:"none",lineHeight:1.6 }} placeholder="Quelque chose dont tu es fière..." value={victoire} onChange={e=>setVictoire(e.target.value)} />
        <div style={{ fontSize:11,color:P.textLight,marginTop:6,fontFamily:"'DM Sans',sans-serif" }}>Tenir, c'est déjà gagner. 🤍</div>
      </div>
      <div style={card()}>
        <div style={h2}>🙏 3 choses pour lesquelles je suis reconnaissante</div>
        {gratitude.map((g,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
            <div style={{ width:22,height:22,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:P.gold,fontWeight:700,flexShrink:0 }}>✦</div>
            <input style={inp} placeholder="Je suis reconnaissante pour..." value={g} onChange={e=>setGratitude(p=>p.map((x,j)=>j===i?e.target.value:x))} />
          </div>
        ))}
      </div>
      <div style={card()}>
        <div style={h2}>🌙 Comment s'est passée ta journée ?</div>
        <div style={{ display:"flex",gap:10,marginBottom:12 }}>
          {[{ico:"💛",label:"Bien"},{ico:"😮‍💨",label:"Difficile"},{ico:"🌊",label:"Compliquée"}].map(m=>(
            <div key={m.label} onClick={()=>setHumeur(m.label)} style={{ flex:1,textAlign:"center",padding:"12px 8px",borderRadius:12,border:`1.5px solid ${humeur===m.label?P.gold:P.beige}`,background:humeur===m.label?P.beige:P.soft,cursor:"pointer",transition:"all 0.2s" }}>
              <div style={{ fontSize:22 }}>{m.ico}</div>
              <div style={{ fontSize:11,color:P.text,marginTop:4,fontFamily:"'DM Sans',sans-serif" }}>{m.label}</div>
            </div>
          ))}
        </div>
        <textarea style={{ ...inp,minHeight:70,resize:"none",lineHeight:1.6 }} placeholder="Quelques mots..." value={journal} onChange={e=>setJournal(e.target.value)} />
      </div>
      <div style={card()}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <div style={h2}>💌 Lettre à moi-même</div>
          <button style={btn(P.beige,P.darkBrown,{padding:"7px 12px",fontSize:11})} onClick={()=>setShowLettre(!showLettre)}>{showLettre?"Fermer":"✍️ Écrire"}</button>
        </div>
        {showLettre&&(
          <div>
            <textarea style={{ ...inp,minHeight:120,resize:"none",lineHeight:1.7,marginBottom:10 }} placeholder="Chère moi..." value={newLettre} onChange={e=>setNewLettre(e.target.value)} />
            <div style={{ display:"flex",gap:8 }}>
              <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={()=>{ if(newLettre.trim()){ setLettres(p=>[{id:NID++,date:dateStr,text:newLettre},...p]); setNewLettre(""); setShowLettre(false); }}}>Garder</button>
              <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowLettre(false)}>Annuler</button>
            </div>
          </div>
        )}
        {lettres.map(l=>(
          <div key={l.id} style={{ padding:"12px 14px",borderRadius:12,background:P.soft,border:`1px solid ${P.beige}`,marginBottom:8 }}>
            <div style={{ fontSize:10,color:P.gold,fontFamily:"'DM Sans',sans-serif",marginBottom:4 }}>📅 {l.date}</div>
            <div style={{ fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6 }}>{l.text}</div>
          </div>
        ))}
        {lettres.length===0&&!showLettre&&<div style={{ fontSize:12,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif" }}>Tes lettres seront gardées ici. 🌿</div>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════
const TABS_SELF = [
  {id:"soins",   label:"💆‍♀️ Soins"},
  {id:"sport",   label:"🏃‍♀️ Sport"},
  {id:"cycle",   label:"🌙 Cycle"},
  {id:"sommeil", label:"😴 Sommeil"},
  
];

function SelfCare({ onBack }) {
  const [tab,setTab]=useState("soins");
  return (
    <>
            <div style={{ maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24 }}>
        <div style={{ background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
            {onBack&&<div onClick={onBack} style={{ width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0 }}><Ico.back/></div>}
            <div style={{ color:P.gold }}><Ico.heart/></div>
            <div>
              <div style={{ fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif" }}>Self Care</div>
              <div style={{ fontSize:12,color:P.textLight }}>Corps, âme & douceur</div>
            </div>
          </div>
          <div style={{ display:"flex",overflowX:"auto",scrollbarWidth:"none" }}>
            {TABS_SELF.map(t=>(
              <div key={t.id} onClick={()=>setTab(t.id)}
                style={{ flex:"0 0 auto",padding:"10px 13px 9px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",color:tab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s" }}>
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding:"18px 16px 0" }}>
          {tab==="soins"   && <TabSoins/>}
          {tab==="sport"   && <TabSport/>}
          {tab==="cycle"   && <TabCycle/>}
          {tab==="sommeil" && <TabSommeil/>}
          
        </div>
      </div>
    </>
  );
}

// ── Mini journal component ──────────────────────────────
function MiniJournal({nom,emoji,entries,setEntries}){
  const [newEntry,setNewEntry]=useState({texte:"",humeur:"🙂"});
  const HUMEURS=["🙂","😊","🌟","😔","😤","🤗","😂","💛","🥹"];
  const save=()=>{
    if(newEntry.texte.trim()){
      const d=new Date();
      setEntries(p=>[{id:NID++,date:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`,...newEntry},...p]);
      setNewEntry({texte:"",humeur:"🙂"});
    }
  };
  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,padding:"12px 16px"})}}>
        <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:2}}>📓 Journal de {nom} {emoji}</div>
        <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Ses progrès, ses premières fois, ses petits mots...</div>
      </div>
      <div style={card()}>
        <div style={h3}>Nouvelle entrée</div>
        <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
          {HUMEURS.map(e=>(
            <span key={e} onClick={()=>setNewEntry(p=>({...p,humeur:e}))} style={{fontSize:20,cursor:"pointer",opacity:newEntry.humeur===e?1:0.4,transform:newEntry.humeur===e?"scale(1.2)":"scale(1)",display:"inline-block",transition:"all 0.2s"}}>{e}</span>
          ))}
        </div>
        <textarea style={{...inp,minHeight:80,resize:"none",lineHeight:1.6,marginBottom:10}} placeholder={`Ce que ${nom} a fait aujourd'hui, ses progrès...`} value={newEntry.texte} onChange={e=>setNewEntry(p=>({...p,texte:e.target.value}))}/>
        <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={save}>Enregistrer 📓</button>
      </div>
      {entries.map(e=>(
        <div key={e.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
            <div style={{fontSize:24,flexShrink:0}}>{e.humeur}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:P.gold,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>📅 {e.date}</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.6}}>{e.texte}</div>
            </div>
            <div style={icBtn()} onClick={()=>setEntries(p=>p.filter(x=>x.id!==e.id))}><Ico.trash/></div>
          </div>
        </div>
      ))}
      {entries.length===0&&<div style={{...card({textAlign:"center",padding:"24px",background:P.soft}),fontSize:13,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Commence le journal de {nom} 🌸</div>}
    </div>
  );
}

// ── Mini notes component ────────────────────────────────
function MiniNotes({nom}){
  const [notes,setNotes]=useState([]);
  const [newNote,setNewNote]=useState("");
  const save=()=>{if(newNote.trim()){const d=new Date();setNotes(p=>[{id:NID++,date:`${d.getDate()}/${d.getMonth()+1}`,texte:newNote},...p]);setNewNote("");}};
  return(
    <div>
      <div style={card()}>
        <div style={h3}>📝 Notes libres — {nom}</div>
        <textarea style={{...inp,minHeight:80,resize:"none",lineHeight:1.6,marginBottom:10}} placeholder={`Tout ce que tu veux noter sur ${nom}, sans filtre...`} value={newNote} onChange={e=>setNewNote(e.target.value)}/>
        <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={save}>Sauvegarder</button>
      </div>
      {notes.map(n=>(
        <div key={n.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:P.gold,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>📅 {n.date}</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>{n.texte}</div>
            </div>
            <div style={icBtn()} onClick={()=>setNotes(p=>p.filter(x=>x.id!==n.id))}><Ico.trash/></div>
          </div>
        </div>
      ))}
      {notes.length===0&&<div style={{...card({textAlign:"center",padding:"24px",background:P.soft}),fontSize:13,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Tes notes sur {nom} seront ici 📝</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// 1. TASNIM
// ══════════════════════════════════════════════════════
function TabBebe(){
  const [biberons,setBiberons]=useState([
    {id:1,heure:"06:30",quantite:"150ml",note:""},
    {id:2,heure:"09:30",quantite:"120ml",note:""},
  ]);
  const [sommeil,setSommeil]=useState([{id:1,debut:"07:00",fin:"08:30",note:"Sieste matin"}]);
  const [newBib,setNewBib]=useState({heure:"",quantite:"",note:""});
  const [newDodo,setNewDodo]=useState({debut:"",fin:"",note:""});
  const [activeTab,setActiveTab]=useState("biberons");
  const [divChecks,setDivChecks]=useState({});
  const [divNotes,setDivNotes]=useState({}); // {aliment: {note, qte}}
  const [divHistory,setDivHistory]=useState([]); // [{date, aliment, note, qte}]
  const [divForm,setDivForm]=useState({aliment:"",note:"",qte:""}); // form for detail
  const [customAliments,setCustomAliments]=useState([]);
  const [newAliment,setNewAliment]=useState({nom:"",cat:"🥕 Légumes"});
  const [journalT,setJournalT]=useState([{id:501,date:"Aujourd'hui",texte:"Premier sourire spontané ce matin. Mon coeur a fondu.",humeur:"🥹"}]);

  const ALIMENTS_6M=[
    {cat:"🥕 Légumes",items:["Carotte","Courgette","Haricots verts","Brocoli","Patate douce","Potiron"]},
    {cat:"🍎 Fruits",items:["Pomme","Poire","Banane","Mangue","Avocat","Pêche"]},
    {cat:"🍚 Féculents",items:["Riz","Semoule","Pomme de terre","Pâtes"]},
    {cat:"🥩 Protéines",items:["Poulet","Dinde","Saumon","Lentilles rouges","Jaune d'oeuf"]},
  ];
  const CATS_ALIM=ALIMENTS_6M.map(a=>a.cat);
  const toggleDiv=k=>{
    setDivChecks(p=>({...p,[k]:!p[k]}));
    if(!divChecks[k]){
      // first time checking - open note form
      setDivForm({aliment:k,note:divNotes[k]?.note||"",qte:divNotes[k]?.qte||""});
    }
  };
  const saveDivNote=(aliment)=>{
    if(!divForm.note&&!divForm.qte) return;
    const d=new Date();
    const dateStr=`${d.getDate()}/${d.getMonth()+1}`;
    setDivNotes(p=>({...p,[aliment]:{note:divForm.note,qte:divForm.qte}}));
    setDivHistory(p=>[{id:NID++,date:dateStr,aliment,note:divForm.note,qte:divForm.qte},...p]);
    setDivForm({aliment:"",note:"",qte:""});
  };
  const totalBib=biberons.reduce((a,b)=>a+(parseInt(b.quantite)||0),0);
  const dureeStr=(d,f)=>{
    if(!d||!f) return "";
    const [dh,dm]=d.split(":").map(Number);
    const [fh,fm]=f.split(":").map(Number);
    let min=(fh*60+fm)-(dh*60+dm);
    if(min<0) min+=24*60;
    return `${Math.floor(min/60)}h${String(min%60).padStart(2,"0")}`;
  };

  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"16px"})}}>
        <div style={{fontSize:28,marginBottom:4}}>🍼</div>
        <div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:2}}>Tasnim</div>
        <div style={{fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>6 mois · Suivi quotidien</div>
        <div style={{marginTop:8,fontSize:12,color:P.brown,fontFamily:"'DM Sans',sans-serif",background:"rgba(255,255,255,0.6)",borderRadius:10,padding:"5px 12px",display:"inline-block"}}>
          Total biberons : <strong>{totalBib}ml</strong>
        </div>
      </div>

      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",scrollbarWidth:"none"}}>
        {[{id:"biberons",label:"🍼 Biberons"},{id:"sommeil",label:"😴 Sommeil"},{id:"divers",label:"🥕 Divers."},{id:"journal",label:"📓 Journal"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={btn(activeTab===t.id?P.darkBrown:P.beige,activeTab===t.id?"#fff":P.darkBrown,{padding:"8px 10px",fontSize:11,flexShrink:0})}>{t.label}</button>
        ))}
      </div>

      {activeTab==="biberons"&&(
        <div>
          <div style={card({padding:0,overflow:"hidden"})}>
            {biberons.map((b,i)=>(
              <div key={b.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<biberons.length-1?`1px solid ${P.beige}`:"none"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🍼</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{b.quantite}</div>
                  <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{b.heure}{b.note&&` · ${b.note}`}</div>
                </div>
                <div style={icBtn()} onClick={()=>setBiberons(p=>p.filter(x=>x.id!==b.id))}><Ico.trash/></div>
              </div>
            ))}
            {biberons.length===0&&<div style={{padding:20,textAlign:"center",color:P.textLight,fontSize:13,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Aucun biberon enregistré</div>}
          </div>
          <div style={card()}>
            <div style={h3}>+ Nouveau biberon</div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={h3}>Heure</div><input type="time" style={inp} value={newBib.heure} onChange={e=>setNewBib(p=>({...p,heure:e.target.value}))}/></div>
              <div style={{flex:1}}><div style={h3}>Quantité</div><input style={inp} placeholder="150ml" value={newBib.quantite} onChange={e=>setNewBib(p=>({...p,quantite:e.target.value}))}/></div>
            </div>
            <input style={{...inp,marginBottom:10}} placeholder="Note" value={newBib.note} onChange={e=>setNewBib(p=>({...p,note:e.target.value}))}/>
            <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={()=>{if(newBib.heure&&newBib.quantite){setBiberons(p=>[...p,{id:NID++,...newBib}]);setNewBib({heure:"",quantite:"",note:""});}}}>Ajouter</button>
          </div>
        </div>
      )}

      {activeTab==="sommeil"&&(
        <div>
          <div style={card({padding:0,overflow:"hidden"})}>
            {sommeil.map((s,i)=>(
              <div key={s.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderBottom:i<sommeil.length-1?`1px solid ${P.beige}`:"none"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:"#E8F0F8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>😴</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{s.debut} — {s.fin} {s.debut&&s.fin&&`(${dureeStr(s.debut,s.fin)})`}</div>
                  <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{s.note}</div>
                </div>
                <div style={icBtn()} onClick={()=>setSommeil(p=>p.filter(x=>x.id!==s.id))}><Ico.trash/></div>
              </div>
            ))}
          </div>
          <div style={card()}>
            <div style={h3}>+ Nouveau dodo</div>
            <div style={{display:"flex",gap:8,marginBottom:8}}>
              <div style={{flex:1}}><div style={h3}>Début</div><input type="time" style={inp} value={newDodo.debut} onChange={e=>setNewDodo(p=>({...p,debut:e.target.value}))}/></div>
              <div style={{flex:1}}><div style={h3}>Fin</div><input type="time" style={inp} value={newDodo.fin} onChange={e=>setNewDodo(p=>({...p,fin:e.target.value}))}/></div>
            </div>
            <input style={{...inp,marginBottom:10}} placeholder="Note (sieste matin, nuit...)" value={newDodo.note} onChange={e=>setNewDodo(p=>({...p,note:e.target.value}))}/>
            <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={()=>{if(newDodo.debut){setSommeil(p=>[...p,{id:NID++,...newDodo}]);setNewDodo({debut:"",fin:"",note:""});}}}>Ajouter</button>
          </div>
        </div>
      )}

      {activeTab==="divers"&&(
        <div>
          <div style={{...card({background:`linear-gradient(135deg,${P.soft},#E8F5E9)`,padding:"12px 16px",marginBottom:14})}}>
            <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>🥕 Diversification — 6 mois</div>
            <div style={{fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Coche les aliments introduits ✅ · Ajoute les tiens ➕</div>
          </div>
          {ALIMENTS_6M.map(cat=>(
            <div key={cat.cat} style={card({padding:0,overflow:"hidden"})}>
              <div style={{padding:"10px 16px 8px",background:P.soft,borderBottom:`1px solid ${P.beige}`,fontSize:11,fontWeight:700,color:P.brown,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>{cat.cat}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,padding:"12px 16px"}}>
                {[...cat.items,...customAliments.filter(a=>a.cat===cat.cat).map(a=>a.nom)].map(item=>{
                  const done=divChecks[item];
                  const noteData=divNotes[item];
                  const isOpen=divForm.aliment===item;
                  return(
                    <div key={item} style={{display:"inline-block",marginBottom:4,width:isOpen?"100%":"auto"}}>
                      <span onClick={()=>{if(isOpen){setDivForm({aliment:"",note:"",qte:""});}else{toggleDiv(item);setDivForm({aliment:item,note:noteData?.note||"",qte:noteData?.qte||""});}}}
                        style={{display:"inline-flex",alignItems:"center",gap:4,padding:"6px 12px",borderRadius:20,fontSize:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${done?P.gold:P.beige}`,background:done?P.goldLight:P.soft,color:done?P.darkBrown:P.textLight,transition:"all 0.2s"}}>
                        {done?"✓ ":""}{item}{noteData&&<span style={{fontSize:9,color:P.gold,marginLeft:2}}>📝</span>}
                      </span>
                      {isOpen&&(
                        <div style={{marginTop:6,padding:"10px 12px",borderRadius:12,background:P.soft,border:`1px solid ${P.gold}`}}>
                          <div style={{fontSize:11,fontWeight:700,color:P.gold,fontFamily:"'DM Sans',sans-serif",marginBottom:6}}>📝 {item}</div>
                          <input style={{...inp,marginBottom:6,fontSize:12,padding:"7px 10px"}} placeholder="Quantité (ex: 3 cuillères, 1/2 pot...)" value={divForm.qte} onChange={e=>setDivForm(p=>({...p,qte:e.target.value}))}/>
                          <input style={{...inp,marginBottom:8,fontSize:12,padding:"7px 10px"}} placeholder="Note (réaction, goût, toléré...)" value={divForm.note} onChange={e=>setDivForm(p=>({...p,note:e.target.value}))}/>
                          <div style={{display:"flex",gap:8}}>
                            <button style={btn(P.gold,P.darkBrown,{flex:1,padding:"8px",fontSize:11})} onClick={()=>saveDivNote(item)}>💾 Enregistrer</button>
                            <button style={btn(P.beige,P.darkBrown,{padding:"8px 12px",fontSize:11})} onClick={()=>setDivForm({aliment:"",note:"",qte:""})}>✕</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {divHistory.length>0&&(
            <div style={card({padding:0,overflow:"hidden"})}>
              <div style={{padding:"10px 16px 8px",background:P.soft,borderBottom:`1px solid ${P.beige}`,fontSize:11,fontWeight:700,color:P.brown,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'DM Sans',sans-serif"}}>
                📅 Historique des repas
              </div>
              {divHistory.map(h=>(
                <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",borderBottom:`1px solid ${P.beige}`}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{h.aliment}</div>
                    {h.qte&&<div style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>⚖️ {h.qte}</div>}
                    {h.note&&<div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>{h.note}</div>}
                  </div>
                  <div style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>📅 {h.date}</div>
                </div>
              ))}
            </div>
          )}
                    <div style={card()}>
            <div style={h3}>+ Ajouter un aliment</div>
            <div style={{display:"flex",gap:8}}>
              <input style={{...inp,flex:2}} placeholder="Nom de l'aliment" value={newAliment.nom} onChange={e=>setNewAliment(p=>({...p,nom:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&newAliment.nom.trim()){setCustomAliments(p=>[...p,{...newAliment}]);setNewAliment({nom:"",cat:"🥕 Légumes"});}}}/>
              <select style={{...inp,flex:1,padding:"9px 8px",fontSize:11}} value={newAliment.cat} onChange={e=>setNewAliment(p=>({...p,cat:e.target.value}))}>
                {CATS_ALIM.map(c=><option key={c}>{c}</option>)}
              </select>
              <button style={btn(P.gold,P.darkBrown,{padding:"10px 12px"})} onClick={()=>{if(newAliment.nom.trim()){setCustomAliments(p=>[...p,{...newAliment}]);setNewAliment({nom:"",cat:"🥕 Légumes"});}}}><Ico.plus/></button>
            </div>
          </div>
        </div>
      )}

      {activeTab==="journal"&&<MiniJournal nom="Tasnim" emoji="🍼" entries={journalT} setEntries={setJournalT}/>}
      
    </div>
  );
}

// ══════════════════════════════════════════════════════
// 2. RYM
// ══════════════════════════════════════════════════════
function TabEnfants(){
  const [routineMatin,setRoutineMatin]=useState([
    {id:1,text:"Se lever",locked:true},{id:2,text:"Toilette 🚿",locked:true},
    {id:3,text:"S'habiller",locked:false},{id:4,text:"Petit-déjeuner 🥣",locked:true},
    {id:5,text:"Préparer cartable 🎒",locked:false},
  ]);
  const [routineSoir,setRoutineSoir]=useState([
    {id:6,text:"Goûter 🍎",locked:false},{id:7,text:"Devoirs 📚",locked:false},
    {id:8,text:"Bain / douche 🚿",locked:true},{id:9,text:"Pyjama",locked:false},
    {id:10,text:"Histoire du soir 📖",locked:true},{id:11,text:"Bisou dodo 🌙",locked:true},
  ]);
  const [activites,setActivites]=useState([
    {id:1,text:"Peinture 🎨 · 30 min",locked:false},{id:2,text:"Jeu de société 🎲 · 20 min",locked:false},
    {id:3,text:"Lecture ensemble 📚 · 15 min",locked:true},{id:4,text:"Danse 💃 · 15 min",locked:false},
    {id:5,text:"Pâte à modeler 🟡 · 30 min",locked:false},
  ]);
  const [souvenirs,setSouvenirs]=useState([{id:1,date:"Aujourd'hui",text:"Rym a dit 'Maman t es la plus belle du monde' 🥹",emoji:"🥹"}]);
  const [newSouv,setNewSouv]=useState("");
  const [newEmoji,setNewEmoji]=useState("🥹");
  const [journalR,setJournalR]=useState([{id:601,date:"Aujourd'hui",texte:"Rym a appris à faire ses lacets toute seule ! 🎉",humeur:"🌟"}]);
  const [activeTab,setActiveTab]=useState("matin");
  const EMOJIS=["🥹","😂","💛","🌟","📸","🎉","💪","🤗"];

  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"14px"})}}>
        <div style={{fontSize:26,marginBottom:3}}>👧</div>
        <div style={{fontSize:16,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>Rym · 5 ans</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",scrollbarWidth:"none"}}>
        {[{id:"matin",label:"☀️ Matin"},{id:"soir",label:"🌙 Soir"},{id:"activites",label:"🎨 Activités"},{id:"souvenirs",label:"💛 Souvenirs"},{id:"journal",label:"📓 Journal"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={btn(activeTab===t.id?P.darkBrown:P.beige,activeTab===t.id?"#fff":P.darkBrown,{padding:"8px 10px",fontSize:11,flexShrink:0})}>{t.label}</button>
        ))}
      </div>
      {activeTab==="matin"&&<div><div style={h2}>☀️ Routine du matin</div><EC items={routineMatin} setItems={setRoutineMatin} placeholder="Ex: Prendre vitamines 💊"/></div>}
      {activeTab==="soir"&&<div><div style={h2}>🌙 Routine du soir</div><EC items={routineSoir} setItems={setRoutineSoir} placeholder="Ex: Préparer tenue du lendemain"/></div>}
      {activeTab==="activites"&&<div><div style={h2}>🎨 Idées d'activités</div><EC items={activites} setItems={setActivites} placeholder="Ex: Origami 🦢 · 20 min" emptyMsg="Ajoute des idées d'activités ✨"/></div>}
      {activeTab==="souvenirs"&&(
        <div>
          <div style={card()}>
            <div style={h3}>✨ Ajouter un souvenir</div>
            <textarea style={{...inp,minHeight:70,resize:"none",lineHeight:1.6,marginBottom:10}} placeholder="Une phrase drôle, un moment précieux..." value={newSouv} onChange={e=>setNewSouv(e.target.value)}/>
            <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
              {EMOJIS.map(e=>(<span key={e} onClick={()=>setNewEmoji(e)} style={{fontSize:22,cursor:"pointer",opacity:newEmoji===e?1:0.4,transform:newEmoji===e?"scale(1.2)":"scale(1)",display:"inline-block",transition:"all 0.2s"}}>{e}</span>))}
            </div>
            <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={()=>{if(newSouv.trim()){const d=new Date();setSouvenirs(p=>[{id:NID++,date:`${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`,text:newSouv,emoji:newEmoji},...p]);setNewSouv("");}}}>Garder ce souvenir 💛</button>
          </div>
          {souvenirs.map(s=>(
            <div key={s.id} style={card({padding:0,overflow:"hidden"})}>
              <div style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px"}}>
                <div style={{fontSize:28,flexShrink:0}}>{s.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:P.gold,fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>📅 {s.date}</div>
                  <div style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6}}>"{s.text}"</div>
                </div>
                <div style={icBtn()} onClick={()=>setSouvenirs(p=>p.filter(x=>x.id!==s.id))}><Ico.trash/></div>
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab==="journal"&&<MiniJournal nom="Rym" emoji="👧" entries={journalR} setEntries={setJournalR}/>}
      
    </div>
  );
}

// ══════════════════════════════════════════════════════
// 3. SORTIES
// ══════════════════════════════════════════════════════
const SORTIES_INIT=[
  {text:"Parc d'attractions 🎡",cat:"🎠 Loisirs",age:"Toutes",id:1,done:false,fav:false},
  {text:"Zoo 🦁",cat:"🦁 Nature",age:"Toutes",id:2,done:false,fav:false},
  {text:"Musée des enfants 🎨",cat:"🎨 Culture",age:"5+",id:3,done:false,fav:false},
  {text:"Piscine 🏊",cat:"🏊 Sport",age:"Toutes",id:4,done:false,fav:false},
  {text:"Forêt / randonnée 🌲",cat:"🦁 Nature",age:"Toutes",id:5,done:false,fav:false},
  {text:"Cinéma 🎬",cat:"🎨 Culture",age:"5+",id:6,done:false,fav:false},
  {text:"Ferme pédagogique 🐄",cat:"🦁 Nature",age:"Toutes",id:7,done:false,fav:false},
  {text:"Trampoline park 🤸",cat:"🎠 Loisirs",age:"3+",id:8,done:false,fav:false},
  {text:"Sortie plage / lac 🏖️",cat:"🦁 Nature",age:"Toutes",id:9,done:false,fav:false},
];
const CATS_SORTIES=["Toutes","🎠 Loisirs","🦁 Nature","🎨 Culture","🏊 Sport"];

function TabSorties(){
  const [sorties,setSorties]=useState(SORTIES_INIT);
  const [filter,setFilter]=useState("Toutes");
  const [newSortie,setNewSortie]=useState({text:"",cat:"🎠 Loisirs",age:"Toutes"});
  const [showForm,setShowForm]=useState(false);
  const [rdvs,setRdvs]=useState([
    {id:1,titre:"Bibliothèque 📚",date:"2026-04-10",heure:"14:00",enfant:"Rym",note:""},
    {id:2,titre:"Anniversaire Nour 🎂",date:"2026-04-20",heure:"15:00",enfant:"Rym",note:"Cadeau à prévoir"},
  ]);
  const [newRdv,setNewRdv]=useState({titre:"",date:"",heure:"",enfant:"Rym",note:""});
  const [showRdv,setShowRdv]=useState(false);
  const [activeTab,setActiveTab]=useState("idees");
  const toggleDone=id=>setSorties(p=>p.map(s=>s.id===id?{...s,done:!s.done}:s));
  const toggleFav =id=>setSorties(p=>p.map(s=>s.id===id?{...s,fav:!s.fav}:s));
  const del       =id=>setSorties(p=>p.filter(s=>s.id!==id));
  const add       =()=>{if(newSortie.text.trim()){setSorties(p=>[...p,{id:NID++,...newSortie,done:false,fav:false}]);setNewSortie({text:"",cat:"🎠 Loisirs",age:"Toutes"});setShowForm(false);}};
  const addRdv    =()=>{if(newRdv.titre&&newRdv.date){setRdvs(p=>[...p,{id:NID++,...newRdv}]);setNewRdv({titre:"",date:"",heure:"",enfant:"Rym",note:""});setShowRdv(false);}};
  const filtered  =filter==="Toutes"?sorties:sorties.filter(s=>s.cat===filter);
  const favs      =sorties.filter(s=>s.fav);

  return(
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {[{id:"idees",label:"🎡 Idées"},{id:"rdv",label:"📅 Rendez-vous"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={btn(activeTab===t.id?P.darkBrown:P.beige,activeTab===t.id?"#fff":P.darkBrown,{flex:1,padding:"9px 14px",fontSize:12})}>{t.label}</button>
        ))}
      </div>
      {activeTab==="idees"&&(
        <div>
          {favs.length>0&&(
            <div style={{marginBottom:14}}>
              <div style={h3}>⭐ Mes favoris</div>
              <div style={{display:"flex",gap:8,overflowX:"auto",scrollbarWidth:"none"}}>
                {favs.map(s=>(
                  <div key={s.id} style={{flex:"0 0 auto",padding:"10px 14px",borderRadius:12,background:P.goldLight,border:`1px solid ${P.gold}`,minWidth:130}}>
                    <div style={{fontSize:13,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:2}}>{s.text}</div>
                    <div style={{fontSize:10,color:P.brown,fontFamily:"'DM Sans',sans-serif"}}>{s.age} · {s.cat}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",gap:6,overflowX:"auto",marginBottom:14,scrollbarWidth:"none"}}>
            {CATS_SORTIES.map(c=>(
              <span key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",flexShrink:0,fontFamily:"'DM Sans',sans-serif",border:`1.5px solid ${filter===c?P.gold:P.beige}`,background:filter===c?P.goldLight:P.soft,color:filter===c?P.darkBrown:P.textLight,fontWeight:filter===c?600:400,transition:"all 0.2s"}}>{c}</span>
            ))}
          </div>
          {filtered.map(s=>(
            <div key={s.id} style={card({padding:0,overflow:"hidden"})}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px"}}>
                <div onClick={()=>toggleDone(s.id)} style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${s.done?P.gold:P.beigeDeep}`,background:s.done?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>
                  {s.done&&<Ico.check/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,color:s.done?P.textLight:P.darkBrown,textDecoration:s.done?"line-through":"none",fontFamily:"'Cormorant Garamond',serif",fontWeight:600,marginBottom:2}}>{s.text}</div>
                  <div style={{display:"flex",gap:8}}>
                    <span style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{s.cat}</span>
                    <span style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>👧 {s.age}</span>
                  </div>
                </div>
                <div onClick={()=>toggleFav(s.id)} style={{color:s.fav?P.gold:P.taupe,cursor:"pointer",padding:4}}><Ico.star/></div>
                <div style={icBtn()} onClick={()=>del(s.id)}><Ico.trash/></div>
              </div>
            </div>
          ))}
          {showForm?(
            <div style={card({border:`2px solid ${P.gold}`})}>
              <div style={h3}>+ Nouvelle idée de sortie</div>
              <input style={{...inp,marginBottom:8}} placeholder="Idée de sortie..." value={newSortie.text} onChange={e=>setNewSortie(p=>({...p,text:e.target.value}))} autoFocus/>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <select style={{...inp,flex:1,padding:"9px 8px",fontSize:12}} value={newSortie.cat} onChange={e=>setNewSortie(p=>({...p,cat:e.target.value}))}>
                  {CATS_SORTIES.filter(c=>c!=="Toutes").map(c=><option key={c}>{c}</option>)}
                </select>
                <input style={{...inp,flex:1}} placeholder="Âge min." value={newSortie.age} onChange={e=>setNewSortie(p=>({...p,age:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={add}>Ajouter</button>
                <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button>
              </div>
            </div>
          ):(
            <button style={btn(P.beige,P.darkBrown,{width:"100%"})} onClick={()=>setShowForm(true)}>+ Ajouter une idée</button>
          )}
        </div>
      )}
      {activeTab==="rdv"&&(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={h2}>📅 Rendez-vous & sorties planifiées</div>
            <button style={btn(P.gold,P.darkBrown,{padding:"7px 12px",fontSize:11})} onClick={()=>setShowRdv(!showRdv)}>+ Ajouter</button>
          </div>
          {showRdv&&(
            <div style={card({border:`2px solid ${P.gold}`,marginBottom:14})}>
              <input style={{...inp,marginBottom:8}} placeholder="Titre" value={newRdv.titre} onChange={e=>setNewRdv(p=>({...p,titre:e.target.value}))} autoFocus/>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input type="date" style={{...inp,flex:1}} value={newRdv.date} onChange={e=>setNewRdv(p=>({...p,date:e.target.value}))}/>
                <input type="time" style={{...inp,flex:1}} value={newRdv.heure} onChange={e=>setNewRdv(p=>({...p,heure:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <select style={{...inp,flex:1,padding:"9px 8px",fontSize:12}} value={newRdv.enfant} onChange={e=>setNewRdv(p=>({...p,enfant:e.target.value}))}>
                  <option>Rym</option><option>Tasnim</option><option>Toutes les deux</option>
                </select>
                <input style={{...inp,flex:2}} placeholder="Note" value={newRdv.note} onChange={e=>setNewRdv(p=>({...p,note:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={addRdv}>Ajouter</button>
                <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowRdv(false)}>Annuler</button>
              </div>
            </div>
          )}
          {rdvs.sort((a,b)=>a.date.localeCompare(b.date)).map(r=>(
            <div key={r.id} style={card({padding:0,overflow:"hidden"})}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px"}}>
                <div style={{width:36,height:36,borderRadius:10,background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {r.enfant==="Tasnim"?"🍼":r.enfant==="Toutes les deux"?"👧":"👧"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{r.titre}</div>
                  <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{r.enfant} · {r.date}{r.heure&&` à ${r.heure}`}{r.note&&` · ${r.note}`}</div>
                </div>
                <div style={icBtn()} onClick={()=>setRdvs(p=>p.filter(x=>x.id!==r.id))}><Ico.trash/></div>
              </div>
            </div>
          ))}
          {rdvs.length===0&&<div style={{...card({textAlign:"center",padding:"28px",background:`linear-gradient(135deg,${P.soft},${P.goldLight})`}),fontSize:13,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Aucun rendez-vous prévu 🌿</div>}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// 4. MÉDICAL
// ══════════════════════════════════════════════════════
function TabMedical(){
  const [activeTab,setActiveTab]=useState("rdvs");
  const [rdvs,setRdvs]=useState([
    {id:1,enfant:"Tasnim",type:"Pédiatre",date:"2026-04-15",heure:"10:00",note:"Vaccin 6 mois"},
    {id:2,enfant:"Rym",type:"Dentiste",date:"2026-05-02",heure:"14:30",note:""},
  ]);
  const [aPrendre,setAPrendre]=useState([
    {id:1,texte:"Bilan 9 mois Tasnim — pédiatre",enfant:"Tasnim"},
    {id:2,texte:"Ophtalmo Rym — contrôle vision",enfant:"Rym"},
    {id:3,texte:"Kiné Tasnim — bilan moteur",enfant:"Tasnim"},
  ]);
  const [newAPrendre,setNewAPrendre]=useState({texte:"",enfant:"Tasnim"});
  const [showAP,setShowAP]=useState(false);
  const [showForm,setShowForm]=useState(false);
  const [newRdv,setNewRdv]=useState({enfant:"Tasnim",type:"Pédiatre",date:"",heure:"",note:""});
  const [vaccins,setVaccins]=useState({
    "Tasnim":[
      {id:1,nom:"BCG",fait:true,date:"Naissance"},{id:2,nom:"Hépatite B",fait:true,date:"Naissance"},
      {id:3,nom:"DTCaP + Hib + Hépatite B",fait:false,date:"2 mois"},{id:4,nom:"Méningocoque C",fait:false,date:"5 mois"},{id:5,nom:"ROR",fait:false,date:"12 mois"},
    ],
    "Rym":[
      {id:6,nom:"BCG",fait:true,date:"Naissance"},{id:7,nom:"DTCaP + Hib + Hépatite B",fait:true,date:"2 mois"},
      {id:8,nom:"ROR",fait:true,date:"12 mois"},{id:9,nom:"Rappel DTP",fait:false,date:"6 ans"},
    ],
  });
  const [activeEnf,setActiveEnf]=useState("Tasnim");
  const toggleVaccin=(enf,id)=>setVaccins(p=>({...p,[enf]:p[enf].map(v=>v.id===id?{...v,fait:!v.fait}:v)}));
  const addAP=()=>{if(newAPrendre.texte.trim()){setAPrendre(p=>[...p,{id:NID++,...newAPrendre}]);setNewAPrendre({texte:"",enfant:"Tasnim"});setShowAP(false);}};

  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[{id:"rdvs",label:"📅 RDV planifiés"},{id:"aprendre",label:"📋 À prendre"},{id:"vaccins",label:"💉 Vaccins"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={btn(activeTab===t.id?P.darkBrown:P.beige,activeTab===t.id?"#fff":P.darkBrown,{flex:1,padding:"8px 10px",fontSize:11})}>{t.label}</button>
        ))}
      </div>

      {/* ── À PRENDRE ── */}
      {activeTab==="aprendre"&&(
        <div>
          <div style={{...card({background:"#FFF8E1",border:"1px solid #FFE082",padding:"11px 16px",marginBottom:14})}}>
            <div style={{fontSize:13,fontWeight:600,color:"#E65100",fontFamily:"'DM Sans',sans-serif",marginBottom:2}}>📋 RDV à programmer</div>
            <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Note ici les RDV que tu dois encore prendre. Ne les oublie plus ! 🌿</div>
          </div>
          {aPrendre.map(a=>(
            <div key={a.id} style={card({padding:0,overflow:"hidden"})}>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px"}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:a.enfant==="Tasnim"?P.goldLight:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                  {a.enfant==="Tasnim"?"🍼":"👧"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif",marginBottom:2}}>{a.texte}</div>
                  <div style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{a.enfant}</div>
                </div>
                <div style={icBtn()} onClick={()=>setAPrendre(p=>p.filter(x=>x.id!==a.id))}><Ico.trash/></div>
              </div>
            </div>
          ))}
          {showAP?(
            <div style={card({border:`2px solid ${P.gold}`})}>
              <div style={h3}>+ Nouveau RDV à prendre</div>
              <input style={{...inp,marginBottom:8}} placeholder="Ex: Bilan 9 mois pédiatre" autoFocus value={newAPrendre.texte} onChange={e=>setNewAPrendre(p=>({...p,texte:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addAP()}/>
              <select style={{...inp,marginBottom:12,padding:"9px 10px",fontSize:12}} value={newAPrendre.enfant} onChange={e=>setNewAPrendre(p=>({...p,enfant:e.target.value}))}>
                <option>Tasnim</option><option>Rym</option><option>Les deux</option>
              </select>
              <div style={{display:"flex",gap:8}}>
                <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={addAP}>Ajouter</button>
                <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowAP(false)}>Annuler</button>
              </div>
            </div>
          ):(
            <button style={btn(P.beige,P.darkBrown,{width:"100%"})} onClick={()=>setShowAP(true)}>+ Ajouter un RDV à prendre</button>
          )}
          {aPrendre.length===0&&!showAP&&<div style={{...card({textAlign:"center",padding:"24px",background:P.soft}),fontSize:13,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Aucun RDV en attente 🌿</div>}
        </div>
      )}

      {/* ── RDV PLANIFIÉS ── */}
      {activeTab==="rdvs"&&(
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={h2}>📅 Rendez-vous médicaux</div>
            <button style={btn(P.gold,P.darkBrown,{padding:"7px 12px",fontSize:11})} onClick={()=>setShowForm(!showForm)}>+ Ajouter</button>
          </div>
          {showForm&&(
            <div style={{marginBottom:14,padding:"12px",borderRadius:12,background:P.soft,border:`1px solid ${P.beige}`}}>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <select style={{...inp,flex:1,padding:"9px 8px",fontSize:12}} value={newRdv.enfant} onChange={e=>setNewRdv(p=>({...p,enfant:e.target.value}))}><option>Tasnim</option><option>Rym</option></select>
                <input style={{...inp,flex:2}} placeholder="Type (pédiatre...)" value={newRdv.type} onChange={e=>setNewRdv(p=>({...p,type:e.target.value}))}/>
              </div>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input type="date" style={{...inp,flex:1}} value={newRdv.date} onChange={e=>setNewRdv(p=>({...p,date:e.target.value}))}/>
                <input type="time" style={{...inp,flex:1}} value={newRdv.heure} onChange={e=>setNewRdv(p=>({...p,heure:e.target.value}))}/>
              </div>
              <input style={{...inp,marginBottom:10}} placeholder="Note" value={newRdv.note} onChange={e=>setNewRdv(p=>({...p,note:e.target.value}))}/>
              <div style={{display:"flex",gap:8}}>
                <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={()=>{if(newRdv.date){setRdvs(p=>[...p,{id:NID++,...newRdv}]);setNewRdv({enfant:"Tasnim",type:"Pédiatre",date:"",heure:"",note:""});setShowForm(false);}}}>Ajouter</button>
                <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button>
              </div>
            </div>
          )}
          {rdvs.sort((a,b)=>a.date.localeCompare(b.date)).map((r,i)=>(
            <div key={r.id} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<rdvs.length-1?`1px solid ${P.beige}`:"none"}}>
              <div style={{width:36,height:36,borderRadius:10,background:r.enfant==="Tasnim"?P.goldLight:"#E8F5E9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{r.enfant==="Tasnim"?"🍼":"👧"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{r.type}</div>
                <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{r.enfant} · {r.date}{r.heure&&` à ${r.heure}`}{r.note&&` · ${r.note}`}</div>
              </div>
              <div style={icBtn()} onClick={()=>setRdvs(p=>p.filter(x=>x.id!==r.id))}><Ico.trash/></div>
            </div>
          ))}
        </div>
      )}

      {/* ── VACCINS ── */}
      {activeTab==="vaccins"&&(
        <div style={card()}>
          <div style={h2}>💉 Vaccinations</div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["Tasnim","Rym"].map(e=>(
              <button key={e} onClick={()=>setActiveEnf(e)} style={btn(activeEnf===e?P.darkBrown:P.beige,activeEnf===e?"#fff":P.darkBrown,{flex:1,padding:"8px 14px",fontSize:12})}>{activeEnf===e?"✓ ":""}{e}</button>
            ))}
          </div>
          {(vaccins[activeEnf]||[]).map((v,i)=>(
            <div key={v.id} onClick={()=>toggleVaccin(activeEnf,v.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<vaccins[activeEnf].length-1?`1px solid ${P.beige}`:"none",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:7,border:`1.5px solid ${v.fait?P.gold:P.beigeDeep}`,background:v.fait?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{v.fait&&<Ico.check/>}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,color:v.fait?P.textLight:P.text,textDecoration:v.fait?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{v.nom}</div>
                <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{v.date}</div>
              </div>
              {v.fait&&<span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:P.goldLight,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>✓ Fait</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════
const TABS_FAM=[
  {id:"bebe",    label:"🍼 Tasnim"},
  {id:"enfants", label:"👧 Rym"},
  {id:"sorties", label:"🎭 Sorties"},
  {id:"medical", label:"🏥 Médical"},
];

function Famille({onBack}){
  const [tab,setTab]=useState("bebe");
  return(
    <>
            <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24}}>
        <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><Ico.back/></div>}
            <div style={{color:P.gold}}><Ico.baby/></div>
            <div>
              <div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Famille</div>
              <div style={{fontSize:12,color:P.textLight}}>Rym et Tasnim 🤍</div>
            </div>
          </div>
          <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
            {TABS_FAM.map(t=>(
              <div key={t.id} onClick={()=>setTab(t.id)}
                style={{flex:"0 0 auto",padding:"10px 14px 9px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:tab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"18px 16px 0"}}>
          {tab==="bebe"    &&<TabBebe/>}
          {tab==="enfants" &&<TabEnfants/>}
          {tab==="sorties" &&<TabSorties/>}
          {tab==="medical" &&<TabMedical/>}
        </div>
      </div>
    </>
  );
}

// ── ICONS ──────────────────────────────────────────────


// ════════════════════════════════════════════════
// 1. MEAL PLANNER + BUDGET
// ════════════════════════════════════════════════
const REPAS_INIT = JOURS.reduce((acc,j)=>({...acc,[j]:{petitdej:"",collation:"",midi:"",gouter:"",soir:"",enfants:""}}),{});

function TabMealPlanner() {
  const [repas,   setRepas]   = useState(REPAS_INIT);
  const [budget,  setBudget]  = useState("");
  const [depense, setDepense] = useState("");
  const [activeJ, setActiveJ] = useState("Lundi");
  const [view,    setView]    = useState("semaine"); // semaine | jour

  const update = (j,slot,val) => setRepas(p=>({...p,[j]:{...p[j],[slot]:val}}));

  const filled = JOURS.filter(j=>repas[j].midi||repas[j].soir).length;
  const resteBudget = budget && depense ? (Number(budget)-Number(depense)).toFixed(2) : null;

  return (
    <div>
      {/* Budget */}
      <div style={card({padding:"14px 16px"})}>
        <div style={h2}>💰 Budget de la semaine</div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <div style={h3}>Prévu</div>
            <div style={{ position:"relative" }}>
              <input style={{ ...inp, paddingRight:28 }} placeholder="0" type="number"
                value={budget} onChange={e=>setBudget(e.target.value)} />
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                fontSize:13, color:P.textLight }}>€</span>
            </div>
          </div>
          <div style={{ flex:1 }}>
            <div style={h3}>Dépensé</div>
            <div style={{ position:"relative" }}>
              <input style={{ ...inp, paddingRight:28 }} placeholder="0" type="number"
                value={depense} onChange={e=>setDepense(e.target.value)} />
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
                fontSize:13, color:P.textLight }}>€</span>
            </div>
          </div>
        </div>
        {resteBudget!==null && (
          <div style={{ padding:"10px 14px", borderRadius:12,
            background:Number(resteBudget)<0?"#FFEBEE":"#E8F5E9",
            color:Number(resteBudget)<0?"#C62828":"#2E7D32",
            fontSize:13, fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>
            {Number(resteBudget)<0
              ? `⚠️ Dépassement de ${Math.abs(resteBudget)}€`
              : `✓ Il reste ${resteBudget}€ de budget`}
          </div>
        )}
      </div>

      {/* Vue toggle */}
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        {["semaine","jour"].map(v=>(
          <button key={v} onClick={()=>setView(v)}
            style={btn(view===v?P.darkBrown:P.beige,view===v?"#fff":P.darkBrown,
              {padding:"8px 16px",fontSize:12,flex:1})}>
            {v==="semaine"?"📅 Semaine":"☀️ Jour par jour"}
          </button>
        ))}
      </div>

      {/* Vue semaine — grille compacte */}
      {view==="semaine"&&(
        <div>
          <div style={{ fontSize:11, color:P.textLight, marginBottom:10,
            fontFamily:"'DM Sans',sans-serif" }}>
            {filled}/7 jours planifiés
          </div>
          {JOURS.map(j=>(
            <div key={j} style={card({padding:0,overflow:"hidden"})}>
              <div style={{ padding:"10px 16px 8px", background:P.soft,
                borderBottom:`1px solid ${P.beige}`, fontSize:13, fontWeight:700,
                color:P.darkBrown, fontFamily:"'Cormorant Garamond',serif" }}>{j}</div>
              <div style={{ padding:"10px 16px 12px", display:"flex", flexDirection:"column", gap:8 }}>
                {[{slot:"petitdej",label:"🌅 Petit-déj"},{slot:"collation",label:"🍎 Collation"},{slot:"midi",label:"🌞 Midi"},{slot:"gouter",label:"🌤️ Goûter"},{slot:"soir",label:"🌙 Soir"},{slot:"enfants",label:"👧 Enfants"}].map(({slot,label})=>(
                  <div key={slot} style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:11, color:P.gold, width:72, flexShrink:0,
                      fontFamily:"'DM Sans',sans-serif" }}>{label}</span>
                    <input style={{ ...inp, flex:1, padding:"8px 12px", fontSize:12 }}
                      placeholder="Menu..."
                      value={repas[j][slot]}
                      onChange={e=>update(j,slot,e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue jour */}
      {view==="jour"&&(
        <div>
          {/* Nav jours */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:14, scrollbarWidth:"none" }}>
            {JOURS.map((j,i)=>{
              const hasMenu = repas[j].midi||repas[j].soir;
              return (
                <div key={j} onClick={()=>setActiveJ(j)}
                  style={{ flex:"0 0 auto", display:"flex", flexDirection:"column",
                    alignItems:"center", gap:4, padding:"10px 10px 8px", borderRadius:14,
                    cursor:"pointer", border:`1.5px solid ${activeJ===j?P.gold:P.beige}`,
                    background:activeJ===j?P.goldLight:P.card, transition:"all 0.2s" }}>
                  <span style={{ fontSize:10, color:activeJ===j?P.darkBrown:P.textLight,
                    fontFamily:"'DM Sans',sans-serif", textTransform:"uppercase",
                    letterSpacing:"0.05em" }}>{JOURS_COURT[i]}</span>
                  {hasMenu&&<div style={{ width:5, height:5, borderRadius:"50%",
                    background:activeJ===j?P.darkBrown:P.gold }}/>}
                </div>
              );
            })}
          </div>

          <div style={card()}>
            <div style={h2}>{activeJ}</div>
            {[{slot:"petitdej",label:"🌅 Petit-déjeuner",ph:"Qu'est-ce que tu prends au petit-déj ?"},
              {slot:"collation",label:"🍎 Collation matin",ph:"Une petite collation ?"},
              {slot:"midi",label:"🌞 Midi",ph:"Qu'est-ce qu'on mange à midi ?"},
              {slot:"gouter",label:"🌤️ Goûter",ph:"Le goûter..."},
              {slot:"soir",label:"🌙 Soir",ph:"Et ce soir ?"},
              {slot:"enfants",label:"👧 Enfants",ph:"Menu des enfants..."}
            ].map(({slot,label,ph})=>(
              <div key={slot} style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, color:P.gold, fontFamily:"'DM Sans',sans-serif",
                  fontWeight:600, marginBottom:6 }}>{label}</div>
                <input style={inp} placeholder={ph}
                  value={repas[activeJ][slot]}
                  onChange={e=>update(activeJ,slot,e.target.value)} />
              </div>
            ))}
          </div>

          {/* Lien courses */}
          <div style={{ ...card({background:`linear-gradient(135deg,${P.soft},${P.beige})`,
            display:"flex",alignItems:"center",gap:12,cursor:"pointer",padding:"14px 16px"}) }}>
            <div style={{ color:P.gold }}><Ico.link/></div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:P.darkBrown,
                fontFamily:"'DM Sans',sans-serif" }}>Voir la liste de courses</div>
              <div style={{ fontSize:11, color:P.textLight, fontFamily:"'DM Sans',sans-serif" }}>
                Disponible dans la section Organisation 🏠
              </div>
            </div>
            <div style={{ color:P.taupe, fontSize:16 }}>→</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 2. RECETTES + GÉNÉRATEUR FICHE
// ════════════════════════════════════════════════
const RECETTES_INIT = [
  {
    id:1, nom:"Poulet rôti aux herbes", categorie:"🍗 Viandes", temps:"45 min",
    portions:4, fav:true,
    ingredients:["1 poulet entier","Herbes de Provence","2 gousses d'ail","Huile d'olive","Sel, poivre"],
    etapes:["Préchauffer le four à 200°C","Badigeonner le poulet d'huile","Frotter avec les herbes et l'ail","Enfourner 45 min","Laisser reposer 5 min avant de servir"],
    note:"Délicieux avec des légumes rôtis 🥕"
  },
  {
    id:2, nom:"Soupe de lentilles corail", categorie:"🥣 Soupes", temps:"25 min",
    portions:4, fav:false,
    ingredients:["200g lentilles corail","1 oignon","2 carottes","Cumin, curcuma","Bouillon de légumes"],
    etapes:["Faire revenir l'oignon","Ajouter les carottes et épices","Verser les lentilles et le bouillon","Cuire 20 min","Mixer selon goût"],
    note:"Parfaite pour le batch cooking 🍲"
  },
];

const CATS_RECETTES = ["Tout","🍗 Viandes","🐟 Poissons","🥗 Végétarien","🥣 Soupes","🍰 Desserts","🥘 Plats complets"];

function TabRecettes() {
  const [recettes, setRecettes] = useState(RECETTES_INIT);
  const [filter,   setFilter]   = useState("Tout");
  const [detail,   setDetail]   = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFiche,setShowFiche]= useState(null);

  // Form nouvelle recette
  const [form, setForm] = useState({
    nom:"", categorie:"🥘 Plats complets", temps:"", portions:4,
    ingredients:"", etapes:"", note:""
  });

  const toggleFav = id => setRecettes(p=>p.map(r=>r.id===id?{...r,fav:!r.fav}:r));
  const del       = id => { setRecettes(p=>p.filter(r=>r.id!==id)); setDetail(null); };

  const saveRecette = () => {
    if(!form.nom.trim()) return;
    const newR = {
      id: NID++,
      nom: form.nom,
      categorie: form.categorie,
      temps: form.temps,
      portions: Number(form.portions),
      fav: false,
      ingredients: form.ingredients.split("\n").filter(Boolean),
      etapes: form.etapes.split("\n").filter(Boolean),
      note: form.note,
    };
    setRecettes(p=>[...p, newR]);
    setForm({nom:"",categorie:"🥘 Plats complets",temps:"",portions:4,ingredients:"",etapes:"",note:""});
    setShowForm(false);
    setShowFiche(newR);
  };

  const filtered = filter==="Tout" ? recettes : recettes.filter(r=>r.categorie===filter);
  const favs     = recettes.filter(r=>r.fav);

  // FICHE RECETTE
  if (showFiche) return (
    <div>
      <div style={{ ...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,
        padding:"20px",textAlign:"center"}) }}>
        <div style={{ fontSize:11, color:P.gold, fontFamily:"'DM Sans',sans-serif",
          textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>✨ Fiche recette</div>
        <div style={{ fontSize:22, fontWeight:700, color:P.darkBrown,
          fontFamily:"'Cormorant Garamond',serif", marginBottom:6 }}>{showFiche.nom}</div>
        <div style={{ display:"flex", justifyContent:"center", gap:12, flexWrap:"wrap" }}>
          {showFiche.temps&&<span style={{ fontSize:12, color:P.brown, fontFamily:"'DM Sans',sans-serif" }}>⏱ {showFiche.temps}</span>}
          <span style={{ fontSize:12, color:P.brown, fontFamily:"'DM Sans',sans-serif" }}>👥 {showFiche.portions} personnes</span>
          <span style={{ fontSize:12, color:P.brown, fontFamily:"'DM Sans',sans-serif" }}>{showFiche.categorie}</span>
        </div>
      </div>

      <div style={card()}>
        <div style={h2}>🧺 Ingrédients</div>
        {showFiche.ingredients.map((ing,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0",
            borderBottom:i<showFiche.ingredients.length-1?`1px solid ${P.beige}`:"none" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:P.gold, flexShrink:0 }}/>
            <span style={{ fontSize:13, color:P.text, fontFamily:"'DM Sans',sans-serif" }}>{ing}</span>
          </div>
        ))}
      </div>

      <div style={card()}>
        <div style={h2}>👩‍🍳 Préparation</div>
        {showFiche.etapes.map((e,i)=>(
          <div key={i} style={{ display:"flex", gap:12, padding:"10px 0",
            borderBottom:i<showFiche.etapes.length-1?`1px solid ${P.beige}`:"none" }}>
            <div style={{ width:24, height:24, borderRadius:"50%", background:P.goldLight,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, fontWeight:700, color:P.darkBrown, flexShrink:0 }}>{i+1}</div>
            <span style={{ fontSize:13, color:P.text, fontFamily:"'DM Sans',sans-serif",
              lineHeight:1.6, paddingTop:3 }}>{e}</span>
          </div>
        ))}
      </div>

      {showFiche.note&&(
        <div style={{ ...card({background:P.soft}), fontStyle:"italic",
          fontSize:13, color:P.brown, fontFamily:"'Cormorant Garamond',serif",
          lineHeight:1.6 }}>
          💡 {showFiche.note}
        </div>
      )}

      <button style={btn(P.beige,P.darkBrown,{width:"100%"})}
        onClick={()=>setShowFiche(null)}>← Retour aux recettes</button>
    </div>
  );

  // DÉTAIL RECETTE
  if (detail) {
    const r = recettes.find(x=>x.id===detail);
    if(!r) { setDetail(null); return null; }
    return (
      <div>
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <button style={btn(P.beige,P.darkBrown,{flex:1,padding:"9px 14px",fontSize:12})}
            onClick={()=>setDetail(null)}>← Retour</button>
          <button style={btn(P.gold,P.darkBrown,{flex:1,padding:"9px 14px",fontSize:12})}
            onClick={()=>setShowFiche(r)}>✨ Voir la fiche</button>
          <div style={icBtn({color:"#E07B6A"})} onClick={()=>del(r.id)}><Ico.trash/></div>
        </div>
        <div style={card({padding:"20px",textAlign:"center",background:`linear-gradient(135deg,${P.soft},${P.goldLight})`})}>
          <div style={{ fontSize:20, fontWeight:700, color:P.darkBrown,
            fontFamily:"'Cormorant Garamond',serif", marginBottom:6 }}>{r.nom}</div>
          <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
            {r.temps&&<span style={{ fontSize:12, color:P.brown }}>⏱ {r.temps}</span>}
            <span style={{ fontSize:12, color:P.brown }}>👥 {r.portions} pers.</span>
          </div>
        </div>
        <div style={card()}>
          <div style={h2}>🧺 Ingrédients</div>
          {r.ingredients.map((ing,i)=>(
            <div key={i} style={{ padding:"7px 0", borderBottom:i<r.ingredients.length-1?`1px solid ${P.beige}`:"none",
              fontSize:13, color:P.text, fontFamily:"'DM Sans',sans-serif",
              display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:5,height:5,borderRadius:"50%",background:P.gold,flexShrink:0 }}/>
              {ing}
            </div>
          ))}
        </div>
        <div style={card()}>
          <div style={h2}>👩‍🍳 Étapes</div>
          {r.etapes.map((e,i)=>(
            <div key={i} style={{ display:"flex", gap:10, padding:"8px 0",
              borderBottom:i<r.etapes.length-1?`1px solid ${P.beige}`:"none" }}>
              <div style={{ width:22,height:22,borderRadius:"50%",background:P.goldLight,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:11,fontWeight:700,color:P.darkBrown,flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,paddingTop:2 }}>{e}</span>
            </div>
          ))}
        </div>
        {r.note&&<div style={{ ...card({background:P.soft}),fontStyle:"italic",fontSize:13,color:P.brown,fontFamily:"'Cormorant Garamond',serif" }}>💡 {r.note}</div>}
      </div>
    );
  }

  // FORM AJOUT
  if (showForm) return (
    <div>
      <div style={card({border:`2px solid ${P.gold}`})}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
          <div style={h2}>📖 Nouvelle recette</div>
          <div onClick={()=>setShowForm(false)} style={{ cursor:"pointer",color:P.textLight }}><Ico.close/></div>
        </div>
        {[
          {label:"Nom de la recette",key:"nom",ph:"Ex: Tajine d'agneau 🍲"},
          {label:"Temps de préparation",key:"temps",ph:"Ex: 30 min"},
        ].map(({label,key,ph})=>(
          <div key={key} style={{ marginBottom:10 }}>
            <div style={h3}>{label}</div>
            <input style={inp} placeholder={ph} value={form[key]}
              onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} />
          </div>
        ))}
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <div style={{ flex:1 }}>
            <div style={h3}>Catégorie</div>
            <select style={inp} value={form.categorie}
              onChange={e=>setForm(p=>({...p,categorie:e.target.value}))}>
              {CATS_RECETTES.filter(c=>c!=="Tout").map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex:1 }}>
            <div style={h3}>Portions</div>
            <input style={inp} type="number" value={form.portions}
              onChange={e=>setForm(p=>({...p,portions:e.target.value}))} />
          </div>
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={h3}>Ingrédients (1 par ligne)</div>
          <textarea style={{ ...inp,minHeight:90,resize:"none",lineHeight:1.6 }}
            placeholder={"200g de lentilles\n1 oignon\nCumin..."}
            value={form.ingredients}
            onChange={e=>setForm(p=>({...p,ingredients:e.target.value}))} />
        </div>
        <div style={{ marginBottom:10 }}>
          <div style={h3}>Étapes (1 par ligne)</div>
          <textarea style={{ ...inp,minHeight:90,resize:"none",lineHeight:1.6 }}
            placeholder={"Faire revenir l'oignon\nAjouter les épices\n..."}
            value={form.etapes}
            onChange={e=>setForm(p=>({...p,etapes:e.target.value}))} />
        </div>
        <div style={{ marginBottom:14 }}>
          <div style={h3}>Note / Astuce</div>
          <input style={inp} placeholder="Une astuce, une variante..."
            value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} />
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={saveRecette}>
            ✨ Créer la fiche recette
          </button>
          <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button>
        </div>
      </div>
    </div>
  );

  // LISTE RECETTES
  return (
    <div>
      <button style={btn(P.gold,P.darkBrown,{width:"100%",marginBottom:14,
        display:"flex",alignItems:"center",justifyContent:"center",gap:8})}
        onClick={()=>setShowForm(true)}>
        <Ico.plus/> Ajouter une recette
      </button>

      {/* Favoris */}
      {favs.length>0&&(
        <div style={{ marginBottom:14 }}>
          <div style={h3}>⭐ Mes favoris</div>
          <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
            {favs.map(r=>(
              <div key={r.id} onClick={()=>setDetail(r.id)}
                style={{ flex:"0 0 auto", padding:"12px 16px", borderRadius:14,
                  background:P.goldLight, border:`1px solid ${P.gold}`,
                  cursor:"pointer", minWidth:140 }}>
                <div style={{ fontSize:13,fontWeight:700,color:P.darkBrown,
                  fontFamily:"'Cormorant Garamond',serif",marginBottom:3 }}>{r.nom}</div>
                <div style={{ fontSize:11,color:P.brown,fontFamily:"'DM Sans',sans-serif" }}>
                  {r.temps&&`⏱ ${r.temps} · `}{r.categorie}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres */}
      <div style={{ display:"flex",gap:6,overflowX:"auto",marginBottom:14,scrollbarWidth:"none" }}>
        {CATS_RECETTES.map(c=>(
          <span key={c} onClick={()=>setFilter(c)}
            style={{ padding:"5px 12px",borderRadius:20,fontSize:11,cursor:"pointer",flexShrink:0,
              fontFamily:"'DM Sans',sans-serif",
              border:`1.5px solid ${filter===c?P.gold:P.beige}`,
              background:filter===c?P.goldLight:P.soft,
              color:filter===c?P.darkBrown:P.textLight,
              fontWeight:filter===c?600:400,transition:"all 0.2s" }}>{c}</span>
        ))}
      </div>

      {filtered.map(r=>(
        <div key={r.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{ display:"flex",alignItems:"center",gap:12,padding:"14px 16px",
            cursor:"pointer" }} onClick={()=>setDetail(r.id)}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14,fontWeight:700,color:P.darkBrown,
                fontFamily:"'Cormorant Garamond',serif",marginBottom:3 }}>{r.nom}</div>
              <div style={{ fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif",
                display:"flex",gap:10 }}>
                {r.temps&&<span>⏱ {r.temps}</span>}
                <span>👥 {r.portions} pers.</span>
                <span>{r.categorie}</span>
              </div>
            </div>
            <div onClick={e=>{e.stopPropagation();toggleFav(r.id);}}
              style={{ color:r.fav?P.gold:P.taupe,padding:6,cursor:"pointer" }}>
              <Ico.star/>
            </div>
          </div>
        </div>
      ))}

      {filtered.length===0&&(
        <div style={{ ...card({textAlign:"center",padding:"32px 20px",
          background:`linear-gradient(135deg,${P.soft},${P.goldLight})`}) }}>
          <div style={{ fontSize:32,marginBottom:8 }}>📖</div>
          <div style={{ fontSize:14,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",
            fontStyle:"italic" }}>Aucune recette ici. Ajoute la tienne ! 🌿</div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════
// 3. BATCH COOKING
// ════════════════════════════════════════════════
const BATCH_CATS = ["🥦 Légumes","🍚 Féculents","🍗 Protéines","🥣 Sauces","🥗 Salades","🍰 Snacks"];
const BATCH_INIT = [
  {id:1,cat:"🥦 Légumes",tache:"Laver, éplucher et rôtir au four (200°C / 25 min)",done:false},
  {id:2,cat:"🍚 Féculents",tache:"Cuire riz + quinoa en grande quantité",done:false},
  {id:3,cat:"🍗 Protéines",tache:"Cuire poulet + œufs durs",done:false},
  {id:4,cat:"🥣 Sauces",tache:"Préparer 2 sauces polyvalentes",done:false},
  {id:5,cat:"🥗 Salades",tache:"Préparer base de taboulé ou céréales froides",done:false},
  {id:6,cat:"🍰 Snacks",tache:"Portionner amandes, fruits secs, compotes",done:false},
];

function TabBatchCooking() {
  const [items,   setItems]   = useState(BATCH_INIT);
  const [newTache,setNewTache]= useState("");
  const [newCat,  setNewCat]  = useState("🥦 Légumes");
  const [timer,   setTimer]   = useState(5400); // 1h30
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  const toggle  = id => setItems(p=>p.map(i=>i.id===id?{...i,done:!i.done}:i));
  const del     = id => setItems(p=>p.filter(i=>i.id!==id));
  const add     = () => {
    if(newTache.trim()){
      setItems(p=>[...p,{id:NID++,cat:newCat,tache:newTache,done:false}]);
      setNewTache("");
    }
  };
  const reset   = () => { setItems(p=>p.map(i=>({...i,done:false}))); };

  const useTimer = () => {
    if(running){ clearInterval(ref.current); setRunning(false); }
    else {
      ref.current = setInterval(()=>setTimer(t=>{ if(t<=1){clearInterval(ref.current);setRunning(false);return 0;} return t-1; }),1000);
      setRunning(true);
    }
  };

  const fmt = s=>`${Math.floor(s/3600)}h${String(Math.floor((s%3600)/60)).padStart(2,"0")}`;
  const done = items.filter(i=>i.done).length;
  const pct  = Math.round(done/items.length*100)||0;

  return (
    <div>
      {/* Header */}
      <div style={{ ...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,
        padding:"16px 20px"}) }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
          <div style={h2}>🍳 Session batch cooking</div>
          <button onClick={useTimer}
            style={btn(running?P.darkBrown:P.beige,running?"#fff":P.darkBrown,
              {padding:"8px 14px",fontSize:12,display:"flex",alignItems:"center",gap:5})}>
            {running?`⏸ ${fmt(timer)}`:`▶ Timer ${fmt(timer)}`}
          </button>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",
          fontSize:12,color:P.textLight,fontFamily:"'DM Sans',sans-serif",marginBottom:8 }}>
          <span>{done}/{items.length} étapes · {pct}%</span>
          <span>⏱ ~1h30</span>
        </div>
        <div style={{ height:8,borderRadius:4,background:"rgba(255,255,255,0.5)" }}>
          <div style={{ height:"100%",borderRadius:4,background:P.gold,
            width:`${pct}%`,transition:"width 0.3s" }}/>
        </div>
      </div>

      {BATCH_CATS.map(cat=>{
        const its = items.filter(i=>i.cat===cat);
        if(!its.length) return null;
        return (
          <div key={cat} style={card({padding:0,overflow:"hidden"})}>
            <div style={{ padding:"10px 16px 8px",background:P.soft,
              borderBottom:`1px solid ${P.beige}`,fontSize:11,fontWeight:700,
              color:P.brown,letterSpacing:"0.08em",textTransform:"uppercase",
              fontFamily:"'DM Sans',sans-serif" }}>{cat}</div>
            {its.map((item,i)=>(
              <div key={item.id} style={{ display:"flex",alignItems:"center",gap:10,
                padding:"12px 16px",borderBottom:i<its.length-1?`1px solid ${P.beige}`:"none" }}>
                <div onClick={()=>toggle(item.id)}
                  style={{ width:22,height:22,borderRadius:7,
                    border:`1.5px solid ${item.done?P.gold:P.beigeDeep}`,
                    background:item.done?P.gold:"transparent",
                    flexShrink:0,display:"flex",alignItems:"center",
                    justifyContent:"center",cursor:"pointer",transition:"all 0.2s" }}>
                  {item.done&&<Ico.check/>}
                </div>
                <span style={{ flex:1,fontSize:13,color:item.done?P.textLight:P.text,
                  textDecoration:item.done?"line-through":"none",
                  fontFamily:"'DM Sans',sans-serif" }}>{item.tache}</span>
                <div style={icBtn()} onClick={()=>del(item.id)}><Ico.trash/></div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Ajouter */}
      <div style={card()}>
        <div style={h3}>+ Ajouter une étape</div>
        <input style={{ ...inp,marginBottom:8 }} placeholder="Ex: Préparer la sauce tomate"
          value={newTache} onChange={e=>setNewTache(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&add()} />
        <div style={{ display:"flex",gap:8 }}>
          <select style={{ ...inp,flex:1,padding:"9px 10px",fontSize:12 }}
            value={newCat} onChange={e=>setNewCat(e.target.value)}>
            {BATCH_CATS.map(c=><option key={c}>{c}</option>)}
          </select>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={add}><Ico.plus/></button>
        </div>
      </div>

      <button style={btn(P.beige,P.darkBrown,{width:"100%"})} onClick={reset}>
        🔄 Nouvelle session
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════
// 4. JOURNAL ALIMENTAIRE DOUX
// ════════════════════════════════════════════════

function TabJournal() {
  const [entries, setEntries] = useState([
    { id:1, moment:"🌅 Petit-déjeuner", aliment:"Café + tartine au beurre",  ressenti:"😊", note:"" },
    { id:2, moment:"🌞 Midi",           aliment:"Salade + poulet",           ressenti:"😌", note:"" },
  ]);
  const [newMoment,  setNewMoment]  = useState("🌅 Petit-déjeuner");
  const [newAliment, setNewAliment] = useState("");
  const [newRessenti,setNewRessenti]= useState("😊");
  const [newNote,    setNewNote]    = useState("");
  const [intention,  setIntention]  = useState("");
  const [showAdd,    setShowAdd]    = useState(false);

  const MOMENTS   = ["🌅 Petit-déjeuner","🍎 Collation matin","🌞 Midi","🌤️ Goûter","🌙 Soir","🌜 Nuit"];
  const RESSENTIS = ["😊","😌","😐","😮‍💨","🤔","💛"];

  const add = () => {
    if(newAliment.trim()){
      setEntries(p=>[...p,{id:NID++,moment:newMoment,aliment:newAliment,ressenti:newRessenti,note:newNote}]);
      setNewAliment(""); setNewNote(""); setShowAdd(false);
    }
  };
  const del = id => setEntries(p=>p.filter(e=>e.id!==id));

  return (
    <div>
      {/* Intention du jour */}
      <div style={card()}>
        <div style={h2}>🌿 Mon intention alimentaire</div>
        <input style={inp} placeholder="Ex: Manger lentement, m'hydrater..."
          value={intention} onChange={e=>setIntention(e.target.value)} />
        <div style={{ fontSize:12,color:P.textLight,marginTop:8,fontStyle:"italic",
          fontFamily:"'Cormorant Garamond',serif" }}>
          "Pas de restriction. Juste de la conscience. 🤍"
        </div>
      </div>

      {/* Date */}
      <div style={{ fontSize:13,fontWeight:600,color:P.darkBrown,
        fontFamily:"'Cormorant Garamond',serif",marginBottom:10 }}>
        {JOURS_LONG[today.getDay()]} {today.getDate()} {MOIS_LONG[today.getMonth()]}
      </div>

      {/* Entrées */}
      {entries.map((e,i)=>(
        <div key={e.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"10px 16px",background:P.soft,borderBottom:`1px solid ${P.beige}` }}>
            <span style={{ fontSize:12,fontWeight:600,color:P.gold,
              fontFamily:"'DM Sans',sans-serif" }}>{e.moment}</span>
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <span style={{ fontSize:20 }}>{e.ressenti}</span>
              <div style={icBtn()} onClick={()=>del(e.id)}><Ico.trash/></div>
            </div>
          </div>
          <div style={{ padding:"12px 16px" }}>
            <div style={{ fontSize:14,color:P.text,fontFamily:"'DM Sans',sans-serif",
              marginBottom:e.note?6:0 }}>{e.aliment}</div>
            {e.note&&<div style={{ fontSize:12,color:P.textLight,fontStyle:"italic",
              fontFamily:"'Cormorant Garamond',serif" }}>{e.note}</div>}
          </div>
        </div>
      ))}

      {/* Ajouter */}
      {showAdd?(
        <div style={card({border:`2px solid ${P.gold}`})}>
          <div style={h3}>Ajouter un repas</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:10 }}>
            {MOMENTS.map(m=>(
              <span key={m} onClick={()=>setNewMoment(m)}
                style={{ padding:"5px 10px",borderRadius:20,fontSize:11,cursor:"pointer",
                  border:`1.5px solid ${newMoment===m?P.gold:P.beige}`,
                  background:newMoment===m?P.goldLight:P.soft,
                  color:newMoment===m?P.darkBrown:P.textLight,
                  fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s" }}>{m}</span>
            ))}
          </div>
          <input style={{ ...inp,marginBottom:8 }} placeholder="Ce que tu as mangé..."
            value={newAliment} onChange={e=>setNewAliment(e.target.value)} autoFocus />
          <div style={{ display:"flex",gap:10,marginBottom:10,alignItems:"center" }}>
            <span style={{ fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif" }}>Comment tu te sens :</span>
            {RESSENTIS.map(r=>(
              <span key={r} onClick={()=>setNewRessenti(r)}
                style={{ fontSize:22,cursor:"pointer",opacity:newRessenti===r?1:0.4,
                  transform:newRessenti===r?"scale(1.2)":"scale(1)",
                  display:"inline-block",transition:"all 0.2s" }}>{r}</span>
            ))}
          </div>
          <input style={{ ...inp,marginBottom:12 }} placeholder="Note (optionnel)..."
            value={newNote} onChange={e=>setNewNote(e.target.value)} />
          <div style={{ display:"flex",gap:8 }}>
            <button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={add}>Ajouter</button>
            <button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowAdd(false)}>Annuler</button>
          </div>
        </div>
      ):(
        <button style={btn(P.beige,P.darkBrown,{width:"100%",marginBottom:14})}
          onClick={()=>setShowAdd(true)}>+ Ajouter un repas</button>
      )}

      <div style={{ ...card({background:P.soft,textAlign:"center",padding:"14px 20px"}) }}>
        <div style={{ fontSize:13,color:P.brown,fontStyle:"italic",
          fontFamily:"'Cormorant Garamond',serif',lineHeight:1.6" }}>
          "Ce journal n'est pas un outil de contrôle.<br/>C'est un espace de bienveillance envers toi. 🤍"
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════
const TABS_ALIM = [
  {id:"planner", label:"🗓️ Menus"},
  {id:"recettes",label:"📖 Recettes"},
  {id:"batch",   label:"🍳 Batch"},
  {id:"journal", label:"📝 Journal"},
];

function Alimentation({ onBack }) {
  const [tab, setTab] = useState("planner");

  return (
    <>
      
      <div style={{ maxWidth:420,margin:"0 auto",minHeight:"100vh",
        background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24 }}>

        {/* HEADER */}
        <div style={{ background:P.card,padding:"52px 20px 0",
          borderBottom:`1px solid ${P.beige}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
            {onBack&&(
              <div onClick={onBack} style={{ width:36,height:36,borderRadius:"50%",
                border:`1px solid ${P.beige}`,background:P.soft,
                display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",color:P.brown,flexShrink:0 }}>
                <Ico.back/>
              </div>
            )}
            <div style={{ color:P.gold }}><Ico.fork/></div>
            <div>
              <div style={{ fontSize:18,fontWeight:700,color:P.darkBrown,
                fontFamily:"'Cormorant Garamond',Georgia,serif" }}>Alimentation</div>
              <div style={{ fontSize:12,color:P.textLight }}>Repas & bien manger</div>
            </div>
          </div>
          <div style={{ display:"flex",overflowX:"auto",scrollbarWidth:"none" }}>
            {TABS_ALIM.map(t=>(
              <div key={t.id} onClick={()=>setTab(t.id)}
                style={{ flex:"0 0 auto",padding:"10px 14px 9px",cursor:"pointer",
                  fontSize:12,fontFamily:"'DM Sans',sans-serif",
                  color:tab===t.id?P.darkBrown:P.textLight,
                  borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,
                  fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",
                  transition:"all 0.2s" }}>{t.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding:"18px 16px 0" }}>
          {tab==="planner"  && <TabMealPlanner/>}
          {tab==="recettes" && <TabRecettes/>}
          {tab==="batch"    && <TabBatchCooking/>}
          {tab==="journal"  && <TabJournal/>}
        </div>
      </div>
    </>
  );
}


// ════════════════════════════════════════════════════════
// PROJETS & VIE
// ════════════════════════════════════════════════════════

function TabBudget(){
  const [revenus,setRevenus]=useState([{id:1,label:"Salaire",montant:""}]);
  const [depenses,setDepenses]=useState([
    {id:1,label:"Loyer",montant:"",cat:"🏠 Fixe"},
    {id:2,label:"Courses",montant:"",cat:"🛒 Variable"},
    {id:3,label:"Crèche",montant:"",cat:"👶 Enfants"},
  ]);
  const [epargne,setEpargne]=useState("");
  const [objectif,setObjectif]=useState("");
  const [newRev,setNewRev]=useState("");
  const [newDep,setNewDep]=useState({label:"",montant:"",cat:"🏠 Fixe"});
  const CATS=["🏠 Fixe","🛒 Variable","👶 Enfants","🚗 Transport","🎉 Loisirs","💊 Santé","🌟 Autre"];
  const totalRev=revenus.reduce((a,r)=>a+(Number(r.montant)||0),0);
  const totalDep=depenses.reduce((a,d)=>a+(Number(d.montant)||0),0);
  const solde=totalRev-totalDep-(Number(epargne)||0);
  const pctEp=totalRev?Math.round((Number(epargne)/totalRev)*100):0;
  return(
    <div>
      {(totalRev>0||totalDep>0)&&(
        <div style={{...card({background:solde>=0?`linear-gradient(135deg,#E8F5E9,#C8E6C9)`:`linear-gradient(135deg,#FFEBEE,#FFCDD2)`,textAlign:"center",padding:"18px"})}}>
          <div style={{fontSize:12,color:solde>=0?"#2E7D32":"#C62828",fontFamily:"'DM Sans',sans-serif",marginBottom:4}}>{solde>=0?"✓ Solde positif":"⚠️ Attention au budget"}</div>
          <div style={{fontSize:28,fontWeight:700,color:solde>=0?"#1B5E20":"#B71C1C",fontFamily:"'Cormorant Garamond',serif"}}>{solde>=0?"+":""}{solde.toFixed(0)}€</div>
          <div style={{fontSize:11,color:P.textLight,marginTop:4,fontFamily:"'DM Sans',sans-serif"}}>Revenus {totalRev}€ · Dépenses {totalDep}€ · Épargne {epargne||0}€</div>
        </div>
      )}
      <div style={card()}>
        <div style={h2}>💰 Revenus</div>
        {revenus.map((r,i)=>(
          <div key={r.id} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
            <input style={{...inp,flex:2}} placeholder="Source" value={r.label} onChange={e=>setRevenus(p=>p.map((x,j)=>j===i?{...x,label:e.target.value}:x))}/>
            <input style={{...inp,flex:1}} placeholder="0" type="number" value={r.montant} onChange={e=>setRevenus(p=>p.map((x,j)=>j===i?{...x,montant:e.target.value}:x))}/>
            {revenus.length>1&&<div style={icBtn()} onClick={()=>setRevenus(p=>p.filter((_,j)=>j!==i))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></div>}
          </div>
        ))}
        <div style={{display:"flex",gap:8}}>
          <input style={{...inp,flex:1}} placeholder="Nouvelle source..." value={newRev} onChange={e=>setNewRev(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newRev.trim()){setRevenus(p=>[...p,{id:NID++,label:newRev,montant:""}]);setNewRev("");}}}/>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={()=>{if(newRev.trim()){setRevenus(p=>[...p,{id:NID++,label:newRev,montant:""}]);setNewRev("");}}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
      </div>
      <div style={card()}>
        <div style={h2}>💸 Dépenses</div>
        {depenses.map((d,i)=>(
          <div key={d.id} style={{display:"flex",gap:6,marginBottom:8,alignItems:"center"}}>
            <input style={{...inp,flex:2}} placeholder="Libellé" value={d.label} onChange={e=>setDepenses(p=>p.map((x,j)=>j===i?{...x,label:e.target.value}:x))}/>
            <input style={{...inp,flex:1}} placeholder="0" type="number" value={d.montant} onChange={e=>setDepenses(p=>p.map((x,j)=>j===i?{...x,montant:e.target.value}:x))}/>
            <div style={icBtn()} onClick={()=>setDepenses(p=>p.filter((_,j)=>j!==i))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></div>
          </div>
        ))}
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          <input style={{...inp,flex:2}} placeholder="Nouvelle dépense..." value={newDep.label} onChange={e=>setNewDep(p=>({...p,label:e.target.value}))}/>
          <select style={{...inp,flex:1,padding:"9px 8px",fontSize:11}} value={newDep.cat} onChange={e=>setNewDep(p=>({...p,cat:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 12px"})} onClick={()=>{if(newDep.label.trim()){setDepenses(p=>[...p,{id:NID++,...newDep,montant:""}]);setNewDep({label:"",montant:"",cat:"🏠 Fixe"});}}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
      </div>
      <div style={card()}>
        <div style={h2}>🏦 Épargne mensuelle</div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <div style={{flex:1}}><div style={h3}>Je mets de côté</div><input style={inp} placeholder="0 €" type="number" value={epargne} onChange={e=>setEpargne(e.target.value)}/></div>
          <div style={{flex:1}}><div style={h3}>Objectif</div><input style={inp} placeholder="0 €" type="number" value={objectif} onChange={e=>setObjectif(e.target.value)}/></div>
        </div>
        {epargne&&totalRev>0&&(
          <div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:P.textLight,marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}><span>Taux d'épargne</span><span>{pctEp}%</span></div>
            <div style={{height:6,borderRadius:3,background:P.beige}}><div style={{height:"100%",borderRadius:3,background:P.gold,width:`${Math.min(pctEp,100)}%`,transition:"width 0.3s"}}/></div>
            {pctEp>=10&&<div style={{fontSize:12,color:"#2E7D32",marginTop:6,fontFamily:"'DM Sans',sans-serif"}}>🎉 Objectif 10% épargne atteint !</div>}
          </div>
        )}
      </div>
    </div>
  );
}

function TabWishlistP(){
  const [active,setActive]=useState("perso");
  const [lists,setLists]=useState({perso:[],enfants:[],maison:[]});
  const [newItem,setNewItem]=useState({text:"",prix:""});
  const [showForm,setShowForm]=useState(false);
  const LABELS={perso:"🌸 Ma wishlist",enfants:"👧 Enfants",maison:"🏠 Maison"};
  const add=()=>{if(newItem.text.trim()){setLists(p=>({...p,[active]:[...p[active],{id:NID++,...newItem,done:false}]}));setNewItem({text:"",prix:""});setShowForm(false);}};
  const toggle=id=>setLists(p=>({...p,[active]:p[active].map(i=>i.id===id?{...i,done:!i.done}:i)}));
  const del=id=>setLists(p=>({...p,[active]:p[active].filter(i=>i.id!==id)}));
  const items=lists[active];
  return(
    <div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {Object.entries(LABELS).map(([k,l])=>(
          <div key={k} onClick={()=>setActive(k)} style={{flex:1,textAlign:"center",padding:"11px 6px",borderRadius:14,cursor:"pointer",border:`1.5px solid ${active===k?P.gold:P.beige}`,background:active===k?P.goldLight:P.card,color:active===k?P.darkBrown:P.textLight,fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:active===k?700:400,transition:"all 0.2s"}}>{l}</div>
        ))}
      </div>
      {items.map(item=>(
        <div key={item.id} style={card({padding:0,overflow:"hidden"})}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
            <div onClick={()=>toggle(item.id)} style={{width:22,height:22,borderRadius:"50%",border:`1.5px solid ${item.done?P.gold:P.beigeDeep}`,background:item.done?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>{item.done&&<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}</div>
            <div style={{flex:1}}><div style={{fontSize:14,color:item.done?P.textLight:P.darkBrown,textDecoration:item.done?"line-through":"none",fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{item.text}</div>{item.prix&&<div style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>~{item.prix}€</div>}</div>
            <div style={icBtn()} onClick={()=>del(item.id)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></div>
          </div>
        </div>
      ))}
      {items.length===0&&!showForm&&<div style={{...card({textAlign:"center",padding:"28px",background:`linear-gradient(135deg,${P.soft},${P.goldLight})`}),fontSize:13,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Ta wishlist t'attend... ✨</div>}
      {showForm?(
        <div style={card({border:`2px solid ${P.gold}`})}>
          <input style={{...inp,marginBottom:8}} placeholder="Ce dont tu as envie..." value={newItem.text} onChange={e=>setNewItem(p=>({...p,text:e.target.value}))} autoFocus/>
          <input style={{...inp,marginBottom:10}} placeholder="Prix estimé (€)" type="number" value={newItem.prix} onChange={e=>setNewItem(p=>({...p,prix:e.target.value}))}/>
          <div style={{display:"flex",gap:8}}><button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={add}>Ajouter</button><button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button></div>
        </div>
      ):(
        <button style={btn(P.beige,P.darkBrown,{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8})} onClick={()=>setShowForm(true)}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Ajouter un souhait</button>
      )}
    </div>
  );
}

function TabProjets(){
  const [projets,setProjets]=useState([
    {id:1,nom:"Maison Iliss",emoji:"💛",statut:"En cours",etapes:["Créer le site web","Fiche Instagram","Atelier local"],checks:{}},
    {id:2,nom:"My Hayat App",emoji:"📱",statut:"En cours",etapes:["Définir le contenu","Trouver un développeur","Lancer la bêta"],checks:{}},
  ]);
  const [parking,setParking]=useState(["Apprendre la poterie","Créer un ebook","Podcast mamans"]);
  const [newIdee,setNewIdee]=useState("");
  const [showForm,setShowForm]=useState(false);
  const [newProj,setNewProj]=useState({nom:"",emoji:"🌱",statut:"À démarrer",etapes:""});
  const [detail,setDetail]=useState(null);
  const STATUTS=["À démarrer","En cours","En pause","Terminé 🎉"];
  const SCOL={"À démarrer":P.beige,"En cours":P.goldLight,"En pause":"#FFF3E0","Terminé 🎉":"#E8F5E9"};
  const toggleE=(pid,i)=>setProjets(p=>p.map(pr=>pr.id===pid?{...pr,checks:{...pr.checks,[i]:!pr.checks[i]}}:pr));
  const save=()=>{if(newProj.nom.trim()){setProjets(p=>[...p,{id:NID++,...newProj,etapes:newProj.etapes.split("\n").filter(Boolean),checks:{}}]);setNewProj({nom:"",emoji:"🌱",statut:"À démarrer",etapes:""});setShowForm(false);}};
  if(detail!==null){
    const p=projets.find(pr=>pr.id===detail);
    if(!p){setDetail(null);return null;}
    const done=p.etapes.filter((_,i)=>p.checks[i]).length;
    return(
      <div>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <button style={btn(P.beige,P.darkBrown,{flex:1,padding:"9px 14px",fontSize:12})} onClick={()=>setDetail(null)}>← Retour</button>
          <button style={btn("#FFEBEE","#C62828",{flex:1,padding:"9px 14px",fontSize:12})} onClick={()=>{setProjets(p=>p.filter(pr=>pr.id!==detail));setDetail(null);}}>🗑 Supprimer</button>
        </div>
        <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"20px"})}}>
          <div style={{fontSize:32,marginBottom:6}}>{p.emoji}</div>
          <div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:6}}>{p.nom}</div>
          <span style={{fontSize:11,padding:"4px 12px",borderRadius:20,background:SCOL[p.statut]||P.beige,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{p.statut}</span>
        </div>
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={h2}>Étapes</div><span style={{fontSize:12,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>{done}/{p.etapes.length}</span></div>
          <div style={{height:6,borderRadius:3,background:P.beige,marginBottom:14}}><div style={{height:"100%",borderRadius:3,background:P.gold,width:`${p.etapes.length?Math.round(done/p.etapes.length*100):0}%`,transition:"width 0.3s"}}/></div>
          {p.etapes.map((e,i)=>(
            <div key={i} onClick={()=>toggleE(p.id,i)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:i<p.etapes.length-1?`1px solid ${P.beige}`:"none",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:7,border:`1.5px solid ${p.checks[i]?P.gold:P.beigeDeep}`,background:p.checks[i]?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{p.checks[i]&&<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}</div>
              <span style={{fontSize:13,color:p.checks[i]?P.textLight:P.text,textDecoration:p.checks[i]?"line-through":"none",fontFamily:"'DM Sans',sans-serif"}}>{e}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return(
    <div>
      {projets.map(p=>{
        const done=p.etapes.filter((_,i)=>p.checks[i]).length;
        const pct=p.etapes.length?Math.round(done/p.etapes.length*100):0;
        return(
          <div key={p.id} style={card({padding:0,overflow:"hidden",cursor:"pointer"})} onClick={()=>setDetail(p.id)}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
              <div style={{fontSize:28,flexShrink:0}}>{p.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{p.nom}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:SCOL[p.statut]||P.beige,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{p.statut}</span>
                  <span style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>{done}/{p.etapes.length}</span>
                </div>
                <div style={{height:4,borderRadius:2,background:P.beige}}><div style={{height:"100%",borderRadius:2,background:P.gold,width:`${pct}%`,transition:"width 0.3s"}}/></div>
              </div>
            </div>
          </div>
        );
      })}
      {projets.length>=3&&<div style={{...card({background:"#FFF3E0",padding:"11px 16px"}),fontSize:12,color:"#E65100",fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>💡 Max 3 projets actifs pour rester focus</div>}
      {projets.length<3&&(showForm?(
        <div style={card({border:`2px solid ${P.gold}`})}>
          <div style={h3}>Nouveau projet</div>
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <input style={{...inp,width:60,padding:"10px 8px",textAlign:"center",fontSize:20}} placeholder="🌱" value={newProj.emoji} onChange={e=>setNewProj(p=>({...p,emoji:e.target.value}))}/>
            <input style={{...inp,flex:1}} placeholder="Nom du projet" value={newProj.nom} onChange={e=>setNewProj(p=>({...p,nom:e.target.value}))}/>
          </div>
          <select style={{...inp,marginBottom:8}} value={newProj.statut} onChange={e=>setNewProj(p=>({...p,statut:e.target.value}))}>{STATUTS.map(s=><option key={s}>{s}</option>)}</select>
          <textarea style={{...inp,minHeight:80,resize:"none",marginBottom:12}} placeholder={"Étape 1\nÉtape 2\nÉtape 3..."} value={newProj.etapes} onChange={e=>setNewProj(p=>({...p,etapes:e.target.value}))}/>
          <div style={{display:"flex",gap:8}}><button style={btn(P.darkBrown,"#fff",{flex:1})} onClick={save}>Créer</button><button style={btn(P.beige,P.darkBrown,{flex:1})} onClick={()=>setShowForm(false)}>Annuler</button></div>
        </div>
      ):(
        <button style={btn(P.beige,P.darkBrown,{width:"100%",marginBottom:14})} onClick={()=>setShowForm(true)}>+ Nouveau projet</button>
      ))}
      <div style={card()}>
        <div style={h2}>🅿️ Parking à idées</div>
        <div style={{fontSize:11,color:P.textLight,marginBottom:10,fontFamily:"'DM Sans',sans-serif"}}>Tes idées en attente. Sans culpabilité. 🌿</div>
        {parking.map((id,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<parking.length-1?`1px solid ${P.beige}`:"none"}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:P.taupe,flexShrink:0}}/>
            <span style={{flex:1,fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif"}}>{id}</span>
            <div style={icBtn()} onClick={()=>setParking(p=>p.filter((_,j)=>j!==i))}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg></div>
          </div>
        ))}
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <input style={{...inp,flex:1}} placeholder="Une nouvelle idée..." value={newIdee} onChange={e=>setNewIdee(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newIdee.trim()){setParking(p=>[...p,newIdee]);setNewIdee("");}}}/>
          <button style={btn(P.gold,P.darkBrown,{padding:"10px 14px"})} onClick={()=>{if(newIdee.trim()){setParking(p=>[...p,newIdee]);setNewIdee("");}}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
        </div>
      </div>
    </div>
  );
}

const TABS_PROJ=[{id:"budget",label:"💰 Budget"},{id:"wishlist",label:"🌟 Wishlist"},{id:"projets",label:"🌱 Projets"}];

function ProjetVie({onBack}){
  const [tab,setTab]=useState("budget");
  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24}}>
      <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></div>}
          <div style={{color:P.gold}}><svg viewBox="0 0 24 24" fill="none" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div><div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Projets & Vie</div><div style={{fontSize:12,color:P.textLight}}>Budget · Wishlist · Rêves</div></div>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS_PROJ.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:"0 0 auto",padding:"10px 14px 9px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:tab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.label}</div>)}
        </div>
      </div>
      <div style={{padding:"18px 16px 0"}}>
        {tab==="budget"   &&<TabBudget/>}
        {tab==="wishlist" &&<TabWishlistP/>}
        {tab==="projets"  &&<TabProjets/>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// OUTILS & FOCUS
// ════════════════════════════════════════════════════════

function TabPomodoro(){
  const [mode,setMode]=useState("focus");
  const [timer,setTimer]=useState(25*60);
  const [running,setRunning]=useState(false);
  const [cycles,setCycles]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{
    if(running&&timer>0){ref.current=setTimeout(()=>setTimer(t=>t-1),1000);}
    else if(timer===0){setRunning(false);if(mode==="focus"){setCycles(c=>c+1);setMode("pause");setTimer(5*60);}else{setMode("focus");setTimer(25*60);}}
    return()=>clearTimeout(ref.current);
  },[running,timer,mode]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const total=mode==="focus"?25*60:5*60;
  const pct=Math.round((1-timer/total)*100);
  return(
    <div>
      <div style={{...card({textAlign:"center",padding:"28px 20px",background:mode==="focus"?P.card:`linear-gradient(135deg,#E8F5E9,#C8E6C9)`})}}>
        <div style={{fontSize:12,color:P.textLight,marginBottom:6,fontFamily:"'DM Sans',sans-serif"}}>{mode==="focus"?"🍅 Focus 25 min":"☕ Pause 5 min"} · {cycles} cycles</div>
        <div style={{fontSize:56,fontWeight:700,color:mode==="focus"?P.darkBrown:"#2E7D32",fontFamily:"'DM Sans',sans-serif",marginBottom:12}}>{fmt(timer)}</div>
        <div style={{height:8,borderRadius:4,background:P.beige,marginBottom:16}}><div style={{height:"100%",borderRadius:4,background:mode==="focus"?P.gold:"#66BB6A",width:`${pct}%`,transition:"width 1s linear"}}/></div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button style={btn(P.darkBrown,"#fff")} onClick={()=>setRunning(!running)}>{running?"⏸ Pause":"▶ Démarrer"}</button>
          <button style={btn(P.beige,P.darkBrown)} onClick={()=>{setTimer(mode==="focus"?25*60:5*60);setRunning(false);}}>Reset</button>
        </div>
      </div>
      <div style={{...card({background:P.soft,textAlign:"center",padding:"14px"})}}>
        <div style={{fontSize:12,color:P.brown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>"25 min de focus. 5 min de pause. Répète. 🌿"</div>
      </div>
    </div>
  );
}

function TabBrainDump(){
  const [dump,setDump]=useState("");
  const [saved,setSaved]=useState(()=>{
    try{ const r=window.storage?.get?.('brain:all'); if(r&&r.value) return JSON.parse(r.value); }catch{}
    return [];
  });
  const [newSorted,setNewSorted]=useState("");

  useEffect(()=>{
    try{ window.storage?.set?.('brain:all', JSON.stringify(saved)); }catch{}
  },[saved]);

  const save=()=>{
    if(dump.trim()){
      const d=new Date();
      setSaved(p=>[{id:NID++,text:dump,date:`${d.getDate()}/${d.getMonth()+1}`,tasks:[]},...p]);
      setDump("");
    }
  };
  const addTask=(idx,t)=>{
    if(!t.trim()) return;
    setSaved(p=>p.map((s,i)=>i===idx?{...s,tasks:[...(s.tasks||[]),t]}:s));
    setNewSorted("");
  };
  const delTask=(idx,ti)=>setSaved(p=>p.map((s,i)=>i===idx?{...s,tasks:(s.tasks||[]).filter((_,j)=>j!==ti)}:s));
  const delEntry=(idx)=>setSaved(p=>p.filter((_,i)=>i!==idx));

  return(
    <div>
      <div style={card()}>
        <div style={h2}>🧠 Vide ton cerveau</div>
        <div style={{fontSize:12,color:P.textLight,marginBottom:12,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6}}>Écris tout ce qui tourne dans ta tête. Sans filtre, sans ordre.</div>
        <textarea style={{...inp,minHeight:130,resize:"none",lineHeight:1.7,marginBottom:12}} placeholder="Tout ce que j'ai dans la tête en ce moment..." value={dump} onChange={e=>setDump(e.target.value)}/>
        <button style={btn(P.darkBrown,"#fff",{width:"100%"})} onClick={save}>Sauvegarder 🌿</button>
      </div>

      {saved.length>0&&<div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:10}}>📚 Mes brain dumps ({saved.length})</div>}

      {saved.map((s,idx)=>(
        <div key={s.id||idx} style={card({padding:0,overflow:"hidden"})}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:P.soft,borderBottom:`1px solid ${P.beige}`}}>
            <div style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>📅 {s.date}</div>
            <div style={icBtn({color:"#E07B6A"})} onClick={()=>delEntry(idx)}><Ico.trash/></div>
          </div>
          <div style={{padding:"12px 16px"}}>
            <div style={{fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,marginBottom:s.tasks?.length?10:0,whiteSpace:"pre-wrap"}}>{s.text}</div>
            {(s.tasks||[]).map((t,ti)=>(
              <div key={ti} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderTop:`1px solid ${P.beige}`}}>
                <div style={{width:5,height:5,borderRadius:"50%",background:P.gold,flexShrink:0}}/>
                <span style={{flex:1,fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif"}}>{t}</span>
                <div style={icBtn({color:"#E07B6A"})} onClick={()=>delTask(idx,ti)}><Ico.trash/></div>
              </div>
            ))}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input style={{...inp,flex:1,fontSize:12,padding:"7px 10px"}} placeholder="Transformer en tâche concrète..."
                value={idx===0?newSorted:""} onChange={e=>idx===0&&setNewSorted(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&addTask(idx,idx===0?newSorted:"")}/>
              <button style={btn(P.gold,P.darkBrown,{padding:"7px 12px"})} onClick={()=>addTask(idx,idx===0?newSorted:"")}>
                <Ico.plus/>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabDecompose(){
  const [grosse,setGrosse]=useState("");
  const [etapes,setEtapes]=useState([]);
  const [checks,setChecks]=useState({});
  const decompose=()=>{
    if(!grosse.trim()) return;
    setEtapes([`Clarifier : "${grosse}" en 2 lignes`,`Rassembler ce dont j'ai besoin`,`Faire la première action (5 min max)`,`Faire une pause · évaluer`,`Continuer pas à pas`]);
    setChecks({});
  };
  const done=etapes.filter((_,i)=>checks[i]).length;
  return(
    <div>
      <div style={card()}>
        <div style={h2}>✂️ Découper une grosse tâche</div>
        <div style={{fontSize:12,color:P.textLight,marginBottom:12,fontFamily:"'DM Sans',sans-serif"}}>Une tâche qui te bloque ? On la coupe en micro-étapes.</div>
        <textarea style={{...inp,minHeight:70,resize:"none",lineHeight:1.6,marginBottom:12}} placeholder="Quelle tâche te bloque ? Ex: Faire ma déclaration..." value={grosse} onChange={e=>setGrosse(e.target.value)}/>
        <button style={btn(P.darkBrown,"#fff",{width:"100%"})} onClick={decompose}>✂️ Découper en étapes</button>
      </div>
      {etapes.length>0&&(
        <div style={card()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><div style={h2}>Mes micro-étapes</div><span style={{fontSize:12,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>{done}/{etapes.length}</span></div>
          <div style={{height:6,borderRadius:3,background:P.beige,marginBottom:12}}><div style={{height:"100%",borderRadius:3,background:P.gold,width:`${etapes.length?Math.round(done/etapes.length*100):0}%`,transition:"width 0.3s"}}/></div>
          {etapes.map((e,i)=>(
            <div key={i} onClick={()=>setChecks(p=>({...p,[i]:!p[i]}))} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"11px 0",borderBottom:i<etapes.length-1?`1px solid ${P.beige}`:"none",cursor:"pointer"}}>
              <div style={{width:22,height:22,borderRadius:7,border:`1.5px solid ${checks[i]?P.gold:P.beigeDeep}`,background:checks[i]?P.gold:"transparent",flexShrink:0,marginTop:1,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{checks[i]&&<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}</div>
              <span style={{fontSize:13,color:checks[i]?P.textLight:P.text,textDecoration:checks[i]?"line-through":"none",fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{e}</span>
            </div>
          ))}
          <div style={{marginTop:10,fontSize:12,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",textAlign:"center"}}>"La première étape est la plus difficile. Après, ça coule. 🌿"</div>
        </div>
      )}
    </div>
  );
}

function TabRoue(){
  const [selected,setSelected]=useState(null);
  const DOMAINES=[
    {id:"famille",label:"👨‍👩‍👧 Famille",color:"#FFD6D6"},
    {id:"sante",label:"💪 Santé",color:"#D6FFD6"},
    {id:"finance",label:"💰 Finances",color:"#FFFFD6"},
    {id:"travail",label:"💼 Travail",color:"#D6E4FF"},
    {id:"social",label:"🤝 Social",color:"#FFD6F5"},
    {id:"perso",label:"🌸 Perso",color:"#F5D6FF"},
    {id:"deen",label:"🕌 Deen",color:"#E8D6FF"},
    {id:"plaisir",label:"🎉 Plaisir",color:"#FFE8D6"},
  ];
  const [scores,setScores]=useState({});
  const setScore=(id,s)=>setScores(p=>({...p,[id]:s}));
  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"14px"})}}>
        <div style={{fontSize:14,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>🌍 Roue de vie</div>
        <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Évalue chaque domaine de 1 à 10. Pas pour te juger — pour voir où mettre ton énergie. 🌿</div>
      </div>
      {DOMAINES.map(d=>{
        const s=scores[d.id]||0;
        return(
          <div key={d.id} style={card({padding:"12px 16px"})}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:P.text}}>{d.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:P.gold,fontFamily:"'Cormorant Garamond',serif"}}>{s}/10</span>
            </div>
            <div style={{display:"flex",gap:4}}>
              {Array.from({length:10},(_,i)=>(
                <div key={i} onClick={()=>setScore(d.id,i+1)} style={{flex:1,height:8,borderRadius:4,background:i<s?P.gold:P.beige,cursor:"pointer",transition:"background 0.2s"}}/>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const TABS_OUTILS=[{id:"rocket",label:"🚀 Fusée"},{id:"pomodoro",label:"🍅 Pomodoro"},{id:"brain",label:"🧠 Brain dump"},{id:"decompose",label:"✂️ Découper"},{id:"roue",label:"🌍 Roue de vie"}];

function OutilsFocus({onBack}){
  const [tab,setTab]=useState("rocket");
  // Fusée state
  const [phase,setPhase]=useState("idle");
  const [count,setCount]=useState(5);
  const [task,setTask]=useState("");
  const [timer,setTimer]=useState(300);
  const [running,setRunning]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{if(phase==="countdown"&&count>0){const t=setTimeout(()=>setCount(c=>c-1),1000);return()=>clearTimeout(t);}if(phase==="countdown"&&count===0)setTimeout(()=>setPhase("go"),600);},[phase,count]);
  useEffect(()=>{if(running&&timer>0){ref.current=setTimeout(()=>setTimer(t=>t-1),1000);}else if(timer===0)setRunning(false);return()=>clearTimeout(ref.current);},[running,timer]);
  const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24}}>
      <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></div>}
          <div style={{color:P.gold}}><svg viewBox="0 0 24 24" fill="none" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
          <div><div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Outils & Focus</div><div style={{fontSize:12,color:P.textLight}}>Boost · TDAH · Concentration</div></div>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS_OUTILS.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:"0 0 auto",padding:"10px 13px 9px",cursor:"pointer",fontSize:11,fontFamily:"'DM Sans',sans-serif",color:tab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.label}</div>)}
        </div>
      </div>
      <div style={{padding:"18px 16px 0"}}>
        {tab==="rocket"&&(
          <div>
            <div style={{...card({background:phase==="idle"?P.card:P.darkBrown,textAlign:"center",padding:"28px 20px",transition:"background 0.5s"})}}>
              {phase==="idle"&&(<><div style={{fontSize:13,color:P.textLight,marginBottom:14,fontFamily:"'DM Sans',sans-serif"}}>Anti-procrastination — 5 · 4 · 3 · 2 · 1</div><input style={{...inp,textAlign:"center",marginBottom:14,fontSize:14}} placeholder="Sur quoi tu travailles ?" value={task} onChange={e=>setTask(e.target.value)}/><button style={btn(P.darkBrown)} onClick={()=>{if(task.trim())setPhase("countdown");}}>🚀 Je me lance maintenant</button></>)}
              {phase==="countdown"&&<div style={{fontSize:80,fontWeight:900,color:"#fff",fontFamily:"'Cormorant Garamond',serif",lineHeight:1,animation:"pulse 0.8s ease infinite"}}>{count||"🚀"}</div>}
              {phase==="go"&&(<><div style={{fontSize:20,fontWeight:700,color:P.goldLight,fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>🚀 Tu es lancée !</div><div style={{color:"#fff",fontSize:14,marginBottom:16,fontFamily:"'DM Sans',sans-serif"}}>{task}</div><div style={{fontSize:52,fontWeight:700,color:timer<60?"#E07B6A":P.goldLight,fontFamily:"'DM Sans',sans-serif",marginBottom:16}}>{fmt(timer)}</div><div style={{display:"flex",gap:10,justifyContent:"center"}}><button style={btn(P.gold,P.darkBrown)} onClick={()=>setRunning(!running)}>{running?"⏸ Pause":"▶ Start"}</button><button style={btn("rgba(255,255,255,0.15)","#fff")} onClick={()=>{setPhase("idle");setCount(5);setTimer(300);setRunning(false);}}>Reset</button></div></>)}
            </div>
            <div style={{...card({background:P.soft})}}>
              {["1 vaut mieux que 0 ✨","Fait vaut mieux que parfait 💛","Tu seras contente de l'avoir fait 🌿","5 minutes suffisent pour commencer"].map((p,i)=>(
                <div key={i} style={{padding:"9px 0",borderBottom:i<3?`1px solid ${P.beige}`:"none",fontSize:13,color:P.brown,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>"{p}"</div>
              ))}
            </div>
          </div>
        )}
        {tab==="pomodoro"  &&<TabPomodoro/>}
        {tab==="brain"     &&<TabBrainDump/>}
        {tab==="decompose" &&<TabDecompose/>}
        {tab==="roue"      &&<TabRoue/>}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SPIRITUALITÉ
// ════════════════════════════════════════════════════════

const PRIERES_LIST=["Fajr 🌙","Dhuhr ☀️","Asr 🌤️","Maghrib 🌅","Isha 🌙"];
const DHIKR_DATA=[{text:"SubhanAllah",ar:"سُبْحَانَ اللَّهِ",count:33},{text:"Alhamdulillah",ar:"اَلْحَمْدُ لِلَّهِ",count:33},{text:"Allahu Akbar",ar:"اَللَّهُ أَكْبَرُ",count:33}];
const ASMA_ALLAH = [
  {num:1, ar:"اللَّهُ", phon:"Allah", fr:"Allah", def:"Le nom suprême, l'Être unique digne d'adoration."},
  {num:2, ar:"الرَّحْمَنُ", phon:"Ar-Rahmân", fr:"Le Tout Miséricordieux", def:"Dont la miséricorde est infinie et englobe toute créature."},
  {num:3, ar:"الرَّحِيمُ", phon:"Ar-Rahîm", fr:"Le Très Miséricordieux", def:"Dont la miséricorde spéciale est réservée aux croyants."},
  {num:4, ar:"الْمَلِكُ", phon:"Al-Malik", fr:"Le Roi absolu", def:"Souverain de toute chose, sans associé ni rival."},
  {num:5, ar:"الْقُدُّوسُ", phon:"Al-Quddûs", fr:"Le Très Saint", def:"Pur de tout défaut, exempt de toute imperfection."},
  {num:6, ar:"السَّلَامُ", phon:"As-Salâm", fr:"La Paix", def:"Source de toute paix et sécurité."},
  {num:7, ar:"الْمُؤْمِنُ", phon:"Al-Mu'min", fr:"Le Garant de sécurité", def:"Qui donne la foi et protège Ses serviteurs."},
  {num:8, ar:"الْمُهَيْمِنُ", phon:"Al-Muhaymin", fr:"Le Gardien suprême", def:"Qui veille sur toute chose et la préserve."},
  {num:9, ar:"الْعَزِيزُ", phon:"Al-'Azîz", fr:"Le Tout Puissant", def:"Dont la puissance est absolue et insurmontable."},
  {num:10, ar:"الْجَبَّارُ", phon:"Al-Jabbâr", fr:"Le Dominateur", def:"Qui répare ce qui est brisé et contraint tout par Sa volonté."},
  {num:11, ar:"الْمُتَكَبِّرُ", phon:"Al-Mutakabbir", fr:"Le Majestueux", def:"Seul digne de toute grandeur et magnificence."},
  {num:12, ar:"الْخَالِقُ", phon:"Al-Khâliq", fr:"Le Créateur", def:"Qui crée de rien par Sa seule volonté."},
  {num:13, ar:"الْبَارِئُ", phon:"Al-Bâri'", fr:"Le Créateur parfait", def:"Qui façonne toute créature avec perfection."},
  {num:14, ar:"الْمُصَوِّرُ", phon:"Al-Musawwir", fr:"Le Formateur des formes", def:"Qui donne à chaque chose sa forme unique."},
  {num:15, ar:"الْغَفَّارُ", phon:"Al-Ghaffâr", fr:"Le Grand Pardonneur", def:"Qui pardonne abondamment et sans cesse."},
  {num:16, ar:"الْقَهَّارُ", phon:"Al-Qahhâr", fr:"Le Dominateur irrésistible", def:"Qui subjugue tout par Sa toute-puissance."},
  {num:17, ar:"الْوَهَّابُ", phon:"Al-Wahhâb", fr:"Le Grand Donateur", def:"Qui offre Ses dons sans attendre de retour."},
  {num:18, ar:"الرَّزَّاقُ", phon:"Ar-Razzâq", fr:"Le Pourvoyeur", def:"Qui pourvoit aux besoins de toutes les créatures."},
  {num:19, ar:"الْفَتَّاحُ", phon:"Al-Fattâh", fr:"Le Grand Ouvreur", def:"Qui ouvre les portes de la grâce et du succès."},
  {num:20, ar:"الْعَلِيمُ", phon:"Al-'Alîm", fr:"L'Omniscient", def:"Dont la connaissance englobe tout, le visible et le caché."},
  {num:21, ar:"الْقَابِضُ", phon:"Al-Qâbid", fr:"Celui qui retient", def:"Qui retient et resserre selon Sa sagesse."},
  {num:22, ar:"الْبَاسِطُ", phon:"Al-Bâsit", fr:"Celui qui donne généreusement", def:"Qui étend Ses faveurs et répand Ses bienfaits."},
  {num:23, ar:"الْخَافِضُ", phon:"Al-Khâfid", fr:"Celui qui abaisse", def:"Qui abaisse les arrogants et élève les humbles."},
  {num:24, ar:"الرَّافِعُ", phon:"Ar-Râfi'", fr:"Celui qui élève", def:"Qui élève Ses serviteurs en rang et en honneur."},
  {num:25, ar:"الْمُعِزُّ", phon:"Al-Mu'izz", fr:"Celui qui honore", def:"Qui donne la puissance et la gloire à qui Il veut."},
  {num:26, ar:"الْمُذِلُّ", phon:"Al-Mudhill", fr:"Celui qui humilie", def:"Qui humilie les oppresseurs et les tyrans."},
  {num:27, ar:"السَّمِيعُ", phon:"As-Samî'", fr:"Celui qui entend tout", def:"Dont l'ouïe perçoit les sons les plus secrets."},
  {num:28, ar:"الْبَصِيرُ", phon:"Al-Basîr", fr:"Celui qui voit tout", def:"Dont la vision pénètre toute chose, même l'imperceptible."},
  {num:29, ar:"الْحَكَمُ", phon:"Al-Hakam", fr:"L'Arbitre suprême", def:"Dont le jugement est parfait et souverainement juste."},
  {num:30, ar:"الْعَدْلُ", phon:"Al-'Adl", fr:"Le Juste", def:"Dont la justice est parfaite et absolue."},
  {num:31, ar:"اللَّطِيفُ", phon:"Al-Latîf", fr:"Le Subtil et Bienveillant", def:"Dont la bienveillance subtile atteint tout en douceur."},
  {num:32, ar:"الْخَبِيرُ", phon:"Al-Khabîr", fr:"Le Parfaitement Informé", def:"Qui connaît toutes les réalités intérieures et cachées."},
  {num:33, ar:"الْحَلِيمُ", phon:"Al-Halîm", fr:"Le Doux et Clément", def:"Qui diffère le châtiment par Sa patience infinie."},
  {num:34, ar:"الْعَظِيمُ", phon:"Al-'Azîm", fr:"Le Très Grand", def:"Dont la grandeur transcende toute compréhension."},
  {num:35, ar:"الْغَفُورُ", phon:"Al-Ghafûr", fr:"Le Tout Pardonneur", def:"Qui efface les péchés et voile les fautes."},
  {num:36, ar:"الشَّكُورُ", phon:"Ash-Shakûr", fr:"Le Très Reconnaissant", def:"Qui récompense amplement le moindre bien."},
  {num:37, ar:"الْعَلِيُّ", phon:"Al-'Aliy", fr:"Le Très Haut", def:"Dont l'élévation est absolue au-dessus de toute chose."},
  {num:38, ar:"الْكَبِيرُ", phon:"Al-Kabîr", fr:"Le Grand", def:"Dont la grandeur est sans limite ni mesure."},
  {num:39, ar:"الْحَفِيظُ", phon:"Al-Hafîz", fr:"Le Gardien vigilant", def:"Qui préserve toute chose de la destruction."},
  {num:40, ar:"الْمُقِيتُ", phon:"Al-Muqît", fr:"Le Pourvoyeur de subsistance", def:"Qui nourrit et soutient toutes Ses créatures."},
  {num:41, ar:"الْحَسِيبُ", phon:"Al-Hasîb", fr:"Le Calculateur suprême", def:"Qui suffit à toute chose et rend compte de tout."},
  {num:42, ar:"الْجَلِيلُ", phon:"Al-Jalîl", fr:"Le Majestueux", def:"Dont la majesté et la gloire sont sans égales."},
  {num:43, ar:"الْكَرِيمُ", phon:"Al-Karîm", fr:"Le Très Généreux", def:"Dont la générosité est illimitée et inépuisable."},
  {num:44, ar:"الرَّقِيبُ", phon:"Ar-Raqîb", fr:"Le Vigilant", def:"Qui surveille toute chose avec une attention parfaite."},
  {num:45, ar:"الْمُجِيبُ", phon:"Al-Mujîb", fr:"Celui qui répond", def:"Qui répond à toute invocation sincère."},
  {num:46, ar:"الْوَاسِعُ", phon:"Al-Wâsi'", fr:"L'Immense", def:"Dont la miséricorde et la science sont sans frontières."},
  {num:47, ar:"الْحَكِيمُ", phon:"Al-Hakîm", fr:"Le Sage", def:"Dont la sagesse guide toute chose vers sa perfection."},
  {num:48, ar:"الْوَدُودُ", phon:"Al-Wadûd", fr:"Le Tout Aimant", def:"Dont l'amour pour Ses serviteurs est infini."},
  {num:49, ar:"الْمَجِيدُ", phon:"Al-Majîd", fr:"Le Glorieux", def:"Dont la gloire et l'excellence sont infinies."},
  {num:50, ar:"الْبَاعِثُ", phon:"Al-Bâ'ith", fr:"Celui qui ressuscite", def:"Qui ressuscitera les morts au Jour du Jugement."},
  {num:51, ar:"الشَّهِيدُ", phon:"Ash-Shahîd", fr:"Le Témoin", def:"Dont le témoignage embrasse toute chose."},
  {num:52, ar:"الْحَقُّ", phon:"Al-Haqq", fr:"La Vérité absolue", def:"Dont l'existence est la seule réalité immuable."},
  {num:53, ar:"الْوَكِيلُ", phon:"Al-Wakîl", fr:"Le Gardien suprême", def:"Sur qui l'on peut s'appuyer pleinement."},
  {num:54, ar:"الْقَوِيُّ", phon:"Al-Qawiy", fr:"Le Tout Fort", def:"Dont la force est absolue et inégalable."},
  {num:55, ar:"الْمَتِينُ", phon:"Al-Matîn", fr:"Le Ferme", def:"Dont la puissance est inébranlable et solide."},
  {num:56, ar:"الْوَلِيُّ", phon:"Al-Waliy", fr:"L'Allié", def:"Qui soutient et protège Ses serviteurs pieux."},
  {num:57, ar:"الْحَمِيدُ", phon:"Al-Hamîd", fr:"Le Digne de louanges", def:"Qui mérite toutes les louanges en toute circonstance."},
  {num:58, ar:"الْمُحْصِيُ", phon:"Al-Muhsî", fr:"Celui qui dénombre tout", def:"Qui compte chaque chose sans en oublier aucune."},
  {num:59, ar:"الْمُبْدِئُ", phon:"Al-Mubdi'", fr:"Celui qui commence", def:"Qui initie la création sans modèle préexistant."},
  {num:60, ar:"الْمُعِيدُ", phon:"Al-Mu'îd", fr:"Celui qui ramène", def:"Qui recréera toute chose après sa destruction."},
  {num:61, ar:"الْمُحْيِي", phon:"Al-Muhyî", fr:"Celui qui vivifie", def:"Qui donne la vie à qui Il veut."},
  {num:62, ar:"الْمُمِيتُ", phon:"Al-Mumît", fr:"Celui qui fait mourir", def:"Qui donne la mort selon Sa sagesse souveraine."},
  {num:63, ar:"الْحَيُّ", phon:"Al-Hayy", fr:"Le Vivant éternel", def:"Dont la vie est parfaite, sans début ni fin."},
  {num:64, ar:"الْقَيُّومُ", phon:"Al-Qayyûm", fr:"Le Subsistant par Lui-même", def:"Qui subsiste par Lui-même et dont dépend toute chose."},
  {num:65, ar:"الْوَاجِدُ", phon:"Al-Wâjid", fr:"Celui qui trouve", def:"Qui possède tout et à qui rien n'échappe."},
  {num:66, ar:"الْمَاجِدُ", phon:"Al-Mâjid", fr:"Le Noble", def:"Dont la noblesse et la magnificence sont sans limites."},
  {num:67, ar:"الْوَاحِدُ", phon:"Al-Wâhid", fr:"L'Unique", def:"Dont l'unicité est absolue, sans égal ni partenaire."},
  {num:68, ar:"الأَحَدُ", phon:"Al-Ahad", fr:"L'Un", def:"L'Un indivisible, seul dans Son essence absolue."},
  {num:69, ar:"الصَّمَدُ", phon:"As-Samad", fr:"L'Éternel refuge", def:"Vers qui toute chose se tourne dans le besoin."},
  {num:70, ar:"الْقَادِرُ", phon:"Al-Qâdir", fr:"Le Tout Puissant", def:"Qui est capable de toute chose par Sa volonté."},
  {num:71, ar:"الْمُقْتَدِرُ", phon:"Al-Muqtadir", fr:"Le Dominateur suprême", def:"Dont la puissance s'exerce sur toute chose."},
  {num:72, ar:"الْمُقَدِّمُ", phon:"Al-Muqaddim", fr:"Celui qui avance", def:"Qui fait avancer ce qu'Il veut selon Sa sagesse."},
  {num:73, ar:"الْمُؤَخِّرُ", phon:"Al-Mu'akhkhir", fr:"Celui qui reporte", def:"Qui reporte ce qu'Il veut selon Sa sagesse."},
  {num:74, ar:"الأَوَّلُ", phon:"Al-Awwal", fr:"Le Premier", def:"Avant qui il n'y avait rien, de toute éternité."},
  {num:75, ar:"الآخِرُ", phon:"Al-Âkhir", fr:"Le Dernier", def:"Après qui il n'y aura rien, pour l'éternité."},
  {num:76, ar:"الظَّاهِرُ", phon:"Az-Zâhir", fr:"L'Apparent", def:"Dont l'existence est évidente par Ses signes."},
  {num:77, ar:"الْبَاطِنُ", phon:"Al-Bâtin", fr:"Le Caché", def:"Dont l'essence est inaccessible à toute perception."},
  {num:78, ar:"الْوَالِي", phon:"Al-Wâlî", fr:"Le Gouverneur", def:"Qui gouverne et administre toute la création."},
  {num:79, ar:"الْمُتَعَالِي", phon:"Al-Muta'âlî", fr:"Le Très Élevé", def:"Transcendant toute chose et toute limite."},
  {num:80, ar:"الْبَرُّ", phon:"Al-Barr", fr:"La Source de bonté", def:"Dont la bonté et la bienveillance sont infinies."},
  {num:81, ar:"التَّوَّابُ", phon:"At-Tawwâb", fr:"Celui qui accueille le repentir", def:"Qui accepte le repentir encore et encore."},
  {num:82, ar:"الْمُنْتَقِمُ", phon:"Al-Muntaqim", fr:"Le Vengeur", def:"Qui punit les oppresseurs avec une justice absolue."},
  {num:83, ar:"الْعَفُوُّ", phon:"Al-'Afuw", fr:"Le Grand Effaceur", def:"Qui efface complètement les péchés de ses repentants."},
  {num:84, ar:"الرَّؤُوفُ", phon:"Ar-Ra'ûf", fr:"Le Très Compatissant", def:"Dont la compassion pour Ses créatures est immense."},
  {num:85, ar:"مَالِكُ الْمُلْكِ", phon:"Mâlik-ul-Mulk", fr:"Maître du Royaume", def:"Souverain absolu de toute chose existante."},
  {num:86, ar:"ذُو الْجَلَالِ وَالإِكْرَامِ", phon:"Dhul-Jalâli wal-Ikrâm", fr:"Seigneur de Majesté et de Générosité", def:"Qui unit en Lui majesté absolue et générosité infinie."},
  {num:87, ar:"الْمُقْسِطُ", phon:"Al-Muqsit", fr:"L'Équitable", def:"Dont l'équité est parfaite en tout jugement."},
  {num:88, ar:"الْجَامِعُ", phon:"Al-Jâmi'", fr:"Le Rassembleur", def:"Qui rassemblera toutes les créatures au Jour du Jugement."},
  {num:89, ar:"الْغَنِيُّ", phon:"Al-Ghaniy", fr:"L'Indépendant", def:"Qui n'a besoin de rien et de personne."},
  {num:90, ar:"الْمُغْنِي", phon:"Al-Mughnî", fr:"Celui qui enrichit", def:"Qui rend riche et comble de Ses bienfaits."},
  {num:91, ar:"الْمَانِعُ", phon:"Al-Mâni'", fr:"Celui qui empêche", def:"Qui protège en refusant ce qui serait nuisible."},
  {num:92, ar:"الضَّارُّ", phon:"Ad-Dârr", fr:"Celui qui afflige", def:"Qui envoie l'épreuve selon Sa sagesse souveraine."},
  {num:93, ar:"النَّافِعُ", phon:"An-Nâfi'", fr:"Celui qui profite", def:"Qui accorde le bienfait à qui Il veut."},
  {num:94, ar:"النُّورُ", phon:"An-Nûr", fr:"La Lumière", def:"Dont la lumière illumine les cœurs et les univers."},
  {num:95, ar:"الْهَادِي", phon:"Al-Hâdî", fr:"Le Guide", def:"Qui guide vers la vérité et le droit chemin."},
  {num:96, ar:"الْبَدِيعُ", phon:"Al-Badî'", fr:"L'Innovateur", def:"Qui crée des choses sans précédent ni modèle."},
  {num:97, ar:"الْبَاقِي", phon:"Al-Bâqî", fr:"L'Éternel", def:"Dont l'existence est sans fin, après la disparition de tout."},
  {num:98, ar:"الْوَارِثُ", phon:"Al-Wârith", fr:"L'Héritier suprême", def:"À qui revient tout à la fin, après la mort de tout."},
  {num:99, ar:"الرَّشِيدُ", phon:"Ar-Rashîd", fr:"Le Bien Guidé", def:"Dont les décisions mènent toujours au bien."},
];

const DUAS_DATA = {
  matin: [
    {
      ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
      phon: "Asbahna wa asbahal mulku lillahi wal hamdulillah",
      fr: "Nous voici au matin, et toute souveraineté appartient à Allah. Louange à Allah.",
      ref: "Muslim"
    },
    {
      ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      phon: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilaykan-nushur",
      fr: "Ô Allah, c'est par Toi que nous atteignons le matin, par Toi le soir, par Toi nous vivons, par Toi nous mourons, et vers Toi est la résurrection.",
      ref: "Tirmidhi"
    },
    {
      ar: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
      phon: "Radîtu billahi rabban, wa bil-islâmi dinan, wa bi-muhammadin sallallahu 'alayhi wa sallama nabiyyan",
      fr: "Je me satisfais d'Allah comme Seigneur, de l'Islam comme religion, et de Muhammad ﷺ comme prophète.",
      ref: "Abu Dawud"
    },
    {
      ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ",
      phon: "Allahumma anta rabbi, la ilaha illa anta, khalaqtani wa ana 'abduk",
      fr: "Ô Allah, Tu es mon Seigneur. Il n'y a de dieu que Toi. Tu m'as créé et je suis Ton serviteur.",
      ref: "Bukhari — Sayyid al-Istighfar"
    },
    {
      ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ — ١٠٠ مرة",
      phon: "Subhânallahi wa bihamdih (100 fois)",
      fr: "Gloire à Allah et louange à Lui — 100 fois le matin.",
      ref: "Muslim"
    },
    {
      ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
      phon: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'",
      fr: "Au nom d'Allah avec le nom duquel rien ne peut nuire, ni sur terre ni dans le ciel.",
      ref: "Abu Dawud · Tirmidhi — 3 fois"
    },
  ],
  soir: [
    {
      ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
      phon: "Amsayna wa amsal mulku lillahi wal hamdulillah",
      fr: "Nous voici au soir, et toute souveraineté appartient à Allah. Louange à Allah.",
      ref: "Muslim"
    },
    {
      ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
      phon: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu, wa ilaykal-masir",
      fr: "Ô Allah, c'est par Toi que nous atteignons le soir, par Toi le matin, par Toi nous vivons, par Toi nous mourons, et vers Toi est le retour.",
      ref: "Tirmidhi"
    },
    {
      ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      phon: "A'udhu bikalimâtillâhit-tâmmâti min sharri mâ khalaq",
      fr: "Je cherche refuge dans les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
      ref: "Muslim · 3 fois le soir"
    },
    {
      ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      phon: "Allahumma inni as'alukal-'afwa wal-'âfiyata fid-dunyâ wal-âkhira",
      fr: "Ô Allah, je Te demande le pardon et la santé dans ce monde et dans l'au-delà.",
      ref: "Abu Dawud · Ibn Majah"
    },
    {
      ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      phon: "Bismika Allahumma amutu wa ahya",
      fr: "En Ton nom, ô Allah, je meurs et je vis.",
      ref: "Bukhari — avant de dormir"
    },
    {
      ar: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      phon: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
      fr: "Ô Allah, préserve-moi de Ton châtiment le Jour où Tu ressusciteras Tes serviteurs.",
      ref: "Abu Dawud · 3 fois"
    },
  ]
};

function TabPrieres(){
  const [checks,setChecks]=useState({});
  const [intention,setIntention]=useState("");
  const done=PRIERES_LIST.filter(p=>checks[p]).length;
  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"16px"})}}>
        <div style={{fontSize:13,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",marginBottom:6}}>"La prière est le pilier de la religion. 🤍"</div>
        <div style={{fontSize:12,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>{done}/5 prières aujourd'hui {done===5?"🎉":""}</div>
      </div>
      <div style={card({padding:0,overflow:"hidden"})}>
        {PRIERES_LIST.map((p,i)=>(
          <div key={p} onClick={()=>setChecks(prev=>({...prev,[p]:!prev[p]}))}
            style={{display:"flex",alignItems:"center",gap:12,padding:"16px",borderBottom:i<PRIERES_LIST.length-1?`1px solid ${P.beige}`:"none",cursor:"pointer",background:checks[p]?P.goldLight:"transparent",transition:"background 0.2s"}}>
            <div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${checks[p]?P.gold:P.beigeDeep}`,background:checks[p]?P.gold:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>{checks[p]&&<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="11" height="11"><polyline points="20 6 9 17 4 12"/></svg>}</div>
            <span style={{flex:1,fontSize:15,color:checks[p]?P.textLight:P.text,textDecoration:checks[p]?"line-through":"none",fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{p}</span>
          </div>
        ))}
      </div>
      <div style={card()}>
        <div style={h2}>🤲 Niyyah du jour</div>
        <input style={inp} placeholder="Mon intention pour aujourd'hui..." value={intention} onChange={e=>setIntention(e.target.value)}/>
      </div>
    </div>
  );
}

function TabDhikr(){
  const [counts,setCounts]=useState(DHIKR_DATA.reduce((a,d)=>({...a,[d.text]:0}),{}));
  const increment=t=>setCounts(p=>({...p,[t]:Math.min((p[t]||0)+1,DHIKR_DATA.find(d=>d.text===t)?.count||99)}));
  const reset=()=>setCounts(DHIKR_DATA.reduce((a,d)=>({...a,[d.text]:0}),{}));
  return(
    <div>
      {DHIKR_DATA.map(d=>{
        const c=counts[d.text]||0;
        const pct=Math.round(c/d.count*100);
        return(
          <div key={d.text} style={card()} onClick={()=>increment(d.text)}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontSize:20,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontWeight:700,marginBottom:2}}>{d.ar}</div><div style={{fontSize:13,color:P.brown,fontFamily:"'DM Sans',sans-serif"}}>{d.text}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:700,color:c>=d.count?P.gold:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{c}</div><div style={{fontSize:10,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>/{d.count}</div></div>
            </div>
            <div style={{height:6,borderRadius:3,background:P.beige}}><div style={{height:"100%",borderRadius:3,background:c>=d.count?P.gold:P.taupe,width:`${pct}%`,transition:"width 0.2s"}}/></div>
            {c>=d.count&&<div style={{textAlign:"center",marginTop:6,fontSize:12,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>Terminé 🎉</div>}
          </div>
        );
      })}
      <button style={btn(P.beige,P.darkBrown,{width:"100%"})} onClick={reset}>🔄 Recommencer</button>
    </div>
  );
}

function TabCoranS(){
  const [objectif,setObjectif]=useState(30);
  const [lu,setLu]=useState(5);
  const [journal,setJournal]=useState([{id:1,date:"Aujourd'hui",pages:3,sourate:"Al-Baqara",note:""}]);
  const [newEntry,setNewEntry]=useState({pages:"",sourate:"",note:""});
  const pct=Math.min(Math.round(lu/objectif*100),100);
  const save=()=>{if(newEntry.pages){const d=new Date();setJournal(p=>[{id:NID++,date:`${d.getDate()}/${d.getMonth()+1}`,...newEntry},...p]);setLu(l=>l+Number(newEntry.pages));setNewEntry({pages:"",sourate:"",note:""});}};
  return(
    <div>
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"18px"})}}>
        <div style={{fontSize:16,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>📖 Mon objectif Coran</div>
        <div style={{fontSize:28,fontWeight:700,color:P.gold,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{lu} / {objectif} pages</div>
        <div style={{height:10,borderRadius:5,background:"rgba(255,255,255,0.5)",margin:"10px 0"}}><div style={{height:"100%",borderRadius:5,background:P.gold,width:`${pct}%`,transition:"width 0.3s"}}/></div>
        <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{pct}% de l'objectif</div>
      </div>
      <div style={card()}>
        <div style={h2}>📝 Enregistrer ma lecture</div>
        <div style={{display:"flex",gap:8,marginBottom:8}}>
          <input style={{...inp,flex:1}} placeholder="Pages lues" type="number" value={newEntry.pages} onChange={e=>setNewEntry(p=>({...p,pages:e.target.value}))}/>
          <input style={{...inp,flex:2}} placeholder="Sourate / Juz" value={newEntry.sourate} onChange={e=>setNewEntry(p=>({...p,sourate:e.target.value}))}/>
        </div>
        <input style={{...inp,marginBottom:10}} placeholder="Note ou réflexion..." value={newEntry.note} onChange={e=>setNewEntry(p=>({...p,note:e.target.value}))}/>
        <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={save}>✓ Enregistrer</button>
      </div>
      {journal.map(e=>(
        <div key={e.id} style={card({padding:"12px 16px"})}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>📅 {e.date}</span><span style={{fontSize:12,fontWeight:600,color:P.darkBrown,fontFamily:"'DM Sans',sans-serif"}}>{e.pages} pages</span></div>
          <div style={{fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif"}}>{e.sourate}</div>
          {e.note&&<div style={{fontSize:12,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif",marginTop:4}}>{e.note}</div>}
        </div>
      ))}
    </div>
  );
}

function TabDuasS(){
  const [moment,setMoment]=useState("matin");
  const [idx,setIdx]=useState(0);
  const [showPhon,setShowPhon]=useState({});
  const [perso,setPerso]=useState([]);
  const [newDua,setNewDua]=useState({ar:"",phon:"",fr:""});
  const [showAdd,setShowAdd]=useState(false);
  const duas = DUAS_DATA[moment];
  const togglePhon = id => setShowPhon(p=>({...p,[id]:!p[id]}));
  return(
    <div>
      {/* Sélecteur matin / soir */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[{id:"matin",label:"🌅 Duas du matin"},{id:"soir",label:"🌙 Duas du soir"}].map(m=>(
          <div key={m.id} onClick={()=>{setMoment(m.id);setIdx(0);}} style={{flex:1,textAlign:"center",padding:"11px 8px",borderRadius:14,cursor:"pointer",border:`1.5px solid ${moment===m.id?P.gold:P.beige}`,background:moment===m.id?P.goldLight:P.card,color:moment===m.id?P.darkBrown:P.textLight,fontSize:12,fontFamily:"'DM Sans',sans-serif",fontWeight:moment===m.id?700:400,transition:"all 0.2s"}}>{m.label}</div>
        ))}
      </div>

      {/* Duas liste */}
      {duas.map((d,i)=>(
        <div key={i} style={card({border:`1.5px solid ${i===idx?P.gold:P.beige}`,background:i===idx?`${P.goldLight}40`:P.card})}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:P.darkBrown,flexShrink:0}}>{i+1}</div>
            <span style={{fontSize:10,padding:"2px 8px",borderRadius:20,background:P.soft,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{d.ref}</span>
          </div>
          {/* Arabe */}
          <div style={{fontSize:20,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",lineHeight:1.8,textAlign:"right",marginBottom:8,direction:"rtl"}}>{d.ar}</div>
          {/* Phonétique toggle */}
          <button onClick={()=>togglePhon(i)} style={{...btn(P.soft,P.brown,{padding:"5px 12px",fontSize:11,marginBottom:8,border:`1px solid ${P.beige}`})}}>
            {showPhon[i]?"🔼 Masquer la phonétique":"🔤 Voir la phonétique"}
          </button>
          {showPhon[i]&&(
            <div style={{padding:"8px 12px",borderRadius:10,background:P.beige,fontSize:13,color:P.brown,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",marginBottom:8,lineHeight:1.6}}>{d.phon}</div>
          )}
          {/* Traduction */}
          <div style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6}}>{d.fr}</div>
        </div>
      ))}

      {/* Duas personnelles */}
      <div style={card()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={h2}>📚 Mes duas personnelles</div>
          <button style={btn(P.beige,P.darkBrown,{padding:"6px 11px",fontSize:11})} onClick={()=>setShowAdd(!showAdd)}>+ Ajouter</button>
        </div>
        {showAdd&&(
          <div style={{marginBottom:12,padding:"12px",borderRadius:12,background:P.soft,border:`1px solid ${P.beige}`}}>
            <textarea style={{...inp,minHeight:60,resize:"none",marginBottom:8}} placeholder="Dua en arabe..." value={newDua.ar} onChange={e=>setNewDua(p=>({...p,ar:e.target.value}))}/>
            <input style={{...inp,marginBottom:8}} placeholder="Phonétique..." value={newDua.phon} onChange={e=>setNewDua(p=>({...p,phon:e.target.value}))}/>
            <textarea style={{...inp,minHeight:50,resize:"none",marginBottom:10}} placeholder="Traduction..." value={newDua.fr} onChange={e=>setNewDua(p=>({...p,fr:e.target.value}))}/>
            <button style={btn(P.gold,P.darkBrown,{width:"100%"})} onClick={()=>{if(newDua.ar.trim()){setPerso(p=>[...p,{id:NID++,...newDua}]);setNewDua({ar:"",phon:"",fr:""});setShowAdd(false);}}}>Sauvegarder</button>
          </div>
        )}
        {perso.length===0&&!showAdd&&<div style={{fontSize:12,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>Tes duas personnelles seront ici. 🤲</div>}
        {perso.map(d=>(
          <div key={d.id} style={{padding:"12px 0",borderBottom:`1px solid ${P.beige}`}}>
            <div style={{fontSize:18,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4,direction:"rtl",textAlign:"right"}}>{d.ar}</div>
            {d.phon&&<div style={{fontSize:12,color:P.brown,fontStyle:"italic",fontFamily:"'DM Sans',sans-serif",marginBottom:3}}>{d.phon}</div>}
            {d.fr&&<div style={{fontSize:12,color:P.textLight,fontStyle:"italic",fontFamily:"'Cormorant Garamond',serif"}}>{d.fr}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabAsma(){
  const d = new Date();
  const todayNum = ((d.getDate()-1) % 99);
  const [selected,setSelected] = useState(todayNum);
  const [learned,setLearned]   = useState({});
  const [filter,setFilter]     = useState("all"); // all | today | learned
  const [showPhon,setShowPhon] = useState({});
  const nom = ASMA_ALLAH[selected];
  const toggleLearn = idx => setLearned(p=>({...p,[idx]:!p[idx]}));
  const togglePhon  = idx => setShowPhon(p=>({...p,[idx]:!p[idx]}));
  const learnedCount = Object.values(learned).filter(Boolean).length;

  return(
    <div>
      {/* Nom du jour */}
      <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"22px 20px"})}}>
        <div style={{fontSize:10,color:P.gold,fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>✨ Nom du jour · {nom.num}/99</div>
        <div style={{fontSize:42,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:6,lineHeight:1.3}}>{nom.ar}</div>
        <div style={{fontSize:13,color:P.brown,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic",marginBottom:4}}>{nom.phon}</div>
        <div style={{fontSize:18,fontWeight:700,color:P.gold,fontFamily:"'Cormorant Garamond',serif",marginBottom:8}}>{nom.fr}</div>
        <div style={{fontSize:13,color:P.brown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6}}>"{nom.def}"</div>
        <button onClick={()=>toggleLearn(selected)} style={{...btn(learned[selected]?P.gold:P.beige, learned[selected]?P.darkBrown:P.brown, {padding:"8px 20px",fontSize:12,marginTop:12})}}>
          {learned[selected]?"✓ Appris 🌟":"Marquer comme appris"}
        </button>
      </div>

      {/* Progression */}
      <div style={card({padding:"12px 16px"})}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:13,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontWeight:600}}>{learnedCount}/99 noms appris</div>
          <span style={{fontSize:11,color:P.gold,fontFamily:"'DM Sans',sans-serif"}}>{Math.round(learnedCount/99*100)}%</span>
        </div>
        <div style={{height:8,borderRadius:4,background:P.beige}}>
          <div style={{height:"100%",borderRadius:4,background:P.gold,width:`${Math.round(learnedCount/99*100)}%`,transition:"width 0.3s"}}/>
        </div>
      </div>

      {/* Filtres */}
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[{id:"all",l:"Tous (99)"},{id:"learned",l:`Appris (${learnedCount})`},{id:"today",l:"Aujourd'hui"}].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)} style={btn(filter===f.id?P.darkBrown:P.beige, filter===f.id?"#fff":P.darkBrown, {flex:1,padding:"8px 6px",fontSize:11})}>{f.l}</button>
        ))}
      </div>

      {/* Liste des noms */}
      <div style={card({padding:0,overflow:"hidden"})}>
        {ASMA_ALLAH
          .filter((_,i) => filter==="learned" ? learned[i] : filter==="today" ? i===todayNum : true)
          .map((n,i)=>{
            const realIdx = filter==="all" ? i : filter==="today" ? todayNum : ASMA_ALLAH.indexOf(n);
            const isToday = realIdx===todayNum;
            const isLearned = learned[realIdx];
            return(
              <div key={n.num} onClick={()=>setSelected(realIdx)}
                style={{padding:"12px 16px",borderBottom:`1px solid ${P.beige}`,background:isToday?P.goldLight:selected===realIdx?`${P.goldLight}40`:"transparent",cursor:"pointer",transition:"background 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <span style={{fontSize:11,fontWeight:700,color:P.gold,fontFamily:"'DM Sans',sans-serif",width:22,flexShrink:0}}>{n.num}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,justifyContent:"space-between"}}>
                      <span style={{fontSize:20,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{n.ar}</span>
                      {isLearned&&<span style={{fontSize:11,color:P.gold}}>✓ Appris</span>}
                      {isToday&&!isLearned&&<span style={{fontSize:10,background:P.gold,color:"#fff",padding:"1px 7px",borderRadius:10,fontFamily:"'DM Sans',sans-serif"}}>Aujourd'hui</span>}
                    </div>
                    <div style={{fontSize:11,color:P.brown,fontFamily:"'DM Sans',sans-serif",fontStyle:"italic"}}>{n.phon}</div>
                  </div>
                </div>
                {selected===realIdx&&(
                  <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${P.beige}`}}>
                    <div style={{fontSize:13,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:4}}>{n.fr}</div>
                    <div style={{fontSize:12,color:P.brown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6}}>{n.def}</div>
                    <button onClick={e=>{e.stopPropagation();toggleLearn(realIdx);}} style={{...btn(isLearned?P.gold:P.beige,isLearned?P.darkBrown:P.brown,{padding:"6px 14px",fontSize:11,marginTop:8})}}>
                      {isLearned?"✓ Appris 🌟":"Marquer comme appris"}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

const TABS_SPIRIT=[{id:"prieres",label:"🕌 Prières"},{id:"dhikr",label:"📿 Dhikr"},{id:"coran",label:"📖 Coran"},{id:"duas",label:"🤲 Duas"},{id:"asma",label:"✨ Asma Allah"}];

function Spiritualite({onBack}){
  const [tab,setTab]=useState("prieres");
  return(
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,fontFamily:"'DM Sans',sans-serif",paddingBottom:24}}>
      <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></div>}
          <div style={{color:P.gold}}><svg viewBox="0 0 24 24" fill="none" stroke={P.gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></div>
          <div><div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Spiritualité</div><div style={{fontSize:12,color:P.textLight}}>Deen & cœur 🤍</div></div>
        </div>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none"}}>
          {TABS_SPIRIT.map(t=><div key={t.id} onClick={()=>setTab(t.id)} style={{flex:"0 0 auto",padding:"10px 13px 9px",cursor:"pointer",fontSize:12,fontFamily:"'DM Sans',sans-serif",color:tab===t.id?P.darkBrown:P.textLight,borderBottom:`2.5px solid ${tab===t.id?P.gold:"transparent"}`,fontWeight:tab===t.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{t.label}</div>)}
        </div>
      </div>
      <div style={{padding:"18px 16px 0"}}>
        {tab==="prieres" &&<TabPrieres/>}
        {tab==="dhikr"   &&<TabDhikr/>}
        {tab==="coran"   &&<TabCoranS/>}
        {tab==="duas"    &&<TabDuasS/>}
        {tab==="asma"    &&<TabAsma/>}
      </div>
    </div>
  );
}



// ═══════════════════════════════════════════════════════
// JOURNAL DES JOURS — Sauvegarde & Archives
// ═══════════════════════════════════════════════════════
function JournalJours({ onBack }) {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving,   setSaving]   = useState(false);
  const [form, setForm] = useState({
    humeur: "", intention: "", victoire: "", gratitude: ["","",""],
    sport: "", notes: "", checkDailyTasks: ""
  });

  const todayKey = () => {
    const d = new Date();
    return `journal:${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const dateLabel = key => {
    const [,y,m,d] = key.split(":");
    const [yr,mo,da] = [y,m,d].map(Number);
    const date = new Date(yr,mo-1,da);
    const JOURS_FR = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    const MOIS_FR  = ["jan","fév","mar","avr","mai","jun","jul","août","sep","oct","nov","déc"];
    return `${JOURS_FR[date.getDay()]} ${da} ${MOIS_FR[mo-1]} ${yr}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const keys = await window.storage.list("journal:");
        const loaded = [];
        for (const key of (keys.keys || [])) {
          try {
            const r = await window.storage.get(key);
            if (r) loaded.push({ key, ...JSON.parse(r.value) });
          } catch(e) {}
        }
        loaded.sort((a,b) => b.key.localeCompare(a.key));
        setEntries(loaded);
      } catch(e) {}
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!form.humeur && !form.intention && !form.victoire && !form.notes) return;
    setSaving(true);
    try {
      const key = todayKey();
      const data = { ...form, savedAt: new Date().toISOString() };
      await window.storage.set(key, JSON.stringify(data));
      const existing = entries.find(e => e.key === key);
      if (existing) {
        setEntries(p => p.map(e => e.key === key ? { key, ...data } : e));
      } else {
        setEntries(p => [{ key, ...data }, ...p]);
      }
      setForm({ humeur:"", intention:"", victoire:"", gratitude:["","",""], sport:"", notes:"", checkDailyTasks:"" });
    } catch(e) {}
    setSaving(false);
  };

  const deleteEntry = async key => {
    try { await window.storage.delete(key); } catch(e) {}
    setEntries(p => p.filter(e => e.key !== key));
    if (selected?.key === key) setSelected(null);
  };

  const HUMEURS = [{ico:"💛",l:"Bien"},{ico:"😌",l:"Calme"},{ico:"🔥",l:"Motivée"},{ico:"😮‍💨",l:"Fatiguée"},{ico:"😤",l:"Stressée"},{ico:"✨",l:"Au top"}];

  // Vue détail d'une entrée
  if (selected) {
    return (
      <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,paddingBottom:24}}>
        <div style={{background:P.card,padding:"52px 20px 16px",borderBottom:`1px solid ${P.beige}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div onClick={()=>setSelected(null)} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><Ico.back/></div>
            <div>
              <div style={{fontSize:16,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{dateLabel(selected.key)}</div>
              <div style={{fontSize:11,color:P.textLight}}>Feuille du jour 📄</div>
            </div>
            <div style={{marginLeft:"auto"}}>
              <button onClick={()=>deleteEntry(selected.key)} style={btn("#FFEBEE","#C62828",{padding:"6px 12px",fontSize:11})}>🗑 Supprimer</button>
            </div>
          </div>
        </div>
        <div style={{padding:"18px 16px 0"}}>
          {selected.humeur&&(
            <div style={card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"16px"})}>
              <div style={{fontSize:28,marginBottom:4}}>{HUMEURS.find(h=>h.l===selected.humeur)?.ico||"💛"}</div>
              <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>Humeur : {selected.humeur}</div>
            </div>
          )}
          {selected.intention&&(
            <div style={card()}>
              <div style={h3}>✨ Intention du jour</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.7}}>{selected.intention}</div>
            </div>
          )}
          {selected.victoire&&(
            <div style={card()}>
              <div style={h3}>🏆 Victoire du jour</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.7}}>{selected.victoire}</div>
            </div>
          )}
          {selected.gratitude?.some(g=>g)&&(
            <div style={card()}>
              <div style={h3}>🙏 Gratitude</div>
              {selected.gratitude.filter(g=>g).map((g,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                  <div style={{width:18,height:18,borderRadius:"50%",background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:P.gold,fontWeight:700,flexShrink:0,marginTop:2}}>✦</div>
                  <span style={{fontSize:13,color:P.text,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",lineHeight:1.6}}>{g}</span>
                </div>
              ))}
            </div>
          )}
          {selected.sport&&(
            <div style={card()}>
              <div style={h3}>🏃‍♀️ Sport</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif"}}>{selected.sport}</div>
            </div>
          )}
          {selected.notes&&(
            <div style={card()}>
              <div style={h3}>📝 Notes libres</div>
              <div style={{fontSize:13,color:P.text,fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{selected.notes}</div>
            </div>
          )}
          <div style={{...card({background:P.soft,textAlign:"center",padding:"12px"})}}>
            <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>Enregistré le {new Date(selected.savedAt).toLocaleString("fr-FR")}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:420,margin:"0 auto",minHeight:"100vh",background:P.bg,paddingBottom:24}}>
      <div style={{background:P.card,padding:"52px 20px 0",borderBottom:`1px solid ${P.beige}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
          {onBack&&<div onClick={onBack} style={{width:36,height:36,borderRadius:"50%",border:`1px solid ${P.beige}`,background:P.soft,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:P.brown,flexShrink:0}}><Ico.back/></div>}
          <div style={{color:P.gold}}><Ico.book/></div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',Georgia,serif"}}>Journal des jours</div>
            <div style={{fontSize:12,color:P.textLight}}>Tes feuilles du quotidien 📄</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,padding:"0 0 16px"}}>
          {["sauvegarder","archives"].map(t=>(
            <div key={t} onClick={()=>setSelected(t==="sauvegarder"?null:selected)}
              style={{flex:1}}/>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 16px 0"}}>
        {/* Formulaire sauvegarde du jour */}
        <div style={card({border:`2px solid ${P.gold}`})}>
          <div style={{fontSize:15,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:12}}>📝 Sauvegarder ma journée</div>

          {/* Humeur */}
          <div style={h3}>Comment s'est passée ta journée ?</div>
          <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
            {HUMEURS.map(h=>(
              <div key={h.l} onClick={()=>setForm(p=>({...p,humeur:form.humeur===h.l?"":h.l}))}
                style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",borderRadius:20,cursor:"pointer",border:`1.5px solid ${form.humeur===h.l?P.gold:P.beige}`,background:form.humeur===h.l?P.goldLight:P.soft,transition:"all 0.2s"}}>
                <span style={{fontSize:16}}>{h.ico}</span>
                <span style={{fontSize:11,color:form.humeur===h.l?P.darkBrown:P.textLight,fontFamily:"'DM Sans',sans-serif"}}>{h.l}</span>
              </div>
            ))}
          </div>

          {/* Intention */}
          <div style={h3}>Mon intention du jour était...</div>
          <input style={{...inp,marginBottom:10}} placeholder="Mon intention..."
            value={form.intention} onChange={e=>setForm(p=>({...p,intention:e.target.value}))}/>

          {/* Victoire */}
          <div style={h3}>🏆 Ma victoire du jour</div>
          <input style={{...inp,marginBottom:10}} placeholder="Quelque chose dont je suis fière..."
            value={form.victoire} onChange={e=>setForm(p=>({...p,victoire:e.target.value}))}/>

          {/* Gratitude */}
          <div style={h3}>🙏 3 choses pour lesquelles je suis reconnaissante</div>
          {form.gratitude.map((g,i)=>(
            <input key={i} style={{...inp,marginBottom:6}} placeholder={`Gratitude ${i+1}...`}
              value={g} onChange={e=>setForm(p=>({...p,gratitude:p.gratitude.map((x,j)=>j===i?e.target.value:x)}))}/>
          ))}

          {/* Sport */}
          <div style={{height:10}}/>
          <div style={h3}>🏃‍♀️ Sport du jour (optionnel)</div>
          <input style={{...inp,marginBottom:10}} placeholder="Ex: 30 min de marche ✅"
            value={form.sport} onChange={e=>setForm(p=>({...p,sport:e.target.value}))}/>

          {/* Notes libres */}
          <div style={h3}>📝 Notes libres</div>
          <textarea style={{...inp,minHeight:80,resize:"none",lineHeight:1.6,marginBottom:14}}
            placeholder="Tout ce que tu veux garder de cette journée..."
            value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>

          <button style={btn(P.darkBrown,"#fff",{width:"100%",opacity:saving?0.7:1})} onClick={save} disabled={saving}>
            {saving?"Sauvegarde en cours...":"💾 Sauvegarder cette journée"}
          </button>
        </div>

        {/* Archives */}
        <div style={{fontSize:15,fontWeight:700,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",marginBottom:12,marginTop:4}}>
          📚 Mes feuilles passées ({entries.length})
        </div>

        {loading&&<div style={{...card({textAlign:"center",padding:"24px"}),fontSize:13,color:P.textLight,fontFamily:"'Cormorant Garamond',serif"}}>Chargement... 🌿</div>}

        {!loading&&entries.length===0&&(
          <div style={{...card({background:`linear-gradient(135deg,${P.soft},${P.goldLight})`,textAlign:"center",padding:"28px"})}}>
            <div style={{fontSize:28,marginBottom:8}}>📄</div>
            <div style={{fontSize:13,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>
              Tes journées sauvegardées apparaîtront ici.<br/>Chaque feuille est une trace de ta vie. 🌿
            </div>
          </div>
        )}

        {entries.map(e=>(
          <div key={e.key} onClick={()=>setSelected(e)} style={card({padding:0,overflow:"hidden",cursor:"pointer"})}>
            <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
              <div style={{width:40,height:40,borderRadius:12,background:P.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {HUMEURS.find(h=>h.l===e.humeur)?.ico||"📄"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:P.darkBrown,fontFamily:"'Cormorant Garamond',serif"}}>{dateLabel(e.key)}</div>
                <div style={{fontSize:11,color:P.textLight,fontFamily:"'DM Sans',sans-serif",marginTop:2}}>
                  {[e.intention&&"✨ Intention",e.victoire&&"🏆 Victoire",e.sport&&"🏃‍♀️ Sport"].filter(Boolean).join(" · ")||"📝 Notes du jour"}
                </div>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke={P.taupe} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyHayat;
