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
      pilot: "This pilot year is by invite or you can reach out using one of the forms on this page.",
      body: "Participating schools and labs have a facilitator, teacher, coach, or mentor to help a student group take part in the SOD+A Challenge, encouraging them to iterate, experiment, share and document their creations and attempts on our global board. Participating schools and labs also help connect students to co-design opportunities where their newly discovered skills can be put into action to make a difference.",
    },
    schools: {
      kicker: "Participating schools & labs",
    },
    challenge: {
      kicker: "What is the challenge?",
      title: "See how far you can take an idea",
      body: "The challenge is to see how far you can take an idea: experiment, learn new skills, get feedback, make changes, share what you discover, put it into action, and meet criteria set by partner institutions. Along the way, you build a portfolio and develop the creative, technical, and human skills universities and innovative organizations are looking for.",
    },
    who: {
      kicker: "Who is it for?",
      title: "Students who want to make things with others",
      body: "SOD+A is for students aged 14-18 in schools, makerspaces, or Fab Labs interested in engineering, entrepreneurship, digital and product design, creative direction, project management, art and technology, or any field where ideas, initiative, collaboration, and community engagement matter.",
    },
    why: {
      kicker: "Why?",
      title: "The other side of innovation",
      p1: "School gives you knowledge, skills, and structure. SOD+A gives you the experience of learning through design and community. Hands-on, collaborative discovery that's common in Fab Labs and universities but doesn't always fit into a high school curriculum. Working alongside students, Fab Labs, and universities beyond your own school, you'll dive deep into what you're curious about, use technology to make something meaningful, and build the skills the world actually needs more of. Creativity, resilience, judgment, collaboration.",
      p2: "Along the way, you build a portfolio that makes your process, decisions, and growth visible, while receiving feedback and recognition from partner schools and organizations that value these skills. It is a chance to get noticed while having fun, discovering what you can do, and learning what it means to bring your talents into the world.",
    },
    how: {
      kicker: "How does it work?",
      title: "Join a local group. Share a global process.",
      p1: "You join a local group and identify a project you can co-design in your community. Then you head into a studio, lab, classroom, makerspace, or other creative space to experiment with ideas, materials, and technologies.",
      p2: "Curated random prompts and creative constraints push you toward unexpected combinations, new skills, and ideas you may not have explored on your own.",
      p3: "Along the way, you document and share what you learn, see what students in other communities are discovering, receive feedback, make changes, and bring your discoveries back into the collective project.",
      p4: "The challenge is to keep developing your ideas, share what you know, respond to feedback, put your learning into action, and meet the criteria set by partner institutions.",
    },
    criteria: {
      kicker: "Challenge criteria",
      title: "Show us what you can do?",
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
        "Currently the SOD+A Challenge is a concept in action. We have had one very successful year and participants and partners are excited to return. We are co-designing this experience together.",
        "The SOD+A Challenge provides a creative platform for students to make and share, while facilitators work with them to motivate and support their journey through discovery and action. Right now there is no cost to joining, only a modest amount of time and energy to make the most of the experience and to encourage students to share and document their work, so they can receive feedback and meet the program's criteria.",
      ],
    },
    reach: {
      mapLabel: "World map of Schools of Discovery + Action",
      cities: {
        montreal: "Montreal",
        barcelona: "Barcelona",
        toronto: "Toronto",
        calgary: "Calgary",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
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
      pilot: "Cette année pilote se fait sur invitation, ou vous pouvez nous joindre avec l'un des formulaires de cette page.",
      body: "Les écoles et labs participants ont un facilitateur, un enseignant, un coach ou un mentor pour aider un groupe d'élèves à prendre part au défi SOD+A, en les encourageant à itérer, expérimenter, partager et documenter leurs créations et leurs essais sur notre tableau global. Les écoles et labs participants aident aussi à relier les élèves à des occasions de co-conception où leurs compétences nouvellement découvertes peuvent être mises en action pour faire une différence.",
    },
    schools: {
      kicker: "Écoles et labs participants",
    },
    challenge: {
      kicker: "Quel est le défi ?",
      title: "Voir jusqu'où une idée peut aller",
      body: "Le défi consiste à voir jusqu'où vous pouvez mener une idée : expérimenter, apprendre de nouvelles compétences, recevoir des commentaires, faire des changements, partager ce que vous découvrez, passer à l'action et répondre aux critères des institutions partenaires. En chemin, vous construisez un portfolio et développez les compétences créatives, techniques et humaines que recherchent les universités et les organisations innovantes.",
    },
    who: {
      kicker: "Pour qui ?",
      title: "Des élèves qui veulent créer avec d'autres",
      body: "SOD+A s'adresse aux élèves de 14 à 18 ans, dans les écoles, makerspaces ou Fab Labs, intéressés par l'ingénierie, l'entrepreneuriat, le design numérique et de produit, la direction créative, la gestion de projet, l'art et la technologie, ou tout domaine où comptent les idées, l'initiative, la collaboration et l'engagement communautaire.",
    },
    why: {
      kicker: "Pourquoi ?",
      title: "L'autre côté de l'innovation",
      p1: "L'école vous donne des connaissances, des compétences et une structure. SOD+A vous donne l'expérience d'apprendre par le design et la communauté. Une découverte collaborative et concrète, courante dans les Fab Labs et les universités, qui n'entre pas toujours dans un programme de secondaire. Aux côtés d'élèves, de Fab Labs et d'universités au-delà de votre propre école, vous irez au fond de ce qui vous passionne, utiliserez la technologie pour créer quelque chose de porteur de sens, et développerez les compétences dont le monde a réellement le plus besoin. Créativité, résilience, jugement, collaboration.",
      p2: "En chemin, vous construisez un portfolio qui rend visibles votre processus, vos décisions et votre progression, tout en recevant des commentaires et une reconnaissance d'écoles et d'organisations partenaires qui valorisent ces compétences. C'est une chance d'être vu, de s'amuser, de découvrir ce que vous pouvez faire, et d'apprendre ce que signifie porter vos talents dans le monde.",
    },
    how: {
      kicker: "Comment ça marche ?",
      title: "Rejoindre un groupe local. Partager un processus mondial.",
      p1: "Vous rejoignez un groupe local et identifiez un projet que vous pouvez co-concevoir dans votre communauté. Puis vous entrez dans un atelier, un labo, une classe, un makerspace ou un autre espace créatif pour expérimenter avec des idées, des matériaux et des technologies.",
      p2: "Des consignes aléatoires choisies et des contraintes créatives vous poussent vers des combinaisons inattendues, de nouvelles compétences et des idées que vous n'auriez peut-être pas explorées seul.",
      p3: "En chemin, vous documentez et partagez ce que vous apprenez, voyez ce que découvrent des élèves d'autres communautés, recevez des commentaires, faites des changements et ramenez vos découvertes dans le projet collectif.",
      p4: "Le défi est de continuer à développer vos idées, de partager ce que vous savez, de répondre aux commentaires, de mettre l'apprentissage en action, et de répondre aux critères des institutions partenaires.",
    },
    criteria: {
      kicker: "Critères du défi",
      title: "Montrez-nous ce que vous savez faire ?",
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
      paragraphs: [
        "Actuellement, le SOD+A Challenge est un concept en action. Nous avons connu une année très réussie, et les participants comme les partenaires ont hâte de revenir. Nous co-concevons cette expérience ensemble.",
        "Le SOD+A Challenge offre aux élèves une plateforme créative pour faire et partager, pendant que les facilitateurs travaillent avec eux pour les motiver et soutenir leur parcours de découverte et d'action. Pour l'instant, rejoindre ne coûte rien, seulement une quantité modeste de temps et d'énergie pour tirer le meilleur de l'expérience et encourager les élèves à partager et documenter leur travail, afin qu'ils puissent recevoir des commentaires et répondre aux critères du programme.",
      ],
    },
    reach: {
      mapLabel: "Carte du monde des Schools of Discovery + Action",
      cities: {
        montreal: "Montréal",
        barcelona: "Barcelone",
        toronto: "Toronto",
        calgary: "Calgary",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
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
      pilot: "Este año piloto es por invitación, o puedes escribirnos con uno de los formularios de esta página.",
      body: "Las escuelas y labs participantes cuentan con un facilitador, docente, coach o mentor para ayudar a un grupo de estudiantes a participar en el Reto SOD+A, animándolos a iterar, experimentar, compartir y documentar sus creaciones e intentos en nuestro tablero global. Las escuelas y labs participantes también ayudan a conectar a los estudiantes con oportunidades de co-diseño donde sus habilidades recién descubiertas pueden ponerse en acción para marcar una diferencia.",
    },
    schools: {
      kicker: "Escuelas y labs participantes",
    },
    challenge: {
      kicker: "¿Qué es el reto?",
      title: "A ver hasta dónde puedes llevar una idea",
      body: "El reto consiste en ver hasta dónde puedes llevar una idea: experimentar, aprender nuevas habilidades, recibir comentarios, hacer cambios, compartir lo que descubres, ponerlo en práctica y cumplir los criterios de las instituciones colaboradoras. Por el camino, construyes un portafolio y desarrollas las habilidades creativas, técnicas y humanas que buscan las universidades y las organizaciones innovadoras.",
    },
    who: {
      kicker: "¿Para quién es?",
      title: "Estudiantes que quieren crear con otras personas",
      body: "SOD+A es para estudiantes de 14 a 18 años en escuelas, makerspaces o Fab Labs interesados en ingeniería, emprendimiento, diseño digital y de producto, dirección creativa, gestión de proyectos, arte y tecnología, o cualquier campo en el que importen las ideas, la iniciativa, la colaboración y el compromiso con la comunidad.",
    },
    why: {
      kicker: "¿Por qué?",
      title: "El otro lado de la innovación",
      p1: "La escuela te da conocimiento, habilidades y estructura. SOD+A te da la experiencia de aprender a través del diseño y la comunidad. Un descubrimiento colaborativo y práctico, habitual en Fab Labs y universidades, que no siempre encaja en un currículo de secundaria. Trabajando junto a estudiantes, Fab Labs y universidades más allá de tu propia escuela, profundizarás en lo que te interesa, usarás la tecnología para hacer algo con sentido y desarrollarás las habilidades que el mundo realmente necesita más. Creatividad, resiliencia, criterio, colaboración.",
      p2: "Por el camino, construyes un portafolio que hace visible tu proceso, tus decisiones y tu crecimiento, mientras recibes comentarios y reconocimiento de escuelas y organizaciones colaboradoras que valoran estas habilidades. Es una oportunidad de que te vean, de divertirte, de descubrir lo que puedes hacer y de aprender lo que significa llevar tu talento al mundo.",
    },
    how: {
      kicker: "¿Cómo funciona?",
      title: "Únete a un grupo local. Comparte un proceso global.",
      p1: "Te unes a un grupo local e identificas un proyecto que puedas co-diseñar en tu comunidad. Luego entras a un estudio, laboratorio, aula, makerspace u otro espacio creativo para experimentar con ideas, materiales y tecnologías.",
      p2: "Indicaciones aleatorias curadas y restricciones creativas te empujan hacia combinaciones inesperadas, nuevas habilidades e ideas que quizá no habrías explorado por tu cuenta.",
      p3: "Por el camino, documentas y compartes lo que aprendes, ves lo que descubren estudiantes de otras comunidades, recibes comentarios, haces cambios y llevas tus descubrimientos de vuelta al proyecto colectivo.",
      p4: "El reto es seguir desarrollando tus ideas, compartir lo que sabes, responder a los comentarios, poner el aprendizaje en práctica y cumplir los criterios de las instituciones colaboradoras.",
    },
    criteria: {
      kicker: "Criterios del reto",
      title: "¿Nos enseñas lo que sabes hacer?",
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
      paragraphs: [
        "Actualmente, el SOD+A Challenge es un concepto en acción. Hemos tenido un año muy exitoso y los participantes y los socios tienen ganas de volver. Estamos co-diseñando esta experiencia juntos.",
        "El SOD+A Challenge ofrece a los estudiantes una plataforma creativa para hacer y compartir, mientras los facilitadores trabajan con ellos para motivarlos y apoyar su recorrido de descubrimiento y acción. Ahora mismo no hay costo por unirse, solo una cantidad modesta de tiempo y energía para aprovechar al máximo la experiencia y animar a los estudiantes a compartir y documentar su trabajo, para que puedan recibir comentarios y cumplir los criterios del programa.",
      ],
    },
    reach: {
      mapLabel: "Mapa del mundo de Schools of Discovery + Action",
      cities: {
        montreal: "Montreal",
        barcelona: "Barcelona",
        toronto: "Toronto",
        calgary: "Calgary",
      },
      places: {
        montreal: "Lower Canada College",
        barcelona: "Fab Lab Barcelona",
        toronto: "OCAD University",
        calgary: "",
      },
    },
  },
} as const;
