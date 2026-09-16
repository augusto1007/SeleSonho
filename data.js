/* ============================================================
   data.js — Elencos campeões da Copa do Brasil (1995–2025)

   FORMATO NOVO DE POSIÇÕES
   Todos os jogadores usam um ARRAY com as posições que podem ocupar,
   em ordem de prioridade. A primeira posição é a principal e é usada
   no cálculo do overall.

   Posições disponíveis:
   GOL, LD, LE, ZAG, VOL, MC, MD, ME, MEI, CA, PD, PE.

   Os antigos LAT e ATA foram fragmentados por lado e perfil.
   A conversão considera as posições secundárias já existentes e,
   quando a posição antiga era genérica, o perfil histórico/conhecido
   do jogador para evitar transformar todo ATA automaticamente em CA.
   ============================================================ */

const TEAMS = [
        // ============================================================
        // 1995
        // Corinthians - Campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 1995,
            players: [
                { n: "Ronaldo", p: ["GOL"], ovr: 78 },
                { n: "André Santos", p: ["LD","MD"], ovr: 72 },
                { n: "Célio Silva", p: ["ZAG"], ovr: 76 },
                { n: "Henrique", p: ["ZAG"], ovr: 75 },
                { n: "Sylvinho", p: ["LE","ME"], ovr: 73 },
                { n: "Zé Elias", p: ["VOL","MC"], ovr: 76 },
                { n: "Bernardo", p: ["VOL","MC"], ovr: 72 },
                { n: "Souza", p: ["MC","VOL"], ovr: 74 },
                { n: "Marcelinho Carioca", p: ["MEI","MD","PD"], ovr: 86 },
                { n: "Viola", p: ["CA","MEI","PE"], ovr: 79 },
                { n: "Marques", p: ["CA"], ovr: 74 }
            ]
        },

        // ============================================================
        // 1996
        // Cruzeiro - Campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 1996,
            players: [
                { n: "Dida", p: ["GOL"], ovr: 79 },
                { n: "Vítor", p: ["LD","MD"], ovr: 72 },
                { n: "Gélson Baresi", p: ["ZAG"], ovr: 75 },
                { n: "Célio Lúcio", p: ["ZAG"], ovr: 74 },
                { n: "Nonato", p: ["LE","ME"], ovr: 73 },
                { n: "Fabinho", p: ["MC","MEI"], ovr: 73 },
                { n: "Cleison", p: ["VOL","MC"], ovr: 72 },
                { n: "Ricardinho", p: ["MC","MEI"], ovr: 76 },
                { n: "Palhinha", p: ["CA","MEI"], ovr: 82 },
                { n: "Marcelo Ramos", p: ["CA"], ovr: 80 },
                { n: "Roberto Gaúcho", p: ["CA"], ovr: 78 }
            ]
        },

        // ============================================================
        // 1997
        // Grêmio - Campeão
        // ============================================================
        {
            team: "Grêmio",
            year: 1997,
            players: [
                { n: "Danrlei", p: ["GOL"], ovr: 80 },
                { n: "Arce", p: ["LD","MD"], ovr: 82 },
                { n: "Rivarola", p: ["ZAG"], ovr: 76 },
                { n: "Mauro Galvão", p: ["ZAG"], ovr: 84 },
                { n: "Roger", p: ["LE","ME","MD"], ovr: 77 },
                { n: "Otacílio", p: ["VOL","MC"], ovr: 73 },
                { n: "João Antônio", p: ["VOL","MC"], ovr: 72 },
                { n: "Émerson", p: ["MEI","MC"], ovr: 77 },
                { n: "Carlos Miguel", p: ["MC","MD"], ovr: 76 },
                { n: "Rodrigo Gral", p: ["CA"], ovr: 73 },
                { n: "Paulo Nunes", p: ["CA","PD","PE"], ovr: 84 }
            ]
        },

        // ============================================================
        // 1998
        // Palmeiras - Campeão
        // ============================================================
        {
            team: "Palmeiras",
            year: 1998,
            players: [
                { n: "Velloso", p: ["GOL"], ovr: 80 },
                { n: "Neném", p: ["LD","MD"], ovr: 73 },
                { n: "Cléber", p: ["ZAG"], ovr: 79 },
                { n: "Roque Júnior", p: ["ZAG"], ovr: 78 },
                { n: "Júnior", p: ["LE","ME","MEI"], ovr: 81 },
                { n: "Galeano", p: ["VOL"], ovr: 75 },
                { n: "Rogério", p: ["VOL","MC","MD"], ovr: 77 },
                { n: "Alex", p: ["MEI","MC"], ovr: 82 },
                { n: "Zinho", p: ["MEI","ME","MC"], ovr: 83 },
                { n: "Paulo Nunes", p: ["CA","PD","PE"], ovr: 85 },
                { n: "Oséas", p: ["CA"], ovr: 79 }
            ]
        },

        // ============================================================
        // 1999
        // Juventude - Campeão
        // ============================================================
        {
            team: "Juventude",
            year: 1999,
            players: [
                { n: "Émerson", p: ["GOL"], ovr: 74 },
                { n: "Marcos Teixeira", p: ["LD","MD"], ovr: 72 },
                { n: "Índio", p: ["ZAG"], ovr: 74 },
                { n: "Picolli", p: ["ZAG"], ovr: 73 },
                { n: "Dênis", p: ["LE","ME"], ovr: 72 },
                { n: "Roberto", p: ["VOL","MC"], ovr: 73 },
                { n: "Lauro", p: ["VOL","MC"], ovr: 72 },
                { n: "Flávio", p: ["MEI","MC"], ovr: 77 },
                { n: "Mabília", p: ["MEI","MD"], ovr: 76 },
                { n: "Maurílio", p: ["CA"], ovr: 74 },
                { n: "Márcio Mixirica", p: ["CA"], ovr: 78 }
            ]
        },

        // ============================================================
        // 2000
        // Cruzeiro - Campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 2000,
            players: [
                { n: "André", p: ["GOL"], ovr: 70 },
                { n: "Rodrigo", p: ["LD","MD"], ovr: 68 },
                { n: "Cris", p: ["ZAG"], ovr: 74 },
                { n: "Cléber", p: ["ZAG"], ovr: 70 },
                { n: "Sorín", p: ["LE","ME"], ovr: 76 },
                { n: "Donizete Oliveira", p: ["VOL"], ovr: 70 },
                { n: "Marcos Paulo", p: ["VOL","MC"], ovr: 68 },
                { n: "Ricardinho", p: ["MC","MEI"], ovr: 72 },
                { n: "Jackson", p: ["MEI","MD"], ovr: 68 },
                { n: "Geovanni", p: ["PD","MEI"], ovr: 76 },
                { n: "Oséas", p: ["CA"], ovr: 70 }
            ]
        },

        // ============================================================
        // 2001
        // Grêmio - Campeão
        // ============================================================
        {
            team: "Grêmio",
            year: 2001,
            players: [
                { n: "Danrlei", p: ["GOL"], ovr: 82 },
                { n: "Marinho", p: ["LD","MD"], ovr: 74 },
                { n: "Mauro Galvão", p: ["ZAG"], ovr: 82 },
                { n: "Polga", p: ["ZAG"], ovr: 75 },
                { n: "Anderson Lima", p: ["LE","ME"], ovr: 76 },
                { n: "Tinga", p: ["VOL"], ovr: 75 },
                { n: "Roger", p: ["VOL","MC"], ovr: 74 },
                { n: "Zinho", p: ["MEI","ME","MC"], ovr: 81 },
                { n: "Rubens Cardoso", p: ["MEI","MD"], ovr: 73 },
                { n: "Luiz Mário", p: ["CA"], ovr: 77 },
                { n: "Marcelinho Paraíba", p: ["MEI","PE","PD"], ovr: 83 }
            ]
        },

        // ============================================================
        // 2002
        // Corinthians - Campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2002,
            players: [
                { n: "Dida", p: ["GOL"], ovr: 83 },
                { n: "Rogério", p: ["LD","MD"], ovr: 74 },
                { n: "Anderson", p: ["ZAG"], ovr: 76 },
                { n: "Fábio Luciano", p: ["ZAG"], ovr: 78 },
                { n: "Kléber", p: ["LE","ME"], ovr: 78 },
                { n: "Vampeta", p: ["VOL","MC"], ovr: 83 },
                { n: "Fabrício", p: ["VOL","MC"], ovr: 73 },
                { n: "Ricardinho", p: ["MC","MEI"], ovr: 83 },
                { n: "Gil", p: ["PD","PE","MD","ME"], ovr: 77 },
                { n: "Leandro", p: ["CA","MEI"], ovr: 76 },
                { n: "Deivid", p: ["CA"], ovr: 84 }
            ]
        },

        // ============================================================
        // 2003
        // Cruzeiro - Campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 2003,
            players: [
                { n: "Gomes", p: ["GOL"], ovr: 77 },
                { n: "Maicon", p: ["LD","MD"], ovr: 76 },
                { n: "Cris", p: ["ZAG"], ovr: 80 },
                { n: "Luisão", p: ["ZAG"], ovr: 79 },
                { n: "Leandro", p: ["LE","ME"], ovr: 76 },
                { n: "Augusto Recife", p: ["VOL"], ovr: 73 },
                { n: "Maldonado", p: ["VOL","MC"], ovr: 78 },
                { n: "Zinho", p: ["MEI","ME","MC"], ovr: 80 },
                { n: "Alex", p: ["MEI","MC"], ovr: 87 },
                { n: "Deivid", p: ["CA"], ovr: 84 },
                { n: "Aristizábal", p: ["CA"], ovr: 82 }
            ]
        },

        // ============================================================
        // 2004
        // Santo André - Campeão
        // ============================================================
        {
            team: "Santo André",
            year: 2004,
            players: [
                { n: "Júlio César", p: ["GOL"], ovr: 72 },
                { n: "Nelsinho", p: ["LD","MD"], ovr: 69 },
                { n: "Alex", p: ["ZAG"], ovr: 70 },
                { n: "Gabriel", p: ["ZAG"], ovr: 70 },
                { n: "Dedimar", p: ["ZAG"], ovr: 69 },
                { n: "Dirceu", p: ["VOL"], ovr: 68 },
                { n: "Ramalho", p: ["VOL","MC"], ovr: 71 },
                { n: "Romerito", p: ["MEI","MC"], ovr: 73 },
                { n: "Elvis", p: ["MEI","MD"], ovr: 72 },
                { n: "Sandro Gaúcho", p: ["CA"], ovr: 75 },
                { n: "Osmar", p: ["CA"], ovr: 72 }
            ]
        },

        // ============================================================
        // 2005
        // Paulista - Campeão
        // ============================================================
        {
            team: "Paulista",
            year: 2005,
            players: [
                { n: "Rafael Bracali", p: ["GOL"], ovr: 73 },
                { n: "Lucas", p: ["LD","MD"], ovr: 70 },
                { n: "Réver", p: ["ZAG"], ovr: 73 },
                { n: "Dema", p: ["ZAG"], ovr: 70 },
                { n: "Julinho", p: ["LE","ME"], ovr: 69 },
                { n: "Fábio Gomes", p: ["VOL"], ovr: 70 },
                { n: "Márcio Mossoró", p: ["VOL","MC"], ovr: 76 },
                { n: "Juliano Spadacio", p: ["MEI","MC"], ovr: 71 },
                { n: "Cristian Baroni", p: ["MEI","MD"], ovr: 72 },
                { n: "André Leonel", p: ["CA"], ovr: 72 },
                { n: "Léo Aro", p: ["CA"], ovr: 73 }
            ]
        },

        // ============================================================
        // 2006
        // Flamengo - Campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2006,
            players: [
                { n: "Diego", p: ["GOL"], ovr: 73 },
                { n: "Leonardo Moura", p: ["LD","MD"], ovr: 77 },
                { n: "Renato Silva", p: ["ZAG"], ovr: 72 },
                { n: "Fernando", p: ["ZAG"], ovr: 73 },
                { n: "Juan", p: ["LE","ME"], ovr: 79 },
                { n: "Jônatas", p: ["VOL"], ovr: 75 },
                { n: "Toró", p: ["VOL","MC"], ovr: 69 },
                { n: "Renato Abreu", p: ["MEI","MC"], ovr: 79 },
                { n: "Renato Augusto", p: ["MEI","MC"], ovr: 76 },
                { n: "Luizão", p: ["CA"], ovr: 78 },
                { n: "Obina", p: ["CA"], ovr: 74 }
            ]
        },

        // ============================================================
        // 2007
        // Fluminense - Campeão
        // ============================================================
        {
            team: "Fluminense",
            year: 2007,
            players: [
                { n: "Fernando Henrique", p: ["GOL"], ovr: 75 },
                { n: "Carlinhos", p: ["LD","MD"], ovr: 72 },
                { n: "Thiago Silva", p: ["ZAG"], ovr: 82 },
                { n: "Luiz Alberto", p: ["ZAG"], ovr: 75 },
                { n: "Junior Cesar", p: ["LE","ME"], ovr: 76 },
                { n: "Fabinho", p: ["MC","MEI"], ovr: 74 },
                { n: "Arouca", p: ["VOL","MC"], ovr: 76 },
                { n: "Cícero", p: ["MEI","MC"], ovr: 77 },
                { n: "Carlos Alberto", p: ["MEI","MD","MC"], ovr: 79 },
                { n: "Alex Dias", p: ["CA"], ovr: 76 },
                { n: "Adriano Magrão", p: ["CA"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2008
        // Sport - Campeão
        // ============================================================
        {
            team: "Sport",
            year: 2008,
            players: [
                { n: "Magrão", p: ["GOL"], ovr: 77 },
                { n: "Diogo", p: ["LD","MD"], ovr: 72 },
                { n: "Igor", p: ["ZAG"], ovr: 74 },
                { n: "Durval", p: ["ZAG"], ovr: 78 },
                { n: "Dutra", p: ["LE","ME"], ovr: 73 },
                { n: "Daniel Paulista", p: ["VOL"], ovr: 75 },
                { n: "Sandro Goiano", p: ["VOL","MC"], ovr: 75 },
                { n: "Kássio", p: ["MEI","MC"], ovr: 71 },
                { n: "Luciano Henrique", p: ["MEI","MD"], ovr: 77 },
                { n: "Carlinhos Bala", p: ["PD","PE"], ovr: 80 },
                { n: "Leandro Machado", p: ["CA"], ovr: 73 }
            ]
        },

        // ============================================================
        // 2009
        // Corinthians - Campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2009,
            players: [
                { n: "Felipe", p: ["GOL"], ovr: 78 },
                { n: "Alessandro", p: ["LD","MD"], ovr: 76 },
                { n: "Chicão", p: ["ZAG"], ovr: 80 },
                { n: "William", p: ["ZAG"], ovr: 79 },
                { n: "Marcelo Oliveira", p: ["LE","ME"], ovr: 71 },
                { n: "Cristian", p: ["VOL"], ovr: 79 },
                { n: "Elias", p: ["VOL","MC"], ovr: 81 },
                { n: "Douglas", p: ["MEI","MC"], ovr: 80 },
                { n: "Jorge Henrique", p: ["PD","PE","MEI"], ovr: 78 },
                { n: "Ronaldo", p: ["CA"], ovr: 90 },
                { n: "Dentinho", p: ["PE","PD","MEI"], ovr: 77 }
            ]
        },

        // ============================================================
        // 2010
        // Santos - Campeão
        // ============================================================
        {
            team: "Santos",
            year: 2010,
            players: [
                { n: "Rafael", p: ["GOL"], ovr: 74 },
                { n: "Pará", p: ["LD","MD"], ovr: 73 },
                { n: "Edu Dracena", p: ["ZAG"], ovr: 77 },
                { n: "Durval", p: ["ZAG"], ovr: 78 },
                { n: "Alex Sandro", p: ["LE","ME"], ovr: 76 },
                { n: "Arouca", p: ["VOL"], ovr: 79 },
                { n: "Wesley", p: ["VOL","MC"], ovr: 78 },
                { n: "Paulo Henrique Ganso", p: ["MEI","MC"], ovr: 86 },
                { n: "Robinho", p: ["MEI","MD","ME"], ovr: 85 },
                { n: "André", p: ["CA"], ovr: 78 },
                { n: "Neymar", p: ["PE","MEI","PD"], ovr: 90 }
            ]
        },

        // ============================================================
        // 2011
        // Vasco - Campeão
        // ============================================================
        {
            team: "Vasco",
            year: 2011,
            players: [
                { n: "Fernando Prass", p: ["GOL"], ovr: 80 },
                { n: "Allan", p: ["LD","MD"], ovr: 74 },
                { n: "Dedé", p: ["ZAG"], ovr: 84 },
                { n: "Anderson Martins", p: ["ZAG"], ovr: 77 },
                { n: "Ramon", p: ["LE","ME"], ovr: 76 },
                { n: "Rômulo", p: ["VOL"], ovr: 79 },
                { n: "Eduardo Costa", p: ["VOL","MC"], ovr: 75 },
                { n: "Felipe", p: ["MEI","MD","ME"], ovr: 82 },
                { n: "Diego Souza", p: ["CA","MEI"], ovr: 82 },
                { n: "Eder Luis", p: ["PD","PE"], ovr: 78 },
                { n: "Alecsandro", p: ["CA"], ovr: 80 }
            ]
        },

        // ============================================================
        // 2012
        // Palmeiras - Campeão
        // ============================================================
        {
            team: "Palmeiras",
            year: 2012,
            players: [
                { n: "Bruno", p: ["GOL"], ovr: 75 },
                { n: "Artur", p: ["LD","MD"], ovr: 72 },
                { n: "Maurício Ramos", p: ["ZAG"], ovr: 77 },
                { n: "Thiago Heleno", p: ["ZAG"], ovr: 78 },
                { n: "Juninho", p: ["LE","ME"], ovr: 76 },
                { n: "Henrique", p: ["VOL","MC"], ovr: 78 },
                { n: "João Vitor", p: ["VOL","MC"], ovr: 73 },
                { n: "Marcos Assunção", p: ["MEI","MC"], ovr: 83 },
                { n: "Valdivia", p: ["MEI","MD"], ovr: 84 },
                { n: "Mazinho", p: ["PD","PE","MEI"], ovr: 76 },
                { n: "Betinho", p: ["CA"], ovr: 73 }
            ]
        },

        // ============================================================
        // 2013
        // Flamengo - Campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2013,
            players: [
                { n: "Felipe", p: ["GOL"], ovr: 77 },
                { n: "Léo Moura", p: ["LD","MD"], ovr: 79 },
                { n: "Chicão", p: ["ZAG"], ovr: 78 },
                { n: "Wallace", p: ["ZAG"], ovr: 75 },
                { n: "André Santos", p: ["LE","ME"], ovr: 77 },
                { n: "Amaral", p: ["VOL","MC"], ovr: 71 },
                { n: "Elias", p: ["VOL","MC"], ovr: 81 },
                { n: "Carlos Eduardo", p: ["MEI","MC"], ovr: 75 },
                { n: "Luiz Antônio", p: ["MEI","MD"], ovr: 73 },
                { n: "Paulinho", p: ["CA","MEI","PE"], ovr: 77 },
                { n: "Hernane", p: ["CA"], ovr: 82 }
            ]
        },

        // ============================================================
        // 2014
        // Atlético-MG - Campeão
        // ============================================================
        {
            team: "Atlético-MG",
            year: 2014,
            players: [
                { n: "Victor", p: ["GOL"], ovr: 85 },
                { n: "Marcos Rocha", p: ["LD","MD"], ovr: 82 },
                { n: "Jemerson", p: ["ZAG"], ovr: 77 },
                { n: "Leonardo Silva", p: ["ZAG"], ovr: 81 },
                { n: "Douglas Santos", p: ["LE","ME"], ovr: 76 },
                { n: "Leandro Donizete", p: ["VOL","MC"], ovr: 79 },
                { n: "Rafael Carioca", p: ["VOL","MC"], ovr: 78 },
                { n: "Dátolo", p: ["MEI","MC"], ovr: 82 },
                { n: "Luan", p: ["MEI","PE","PD"], ovr: 80 },
                { n: "Carlos", p: ["CA"], ovr: 74 },
                { n: "Diego Tardelli", p: ["CA"], ovr: 87 }
            ]
        },

        // ============================================================
        // 2015
        // Palmeiras - Campeão
        // ============================================================
        {
            team: "Palmeiras",
            year: 2015,
            players: [
                { n: "Fernando Prass", p: ["GOL"], ovr: 82 },
                { n: "Lucas", p: ["LD","MD"], ovr: 71 },
                { n: "Vitor Hugo", p: ["ZAG"], ovr: 78 },
                { n: "Jackson", p: ["ZAG"], ovr: 73 },
                { n: "Zé Roberto", p: ["LE","ME"], ovr: 82 },
                { n: "Arouca", p: ["VOL"], ovr: 80 },
                { n: "Amaral", p: ["VOL","MC"], ovr: 72 },
                { n: "Robinho", p: ["MEI","MD","ME"], ovr: 75 },
                { n: "Dudu", p: ["PD","PE","MEI"], ovr: 82 },
                { n: "Gabriel Jesus", p: ["CA","PE","PD"], ovr: 78 },
                { n: "Lucas Barrios", p: ["CA"], ovr: 82 }
            ]
        },

        // ============================================================
        // 2016
        // Grêmio - Campeão
        // ============================================================
        {
            team: "Grêmio",
            year: 2016,
            players: [
                { n: "Marcelo Grohe", p: ["GOL"], ovr: 83 },
                { n: "Edílson", p: ["LD","MD"], ovr: 76 },
                { n: "Pedro Geromel", p: ["ZAG"], ovr: 84 },
                { n: "Walter Kannemann", p: ["ZAG"], ovr: 82 },
                { n: "Marcelo Oliveira", p: ["LE","ME"], ovr: 73 },
                { n: "Maicon", p: ["VOL","MC"], ovr: 82 },
                { n: "Walace", p: ["VOL","MC"], ovr: 78 },
                { n: "Ramiro", p: ["MC","MD"], ovr: 78 },
                { n: "Douglas", p: ["MEI","MC"], ovr: 81 },
                { n: "Pedro Rocha", p: ["PE","PD","MEI"], ovr: 79 },
                { n: "Luan", p: ["MEI","PE","PD"], ovr: 87 }
            ]
        },

        // ============================================================
        // 2017
        // Cruzeiro - Campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 2017,
            players: [
                { n: "Fábio", p: ["GOL"], ovr: 84 },
                { n: "Ezequiel", p: ["LD","MD"], ovr: 73 },
                { n: "Léo", p: ["ZAG"], ovr: 78 },
                { n: "Murilo", p: ["ZAG"], ovr: 74 },
                { n: "Diogo Barbosa", p: ["LE","ME"], ovr: 79 },
                { n: "Henrique", p: ["VOL","MC"], ovr: 80 },
                { n: "Hudson", p: ["VOL","MC"], ovr: 77 },
                { n: "Robinho", p: ["MEI","MD","ME"], ovr: 79 },
                { n: "Thiago Neves", p: ["MEI","MC"], ovr: 85 },
                { n: "Alisson", p: ["PD","PE","MEI"], ovr: 78 },
                { n: "Rafinha", p: ["MEI","MD","ME"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2018
        // Cruzeiro - Campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 2018,
            players: [
                { n: "Fábio", p: ["GOL"], ovr: 86 },
                { n: "Edílson", p: ["LD","MD"], ovr: 77 },
                { n: "Dedé", p: ["ZAG"], ovr: 84 },
                { n: "Léo", p: ["ZAG"], ovr: 80 },
                { n: "Egídio", p: ["LE","ME"], ovr: 78 },
                { n: "Henrique", p: ["VOL","MC"], ovr: 79 },
                { n: "Lucas Silva", p: ["VOL","MC"], ovr: 78 },
                { n: "Robinho", p: ["MEI","MD","ME"], ovr: 80 },
                { n: "Thiago Neves", p: ["MEI","MC"], ovr: 86 },
                { n: "Barcos", p: ["CA"], ovr: 79 },
                { n: "Raniel", p: ["CA"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2019
        // Athletico-PR - Campeão
        // ============================================================
        {
            team: "Athletico-PR",
            year: 2019,
            players: [
                { n: "Santos", p: ["GOL"], ovr: 80 },
                { n: "Khellven", p: ["LD","MD"], ovr: 72 },
                { n: "Léo Pereira", p: ["ZAG"], ovr: 80 },
                { n: "Robson Bambu", p: ["ZAG"], ovr: 73 },
                { n: "Márcio Azevedo", p: ["LE","ME"], ovr: 77 },
                { n: "Wellington", p: ["VOL","MC"], ovr: 77 },
                { n: "Bruno Guimarães", p: ["MC","VOL"], ovr: 84 },
                { n: "Lucho González", p: ["MC","MEI"], ovr: 80 },
                { n: "Nikão", p: ["MEI","MD","ME"], ovr: 82 },
                { n: "Rony", p: ["PE","PD","CA"], ovr: 82 },
                { n: "Marco Ruben", p: ["CA"], ovr: 81 }
            ]
        },

        // ============================================================
        // 2020
        // Palmeiras - Campeão
        // ============================================================
        {
            team: "Palmeiras",
            year: 2020,
            players: [
                { n: "Weverton", p: ["GOL"], ovr: 87 },
                { n: "Marcos Rocha", p: ["LD","MD"], ovr: 82 },
                { n: "Luan", p: ["ZAG"], ovr: 78 },
                { n: "Gustavo Gómez", p: ["ZAG"], ovr: 86 },
                { n: "Viña", p: ["LE","ME"], ovr: 81 },
                { n: "Zé Rafael", p: ["MC","VOL"], ovr: 82 },
                { n: "Patrick de Paula", p: ["VOL","MC"], ovr: 78 },
                { n: "Raphael Veiga", p: ["MEI","MC"], ovr: 80 },
                { n: "Rony", p: ["PE","PD","CA"], ovr: 82 },
                { n: "Luiz Adriano", p: ["CA","MEI"], ovr: 84 },
                { n: "Wesley", p: ["PD","PE","ME","MD"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2021
        // Atlético-MG - Campeão
        // ============================================================
        {
            team: "Atlético-MG",
            year: 2021,
            players: [
                { n: "Everson", p: ["GOL"], ovr: 84 },
                { n: "Mariano", p: ["LD","MD"], ovr: 79 },
                { n: "Júnior Alonso", p: ["ZAG"], ovr: 85 },
                { n: "Nathan Silva", p: ["ZAG"], ovr: 77 },
                { n: "Guilherme Arana", p: ["LE","ME","MEI"], ovr: 84 },
                { n: "Jair", p: ["VOL","MC"], ovr: 81 },
                { n: "Allan", p: ["VOL","MC"], ovr: 80 },
                { n: "Zaracho", p: ["MC","MEI"], ovr: 82 },
                { n: "Nacho Fernández", p: ["MEI","MC"], ovr: 86 },
                { n: "Keno", p: ["PE","PD","MEI"], ovr: 82 },
                { n: "Hulk", p: ["CA","MEI"], ovr: 90 }
            ]
        },

        // ============================================================
        // 2022
        // Flamengo - Campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2022,
            players: [
                { n: "Santos", p: ["GOL"], ovr: 84 },
                { n: "Rodinei", p: ["LD","MD"], ovr: 81 },
                { n: "David Luiz", p: ["ZAG"], ovr: 83 },
                { n: "Léo Pereira", p: ["ZAG"], ovr: 82 },
                { n: "Filipe Luís", p: ["LE","ME"], ovr: 83 },
                { n: "João Gomes", p: ["VOL","MC"], ovr: 81 },
                { n: "Thiago Maia", p: ["VOL","MC"], ovr: 80 },
                { n: "Everton Ribeiro", p: ["MEI","MD","MC"], ovr: 85 },
                { n: "De Arrascaeta", p: ["MEI","ME","MC"], ovr: 90 },
                { n: "Pedro", p: ["CA"], ovr: 88 },
                { n: "Gabriel Barbosa", p: ["CA","MEI"], ovr: 86 }
            ]
        },

        // ============================================================
        // 2023
        // São Paulo - Campeão
        // ============================================================
        {
            team: "São Paulo",
            year: 2023,
            players: [
                { n: "Rafael", p: ["GOL"], ovr: 82 },
                { n: "Rafinha", p: ["LD","MD"], ovr: 80 },
                { n: "Arboleda", p: ["ZAG"], ovr: 82 },
                { n: "Beraldo", p: ["ZAG"], ovr: 78 },
                { n: "Wellington", p: ["LE","ME"], ovr: 77 },
                { n: "Pablo Maia", p: ["VOL","MC"], ovr: 80 },
                { n: "Alisson", p: ["MC","VOL"], ovr: 78 },
                { n: "Wellington Rato", p: ["MEI","MD","ME"], ovr: 77 },
                { n: "Lucas Moura", p: ["PD","MEI","MD"], ovr: 84 },
                { n: "Luciano", p: ["CA","MEI"], ovr: 83 },
                { n: "Calleri", p: ["CA"], ovr: 85 }
            ]
        },

        // ============================================================
        // 2024
        // Flamengo - Campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2024,
            players: [
                { n: "Rossi", p: ["GOL"], ovr: 86 },
                { n: "Wesley", p: ["LD","MD"], ovr: 80 },
                { n: "Léo Ortiz", p: ["ZAG"], ovr: 84 },
                { n: "Léo Pereira", p: ["ZAG"], ovr: 84 },
                { n: "Alex Sandro", p: ["LE","ME"], ovr: 82 },
                { n: "Erick Pulgar", p: ["VOL"], ovr: 82 },
                { n: "Gerson", p: ["VOL","MC"], ovr: 84 },
                { n: "De Arrascaeta", p: ["MEI","ME","MC"], ovr: 90 },
                { n: "Gonzalo Plata", p: ["PD","MEI","PE"], ovr: 79 },
                { n: "Michael", p: ["PE","PD","MEI"], ovr: 81 },
                { n: "Bruno Henrique", p: ["PE","PD","CA"], ovr: 84 }
            ]
        },

        // ============================================================
        // 2025
        // Corinthians - Campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2025,
            players: [
                { n: "Hugo Souza", p: ["GOL"], ovr: 82 },
                { n: "Matheuzinho", p: ["LD","MD"], ovr: 78 },
                { n: "André Ramalho", p: ["ZAG"], ovr: 79 },
                { n: "Gustavo Henrique", p: ["ZAG"], ovr: 77 },
                { n: "Matheus Bidu", p: ["LE","ME"], ovr: 74 },
                { n: "Raniele", p: ["VOL","MC"], ovr: 77 },
                { n: "José Martínez", p: ["VOL","MC"], ovr: 79 },
                { n: "Rodrigo Garro", p: ["MEI","MC"], ovr: 84 },
                { n: "Memphis Depay", p: ["CA","MEI"], ovr: 86 },
                { n: "Yuri Alberto", p: ["CA"], ovr: 82 },
                { n: "André Carrillo", p: ["PD","PE","MD","ME"], ovr: 79 }
            ]
        },

        // ============================================================
        // VICE-CAMPEÕES — 1995 A 2025
        // ============================================================
        // ============================================================
        // 1995
        // Grêmio - Vice-campeão
        // ============================================================
        {
            team: "Grêmio",
            year: 1995,
            vice: true,
            players: [
                { n: "Danrlei", p: ["GOL"], ovr: 80 },
                { n: "Arce", p: ["LD","MD"], ovr: 82 },
                { n: "Adílson", p: ["ZAG"], ovr: 78 },
                { n: "Rivarola", p: ["ZAG"], ovr: 76 },
                { n: "Carlos Miguel", p: ["MC","MD"], ovr: 76 },
                { n: "Dinho", p: ["VOL","MC"], ovr: 80 },
                { n: "Gélson", p: ["VOL","MC"], ovr: 75 },
                { n: "Luís Carlos Goiano", p: ["MC","MEI"], ovr: 76 },
                { n: "Arílson", p: ["MC","MEI"], ovr: 74 },
                { n: "Paulo Nunes", p: ["CA","PD","PE"], ovr: 84 },
                { n: "Jardel", p: ["CA"], ovr: 86 }
            ]
        },

        // ============================================================
        // 1996
        // Palmeiras - Vice-campeão
        // ============================================================
        {
            team: "Palmeiras",
            year: 1996,
            vice: true,
            players: [
                { n: "Velloso", p: ["GOL"], ovr: 80 },
                { n: "Cafu", p: ["LD","MD"], ovr: 84 },
                { n: "Sandro", p: ["ZAG"], ovr: 76 },
                { n: "Cléber", p: ["ZAG"], ovr: 79 },
                { n: "Júnior", p: ["LE","ME","MEI"], ovr: 81 },
                { n: "Cláudio", p: ["VOL","MC"], ovr: 74 },
                { n: "Amaral", p: ["VOL","MC"], ovr: 77 },
                { n: "Marquinhos", p: ["MEI","MD"], ovr: 75 },
                { n: "Djalminha", p: ["MEI","MD","MC"], ovr: 88 },
                { n: "Luizão", p: ["CA"], ovr: 84 },
                { n: "Rivaldo", p: ["PE","MEI","ME"], ovr: 87 }
            ]
        },

        // ============================================================
        // 1997
        // Flamengo - Vice-campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 1997,
            vice: true,
            players: [
                { n: "Zé Carlos", p: ["PD","CA"], ovr: 76 },
                { n: "Fábio Baiano", p: ["MEI","MD"], ovr: 75 },
                { n: "Júnior Baiano", p: ["ZAG"], ovr: 80 },
                { n: "Fabiano", p: ["ZAG"], ovr: 74 },
                { n: "Athirson", p: ["LE","ME"], ovr: 77 },
                { n: "Jamir", p: ["VOL","MC"], ovr: 73 },
                { n: "Maurinho", p: ["LD","MD"], ovr: 72 },
                { n: "Evandro", p: ["MC","MEI"], ovr: 74 },
                { n: "Nélio", p: ["MEI","ME"], ovr: 76 },
                { n: "Romário", p: ["CA","MEI"], ovr: 91 },
                { n: "Sávio", p: ["PE","PD","MEI"], ovr: 82 }
            ]
        },

        // ============================================================
        // 1998
        // Cruzeiro - Vice-campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 1998,
            vice: true,
            players: [
                { n: "Paulo César", p: ["GOL"], ovr: 76 },
                { n: "Gustavo", p: ["LD","MD"], ovr: 74 },
                { n: "Marcelo Djian", p: ["ZAG"], ovr: 79 },
                { n: "Wilson Gottardo", p: ["ZAG"], ovr: 77 },
                { n: "Gilberto", p: ["LE","ME"], ovr: 76 },
                { n: "Valdir Benedito", p: ["VOL"], ovr: 73 },
                { n: "Ricardinho", p: ["MC","MEI"], ovr: 78 },
                { n: "Marcos Paulo", p: ["MEI","MC"], ovr: 75 },
                { n: "Elivélton", p: ["MEI","MD"], ovr: 77 },
                { n: "Bentinho", p: ["CA","MEI"], ovr: 76 },
                { n: "Marcelo Ramos", p: ["CA"], ovr: 82 }
            ]
        },

        // ============================================================
        // 1999
        // Botafogo - Vice-campeão
        // ============================================================
        {
            team: "Botafogo",
            year: 1999,
            vice: true,
            players: [
                { n: "Wagner", p: ["GOL"], ovr: 75 },
                { n: "Fábio Augusto", p: ["LD","MD"], ovr: 73 },
                { n: "Jorge Luiz", p: ["ZAG"], ovr: 74 },
                { n: "Bandoch", p: ["ZAG"], ovr: 72 },
                { n: "César Prates", p: ["LD","MD"], ovr: 78 },
                { n: "Júnior", p: ["VOL","MC"], ovr: 74 },
                { n: "Reidner", p: ["VOL","MC"], ovr: 72 },
                { n: "Caio", p: ["CA","MEI"], ovr: 77 },
                { n: "Sérgio Manoel", p: ["MC","MEI"], ovr: 82 },
                { n: "Zé Carlos", p: ["PD","CA"], ovr: 78 },
                { n: "Bebeto", p: ["CA","MEI"], ovr: 85 }
            ]
        },

        // ============================================================
        // 2000
        // São Paulo - Vice-campeão
        // ============================================================
        {
            team: "São Paulo",
            year: 2000,
            vice: true,
            players: [
                { n: "Rogério Ceni", p: ["GOL"], ovr: 84 },
                { n: "Belletti", p: ["LD","MD","MC"], ovr: 77 },
                { n: "Edmílson", p: ["ZAG","VOL"], ovr: 82 },
                { n: "Rogério Pinheiro", p: ["ZAG"], ovr: 76 },
                { n: "Fábio Aurélio", p: ["LE","ME","MC"], ovr: 78 },
                { n: "Alexandre", p: ["VOL","MC"], ovr: 72 },
                { n: "Maldonado", p: ["VOL","MC"], ovr: 79 },
                { n: "Raí", p: ["MEI","MC"], ovr: 86 },
                { n: "Edu", p: ["MEI","MC"], ovr: 77 },
                { n: "Marcelinho Paraíba", p: ["MEI","PE","PD"], ovr: 84 },
                { n: "França", p: ["CA"], ovr: 86 }
            ]
        },

        // ============================================================
        // 2001
        // Corinthians - Vice-campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2001,
            vice: true,
            players: [
                { n: "Maurício", p: ["GOL"], ovr: 75 },
                { n: "Rogério", p: ["LD","MD"], ovr: 76 },
                { n: "João Carlos", p: ["ZAG"], ovr: 77 },
                { n: "Scheidt", p: ["ZAG"], ovr: 76 },
                { n: "Kléber", p: ["LE","ME"], ovr: 80 },
                { n: "Otacílio", p: ["VOL","MC"], ovr: 74 },
                { n: "Marcos Senna", p: ["VOL","MC"], ovr: 76 },
                { n: "Ricardinho", p: ["MC","MEI"], ovr: 84 },
                { n: "Marcelinho Carioca", p: ["MEI","MD","ME"], ovr: 86 },
                { n: "Ewerthon", p: ["PD","MD"], ovr: 78 },
                { n: "Müller", p: ["CA","MEI"], ovr: 82 }
            ]
        },

        // ============================================================
        // 2002
        // Brasiliense - Vice-campeão
        // ============================================================
        {
            team: "Brasiliense",
            year: 2002,
            vice: true,
            players: [
                { n: "Donizeti", p: ["GOL"], ovr: 72 },
                { n: "Moisés", p: ["LD","MD"], ovr: 70 },
                { n: "Aldo", p: ["ZAG"], ovr: 71 },
                { n: "Thiago", p: ["ZAG"], ovr: 70 },
                { n: "Émerson Ávila", p: ["LD","MD"], ovr: 69 },
                { n: "Gil Baiano", p: ["VOL","MC"], ovr: 73 },
                { n: "Evandro", p: ["MC","MEI"], ovr: 70 },
                { n: "Wellington", p: ["MEI","MC"], ovr: 72 },
                { n: "Carioca", p: ["MEI","MC"], ovr: 73 },
                { n: "Maurício", p: ["CA","MEI"], ovr: 75 },
                { n: "Nogueira", p: ["CA"], ovr: 73 }
            ]
        },

        // ============================================================
        // 2003
        // Flamengo - Vice-campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2003,
            vice: true,
            players: [
                { n: "Júlio César", p: ["GOL"], ovr: 82 },
                { n: "Luciano Baiano", p: ["LD","MD"], ovr: 74 },
                { n: "Váldson", p: ["ZAG"], ovr: 75 },
                { n: "André Bahia", p: ["ZAG"], ovr: 74 },
                { n: "Athirson", p: ["LE","ME"], ovr: 79 },
                { n: "Fernando", p: ["VOL","MC"], ovr: 74 },
                { n: "André Gomes", p: ["VOL","MC"], ovr: 72 },
                { n: "Felipe", p: ["MEI","MD","ME"], ovr: 79 },
                { n: "Fabinho", p: ["MC","MEI"], ovr: 73 },
                { n: "Zé Carlos", p: ["PD","CA"], ovr: 77 },
                { n: "Edílson", p: ["PD","PE","MEI"], ovr: 83 }
            ]
        },

        // ============================================================
        // 2004
        // Flamengo - Vice-campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2004,
            vice: true,
            players: [
                { n: "Júlio César", p: ["GOL"], ovr: 83 },
                { n: "Reginaldo Araújo", p: ["LD","MD"], ovr: 72 },
                { n: "André Bahia", p: ["ZAG"], ovr: 74 },
                { n: "Fabiano Eller", p: ["ZAG"], ovr: 78 },
                { n: "Douglas Silva", p: ["LE","ME"], ovr: 72 },
                { n: "Robson", p: ["VOL","MC"], ovr: 72 },
                { n: "Roger Guerreiro", p: ["VOL","MC"], ovr: 74 },
                { n: "Ibson", p: ["MC","MEI"], ovr: 73 },
                { n: "Felipe", p: ["MEI","MD","ME"], ovr: 81 },
                { n: "Da Silva", p: ["CA"], ovr: 74 },
                { n: "Jean", p: ["CA","MEI"], ovr: 77 }
            ]
        },

        // ============================================================
        // 2005
        // Fluminense - Vice-campeão
        // ============================================================
        {
            team: "Fluminense",
            year: 2005,
            vice: true,
            players: [
                { n: "Kléber", p: ["GOL"], ovr: 76 },
                { n: "Schneider", p: ["LD","MD"], ovr: 73 },
                { n: "Antônio Carlos", p: ["ZAG"], ovr: 78 },
                { n: "Fabiano Eller", p: ["ZAG"], ovr: 79 },
                { n: "Juan", p: ["LE","ME"], ovr: 77 },
                { n: "Marcão", p: ["VOL","MC"], ovr: 75 },
                { n: "Preto Casagrande", p: ["VOL","MC"], ovr: 76 },
                { n: "Juninho", p: ["MEI","MC"], ovr: 74 },
                { n: "Diego Souza", p: ["CA","MEI"], ovr: 75 },
                { n: "Tuta", p: ["CA"], ovr: 79 },
                { n: "Leandro", p: ["CA","MEI"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2006
        // Vasco - Vice-campeão
        // ============================================================
        {
            team: "Vasco",
            year: 2006,
            vice: true,
            players: [
                { n: "Cássio", p: ["GOL"], ovr: 73 },
                { n: "Wagner Diniz", p: ["LD","MD"], ovr: 74 },
                { n: "Fábio Braz", p: ["ZAG"], ovr: 72 },
                { n: "Jorge Luiz", p: ["ZAG"], ovr: 74 },
                { n: "Diego", p: ["GOL"], ovr: 73 },
                { n: "Andrade", p: ["VOL","MC"], ovr: 76 },
                { n: "Ygor", p: ["VOL","MC"], ovr: 71 },
                { n: "Morais", p: ["MEI","MC"], ovr: 77 },
                { n: "Ramon", p: ["LE","MEI","ME"], ovr: 78 },
                { n: "Edílson", p: ["PD","PE","MEI"], ovr: 80 },
                { n: "Valdir Papel", p: ["CA"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2007
        // Figueirense - Vice-campeão
        // ============================================================
        {
            team: "Figueirense",
            year: 2007,
            vice: true,
            players: [
                { n: "Wilson", p: ["GOL"], ovr: 76 },
                { n: "Diogo", p: ["LD","MD"], ovr: 73 },
                { n: "Chicão", p: ["ZAG"], ovr: 79 },
                { n: "Felipe Santana", p: ["ZAG"], ovr: 76 },
                { n: "André Santos", p: ["LE","ME"], ovr: 77 },
                { n: "Ruy", p: ["VOL","MC"], ovr: 74 },
                { n: "Edson", p: ["VOL","MC"], ovr: 72 },
                { n: "Fernandes", p: ["MEI","MC"], ovr: 77 },
                { n: "Cleiton Xavier", p: ["MEI","MC"], ovr: 78 },
                { n: "Victor Simões", p: ["CA"], ovr: 76 },
                { n: "Henrique", p: ["CA","MEI"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2008
        // Corinthians - Vice-campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2008,
            vice: true,
            players: [
                { n: "Felipe", p: ["GOL"], ovr: 78 },
                { n: "Alessandro", p: ["LD","MD"], ovr: 76 },
                { n: "Chicão", p: ["ZAG"], ovr: 80 },
                { n: "William", p: ["ZAG"], ovr: 79 },
                { n: "André Santos", p: ["LE","ME"], ovr: 78 },
                { n: "Fabinho", p: ["MC","MEI"], ovr: 73 },
                { n: "Eduardo Ramos", p: ["MC","MEI"], ovr: 71 },
                { n: "Carlos Alberto", p: ["MEI","MD","MC"], ovr: 77 },
                { n: "Diogo Rincón", p: ["MEI","MC"], ovr: 75 },
                { n: "Dentinho", p: ["PE","PD","MEI"], ovr: 78 },
                { n: "Herrera", p: ["CA"], ovr: 79 }
            ]
        },

        // ============================================================
        // 2009
        // Internacional - Vice-campeão
        // ============================================================
        {
            team: "Internacional",
            year: 2009,
            vice: true,
            players: [
                { n: "Lauro", p: ["GOL"], ovr: 77 },
                { n: "Danilo Silva", p: ["LD","MD"], ovr: 74 },
                { n: "Índio", p: ["ZAG"], ovr: 81 },
                { n: "Álvaro", p: ["ZAG"], ovr: 76 },
                { n: "Marcelo Cordeiro", p: ["LE","ME"], ovr: 73 },
                { n: "Sandro", p: ["VOL","MC"], ovr: 80 },
                { n: "Guiñazú", p: ["VOL","MC"], ovr: 82 },
                { n: "Magrão", p: ["MEI","MC"], ovr: 78 },
                { n: "D'Alessandro", p: ["MEI","MC"], ovr: 86 },
                { n: "Nilmar", p: ["CA","PE","PD"], ovr: 87 },
                { n: "Taison", p: ["PE","PD","CA"], ovr: 79 }
            ]
        },

        // ============================================================
        // 2010
        // Vitória - Vice-campeão
        // ============================================================
        {
            team: "Vitória",
            year: 2010,
            vice: true,
            players: [
                { n: "Lee", p: ["GOL"], ovr: 73 },
                { n: "Nino Paraíba", p: ["LD","MD"], ovr: 75 },
                { n: "Wallace", p: ["ZAG"], ovr: 74 },
                { n: "Anderson Martins", p: ["ZAG"], ovr: 77 },
                { n: "Egídio", p: ["LE","ME"], ovr: 75 },
                { n: "Vanderson", p: ["VOL","MC"], ovr: 73 },
                { n: "Neto Coruja", p: ["VOL","MC"], ovr: 72 },
                { n: "Fernando", p: ["MEI","MC"], ovr: 73 },
                { n: "Bida", p: ["MEI","MC"], ovr: 77 },
                { n: "Elkeson", p: ["CA","MEI"], ovr: 76 },
                { n: "Schwenck", p: ["CA"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2011
        // Coritiba - Vice-campeão
        // ============================================================
        {
            team: "Coritiba",
            year: 2011,
            vice: true,
            players: [
                { n: "Edson Bastos", p: ["GOL"], ovr: 77 },
                { n: "Jonas", p: ["LD","MD"], ovr: 75 },
                { n: "Demerson", p: ["ZAG"], ovr: 74 },
                { n: "Emerson", p: ["ZAG"], ovr: 77 },
                { n: "Lucas Mendes", p: ["LE","ME"], ovr: 76 },
                { n: "Willian", p: ["VOL","MC"], ovr: 76 },
                { n: "Léo Gago", p: ["VOL","MC"], ovr: 78 },
                { n: "Davi", p: ["MEI","MC"], ovr: 77 },
                { n: "Rafinha", p: ["MEI","MD","ME"], ovr: 82 },
                { n: "Marcos Aurélio", p: ["CA","MEI"], ovr: 81 },
                { n: "Bill", p: ["CA"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2012
        // Coritiba - Vice-campeão
        // ============================================================
        {
            team: "Coritiba",
            year: 2012,
            vice: true,
            players: [
                { n: "Vanderlei", p: ["GOL"], ovr: 79 },
                { n: "Jonas", p: ["LD","MD"], ovr: 76 },
                { n: "Pereira", p: ["ZAG"], ovr: 77 },
                { n: "Demerson", p: ["ZAG"], ovr: 75 },
                { n: "Lucas Mendes", p: ["LE","ME"], ovr: 77 },
                { n: "Willian Farias", p: ["VOL","MC"], ovr: 75 },
                { n: "Sérgio Manoel", p: ["MC","MEI"], ovr: 73 },
                { n: "Rafinha", p: ["MEI","MD","ME"], ovr: 83 },
                { n: "Éverton Ribeiro", p: ["MEI","MD","MC"], ovr: 80 },
                { n: "Roberto", p: ["CA"], ovr: 75 },
                { n: "Éverton Costa", p: ["CA","MEI"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2013
        // Athletico-PR - Vice-campeão
        // ============================================================
        {
            team: "Athletico-PR",
            year: 2013,
            vice: true,
            players: [
                { n: "Weverton", p: ["GOL"], ovr: 77 },
                { n: "Juninho", p: ["LE","ME"], ovr: 73 },
                { n: "Manoel", p: ["ZAG"], ovr: 78 },
                { n: "Luiz Alberto", p: ["ZAG"], ovr: 74 },
                { n: "Pedro Botelho", p: ["LE","ME"], ovr: 74 },
                { n: "Deivid", p: ["VOL","MC"], ovr: 75 },
                { n: "Zezinho", p: ["VOL","MC"], ovr: 72 },
                { n: "Paulo Baier", p: ["MEI","MD","MC"], ovr: 80 },
                { n: "Felipe", p: ["GOL"], ovr: 77 },
                { n: "Marcelo Cirino", p: ["PD","MEI","MD"], ovr: 79 },
                { n: "Éderson", p: ["CA","PD"], ovr: 78 }
            ]
        },

        // ============================================================
        // 2014
        // Cruzeiro - Vice-campeão
        // ============================================================
        {
            team: "Cruzeiro",
            year: 2014,
            vice: true,
            players: [
                { n: "Fábio", p: ["GOL"], ovr: 86 },
                { n: "Ceará", p: ["LD","MD"], ovr: 78 },
                { n: "Bruno Rodrigo", p: ["ZAG"], ovr: 79 },
                { n: "Léo", p: ["ZAG"], ovr: 78 },
                { n: "Egídio", p: ["LE","ME"], ovr: 80 },
                { n: "Henrique", p: ["VOL","MC"], ovr: 81 },
                { n: "Nilton", p: ["VOL","MC"], ovr: 78 },
                { n: "Everton Ribeiro", p: ["MEI","MD","MC"], ovr: 88 },
                { n: "Ricardo Goulart", p: ["CA","MEI","MC"], ovr: 86 },
                { n: "Willian", p: ["PD","MEI","MD"], ovr: 82 },
                { n: "Marcelo Moreno", p: ["CA"], ovr: 84 }
            ]
        },

        // ============================================================
        // 2015
        // Santos - Vice-campeão
        // ============================================================
        {
            team: "Santos",
            year: 2015,
            vice: true,
            players: [
                { n: "Vanderlei", p: ["GOL"], ovr: 82 },
                { n: "Victor Ferraz", p: ["LD","MD"], ovr: 79 },
                { n: "Gustavo", p: ["ZAG"], ovr: 75 },
                { n: "David Braz", p: ["ZAG"], ovr: 77 },
                { n: "Zeca", p: ["LE","ME"], ovr: 77 },
                { n: "Renato", p: ["MC","MEI"], ovr: 79 },
                { n: "Thiago Maia", p: ["VOL","MC"], ovr: 76 },
                { n: "Lucas Lima", p: ["MEI","MC"], ovr: 84 },
                { n: "Geuvânio", p: ["PD","MEI","MD"], ovr: 79 },
                { n: "Ricardo Oliveira", p: ["CA"], ovr: 85 },
                { n: "Gabriel", p: ["PD","MEI","MD"], ovr: 82 }
            ]
        },

        // ============================================================
        // 2016
        // Atlético-MG - Vice-campeão
        // ============================================================
        {
            team: "Atlético-MG",
            year: 2016,
            vice: true,
            players: [
                { n: "Victor", p: ["GOL"], ovr: 85 },
                { n: "Marcos Rocha", p: ["LD","MD"], ovr: 82 },
                { n: "Leonardo Silva", p: ["ZAG"], ovr: 81 },
                { n: "Gabriel", p: ["ZAG"], ovr: 76 },
                { n: "Fábio Santos", p: ["LE","ME"], ovr: 79 },
                { n: "Leandro Donizete", p: ["VOL","MC"], ovr: 79 },
                { n: "Júnior Urso", p: ["VOL","MC"], ovr: 77 },
                { n: "Cazares", p: ["MEI","MC"], ovr: 82 },
                { n: "Robinho", p: ["MEI","MD","ME"], ovr: 82 },
                { n: "Lucas Pratto", p: ["CA"], ovr: 86 },
                { n: "Clayton", p: ["PD","MD"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2017
        // Flamengo - Vice-campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2017,
            vice: true,
            players: [
                { n: "Alex Muralha", p: ["GOL"], ovr: 75 },
                { n: "Rodinei", p: ["LD","MD"], ovr: 77 },
                { n: "Réver", p: ["ZAG"], ovr: 81 },
                { n: "Juan", p: ["ZAG"], ovr: 80 },
                { n: "Pará", p: ["LE","ME"], ovr: 75 },
                { n: "Cuéllar", p: ["VOL"], ovr: 78 },
                { n: "Willian Arão", p: ["VOL","MC"], ovr: 80 },
                { n: "Lucas Paquetá", p: ["MC","MEI"], ovr: 78 },
                { n: "Berrío", p: ["PD","MEI","MD"], ovr: 76 },
                { n: "Everton", p: ["PE","ME"], ovr: 80 },
                { n: "Guerrero", p: ["CA","MEI"], ovr: 86 }
            ]
        },

        // ============================================================
        // 2018
        // Corinthians - Vice-campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2018,
            vice: true,
            players: [
                { n: "Cássio", p: ["GOL"], ovr: 86 },
                { n: "Fagner", p: ["LD","MD"], ovr: 84 },
                { n: "Léo Santos", p: ["ZAG"], ovr: 75 },
                { n: "Henrique", p: ["VOL","MC"], ovr: 78 },
                { n: "Danilo Avelar", p: ["LE","ME"], ovr: 74 },
                { n: "Ralf", p: ["VOL"], ovr: 81 },
                { n: "Gabriel", p: ["VOL","MC"], ovr: 77 },
                { n: "Romero", p: ["MEI","MC"], ovr: 80 },
                { n: "Jadson", p: ["MEI","MD"], ovr: 82 },
                { n: "Mateus Vital", p: ["MEI","PE","PD"], ovr: 75 },
                { n: "Clayson", p: ["PE","PD"], ovr: 77 }
            ]
        },

        // ============================================================
        // 2019
        // Internacional - Vice-campeão
        // ============================================================
        {
            team: "Internacional",
            year: 2019,
            vice: true,
            players: [
                { n: "Marcelo Lomba", p: ["GOL"], ovr: 80 },
                { n: "Bruno", p: ["LD","MD"], ovr: 75 },
                { n: "Rodrigo Moledo", p: ["ZAG"], ovr: 81 },
                { n: "Víctor Cuesta", p: ["ZAG"], ovr: 82 },
                { n: "Uendel", p: ["LE","ME"], ovr: 75 },
                { n: "Edenílson", p: ["VOL"], ovr: 83 },
                { n: "Rodrigo Lindoso", p: ["VOL","MC"], ovr: 77 },
                { n: "Patrick", p: ["MEI","MC"], ovr: 79 },
                { n: "Nico López", p: ["MEI","MD"], ovr: 80 },
                { n: "Guerrero", p: ["CA","MEI"], ovr: 85 },
                { n: "Wellington Silva", p: ["PD","PE"], ovr: 76 }
            ]
        },

        // ============================================================
        // 2020
        // Grêmio - Vice-campeão
        // ============================================================
        {
            team: "Grêmio",
            year: 2020,
            vice: true,
            players: [
                { n: "Paulo Victor", p: ["GOL"], ovr: 77 },
                { n: "Victor Ferraz", p: ["LD","MD"], ovr: 78 },
                { n: "Geromel", p: ["ZAG"], ovr: 84 },
                { n: "Kannemann", p: ["ZAG"], ovr: 83 },
                { n: "Diogo Barbosa", p: ["LE","ME"], ovr: 77 },
                { n: "Maicon", p: ["VOL","MC"], ovr: 81 },
                { n: "Matheus Henrique", p: ["VOL","MC"], ovr: 80 },
                { n: "Alisson", p: ["MC","VOL"], ovr: 79 },
                { n: "Jean Pyerre", p: ["MEI","MD"], ovr: 78 },
                { n: "Ferreira", p: ["PE","PD"], ovr: 76 },
                { n: "Diego Churín", p: ["CA"], ovr: 75 }
            ]
        },

        // ============================================================
        // 2021
        // Athletico-PR - Vice-campeão
        // ============================================================
        {
            team: "Athletico-PR",
            year: 2021,
            vice: true,
            players: [
                { n: "Santos", p: ["GOL"], ovr: 82 },
                { n: "Khellven", p: ["LD","MD"], ovr: 75 },
                { n: "Zé Ivaldo", p: ["ZAG"], ovr: 75 },
                { n: "Pedro Henrique", p: ["ZAG"], ovr: 78 },
                { n: "Abner", p: ["LE","ME"], ovr: 78 },
                { n: "Erick", p: ["VOL"], ovr: 77 },
                { n: "Cittadini", p: ["VOL","MC"], ovr: 74 },
                { n: "Jader", p: ["MEI","MC"], ovr: 70 },
                { n: "Christian", p: ["MEI","MD"], ovr: 76 },
                { n: "Pedro Rocha", p: ["PE","PD","MEI"], ovr: 78 },
                { n: "Renato Kayzer", p: ["CA"], ovr: 79 }
            ]
        },

        // ============================================================
        // 2022
        // Corinthians - Vice-campeão
        // ============================================================
        {
            team: "Corinthians",
            year: 2022,
            vice: true,
            players: [
                { n: "Cássio", p: ["GOL"], ovr: 88 },
                { n: "Fagner", p: ["LD","MD"], ovr: 83 },
                { n: "Balbuena", p: ["ZAG"], ovr: 82 },
                { n: "Gil", p: ["ZAG"], ovr: 80 },
                { n: "Fábio Santos", p: ["LE","ME"], ovr: 79 },
                { n: "Fausto Vera", p: ["VOL"], ovr: 80 },
                { n: "Du Queiroz", p: ["VOL","MC"], ovr: 76 },
                { n: "Adson", p: ["MEI","MD"], ovr: 75 },
                { n: "Renato Augusto", p: ["MEI","MC"], ovr: 85 },
                { n: "Róger Guedes", p: ["CA","MEI"], ovr: 84 },
                { n: "Yuri Alberto", p: ["CA"], ovr: 83 }
            ]
        },

        // ============================================================
        // 2023
        // Flamengo - Vice-campeão
        // ============================================================
        {
            team: "Flamengo",
            year: 2023,
            vice: true,
            players: [
                { n: "Rossi", p: ["GOL"], ovr: 83 },
                { n: "Wesley", p: ["LE","ME"], ovr: 77 },
                { n: "Fabrício Bruno", p: ["ZAG"], ovr: 82 },
                { n: "Léo Pereira", p: ["ZAG"], ovr: 82 },
                { n: "Ayrton Lucas", p: ["LE","ME"], ovr: 81 },
                { n: "Pulgar", p: ["VOL","MC"], ovr: 82 },
                { n: "Thiago Maia", p: ["VOL","MC"], ovr: 79 },
                { n: "Everton Ribeiro", p: ["MEI","MD","MC"], ovr: 86 },
                { n: "Arrascaeta", p: ["MEI","ME","MC"], ovr: 91 },
                { n: "Bruno Henrique", p: ["PE","PD","CA"], ovr: 85 },
                { n: "Pedro", p: ["CA"], ovr: 89 }
            ]
        },

        // ============================================================
        // 2024
        // Atlético-MG - Vice-campeão
        // ============================================================
        {
            team: "Atlético-MG",
            year: 2024,
            vice: true,
            players: [
                { n: "Everson", p: ["GOL"], ovr: 85 },
                { n: "Lyanco", p: ["ZAG"], ovr: 78 },
                { n: "Júnior Alonso", p: ["ZAG"], ovr: 84 },
                { n: "Battaglia", p: ["ZAG","VOL"], ovr: 79 },
                { n: "Gustavo Scarpa", p: ["LE","ME","MEI"], ovr: 82 },
                { n: "Otávio", p: ["VOL","MC"], ovr: 78 },
                { n: "Alan Franco", p: ["MC","VOL"], ovr: 80 },
                { n: "Guilherme Arana", p: ["LE","ME","MEI"], ovr: 85 },
                { n: "Zaracho", p: ["MC","MEI"], ovr: 82 },
                { n: "Paulinho", p: ["CA","MEI","PE"], ovr: 84 },
                { n: "Hulk", p: ["CA","MEI"], ovr: 90 }
            ]
        },

        // ============================================================
        // 2025
        // Vasco - Vice-campeão
        // ============================================================
        {
            team: "Vasco",
            year: 2025,
            vice: true,
            players: [
                { n: "Léo Jardim", p: ["GOL"], ovr: 82 },
                { n: "Puma Rodríguez", p: ["LD","MD"], ovr: 76 },
                { n: "Robert Renan", p: ["ZAG"], ovr: 77 },
                { n: "Cuesta", p: ["ZAG"], ovr: 78 },
                { n: "Paulo Henrique", p: ["LE","ME"], ovr: 77 },
                { n: "Thiago Mendes", p: ["VOL","MC"], ovr: 78 },
                { n: "Tchê Tchê", p: ["MC","VOL"], ovr: 77 },
                { n: "Rayan", p: ["MEI","PD","CA"], ovr: 75 },
                { n: "Philippe Coutinho", p: ["MEI","MC"], ovr: 82 },
                { n: "Hinestroza", p: ["PD","PE","MEI"], ovr: 76 },
                { n: "Vegetti", p: ["CA"], ovr: 83 }
            ]
        },
    ];
