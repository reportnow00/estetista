import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.purchaseEventLog.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.courseTeacher.deleteMany();
  await prisma.review.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.seoData.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const userPassword = await bcrypt.hash("Studente123!", 12);

  const [admin, student] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin Professione Fitness",
        email: "admin@professionefitnessacademy.it",
        passwordHash: adminPassword,
        role: "ADMIN"
      }
    }),
    prisma.user.create({
      data: {
        name: "Giulia Ferri",
        email: "giulia@example.com",
        passwordHash: userPassword
      }
    })
  ]);

  const category = await prisma.category.create({
    data: {
      name: "Formazione personal trainer",
      slug: "formazione-personal-trainer",
      description: "Percorsi orientati alla costruzione di una professionalità solida nel fitness."
    }
  });

  const blogCareer = await prisma.blogCategory.create({
    data: {
      name: "Carriera",
      slug: "carriera"
    }
  });

  const blogGuide = await prisma.blogCategory.create({
    data: {
      name: "Guide",
      slug: "guide"
    }
  });

  const teachers = await Promise.all([
    prisma.teacher.create({
      data: {
        slug: "andrea-morandi",
        name: "Andrea Morandi",
        role: "Preparatore atletico & Scienze motorie",
        shortBio: "Lavora tra performance, tecnica di esecuzione e programmazione dell'allenamento.",
        bio: "Andrea Morandi segue da anni percorsi di allenamento personalizzato e formazione per trainer che vogliono costruire basi tecniche forti e applicabili sul lavoro.",
        featured: true,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
        credentials: ["Laurea in Scienze Motorie", "Esperienza in preparazione atletica"],
        expertise: ["Programmazione", "Valutazione", "Tecnica esercizi"],
        sortOrder: 1
      }
    }),
    prisma.teacher.create({
      data: {
        slug: "silvia-conti",
        name: "Silvia Conti",
        role: "Movement specialist",
        shortBio: "Focus su biomeccanica, controllo motorio e qualità del gesto.",
        bio: "Silvia si occupa di analisi del movimento e impostazione tecnica, con attenzione alla progressione corretta del cliente e alla prevenzione degli errori più comuni.",
        featured: true,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
        credentials: ["Coach movement", "Docente workshop tecnici"],
        expertise: ["Biomeccanica", "Movement", "Qualità del gesto"],
        sortOrder: 2
      }
    }),
    prisma.teacher.create({
      data: {
        slug: "marco-rinaldi",
        name: "Marco Rinaldi",
        role: "Nutrizione applicata al fitness",
        shortBio: "Aiuta i futuri trainer a parlare di alimentazione con ordine e responsabilità.",
        bio: "Marco approfondisce il ruolo della nutrizione nel lavoro del personal trainer, chiarendo competenze, limiti e corretta collaborazione con professionisti sanitari.",
        featured: true,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop",
        credentials: ["Consulente nutrizione sportiva", "Formatore"],
        expertise: ["Nutrizione sportiva", "Educazione alimentare"],
        sortOrder: 3
      }
    }),
    prisma.teacher.create({
      data: {
        slug: "elena-vitali",
        name: "Elena Vitali",
        role: "Business & personal brand per trainer",
        shortBio: "Parla di proposta, posizionamento e presentazione professionale del trainer.",
        bio: "Elena segue la parte più strategica: come presentarsi, come impostare l'offerta e come evitare errori di comunicazione nel passaggio dal corso al mercato.",
        featured: true,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
        credentials: ["Consulente business fitness", "Brand strategist"],
        expertise: ["Posizionamento", "Offerta", "Personal brand"],
        sortOrder: 4
      }
    })
  ]);

  const course = await prisma.course.create({
    data: {
      slug: "diventa-un-personal-trainer",
      title: "Diventa un Personal Trainer",
      subtitle: "Il percorso professionale per costruire basi tecniche forti e trasformarle in lavoro.",
      shortDescription: "Un corso one-time pensato per chi vuole entrare nel mondo del fitness con più chiarezza, più metodo e una percezione professionale più forte.",
      longDescription: "Diventa un Personal Trainer è il fulcro iniziale della piattaforma. Un percorso costruito per spiegare davvero come si imposta il lavoro del trainer: valutazione, programmazione, tecnica degli esercizi, relazione col cliente, basi di nutrizione applicata e presentazione professionale del servizio.",
      outcome: "Arrivare a una base operativa solida, presentabile e credibile per iniziare a lavorare nel fitness.",
      audience: "Pensato per chi vuole entrare nel settore fitness, per chi sta già studiando scienze motorie e per chi desidera dare ordine e metodo a una passione forte.",
      certification: "Attestato finale di completamento del percorso con materiali didattici e struttura pronta a essere adattata alle policy dell'academy.",
      careerOutcomes: [
        "Collaborazione con palestre e centri fitness",
        "Attività come trainer freelance",
        "Percorso iniziale per specializzazioni future",
        "Costruzione di un profilo professionale più credibile online e offline"
      ],
      benefits: [
        "Piattaforma ordinata e mobile first",
        "Area utente con lezioni riservate",
        "Accesso una tantum, senza abbonamento",
        "Programma modulare facile da seguire",
        "Docenti presentati in modo professionale",
        "Progress tracking su lezioni e moduli"
      ],
      badges: ["Corso principale", "One-time", "Percorso professionalizzante"],
      mode: "HYBRID",
      level: "FOUNDATION",
      durationLabel: "12 settimane stimate",
      supportLabel: "Supporto email",
      fullPriceCents: 129000,
      salePriceCents: 99000,
      coverImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1600&auto=format&fit=crop",
      featured: true,
      published: true,
      categoryId: category.id,
      gallery: []
    }
  });

  const draftCourse = await prisma.course.create({
    data: {
      slug: "functional-coach-specialist",
      title: "Functional Coach Specialist",
      subtitle: "Bozza non pubblicata per dimostrare la scalabilità dell'architettura.",
      shortDescription: "Corso in bozza non visibile al pubblico.",
      longDescription: "Questo record esiste solo per mostrare che la piattaforma è già multi-corso lato schema e admin.",
      outcome: "Bozza",
      audience: "Bozza",
      certification: "Bozza",
      careerOutcomes: ["Bozza"],
      benefits: ["Bozza"],
      badges: ["Bozza"],
      mode: "ONLINE",
      level: "INTERMEDIATE",
      durationLabel: "8 settimane",
      fullPriceCents: 89000,
      featured: false,
      published: false,
      categoryId: category.id,
      gallery: []
    }
  });

  await Promise.all(
    teachers.map((teacher, index) =>
      prisma.courseTeacher.create({
        data: {
          courseId: course.id,
          teacherId: teacher.id,
          sortOrder: index + 1
        }
      })
    )
  );

  const modules = [
    {
      title: "Fondamenti del ruolo del Personal Trainer",
      description: "Competenze, responsabilità, relazione col cliente e impostazione del lavoro.",
      lessons: [
        {
          title: "Il ruolo professionale del trainer",
          summary: "Capire cosa fa davvero un personal trainer e come comunica il proprio valore.",
          content: "Panoramica del ruolo, confini professionali, relazione col cliente e impostazione di un servizio credibile.",
          durationLabel: "22 min"
        },
        {
          title: "Anamnesi iniziale e raccolta informazioni",
          summary: "Le informazioni che servono prima di proporre qualsiasi percorso.",
          content: "Come impostare un primo colloquio utile, ordinato e rispettoso del cliente.",
          durationLabel: "18 min"
        }
      ]
    },
    {
      title: "Valutazione, movimento e tecnica",
      description: "Basi di movimento, osservazione tecnica e qualità del gesto.",
      lessons: [
        {
          title: "Pattern di movimento essenziali",
          summary: "Squat, hinge, spinta, tirata, anti-rotazione e controllo.",
          content: "Introduzione ai pattern essenziali e al loro utilizzo nella programmazione.",
          durationLabel: "26 min"
        },
        {
          title: "Errori comuni di esecuzione",
          summary: "Come leggere e correggere gli errori senza complicare la comunicazione.",
          content: "Focus su osservazione, linguaggio semplice e progressioni.",
          durationLabel: "24 min"
        }
      ]
    },
    {
      title: "Programmazione e progressione",
      description: "Come strutturare una proposta di lavoro chiara e sostenibile.",
      lessons: [
        {
          title: "Costruire un programma base",
          summary: "Dalla valutazione agli obiettivi: una struttura essenziale ma professionale.",
          content: "Come organizzare un programma base per un cliente general fitness.",
          durationLabel: "29 min"
        },
        {
          title: "Progressioni e monitoraggio",
          summary: "Evoluzione del lavoro nel tempo e lettura dei feedback.",
          content: "Come aggiornare il percorso e non perdere coerenza nel metodo.",
          durationLabel: "21 min"
        }
      ]
    },
    {
      title: "Nutrizione, posizionamento e avvio",
      description: "Basi di nutrizione applicata e prime mosse per presentarti bene sul mercato.",
      lessons: [
        {
          title: "Basi di nutrizione per il trainer",
          summary: "Come parlare di alimentazione con ordine e responsabilità.",
          content: "Confini professionali, educazione alimentare e collaborazione con specialisti.",
          durationLabel: "20 min"
        },
        {
          title: "Personal brand e primo posizionamento",
          summary: "Come presentarti in modo semplice ma professionale.",
          content: "Bio, offerta, comunicazione e primi passi commerciali nel fitness.",
          durationLabel: "19 min"
        }
      ]
    }
  ];

  for (const [moduleIndex, moduleData] of modules.entries()) {
    const courseModule = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: moduleData.title,
        description: moduleData.description,
        sortOrder: moduleIndex + 1
      }
    });

    for (const [lessonIndex, lesson] of moduleData.lessons.entries()) {
      await prisma.lesson.create({
        data: {
          moduleId: courseModule.id,
          title: lesson.title,
          slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          summary: lesson.summary,
          content: lesson.content,
          durationLabel: lesson.durationLabel,
          lessonType: "VIDEO",
          previewable: lessonIndex === 0,
          sortOrder: lessonIndex + 1
        }
      });
    }
  }

  await prisma.review.createMany({
    data: [
      {
        courseId: course.id,
        authorName: "Luca D.",
        authorRole: "Trainer freelance",
        rating: 5,
        featured: true,
        sortOrder: 1,
        body: "Mi è piaciuto il taglio molto ordinato. Non sembra il classico corso che promette tutto: spiega bene cosa impari e come iniziare a lavorare in modo più serio."
      },
      {
        courseId: course.id,
        authorName: "Sara M.",
        authorRole: "Istruttrice fitness",
        rating: 5,
        featured: true,
        sortOrder: 2,
        body: "La parte che ho apprezzato di più è la chiarezza. Programma leggibile, docenti credibili e area utente semplice da usare anche da telefono."
      },
      {
        courseId: course.id,
        authorName: "Andrea P.",
        authorRole: "Studente di scienze motorie",
        rating: 4,
        featured: true,
        sortOrder: 3,
        body: "Ottima base per dare ordine a tante cose che spesso si studiano in modo sparso. Bene anche il taglio su posizionamento e comunicazione professionale."
      }
    ]
  });

  await prisma.fAQ.createMany({
    data: [
      {
        pageKey: "home",
        question: "Il corso è acquistabile una sola volta?",
        answer: "Sì. Il flusso e-commerce è one-time: nessun abbonamento ricorrente e nessun rinnovo automatico.",
        sortOrder: 1
      },
      {
        pageKey: "home",
        question: "I contenuti sono accessibili subito dopo il pagamento?",
        answer: "Sì, ma solo dopo conferma reale del pagamento via webhook Stripe. È questo che sblocca iscrizione e accesso ai contenuti.",
        sortOrder: 2
      },
      {
        pageKey: "home",
        question: "La piattaforma è già pronta per altri corsi?",
        answer: "Sì. Anche se al lancio c'è un solo corso pubblicato, database, admin e catalogo sono già impostati in ottica multi-corso.",
        sortOrder: 3
      },
      {
        pageKey: "home",
        question: "Posso seguire il corso mentre lavoro?",
        answer: "Sì. La base è mobile first e l'area utente organizza contenuti e progresso in modo semplice.",
        sortOrder: 4
      },
      {
        pageKey: "faq",
        question: "Il pagamento è ricorrente?",
        answer: "No. Ogni corso è acquistabile una sola volta tramite Stripe Checkout.",
        sortOrder: 1
      },
      {
        pageKey: "faq",
        question: "Serve un account per acquistare?",
        answer: "Sì. Se non autenticato, l'utente viene guidato a login o registrazione prima del checkout.",
        sortOrder: 2
      },
      {
        pageKey: "faq",
        question: "Il sito supporta nuovi corsi in futuro?",
        answer: "Sì. L'admin può creare nuovi corsi, impostare slug, prezzi, moduli, SEO e pubblicazione senza toccare il frontend.",
        sortOrder: 3
      },
      {
        courseId: course.id,
        question: "Il corso è adatto anche a chi parte da zero?",
        answer: "Sì. Il livello iniziale è foundation, con progressione chiara e contenuti pensati per dare basi forti.",
        sortOrder: 1
      },
      {
        courseId: course.id,
        question: "Ricevo accesso ai moduli in area utente?",
        answer: "Sì. Dopo il pagamento confermato il corso compare nella dashboard e diventa consultabile modulo per modulo.",
        sortOrder: 2
      }
    ]
  });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: "come-diventare-personal-trainer-in-italia",
        title: "Come diventare Personal Trainer in Italia: basi, errori da evitare e percorso giusto",
        excerpt: "Una guida chiara per capire da dove partire, come scegliere il corso e come evitare le scorciatoie più confuse.",
        categoryId: blogGuide.id,
        authorName: "Redazione Professione Fitness",
        authorRole: "Redazione",
        published: true,
        featured: true,
        publishedAt: new Date(),
        readingTime: 8,
        content: "## Da dove partire\nSe vuoi davvero lavorare nel fitness, il punto non è accumulare parole forti sul CV ma costruire basi tecniche e una presentazione professionale ordinata.\n\n## Quale corso scegliere\nUn corso serio deve spiegare struttura, docenti, modalità, competenze in uscita e rapporto fra teoria e applicazione.\n\n## Errori comuni\n- Cercare solo il prezzo più basso\n- Fermarsi alla promessa della certificazione\n- Trascurare metodo, linguaggio e relazione col cliente\n\n## Cosa fare dopo il corso\nIl passaggio decisivo è trasformare quello che impari in un profilo professionale leggibile sul mercato."
      },
      {
        slug: "certificazione-personal-trainer-cosa-conta-davvero",
        title: "Certificazione Personal Trainer: cosa conta davvero quando scegli un percorso",
        excerpt: "Non tutte le pagine che parlano di certificazioni aiutano davvero a capire. Qui trovi il quadro in modo più semplice.",
        categoryId: blogGuide.id,
        authorName: "Redazione Professione Fitness",
        authorRole: "Redazione",
        published: true,
        publishedAt: new Date(),
        readingTime: 7,
        content: "## Il problema della confusione\nMolti utenti arrivano a questa ricerca già disorientati. Per questo serve una pagina capace di spiegare bene validità, documentazione finale e spendibilità professionale.\n\n## Come leggere la promessa di un corso\nConta la struttura, conta la chiarezza, conta anche il modo in cui il percorso ti prepara a presentarti al mercato."
      },
      {
        slug: "personal-trainer-online-o-in-presenza",
        title: "Personal Trainer online o in presenza: quale formazione ti serve davvero",
        excerpt: "Le modalità contano più di quanto sembri: ecco come leggerle senza farti guidare da etichette vuote.",
        categoryId: blogCareer.id,
        authorName: "Redazione Professione Fitness",
        authorRole: "Redazione",
        published: true,
        publishedAt: new Date(),
        readingTime: 6,
        content: "## Online, presenza o ibrido\nLa modalità giusta dipende dalla fase in cui sei, dal tempo disponibile e da come impari meglio.\n\n## Come valutarla bene\nLa domanda utile non è quale etichetta suona meglio, ma se la piattaforma ti aiuta davvero a studiare e applicare."
      },
      {
        slug: "sbocchi-lavorativi-per-personal-trainer",
        title: "Sbocchi lavorativi per Personal Trainer: palestra, freelance, studio privato",
        excerpt: "Una panoramica concreta sui principali sbocchi professionali dopo il corso.",
        categoryId: blogCareer.id,
        authorName: "Redazione Professione Fitness",
        authorRole: "Redazione",
        published: true,
        publishedAt: new Date(),
        readingTime: 6,
        content: "## Le strade possibili\nPalestra, collaborazione esterna, attività freelance, percorsi ibridi.\n\n## Cosa ti rende più credibile\nUn profilo leggibile, capacità relazionale, metodo e chiarezza nella proposta."
      },
      {
        slug: "corso-fitness-riconosciuto-come-valutarlo",
        title: "Corso fitness riconosciuto: come valutarlo senza fermarti agli slogan",
        excerpt: "Una pagina utile per chi cerca chiarezza su riconoscimento, serietà del percorso e spendibilità.",
        categoryId: blogGuide.id,
        authorName: "Redazione Professione Fitness",
        authorRole: "Redazione",
        published: true,
        publishedAt: new Date(),
        readingTime: 7,
        content: "## Oltre gli slogan\nIl problema non è trovare pagine che promettono tutto. Il problema è capire quali informazioni contano davvero.\n\n## Le domande giuste\n- Chi insegna?\n- Cosa imparo in concreto?\n- Come viene strutturata l'area utente?\n- Cosa succede dopo l'acquisto?"
      }
    ]
  });

  const refreshedBlogPosts = await Promise.all([
    prisma.blogPost.update({
      where: { slug: "come-diventare-personal-trainer-in-italia" },
      data: {
        title: "Come diventare personal trainer in Italia: guida completa per iniziare davvero",
        excerpt:
          "Scopri come diventare personal trainer in Italia, quale corso scegliere, quali errori evitare e come costruire un profilo professionale credibile nel fitness.",
        readingTime: 10,
        featured: true,
        content:
          "## Come diventare personal trainer in Italia: da dove partire\nSe vuoi capire come diventare personal trainer in Italia, il primo passo e distinguere tra entusiasmo e preparazione reale. Lavorare nel fitness non significa solo conoscere gli esercizi: significa saper leggere il cliente, impostare un percorso, comunicare con chiarezza e presentarti in modo professionale.\n\n## Quale corso per personal trainer scegliere\nUn buon corso per personal trainer deve spiegare programma, docenti, modalita di studio, competenze in uscita e applicazione pratica. Prima di iscriverti, controlla sempre se il percorso affronta valutazione iniziale, tecnica degli esercizi, programmazione, relazione con il cliente e impostazione professionale del servizio.\n\n## Errori da evitare quando vuoi diventare personal trainer\n- Scegliere il percorso solo in base al prezzo\n- Pensare che basti una certificazione senza guardare il contenuto del corso\n- Trascurare pratica, metodo e comunicazione con il cliente\n- Non valutare quanto il percorso sia utile per lavorare davvero nel fitness\n\n## Cosa fare dopo il corso personal trainer\nDopo il corso, il lavoro vero inizia quando trasformi le competenze in una proposta professionale leggibile. Curriculum, presentazione, posizionamento e capacita di spiegare il tuo metodo contano quanto le nozioni tecniche.\n\n## Conclusione\nSe vuoi diventare personal trainer e lavorare in modo serio, ti serve un percorso chiaro, credibile e orientato all'applicazione. Le basi tecniche sono importanti, ma lo e anche il modo in cui impari a portarle sul mercato."
      }
    }),
    prisma.blogPost.update({
      where: { slug: "certificazione-personal-trainer-cosa-conta-davvero" },
      data: {
        title: "Certificazione personal trainer: cosa conta davvero prima di scegliere un corso",
        excerpt:
          "Vuoi capire quale certificazione personal trainer conta davvero? Ecco cosa valutare tra validita del percorso, docenti, programma e spendibilita professionale.",
        readingTime: 9,
        content:
          "## Certificazione personal trainer: perche c'e tanta confusione\nChi cerca una certificazione personal trainer spesso trova pagine piene di slogan ma povere di spiegazioni utili. Il punto non e inseguire la promessa piu forte, ma capire se il percorso ti aiuta davvero a costruire competenze e presenza professionale.\n\n## Cosa valutare prima di iscriverti a un corso\nQuando confronti una certificazione personal trainer, considera questi aspetti:\n- programma didattico e argomenti reali\n- esperienza dei docenti\n- modalita di studio e accesso ai contenuti\n- chiarezza su attestato finale e spendibilita del percorso\n- presenza di una struttura che ti accompagni davvero nello studio\n\n## Certificazione o competenze: cosa pesa di piu\nLa certificazione e importante, ma da sola non basta. Nel mercato fitness conta anche saper valutare il cliente, costruire un programma, comunicare con ordine e lavorare con un metodo riconoscibile.\n\n## Come capire se un percorso e serio\nUn corso serio non ti parla solo del titolo finale. Ti mostra chi insegna, cosa imparerai, come studierai e in che modo potrai usare quello che hai appreso nel lavoro quotidiano.\n\n## Conclusione\nSe stai cercando la migliore certificazione personal trainer, non fermarti al nome. Guarda la qualita del percorso, la chiarezza delle informazioni e la possibilita reale di trasformare lo studio in una professionalita credibile."
      }
    }),
    prisma.blogPost.update({
      where: { slug: "personal-trainer-online-o-in-presenza" },
      data: {
        title: "Corso personal trainer online o in presenza: quale formazione scegliere",
        excerpt:
          "Meglio un corso personal trainer online, in presenza o ibrido? Ecco come scegliere la formazione giusta in base a tempo, metodo di studio e obiettivi professionali.",
        readingTime: 8,
        content:
          "## Corso personal trainer online o in presenza: la domanda giusta\nMolti cercano se sia meglio un corso personal trainer online o in presenza, ma la domanda piu utile e un'altra: quale modalita ti aiuta davvero a studiare bene e ad applicare quello che impari.\n\n## Quando scegliere un corso personal trainer online\nUn corso personal trainer online puo essere la scelta giusta se lavori gia, hai poco tempo o vuoi organizzare lo studio con maggiore flessibilita. Funziona bene soprattutto quando la piattaforma e ordinata, i moduli sono chiari e i contenuti restano accessibili in modo semplice.\n\n## Quando valutare la presenza o una formula ibrida\nLa formazione in presenza puo essere utile se cerchi confronto diretto e ritualita nello studio. Una formula ibrida, invece, spesso unisce il meglio dei due mondi: flessibilita digitale e struttura piu guidata.\n\n## Cosa guardare oltre l'etichetta\n- organizzazione delle lezioni\n- facilita di accesso ai materiali\n- chiarezza del programma\n- qualita dei docenti\n- possibilita di seguire il percorso con continuita\n\n## Conclusione\nOnline, presenza o ibrido non sono parole magiche. Conta la qualita del percorso, la chiarezza della piattaforma e la tua capacita di seguire davvero il programma fino a trasformarlo in competenze operative."
      }
    }),
    prisma.blogPost.update({
      where: { slug: "sbocchi-lavorativi-per-personal-trainer" },
      data: {
        title: "Sbocchi lavorativi per personal trainer: dove puoi lavorare dopo il corso",
        excerpt:
          "Quali sono gli sbocchi lavorativi per personal trainer? Scopri opportunita in palestra, lavoro freelance, studio privato e collaborazioni nel settore fitness.",
        readingTime: 8,
        content:
          "## Sbocchi lavorativi per personal trainer: le opzioni principali\nGli sbocchi lavorativi per personal trainer possono essere piu di quanto sembri. Il percorso non porta in una sola direzione: puo aprire opportunita in palestra, nel lavoro freelance, nelle collaborazioni esterne e in progetti piu autonomi.\n\n## Lavorare in palestra come personal trainer\nLa palestra resta una delle strade piu comuni. Qui contano competenze tecniche, relazione con il cliente, capacita di lavorare in team e presentazione professionale.\n\n## Personal trainer freelance e lavoro autonomo\nMolti professionisti scelgono di lavorare come personal trainer freelance. In questo caso diventano centrali il posizionamento, la proposta, la comunicazione del servizio e la gestione dei clienti.\n\n## Studio privato, collaborazioni e percorsi ibridi\nUn personal trainer puo anche lavorare in studi specializzati, collaborare con centri fitness oppure costruire una formula mista tra presenza e digitale. Gli sbocchi lavorativi aumentano quando cresce la tua capacita di spiegare il valore di cio che fai.\n\n## Conclusione\nGli sbocchi lavorativi per personal trainer dipendono da competenze, chiarezza professionale e modo in cui ti presenti sul mercato. Un buon corso ti aiuta proprio a costruire queste basi, non solo a studiare teoria."
      }
    }),
    prisma.blogPost.update({
      where: { slug: "corso-fitness-riconosciuto-come-valutarlo" },
      data: {
        title: "Corso fitness riconosciuto: come valutarlo senza fermarti agli slogan",
        excerpt:
          "Cerchi un corso fitness riconosciuto? Leggi cosa valutare davvero tra programma, docenti, attestato finale, serieta del percorso e utilita professionale.",
        readingTime: 9,
        content:
          "## Corso fitness riconosciuto: cosa significa davvero\nQuando cerchi un corso fitness riconosciuto, rischi di incontrare molte promesse e poche spiegazioni. Per valutare bene un percorso non basta leggere una formula forte: devi capire cosa offre davvero e come ti prepara al lavoro.\n\n## Le domande da fare prima di scegliere\nSe vuoi capire se un corso fitness riconosciuto e anche serio, chiediti:\n- chi insegna e con quale esperienza\n- cosa impari in concreto\n- come sono organizzati moduli e lezioni\n- quale attestato finale ricevi\n- come puoi usare il percorso per costruire il tuo profilo professionale\n\n## Perche la struttura conta piu degli slogan\nUn corso ben costruito rende semplice orientarsi, studiare con continuita e capire il valore dei contenuti. Programma chiaro, docenti credibili e accesso ordinato fanno la differenza molto piu di una promessa generica.\n\n## Come capire se il percorso e utile anche dopo l'acquisto\nLa qualita non si misura solo prima dell'iscrizione. Conta anche cosa succede dopo: area utente, organizzazione delle lezioni, progressione dei contenuti e facilita di consultazione.\n\n## Conclusione\nSe stai valutando un corso fitness riconosciuto, guarda oltre lo slogan. Il percorso giusto e quello che ti aiuta a studiare bene, a capire il mercato e a costruire una professionalita piu credibile."
      }
    })
  ]);

  await prisma.siteSettings.create({
    data: {
      id: "site",
      siteName: "Professione Fitness Academy",
      siteTagline: "Formazione fitness professionale, chiara e credibile.",
      supportEmail: "info@professionefitnessacademy.it",
      supportPhone: "+39 06 9475 2201",
      headOffice: "Roma · supporto digitale in tutta Italia",
      heroTitle: "Trasforma la tua passione per il fitness in una professione seria.",
      heroSubtitle: "Una piattaforma premium, ordinata e SEO-first, con un solo corso live al lancio ma già pronta a crescere: Diventa un Personal Trainer.",
      heroPrimaryCtaLabel: "Scopri il corso principale",
      heroPrimaryCtaHref: "/corsi/diventa-un-personal-trainer",
      heroSecondaryCtaLabel: "Come diventare Personal Trainer",
      heroSecondaryCtaHref: "/diventare-personal-trainer",
      trustLine: "Acquisto one-time · area utente · admin multi-corso"
    }
  });

  await prisma.seoData.createMany({
    data: [
      {
        entityType: "COURSE",
        courseId: course.id,
        metaTitle: "Diventa un Personal Trainer | Corso professionale fitness",
        metaDescription: "Corso premium per diventare personal trainer con percorso chiaro, area utente, pagamento one-time e focus su spendibilità professionale."
      }
    ]
  });

  await prisma.seoData.createMany({
    data: [
      {
        entityType: "BLOG_POST",
        blogPostId: refreshedBlogPosts.find((post) => post.slug === "come-diventare-personal-trainer-in-italia")!.id,
        metaTitle: "Come diventare personal trainer in Italia: guida completa 2026",
        metaDescription: "Guida completa su come diventare personal trainer in Italia: corso da scegliere, errori da evitare, competenze richieste e primi passi nel fitness."
      },
      {
        entityType: "BLOG_POST",
        blogPostId: refreshedBlogPosts.find((post) => post.slug === "certificazione-personal-trainer-cosa-conta-davvero")!.id,
        metaTitle: "Certificazione personal trainer: cosa conta davvero prima del corso",
        metaDescription: "Scopri come valutare una certificazione personal trainer: validita del percorso, programma, docenti, attestato finale e spendibilita professionale."
      },
      {
        entityType: "BLOG_POST",
        blogPostId: refreshedBlogPosts.find((post) => post.slug === "personal-trainer-online-o-in-presenza")!.id,
        metaTitle: "Corso personal trainer online o in presenza: quale scegliere",
        metaDescription: "Corso personal trainer online, in presenza o ibrido? Confronto chiaro su vantaggi, limiti e criteri per scegliere la formazione piu adatta."
      },
      {
        entityType: "BLOG_POST",
        blogPostId: refreshedBlogPosts.find((post) => post.slug === "sbocchi-lavorativi-per-personal-trainer")!.id,
        metaTitle: "Sbocchi lavorativi per personal trainer: palestra, freelance e studio",
        metaDescription: "Leggi quali sono i principali sbocchi lavorativi per personal trainer: lavoro in palestra, attivita freelance, studio privato e collaborazioni."
      },
      {
        entityType: "BLOG_POST",
        blogPostId: refreshedBlogPosts.find((post) => post.slug === "corso-fitness-riconosciuto-come-valutarlo")!.id,
        metaTitle: "Corso fitness riconosciuto: come valutarlo davvero",
        metaDescription: "Cerchi un corso fitness riconosciuto? Ecco cosa controllare tra programma, docenti, attestato finale, serieta del percorso e accesso ai contenuti."
      }
    ]
  });

  const paidOrder = await prisma.order.create({
    data: {
      userId: student.id,
      courseId: course.id,
      status: "PAID",
      amountCents: course.salePriceCents || course.fullPriceCents,
      paymentCompletedAt: new Date()
    }
  });

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      orderId: paidOrder.id,
      progressPercent: 25
    }
  });

  console.log("\nSeed completato.");
  console.log("Admin:", admin.email, " / password: Admin123!");
  console.log("Utente demo:", student.email, " / password: Studente123!");
  console.log("Corso pubblicato:", course.slug);
  console.log("Corso bozza:", draftCourse.slug);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
