/* ============================================================
   share.js — Cartão de campanha compartilhável (WhatsApp)

   Depois que a campanha termina (campeão, vice ou eliminado),
   desenha num <canvas> um cartão com a escalação no campo, os
   overalls e o caminho na Copa, e oferece três saídas:
     1. Compartilhar a IMAGEM direto (Web Share API, celular);
     2. Baixar o PNG;
     3. Copiar / abrir um LINK do WhatsApp com o resumo em texto.

   Depende de state/FORMATIONS/SECTORS/sectorAverage/getTeamName
   (app.js) e de cup/ROUND_NAMES (cup.js).
   ============================================================ */

const SHARE_W = 1080;
const SHARE_H = 1720;

/* Paleta do cartão (espelha as variáveis do style.css) */
const SC = {
  bgTop:    "#16402c",
  bgBottom: "#08190f",
  pitchA:   "#134a30",
  pitchB:   "#176038",
  line:     "rgba(255,255,255,.34)",
  gold:     "#e0b13c",
  goldBright:"#f4cd5e",
  ink:      "#eef4ee",
  inkDim:   "#a9c2ae",
  panel:    "rgba(9,26,17,.72)",
  win:      "#5fbf7e",
  lose:     "#c65b4a",
};

/* Guarda o último cartão gerado pra não redesenhar a cada clique */
let lastShareBlob = null;
let lastShareUrl = null;

/* ---------- HELPERS DE DESENHO ---------- */

/* Retângulo arredondado (roundRect nem sempre existe em navegador antigo) */
function scRoundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y,   x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x,   y+h, rr);
  ctx.arcTo(x,   y+h, x,   y,   rr);
  ctx.arcTo(x,   y,   x+w, y,   rr);
  ctx.closePath();
}

/* Encurta o nome do jogador pra caber embaixo da bolinha no campo */
function shortName(name){
  const n = (name || "").trim();
  if(n.length <= 13) return n;
  const parts = n.split(/\s+/);
  const last = parts[parts.length-1];
  if(last.length <= 13) return last;
  return last.slice(0,12) + "…";
}

/* Reduz a fonte até o texto caber na largura máxima */
function fitFont(ctx, text, maxW, startPx, family, weight){
  let px = startPx;
  do{
    ctx.font = `${weight?weight+" ":""}${px}px ${family}`;
    if(ctx.measureText(text).width <= maxW) break;
    px -= 2;
  } while(px > 12);
  return px;
}

/* ---------- DADOS DA CAMPANHA ---------- */

/* Resume o que aconteceu na Copa num objeto usado tanto pela imagem
   quanto pelo texto do WhatsApp. Funciona mesmo se a Copa não tiver
   sido disputada (aí volta só a escalação). */
function campaignSummary(){
  const hasCup = (typeof cup !== "undefined") && cup && cup.roundHistory;
  const rounds = hasCup ? cup.roundHistory.map(h => ({
    name: ROUND_NAMES[h.roundIdx],
    opponent: `${h.opponent.team} ${h.opponent.year}`,
    score: `${h.aggUser} x ${h.aggOpp}`,
    pen: h.penalties ? `pên. ${h.penalties.userScore}-${h.penalties.oppScore}` : null,
    advanced: h.advanced,
  })) : [];

  let status = "squad", headline = "Escalação fechada", emoji = "⚽";
  if(hasCup && cup.status === "champion"){
    status = "champion"; headline = "CAMPEÃO DA COPA DO BRASIL"; emoji = "🏆";
  } else if(hasCup && cup.status === "runnerup"){
    status = "runnerup"; headline = "VICE-CAMPEÃO"; emoji = "🥈";
  } else if(hasCup && cup.status === "eliminated"){
    const last = cup.roundHistory[cup.roundHistory.length-1];
    status = "eliminated";
    headline = `ELIMINADO NAS ${ROUND_NAMES[last.roundIdx].toUpperCase()}`;
    if(last.roundIdx === 3) headline = "ELIMINADO NA FINAL";
    emoji = "😔";
  }

  const defesa = sectorAverage(SECTORS.Defesa);
  const meio   = sectorAverage(SECTORS.Meio);
  const ataque = sectorAverage(SECTORS.Ataque);
  const media  = (defesa!==null && meio!==null && ataque!==null)
    ? Math.floor((defesa+meio+ataque)/3) : null;

  return {
    status, headline, emoji, rounds,
    teamName: getTeamName(),
    formation: FORMATIONS[state.formation].label,
    defesa, meio, ataque, media,
    years: new Set(state.slots.filter(s=>s.filled).map(s=>s.filled.year)).size,
  };
}

/* ---------- IMAGEM ---------- */

async function buildShareImage(){
  // Espera as fontes do Google carregarem pra não desenhar com fallback feio
  if(document.fonts && document.fonts.ready){
    try{ await document.fonts.ready; }catch(e){}
  }

  const info = campaignSummary();
  const canvas = document.createElement("canvas");
  canvas.width = SHARE_W;
  canvas.height = SHARE_H;
  const ctx = canvas.getContext("2d");

  /* Fundo */
  const bg = ctx.createLinearGradient(0,0,0,SHARE_H);
  bg.addColorStop(0, SC.bgTop);
  bg.addColorStop(1, SC.bgBottom);
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,SHARE_W,SHARE_H);

  ctx.textBaseline = "middle";

  /* --- Cabeçalho --- */
  ctx.textAlign = "center";
  ctx.fillStyle = SC.gold;
  ctx.font = "600 26px Inter, sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillText("SELEÇÃO DOS SONHOS · COPA DO BRASIL", SHARE_W/2, 66);
  ctx.letterSpacing = "0px";

  /* Nome da seleção */
  const namePx = fitFont(ctx, info.teamName.toUpperCase(), SHARE_W-140, 88, "Anton, Inter, sans-serif");
  ctx.fillStyle = SC.ink;
  ctx.font = `${namePx}px Anton, Inter, sans-serif`;
  ctx.fillText(info.teamName.toUpperCase(), SHARE_W/2, 140);

  ctx.fillStyle = SC.inkDim;
  ctx.font = "500 26px Inter, sans-serif";
  ctx.fillText(`Formação ${info.formation} · craques de ${info.years} edições diferentes`, SHARE_W/2, 194);

  /* --- Faixa do resultado --- */
  const accent = info.status === "champion" ? SC.goldBright
               : info.status === "runnerup" ? "#cfd6da"
               : info.status === "eliminated" ? SC.lose : SC.ink;
  const bannerY = 232, bannerH = 104;
  ctx.fillStyle = "rgba(0,0,0,.28)";
  scRoundRect(ctx, 60, bannerY, SHARE_W-120, bannerH, 18);
  ctx.fill();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  scRoundRect(ctx, 60, bannerY, SHARE_W-120, bannerH, 18);
  ctx.stroke();

  const headline = `${info.emoji}  ${info.headline}`;
  const hPx = fitFont(ctx, headline, SHARE_W-200, 54, "Anton, Inter, sans-serif");
  ctx.fillStyle = accent;
  ctx.font = `${hPx}px Anton, Inter, sans-serif`;
  ctx.fillText(headline, SHARE_W/2, bannerY + bannerH/2 + 2);

  /* --- Campo --- */
  const px = 70, py = 372, pw = SHARE_W - 140, ph = 760;

  /* As porcentagens das formações vão de 10% a 92% e encostam nas bordas.
     No cartão o desenho é comprimido pra dentro de uma faixa menor (3% a 91%
     da altura), sobrando margem embaixo pra etiqueta do goleiro e abrindo
     espaço entre ele e o zagueiro central das formações com três zagueiros. */
  const slotY = t => py + ph * (0.03 + 0.88 * (parseFloat(t)/100));
  ctx.save();
  scRoundRect(ctx, px, py, pw, ph, 20);
  ctx.clip();
  const stripes = 9;
  for(let i=0;i<stripes;i++){
    ctx.fillStyle = i%2 ? SC.pitchB : SC.pitchA;
    ctx.fillRect(px, py + i*(ph/stripes), pw, ph/stripes + 1);
  }
  /* Linhas do campo */
  ctx.strokeStyle = SC.line;
  ctx.lineWidth = 3;
  ctx.strokeRect(px+14, py+14, pw-28, ph-28);
  ctx.beginPath();
  ctx.moveTo(px+14, py+ph/2); ctx.lineTo(px+pw-14, py+ph/2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(px+pw/2, py+ph/2, 74, 0, Math.PI*2);
  ctx.stroke();
  // grande área de baixo (gol do usuário) e de cima
  const boxW = pw*0.46, boxH = 96;
  ctx.strokeRect(px+(pw-boxW)/2, py+ph-14-boxH, boxW, boxH);
  ctx.strokeRect(px+(pw-boxW)/2, py+14, boxW, boxH);
  ctx.restore();

  /* Jogadores.
     As etiquetas (nome + posição) NÃO ficam sempre embaixo da bolinha: em
     formações com três zagueiros, por exemplo, o zagueiro central fica logo
     acima do goleiro e a etiqueta cairia em cima dele. Então cada etiqueta
     testa quatro posições (embaixo, em cima, à direita, à esquerda) e fica
     na primeira que não encostar em nenhuma bolinha, em nenhuma etiqueta já
     colocada, nem para fora do campo. */
  const R = 30;
  const LABEL_H = 46; // caixa do nome (30) + linha da posição (16)

  const nodes = state.slots.filter(s => s.filled).map(s => ({
    slot: s,
    cx: px + pw * (parseFloat(s.left)/100),
    cy: slotY(s.top),
  }));

  function overlaps(a, b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  /* Bolinhas primeiro, pra que nenhuma etiqueta fique escondida por baixo */
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.cx, n.cy, R, 0, Math.PI*2);
    ctx.fillStyle = "#0d2b1f";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = SC.gold;
    ctx.stroke();

    ctx.fillStyle = SC.goldBright;
    ctx.font = "31px Anton, Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(n.slot.filled.ovr), n.cx, n.cy+2);
  });

  /* Retângulos ocupados pelas bolinhas (todas, inclusive a do próprio nó —
     filtrada na hora de testar) */
  const circleRects = nodes.map(n => ({ n, x:n.cx-R-4, y:n.cy-R-4, w:(R+4)*2, h:(R+4)*2 }));
  const placedLabels = [];

  /* Quem está mais embaixo escolhe primeiro: o goleiro e a linha de zaga são
     justamente os casos apertados, então eles ganham a vaga boa antes. */
  nodes.slice().sort((a,b) => b.cy - a.cy).forEach(n => {
    const nm = shortName(n.slot.filled.name);
    ctx.font = "700 22px Inter, sans-serif";
    const tw = ctx.measureText(nm).width;
    const w = tw + 20;

    const candidates = [
      { x: n.cx - w/2,        y: n.cy + R + 6,           dir:"below" },
      { x: n.cx - w/2,        y: n.cy - R - 6 - LABEL_H, dir:"above" },
      { x: n.cx + R + 8,      y: n.cy - LABEL_H/2,       dir:"side"  },
      { x: n.cx - R - 8 - w,  y: n.cy - LABEL_H/2,       dir:"side"  },
    ];

    let chosen = null;
    for(const c of candidates){
      const rect = { x:c.x, y:c.y, w, h:LABEL_H };
      const insidePitch = rect.x >= px+6 && rect.x+rect.w <= px+pw-6
                       && rect.y >= py+6 && rect.y+rect.h <= py+ph-6;
      if(!insidePitch) continue;
      const hitsCircle = circleRects.some(cr => cr.n !== n && overlaps(rect, cr));
      const hitsLabel  = placedLabels.some(pl => overlaps(rect, pl));
      if(!hitsCircle && !hitsLabel){ chosen = c; break; }
    }
    if(!chosen){
      // nenhuma vaga limpa: fica embaixo mesmo, só puxando pra dentro do campo
      chosen = { x: Math.min(Math.max(n.cx - w/2, px+6), px+pw-6-w), y: n.cy + R + 6, dir:"below" };
    }

    const rect = { x:chosen.x, y:chosen.y, w, h:LABEL_H };
    placedLabels.push(rect);

    // Em cima, a ordem inverte: a posição fica por fora e o nome junto da bolinha.
    const nameY = chosen.dir === "above" ? rect.y + 16 + 15 : rect.y + 15;
    const posY  = chosen.dir === "above" ? rect.y + 8        : rect.y + 38;

    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(6,18,12,.85)";
    scRoundRect(ctx, rect.x, nameY - 15, w, 30, 8);
    ctx.fill();
    ctx.fillStyle = SC.ink;
    ctx.font = "700 22px Inter, sans-serif";
    ctx.fillText(nm, rect.x + w/2, nameY);

    ctx.font = "600 17px Inter, sans-serif";
    ctx.fillStyle = SC.inkDim;
    ctx.fillText(n.slot.label, rect.x + w/2, posY);
  });

  /* --- Overalls --- */
  const ovrY = 1164, ovrH = 92;
  const cells = [
    ["DEFESA", info.defesa, false],
    ["MEIO", info.meio, false],
    ["ATAQUE", info.ataque, false],
    ["OVERALL", info.media, true],
  ];
  const cw = (pw - 3*14)/4;
  cells.forEach(([label, val, hi], i) => {
    const x = px + i*(cw+14);
    ctx.fillStyle = hi ? "rgba(224,177,60,.16)" : SC.panel;
    scRoundRect(ctx, x, ovrY, cw, ovrH, 14);
    ctx.fill();
    ctx.strokeStyle = hi ? SC.gold : "rgba(255,255,255,.1)";
    ctx.lineWidth = 2;
    scRoundRect(ctx, x, ovrY, cw, ovrH, 14);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = SC.inkDim;
    ctx.font = "700 19px Inter, sans-serif";
    ctx.fillText(label, x+cw/2, ovrY+26);
    ctx.fillStyle = hi ? SC.goldBright : SC.ink;
    ctx.font = "42px Anton, Inter, sans-serif";
    ctx.fillText(val===null? "—" : String(val), x+cw/2, ovrY+64);
  });

  /* --- Campanha --- */
  let cy0 = 1300;
  ctx.textAlign = "left";
  ctx.fillStyle = SC.gold;
  ctx.font = "600 22px Inter, sans-serif";
  ctx.letterSpacing = "4px";
  ctx.fillText("CAMPANHA", px, cy0);
  ctx.letterSpacing = "0px";
  cy0 += 30;

  if(info.rounds.length === 0){
    ctx.fillStyle = SC.inkDim;
    ctx.font = "500 26px Inter, sans-serif";
    ctx.fillText("Escalação montada — Copa do Brasil ainda não disputada.", px, cy0+30);
  } else {
    /* Desenha SEMPRE as 4 fases: as disputadas com placar, as que o time
       não alcançou em cinza, pra deixar claro até onde a campanha foi. */
    const rowH = 66;
    ROUND_NAMES.forEach((roundName, i) => {
      const y = cy0 + i*(rowH+8);
      const rd = info.rounds[i];

      ctx.fillStyle = rd ? SC.panel : "rgba(9,26,17,.38)";
      scRoundRect(ctx, px, y, pw, rowH, 12);
      ctx.fill();
      if(!rd){
        ctx.strokeStyle = "rgba(255,255,255,.06)";
        ctx.lineWidth = 2;
        scRoundRect(ctx, px, y, pw, rowH, 12);
        ctx.stroke();
      }
      // barrinha de status
      ctx.fillStyle = rd ? (rd.advanced ? SC.win : SC.lose) : "rgba(169,194,174,.22)";
      scRoundRect(ctx, px, y, 8, rowH, 4);
      ctx.fill();

      ctx.textAlign = "left";
      ctx.fillStyle = rd ? SC.ink : "rgba(169,194,174,.5)";
      ctx.font = "800 24px Inter, sans-serif";
      ctx.fillText(roundName, px+26, y + (rd ? rowH/2 - 11 : rowH/2));
      if(rd){
        ctx.fillStyle = SC.inkDim;
        ctx.font = "500 21px Inter, sans-serif";
        ctx.fillText(`vs ${rd.opponent}`, px+26, y+rowH/2 + 17);
      }

      ctx.textAlign = "right";
      if(rd){
        ctx.fillStyle = rd.advanced ? SC.win : SC.lose;
        ctx.font = "34px Anton, Inter, sans-serif";
        ctx.fillText(rd.score, px+pw-26, y+rowH/2 - 8);
        if(rd.pen){
          ctx.fillStyle = SC.inkDim;
          ctx.font = "600 18px Inter, sans-serif";
          ctx.fillText(rd.pen, px+pw-26, y+rowH/2 + 18);
        }
      } else {
        ctx.fillStyle = "rgba(169,194,174,.4)";
        ctx.font = "600 20px Inter, sans-serif";
        ctx.fillText("não chegou", px+pw-26, y+rowH/2);
      }
    });
  }

  /* --- Rodapé --- */
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(169,194,174,.6)";
  ctx.font = "500 21px Inter, sans-serif";
  ctx.fillText("Seleção dos Sonhos · elencos campeões e vices da Copa do Brasil (1995–2025)", SHARE_W/2, SHARE_H-40);

  return new Promise(res => canvas.toBlob(b => res(b), "image/png"));
}

/* ---------- TEXTO / LINK ---------- */

function buildShareText(){
  const info = campaignSummary();
  const lines = [];
  lines.push(`${info.emoji} *${info.teamName}* — Seleção dos Sonhos (Copa do Brasil)`);
  lines.push(`${info.headline}`);
  lines.push("");
  lines.push(`Formação ${info.formation} · Overall ${info.media===null?"—":info.media} (DEF ${info.defesa??"—"} / MEI ${info.meio??"—"} / ATA ${info.ataque??"—"})`);

  const titulares = state.slots.filter(s=>s.filled)
    .map(s => `${s.label} ${s.filled.name} (${s.filled.ovr})`).join(", ");
  if(titulares) lines.push(`Escalação: ${titulares}`);

  if(info.rounds.length){
    lines.push("");
    lines.push("Campanha:");
    info.rounds.forEach(rd => {
      lines.push(`${rd.advanced?"✅":"❌"} ${rd.name}: ${rd.score}${rd.pen?` (${rd.pen})`:""} vs ${rd.opponent}`);
    });
  }
  return lines.join("\n");
}

function buildWhatsAppLink(){
  return "https://wa.me/?text=" + encodeURIComponent(buildShareText());
}

/* ---------- MODAL DE COMPARTILHAMENTO ---------- */

async function openShareCard(){
  const overlay = document.getElementById("shareModal");
  const body = document.getElementById("shareBody");
  overlay.classList.remove("hidden");
  body.innerHTML = `<div class="share-loading">Montando seu cartão…</div>`;

  try{
    const blob = await buildShareImage();
    lastShareBlob = blob;
    if(lastShareUrl) URL.revokeObjectURL(lastShareUrl);
    lastShareUrl = URL.createObjectURL(blob);

    const canFiles = !!(navigator.canShare && navigator.canShare({
      files: [new File([blob], "x.png", {type:"image/png"})]
    }));

    body.innerHTML = `
      <img class="share-preview" src="${lastShareUrl}" alt="Cartão da campanha">
      <div class="share-actions">
        ${canFiles ? `<button class="action primary" onclick="shareImageNative()">📲 Enviar imagem no WhatsApp</button>` : ""}
        <button class="action" onclick="downloadShareImage()">⬇️ Baixar imagem</button>
        <button class="action" onclick="openWhatsAppLink()">🔗 Abrir WhatsApp com o texto</button>
        <button class="action" onclick="copyShareText()" id="copyTextBtn">📋 Copiar resumo</button>
      </div>
      <div class="share-hint">${canFiles
        ? "Pelo celular, o botão de cima abre o WhatsApp já com a imagem anexada."
        : "No computador o WhatsApp não aceita anexo por link: baixe a imagem e arraste pra conversa, ou use o link com o resumo em texto."}</div>
    `;
  }catch(err){
    console.error(err);
    body.innerHTML = `
      <div class="share-loading">Não consegui gerar a imagem neste navegador.</div>
      <div class="share-actions">
        <button class="action" onclick="openWhatsAppLink()">🔗 Compartilhar só o texto</button>
      </div>`;
  }
}

function closeShareCard(){
  document.getElementById("shareModal").classList.add("hidden");
}

async function shareImageNative(){
  if(!lastShareBlob) return;
  const file = new File([lastShareBlob], "selecao-dos-sonhos.png", {type:"image/png"});
  try{
    await navigator.share({
      files: [file],
      title: "Seleção dos Sonhos",
      text: buildShareText(),
    });
  }catch(err){
    if(err && err.name === "AbortError") return; // usuário cancelou
    console.error(err);
  }
}

function downloadShareImage(){
  if(!lastShareUrl) return;
  const a = document.createElement("a");
  a.href = lastShareUrl;
  const slug = getTeamName().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"") || "selecao";
  a.download = `${slug}-copa-do-brasil.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function openWhatsAppLink(){
  window.open(buildWhatsAppLink(), "_blank", "noopener");
}

async function copyShareText(){
  const btn = document.getElementById("copyTextBtn");
  try{
    await navigator.clipboard.writeText(buildShareText());
    if(btn){ btn.textContent = "✅ Copiado!"; setTimeout(()=>{ btn.textContent = "📋 Copiar resumo"; }, 1800); }
  }catch(e){
    if(btn) btn.textContent = "Não deu pra copiar";
  }
}

/* Botão padrão usado nas telas de fim de campanha (cup.js) */
function shareButtonHtml(){
  return `<button class="action share-btn" onclick="openShareCard()">📲 Compartilhar campanha</button>`;
}
