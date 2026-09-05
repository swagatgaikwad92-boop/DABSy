window.DABSYFace = (() => {
  const stage = document.querySelector("#face-stage"), subtitle = document.querySelector("#subtitle");
  const face = document.querySelector("#face");
  let subtitleTimer;
  function mood(name,ms=900){stage.classList.remove("listening","thinking","happy","sleeping");if(name)stage.classList.add(name);if(name!=="sleeping")setTimeout(()=>stage.classList.remove(name),ms)}
  function say(text,ms=3200){subtitle.textContent=text;subtitle.classList.add("show");clearTimeout(subtitleTimer);subtitleTimer=setTimeout(()=>subtitle.classList.remove("show"),ms)}
  function blink(){face.animate([{transform:"scaleY(1)"},{transform:"scaleY(.72)"},{transform:"scaleY(1)"}],{duration:240,easing:"ease-in-out"})}
  function idle(){if(Math.random()<.35)blink()}
  setInterval(idle,4800);
  function sleep(on=true){stage.classList.toggle("sleeping",on)}
  return {stage,face,say,mood,blink,sleep};
})();