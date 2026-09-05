window.DABSYStore = (() => {
  const KEY = "dabsy-premium-state-v1";
  const defaults = {
    tasks: [], reminders: [], memory: [], settings: {
      name: "Swagat", voice: true, proactive: true, reducedMotion: false
    },
    pet: {hunger:72,happiness:78,energy:82,affection:60,last:Date.now()},
    stats: {interactions:0, pettings:0, questions:0}
  };
  let state = load();
  function load(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(defaults)}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function get(){return state}
  function addTask(text){state.tasks.push({id:crypto.randomUUID(),text,done:false,created:Date.now()});save()}
  function toggleTask(id){const x=state.tasks.find(t=>t.id===id);if(x)x.done=!x.done;save()}
  function addReminder(text,when){state.reminders.push({id:crypto.randomUUID(),text,when,done:false});save()}
  function addMemory(text){if(text&&text.trim()){state.memory.push({id:crypto.randomUUID(),text:text.trim(),at:Date.now()});state.memory=state.memory.slice(-40);save()}}
  function clearMemory(){state.memory=[];save()}
  function updatePet(delta){Object.entries(delta).forEach(([k,v])=>state.pet[k]=Math.max(0,Math.min(100,state.pet[k]+v)));state.pet.last=Date.now();save()}
  function stat(k,n=1){state.stats[k]=(state.stats[k]||0)+n;save()}
  return {get,save,addTask,toggleTask,addReminder,addMemory,clearMemory,updatePet,stat};
})();