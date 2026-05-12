const lipsum =
  "Testo placeholder. TODO: inserire qui il contenuto definitivo per questa schermata.";

export const MAIN_POINTS = [
  { id: "intro", label: "Introduzione", slideIndex: 0 },
  { id: "mercury", label: "Mercury", slideIndex: 2 },
  { id: "gemini", label: "Gemini", slideIndex: 4 },
  { id: "apollo", label: "Apollo", slideIndex: 6 },
  { id: "shuttle", label: "Space shuttle", slideIndex: 8 },
];

/**
 * 9 slide totali:
 * - 5 main: 0,2,4,6,8
 * - 1 minor tra ogni main: (0->2) 1, (2->4) 3, (4->6) 5, (6->8) 7
 */
export const slides = [
  {
    type: "intro",
    title: "Spacesuit Evolution",
    subtitleHtml:
      "L’evoluzione delle tute spaziali raccontata attraverso il contesto storico, le missioni e le innovazioni che hanno reso possibile <strong>vivere e lavorare nello spazio</strong>.",
  },

  {
    type: "section",
    mainId: "intro",
    minorLabel: "Contesto",
    image: "./assets/images/corsa_spazio2.jpg",
    bgImage: "./assets/images/background_1.jpeg",
    bodyHtml:
      "Alla fine degli anni ’50, la <strong>Guerra Fredda</strong> tra Stati Uniti e Unione Sovietica ha dato il via a una competizione tecnologica senza precedenti, nota come “<strong>corsa allo spazio</strong>”.<br><br>L'Unione Sovietica lanciò lo <strong>Sputnik 1</strong> nel 1957, il primo satellite artificiale della storia. Questo evento scosse gli Stati Uniti e spinse alla fondazione della <strong>NASA nel 1958</strong>.<br><br>In questo periodo, l'attenzione era rivolta a capire come l'uomo potesse sopravvivere nello spazio, portando ai primi studi sulle tute pressurizzate e sui sistemi di supporto vitale.",
  },

  {
    type: "suit",
    id: "mercury",
    title: "Mercury",
    years: "1958 - 1963",
    intro:
      "Con il Project Mercury, non si tratta ancora di esplorazione: il problema principale è la sopravvivenza umana nello spazio.",
    image: "./assets/images/scontornata.png",
    suitScale: 1.25,
    model3d: "./assets/models/mercury.glb",
    pins: [
      { n: 1, x: "52%", y: "22%", panelId: "casco" },
      { n: 2, x: "49%", y: "47%", panelId: "tubo_ossigeno" },
      { n: 3, x: "40%", y: "70%", panelId: "giunture" },
    ],
    panels: {
      caratteristiche: {
        title: "Caratteristiche",
        inlineList: [
          "Tuta pressurizzata derivata da jet militare",
          "Struttura morbida che quando",
          "Si gonfia diventa rigida",
          "Sistema di ossigeno dipendente dalla capsula",
          "Nessun sistema di raffreddamento avanzato",
        ],
        tabs: {
          informazioni: {
            list: [
              "Tuta pressurizzata derivata da jet militare: Progettazione basata sulle tute dei piloti ad alta quota, adattata alle esigenze spaziali.",
              "Struttura morbida che quando si gonfia diventa rigida: La pressione interna irrigidiva il corpo tuta limitando i movimenti.",
              "Sistema di ossigeno dipendente dalla capsula: Aria respirabile fornita direttamente dalla navicella tramite collegamenti interni.",
              "Nessun sistema di raffreddamento avanzato: Il controllo termico era minimo e dipendeva soprattutto dall’ambiente della capsula.",
            ],
          },
          immagini: [
            { src: "./assets/images/panel-1.svg", caption: "Placeholder immagini." },
          ],
          video: [
            {
              url: "https://www.youtube.com/results?search_query=Project+Mercury+spacesuit",
              title: "Ricerca: Project Mercury spacesuit",
              meta: "Link di riferimento (placeholder).",
            },
          ],
        },
      },
      materiali: {
        title: "Materiali",
        inlineList: [
          "Nylon: struttura base della tuta",
          "Gomma neoprene: per mantenere la pressione",
          "Alluminio (rivestimento): riflette il calore",
          "Tessuti sintetici semplici",
        ],
        tabs: {
          informazioni: {
            list: [
              "Nylon: Tessuto sintetico leggero utilizzato come struttura esterna della tuta, resistente all’usura e facile da lavorare.",
              "Gomma neoprene: Materiale elastico e impermeabile impiegato per mantenere la pressurizzazione interna della tuta.",
              "Alluminio (rivestimento): Strato riflettente applicato per ridurre l’assorbimento del calore solare e proteggere dalle variazioni termiche.",
              "Tessuti sintetici semplici: Materiali tecnici derivati dall’aviazione usati per rinforzi, cuciture e finiture strutturali.",
            ],
          },
          immagini: [{ src: "./assets/images/panel-2.svg", caption: "Placeholder." }],
          video: [],
        },
      },
      missioni: {
        title: "Missioni",
        inlineList: [
          "Mercury-Redstone 3",
          "Mercury-Redstone 4",
          "Mercury-Atlas 6",
          "Mercury-Atlas 8",
          "Mercury-Atlas 9",
        ],
        tabs: {
          informazioni: {
            list: [
              "Mercury-Redstone 3 “Freedom 7” (1961): https://www.nasa.gov/mission/mercury-redstone-3-freedom-7/",
              "Mercury-Redstone 4 “Liberty Bell 7” (1961): https://www.nasa.gov/mission/mercury-redstone-4-liberty-bell-7/",
              "Mercury-Atlas 6 “Friendship 7” (1962): https://www.nasa.gov/mission/mercury-atlas-6-friendship-7/",
              "Mercury-Atlas 7 “Aurora 7” (1962): https://www.nasa.gov/mission/mercury-atlas-7-aurora-7/",
              "Mercury-Atlas 8 “Sigma 7” (1962): https://www.nasa.gov/mission/mercury-atlas-8-sigma-7/",
              "Mercury-Atlas 9 “Faith 7” (1963): https://www.nasa.gov/mission/mercury-atlas-9-faith-7/",
            ],
          },
          immagini: [{ src: "./assets/images/panel-3.svg", caption: "Placeholder." }],
          video: [],
        },
      },
      astronauti: {
        title: "Astronauti",
        inlineList: ["Alan Shepard", "John Glenn", "Gus Grissom", "Gordon Cooper"],
        tabs: {
          informazioni: {
            list: [
              "Mercury-Redstone 3: Alan Shepard (primo americano nello spazio)",
              "Mercury-Redstone 4: Gus Grissom",
              "Mercury-Atlas 6: John Glenn (primo americano in orbita)",
              "Mercury-Atlas 7: Scott Carpenter",
              "Mercury-Atlas 8: Wally Schirra",
              "Mercury-Atlas 9: Gordon Cooper (ultima missione Mercury)",
            ],
          },
          immagini: [{ src: "./assets/images/panel-4.svg", caption: "Placeholder." }],
          video: [],
        },
      },
      casco: {
        title: "Casco",
        tabs: {
          informazioni: {
            image: "./assets/images/Mercury/Pin/casco.png",
            list: [
              "Materiale: Guscio in fibra di vetro leggera e resistente.",
              "Visiera: In plexiglass trasparente, ribaltabile e sigillabile ermeticamente.",
              "Attacco: Un anello rotante alla base permetteva di girare la testa lateralmente.",
              "Interno: Dotato di cuffie e microfoni integrati per le comunicazioni.",
              "Funzione: Agiva come camera a pressione e convogliava l'ossigeno per la respirazione e il disappannamento.",
            ],
          },
          immagini: [{ src: "./assets/images/pin-1.svg", caption: "Dettaglio casco (placeholder)." }],
          video: [],
        },
      },
      tubo_ossigeno: {
        title: "Tubo ossigeno",
        tabs: {
          informazioni: {
            image: "./assets/images/Mercury/Pin/tubo_ossigeno.jpg",
            list: [
              "Posizione: Si aggancia sul lato sinistro dell'addome tramite un connettore a innesto rapido.",
              "Struttura: È un tubo flessibile e corrugato (a fisarmonica) per evitare strozzature durante i movimenti dell'astronauta.",
              "Funzione: Immette ossigeno fresco e pressurizzato all'interno della tuta.",
              "Percorso: L'aria entra dal ventre, scende verso le estremità (mani e piedi) per raffreddare il corpo e risale infine verso il casco per la respirazione.",
            ],
          },
          immagini: [{ src: "./assets/images/pin-2.svg", caption: "Dettaglio tubo ossigeno (placeholder)." }],
          video: [],
        },
      },
      giunture: {
        title: "Giunture",
        tabs: {
          informazioni: {
            image: "./assets/images/Mercury/Pin/giunture.jpg",
            list: [
              "Design: Struttura a soffietto (fisarmonica) per permettere la flessione senza strozzare la tuta.",
              "Materiale: Tessuto gommato rinforzato da cavi interni per evitare che la pressione gonfiasse l’articolazione deformandola.",
              "Mobilità: Molto rigida sotto pressione; l'astronauta doveva fare molta forza muscolare per piegare le braccia o le gambe.",
              "Scopo: Garantire il movimento minimo necessario per azionare i comandi della capsula rimanendo sigillati.",
            ],
          },
          immagini: [
            { src: "./assets/images/pin-2.svg", caption: "Dettaglio giunture (placeholder)." },
          ],
          video: [],
        },
      },
      stivali: {
        title: "Stivali",
        tabs: {
          informazioni: {
            bullets: [
              { label: "Design", text: "Calzatura integrata per tenuta e comfort (TODO)." },
              { label: "Materiale", text: "Rinforzi e suola (TODO)." },
              { label: "Mobilità", text: "Pensati per postura seduta (TODO)." },
              { label: "Scopo", text: "Protezione e compatibilità con l’hardware di bordo." },
            ],
          },
          immagini: [{ src: "./assets/images/pin-3.svg", caption: "Dettaglio stivali (placeholder)." }],
          video: [],
        },
      },
    },
  },

  {
    type: "section",
    mainId: "mercury",
    minorLabel: "Verso Gemini",
    image: "./assets/images/gemini.jpg",
    bgImage: "./assets/images/background_gemini.jpg",
    bodyHtml: "Nel pieno della corsa allo spazio, il programma <strong>Gemini</strong> segnò un passaggio fondamentale tra i primi voli orbitali e le future missioni lunari. Gli <strong>Stati Uniti</strong> iniziarono a sperimentare manovre più complesse in orbita, come l’aggancio tra veicoli spaziali e le prime attività <strong>extraveicolari.</strong><br><br>Questo periodo portò allo sviluppo delle prime tute realmente progettate per le <strong>attività fuori dalla capsula</strong>, pensate per garantire mobilità e protezione nel vuoto spaziale, in condizioni ancora sperimentali e altamente rischiose.",
  },

  {
    type: "suit",
    id: "gemini",
    title: "Gemini",
    years: "1965 - 1966",
    intro:
      "Con il Project Gemini, l’obiettivo non è più solo sopravvivere: bisogna imparare a muoversi, lavorare e restare più a lungo nello spazio.",
    image: "./assets/images/Gemini_Suit.png",
    model3d: "./assets/models/gemini.glb",
    pins: [
      { n: 1, x: "50%", y: "20%", panelId: "casco" },
      { n: 2, x: "47%", y: "74%", panelId: "collegamento_vitale" },
      { n: 3, x: "53%", y: "69%", panelId: "giunture_pin" },
    ],
    panels: {
      caratteristiche: {
        title: "Caratteristiche",
        inlineList: [
          "Introduzione di strati multipli",
          "Prime soluzioni per gestione termica",
          "Maggiore flessibilità",
          "Casco migliorato con visiera solare",
        ],
        tabs: {
          informazioni: {
            list: [
              "Introduzione di strati multipli: La tuta viene costruita con diversi livelli funzionali invece di un unico guscio.",
              "Prime soluzioni per gestione termica: Miglioramento della ventilazione interna e controllo del calore corporeo.",
              "Maggiore flessibilità: Articolazioni progettate per facilitare il movimento rispetto alle Mercury.",
              "Casco migliorato con visiera solare: Protezione contro luce intensa e radiazione solare diretta.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      materiali: {
        title: "Materiali",
        inlineList: [
          "Nylon multistrato",
          "Dacron (poliestere): struttura e resistenza",
          "Mylar: isolamento termico",
          "Neoprene rivestito: pressione",
        ],
        tabs: {
          informazioni: {
            list: [
              "Nylon multistrato: Tessuto sintetico organizzato in più livelli per migliorare resistenza e protezione.",
              "Dacron (poliestere): Fibra robusta utilizzata come rete di contenimento strutturale e supporto meccanico.",
              "Mylar: Film plastico metallizzato usato per isolamento termico e controllo della radiazione.",
              "Neoprene rivestito: Materiale flessibile impiegato per mantenere pressione interna e tenuta ermetica.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      missioni: {
        title: "Missioni",
        inlineList: [
          "Gemini 3",
          "Gemini 4",
          "Gemini 5",
          "Gemini 6A",
          "Gemini 7",
          "Gemini 8",
          "Gemini 9A",
          "Gemini 10",
          "Gemini 11",
          "Gemini 12",
        ],
        tabs: {
          informazioni: {
            list: [
              "Gemini 3 (1965): https://www.nasa.gov/mission/gemini-3/",
              "Gemini 4 (1965): https://www.nasa.gov/mission/gemini-4/",
              "Gemini 5 (1965): https://www.nasa.gov/mission/gemini-5/",
              "Gemini 6A (1965): https://www.nasa.gov/mission/gemini-6a/",
              "Gemini 7 (1965): https://www.nasa.gov/mission/gemini-7/",
              "Gemini 8 (1966): https://www.nasa.gov/mission/gemini-8/",
              "Gemini 9A (1966): https://www.nasa.gov/mission/gemini-9a/",
              "Gemini 10 (1966): https://www.nasa.gov/mission/gemini-10/",
              "Gemini 11 (1966): https://www.nasa.gov/mission/gemini-11/",
              "Gemini 12 (1966): https://www.nasa.gov/mission/gemini-12/",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      astronauti: {
        title: "Astronauti",
        inlineList: ["Ed White", "Neil Armstrong", "Eugene Cernan"],
        tabs: {
          informazioni: {
            list: [
              "Gemini 3: Gus Grissom; John Young",
              "Gemini 4: James McDivitt; Ed White (prima EVA americana)",
              "Gemini 5: Gordon Cooper; Pete Conrad",
              "Gemini 6A: Wally Schirra; Tom Stafford",
              "Gemini 7: Frank Borman; Jim Lovell",
              "Gemini 8: Neil Armstrong; David Scott (primo docking nello spazio)",
              "Gemini 9A: Tom Stafford; Eugene Cernan",
              "Gemini 10: John Young; Michael Collins",
              "Gemini 11: Pete Conrad; Richard Gordon",
              "Gemini 12: Jim Lovell; Buzz Aldrin (EVA più efficaci del programma)",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      casco: {
        title: "Casco",
        tabs: {
          informazioni: {
            image: "./assets/images/Gemini/Pin/casco.jpg",
            list: [
              "Materiale: Guscio rigido in policarbonato e materiali compositi leggeri, più resistente rispetto alla generazione Mercury.",
              "Visiera: Doppio sistema con visiera trasparente interna e schermatura esterna antiabbagliamento.",
              "Protezione solare: Alcune versioni includevano copertura dorata o filtri contro radiazioni e luce intensa.",
              "Comunicazione: Microfoni e cuffie integrati nel casco per dialogo continuo con capsula e controllo missione.",
              "Funzione: Protegge il capo durante le EVA e mantiene la pressurizzazione dell’intera tuta.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      collegamento_vitale: {
        title: "Collegamento vitale",
        tabs: {
          informazioni: {
            image: "./assets/images/Gemini/Pin/collegamento_vitale.jpg",
            list: [
              "Posizione: Connettori posizionati sul torso anteriore o laterale.",
              "Struttura: Tubi flessibili multipli per ossigeno, ventilazione e comunicazione.",
              "Funzione: Trasportano aria respirabile e permettono lo scambio termico.",
              "Dipendenza: Durante le uscite l’astronauta resta collegato alla navicella tramite umbilicale.",
              "Limite: L’autonomia è ancora ridotta rispetto alle tute Apollo.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      giunture_pin: {
        title: "Giunture",
        tabs: {
          informazioni: {
            image: "./assets/images/Gemini/Pin/giunture.jpg",
            list: [
              "Design: Sezioni a soffietto e anelli flessibili inseriti in spalle, gomiti e ginocchia.",
              "Materiale: Tessuti pressurizzati rinforzati con strati strutturali interni.",
              "Mobilità: Migliore della Mercury, ma ancora impegnativa sotto pressione.",
              "Scopo: Consentire movimenti più ampi necessari per lavoro esterno e manovre.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      strati_esterni: {
        title: "Strati esterni",
        tabs: {
          informazioni: {
            image: "./assets/images/Gemini/Pin/strati_esterni.jpg",
            list: [
              "Materiale: Nylon, Dacron e Mylar combinati in più livelli.",
              "Funzione: Protezione termica e contenimento della pressione interna.",
              "Innovazione: Prima vera costruzione multilayer NASA.",
              "Risultato: La tuta diventa un sistema tecnico e non solo di emergenza.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
    },
  },
  {
    type: "section",
    mainId: "gemini",
    minorLabel: "Verso Apollo",
    image: "./assets/images/apollo.jpg",
    bgImage: "./assets/images/background_apollo.jpg",
    bodyHtml: "Con il programma <strong>Apollo</strong>, l’obiettivo si spostò esplicitamente verso <strong>l’esplorazione della Luna.</strong> In un contesto di forte pressione politica e tecnologica, la NASA sviluppò missioni sempre più complesse che culminarono con il primo sbarco umano sul suolo lunare nel <strong>1969.</strong> <br><br> Le esigenze operative richiesero lo sviluppo di tute altamente avanzate, capaci di supportare lunghe attività extraveicolari sulla <strong>superficie lunare</strong>, proteggendo gli astronauti da temperature estreme, radiazioni e polveri lunari.",
  },

  {
    type: "suit",
    id: "apollo",
    title: "Apollo",
    years: "1967 - 1972",
    intro:
      "Con il Programma Apollo, la sfida supera l’orbita terrestre: la tuta deve permettere all’uomo di vivere e operare sulla Luna.",
    image: "./assets/images/apollo_suit.png",
    suitScale: 1.50,
    pins: [
      { n: 1, x: "52%", y: "21%", panelId: "casco" },
      { n: 2, x: "66%", y: "42%", panelId: "zaino_plss" },
      { n: 3, x: "35%", y: "60%", panelId: "guanti" },
      { n: 4, x: "47%", y: "86%", panelId: "stivali_lunari" },
    ],
    panels: {
      caratteristiche: {
        title: "Caratteristiche",
        inlineList: [
          "PLSS (zaino vitale): autonomia completa",
          "Sistema di raffreddamento a liquido",
          "Struttura a molti strati (protezione totale)",
          "Guanti avanzati per precisione",
          "Stivali per terreno lunare",
        ],
        tabs: {
          informazioni: {
            list: [
              "PLSS (zaino vitale): Unità autonoma con ossigeno, ventilazione, energia e comunicazione.",
              "Sistema di raffreddamento a liquido: Indumento interno che fa circolare acqua attorno al corpo.",
              "Struttura a molti strati (protezione totale): Costruzione multilayer contro vuoto, polvere e temperature estreme.",
              "Guanti avanzati per precisione: Design migliorato per impugnare strumenti e raccogliere campioni.",
              "Stivali per terreno lunare: Suole rinforzate e isolate per muoversi sulla superficie lunare.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      materiali: {
        title: "Materiali",
        inlineList: [
          "Kapton: isolamento termico",
          "Mylar: riflessione del calore",
          "Beta cloth (fibra di vetro + teflon): resistenza al fuoco",
          "Nylon e neoprene: pressione interna",
          "Metalli sottili (alluminio): riflettività",
          "Sistema di raffreddamento interno (tubi d’acqua)",
        ],
        tabs: {
          informazioni: {
            list: [
              "Kapton: Film ad alte prestazioni resistente alle temperature estreme, usato come isolamento.",
              "Mylar: Materiale riflettente impiegato per schermare il calore radiante.",
              "Beta cloth (fibra di vetro + teflon): Tessuto ignifugo e molto resistente utilizzato nello strato esterno.",
              "Nylon e neoprene: Combinazione usata negli strati pressurizzati interni della tuta.",
              "Metalli sottili (alluminio): Fogli riflettenti inseriti tra i layer per controllo termico.",
              "Sistema di raffreddamento interno (tubi d’acqua): Rete di tubazioni integrate nell’indumento interno per dissipare il calore corporeo.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      missioni: {
        title: "Missioni",
        inlineList: [
          "Apollo 7",
          "Apollo 8",
          "Apollo 9",
          "Apollo 10",
          "Apollo 11",
          "Apollo 12",
          "Apollo 13",
          "Apollo 14",
          "Apollo 15",
          "Apollo 16",
          "Apollo 17",
        ],
        tabs: {
          informazioni: {
            list: [
              "Apollo 7 (1968): https://www.nasa.gov/mission/apollo-7/",
              "Apollo 8 (1968): https://www.nasa.gov/mission/apollo-8/",
              "Apollo 9 (1969): https://www.nasa.gov/mission/apollo-9/",
              "Apollo 10 (1969): https://www.nasa.gov/mission/apollo-10/",
              "Apollo 11 (1969): https://www.nasa.gov/mission/apollo-11/",
              "Apollo 12 (1969): https://www.nasa.gov/mission/apollo-12/",
              "Apollo 13 (1970): https://www.nasa.gov/mission/apollo-13/",
              "Apollo 14 (1971): https://www.nasa.gov/mission/apollo-14/",
              "Apollo 15 (1971): https://www.nasa.gov/mission/apollo-15/",
              "Apollo 16 (1972): https://www.nasa.gov/mission/apollo-16/",
              "Apollo 17 (1972): https://www.nasa.gov/mission/apollo-17/",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      astronauti: {
        title: "Astronauti",
        inlineList: ["Neil Armstrong", "Buzz Aldrin", "Harrison Schmitt"],
        tabs: {
          informazioni: {
            list: [
              "Apollo 7: Wally Schirra; Donn Eisele; Walter Cunningham",
              "Apollo 8: Frank Borman; Jim Lovell; William Anders (prima orbita lunare umana)",
              "Apollo 9: James McDivitt; David Scott; Rusty Schweickart",
              "Apollo 10: Tom Stafford; John Young; Eugene Cernan",
              "Apollo 11: Neil Armstrong (primo uomo sulla Luna); Buzz Aldrin; Michael Collins",
              "Apollo 12: Pete Conrad; Alan Bean; Richard Gordon",
              "Apollo 13: Jim Lovell; Jack Swigert; Fred Haise (missione d’emergenza storica)",
              "Apollo 14: Alan Shepard (ritorno nello spazio, cammina sulla Luna); Edgar Mitchell; Stuart Roosa",
              "Apollo 15: David Scott; James Irwin; Alfred Worden (primo rover lunare)",
              "Apollo 16: John Young; Charles Duke; Thomas Mattingly",
              "Apollo 17: Eugene Cernan (ultimo uomo sulla Luna); Harrison Schmitt (primo scienziato geologo sulla Luna); Ron Evans (ultima missione Apollo)",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      casco: {
        title: "Casco",
        tabs: {
          informazioni: {
            image: "./assets/images/Apollo/Pin/casco.jpg",
            list: [
              "Materiale: Policarbonato ad alta resistenza con anello di aggancio al collo.",
              "Visiera: Sistema esterno dorato per schermatura UV e riflessione solare.",
              "Tenuta: Sigillato ermeticamente e integrato con il circuito di ventilazione.",
              "Comunicazione: Cuffia interna con microfoni e auricolari separati.",
              "Funzione: Protegge testa e respirazione durante l’attività lunare.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      zaino_plss: {
        title: "Zaino PLSS",
        tabs: {
          informazioni: {
            image: "./assets/images/Apollo/Pin/zaino.jpg",
            list: [
              "Posizione: Montato sulla schiena.",
              "Struttura: Unità rigida contenente bombole, batterie, ventilazione e filtri.",
              "Funzione: Fornisce autonomia completa senza collegamenti esterni.",
              "Raffreddamento: Gestisce temperatura interna e ricircolo dell’aria.",
              "Importanza: Trasforma la tuta in una mini-astronave indossabile.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      guanti: {
        title: "Guanti",
        tabs: {
          informazioni: {
            image: "./assets/images/Apollo/Pin/guanti.jpg",
            list: [
              "Materiale: Strati pressurizzati interni con rivestimenti esterni resistenti.",
              "Design: Dita sagomate e articolazioni migliorate per presa utensili.",
              "Sensibilità: Maggiore precisione rispetto ai modelli precedenti.",
              "Uso: Raccolta campioni, strumenti scientifici, guida rover.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      stivali_lunari: {
        title: "Stivali lunari",
        tabs: {
          informazioni: {
            image: "./assets/images/Apollo/Pin/stivali.jpg",
            list: [
              "Materiale: Suola rinforzata con isolamento termico e strati antiabrasione.",
              "Grip: Battistrada pensato per polvere e terreno irregolare.",
              "Protezione: Difesa da freddo estremo e superfici calde.",
              "Funzione: Consentire camminata stabile sulla Luna.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
    },
  },
  {
    type: "section",
    mainId: "apollo",
    minorLabel: "Verso Shuttle",
    image: "./assets/images/spaceshuttle.jpg",
    bgImage: "./assets/images/background_spaceshuttle.jpg",
    bodyHtml: "Dopo le missioni lunari, l’attenzione della NASA si spostò verso un accesso più frequente e riutilizzabile allo spazio. Il programma <strong>Space Shuttle</strong> introdusse una nuova era di voli orbitali, con missioni scientifiche, di manutenzione e costruzione in orbita terrestre.<br><br>In questo contesto vennero sviluppate <strong>tute più modulari e riutilizzabili</strong>, progettate per attività extraveicolari in orbita bassa terrestre, con maggiore enfasi su sicurezza, ergonomia e supporto alle missioni di lunga durata.",
  },

  {
    type: "suit",
    id: "shuttle",
    title: "Space shuttle",
    years: "1981 - 2011",
    intro:
      "Con lo Space Shuttle, lo spazio diventa un luogo di lavoro: la tuta è progettata per costruire, riparare e operare in missioni complesse.",
    suitVariants: {
      EMU: {
        image: "./assets/images/emu.png",
        pins: [
          { n: 1, x: "54%", y: "28%", panelId: "casco" },
          { n: 2, x: "55%", y: "48%", panelId: "torso_rigido" },
          { n: 3, x: "43%", y: "35%", panelId: "zaino_emu" },
          { n: 4, x: "37%", y: "50%", panelId: "giunti_avanzati" },
        ],
      },
      "ACES": {
        image: "./assets/images/space_shuttle.png",
        pins: [
          { n: 1, x: "52%", y: "24%", panelId: "aces_casco" },
          { n: 2, x: "52%", y: "44%", panelId: "aces_torso" },
          { n: 3, x: "43%", y: "56%", panelId: "aces_guanti" },
          { n: 4, x: "47%", y: "83%", panelId: "aces_stivali" },
          { n: 5, x: "50%", y: "50%", panelId: "aces_ossigeno" },
        ],
      },
    },
    panels: {
      caratteristiche: {
        title: "Caratteristiche",
        inlineList: [
          "Introduzione di strati multipli",
          "Prime soluzioni per gestione termica",
          "Maggiore flessibilità",
          "Casco migliorato con visiera solare",
        ],
        tabs: {
          informazioni: {
            list: [
              "Struttura modulare riutilizzabile: Componenti sostituibili e adattabili a diversi astronauti.",
              "Sistema autonomo avanzato: Supporto vitale evoluto per EVA di lunga durata.",
              "Maggiore mobilità articolare: Giunti migliorati per lavorare nello spazio.",
              "Casco con comunicazioni integrate: Sistemi audio e visivi incorporati.",
              "Guanti per lavori tecnici: Progettati per utensili, manutenzione e assemblaggio.",
              "Torso rigido: Parte centrale solida per distribuire carichi e fissare sistemi.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      materiali: {
        title: "Materiali",
        inlineList: [
          "Kevlar: protezione da micrometeoriti",
          "Nomex: resistenza al calore",
          "Teflon (PTFE): protezione esterna e durata",
          "Gore-Tex: traspirabilità controllata",
          "Dacron strutturale",
          "Poliuretani avanzati",
          "Componenti compositi rigidi (torso)",
        ],
        tabs: {
          informazioni: {
            list: [
              "Kevlar: Fibra ad alta resistenza utilizzata per protezione contro micrometeoriti e abrasioni.",
              "Nomex: Materiale ignifugo impiegato per resistere al calore e a condizioni estreme.",
              "Teflon (PTFE): Rivestimento durevole con bassa usura e alta resistenza chimica.",
              "Gore-Tex: Membrana tecnica usata in alcuni sistemi per gestione di umidità e comfort.",
              "Dacron strutturale: Tessuto portante utilizzato per mantenere forma e resistenza meccanica.",
              "Poliuretani avanzati: Polimeri tecnici impiegati in guarnizioni, flessibilità e componenti interni.",
              "Componenti compositi rigidi (torso): Elementi strutturali solidi che migliorano supporto e modularità.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      caratteristiche_aces: {
        title: "Caratteristiche",
        inlineList: [
          "Tuta a pressione parziale",
          "Colore arancione ad alta visibilità",
          "Sistema di supporto vitale integrato (PLSS semplificato)",
          "Compatibilità con sedile dello Shuttle",
          "Sistema di raffreddamento interno",
          "Guanti e stivali integrati o modulari",
          "Casco pressurizzato con visiera ribaltabile",
          "Sistema di sopravvivenza d’emergenza",
        ],
        tabs: {
          informazioni: {
            list: [
              "Tuta a pressione parziale: Progettata per mantenere la sopravvivenza dell’astronauta in caso di depressurizzazione della cabina durante decollo o rientro.",
              "Colore arancione ad alta visibilità: Scelto per facilitare il recupero in mare o in aree isolate.",
              "Sistema di supporto vitale integrato (PLSS semplificato): Fornisce ossigeno, ventilazione e regolazione della pressione.",
              "Compatibilità con sedile dello Shuttle: Progettata per essere indossata durante le fasi critiche del volo (decollo e atterraggio).",
              "Sistema di raffreddamento interno: Tubazioni con circolazione di liquido per evitare il surriscaldamento del corpo.",
              "Guanti e stivali integrati o modulari: Collegati ermeticamente alla tuta ma removibili per operazioni a terra.",
              "Casco pressurizzato con visiera ribaltabile: Dotato di sistema di comunicazione e supporto per ossigeno.",
              "Sistema di sopravvivenza d’emergenza: Include attrezzature per galleggiamento, localizzazione e sopravvivenza in acqua.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      materiali_aces: {
        title: "Materiali",
        inlineList: [
          "Strato esterno",
          "Strato di pressione",
          "Strato di contenimento",
          "Guarnizioni e sigilli",
        ],
        tabs: {
          informazioni: {
            list: [
              "Strato esterno: Tessuto in Nomex arancione ignifugo, resistente al calore e altamente visibile in caso di emergenza.",
              "Strato di pressione: Tessuto sintetico impermeabile all’aria (tipicamente poliuretano e materiali elastomerici) che garantisce la pressurizzazione della tuta.",
              "Strato di contenimento: Tessuto resistente in nylon ad alta tenacità, che mantiene la forma della tuta quando pressurizzata.",
              "Guarnizioni e sigilli: Materiali elastomerici flessibili per polsi, collo e caviglie, progettati per garantire tenuta ermetica.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      missioni: {
        title: "Missioni",
        inlineList: [
          "STS-1",
          "STS-2",
          "STS-3",
          "STS-4",
          "STS-5",
          "STS-6",
          "STS-7",
          "STS-8",
          "STS-9",
          "STS-41B",
          "STS-41C",
          "STS-41D",
          "STS-51A",
          "STS-51C",
          "STS-51D",
          "STS-51B",
          "STS-51G",
          "STS-51F",
          "STS-51I",
          "STS-51J",
          "STS-61A",
          "STS-61B",
          "STS-61C",
          "STS-51L",
          "STS-26",
          "STS-27",
          "STS-29",
          "STS-30",
          "STS-28",
          "STS-34",
          "STS-33",
          "STS-32",
          "STS-36",
          "STS-31",
          "STS-41",
          "STS-38",
          "STS-35",
          "STS-37",
          "STS-39",
          "STS-40",
          "STS-43",
          "STS-48",
          "STS-44",
          "STS-42",
          "STS-45",
          "STS-49",
          "STS-50",
          "STS-46",
          "STS-47",
          "STS-52",
          "STS-53",
          "STS-54",
          "STS-56",
          "STS-55",
          "STS-57",
          "STS-51",
          "STS-58",
          "STS-61",
          "STS-60",
          "STS-62",
          "STS-59",
          "STS-65",
          "STS-64",
          "STS-68",
          "STS-66",
          "STS-63",
          "STS-67",
          "STS-71",
          "STS-70",
          "STS-73",
          "STS-69",
          "STS-74",
          "STS-76",
          "STS-75",
          "STS-72",
          "STS-77",
          "STS-78",
          "STS-79",
          "STS-80",
          "STS-81",
          "STS-82",
          "STS-83",
          "STS-84",
          "STS-85",
          "STS-86",
          "STS-87",
          "STS-88",
          "STS-89",
          "STS-90",
          "STS-91",
          "STS-95",
          "STS-96",
          "STS-93",
          "STS-99",
          "STS-101",
          "STS-102",
          "STS-97",
          "STS-92",
          "STS-98",
          "STS-103",
          "STS-104",
          "STS-100",
          "STS-105",
          "STS-108",
          "STS-109",
          "STS-110",
          "STS-111",
          "STS-112",
          "STS-113",
          "STS-114",
          "STS-115",
          "STS-116",
          "STS-117",
          "STS-118",
          "STS-120",
          "STS-122",
          "STS-123",
          "STS-124",
          "STS-126",
          "STS-119",
          "STS-125",
          "STS-127",
          "STS-128",
          "STS-129",
          "STS-130",
          "STS-131",
          "STS-132",
          "STS-133",
          "STS-134",
          "STS-135",
        ],
        tabs: {
          informazioni: {
            list: [
              "STS-1 Columbia (1981): https://www.nasa.gov/mission/sts-1/",
              "STS-2 Columbia (1981): https://www.nasa.gov/mission/sts-2/",
              "STS-3 Columbia (1982): https://www.nasa.gov/mission/sts-3/",
              "STS-4 Columbia (1982): https://www.nasa.gov/mission/sts-4/",
              "STS-5 Columbia (1982): https://www.nasa.gov/mission/sts-5/",
              "STS-6 Challenger (1983): https://www.nasa.gov/mission/sts-6/",
              "STS-7 Challenger (1983): https://www.nasa.gov/mission/sts-7/",
              "STS-8 Challenger (1983): https://www.nasa.gov/mission/sts-8/",
              "STS-9 Columbia (1983): https://www.nasa.gov/mission/sts-9/",
              "STS-41-B Challenger (1984): https://www.nasa.gov/mission/sts-41b/",
              "STS-114 Discovery (2005): https://www.nasa.gov/mission/sts-114/",
              "STS-135 Atlantis (2011): https://www.nasa.gov/mission/sts-135/",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      astronauti: {
        title: "Astronauti",
        inlineList: ["John Young", "Sally Ride", "Bruce McCandless II", "Story Musgrave", "Eileen Collins", "Chris Ferguson"],
        tabs: {
          informazioni: {
            list: [
              "STS-1: John Young; Robert Crippen (primo Space Shuttle)",
              "STS-6: Paul Weitz; Karol Bobko; Donald Peterson; Story Musgrave (prima EVA Shuttle)",
              "STS-7: Sally Ride (prima donna americana nello spazio)",
              "STS-41B: Bruce McCandless II (prima spacewalk senza cavo)",
              "STS-31: Loren Shriver; Charles Bolden; Steven Hawley; Bruce McCandless II; Kathryn Sullivan (lancio Hubble)",
              "STS-95: John Glenn (ritorna nello spazio a 77 anni)",
              "STS-114: Eileen Collins (prima comandante donna, ritorno al volo post-Columbia)",
              "STS-135: Chris Ferguson; Doug Hurley; Sandy Magnus; Rex Walheim (ultima missione Shuttle)",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      casco: {
        title: "Casco",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/casco.jpg",
            list: [
              "Materiale: Policarbonato trasparente ad alta resistenza.",
              "Visiera: Ampia visuale panoramica per attività tecniche.",
              "Comunicazione: Sistema audio integrato avanzato con più canali.",
              "Funzione: Protegge durante EVA lunghe e lavori di precisione.",
              "Comfort: Migliore ergonomia interna rispetto alle generazioni precedenti.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      torso_rigido: {
        title: "Torso rigido",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/torso.jpg",
            list: [
              "Materiale: Componenti compositi rigidi e leggeri.",
              "Posizione: Parte centrale del corpo tuta.",
              "Funzione: Supporta braccia, zaino vitale e connessioni principali.",
              "Vantaggio: Riduce sforzo fisico e distribuisce il peso.",
              "Innovazione: Struttura modulare sostituibile.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      zaino_emu: {
        title: "Zaino vitale EMU",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/eva.png",
            list: [
              "Posizione: Schiena.",
              "Struttura: Sistema avanzato con ossigeno, raffreddamento, batterie e backup.",
              "Autonomia: Pensato per EVA di molte ore.",
              "Sicurezza: Include sistemi ridondanti in caso di emergenza.",
              "Uso: Manutenzione satelliti e costruzione ISS.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      giunti_avanzati: {
        title: "Giunti avanzati",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/giunti.jpg",
            list: [
              "Design: Cuscinetti rotanti e articolazioni meccaniche evolute.",
              "Materiale: Tessuti tecnici combinati con anelli rigidi.",
              "Mobilità: Molto superiore rispetto ad Apollo.",
              "Scopo: Permettere lavoro tecnico con utensili e spostamenti controllati.",
              "Precisione: Fondamentali per riparazioni nello spazio.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      les_aces: {
        title: "Tuta di lancio e rientro",
        tabs: {
          informazioni: {
            list: [
              "Tuta pressurizzata di sicurezza: Mantiene vita e pressione in caso di depressurizzazione del veicolo.",
              "Colore ad alta visibilità: Versione ACES arancione per facilitare il recupero dopo atterraggio d’emergenza.",
              "Paracadute e sopravvivenza integrati: Collegata a equipaggiamenti per evacuazione e salvataggio.",
              "Mobilità interna: Pensata per restare seduti e operare i comandi della navetta.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_casco: {
        title: "Casco",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/casco2.jpg",
            list: [
              "Materiale: Guscio rigido in compositi leggeri e resistenti, progettato per impatti e pressurizzazione.",
              "Visiera: Ampia visiera trasparente antiappannamento con elevata visibilità frontale e laterale.",
              "Attacco: Sistema ad anello sigillante collegato al collo della tuta per chiusura ermetica rapida.",
              "Interno: Integrava microfoni, auricolari e sistema di ventilazione per comunicazioni continue.",
              "Funzione: Manteneva la pressione interna e proteggeva testa e respirazione in caso di emergenza.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_torso: {
        title: "Torso / Corpo tuta",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/torso2.JPG",
            list: [
              "Materiale: Tessuto pressurizzato multistrato con rinforzi ignifughi e antiabrasione.",
              "Struttura: Design morbido e flessibile, pensato per essere indossato per molte ore seduti in cabina.",
              "Vestibilità: Regolabile per adattarsi ai diversi membri dell’equipaggio.",
              "Funzione: Isola il corpo da perdita di pressione, freddo e fumo in cabina.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_guanti: {
        title: "Guanti",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/guanti2.jpg",
            list: [
              "Materiale: Strati sigillati interni con superficie esterna resistente all’usura.",
              "Attacco: Collegati ai polsi tramite anelli di chiusura ermetica.",
              "Mobilità: Consentivano l’uso di interruttori, leve e controlli della navetta.",
              "Funzione: Protezione delle mani mantenendo sensibilità operativa.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_stivali: {
        title: "Stivali",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/stivali.jpg",
            list: [
              "Materiale: Gomma resistente e tessuti ignifughi rinforzati.",
              "Suola: Antiscivolo, adatta a superfici interne e procedure di evacuazione.",
              "Protezione: Isolamento termico e resistenza a detriti o superfici calde.",
              "Funzione: Stabilità durante emergenze e atterraggi imprevisti.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_ossigeno: {
        title: "Sistema ossigeno / collegamenti",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/torso3.jpg",
            list: [
              "Posizione: Connettori frontali sul torso collegati ai sistemi della navetta.",
              "Struttura: Tubi flessibili per aria respirabile, ventilazione e comunicazioni.",
              "Funzione: Fornisce ossigeno e mantiene la pressurizzazione durante anomalie.",
              "Backup: Collegabile a sistemi di emergenza separati.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
      aces_paracadute: {
        title: "Paracadute e sopravvivenza",
        tabs: {
          informazioni: {
            image: "./assets/images/SpaceShuttle/Pin/paracadute.jpg",
            list: [
              "Posizione: Integrato con imbracatura dorsale e sedile.",
              "Struttura: Sistema di sgancio rapido con paracadute personale.",
              "Dotazione: Includeva kit di sopravvivenza, radio e attrezzatura di recupero.",
              "Funzione: Permetteva l’uscita d’emergenza ad alta quota in scenari estremi.",
            ],
          },
          immagini: [],
          video: [],
        },
      },
    },
  },
];

export function getSlideLabel(index) {
  const s = slides[index];
  if (!s) return "";
  if (s.type === "intro") return "Introduzione";
  if (s.type === "suit") return s.title;
  if (s.type === "section") return s.minorLabel || "Dettaglio";
  return "";
}
