(() => {
  const $=s=>document.querySelector(s);
  const menu=$("#menu"),menuGrid=$("#menu-grid"),carousel=$("#carousel"),carouselContent=$("#carousel-content"),tool=$("#tool-panel"),toolContent=$("#tool-content");
  let activeEye=null, touchStart=null, lastTap=0, voiceRec=null;

  const eyeMenus={
    left:[
      ["🎵","Music","Open your music controls."],["🎮","Games","Tiny games and reactions."],["🪄","Tricks","D.A.B.S.y's weird little tricks."],["🎨","Create","Ideas, writing and creativity."],["🎲","Surprise","Let D.A.B.S.y choose."]
    ],
    right:[
      ["🧠","Ask","Ask D.A.B.S.y anything."],["👀","Vision","Show D.A.B.S.y something."],["📚","Study","Explain or solve what you show."],["🔎","Explain","Break down a concept."],["💡","Ideas","Brainstorm with your pet."]
    ]
  };

  function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(x._t);x._t=setTimeout(()=>x.classList.remove("show"),2600)}
  function closePanels(){[menu,carousel,tool].forEach(x=>{x.classList.add("hidden");x.setAttribute("aria-hidden","true")});$("#app").classList.remove("projection-active");DABSYVision.stop()}
  function showTool(html){toolContent.innerHTML=html;tool.classList.remove("hidden");tool.setAttribute("aria-hidden","false")}
  function openMenu(){
    menuGrid.innerHTML=[
      ["📋","Tasks","Your task list","tasks"],["⏰","Reminders","Local reminders","reminders"],["📅","Calendar","Plan your day","calendar"],
      ["🧠","Memory","D.A.B.S.y's memory","memory"],["👀","Vision","Camera & screen","vision"],["🎤","Voice","Talk to D.A.B.S.y","voice"],
      ["🐾","Pet","Care for D.A.B.S.y","pet"],["⚙️","Settings","AI, voice, privacy","settings"]
    ].map(x=>`<button class="menu-item" data-tool="${x[3]}"><strong>${x[0]} ${x[1]}</strong><span>${x[2]}</span></button>`).join("");
    menu.classList.remove("hidden");menu.setAttribute("aria-hidden","false");
  }

  function openCarousel(side){
    activeEye=side;$("#carousel-eye-label").textContent=(side==="left"?"Left eye":"Right eye")+" · swipe";
    renderCarousel(0);carousel.classList.remove("hidden");carousel.setAttribute("aria-hidden","false");
  }
  let carouselIndex=0;
  function renderCarousel(i){carouselIndex=(i+eyeMenus[activeEye].length)%eyeMenus[activeEye].length;const [icon,title,desc]=eyeMenus[activeEye][carouselIndex];carouselContent.innerHTML=`<div><div style="font-size:58px">${icon}</div><h2>${title}</h2><p class="small">${desc}</p><button class="action-btn" id="carousel-go">Open</button></div>`;$("#carousel-go").onclick=()=>runEyeTool(activeEye,title)}
  async function runEyeTool(side,title){
    closePanels();
    if(title==="Vision") return visionMenu();
    if(title==="Ask"||title==="Explain"||title==="Ideas"||title==="Study") return askTool(title);
    if(title==="Games") return gamesTool();
    if(title==="Tricks") return trickTool();
    if(title==="Music") return musicTool();
    if(title==="Create") return askTool(title);
    if(title==="Surprise"){const picks=["trick","pet","ask"];const p=picks[Math.floor(Math.random()*picks.length)];return p==="trick"?trickTool():p==="pet"?petTool():askTool("Surprise")}
  }

  function askTool(mode){
    showTool(`<h2>${mode==="Study"?"📚 Study with me":"🧠 "+mode}</h2>
      <div class="field"><label>What should I help with?</label><textarea id="ask-input" rows="4" placeholder="${mode==="Study"?"Paste a question or describe what you're studying...":"Ask anything..."}"></textarea></div>
      <div class="row"><button class="action-btn" id="ask-send">Ask D.A.B.S.y</button><button class="action-btn" id="ask-voice">🎤 Speak</button></div>
      <p class="small">If you have configured Gemini, D.A.B.S.y will return a real AI answer.</p>`);
    $("#ask-send").onclick=async()=>{const q=$("#ask-input").value.trim();if(!q)return;await answer(q)};
    $("#ask-voice").onclick=startVoice;
  }
  async function answer(q,image=null){
    DABSYFace.mood("thinking");DABSYFace.say("Thinking...",1200);
    try{const a=await DABSYAI.ask(q,image);DABSYStore.stat("questions");DABSYFace.mood("happy",900);project("D.A.B.S.y",a);DABSYAI.speak(a)}catch(e){DABSYFace.say("I need my AI connection set up first.");toast(e.message)}
  }
  function project(title,body){$("#projection-title").textContent=title;$("#projection-body").textContent=body;$("#projection").hidden=false;$("#app").classList.add("projection-active");setTimeout(()=>{$("#projection").hidden=true;$("#app").classList.remove("projection-active")},9000)}
  function visionMenu(){showTool(`<h2>👀 Vision</h2><p class="small">D.A.B.S.y only sees what you explicitly choose to share.</p><div class="row"><button class="action-btn" id="cam">📷 Camera</button><button class="action-btn" id="screen">🖥️ Screen</button></div><div class="row"><button class="action-btn" id="snap">🔍 Analyze current camera</button></div>`);$("#cam").onclick=async()=>{try{await DABSYVision.camera();toast("Camera on. Tap Analyze when ready.")}catch(e){toast(e.message)}};$("#snap").onclick=async()=>{try{const img=DABSYVision.snapshot();DABSYVision.stop();await answer("Describe what is in this image. Identify important text, objects, diagrams or problems. If it looks like a study question, explain what it asks.",img)}catch(e){toast(e.message)}};$("#screen").onclick=async()=>{try{const img=await DABSYVision.screen();await answer("Look at this screen capture. Explain what is happening and identify anything important I may be asking about.",img)}catch(e){toast(e.message)}}}

  function tasksTool(){showTool(`<h2>📋 Tasks</h2><div class="field"><input id="task-input" placeholder="Add a task..."></div><button class="action-btn" id="task-add">Add</button><div class="list">${DABSYStore.get().tasks.map(t=>`<div class="list-item"><label><input type="checkbox" data-task="${t.id}" ${t.done?"checked":""}> ${escapeHtml(t.text)}</label></div>`).join("")||'<p class="small">Nothing here yet.</p>'}</div>`);$("#task-add").onclick=()=>{const v=$("#task-input").value.trim();if(v){DABSYStore.addTask(v);tasksTool()}};document.querySelectorAll("[data-task]").forEach(x=>x.onchange=()=>DABSYStore.toggleTask(x.dataset.task))}
  function remindersTool(){showTool(`<h2>⏰ Reminders</h2><div class="field"><input id="rem-text" placeholder="Reminder..."></div><div class="field"><input id="rem-time" type="datetime-local"></div><button class="action-btn" id="rem-add">Set reminder</button><div class="list">${DABSYStore.get().reminders.map(r=>`<div class="list-item">${escapeHtml(r.text)}<br><span class="small">${new Date(r.when).toLocaleString()}</span></div>`).join("")||'<p class="small">No reminders yet.</p>'}</div>`);$("#rem-add").onclick=()=>{const t=$("#rem-text").value.trim(),w=$("#rem-time").value;if(t&&w){DABSYStore.addReminder(t,new Date(w).getTime());remindersTool()}}}
  function calendarTool(){showTool(`<h2>📅 Today</h2><p>${new Date().toLocaleDateString(undefined,{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p><p class="small">D.A.B.S.y's lightweight planner is stored locally on this device. Full calendar integrations can be added through a backend/connector later.</p><button class="action-btn" id="cal-task">Add today's task</button>`);$("#cal-task").onclick=tasksTool}
  function memoryTool(){showTool(`<h2>🧠 Memory</h2><p class="small">Only information saved by D.A.B.S.y is stored locally in this browser.</p><div class="list">${DABSYStore.get().memory.map(m=>`<div class="list-item">${escapeHtml(m.text)}</div>`).join("")||"<p class='small'>Memory is empty.</p>"}</div><button class="action-btn" id="mem-clear">Forget all</button>`);$("#mem-clear").onclick=()=>{DABSYStore.clearMemory();memoryTool()}}
  function petTool(){const p=DABSYStore.get().pet;showTool(`<h2>🐾 D.A.B.S.y Pet</h2><p class="small">Care, pet and interact. Its mood changes with attention and time.</p>${meter("Hunger",p.hunger)}${meter("Happiness",p.happiness)}${meter("Energy",p.energy)}${meter("Affection",p.affection)}<div class="row"><button class="action-btn" id="pat">🤲 Pat</button><button class="action-btn" id="rub">🫳 Rub</button><button class="action-btn" id="feed">🍎 Feed</button></div>`);$("#pat").onclick=()=>{DABSYPet.pet("pat");petTool()};$("#rub").onclick=()=>{DABSYPet.pet("rub");petTool()};$("#feed").onclick=()=>{DABSYStore.updatePet({hunger:18,happiness:4});DABSYFace.say("nom nom.");petTool()}}
  function meter(name,v){return `<div class="field"><label>${name} ${Math.round(v)}%</label><div class="pet-meter"><i style="width:${v}%"></i></div></div>`}
  function musicTool(){showTool(`<h2>🎵 Music</h2><p class="small">Browser audio controls can be added here without changing the face. For now, D.A.B.S.y can use your device's music app via a future integration.</p><button class="action-btn" id="music-react">Playful reaction</button>`);$("#music-react").onclick=()=>{DABSYFace.mood("happy");DABSYFace.say("🎵 tiny concert mode 🎵")}}
  function gamesTool(){showTool(`<h2>🎮 Mini Game</h2><p>Tap the glowing button as fast as you can.</p><button class="action-btn" id="game">TAP ME</button><p id="score" class="small">Score: 0</p>`);let s=0;$("#game").onclick=()=>{s++;$("#score").textContent="Score: "+s;DABSYFace.mood("happy",180)}}
  function trickTool(){showTool(`<h2>🪄 Trick</h2><p class="small">D.A.B.S.y is feeling silly.</p><button class="action-btn" id="trick">Do it</button>`);$("#trick").onclick=()=>{DABSYFace.blink();DABSYFace.say("Did my eyes just do that? 👀",2200)}}
  function voiceTool(){showTool(`<h2>🎤 Voice</h2><p class="small">Use your browser's speech recognition when supported.</p><button class="action-btn" id="voice">Start listening</button>`);$("#voice").onclick=startVoice}
  function settingsTool(){const s=DABSYStore.get().settings;showTool(`<h2>⚙️ Settings</h2><div class="field"><label>Your name</label><input id="name" value="${escapeAttr(s.name)}"></div><div class="field"><label>Gemini API key</label><input id="key" type="password" placeholder="Paste your key locally"></div><div class="field"><label>Gemini model</label><input id="model" value="${escapeAttr(DABSY_CONFIG.GEMINI_MODEL)}"></div><div class="row"><button class="action-btn" id="save-settings">Save</button><button class="action-btn" id="test-ai">Test AI</button></div><p class="small">For a public production app, do not put a secret API key in frontend source. Use a backend/proxy. This local-key mode is for personal testing.</p>`);$("#save-settings").onclick=()=>{s.name=$("#name").value.trim()||"friend";s.voice=true;DABSY_CONFIG.GEMINI_API_KEY=$("#key").value.trim();DABSY_CONFIG.GEMINI_MODEL=$("#model").value.trim()||DABSY_CONFIG.GEMINI_MODEL;DABSYStore.save();toast("Saved locally.")};$("#test-ai").onclick=async()=>{try{const a=await DABSYAI.ask("Reply with exactly: D.A.B.S.y online.");DABSYFace.say(a,1800)}catch(e){toast(e.message)}}}
  function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
  function escapeAttr(s){return escapeHtml(String(s))}
  function runTool(name){({tasks:tasksTool,reminders:remindersTool,calendar:calendarTool,memory:memoryTool,vision:visionMenu,voice:voiceTool,pet:petTool,settings:settingsTool}[name]||(()=>toast("Not available yet."))() )}

  async function startVoice(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){toast("Speech recognition isn't supported in this browser.");return}
    if(voiceRec){voiceRec.stop();return}
    voiceRec=new SR();voiceRec.lang="en-IN";voiceRec.interimResults=false;voiceRec.maxAlternatives=1;
    DABSYFace.mood("listening");DABSYFace.say("I'm listening...",1800);
    voiceRec.onresult=e=>{const t=e.results[0][0].transcript;DABSYFace.say("You said: "+t,2200);answer(t)}
    voiceRec.onerror=e=>toast("Voice: "+e.error);voiceRec.onend=()=>{voiceRec=null;DABSYFace.stage.classList.remove("listening")}
    voiceRec.start()
  }

  function pointerDown(e){
    touchStart={x:e.clientX,y:e.clientY,t:Date.now(),target:e.target};
    const now=Date.now();
    if(now-lastTap<320){
      lastTap=0;
      if(e.target.closest("#bowtie")||e.target.id==="knot"||e.target.id==="bow-left"||e.target.id==="bow-right"){closePanels();openMenu()}
      else if(e.target.closest(".eye-hit")){openCarousel(e.target.id==="left-eye"?"left":"right")}
    }else lastTap=now;
  }
  function pointerUp(e){
    if(!touchStart)return;const dx=e.clientX-touchStart.x,dy=e.clientY-touchStart.y;
    if(Math.hypot(dx,dy)>55 && Math.abs(dx)>Math.abs(dy) && carousel.classList.contains("hidden")===false){
      renderCarousel(carouselIndex+(dx<0?1:-1));touchStart=null;return
    }
    const dt=Date.now()-touchStart.t;
    if(dt>550 && touchStart.target.closest(".eye-hit")){DABSYPet.pet("rub")}
    touchStart=null;
  }
  document.addEventListener("pointerdown",pointerDown);document.addEventListener("pointerup",pointerUp);
  document.addEventListener("dblclick",e=>{if(e.target.closest("#bowtie")||["knot","bow-left","bow-right"].includes(e.target.id))openMenu();});
  document.addEventListener("click",e=>{
    const item=e.target.closest("[data-tool]");if(item){closePanels();runTool(item.dataset.tool)}
    if(e.target.closest("[data-action='close-panel']"))closePanels();
  });

  // Make the supplied bow tie group the interaction target without changing its artwork.
  ["bowtie","knot","bow-left","bow-right","knot-glint"].forEach(id=>{const x=document.getElementById(id);if(x)x.style.cursor="pointer"});
  DABSYFace.say("Hello "+DABSYStore.get().settings.name+" 👋",2600);
  DABSYStore.stat("interactions");
  setInterval(()=>{DABSYStore.get().reminders.filter(r=>!r.done&&r.when<=Date.now()).forEach(r=>{r.done=true;DABSYStore.save();DABSYFace.say("⏰ "+r.text,4000);DABSYAI.speak(r.text)})},15000);
  window.addEventListener("online",()=>$("#status-dot").classList.add("online")); if(navigator.onLine)$("#status-dot").classList.add("online");
  if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();