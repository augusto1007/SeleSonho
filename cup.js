/* ============================================================
   cup.js — Fase "Copa do Brasil" (pós-escalação)
   Depois de fechar os 11, o jogador enfrenta 4 rodadas com
   dificuldade crescente: Oitavas, Quartas, Semifinal (ida e
   volta, com leve vantagem pra quem joga em casa) e Final
   (jogo único, em estádio neutro sorteado, sem vantagem).
   Depende de TEAMS (data.js) e de SECTORS/state (app.js).
   ============================================================ */

/* TEAM_NAME agora é dinâmico: getTeamName() (definido em app.js) lê o nome
   escolhido pelo usuário no campo do cabeçalho. */

const ROUND_NAMES = ["Oitavas de Final", "Quartas de Final", "Semifinal", "Final"];

/* Estádios "mandantes" aproximados de cada clube do banco de dados */
const STADIUMS = {
  "Corinthians":   {name:"Neo Química Arena",  city:"São Paulo/SP"},
  "Palmeiras":     {name:"Allianz Parque",      city:"São Paulo/SP"},
  "São Paulo":     {name:"Morumbis",            city:"São Paulo/SP"},
  "Santos":        {name:"Vila Belmiro",        city:"Santos/SP"},
  "Flamengo":      {name:"Maracanã",            city:"Rio de Janeiro/RJ"},
  "Fluminense":    {name:"Maracanã",            city:"Rio de Janeiro/RJ"},
  "Vasco":         {name:"São Januário",        city:"Rio de Janeiro/RJ"},
  "Botafogo":      {name:"Nilton Santos",       city:"Rio de Janeiro/RJ"},
  "Cruzeiro":      {name:"Mineirão",            city:"Belo Horizonte/MG"},
  "Atlético-MG":   {name:"Arena MRV",           city:"Belo Horizonte/MG"},
  "Grêmio":        {name:"Arena do Grêmio",     city:"Porto Alegre/RS"},
  "Internacional": {name:"Beira-Rio",           city:"Porto Alegre/RS"},
  "Juventude":     {name:"Alfredo Jaconi",      city:"Caxias do Sul/RS"},
  "Athletico-PR":  {name:"Arena da Baixada",    city:"Curitiba/PR"},
  "Coritiba":      {name:"Couto Pereira",       city:"Curitiba/PR"},
  "Vitória":       {name:"Barradão",            city:"Salvador/BA"},
  "Sport":         {name:"Ilha do Retiro",      city:"Recife/PE"},
  "Figueirense":   {name:"Orlando Scarpelli",   city:"Florianópolis/SC"},
  "Brasiliense":   {name:"Boca do Jacaré",      city:"Taguatinga/DF"},
  "Santo André":   {name:"Bruno José Daniel",   city:"Santo André/SP"},
  "Paulista":      {name:"Jaime Cardoso",       city:"Jundiaí/SP"},
};

/* "Casa" fictícia da seleção do usuário (não é um clube, então não tem estádio
   próprio real). O nome vem de getStadiumName() (definido em app.js). */
function dreamStadium(){
  return {name:getStadiumName(), city:"Sede da Seleção"};
}

/* Pool de estádios brasileiros para sorteio da final (neutro) */
const NEUTRAL_STADIUMS = (() => {
  const map = new Map();
  Object.values(STADIUMS).forEach(s => map.set(s.name, s));
  [
    {name:"Mané Garrincha",     city:"Brasília/DF"},
    {name:"Arena Fonte Nova",   city:"Salvador/BA"},
    {name:"Arena Castelão",     city:"Fortaleza/CE"},
    {name:"Arena Pantanal",     city:"Cuiabá/MT"},
    {name:"Arena da Amazônia",  city:"Manaus/AM"},
    {name:"Arena das Dunas",    city:"Natal/RN"},
    {name:"Serra Dourada",      city:"Goiânia/GO"},
  ].forEach(s => map.set(s.name, s));
  return Array.from(map.values());
})();

/* ---------- ESTADO DA COPA ---------- */
let cup = null;

/* ---------- VELOCIDADE DA SIMULAÇÃO (timer em "tempo real") ---------- */
/* Cada partida agora "roda" minuto a minuto, com um cronômetro, em vez de
   pular direto pro resultado. O jogador escolhe o ritmo da animação:
   - lento: cada minuto demora mais, dá pra acompanhar com calma;
   - rapido: ritmo padrão, ameno;
   - instantaneo: mantém o comportamento antigo (resultado na hora, sem animação).
   A escolha fica salva no navegador. */
const MATCH_SPEED_MS = { lento: 260, rapido: 70 };
let matchSpeed = (() => {
  try{
    const saved = localStorage.getItem("cdb_matchSpeed");
    if(saved === "lento" || saved === "rapido" || saved === "instantaneo") return saved;
  }catch(e){}
  return "rapido";
})();

function setMatchSpeed(sp){
  matchSpeed = sp;
  try{ localStorage.setItem("cdb_matchSpeed", sp); }catch(e){}
  if(cup && (cup.status === "ready")) renderCupScreen();
}

function speedSelectHtml(){
  const opts = [
    {key:"lento", label:"🐢 Lento"},
    {key:"rapido", label:"⚡ Rápido"},
    {key:"instantaneo", label:"⏭️ Instantâneo"},
  ];
  return `
    <div class="speed-select">
      <span class="speed-select-label">Velocidade da simulação</span>
      <div class="speed-select-opts">
        ${opts.map(o => `<button type="button" class="speed-btn${matchSpeed===o.key?" active":""}" onclick="setMatchSpeed('${o.key}')">${o.label}</button>`).join("")}
      </div>
    </div>`;
}

function stadiumFor(teamName){
  return STADIUMS[teamName] || {name:`Estádio Municipal de ${teamName}`, city:teamName};
}

/* Extrai a posição "principal" de um jogador pra fins de cálculo de setor —
   funciona tanto pro formato antigo (string única) quanto pro novo (array
   de posições, onde a primeira é considerada a principal). */
function primaryPos(p){
  return Array.isArray(p) ? p[0] : p;
}

/* Overall de um elenco qualquer, agrupando por Defesa/Meio/Ataque
   (mesma metodologia usada pra Seleção dos Sonhos, pra comparação justa) */
function squadOverall(players){
  const g = {Defesa:[], Meio:[], Ataque:[]};
  players.forEach(p=>{
    const pos = primaryPos(p.p);
    if(pos==="GOL"||pos==="LAT"||pos==="LD"||pos==="LE"||pos==="ZAG") g.Defesa.push(p.ovr);
    else if(pos==="VOL"||pos==="MC"||pos==="MD"||pos==="ME"||pos==="MEI") g.Meio.push(p.ovr);
    else g.Ataque.push(p.ovr);
  });
  const avg = arr => arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
  return Math.floor((avg(g.Defesa) + avg(g.Meio) + avg(g.Ataque)) / 3);
}

function userOverall(){
  const defesa = sectorAverage(SECTORS.Defesa);
  const meio   = sectorAverage(SECTORS.Meio);
  const ataque = sectorAverage(SECTORS.Ataque);
  return Math.floor((defesa + meio + ataque) / 3);
}

/* Sorteia 4 adversários reais do banco de dados, com dificuldade crescente:
   um de cada "quartil" de força, colocados em ordem crescente de overall. */
function pickCupOpponents(){
  const scored = TEAMS.map(t => ({...t, _ovr: squadOverall(t.players)}))
                       .sort((a,b) => a._ovr - b._ovr);
  const n = scored.length;
  const cuts = [0, Math.floor(n*0.25), Math.floor(n*0.5), Math.floor(n*0.75), n];
  const buckets = [
    scored.slice(cuts[0], cuts[1]),
    scored.slice(cuts[1], cuts[2]),
    scored.slice(cuts[2], cuts[3]),
    scored.slice(cuts[3], cuts[4]),
  ];
  const picks = buckets.map(b => b[Math.floor(Math.random()*b.length)]);
  picks.sort((a,b) => a._ovr - b._ovr);
  return picks; // [oitavas, quartas, semi, final]
}

/* ---------- SIMULAÇÃO DE PARTIDAS ---------- */
function poissonRandom(lambda){
  const L = Math.exp(-lambda);
  let k = 0, p = 1;
  do{ k++; p *= Math.random(); } while(p > L);
  return k - 1;
}

function goalLambda(ownOvr, oppOvr, homeBonus){
  const lambda = 1.35 + (ownOvr - oppOvr) * 0.045 + homeBonus;
  return Math.max(0.25, Math.min(4.2, lambda));
}

/* ---------- SÚMULA (autores dos gols + minutagem) ---------- */
/* Peso de propensão a marcar por posição — atacantes e meias têm mais chance,
   mas qualquer jogador de linha pode balançar as redes. */
const SCORER_WEIGHT = {CA:6, ATA:6, PD:4.5, PE:4.5, MEI:3.4, MD:2.6, ME:2.6, MC:1.8, VOL:1.2, LAT:0.8, LD:0.8, LE:0.8, ZAG:0.4, GOL:0.03};

/* Recebe um array de jogadores já normalizado como {name,pos,ovr} e sorteia
   um autor do gol, ponderando pela posição e pelo overall do jogador. */
function pickScorer(players){
  const pool = players.length ? players : [{name:"Jogador", pos:"CA", ovr:70}];
  const weighted = pool.map(pl => ({
    name: pl.name,
    w: (SCORER_WEIGHT[pl.pos] || 1) * (0.6 + pl.ovr/100),
  }));
  const total = weighted.reduce((a,b)=>a+b.w, 0);
  let r = Math.random() * total;
  for(const pl of weighted){
    r -= pl.w;
    if(r <= 0) return pl.name;
  }
  return weighted[weighted.length-1].name;
}

/* Sorteia `numGoals` eventos de gol (autor + minuto de 1 a 90, sem repetir
   minuto), já ordenados cronologicamente. */
const FIRST_HALF_END = 45;
const FIRST_HALF_ADDED = 5;
const SECOND_HALF_END = 90;
const SECOND_HALF_ADDED = 6;
const MATCH_END_MINUTE = SECOND_HALF_END + SECOND_HALF_ADDED;

/* Converte o minuto interno da simulação para o formato de futebol.
   Ex.: 48 vira 45+3 e 94 vira 90+4. */
function formatMatchMinute(minute){
  if(minute > FIRST_HALF_END && minute <= FIRST_HALF_END + FIRST_HALF_ADDED) return `45+${minute-FIRST_HALF_END}`;
  if(minute > SECOND_HALF_END) return `90+${minute-SECOND_HALF_END}`;
  return `${minute}`;
}

/* Sorteia o minuto dos gols incluindo acréscimos nos dois tempos. */
function randomMatchMinute(){
  const roll = Math.random();
  if(roll < 0.055) return 46 + Math.floor(Math.random()*FIRST_HALF_ADDED); // 45+1 até 45+5
  if(roll < 0.125) return 91 + Math.floor(Math.random()*SECOND_HALF_ADDED); // 90+1 até 90+6
  let minute;
  do{ minute = 1 + Math.floor(Math.random()*90); }
  while(minute > 45 && minute <= 50); // evita faixa interna dos acréscimos do 1º tempo
  return minute;
}

function generateGoalEvents(numGoals, players){
  const usedMinutes = new Set();
  const events = [];
  for(let i=0; i<numGoals; i++){
    let minute;
    do{ minute = randomMatchMinute(); } while(usedMinutes.has(minute));
    usedMinutes.add(minute);
    events.push({minute, name: pickScorer(players)});
  }
  events.sort((a,b) => a.minute - b.minute);
  return events;
}

/* Mensagens dramáticas pós-jogo. Não são sorteadas apenas pelo placar:
   levam em conta virada, empate no fim, goleada, remontada no agregado e
   decisão por pênaltis para deixar a campanha mais viva. */
function buildMatchNarrative(result, userName, oppName, context={}){
  const events = [
    ...result.userEvents.map(e=>({...e,mine:true})),
    ...result.oppEvents.map(e=>({...e,mine:false}))
  ].sort((a,b)=>a.minute-b.minute);
  let ug=0, og=0, maxDeficit=0, hadLead=false, lateEqualizer=false, leadChanges=0, lastLeader=0;
  events.forEach(e=>{
    if(e.mine) ug++; else og++;
    maxDeficit=Math.max(maxDeficit, og-ug);
    const leader=Math.sign(ug-og);
    if(leader!==0 && lastLeader!==0 && leader!==lastLeader) leadChanges++;
    if(leader!==0) lastLeader=leader;
    if(ug>og) hadLead=true;
    if(e.mine && ug===og && e.minute>=85) lateEqualizer=true;
  });
  const msgs=[];
  const won=result.userGoals>result.oppGoals;
  const lost=result.userGoals<result.oppGoals;
  const draw=!won&&!lost;
  const score=`${result.userGoals} x ${result.oppGoals}`;
  if(won && maxDeficit>=2) msgs.push(`🔥 REMONTADA HISTÓRICA! ${userName} chegou a ficar ${maxDeficit} gols atrás, reagiu e virou para ${score}.`);
  else if(won && maxDeficit===1) msgs.push(`🔄 Que reação! Depois de sair atrás, ${userName} buscou a virada e venceu por ${score}.`);
  if(won && result.userGoals-result.oppGoals>=3) msgs.push(`🚀 Atropelo! ${userName} dominou o jogo e aplicou um sonoro ${score}.`);
  if(won && result.userEvents.some(e=>e.minute>90)) msgs.push(`⏱️ GOL NOS ACRÉSCIMOS! ${userName} decidiu o jogo no apagar das luzes.`);
  if(lost && result.oppEvents.some(e=>e.minute>90)) msgs.push(`💔 Drama até o fim: ${oppName} encontrou o gol decisivo já nos acréscimos.`);
  if(draw && lateEqualizer) msgs.push(`⏱️ No último suspiro! ${userName} arrancou o empate e manteve a decisão completamente aberta.`);
  if(draw && events.length===0) msgs.push(`🧱 Jogo travado do início ao fim: ninguém conseguiu furar as defesas. A decisão fica para os pênaltis.`);
  if(leadChanges>=2) msgs.push(`🎢 Um verdadeiro roteiro de cinema: o placar mudou de lado e a torcida viveu cada minuto no limite.`);
  if(!msgs.length){
    msgs.push(won ? `⚽ Vitória importante! ${userName} foi mais eficiente e fechou a partida em ${score}.`
      : lost ? `😤 ${userName} lutou até o fim, mas ${oppName} levou a melhor por ${score}.`
      : `🤝 Tudo igual: ${score}. Nenhum dos dois lados conseguiu construir vantagem no tempo normal.`);
  }
  if(context.aggregateBefore){
    const a=context.aggregateBefore;
    const beforeDiff=a.user-a.opp, afterDiff=(a.user+result.userGoals)-(a.opp+result.oppGoals);
    if(beforeDiff<0 && afterDiff>0) msgs.unshift(`🏆 VIRADA NO AGREGADO! ${userName} estava em desvantagem e conseguiu uma classificação épica.`);
    else if(beforeDiff<0 && afterDiff===0) msgs.unshift(`😱 EMPATE NO AGREGADO! Depois de buscar o resultado, a vaga será decidida nos pênaltis.`);
  }
  if(context.penalties){
    msgs.unshift(context.penalties.winnerUser
      ? `🥅 NOS PÊNALTIS! ${userName} suportou a pressão e garantiu a classificação.`
      : `🥅 NOS PÊNALTIS! Depois de muito equilíbrio, a disputa terminou em favor de ${oppName}.`);
  }
  return msgs.slice(0,3);
}


/* Normaliza o elenco titular do usuário (state.slots) e o elenco do
   adversário (opp.players, vindo de data.js) pro mesmo formato {name,pos,ovr}.
   Pro usuário, usa a posição da VAGA (s.pos) — o que importa pra súmula é a
   função que o jogador está exercendo em campo, não todas as posições que
   ele poderia jogar. */
function normalizedUserSquad(){
  return state.slots.filter(s=>s.filled).map(s => ({name:s.filled.name, pos:s.pos, ovr:s.filled.ovr}));
}
function normalizedOppSquad(opp){
  return opp.players.map(p => ({name:p.n, pos:primaryPos(p.p), ovr:p.ovr}));
}

/* userHome: true = usuário manda o jogo, false = adversário manda, null = neutro (final) */
function simulateMatch(userOvr, oppOvr, userHome, userPlayers, oppPlayers){
  const HOME_BONUS = 0.32; // leve vantagem de jogar em casa
  const userBonus = userHome === true  ? HOME_BONUS : 0;
  const oppBonus  = userHome === false ? HOME_BONUS : 0;
  const userGoals = poissonRandom(goalLambda(userOvr, oppOvr, userBonus));
  const oppGoals  = poissonRandom(goalLambda(oppOvr, userOvr, oppBonus));
  return {
    userGoals, oppGoals,
    userEvents: generateGoalEvents(userGoals, userPlayers),
    oppEvents:  generateGoalEvents(oppGoals, oppPlayers),
  };
}

function penaltyChance(ovr){
  return Math.max(0.55, Math.min(0.88, 0.66 + (ovr - 75) * 0.004));
}

/* Sorteia a ordem dos batedores de um time, ponderando pela posição e pelo
   overall (mesmo peso usado pra autoria dos gols — quem mais marca é quem
   mais bate pênalti). É um sorteio SEM reposição: cada jogador só reaparece
   depois que todos os outros já bateram uma vez (ciclo, igual regra real
   de "todo mundo bate antes de repetir" na morte súbita). */
function pickPenaltyOrder(players){
  const pool = players.length ? players.slice() : [{name:"Jogador", pos:"CA", ovr:70}];
  let remaining = pool.map(pl => ({
    name: pl.name,
    w: (SCORER_WEIGHT[pl.pos] || 1) * (0.6 + pl.ovr/100),
  }));
  const order = [];
  while(remaining.length){
    const total = remaining.reduce((a,b)=>a+b.w, 0);
    let r = Math.random() * total, idx = 0;
    for(; idx<remaining.length-1; idx++){ r -= remaining[idx].w; if(r<=0) break; }
    order.push(remaining[idx].name);
    remaining.splice(idx, 1);
  }
  return order;
}

/* Disputa de pênaltis com a regra real de desempate: cada time bate até 5
   cobranças, mas a disputa termina assim que o resultado fica matematicamente
   definido (não precisa bater as 5 se o time de trás não alcança mais o
   outro nem com todas as cobranças restantes). Se seguir empatado depois
   das 5 cobranças de cada, vai pra morte súbita (1 cobrança por vez, os
   dois batem a cada rodada até haver um vencedor). userPlayers/oppPlayers
   já normalizados como {name,pos,ovr} — usados só pra sortear quem bate
   cada cobrança (o autor/"batedor"). */
function simulatePenalties(userOvr, oppOvr, userPlayers, oppPlayers){
  const pu = penaltyChance(userOvr), po = penaltyChance(oppOvr);
  const userTakers = pickPenaltyOrder(userPlayers || []);
  const oppTakers  = pickPenaltyOrder(oppPlayers || []);
  const nextTaker = (order, taken) => order[taken % order.length];
  let userScore = 0, oppScore = 0, userTaken = 0, oppTaken = 0, round = 0;
  const sequence = []; // {round, side:'user'|'opp', makes, name, userScore, oppScore}

  const decided = () => {
    const userRemaining = Math.max(0, 5 - userTaken);
    const oppRemaining  = Math.max(0, 5 - oppTaken);
    return (userScore > oppScore + oppRemaining) || (oppScore > userScore + userRemaining);
  };

  // Fase regular: até 5 cobranças por lado, parando assim que decidido.
  while((userTaken < 5 || oppTaken < 5) && !decided()){
    round++;
    if(userTaken < 5){
      const name = nextTaker(userTakers, userTaken);
      userTaken++;
      const makes = Math.random() < pu;
      if(makes) userScore++;
      sequence.push({round, side:"user", makes, name, userScore, oppScore});
      if(decided()) break;
    }
    if(oppTaken < 5){
      const name = nextTaker(oppTakers, oppTaken);
      oppTaken++;
      const makes = Math.random() < po;
      if(makes) oppScore++;
      sequence.push({round, side:"opp", makes, name, userScore, oppScore});
    }
  }

  // Morte súbita, se seguir empatado depois da fase regular.
  while(userScore === oppScore && round < 30){
    round++;
    const uName = nextTaker(userTakers, userTaken);
    userTaken++;
    const uMakes = Math.random() < pu;
    if(uMakes) userScore++;
    sequence.push({round, side:"user", makes:uMakes, name:uName, userScore, oppScore});

    const oName = nextTaker(oppTakers, oppTaken);
    oppTaken++;
    const oMakes = Math.random() < po;
    if(oMakes) oppScore++;
    sequence.push({round, side:"opp", makes:oMakes, name:oName, userScore, oppScore});
  }

  return {userScore, oppScore, winnerUser: userScore > oppScore, sequence};
}

/* ---------- FLUXO DA COPA ---------- */
function startCup(){
  cup = {
    roundIdx: 0,
    opponents: pickCupOpponents(),
    legIdx: 0,
    legResults: [],
    roundHistory: [],
    finalStadium: null,
    lastLegResult: null,
    status: "ready", // ready | played | roundOver | eliminated | champion | runnerup
    userOvr: userOverall(),
  };
  state.phase = "cup";
  renderPitch();
  renderCupScreen();
}

function currentOpponent(){ return cup.opponents[cup.roundIdx]; }
function isFinalRound(){ return cup.roundIdx === 3; }
function currentLegIsUserHome(){ return isFinalRound() ? null : cup.legIdx === 0; }

function currentStadium(){
  if(isFinalRound()){
    if(!cup.finalStadium){
      const oppStadiumName = stadiumFor(currentOpponent().team).name;
      const pool = NEUTRAL_STADIUMS.filter(s => s.name !== oppStadiumName && s.name !== dreamStadium().name);
      cup.finalStadium = pool[Math.floor(Math.random()*pool.length)];
    }
    return cup.finalStadium;
  }
  return currentLegIsUserHome() ? dreamStadium() : stadiumFor(currentOpponent().team);
}

function playLeg(){
  const opp = currentOpponent();
  const userHome = currentLegIsUserHome();
  const res = simulateMatch(cup.userOvr, opp._ovr, userHome, normalizedUserSquad(), normalizedOppSquad(opp));
  cup.lastLegResult = {...res, stadium: currentStadium(), userHome, opponent: opp};
  cup.legResults.push(res);

  if(matchSpeed === "instantaneo"){
    cup.status = "played";
    renderCupScreen();
  } else {
    startLiveMatch();
  }
}

/* ---------- CRONÔMETRO AO VIVO ---------- */
/* Roda a partida minuto a minuto (1 a 90), revelando os gols no minuto em
   que aconteceram, como se fosse em tempo real. O resultado final já está
   todo sorteado (cup.lastLegResult) — a animação só vai "revelando" os
   eventos conforme o relógio avança, pra dar a sensação de jogo ao vivo. */
function startLiveMatch(){
  const r = cup.lastLegResult;
  const allEvents = [
    ...r.userEvents.map(e => ({...e, mine:true})),
    ...r.oppEvents.map(e => ({...e, mine:false})),
  ].sort((a,b) => a.minute - b.minute);

  cup.status = "playing";
  cup.live = { minute:0, userGoals:0, oppGoals:0, revealed:[], pending:allEvents, timer:null };
  getAudioCtx(); // "destrava" o áudio já no clique que inicia a partida
  renderCupScreen();

  const tickMs = MATCH_SPEED_MS[matchSpeed] || MATCH_SPEED_MS.rapido;
  cup.live.timer = setInterval(() => {
    if(!cup.live) return; // já foi pulado/encerrado
    cup.live.minute++;
    while(cup.live.pending.length && cup.live.pending[0].minute <= cup.live.minute){
      const ev = cup.live.pending.shift();
      cup.live.revealed.push(ev);
      if(ev.mine){ cup.live.userGoals++; playCheer(false); }
      else { cup.live.oppGoals++; playLament(false); }
    }
    if(cup.live.minute >= MATCH_END_MINUTE){
      clearInterval(cup.live.timer);
      cup.live = null;
      cup.status = "played";
    }
    renderCupScreen();
  }, tickMs);
}

/* Pula direto pro resultado final, encerrando o cronômetro em andamento. */
function skipLiveMatch(){
  if(cup.live && cup.live.timer) clearInterval(cup.live.timer);
  cup.live = null;
  cup.status = "played";
  renderCupScreen();
}

function continueCup(){
  if(isFinalRound()){ finishRound(); return; }
  if(cup.legIdx === 0){
    cup.legIdx = 1;
    cup.status = "ready";
    renderCupScreen();
  } else {
    finishRound();
  }
}

function finishRound(){
  const opp = currentOpponent();
  let aggUser, aggOpp;
  if(isFinalRound()){
    aggUser = cup.legResults[0].userGoals;
    aggOpp  = cup.legResults[0].oppGoals;
  } else {
    aggUser = cup.legResults[0].userGoals + cup.legResults[1].userGoals;
    aggOpp  = cup.legResults[0].oppGoals + cup.legResults[1].oppGoals;
  }
  let penalties = null, advanced;
  if(aggUser === aggOpp){
    penalties = simulatePenalties(cup.userOvr, opp._ovr, normalizedUserSquad(), normalizedOppSquad(opp));
    advanced = penalties.winnerUser;
  } else {
    advanced = aggUser > aggOpp;
  }

  const aggregateBefore = !isFinalRound() && cup.legResults.length===2
    ? {user:cup.legResults[0].userGoals, opp:cup.legResults[0].oppGoals} : null;
  const narrative = buildMatchNarrative(cup.lastLegResult, getTeamName(), opp.team+" ("+opp.year+")", {aggregateBefore, penalties});
  cup.roundHistory.push({
    roundIdx: cup.roundIdx, opponent: opp, aggUser, aggOpp, penalties, advanced, narrative,
    legs: cup.legResults.slice(), stadium: isFinalRound() ? cup.finalStadium : null,
  });
  cup.legResults = [];
  cup.legIdx = 0;

  if(!advanced){
    cup.status = isFinalRound() ? "runnerup" : "eliminated";
    playLament(true);
  } else if(isFinalRound()){
    cup.status = "champion";
    playCheer(true);
  } else {
    cup.roundIdx++;
    cup.status = "roundOver";
    playCheer(true);
  }
  renderCupScreen();
}

function proceedNextRound(){
  cup.status = "ready";
  renderCupScreen();
}

function retryCup(){
  startCup();
}

/* ---------- RENDER ---------- */
function scoreStr(u,o){ return `${u} x ${o}`; }

/* Monta a súmula da disputa de pênaltis: uma linha por rodada, com o
   resultado da cobrança de cada time e o placar final. */
function penaltiesSumulaHtml(penalties, userTeamName, oppTeamName){
  const rounds = new Map();
  penalties.sequence.forEach(e => {
    if(!rounds.has(e.round)) rounds.set(e.round, {});
    rounds.get(e.round)[e.side] = e;
  });
  const markHtml = entry => entry
    ? `<span class="pen-mark ${entry.makes?"made":"missed"}">
         <span class="pen-mark-icon">${entry.makes?"⚽":"❌"}</span>
         <span class="pen-taker">${entry.name}</span>
       </span>`
    : `<span class="pen-mark pending">—</span>`;

  const rows = Array.from(rounds.entries()).map(([round, r]) => {
    const last = r.opp || r.user; // placar após a última cobrança batida na rodada
    return `
    <div class="pen-row">
      <span class="pen-round">${round}ª</span>
      ${markHtml(r.user)}
      <span class="pen-round-score">${last.userScore} x ${last.oppScore}</span>
      ${markHtml(r.opp)}
    </div>`;
  }).join("");

  return `
    <div class="sumula pen-sumula">
      <div class="sumula-title">🥅 Súmula dos pênaltis</div>
      <div class="pen-teams-label"><span>${userTeamName}</span><span>${oppTeamName}</span></div>
      <div class="pen-rows">${rows}</div>
      <div class="pen-final-score">${penalties.userScore} x ${penalties.oppScore}</div>
    </div>`;
}

/* Monta a(s) súmula(s) de uma rodada já concluída (1 jogo, se final; 2 jogos,
   se ida e volta), usando o histórico salvo em roundHistory[i].legs, e a
   súmula dos pênaltis, se a rodada foi decidida assim. */
function legsSumulaHtml(h){
  const oppLabel = h.opponent.team + "(" + h.opponent.year + ")";
  const legsHtml = h.legs.length === 1
    ? sumulaHtml(h.legs[0].userEvents, h.legs[0].oppEvents, getTeamName(), oppLabel, "Jogo único")
    : h.legs.map((leg, i) =>
        sumulaHtml(leg.userEvents, leg.oppEvents, getTeamName(), oppLabel, i===0 ? "Jogo 1 (Ida)" : "Jogo 2 (Volta)")
      ).join("");
  const penHtml = h.penalties ? penaltiesSumulaHtml(h.penalties, getTeamName(), oppLabel) : "";
  return legsHtml + penHtml;
}

/* Monta o HTML da súmula (autores dos gols + minutagem) de uma partida,
   combinando os gols dos dois times numa única linha do tempo. */
function sumulaHtml(userEvents, oppEvents, userTeamName, oppTeamName, title){
  const combined = [
    ...userEvents.map(e => ({...e, team:userTeamName, mine:true})),
    ...oppEvents.map(e => ({...e, team:oppTeamName, mine:false})),
  ].sort((a,b) => a.minute - b.minute);

  const body = combined.length
    ? combined.map(e => `
        <div class="sumula-event ${e.mine?"mine":"their"}">
          <span class="sumula-min">${formatMatchMinute(e.minute)}'</span>
          <span class="sumula-ball">⚽</span>
          <span class="sumula-name">${e.name}</span>
          <span class="sumula-team">${e.team}</span>
        </div>`).join("")
    : `<div class="sumula-empty">0x0 — ninguém balançou as redes.</div>`;

  return `
    <div class="sumula">
      <div class="sumula-title">📋 Súmula${title?` — ${title}`:""}</div>
      <div class="sumula-list">${body}</div>
    </div>`;
}

function narrativeHtml(messages){
  if(!messages || !messages.length) return "";
  return `<div class="match-narrative"><div class="match-narrative-title">🎙️ Como foi o jogo</div>${messages.map(m=>`<div class="match-narrative-line">${m}</div>`).join("")}</div>`;
}

function bracketHeaderHtml(){
  const doneIdx = cup.roundHistory.length;
  const steps = ROUND_NAMES.map((name, idx) => {
    if(idx < doneIdx){
      const h = cup.roundHistory[idx];
      const cls = h.advanced ? "won" : "lost";
      const pen = h.penalties ? ` <span class="pen-tag">pên. ${h.penalties.userScore}-${h.penalties.oppScore}</span>` : "";
      return `<div class="bstep ${cls}">
        <div class="bstep-name">${name}</div>
        <div class="bstep-score">${scoreStr(h.aggUser,h.aggOpp)}${pen}</div>
        <div class="bstep-opp">${h.opponent.team} ${h.opponent.year}</div>
      </div>`;
    }
    const isActive = idx === cup.roundIdx && (cup.status==="ready"||cup.status==="played");
    return `<div class="bstep${isActive?" active":""}">
      <div class="bstep-name">${name}</div>
      <div class="bstep-score dash">—</div>
    </div>`;
  }).join(`<div class="bstep-arrow">›</div>`);
  return `<div class="bracket-row">${steps}</div>`;
}

function venueTagHtml(stadium, userHome){
  const who = userHome===null ? "Estádio neutro · sem vantagem" : (userHome ? `${getTeamName()} manda o jogo` : `${currentOpponent().team} manda o jogo`);
  return `<div class="venue-tag">🏟️ ${stadium.name} <span class="venue-city">(${stadium.city})</span><div class="venue-who">${who}</div></div>`;
}

function renderCupScreen(){
  const card = document.getElementById("draftCard");
  const opp = currentOpponent();

  if(cup.status === "champion" || cup.status === "runnerup"){
    const champ = cup.status === "champion";
    const finalHist = cup.roundHistory[3];
    card.innerHTML = `
      ${bracketHeaderHtml()}
      <div class="final-panel cup-result ${champ?"champion":"runnerup"}">
        <div class="trophy">${champ?"🏆":"🥈"}</div>
        <h2>${champ ? "CAMPEÃO DA COPA DO BRASIL!" : "Vice-campeão"}</h2>
        <p>${champ
          ? `${getTeamName()} venceu a final ${scoreStr(finalHist.aggUser,finalHist.aggOpp)}${finalHist.penalties?` (pênaltis ${finalHist.penalties.userScore}-${finalHist.penalties.oppScore})`:""} contra ${finalHist.opponent.team} ${finalHist.opponent.year}, em ${finalHist.stadium.name}.`
          : `${getTeamName()} perdeu a final ${scoreStr(finalHist.aggUser,finalHist.aggOpp)}${finalHist.penalties?` (pênaltis ${finalHist.penalties.userScore}-${finalHist.penalties.oppScore})`:""} para ${finalHist.opponent.team} ${finalHist.opponent.year}, em ${finalHist.stadium.name}.`}
        </p>
        ${legsSumulaHtml(finalHist)}
        ${narrativeHtml(finalHist.narrative)}
        <div class="controls" style="justify-content:center;">
          <button class="action primary" onclick="openShareCard()">📲 Compartilhar campanha</button>
          <button class="action" onclick="restartGame()">Montar nova seleção</button>
        </div>
      </div>
    `;
    return;
  }

  if(cup.status === "eliminated"){
    const h = cup.roundHistory[cup.roundHistory.length-1];
    card.innerHTML = `
      ${bracketHeaderHtml()}
      <div class="final-panel cup-result eliminated">
        <div class="trophy">😔</div>
        <h2>Eliminado nas ${ROUND_NAMES[h.roundIdx]}</h2>
        <p>${getTeamName()} caiu diante de ${h.opponent.team} ${h.opponent.year} (overall ${h.opponent._ovr}), agregado ${scoreStr(h.aggUser,h.aggOpp)}${h.penalties?` — pênaltis ${h.penalties.userScore}-${h.penalties.oppScore}`:""}.</p>
        ${legsSumulaHtml(h)}
        ${narrativeHtml(h.narrative)}
        <div class="controls" style="justify-content:center;">
          <button class="action primary" onclick="openShareCard()">📲 Compartilhar campanha</button>
          <button class="action" onclick="restartGame()">Montar nova seleção</button>
        </div>
      </div>
    `;
    return;
  }

  if(cup.status === "roundOver"){
    const h = cup.roundHistory[cup.roundHistory.length-1];
    card.innerHTML = `
      ${bracketHeaderHtml()}
      <div class="final-panel cup-result advanced">
        <div class="trophy">✅</div>
        <h2>Classificado!</h2>
        <p>${getTeamName()} superou ${h.opponent.team} ${h.opponent.year}, agregado ${scoreStr(h.aggUser,h.aggOpp)}${h.penalties?` — pênaltis ${h.penalties.userScore}-${h.penalties.oppScore}`:""}.</p>
        ${legsSumulaHtml(h)}
        ${narrativeHtml(h.narrative)}
        <div class="controls" style="justify-content:center;">
          <button class="action primary" onclick="proceedNextRound()">Avançar para ${ROUND_NAMES[cup.roundIdx]}</button>
        </div>
      </div>
    `;
    return;
  }

  const legLabel = isFinalRound() ? "Jogo único" : (cup.legIdx===0 ? "Jogo 1 de 2 (Ida)" : "Jogo 2 de 2 (Volta)");

  if(cup.status === "playing"){
    const r = cup.lastLegResult;
    const live = cup.live;
    const homeIsUser = r.userHome !== false;
    const homeName = homeIsUser ? getTeamName() : opp.team+"("+opp.year+")";
    const awayName = homeIsUser ? opp.team+"("+opp.year+")" : getTeamName();
    const homeGoals = homeIsUser ? live.userGoals : live.oppGoals;
    const awayGoals = homeIsUser ? live.oppGoals : live.userGoals;
    const pct = Math.min(100, Math.round((live.minute/MATCH_END_MINUTE)*100));
    const liveMinuteLabel = formatMatchMinute(live.minute);
    const liveEventsHtml = live.revealed.length
      ? live.revealed.map(e => `
          <div class="sumula-event ${e.mine?"mine":"their"}">
            <span class="sumula-min">${formatMatchMinute(e.minute)}'</span>
            <span class="sumula-ball">⚽</span>
            <span class="sumula-name">${e.name}</span>
            <span class="sumula-team">${e.mine?getTeamName():opp.team+"("+opp.year+")"}</span>
          </div>`).join("")
      : `<div class="sumula-empty">Bola rolando, ninguém balançou as redes ainda…</div>`;

    card.innerHTML = `
      ${bracketHeaderHtml()}
      <div class="match-center">
        <div class="round-title">${ROUND_NAMES[cup.roundIdx]} · ${legLabel}</div>
        ${venueTagHtml(r.stadium, r.userHome)}
        <div class="live-clock">
          <span class="live-dot"></span>
          <span class="live-minute">${liveMinuteLabel}'</span>
          <div class="live-bar"><div class="live-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="vs-box">
          <div class="vs-team"><div class="vs-name">${homeName}</div></div>
          <div class="vs-score">${homeGoals} <span>x</span> ${awayGoals}</div>
          <div class="vs-team"><div class="vs-name">${awayName}</div></div>
        </div>
        <div class="sumula">
          <div class="sumula-title">📋 Súmula ao vivo</div>
          <div class="sumula-list">${liveEventsHtml}</div>
        </div>
        <div class="controls" style="justify-content:center;">
          <button class="action" onclick="skipLiveMatch()">⏭️ Pular pro resultado</button>
        </div>
      </div>
    `;
    return;
  }

  if(cup.status === "played"){
    const r = cup.lastLegResult;
    let aggNote = "";
    if(!isFinalRound() && cup.legIdx===1){
      const aggU = cup.legResults[0].userGoals + cup.legResults[1].userGoals;
      const aggO = cup.legResults[0].oppGoals + cup.legResults[1].oppGoals;
      aggNote = `
        <div class="agg-label">Agregado</div>
        <div class="agg-box">
          <div class="agg-team">${getTeamName()}</div>
          <div class="agg-score">${aggU} <span>x</span> ${aggO}</div>
          <div class="agg-team">${opp.team}(${opp.year})</div>
        </div>
        ${aggU===aggO? `<div class="agg-tie-note">Agregado empatado · vai pra pênaltis</div>` : ""}
      `;
    }
    const homeTeamName = r.userHome===false ? opp.team+"("+opp.year+")" : getTeamName();
    const awayTeamName = r.userHome===false ? getTeamName() : opp.team+"("+opp.year+")";
    const homeGoals = r.userHome===false ? r.oppGoals : r.userGoals;
    const awayGoals = r.userHome===false ? r.userGoals : r.oppGoals;
    card.innerHTML = `
      ${bracketHeaderHtml()}
      <div class="match-center">
        <div class="round-title">${ROUND_NAMES[cup.roundIdx]} · ${legLabel}</div>
        ${venueTagHtml(r.stadium, r.userHome)}
        <div class="vs-box">
          <div class="vs-team"><div class="vs-name">${homeTeamName}</div></div>
          <div class="vs-score">${homeGoals} <span>x</span> ${awayGoals}</div>
          <div class="vs-team"><div class="vs-name">${awayTeamName}</div></div>
        </div>
        ${aggNote}
        ${sumulaHtml(r.userEvents, r.oppEvents, getTeamName(), opp.team+"("+opp.year+")")}
        ${narrativeHtml(buildMatchNarrative(r, getTeamName(), opp.team+" ("+opp.year+")"))}
        <div class="controls" style="justify-content:center;">
          <button class="action primary" onclick="continueCup()">Continuar</button>
        </div>
      </div>
    `;
    return;
  }

  // status === "ready"
  const stadium = currentStadium();
  const userHome = currentLegIsUserHome();
  card.innerHTML = `
    ${bracketHeaderHtml()}
    <div class="match-center">
      <div class="round-title">${ROUND_NAMES[cup.roundIdx]} · ${legLabel}</div>
      <div class="team-note" style="text-align:center;margin-bottom:10px;">Adversário: <b>${opp.team} ${opp.vice?"vice":"campeão"} ${opp.year}</b> · Overall ${opp._ovr}</div>
      ${venueTagHtml(stadium, userHome)}
      <div class="vs-box">
        <div class="vs-team"><div class="vs-name">${userHome===false? opp.team+"("+opp.year+")" : getTeamName()}</div><div class="vs-ovr">${userHome===false? opp._ovr : cup.userOvr}</div></div>
        <div class="vs-score">?<span>x</span>?</div>
        <div class="vs-team"><div class="vs-name">${userHome===false? getTeamName() : opp.team+"("+opp.year+")"}</div><div class="vs-ovr">${userHome===false? cup.userOvr : opp._ovr}</div></div>
      </div>
      ${speedSelectHtml()}
      <div class="controls" style="justify-content:center;">
        <button class="action primary" onclick="playLeg()">Simular jogo</button>
      </div>
    </div>
  `;
}
