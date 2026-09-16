/* ============================================================
   sounds.js — Efeitos sonoros de torcida
   Toca um som de torcida vibrando quando a seleção faz gol ou
   vence uma rodada, e um som de torcida lamentando quando ela
   toma um gol ou é eliminada. Tudo sintetizado via Web Audio API
   (ruído filtrado + tons), sem depender de arquivos de áudio
   externos. Depende só do navegador.
   ============================================================ */

let audioCtx = null;

let soundsMuted = (() => {
  try { return localStorage.getItem("cdb_soundsMuted") === "1"; }
  catch(e){ return false; }
})();

function getAudioCtx(){
  if(soundsMuted) return null;
  if(!audioCtx){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx) return null;
    try{ audioCtx = new Ctx(); }catch(e){ return null; }
  }
  if(audioCtx.state === "suspended") audioCtx.resume().catch(()=>{});
  return audioCtx;
}

function toggleSoundsMuted(){
  soundsMuted = !soundsMuted;
  try{ localStorage.setItem("cdb_soundsMuted", soundsMuted ? "1" : "0"); }catch(e){}
  if(!soundsMuted) getAudioCtx();
  updateSoundToggleBtn();
}

function updateSoundToggleBtn(){
  const btn = document.getElementById("soundToggleBtn");
  if(btn) btn.textContent = soundsMuted ? "🔇" : "🔊";
}

document.addEventListener("DOMContentLoaded", updateSoundToggleBtn);

/* Ruído branco puro, base de qualquer "burburinho" de torcida */
function noiseBuffer(ctx, seconds){
  const size = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<size;i++) data[i] = Math.random()*2 - 1;
  return buffer;
}

/* ---------- TORCIDA VIBRANDO (gol / vitória) ---------- */
/* big=false -> grito curto de gol; big=true -> comemoração de fim de jogo */
function playCheer(big){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const now = ctx.currentTime;
  const dur = big ? 2.4 : 1.1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, dur);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.7;
  bp.frequency.setValueAtTime(600, now);
  bp.frequency.linearRampToValueAtTime(big ? 2600 : 1800, now + dur*0.4);
  bp.frequency.linearRampToValueAtTime(1200, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(big ? 0.5 : 0.38, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
  noise.start(now); noise.stop(now + dur);

  /* "gritos" tonais por cima do ruído, tipo torcida berrando o gol */
  const whoops = big ? 5 : 2;
  for(let i=0;i<whoops;i++){
    const t0 = now + 0.04 + i * (dur/whoops) * (0.35 + Math.random()*0.35);
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    const g = ctx.createGain();
    const f0 = 380 + Math.random()*220;
    osc.frequency.setValueAtTime(f0, t0);
    osc.frequency.exponentialRampToValueAtTime(f0*1.7, t0+0.22);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.11, t0+0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+0.28);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0+0.3);
  }
}

/* ---------- TORCIDA LAMENTANDO (sofre gol / eliminação) ---------- */
/* big=false -> "ohh" curto de gol sofrido; big=true -> lamento de derrota */
function playLament(big){
  const ctx = getAudioCtx();
  if(!ctx) return;
  const now = ctx.currentTime;
  const dur = big ? 2.2 : 1.0;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(ctx, dur);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.9;
  bp.frequency.setValueAtTime(big ? 900 : 700, now);
  bp.frequency.exponentialRampToValueAtTime(180, now + dur);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(big ? 0.42 : 0.3, now + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
  noise.start(now); noise.stop(now + dur);

  /* suspiro coletivo grave e descendente, tipo "ooohh" de torcida */
  const osc = ctx.createOscillator();
  osc.type = "sine";
  const oGain = ctx.createGain();
  osc.frequency.setValueAtTime(big ? 220 : 200, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(big ? 90 : 110, now + dur*0.9);
  oGain.gain.setValueAtTime(0.0001, now);
  oGain.gain.exponentialRampToValueAtTime(big ? 0.2 : 0.15, now + 0.2);
  oGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(oGain); oGain.connect(ctx.destination);
  osc.start(now); osc.stop(now + dur);
}
