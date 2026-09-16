/* ============================================================
   app.js — Lógica do jogo "Seleção dos Sonhos - Copa do Brasil"
   Depende de TEAMS (definido em data.js, carregado antes deste
   arquivo no HTML).
   ============================================================ */

/* Setores para o cálculo de overall: Defesa (GOL+LD+LE+ZAG), Meio (VOL+MC+MD+ME+MEI), Ataque (CA+PD+PE).
   Baseado na categoria da vaga (s.pos), não no id — assim funciona pra qualquer formação. */
const SECTORS = {
  Defesa: ["GOL","LD","LE","ZAG"],
  Meio:   ["VOL","MC","MD","ME","MEI"],
  Ataque: ["CA","PD","PE"],
};

const POS_LABEL = {
  GOL:"Goleiro", LD:"Lateral Direito", LE:"Lateral Esquerdo", ZAG:"Zagueiro", VOL:"Volante",
  MC:"Meio-campo", MD:"Meia Direita", ME:"Meia Esquerda", MEI:"Meia Atacante",
  CA:"Centroavante", PD:"Ponta Direita", PE:"Ponta Esquerda",
};

/* Quais categorias de vaga cada posição "legada" (string única, formato antigo)
   pode ocupar no campo. Só vale pra jogadores com `p` como string — jogadores
   com `p` como ARRAY (formato novo) definem suas próprias posições
   diretamente na lista, sem passar por esta tabela (ver playerEligiblePositions).
   LAT e ATA (legado) continuam existindo só aqui como atalho: como os
   elencos ainda não convertidos não dizem o lado do lateral nem se o
   atacante é de área ou de ponta, LAT abre pros dois lados (LD/LE) e ATA
   abre pro centroavante e pras duas pontas (CA/PD/PE) — ver POSITION_EXPAND
   logo abaixo, que faz essa expansão de fato.
   ELIGIBLE.MEI é deliberadamente permissivo: cobre toda a "geleia geral" do
   meio-campo ofensivo (MC/MD/ME) e o ataque (CA/PD/PE) pra manter os
   elencos ainda não convertidos pro formato de array funcionando normalmente
   em qualquer formação. */
const ELIGIBLE = {
  GOL: ["GOL"],
  LAT: ["LAT"],
  ZAG: ["ZAG"],
  VOL: ["VOL"],
  MC:  ["MC","VOL"],
  MD:  ["MD","LD"],
  ME:  ["ME","LE"],
  MEI: ["MEI","MC","MD","ME","ATA"],
  ATA: ["ATA","MEI"],
};

/* Fragmentação por lado/perfil: "LAT" e "ATA" são categorias genéricas do
   dado ainda não atualizado (maioria dos 683 jogadores usa isso hoje,
   inclusive dentro do formato array, ex.: p:["LAT","MD"] ou p:["ATA"]).
   Enquanto essas posições não forem trocadas manualmente por LD/LE
   (lateral) ou CA/PD/PE (centroavante/pontas), elas são expandidas
   automaticamente aqui pra continuar valendo nos dois lados/perfis —
   assim nada quebra até a posição ser refinada. Times já 100%
   fragmentados (ex.: Corinthians 1995) não usam mais "LAT" nem "ATA"
   genérico no array, então passam direto sem expansão. */
const POSITION_EXPAND = {
  LAT: ["LD","LE"],
  ATA: ["CA","PD","PE"],
};
function expandCategory(cat){
  return POSITION_EXPAND[cat] || [cat];
}

/* Normaliza a posição de um jogador pra lista de categorias de vaga que ele
   pode ocupar. Se `p` já é um array (formato novo, definido manualmente por
   jogador), usa exatamente essa lista. Se `p` é uma string (formato antigo),
   expande pela tabela ELIGIBLE acima. */
function playerEligiblePositions(p){
  const raw = Array.isArray(p) ? p : (ELIGIBLE[p] || [p]);
  return raw.flatMap(expandCategory);
}

/* Texto de exibição da posição de um jogador (junta com "/" se for array). */
function formatPos(p){
  return Array.isArray(p) ? p.join("/") : p;
}

/* Mapa: nome do time usado no jogo -> título exato do artigo na Wikipédia
   em português. Usado pra buscar o escudo do time em tempo real via API
   pública da Wikipédia, sem precisar guardar 21 arquivos de imagem no
   projeto. Se um time não tiver título mapeado, tenta buscar pelo próprio
   nome como está em TEAMS (pode não achar escudo certo em alguns casos). */
const TEAM_WIKI_TITLE = {
  "Athletico-PR": "Club Athletico Paranaense",
  "Atlético-MG": "Clube Atlético Mineiro",
  "Botafogo": "Botafogo de Futebol e Regatas",
  "Brasiliense": "Brasiliense Futebol Clube",
  "Corinthians": "Sport Club Corinthians Paulista",
  "Coritiba": "Coritiba Foot Ball Club",
  "Cruzeiro": "Cruzeiro Esporte Clube",
  "Figueirense": "Figueirense Futebol Clube",
  "Flamengo": "Clube de Regatas do Flamengo",
  "Fluminense": "Fluminense Football Club",
  "Grêmio": "Grêmio Foot-Ball Porto Alegrense",
  "Internacional": "Sport Club Internacional",
  "Juventude": "Esporte Clube Juventude",
  "Palmeiras": "Sociedade Esportiva Palmeiras",
  "Paulista": "Paulista Futebol Clube",
  "Santo André": "Esporte Clube Santo André",
  "Santos": "Santos Futebol Clube",
  "Sport": "Sport Club do Recife",
  "São Paulo": "São Paulo Futebol Clube",
  "Vasco": "Club de Regatas Vasco da Gama",
  "Vitória": "Esporte Clube Vitória",
};

/* Cache em memória: uma vez buscado, o escudo do time não é buscado de
   novo (evita bater na API toda vez que o mesmo time for sorteado ou
   escolhido pra troca). */
const logoCache = {};

/* Busca a URL do escudo de um time via API pública da Wikípedia (endpoint
   com CORS liberado por "origin=*", funciona direto do navegador). Retorna
   uma Promise com a URL da imagem, ou null se não achar. */
function fetchTeamLogo(teamName){
  if(teamName in logoCache) return Promise.resolve(logoCache[teamName]);
  const title = TEAM_WIKI_TITLE[teamName] || teamName;
  const url = `https://pt.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=160&origin=*`;
  return fetch(url)
    .then(r=>r.json())
    .then(data=>{
      const pages = data.query && data.query.pages;
      const page = pages ? Object.values(pages)[0] : null;
      const src = (page && page.thumbnail) ? page.thumbnail.source : null;
      logoCache[teamName] = src;
      return src;
    })
    .catch(()=>{ logoCache[teamName] = null; return null; });
}

/* Atualiza (assincronamente, sem travar o render) a <img> do escudo no
   banner de sorteio. Se a busca demorar e o usuário já tiver mudado de
   time nesse meio-tempo, o data-team não bate mais e a atualização é
   ignorada — evita "escudo errado piscando" na tela. */
function updateTeamLogo(teamName){
  fetchTeamLogo(teamName).then(src=>{
    const img = document.getElementById("teamLogoImg");
    if(!img || img.dataset.team !== teamName) return;
    if(src){ img.src = src; img.style.display = ""; }
    else { img.style.display = "none"; }
  });
}

/* Formações disponíveis pra escolher na janela inicial, em porcentagem (top/left)
   dentro do campo. Escolhida uma vez, não muda mais durante aquela seleção. */
const FORMATIONS = {
  "433": {
    label: "4-3-3",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"latd", label:"LD",  pos:"LD",  top:"74%", left:"84%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"78%", left:"62%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"78%", left:"38%"},
      {id:"late", label:"LE",  pos:"LE",  top:"74%", left:"16%"},
      {id:"vol",  label:"VOL", pos:"VOL", top:"56%", left:"50%"},
      {id:"mei1", label:"MC",  pos:"MC",  top:"40%", left:"30%"},
      {id:"mei2", label:"MC",  pos:"MC",  top:"40%", left:"70%"},
      {id:"atae", label:"PE",  pos:"PE",  top:"17%", left:"18%"},
      {id:"atac", label:"CA",  pos:"CA", top:"10%", left:"50%"},
      {id:"atad", label:"PD",  pos:"PD",  top:"17%", left:"82%"},
    ],
  },
  "442": {
    label: "4-4-2",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"latd", label:"LD",  pos:"LD",  top:"74%", left:"84%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"78%", left:"62%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"78%", left:"38%"},
      {id:"late", label:"LE",  pos:"LE",  top:"74%", left:"16%"},
      {id:"meie", label:"ME",  pos:"ME",  top:"50%", left:"16%"},
      {id:"vol1", label:"VOL", pos:"VOL", top:"54%", left:"38%"},
      {id:"vol2", label:"VOL", pos:"VOL", top:"54%", left:"62%"},
      {id:"meid", label:"MD",  pos:"MD",  top:"50%", left:"84%"},
      {id:"atae", label:"CA",  pos:"CA", top:"16%", left:"35%"},
      {id:"atad", label:"CA",  pos:"CA", top:"16%", left:"65%"},
    ],
  },
  "4231": {
    label: "4-2-3-1",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"latd", label:"LD",  pos:"LD",  top:"76%", left:"84%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"80%", left:"62%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"80%", left:"38%"},
      {id:"late", label:"LE",  pos:"LE",  top:"76%", left:"16%"},
      {id:"vol1", label:"VOL", pos:"VOL", top:"58%", left:"38%"},
      {id:"vol2", label:"VOL", pos:"VOL", top:"58%", left:"62%"},
      {id:"meie", label:"ME",  pos:"ME",  top:"36%", left:"18%"},
      {id:"meic", label:"MEI", pos:"MEI", top:"32%", left:"50%"},
      {id:"meid", label:"MD",  pos:"MD",  top:"36%", left:"82%"},
      {id:"ata",  label:"CA",  pos:"CA", top:"12%", left:"50%"},
    ],
  },
  "352": {
    label: "3-5-2",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"80%", left:"30%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"82%", left:"50%"},
      {id:"zag3", label:"ZAG", pos:"ZAG", top:"80%", left:"70%"},
      {id:"latd", label:"AD",  pos:"LD",  top:"60%", left:"86%"},
      {id:"late", label:"AE",  pos:"LE",  top:"60%", left:"14%"},
      {id:"vol",  label:"VOL", pos:"VOL", top:"46%", left:"50%"},
      {id:"mei1", label:"MC",  pos:"MC",  top:"40%", left:"30%"},
      {id:"mei2", label:"MC",  pos:"MC",  top:"40%", left:"70%"},
      {id:"atae", label:"CA",  pos:"CA", top:"15%", left:"35%"},
      {id:"atad", label:"CA",  pos:"CA", top:"15%", left:"65%"},
    ],
  },
  "532": {
    label: "5-3-2",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"80%", left:"30%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"82%", left:"50%"},
      {id:"zag3", label:"ZAG", pos:"ZAG", top:"80%", left:"70%"},
      {id:"latd", label:"AD",  pos:"LD",  top:"70%", left:"88%"},
      {id:"late", label:"AE",  pos:"LE",  top:"70%", left:"12%"},
      {id:"vol1", label:"VOL", pos:"VOL", top:"48%", left:"35%"},
      {id:"vol2", label:"VOL", pos:"VOL", top:"48%", left:"65%"},
      {id:"mei",  label:"MEI", pos:"MEI", top:"38%", left:"50%"},
      {id:"atae", label:"CA",  pos:"CA", top:"15%", left:"35%"},
      {id:"atad", label:"CA",  pos:"CA", top:"15%", left:"65%"},
    ],
  },
  "4141": {
    label: "4-1-4-1",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"latd", label:"LD",  pos:"LD",  top:"76%", left:"84%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"80%", left:"62%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"80%", left:"38%"},
      {id:"late", label:"LE",  pos:"LE",  top:"76%", left:"16%"},
      {id:"vol",  label:"VOL", pos:"VOL", top:"62%", left:"50%"},
      {id:"meie", label:"ME",  pos:"ME",  top:"42%", left:"14%"},
      {id:"mei1", label:"MC",  pos:"MC",  top:"46%", left:"38%"},
      {id:"mei2", label:"MC",  pos:"MC",  top:"46%", left:"62%"},
      {id:"meid", label:"MD",  pos:"MD",  top:"42%", left:"86%"},
      {id:"ata",  label:"CA",  pos:"CA", top:"14%", left:"50%"},
    ],
  },
  "343": {
    label: "3-4-3",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"82%", left:"30%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"84%", left:"50%"},
      {id:"zag3", label:"ZAG", pos:"ZAG", top:"82%", left:"70%"},
      {id:"latd", label:"AD",  pos:"LD",  top:"56%", left:"86%"},
      {id:"late", label:"AE",  pos:"LE",  top:"56%", left:"14%"},
      {id:"vol1", label:"VOL", pos:"VOL", top:"50%", left:"38%"},
      {id:"vol2", label:"VOL", pos:"VOL", top:"50%", left:"62%"},
      {id:"atae", label:"PE",  pos:"PE",  top:"16%", left:"22%"},
      {id:"atac", label:"CA",  pos:"CA", top:"10%", left:"50%"},
      {id:"atad", label:"PD",  pos:"PD",  top:"16%", left:"78%"},
    ],
  },
  "4312": {
    label: "4-3-1-2",
    slots: [
      {id:"gol",  label:"GOL", pos:"GOL", top:"92%", left:"50%"},
      {id:"latd", label:"LD",  pos:"LD",  top:"76%", left:"84%"},
      {id:"zag1", label:"ZAG", pos:"ZAG", top:"80%", left:"62%"},
      {id:"zag2", label:"ZAG", pos:"ZAG", top:"80%", left:"38%"},
      {id:"late", label:"LE",  pos:"LE",  top:"76%", left:"16%"},
      {id:"vol1", label:"VOL", pos:"VOL", top:"48%", left:"34%"},
      {id:"vol",  label:"VOL", pos:"VOL", top:"62%", left:"50%"},
      {id:"vol2", label:"VOL", pos:"VOL", top:"48%", left:"66%"},
      {id:"mei",  label:"MEI", pos:"MEI", top:"32%", left:"50%"},
      {id:"atae", label:"CA",  pos:"CA", top:"14%", left:"38%"},
      {id:"atad", label:"CA",  pos:"CA", top:"14%", left:"62%"},
    ],
  },
};

const DEFAULT_FORMATION = "433";

/* ---------- ESTADO ---------- */
let state = {
  phase: "draft",     // "draft" (montando os 11) | "cup" (disputando a Copa do Brasil)
  queue: [],
  current: null,
  skips: 3,
  formation: DEFAULT_FORMATION, // escolhida na janela inicial; trava depois de confirmada
  slots: FORMATIONS[DEFAULT_FORMATION].slots.map(s => ({...s, filled:null})),
  pendingPick: null,  // { team, player } aguardando o usuário tocar numa vaga
  selected: null,     // id da vaga selecionada para reposicionar
  teamName: "Sua Seleção",       // nome escolhido pelo usuário pra própria seleção
  stadiumName: "Estádio dos Sonhos", // nome escolhido pelo usuário pro próprio estádio
  started: false,     // true depois que o usuário confirma a janela inicial
};

/* ---------- SELEÇÃO DE FORMAÇÃO (só na janela inicial) ---------- */
let selectedFormationKey = DEFAULT_FORMATION; // seleção temporária, só vira definitiva ao confirmar
let isRestarting = false; // true quando a janela foi reaberta pra montar uma NOVA seleção

function renderFormationPreview(key){
  const box = document.getElementById("formationPreview");
  if(!box) return;
  const f = FORMATIONS[key];
  box.innerHTML = f.slots.map(s=>`<div class="mini-dot" style="top:${s.top};left:${s.left};" title="${s.label}"></div>`).join("");
}

function highlightFormationButton(key){
  document.querySelectorAll(".formation-btn").forEach(btn=>{
    btn.classList.toggle("active", btn.dataset.key === key);
  });
}

function selectFormationOption(key){
  if(!FORMATIONS[key]) return;
  selectedFormationKey = key;
  highlightFormationButton(key);
  renderFormationPreview(key);
}

/* Nome de exibição da seleção do usuário (cai pro padrão se o campo ficar vazio) */
function getTeamName(){
  const v = (state.teamName || "").trim();
  return v || "Sua Seleção";
}

/* Nome de exibição do estádio "da casa" do usuário */
function getStadiumName(){
  const v = (state.stadiumName || "").trim();
  return v || "Estádio dos Sonhos";
}

/* ---------- JANELA INICIAL: nome da seleção / do estádio ---------- */

function openSetupModal(){
  document.getElementById("teamNameInput").value = state.teamName === "Sua Seleção" ? "" : (state.teamName || "");
  document.getElementById("stadiumNameInput").value = state.stadiumName === "Estádio dos Sonhos" ? "" : (state.stadiumName || "");

  const formationSection = document.getElementById("formationSection");
  const lockedNote = document.getElementById("formationLockedNote");
  const confirmBtn = document.getElementById("confirmSetupBtn");
  if(state.started){
    // Formação já foi definida e travada: só mostra qual é, sem opção de trocar.
    formationSection.classList.add("hidden");
    lockedNote.classList.remove("hidden");
    document.getElementById("lockedFormationText").textContent = FORMATIONS[state.formation].label;
    confirmBtn.textContent = "Salvar";
  } else {
    formationSection.classList.remove("hidden");
    lockedNote.classList.add("hidden");
    selectFormationOption(state.formation || DEFAULT_FORMATION);
    confirmBtn.textContent = isRestarting ? "Começar a nova seleção" : "Começar a montar a seleção";
  }

  /* A mesma janela serve pra três momentos: a estreia, a edição de nomes com
     o jogo em andamento, e o recomeço (onde a formação volta a ser escolhível). */
  const title = document.getElementById("setupTitle");
  const intro = document.getElementById("setupIntro");
  let titleText, introText;
  if(state.started){
    titleText = "Alterar nomes";
    introText = "Troque o nome da sua seleção ou do seu estádio. A formação foi definida no começo desta seleção e não muda no meio do caminho.";
  } else if(isRestarting){
    titleText = "Nova seleção";
    introText = "Agora dá pra trocar de esquema: escolha a formação da nova seleção e ajuste os nomes se quiser. Depois de começar, a formação trava de novo.";
  } else {
    titleText = "Antes de começar…";
    introText = "Dê um nome pra sua seleção, pro seu estádio, e escolha a formação. Nomes você pode mudar depois no botão “✏️ Alterar nomes” — mas a formação é definitiva, não dá pra trocar depois de começar.";
  }
  if(title) title.textContent = titleText;
  if(intro) intro.textContent = introText;

  document.getElementById("setupModal").classList.remove("hidden");
}

/* "Montar nova seleção" / "Jogar de novo": em vez de recomeçar direto com a
   mesma formação, reabre a janela inicial com a formação DESTRAVADA, pra o
   usuário poder trocar de esquema (e de nomes) antes do novo draft. O jogo
   só recomeça de fato quando ele confirma em confirmSetup(). */
function restartGame(){
  state.started = false;      // destrava a escolha de formação
  isRestarting = true;        // muda só os textos da janela
  openSetupModal();
}

function confirmSetup(){
  const teamVal = document.getElementById("teamNameInput").value;
  const stadiumVal = document.getElementById("stadiumNameInput").value;
  state.teamName = teamVal;
  state.stadiumName = stadiumVal;

  if(!state.started){
    state.formation = selectedFormationKey; // trava a formação definitivamente
  }

  document.getElementById("setupModal").classList.add("hidden");

  if(!state.started){
    state.started = true;
    isRestarting = false;
    newGame();
  } else if(state.phase === "cup" && typeof cup !== "undefined" && cup){
    renderCupScreen();
  } else {
    renderDraft();
  }
}

/* ---------- DRAG & DROP (ponteiro: funciona com mouse e toque) ---------- */
let dragState = null;
let ghostEl = null;
let hoverTargetId = null;

function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

function newGame(){
  state.phase = "draft";
  cup = null;
  state.queue = shuffle(TEAMS);
  state.skips = 3;
  state.slots = FORMATIONS[state.formation].slots.map(s => ({...s, filled:null}));
  state.pendingPick = null;
  state.selected = null;
  document.getElementById("skipCount").textContent = state.skips;
  drawNextTeam();
  renderPitch();
  renderOvrPanel();
}

function filledCount(){
  return state.slots.filter(s=>s.filled).length;
}

function isComplete(){
  return filledCount() === state.slots.length;
}

function drawNextTeam(){
  if(isComplete()) { state.current = null; renderDraft(); return; }
  const startLen = state.queue.length;
  let checked = 0;
  while(true){
    if(state.queue.length === 0){ state.current = null; renderDraft(); return; }
    const candidate = state.queue.shift();
    if(teamHasAnyEligiblePlayer(candidate) || checked >= startLen){
      // (a 2ª condição só entra em ação se NINGUÉM na fila servir — extremamente
      // raro, mas evita travar o jogo num loop infinito; nesse caso mostra a
      // seleção mesmo assim, pro jogador usar um pulo/troca manual se precisar)
      state.current = candidate;
      renderDraft();
      return;
    }
    checked++;
    // Ninguém dessa seleção cabe em nenhuma vaga livre agora: resolve sozinho,
    // sem gastar a reserva de pulos/trocas do jogador. Prioriza trocar pelo
    // finalista do mesmo ano se ele estiver na fila e for aproveitável
    // (troca grátis); senão, manda essa seleção pro fim da fila e tenta a
    // próxima (pulo grátis).
    const counterIdx = findCounterpartIndex(candidate);
    if(counterIdx !== -1 && teamHasAnyEligiblePlayer(state.queue[counterIdx])){
      const counterpart = state.queue.splice(counterIdx, 1)[0];
      state.queue.push(candidate);
      state.current = counterpart;
      renderDraft();
      return;
    }
    state.queue.push(candidate);
  }
}

/* Existe pelo menos um jogador dessa seleção que cabe em alguma vaga livre agora? */
function teamHasAnyEligiblePlayer(team){
  return team.players.some(pl => openSlotsFor(pl.p).length > 0);
}

/* Vagas livres que uma posição de jogador pode ocupar agora */
function openSlotsFor(pos){
  const cats = playerEligiblePositions(pos);
  return state.slots.filter(s => !s.filled && cats.includes(s.pos));
}

function placePlayerInSlot(slotId, team, player){
  const slot = state.slots.find(s=>s.id===slotId);
  if(!slot || slot.filled) return;
  slot.filled = { name:player.n, team:team.team, year:team.year, ovr:player.ovr, vice:team.vice, pos:player.p };
  renderPitch(slot.id);
  renderOvrPanel();
}

function pickPlayer(playerName){
  const team = state.current;
  const player = team.players.find(p=>p.n===playerName);
  if(!player) return;
  const eligible = openSlotsFor(player.p);
  if(eligible.length === 0) return; // não deveria acontecer (botão fica desabilitado)

  if(eligible.length === 1){
    // só há uma vaga possível: escala direto, como antes
    placePlayerInSlot(eligible[0].id, team, player);
    drawNextTeam();
    return;
  }

  // mais de uma vaga possível: o usuário escolhe onde, tocando no campo
  state.pendingPick = { team, player };
  renderPitch();
  renderDraft();
}

function cancelPendingPick(){
  state.pendingPick = null;
  renderPitch();
  renderDraft();
}

/* ---------- REPOSICIONAR JOGADORES JÁ ESCALADOS ---------- */
function slotAccepts(targetSlot, playerPos){
  const cats = playerEligiblePositions(playerPos);
  return cats.includes(targetSlot.pos);
}

/* Pode mover/trocar sourceSlot -> targetSlot? Se o destino já tiver alguém,
   só permite se a troca fizer sentido nos dois sentidos. */
function canSwap(sourceSlot, targetSlot){
  if(!sourceSlot || !targetSlot || sourceSlot.id === targetSlot.id) return false;
  if(!sourceSlot.filled) return false;
  if(!targetSlot.filled){
    return slotAccepts(targetSlot, sourceSlot.filled.pos);
  }
  return slotAccepts(targetSlot, sourceSlot.filled.pos) && slotAccepts(sourceSlot, targetSlot.filled.pos);
}

function performMove(sourceId, targetId){
  const source = state.slots.find(s=>s.id===sourceId);
  const target = state.slots.find(s=>s.id===targetId);
  if(!canSwap(source, target)) return;
  const tmp = target.filled;
  target.filled = source.filled;
  source.filled = tmp;
  state.selected = null;
  renderPitch(targetId);
  renderOvrPanel();
}

/* Toque simples (sem arrastar) numa vaga do campo */
function handleSlotTap(slotId){
  const slot = state.slots.find(s=>s.id===slotId);
  if(!slot) return;

  if(state.pendingPick){
    const eligibleIds = openSlotsFor(state.pendingPick.player.p).map(s=>s.id);
    if(eligibleIds.includes(slotId)){
      const {team, player} = state.pendingPick;
      state.pendingPick = null;
      placePlayerInSlot(slotId, team, player);
      drawNextTeam();
    }
    return;
  }

  if(!state.selected){
    if(slot.filled){
      state.selected = slotId;
      renderPitch();
    }
    return;
  }

  if(state.selected === slotId){
    state.selected = null; // tocou de novo na mesma vaga: cancela seleção
    renderPitch();
    return;
  }

  const source = state.slots.find(s=>s.id===state.selected);
  if(canSwap(source, slot)){
    performMove(state.selected, slotId);
  } else if(slot.filled){
    state.selected = slotId; // trocou de ideia: seleciona este jogador agora
    renderPitch();
  } else {
    state.selected = null; // vaga incompatível: cancela seleção
    renderPitch();
  }
}

/* ---------- Ponteiro (mouse/toque): tocar = selecionar, arrastar = mover ---------- */
function onSlotPointerDown(ev, slotId){
  if(state.phase === "cup") return; // escalação travada durante a Copa do Brasil
  if(ev.button !== undefined && ev.button !== 0) return;
  ev.preventDefault();
  const el = ev.currentTarget;
  const slot = state.slots.find(s=>s.id===slotId);
  dragState = {
    sourceId: slotId,
    pointerId: ev.pointerId,
    startX: ev.clientX,
    startY: ev.clientY,
    moved: false,
    el,
    draggable: !!(slot && slot.filled) && !state.pendingPick,
  };
  try{ el.setPointerCapture(ev.pointerId); }catch(e){}
  el.addEventListener('pointermove', onSlotPointerMove);
  el.addEventListener('pointerup', onSlotPointerUp);
  el.addEventListener('pointercancel', onSlotPointerCancel);
}

function onSlotPointerMove(ev){
  if(!dragState || !dragState.draggable) return;
  const dx = ev.clientX - dragState.startX;
  const dy = ev.clientY - dragState.startY;
  if(!dragState.moved && Math.hypot(dx,dy) > 8){
    dragState.moved = true;
    beginGhost(dragState.sourceId);
    highlightTargets(dragState.sourceId);
  }
  if(dragState.moved){
    moveGhost(ev.clientX, ev.clientY);
    updateHoverTarget(ev.clientX, ev.clientY);
  }
}

function onSlotPointerUp(ev){
  if(!dragState) return;
  const {sourceId, moved, el, pointerId} = dragState;
  cleanupPointerListeners(el, pointerId);
  dragState = null;

  if(moved){
    const targetId = hoverTargetId;
    endGhost();
    clearHighlights();
    hoverTargetId = null;
    if(targetId){
      const source = state.slots.find(s=>s.id===sourceId);
      const target = state.slots.find(s=>s.id===targetId);
      if(canSwap(source, target)) performMove(sourceId, targetId);
    }
  } else {
    handleSlotTap(sourceId);
  }
}

function onSlotPointerCancel(){
  if(!dragState) return;
  const {el, pointerId, moved} = dragState;
  cleanupPointerListeners(el, pointerId);
  dragState = null;
  if(moved){ endGhost(); clearHighlights(); hoverTargetId = null; }
}

function cleanupPointerListeners(el, pointerId){
  el.removeEventListener('pointermove', onSlotPointerMove);
  el.removeEventListener('pointerup', onSlotPointerUp);
  el.removeEventListener('pointercancel', onSlotPointerCancel);
  try{ el.releasePointerCapture(pointerId); }catch(e){}
}

function beginGhost(sourceId){
  const slot = state.slots.find(s=>s.id===sourceId);
  if(!slot || !slot.filled) return;
  ghostEl = document.createElement('div');
  ghostEl.className = 'drag-ghost';
  ghostEl.innerHTML = `<div class="dot">★</div><div class="name">${slot.filled.name}</div>`;
  document.body.appendChild(ghostEl);
}

function moveGhost(x,y){
  if(!ghostEl) return;
  ghostEl.style.left = x + "px";
  ghostEl.style.top = y + "px";
}

function endGhost(){
  if(ghostEl){ ghostEl.remove(); ghostEl = null; }
}

function highlightTargets(sourceId){
  const source = state.slots.find(s=>s.id===sourceId);
  document.querySelectorAll('.slot').forEach(el=>{
    const id = el.dataset.slotId;
    const target = state.slots.find(s=>s.id===id);
    if(target && canSwap(source, target)) el.classList.add('drop-target');
  });
}

function clearHighlights(){
  document.querySelectorAll('.slot.drop-target, .slot.drop-hover').forEach(el=>{
    el.classList.remove('drop-target');
    el.classList.remove('drop-hover');
  });
}

function updateHoverTarget(x,y){
  const el = document.elementFromPoint(x,y);
  const slotEl = el ? el.closest('.slot') : null;
  const newId = slotEl ? slotEl.dataset.slotId : null;
  if(newId === hoverTargetId) return;
  if(hoverTargetId){
    const prevEl = document.querySelector(`.slot[data-slot-id="${hoverTargetId}"]`);
    if(prevEl) prevEl.classList.remove('drop-hover');
  }
  hoverTargetId = null;
  if(newId && slotEl.classList.contains('drop-target')){
    hoverTargetId = newId;
    slotEl.classList.add('drop-hover');
  }
}

/* ---------- OVERALL ---------- */
function sectorAverage(posCats){
  const filled = state.slots.filter(s=>posCats.includes(s.pos) && s.filled);
  if(filled.length===0) return null;
  const sum = filled.reduce((a,s)=>a+s.filled.ovr,0);
  return Math.round(sum/filled.length);
}

function renderOvrPanel(){
  const panel = document.getElementById("ovrPanel");
  const defesa = sectorAverage(SECTORS.Defesa);
  const meio   = sectorAverage(SECTORS.Meio);
  const ataque = sectorAverage(SECTORS.Ataque);
  const allDone = defesa!==null && meio!==null && ataque!==null;
  const total = allDone ? (defesa+meio+ataque) : null;
  const media = allDone ? Math.floor(total / 3) : null;

  const cell = (label, val) => `
    <div class="ovr-cell${label==="Overall "?" media":""}">
      <div class="lbl">${label}</div>
      <div class="val${val===null?" dash":""}">${val===null? "—" : val}</div>
    </div>`;

  panel.innerHTML =
    cell("Defesa", defesa) +
    cell("Meio-campo", meio) +
    cell("Ataque", ataque) +
    cell("Overall Total", media);
}

function skipTeam(){
  if(state.skips <= 0 || !state.current) return;
  state.skips--;
  document.getElementById("skipCount").textContent = state.skips;
  state.queue.push(state.current); // o time pulado volta pro fim da fila em vez de sumir
  drawNextTeam();
}

/* Acha, na fila ainda não sorteada, o outro finalista do mesmo ano do time
   atual (campeão <-> vice). Retorna o índice na fila, ou -1 se esse time já
   tiver sido sorteado antes e não estiver mais disponível pra troca. */
function findCounterpartIndex(team){
  if(!team) return -1;
  return state.queue.findIndex(t => t.year === team.year && !!t.vice !== !!team.vice);
}

/* "Trocar finalista": troca o time atual pelo campeão/vice do mesmo ano,
   consumindo a mesma reserva de trocas do botão "Pular seleção". */
function swapFinalist(){
  if(state.skips <= 0 || !state.current) return;
  const idx = findCounterpartIndex(state.current);
  if(idx === -1) return; // outro finalista já foi sorteado antes, não dá pra trocar
  const counterpart = state.queue[idx];
  state.queue.splice(idx, 1);
  state.queue.push(state.current); // o time atual também volta pro fim da fila
  state.current = counterpart;
  state.skips--;
  document.getElementById("skipCount").textContent = state.skips;
  renderDraft();
}

/* ---------- RENDER: CAMPO ---------- */
function renderPitch(justFilledId){
  const pitch = document.getElementById("pitch");
  pitch.classList.toggle("locked", state.phase === "cup");
  pitch.innerHTML = "";
  state.slots.forEach(s=>{
    const el = document.createElement("div");

    let cls = "slot" + (s.filled ? " filled" : "") + (s.id===justFilledId ? " pop":"");
    if(state.phase === "cup"){
      // fase da Copa: escalação travada, sem seleção/arraste
    } else if(state.pendingPick){
      const eligibleIds = openSlotsFor(state.pendingPick.player.p).map(x=>x.id);
      if(eligibleIds.includes(s.id)) cls += " drop-target";
    } else if(state.selected){
      if(s.id === state.selected){
        cls += " selected";
      } else {
        const source = state.slots.find(x=>x.id===state.selected);
        if(canSwap(source, s)) cls += " drop-target";
      }
    }
    el.className = cls;
    el.dataset.slotId = s.id;
    el.style.top = s.top;
    el.style.left = s.left;
    el.innerHTML = `
      <div class="dot">${s.filled ? "★" : s.label}</div>
      ${s.filled ? `<div class="name">${s.filled.name} <span class="ovr-tag">${s.filled.ovr}</span></div><div class="from">${s.filled.team} ${s.filled.year}</div>` : `<div class="name" style="color:var(--ink-dim)">${POS_LABEL[s.pos]}</div>`}
    `;
    el.addEventListener('pointerdown', (ev)=>onSlotPointerDown(ev, s.id));
    pitch.appendChild(el);
  });
}

/* ---------- RENDER: PAINEL DE SORTEIO ---------- */
function renderDraft(){
  const card = document.getElementById("draftCard");

  if(state.pendingPick){
    const {team, player} = state.pendingPick;
    const count = openSlotsFor(player.p).length;
    card.innerHTML = `
      <div class="team-banner">
        <div>
          <span class="team-name">${player.n}</span><span class="team-year">${formatPos(player.p)}</span>
          <div class="team-note">De ${team.team} ${team.year} · escolha onde escalar</div>
        </div>
      </div>
      <div class="empty-note">
        ${player.n} pode jogar em ${count} posições livres agora. Toque numa das vagas destacadas no campo ao lado para escalar.
      </div>
      <div class="controls">
        <button class="action" onclick="cancelPendingPick()">Cancelar</button>
      </div>
    `;
    return;
  }

  if(isComplete()){
    renderFinal(card);
    return;
  }

  if(!state.current){
    card.innerHTML = `
      <div class="empty-note">
        As seleções sorteadas acabaram antes de fechar o time (${filledCount()}/11 posições preenchidas).
        Isso é raro — reinicie para sortear uma nova ordem.
      </div>
      <div class="controls">
        <button class="action primary" onclick="restartGame()">Recomeçar</button>
      </div>
    `;
    return;
  }

  const team = state.current;
  const counterIdx = findCounterpartIndex(team);
  const counterpart = counterIdx !== -1 ? state.queue[counterIdx] : null;
  const swapDisabled = state.skips <= 0 || !counterpart;
  const swapLabel = counterpart ? `${counterpart.vice ? "vice" : "campeão"} ${counterpart.year}` : "indisponível";

  const playerButtons = team.players.map(pl=>{
    const canPick = openSlotsFor(pl.p).length > 0;
    return `<button class="player-btn" ${canPick? "":"disabled"} onclick="pickPlayer('${pl.n.replace(/'/g,"\\'")}')">
      <span class="pname">${pl.n}</span>
      <span style="display:flex;gap:6px;align-items:center;">
        <span class="ovr-chip">${pl.ovr}</span>
        <span class="pos-badge">${formatPos(pl.p)}</span>
      </span>
    </button>`;
  }).join("");

  card.innerHTML = `
    <div class="team-banner">
      <img id="teamLogoImg" class="team-logo" data-team="${team.team}" style="display:none" alt="Escudo ${team.team}">
      <div>
        <span class="team-name">${team.team}</span><span class="team-year">${team.year}</span>
        <div class="team-note">${team.vice == true? "Vice":"Campeão"} da Copa do Brasil ${team.year}</div>
      </div>
    </div>
    <div class="players">${playerButtons}</div>
    <div class="controls">
      <button class="action" onclick="skipTeam()" ${state.skips<=0? "disabled":""}>Pular seleção (${state.skips})</button>
      <button class="action" onclick="swapFinalist()" ${swapDisabled? "disabled":""} title="${counterpart? `Troca por ${counterpart.team}, ${swapLabel}` : "O outro finalista deste ano já foi sorteado antes"}">🔁 Trocar finalista (${swapLabel})</button>
    </div>
  `;
  updateTeamLogo(team.team);
}

function renderFinal(card){
  const rows = state.slots.map(s=>`
    <div class="final-row">
      <span class="fpos">${s.label}</span>
      <span class="fname">${s.filled.name}</span>
      <span class="fovr">${s.filled.ovr}</span>
      <span class="fteam">${s.filled.team} ${s.filled.year}</span>
    </div>
  `).join("");

  const defesa = sectorAverage(SECTORS.Defesa);
  const meio = sectorAverage(SECTORS.Meio);
  const ataque = sectorAverage(SECTORS.Ataque);
  const total = defesa+meio+ataque;
  const media = Math.floor(total / 3);

  card.innerHTML = `
    <div class="final-panel">
      <h2>Escalação fechada!</h2>
      <p>${getTeamName()}, montada com craques de ${new Set(state.slots.map(s=>s.filled.year)).size} edições diferentes · Overall Total <b style="color:var(--gold-bright)">${media}</b></p>
      <div class="final-list">${rows}</div>
      <div class="controls" style="justify-content:center;">
        <button class="action primary" onclick="startCup()">🏆 Disputar a Copa do Brasil</button>
        <button class="action" onclick="restartGame()">Jogar de novo</button>
      </div>
    </div>
  `;
}

/* Primeira tela é o aviso de boas-vindas (#welcomeModal, visível por padrão
   no index.html), que explica como o jogo funciona. Ao confirmar ali, o
   usuário cai na janela de nomes/formação; e só depois de confirmar ESSA
   janela (confirmSetup) é que o jogo começa de fato (newGame). */
function startFromWelcome(){
  document.getElementById("welcomeModal").classList.add("hidden");
  openSetupModal();
}

/* Deixa a prévia da formação já montada antes da janela aparecer. */
selectFormationOption(DEFAULT_FORMATION);
