window.DABSYAI = (() => {
  const cfg=window.DABSY_CONFIG;
  async function ask(prompt, imageData=null){
    if(!cfg.GEMINI_API_KEY) throw new Error("No Gemini API key configured. Open Settings → AI.");
    const parts=[{text:[
      "You are D.A.B.S.y, a cute but genuinely useful AI desktop pet.",
      "Be accurate, concise, warm, playful, and practical. Never pretend to have seen something unless an image was supplied.",
      "When explaining study questions, teach step-by-step rather than only dumping the answer.",
      "Use plain text because your answer appears as subtitles/projection text.",
      prompt
    ].join("\\n")}];
    if(imageData) parts.push({inline_data:{mime_type:imageData.mime,data:imageData.base64}});
    const url=`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(cfg.GEMINI_API_KEY)}`;
    const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts}],generationConfig:{temperature:.65,maxOutputTokens:900}})});
    const data=await res.json();
    if(!res.ok) throw new Error(data?.error?.message||"Gemini request failed");
    return data?.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("").trim()||"I didn't get an answer.";
  }
  function speak(text){
    if(!window.DABSYStore.get().settings.voice || !("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.rate=.96; u.pitch=1.08; u.volume=.9; speechSynthesis.speak(u);
  }
  return {ask,speak};
})();