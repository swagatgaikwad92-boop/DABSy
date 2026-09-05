window.DABSYPet = (() => {
  let lastPet=0;
  function pet(kind="pat"){
    const now=Date.now(); if(now-lastPet<90)return; lastPet=now;
    const delta=kind==="rub"?{happiness:3,affection:5,energy:-1}:{happiness:2,affection:3,energy:-.3};
    DABSYStore.updatePet(delta);DABSYStore.stat("pettings");
    DABSYFace.mood("happy",650);
    DABSYFace.say(kind==="rub"?"hehe... that feels nice 🥹":"*happy pet noises*",1400);
  }
  function decay(){
    const p=DABSYStore.get().pet, hours=(Date.now()-p.last)/3600000;
    if(hours>.15){DABSYStore.updatePet({hunger:-hours*2,happiness:-hours*.8,energy:-hours*.35})}
  }
  decay();setInterval(decay,60000);
  return {pet};
})();