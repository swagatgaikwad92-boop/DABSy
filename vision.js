window.DABSYVision = (() => {
  let stream=null;
  const video=document.querySelector("#camera-preview"), canvas=document.querySelector("#capture-canvas");
  async function camera(){
    if(!navigator.mediaDevices?.getUserMedia) throw new Error("Camera is not available in this browser.");
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    video.srcObject=stream; video.hidden=false; return true;
  }
  function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}video.hidden=true}
  function snapshot(){
    if(!stream) throw new Error("Camera is not running.");
    const w=video.videoWidth,h=video.videoHeight; canvas.width=w;canvas.height=h;canvas.getContext("2d").drawImage(video,0,0,w,h);
    const raw=canvas.toDataURL("image/jpeg",.78); const [head,b64]=raw.split(",");
    return {mime:head.match(/data:(.*);base64/)?.[1]||"image/jpeg",base64:b64};
  }
  async function capturePhoto(){
    if(!navigator.mediaDevices?.getUserMedia) return false;
    await camera(); return snapshot();
  }
  async function screen(){
    if(!navigator.mediaDevices?.getDisplayMedia) throw new Error("Screen sharing is not supported here.");
    const s=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
    const v=document.createElement("video");v.srcObject=s;v.muted=true;await v.play();
    await new Promise(r=>setTimeout(r,500));
    canvas.width=v.videoWidth;canvas.height=v.videoHeight;canvas.getContext("2d").drawImage(v,0,0);
    s.getTracks().forEach(t=>t.stop());
    const raw=canvas.toDataURL("image/jpeg",.78),[head,b64]=raw.split(",");
    return {mime:head.match(/data:(.*);base64/)?.[1]||"image/jpeg",base64:b64};
  }
  return {camera,stop,snapshot,capturePhoto,screen};
})();