export const locales = ["en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];

export const LOCALE_STORAGE_KEY = "soda-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value != null && (locales as readonly string[]).includes(value);
}

/** First matching tag in a browser language list (`fr-CA` → `fr`), else English. */
export function localeFromBrowser(languages: readonly string[] = []): Locale {
  for (const tag of languages) {
    const base = tag.trim().toLowerCase().split(/[-_]/)[0];
    if (base === "en" || base === "es" || base === "fr") return base;
  }
  return "en";
}

export const copy = {
  en: {
    metaDescription:
      "A Design Challenge in collaboration with Fab Lab Barcelona and OCAD University",
    season: "2026 – 2027 (pilot)",
    collaboration: "In Collaboration With",
    discover: "Discover",
    join: "Join the challenge",
    joinLine1: "Join the",
    joinLine2: "challenge",
    // Circle next to the partner logos. The partner page is gone, so this opens the join form. See DESIGN_DECISIONS.md.
    becomeLine1: "Become a",
    becomeLine2: "Partner",
    becomeLabel: "Become a Partner",
    menu: "Menu",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    navCriteria: "Criteria",
    navSchedule: "Schedule",
    involved: "Get involved",
    language: "Language",
    scrollMore: "Scroll for more",
    soda: {
      kicker: "What is SOD+A?",
      title: "Schools of Discovery + Action",
      body: "SOD+A stands for Schools of Discovery + Action. It is an international design challenge for high school students where they explore ideas through creative uses of technology, share knowledge and collaborate with students in other communities, then bring their different skills and discoveries together to co-design a project that makes a lasting contribution locally.",
      quote: "You may be working locally, but knowledge is global.",
    },
    involve: {
      kicker: "How to Participate",
      title: "Connecting Students to the Challenge",
      pilot: "This pilot year, participation is by invite, or you can reach out using one of the forms on this page.",
      body: "Participating schools and labs have a facilitator, teacher, coach, or mentor to help a student group take part in the SOD+A Challenge, encouraging them to iterate, experiment, share, and document their creations and attempts on our global board. Participating schools and labs also help connect students to co-design opportunities where their newly discovered skills can be put into action to make a difference.",
    },
    // At a glance replaces the standalone cost paragraph. See DESIGN_DECISIONS.md.
    glance: {
      leadTitle: "Learn across borders",
      lead: "Share your process with students in other communities, remake and adapt each other's work, and build relationships through making.",
      fitTitle: "How it fits",
      fit: "Run SOD+A as a co-curricular activity, a class, or a collaboration with another organization. Your group chooses the format and can use the frameworks it already knows.",
      timelineTitle: "Timeline",
      timeline: "Four key dates between September and May. Smaller shared moments may happen in between.",
      whoTitle: "Who can join",
      who: "Students aged 14-18 working with a school, a makerspace, or another organization. No Fab Lab is needed. Any level of technology is welcome, from simple hand tools to laser cutters and code.",
      bringTitle: "Participating Schools & Labs",
      // Schools and labs are asked to include a facilitator. See DESIGN_DECISIONS.md.
      bring: "Include a facilitator who runs the group, such as a teacher, coach, or mentor. Student access to computers, tools or fabrication machines, and craft supplies. A project students co-design to make an impact. A willingness to share your process, such as a file, a recipe, or a series of steps, so others can remake, learn from, and adapt your work. Investment of enough time to iterate, respond to feedback, and showcase your efforts.",
      providesTitle: "SOD+A provides",
      // Structure and dates for deliverables and feedback. See DESIGN_DECISIONS.md.
      provides: "The structure facilitators need to get started, including prompts, criteria, best practices, and four key dates for deliverables and feedback. A global board for sharing, and regular group check-ins to compare notes and ask questions. No cost to join this pilot year.",
    },
    schools: {
      kicker: "Participating schools & labs",
    },
    // Intro paragraph, then two bold lead-ins. See DESIGN_DECISIONS.md.
    challenge: {
      kicker: "What is the challenge?",
      title: "See how far you can push an idea",
      intro:
        "It can be exciting to think of something you'd love to make. Sometimes you don't know where to start or how to use your skills to contribute to your community. Either way, the challenge is turning ideas into meaningful action. That is what SOD+A stands for, moving from discovery to action.",
      beats: [
        {
          title: "Discover.",
          detail:
            "Instead of a big, defined project, we add a twist. Bring an interest or start from scratch, let the randomly drawn prompts guide you somewhere new, experiment, share what you learn, and see what happens.",
        },
        {
          title: "Act.",
          detail:
            "Now you have new ideas and new skills. Put them to work with friends and your school. Work as a team to bring positive change to a community through design. Document it for the world to see.",
        },
      ],
      // Closing line links the word criteria to the criteria section. See DESIGN_DECISIONS.md.
      closeBefore: "Scroll to the ",
      closeLink: "criteria",
      closeAfter: " to see what to aim for...",
    },
    who: {
      kicker: "Who is it for?",
      title: "Students who want to make things with others",
      body: "SOD+A is for students aged 14-18 in schools, makerspaces, or Fab Labs interested in engineering, entrepreneurship, digital and product design, creative direction, project management, art and technology, or any field where ideas, initiative, collaboration, and community engagement matter.",
    },
    why: {
      kicker: "Why?",
      title: "The other side of innovation",
      // "dive deeper" replaces "dive deep". See DESIGN_DECISIONS.md.
      p1: "School gives you knowledge, skills, and structure. SOD+A gives you the experience of learning through design and community. Hands-on, collaborative discovery that's common in Fab Labs and universities but doesn't always fit into a high school curriculum. Working alongside students, Fab Labs, and universities beyond your own school, you'll dive deeper into what you're curious about, use technology to make something meaningful, and build the many skills the world needs, including creativity, curiosity, resilience, judgment, and collaboration.",
      p2: "Along the way, you build a portfolio that makes your process, decisions, and growth visible, while receiving feedback and recognition from partner schools and organizations that value these skills. It is a chance to get noticed while having fun, discovering what you can do, and learning what it means to bring your talents into the world.",
    },
    criteria: {
      kicker: "Challenge criteria",
      // Question mark removed. See DESIGN_DECISIONS.md.
      title: "Show us what you can do",
      intro:
        "Partner institutions set the criteria. Meeting them leads to levels, achievements, and certificates as you experiment, document, and share.",
    },
    schedule: {
      kicker: "Schedule",
      title: "September to May",
      intro: "The pilot year, marked on one line. Rest on a dot to read that date.",
      months: ["September", "November", "February", "May"],
    },
    joinForm: {
      title: "Join the challenge",
      intro: "Want to participate in the SOD+A Challenge? Fill this form:",
      studentChoice: "I am a student",
      facilitatorChoice: "I am a facilitator",
      studentIntro: [
        "Students are guided through the challenge by a facilitator, a teacher, coach, or mentor who helps them get started.",
        "If you heard about this challenge and want to get involved, and would like your school or friends to join, fill out this form and we will do our best to help you form a group or join one.",
      ],
      facilitatorIntro: [
        "We recognize and celebrate the many ways schools, clubs, labs, and organizations are already integrating design, making, and creativity into youth experiences or curriculum. SOD+A doesn't replace what you do; it amplifies and supports it, adding a community and platform for global sharing and student motivation. We're working to build an international network of schools, Fab Labs, and universities to encourage divergent thinking and sharing across communities, and we simply want to join forces, introduce students to incredible creative things happening around the world, and challenge them to take creative risks and learn from each other.",
        "Facilitators need access to a creative space where students can share work and ideas, but you don't need a Fab Lab or special technology. Where possible, we can help you find a makerspace or Fab Lab, or work with you to plan and program SOD+A into your current context. In short, we want creative energy, curiosity, and collaboration over complexity and large installations full of technology. We can support you through the structure and pacing of the SOD+A Challenge no matter how many resources you have access to, but it's the human part that matters most.",
      ],
      submit: "Send",
      sending: "Sending…",
      thanks: "Thank you. We will be in touch.",
      error: "Couldn't send. Try again, or email hello@sodachallenge.org.",
      activate: "Check Gmail for an email from FormSubmit, click Activate Form, then send again.",
      back: "Back to the challenge",
      name: "Name",
      email: "Email",
      age: "Age",
      schoolLevel: "School level",
      schoolOrg: "School or organization",
      guideName: "Name of a teacher or professional who can guide you",
      guideEmail: "Their email",
      interests: "Interests",
      orgName: "Name of organization",
      role: "Role",
      studentAges: "Age of students you work with",
      facilities: "Facilities you have access to",
      expertise: "Expertise in your organization that can help?",
      questions: "Any questions about the challenge?",
      hours: "How many hours a week can you cover for this activity?",
    },
    ask: {
      kicker: "The bigger picture",
      paragraphs: [
        "Our goal is to grow SOD+A as an international showcase that celebrates student action toward creativity, curiosity, and collaboration. We want to challenge students to engage in the kinds of experiences that build these skills, and to offer real feedback from the world that needs them.",
        // Second paragraph only. See DESIGN_DECISIONS.md.
        "Currently the SOD+A Challenge is a concept in action. We tested the idea last year with two schools and two partners, and saw students get excited to experiment, iterate, share, and act on their ideas through design. We are now looking at a second pilot year to expand on this, and co-designing the experience with our participants and partners.",
      ],
    },
    reach: {
      mapLabel: "World map of Schools of Discovery + Action",
      cities: {
        montreal: "Montreal",
        barcelona: "Barcelona",
        toronto: "Toronto",
        calgary: "Calgary",
        // Spelled as given. The usual spelling is Monterrey. See DESIGN_DECISIONS.md.
        monterey: "Monterey",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
        monterey: "Mexico",
      },
    },
  },
  fr: {
    metaDescription:
      "Un défi de design en collaboration avec Fab Lab Barcelona et OCAD University",
    season: "2026 – 2027 (pilote)",
    collaboration: "En collaboration avec",
    discover: "Découvrir",
    join: "Rejoindre le défi",
    joinLine1: "Rejoindre",
    joinLine2: "le défi",
    // Machine draft, needs human review.
    becomeLine1: "Devenir",
    becomeLine2: "partenaire",
    becomeLabel: "Devenir partenaire",
    menu: "Menu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    navCriteria: "Critères",
    navSchedule: "Calendrier",
    involved: "Participer",
    language: "Langue",
    scrollMore: "Continuer vers le bas",
    soda: {
      kicker: "Qu'est-ce que SOD+A ?",
      title: "Schools of Discovery + Action",
      body: "SOD+A signifie Schools of Discovery + Action (écoles de découverte + action). C'est un défi international de design pour les élèves du secondaire : ils explorent des idées par des usages créatifs de la technologie, partagent leurs connaissances et collaborent avec des élèves d'autres communautés, puis rassemblent leurs compétences et découvertes pour co-concevoir un projet qui laisse une contribution durable à l'échelle locale.",
      quote: "Vous travaillez peut-être à l'échelle locale, mais le savoir est mondial.",
    },
    involve: {
      kicker: "Comment participer",
      title: "Relier les élèves au défi",
      // Machine draft, needs human review.
      pilot: "Cette année pilote, la participation se fait sur invitation, ou vous pouvez nous joindre avec l'un des formulaires de cette page.",
      body: "Les écoles et labs participants ont un facilitateur, un enseignant, un coach ou un mentor pour aider un groupe d'élèves à prendre part au défi SOD+A, en les encourageant à itérer, expérimenter, partager et documenter leurs créations et leurs essais sur notre tableau global. Les écoles et labs participants aident aussi à relier les élèves à des occasions de co-conception où leurs compétences nouvellement découvertes peuvent être mises en action pour faire une différence.",
    },
    // Machine draft, needs human review.
    glance: {
      leadTitle: "Apprendre au-delà des frontières",
      lead: "Partagez votre processus avec des élèves d'autres communautés, refaites et adaptez le travail les uns des autres, et tissez des liens en fabriquant.",
      fitTitle: "Comment ça s'intègre",
      fit: "Menez SOD+A comme une activité parascolaire, un cours, ou une collaboration avec une autre organisation. Votre groupe choisit le format et peut utiliser les cadres qu'il connaît déjà.",
      timelineTitle: "Calendrier",
      timeline: "Quatre dates clés entre septembre et mai. De plus petits moments partagés peuvent avoir lieu entre les deux.",
      whoTitle: "Qui peut participer",
      who: "Des élèves de 14 à 18 ans qui travaillent avec une école, un espace de fabrication, ou une autre organisation. Un Fab Lab n'est pas nécessaire. Tout niveau de technologie est le bienvenu, des outils à main simples aux découpeuses laser et au code.",
      bringTitle: "Écoles et labs participants",
      // Machine draft, needs human review.
      bring: "Incluez une personne qui anime le groupe, comme un enseignant, un coach ou un mentor. Un accès des élèves à des ordinateurs, des outils ou des machines de fabrication, et du matériel d'artisanat. Un projet que les élèves co-conçoivent pour avoir un impact. Une volonté de partager votre processus, comme un fichier, une recette ou une série d'étapes, pour que d'autres puissent refaire votre travail, en tirer des leçons et l'adapter. L'investissement du temps nécessaire pour itérer, répondre aux commentaires et présenter vos efforts.",
      providesTitle: "SOD+A fournit",
      // Machine draft, needs human review.
      provides: "Le cadre dont les animateurs ont besoin pour commencer, y compris des amorces, des critères, des bonnes pratiques et quatre dates clés pour les livrables et les retours. Un tableau global pour partager, et des points réguliers en groupe pour comparer les notes et poser des questions. Aucun coût pour rejoindre cette année pilote.",
    },
    schools: {
      kicker: "Écoles et labs participants",
    },
    // Machine draft, needs human review. "un twist" and "consignes tirées au hasard" need a native speaker.
    challenge: {
      kicker: "Quel est le défi ?",
      title: "Voyez jusqu'où vous pouvez pousser une idée",
      // Machine draft, needs human review.
      intro:
        "Il peut être passionnant de penser à quelque chose que vous aimeriez fabriquer. Parfois, vous ne savez pas par où commencer, ni comment utiliser vos compétences pour contribuer à votre communauté. Dans un cas comme dans l'autre, le défi est de transformer des idées en action porteuse de sens. C'est ce que signifie SOD+A, passer de la découverte à l'action.",
      beats: [
        {
          title: "Découvrez.",
          detail:
            "Au lieu d'un grand projet défini, nous ajoutons un twist. Apportez un intérêt ou partez de zéro, laissez les consignes tirées au hasard vous guider vers quelque chose de nouveau, expérimentez, partagez ce que vous apprenez, et voyez ce qui se passe.",
        },
        {
          title: "Agissez.",
          detail:
            "Vous avez maintenant de nouvelles idées et de nouvelles compétences. Mettez-les au travail avec des amis et votre école. Travaillez en équipe pour apporter un changement positif à une communauté par le design. Documentez-le pour que le monde le voie.",
        },
      ],
      // Machine draft, needs human review.
      closeBefore: "Faites défiler jusqu'aux ",
      closeLink: "critères",
      closeAfter: " pour voir quoi viser...",
    },
    who: {
      kicker: "Pour qui ?",
      title: "Des élèves qui veulent créer avec d'autres",
      body: "SOD+A s'adresse aux élèves de 14 à 18 ans, dans les écoles, makerspaces ou Fab Labs, intéressés par l'ingénierie, l'entrepreneuriat, le design numérique et de produit, la direction créative, la gestion de projet, l'art et la technologie, ou tout domaine où comptent les idées, l'initiative, la collaboration et l'engagement communautaire.",
    },
    why: {
      kicker: "Pourquoi ?",
      title: "L'autre côté de l'innovation",
      // Machine draft, needs human review.
      p1: "L'école vous donne des connaissances, des compétences et une structure. SOD+A vous donne l'expérience d'apprendre par le design et la communauté. Une découverte collaborative et concrète, courante dans les Fab Labs et les universités, qui n'entre pas toujours dans un programme de secondaire. Aux côtés d'élèves, de Fab Labs et d'universités au-delà de votre propre école, vous irez plus au fond de ce qui vous passionne, utiliserez la technologie pour créer quelque chose de porteur de sens, et développerez les nombreuses compétences dont le monde a besoin, dont la créativité, la curiosité, la résilience, le jugement et la collaboration.",
      p2: "En chemin, vous construisez un portfolio qui rend visibles votre processus, vos décisions et votre progression, tout en recevant des commentaires et une reconnaissance d'écoles et d'organisations partenaires qui valorisent ces compétences. C'est une chance d'être vu, de s'amuser, de découvrir ce que vous pouvez faire, et d'apprendre ce que signifie porter vos talents dans le monde.",
    },
    criteria: {
      kicker: "Critères du défi",
      // Machine draft, needs human review. Question mark and the space before it removed.
      title: "Montrez-nous ce que vous savez faire",
      intro:
        "Les institutions partenaires définissent les critères. Les remplir ouvre des niveaux, des accomplissements et des certificats, pendant que vous expérimentez, documentez et partagez.",
    },
    schedule: {
      kicker: "Calendrier",
      title: "De septembre à mai",
      intro: "L'année pilote, marquée sur une ligne. Restez sur un point pour lire cette date.",
      months: ["Septembre", "Novembre", "Février", "Mai"],
    },
    joinForm: {
      title: "Rejoindre le défi",
      intro: "Vous voulez participer au défi SOD+A ? Remplissez ce formulaire :",
      studentChoice: "Je suis élève",
      facilitatorChoice: "Je suis facilitateur/facilitatrice",
      studentIntro: [
        "Les élèves sont guidés dans le défi par un facilitateur, un enseignant, un coach ou un mentor qui les aide à démarrer.",
        "Si vous avez entendu parler de ce défi et voulez vous impliquer, et que vous aimeriez que votre école ou vos amis participent, remplissez ce formulaire et nous ferons de notre mieux pour vous aider à former un groupe ou à en rejoindre un.",
      ],
      facilitatorIntro: [
        "Nous reconnaissons et célébrons les nombreuses façons dont les écoles, les clubs, les labs et les organisations intègrent déjà le design, le faire et la créativité dans les expériences ou les programmes des jeunes. SOD+A ne remplace pas ce que vous faites ; il l'amplifie et le soutient, en ajoutant une communauté et une plateforme pour le partage mondial et la motivation des élèves. Nous travaillons à bâtir un réseau international d'écoles, de Fab Labs et d'universités pour encourager la pensée divergente et le partage entre communautés, et nous voulons simplement unir nos forces, faire découvrir aux élèves les choses créatives extraordinaires qui se passent dans le monde, et les mettre au défi de prendre des risques créatifs et d'apprendre les uns des autres.",
        "Les facilitateurs ont besoin d'accès à un espace créatif où les élèves peuvent partager leur travail et leurs idées, mais vous n'avez pas besoin d'un Fab Lab ni d'une technologie particulière. Quand c'est possible, nous pouvons vous aider à trouver un makerspace ou un Fab Lab, ou travailler avec vous pour planifier et intégrer SOD+A dans votre contexte actuel. En bref, nous voulons de l'énergie créative, de la curiosité et de la collaboration, plutôt que de la complexité et de grandes installations pleines de technologie. Nous pouvons vous accompagner dans la structure et le rythme du défi SOD+A, quels que soient les moyens dont vous disposez, mais c'est la part humaine qui compte le plus.",
      ],
      submit: "Envoyer",
      sending: "Envoi…",
      thanks: "Merci. Nous vous écrirons.",
      error: "L'envoi a échoué. Réessayez, ou écrivez à hello@sodachallenge.org.",
      activate: "Vérifiez Gmail, ouvrez le courriel de FormSubmit, cliquez sur Activate Form, puis renvoyez.",
      back: "Retour au défi",
      name: "Nom",
      email: "Courriel",
      age: "Âge",
      schoolLevel: "Niveau scolaire",
      schoolOrg: "École ou organisation",
      guideName: "Nom d'un enseignant ou d'un professionnel qui peut vous accompagner",
      guideEmail: "Son courriel",
      interests: "Intérêts",
      orgName: "Nom de l'organisation",
      role: "Rôle",
      studentAges: "Âge des élèves avec qui vous travaillez",
      facilities: "Installations auxquelles vous avez accès",
      expertise: "Quelle expertise dans votre organisation peut aider ?",
      questions: "Des questions sur le défi ?",
      hours: "Combien d'heures par semaine pouvez-vous consacrer à cette activité ?",
    },
    ask: {
      kicker: "Le tableau d'ensemble",
      // Machine draft, needs human review.
      paragraphs: [
        "Notre objectif est de faire grandir SOD+A comme vitrine internationale qui célèbre l'action des élèves vers la créativité, la curiosité et la collaboration. Nous voulons mettre les élèves au défi de vivre le genre d'expériences qui construisent ces compétences, et leur offrir de vrais retours du monde qui en a besoin.",
        "Actuellement, le SOD+A Challenge est un concept en action. Nous avons testé l'idée l'an dernier avec deux écoles et deux partenaires, et nous avons vu des élèves s'enthousiasmer pour expérimenter, itérer, partager et agir sur leurs idées par le design. Nous envisageons maintenant une deuxième année pilote pour aller plus loin, et nous co-concevons l'expérience avec nos participants et nos partenaires.",
      ],
    },
    reach: {
      mapLabel: "Carte du monde des Schools of Discovery + Action",
      cities: {
        montreal: "Montréal",
        barcelona: "Barcelone",
        toronto: "Toronto",
        calgary: "Calgary",
        // Machine draft, needs human review. Spelling kept as given.
        monterey: "Monterey",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
        // Machine draft, needs human review.
        monterey: "Mexique",
      },
    },
  },
  es: {
    metaDescription:
      "Un reto de diseño en colaboración con Fab Lab Barcelona y OCAD University",
    season: "2026 – 2027 (piloto)",
    collaboration: "En colaboración con",
    discover: "Descubre",
    join: "Únete al reto",
    joinLine1: "Únete al",
    joinLine2: "reto",
    // Machine draft, needs human review.
    becomeLine1: "Hazte",
    becomeLine2: "socio",
    becomeLabel: "Hazte socio",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    navCriteria: "Criterios",
    navSchedule: "Calendario",
    involved: "Participa",
    language: "Idioma",
    scrollMore: "Sigue bajando",
    soda: {
      kicker: "¿Qué es SOD+A?",
      title: "Schools of Discovery + Action",
      body: "SOD+A significa Schools of Discovery + Action (Escuelas de Descubrimiento + Acción). Es un reto internacional de diseño para estudiantes de secundaria en el que exploran ideas a través de usos creativos de la tecnología, comparten conocimiento y colaboran con estudiantes de otras comunidades, y luego reúnen distintas habilidades y descubrimientos para co-diseñar un proyecto que deje una contribución duradera en lo local.",
      quote: "Puedes estar trabajando en lo local, pero el conocimiento es global.",
    },
    involve: {
      kicker: "Cómo participar",
      title: "Conectar a los estudiantes con el reto",
      // Machine draft, needs human review.
      pilot: "Este año piloto, la participación es por invitación, o puedes escribirnos con uno de los formularios de esta página.",
      body: "Las escuelas y labs participantes cuentan con un facilitador, docente, coach o mentor para ayudar a un grupo de estudiantes a participar en el Reto SOD+A, animándolos a iterar, experimentar, compartir y documentar sus creaciones e intentos en nuestro tablero global. Las escuelas y labs participantes también ayudan a conectar a los estudiantes con oportunidades de co-diseño donde sus habilidades recién descubiertas pueden ponerse en acción para marcar una diferencia.",
    },
    // Machine draft, needs human review.
    glance: {
      leadTitle: "Aprender entre fronteras",
      lead: "Comparte tu proceso con estudiantes de otras comunidades, rehace y adapta el trabajo de los demás, y construye relaciones a través de hacer.",
      fitTitle: "Cómo encaja",
      fit: "Lleva SOD+A como una actividad extracurricular, una clase, o una colaboración con otra organización. Tu grupo elige el formato y puede usar los marcos que ya conoce.",
      timelineTitle: "Calendario",
      timeline: "Cuatro fechas clave entre septiembre y mayo. Pueden ocurrir momentos compartidos más pequeños entre medias.",
      whoTitle: "Quién puede unirse",
      who: "Estudiantes de 14 a 18 años que trabajan con una escuela, un espacio de fabricación u otra organización. No hace falta un Fab Lab. Cualquier nivel de tecnología es bienvenido, desde herramientas de mano sencillas hasta cortadoras láser y código.",
      bringTitle: "Escuelas y labs participantes",
      // Machine draft, needs human review.
      bring: "Incluye a una persona que dirige el grupo, como un docente, un coach o un mentor. Acceso de los estudiantes a computadoras, herramientas o máquinas de fabricación, y materiales de manualidades. Un proyecto que los estudiantes co-diseñan para generar un impacto. La disposición a compartir tu proceso, como un archivo, una receta o una serie de pasos, para que otros puedan rehacer tu trabajo, aprender de él y adaptarlo. La inversión de tiempo suficiente para iterar, responder a los comentarios y mostrar tus esfuerzos.",
      providesTitle: "SOD+A aporta",
      // Machine draft, needs human review.
      provides: "La estructura que las personas facilitadoras necesitan para empezar, incluidas consignas, criterios, buenas prácticas y cuatro fechas clave para entregas y comentarios. Un tablero global para compartir, y encuentros regulares del grupo para comparar notas y hacer preguntas. Sin costo para unirse este año piloto.",
    },
    schools: {
      kicker: "Escuelas y labs participantes",
    },
    // Machine draft, needs human review. "un giro inesperado" and "consignas al azar" need a native speaker.
    challenge: {
      kicker: "¿Qué es el reto?",
      title: "Mira hasta dónde puedes empujar una idea",
      // Machine draft, needs human review.
      intro:
        "Puede ser emocionante pensar en algo que te encantaría hacer. A veces no sabes por dónde empezar, o cómo usar tus habilidades para contribuir a tu comunidad. De cualquier modo, el reto es convertir ideas en acción con sentido. Eso es lo que significa SOD+A, pasar del descubrimiento a la acción.",
      beats: [
        {
          title: "Descubre.",
          detail:
            "En lugar de un proyecto grande y definido, añadimos un giro inesperado. Trae un interés o empieza de cero, deja que las consignas al azar te guíen a un lugar nuevo, experimenta, comparte lo que aprendes y mira qué pasa.",
        },
        {
          title: "Actúa.",
          detail:
            "Ahora tienes ideas nuevas y habilidades nuevas. Ponlas a trabajar con amigos y tu escuela. Trabaja en equipo para llevar un cambio positivo a una comunidad a través del diseño. Documéntalo para que el mundo lo vea.",
        },
      ],
      // Machine draft, needs human review.
      closeBefore: "Desplázate hasta los ",
      closeLink: "criterios",
      closeAfter: " para ver hacia dónde apuntar...",
    },
    who: {
      kicker: "¿Para quién es?",
      title: "Estudiantes que quieren crear con otras personas",
      body: "SOD+A es para estudiantes de 14 a 18 años en escuelas, makerspaces o Fab Labs interesados en ingeniería, emprendimiento, diseño digital y de producto, dirección creativa, gestión de proyectos, arte y tecnología, o cualquier campo en el que importen las ideas, la iniciativa, la colaboración y el compromiso con la comunidad.",
    },
    why: {
      kicker: "¿Por qué?",
      title: "El otro lado de la innovación",
      // Machine draft, needs human review.
      p1: "La escuela te da conocimiento, habilidades y estructura. SOD+A te da la experiencia de aprender a través del diseño y la comunidad. Un descubrimiento colaborativo y práctico, habitual en Fab Labs y universidades, que no siempre encaja en un currículo de secundaria. Trabajando junto a estudiantes, Fab Labs y universidades más allá de tu propia escuela, profundizarás más en lo que te interesa, usarás la tecnología para hacer algo con sentido, y desarrollarás las muchas habilidades que el mundo necesita, entre ellas la creatividad, la curiosidad, la resiliencia, el criterio y la colaboración.",
      p2: "Por el camino, construyes un portafolio que hace visible tu proceso, tus decisiones y tu crecimiento, mientras recibes comentarios y reconocimiento de escuelas y organizaciones colaboradoras que valoran estas habilidades. Es una oportunidad de que te vean, de divertirte, de descubrir lo que puedes hacer y de aprender lo que significa llevar tu talento al mundo.",
    },
    criteria: {
      kicker: "Criterios del reto",
      // Machine draft, needs human review. Opening and closing question marks removed.
      title: "Nos enseñas lo que sabes hacer",
      intro:
        "Las instituciones colaboradoras marcan los criterios. Cumplirlos abre niveles, logros y certificados mientras experimentas, documentas y compartes.",
    },
    schedule: {
      kicker: "Calendario",
      title: "De septiembre a mayo",
      intro: "El año piloto, marcado en una línea. Descansa sobre un punto para leer esa fecha.",
      months: ["Septiembre", "Noviembre", "Febrero", "Mayo"],
    },
    joinForm: {
      title: "Únete al reto",
      intro: "¿Quieres participar en el Reto SOD+A? Completa este formulario:",
      studentChoice: "Soy estudiante",
      facilitatorChoice: "Soy facilitador/a",
      studentIntro: [
        "Los estudiantes recorren el reto guiados por un facilitador, un docente, un coach o un mentor que les ayuda a empezar.",
        "Si te enteraste de este reto y quieres participar, y te gustaría que tu escuela o tus amigos se sumen, completa este formulario y haremos lo posible por ayudarte a formar un grupo o a unirte a uno.",
      ],
      facilitatorIntro: [
        "Reconocemos y celebramos las muchas formas en que escuelas, clubes, labs y organizaciones ya integran el diseño, el hacer y la creatividad en las experiencias o el currículo de los jóvenes. SOD+A no reemplaza lo que haces; lo amplifica y lo apoya, sumando una comunidad y una plataforma para el intercambio global y la motivación de los estudiantes. Estamos construyendo una red internacional de escuelas, Fab Labs y universidades para alentar el pensamiento divergente y el intercambio entre comunidades, y simplemente queremos unir fuerzas, acercar a los estudiantes a las cosas creativas increíbles que ocurren en el mundo, y retarlos a tomar riesgos creativos y a aprender unos de otros.",
        "Los facilitadores necesitan acceso a un espacio creativo donde los estudiantes puedan compartir trabajo e ideas, pero no necesitas un Fab Lab ni tecnología especial. Cuando es posible, podemos ayudarte a encontrar un makerspace o un Fab Lab, o trabajar contigo para planear e integrar SOD+A en tu contexto actual. En resumen, queremos energía creativa, curiosidad y colaboración por encima de la complejidad y de grandes instalaciones llenas de tecnología. Podemos acompañarte en la estructura y el ritmo del Reto SOD+A sin importar cuántos recursos tengas a mano, pero lo que más importa es la parte humana.",
      ],
      submit: "Enviar",
      sending: "Enviando…",
      thanks: "Gracias. Nos pondremos en contacto.",
      error: "No se pudo enviar. Inténtalo de nuevo, o escribe a hello@sodachallenge.org.",
      activate: "Revisa Gmail, abre el correo de FormSubmit, pulsa Activate Form y vuelve a enviar.",
      back: "Volver al reto",
      name: "Nombre",
      email: "Correo",
      age: "Edad",
      schoolLevel: "Nivel escolar",
      schoolOrg: "Escuela u organización",
      guideName: "Nombre de un profesor o profesional que pueda guiarte",
      guideEmail: "Su correo",
      interests: "Intereses",
      orgName: "Nombre de la organización",
      role: "Rol",
      studentAges: "Edad del estudiantado con el que trabajas",
      facilities: "Instalaciones a las que tienes acceso",
      expertise: "¿Qué experiencia hay en tu organización que pueda ayudar?",
      questions: "¿Alguna pregunta sobre el reto?",
      hours: "¿Cuántas horas a la semana puedes dedicar a esta actividad?",
    },
    ask: {
      kicker: "El panorama general",
      // Machine draft, needs human review.
      paragraphs: [
        "Nuestra meta es hacer crecer SOD+A como una vitrina internacional que celebra la acción de los estudiantes hacia la creatividad, la curiosidad y la colaboración. Queremos retar a los estudiantes a participar en el tipo de experiencias que construyen estas habilidades, y ofrecer comentarios reales del mundo que las necesita.",
        "Actualmente, el SOD+A Challenge es un concepto en acción. Probamos la idea el año pasado con dos escuelas y dos partners, y vimos a los estudiantes entusiasmarse por experimentar, iterar, compartir y actuar sobre sus ideas a través del diseño. Ahora miramos un segundo año piloto para ampliar esto, y estamos co-diseñando la experiencia con nuestros participantes y partners.",
      ],
    },
    reach: {
      mapLabel: "Mapa del mundo de Schools of Discovery + Action",
      cities: {
        montreal: "Montreal",
        barcelona: "Barcelona",
        toronto: "Toronto",
        calgary: "Calgary",
        // Machine draft, needs human review. Spelling kept as given.
        monterey: "Monterey",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
        // Machine draft, needs human review.
        monterey: "México",
      },
    },
  },
} as const;
