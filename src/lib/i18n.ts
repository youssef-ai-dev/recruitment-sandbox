// ============================================================
// INTERNATIONALIZATION — Translations for JD & Interview Guide
// ============================================================

export type Locale = 'en' | 'ar' | 'es' | 'fr';

export const LOCALES: { code: Locale; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'fr', label: 'Français', dir: 'ltr' },
];

export interface Translations {
  // JD Sections
  aboutTheRole: string;
  whatYouWillDo: string;
  whatYouWillBring: string;
  niceToHave: string;
  keySkills: string;
  whatWeOffer: string;
  // JD Meta
  fullTime: string;
  remoteHybrid: string;
  allLevels: string;
  proficiencyIn: string;
  strongSkills: string;
  yearsOfExperience: string;
  // Generic responsibilities
  genericResp1: string;
  genericResp2: string;
  genericResp3: string;
  genericResp4: string;
  genericResp5: string;
  leverageData: string;
  mentorDevelop: string;
  // Generic qualifications
  genericQual1: string;
  genericQual2: string;
  genericQual3: string;
  // What we offer
  offer1: string;
  offer2: string;
  offer3: string;
  offer4: string;
  offer5: string;
  // EOE
  eoe: string;
  // Interview Guide
  interviewGuide: string;
  behavioralQuestions: string;
  starFormat: string;
  technical: string;
  softSkill: string;
  general: string;
  whatToListenFor: string;
  // Generator helpers
  lookingFor: string;
  withExperience: string;
  toJoinOurTeam: string;
  inThisRole: string;
  theIdealCandidate: string;
  relevantExperience: string;
}

const EN: Translations = {
  aboutTheRole: 'About the Role',
  whatYouWillDo: "What You'll Do",
  whatYouWillBring: "What You'll Bring",
  niceToHave: 'Nice to Have',
  keySkills: 'Key Skills',
  whatWeOffer: 'What We Offer',
  fullTime: 'Full-time',
  remoteHybrid: 'Remote / Hybrid',
  allLevels: 'All levels',
  proficiencyIn: 'Proficiency in',
  strongSkills: 'skills.',
  yearsOfExperience: 'of relevant professional experience.',
  genericResp1: 'Define and drive the strategic vision and roadmap for your area of ownership.',
  genericResp2: 'Collaborate cross-functionally with engineering, design, and business partners to deliver high-impact outcomes.',
  genericResp3: 'Analyze data and metrics to identify opportunities, inform decisions, and measure success.',
  genericResp4: 'Communicate progress, insights, and recommendations clearly to stakeholders at all levels.',
  genericResp5: 'Foster a culture of continuous improvement, experimentation, and accountability within the team.',
  leverageData: 'Leverage data analysis tools and techniques to uncover actionable insights.',
  mentorDevelop: 'Mentor and develop team members, fostering their professional growth.',
  genericQual1: 'Relevant professional experience in a similar role.',
  genericQual2: 'Strong problem-solving and analytical abilities.',
  genericQual3: 'Excellent communication and collaboration skills.',
  offer1: 'Competitive compensation package with equity options.',
  offer2: 'Comprehensive health, dental, and vision insurance.',
  offer3: 'Flexible work arrangements — remote-friendly with optional in-office collaboration.',
  offer4: 'Professional development budget and continuous learning opportunities.',
  offer5: 'Generous PTO policy and company-wide wellness days.',
  eoe: 'We are an equal opportunity employer and value diversity. We do not discriminate on the basis of race, religion, color, national origin, gender, sexual orientation, age, marital status, veteran status, or disability status.',
  interviewGuide: 'Interview Guide',
  behavioralQuestions: 'behavioral questions',
  starFormat: 'STAR format recommended',
  technical: 'Technical',
  softSkill: 'Soft Skill',
  general: 'General',
  whatToListenFor: 'What to listen for',
  lookingFor: "We're looking for a",
  withExperience: 'with',
  toJoinOurTeam: 'to join our team and make an immediate impact.',
  inThisRole: "In this role, you'll be responsible for",
  theIdealCandidate: 'The ideal candidate brings expertise in',
  relevantExperience: 'of experience',
};

const AR: Translations = {
  aboutTheRole: 'عن الوظيفة',
  whatYouWillDo: 'ماذا ستفعل',
  whatYouWillBring: 'ماذا ستحضر',
  niceToHave: 'من الجيد أن تمتلك',
  keySkills: 'المهارات الرئيسية',
  whatWeOffer: 'ما نقدمه',
  fullTime: 'دوام كامل',
  remoteHybrid: 'عن بُعد / هجين',
  allLevels: 'جميع المستويات',
  proficiencyIn: 'إجادة',
  strongSkills: 'مهارات.',
  yearsOfExperience: 'من الخبرة المهنية ذات الصلة.',
  genericResp1: 'تحديد الرؤية الاستراتيجية وخارطة الطريق لمجال مسؤوليتك وقيادتها.',
  genericResp2: 'التعاون متعدد الوظائف مع الهندسة والتصميم وشركاء الأعمال لتحقيق نتائج عالية التأثير.',
  genericResp3: 'تحليل البيانات والمقاييس لتحديد الفرص وإبلاغ القرارات وقياس النجاح.',
  genericResp4: 'التواصل بتقدم ورؤى وتوصيات واضحة لأصحاب المصلحة على جميع المستويات.',
  genericResp5: 'تعزيز ثقافة التحسين المستمر والتجريب والمساءلة داخل الفريق.',
  leverageData: 'استخدام أدوات وتقنيات تحليل البيانات للكشف عن رؤى قابلة للتنفيذ.',
  mentorDevelop: 'توجيه وتطوير أعضاء الفريق وتعزيز نموهم المهني.',
  genericQual1: 'خبرة مهنية ذات صلة في دور مماثل.',
  genericQual2: 'قدرات قوية في حل المشكلات والتفكير التحليلي.',
  genericQual3: 'مهارات تواصل وتعاون ممتازة.',
  offer1: 'حزمة تعويضات تنافسية مع خيارات الأسهم.',
  offer2: 'تأمين شامل على الصحة والأسنان والرؤية.',
  offer3: 'ترتيبات عمل مرنة — صديقة للعمل عن بُعد مع تعاون اختياري في المكتب.',
  offer4: 'ميزانية التطوير المهني وفرص التعلم المستمر.',
  offer5: 'سياسة سخية للإجازات المدفوعة وأيام العافية على مستوى الشركة.',
  eoe: 'نحن صاحب عمل يتيح فرصاً متساوية ونقدر التنوع. لا نميز على أساس العرق أو الدين أو اللون أو الأصل القومي أو الجنس أو التوجه الجنسي أو العمر أو الحالة الاجتماعية أو حالة المحارب القدامى أو الإعاقة.',
  interviewGuide: 'دليل المقابلة',
  behavioralQuestions: 'أسئلة سلوكية',
  starFormat: 'يُنصح باستخدام طريقة STAR',
  technical: 'تقني',
  softSkill: 'مهارة شخصية',
  general: 'عام',
  whatToListenFor: 'ما الذي يجب الاستماع إليه',
  lookingFor: 'نبحث عن',
  withExperience: 'بخبرة',
  toJoinOurTeam: 'للانضمام إلى فريقنا وإحداث تأثير فوري.',
  inThisRole: 'في هذا الدور، ستكون مسؤولاً عن',
  theIdealCandidate: 'يجلب المرشح المثالي خبرة في',
  relevantExperience: 'من الخبرة',
};

const ES: Translations = {
  aboutTheRole: 'Sobre el Puesto',
  whatYouWillDo: 'Lo Que Harás',
  whatYouWillBring: 'Lo Que Aportarás',
  niceToHave: 'Sería un Plus',
  keySkills: 'Habilidades Clave',
  whatWeOffer: 'Lo Que Ofrecemos',
  fullTime: 'Jornada completa',
  remoteHybrid: 'Remoto / Híbrido',
  allLevels: 'Todos los niveles',
  proficiencyIn: 'Dominio de',
  strongSkills: 'habilidades.',
  yearsOfExperience: 'de experiencia profesional relevante.',
  genericResp1: 'Definir e impulsar la visión estratégica y la hoja de ruta para tu área de responsabilidad.',
  genericResp2: 'Colaborar de forma cruzada con ingeniería, diseño y socios comerciales para entregar resultados de alto impacto.',
  genericResp3: 'Analizar datos y métricas para identificar oportunidades, informar decisiones y medir el éxito.',
  genericResp4: 'Comunicar progreso, insights y recomendaciones de forma clara a los stakeholders en todos los niveles.',
  genericResp5: 'Fomentar una cultura de mejora continua, experimentación y responsabilidad dentro del equipo.',
  leverageData: 'Aprovechar herramientas y técnicas de análisis de datos para descubrir insights procesables.',
  mentorDevelop: 'Mentorar y desarrollar a los miembros del equipo, fomentando su crecimiento profesional.',
  genericQual1: 'Experiencia profesional relevante en un puesto similar.',
  genericQual2: 'Fuertes habilidades de resolución de problemas y análisis.',
  genericQual3: 'Excelentes habilidades de comunicación y colaboración.',
  offer1: 'Paquete de compensación competitivo con opciones sobre acciones.',
  offer2: 'Seguro médico, dental y de visión integral.',
  offer3: 'Modalidades de trabajo flexibles — compatible con trabajo remoto y colaboración opcional en oficina.',
  offer4: 'Presupuesto de desarrollo profesional y oportunidades de aprendizaje continuo.',
  offer5: 'Política generosa de vacaciones y días de bienestar para toda la empresa.',
  eoe: 'Somos un empleador que ofrece igualdad de oportunidades y valoramos la diversidad. No discriminamos por raza, religión, color, origen nacional, género, orientación sexual, edad, estado civil, estatus de veterano o discapacidad.',
  interviewGuide: 'Guía de Entrevista',
  behavioralQuestions: 'preguntas conductuales',
  starFormat: 'Se recomienda el formato STAR',
  technical: 'Técnico',
  softSkill: 'Habilidad Blanda',
  general: 'General',
  whatToListenFor: 'Qué escuchar',
  lookingFor: 'Estamos buscando un/a',
  withExperience: 'con',
  toJoinOurTeam: 'para unirse a nuestro equipo y generar un impacto inmediato.',
  inThisRole: 'En este rol, serás responsable de',
  theIdealCandidate: 'El candidato ideal aporta experiencia en',
  relevantExperience: 'de experiencia',
};

const FR: Translations = {
  aboutTheRole: 'À Propos du Poste',
  whatYouWillDo: 'Ce Que Vous Ferez',
  whatYouWillBring: 'Ce Que Vous Apporterez',
  niceToHave: 'Un Atout Supplémentaire',
  keySkills: 'Compétences Clés',
  whatWeOffer: 'Ce Que Nous Offrons',
  fullTime: 'Temps plein',
  remoteHybrid: 'Télétravail / Hybride',
  allLevels: 'Tous niveaux',
  proficiencyIn: 'Maîtrise de',
  strongSkills: 'compétences.',
  yearsOfExperience: "d'expérience professionnelle pertinente.",
  genericResp1: "Définir et piloter la vision stratégique et la feuille de route de votre domaine de responsabilité.",
  genericResp2: "Collaborer de manière transversale avec l'ingénierie, le design et les partenaires métier pour livrer des résultats à fort impact.",
  genericResp3: "Analyser les données et les indicateurs pour identifier les opportunités, éclairer les décisions et mesurer le succès.",
  genericResp4: "Communiquer clairement les progrès, les insights et les recommandations aux parties prenantes à tous les niveaux.",
  genericResp5: "Favoriser une culture d'amélioration continue, d'expérimentation et de responsabilité au sein de l'équipe.",
  leverageData: "Exploiter les outils et techniques d'analyse de données pour découvrir des insights actionnables.",
  mentorDevelop: "Mentorer et développer les membres de l'équipe, en favorisant leur croissance professionnelle.",
  genericQual1: "Expérience professionnelle pertinente dans un poste similaire.",
  genericQual2: "Forte capacité de résolution de problèmes et d'analyse.",
  genericQual3: "Excellentes compétences en communication et en collaboration.",
  offer1: "Package de rémunération compétitif avec des options sur actions.",
  offer2: "Assurance maladie, dentaire et vision complète.",
  offer3: "Modalités de travail flexibles — compatible avec le télétravail et la collaboration en bureau en option.",
  offer4: "Budget de développement professionnel et opportunités d'apprentissage continu.",
  offer5: "Politique généreuse de congés payés et journées bien-être à l'échelle de l'entreprise.",
  eoe: "Nous sommes un employeur offrant l'égalité des chances et valorisons la diversité. Nous ne discriminons pas sur la base de la race, de la religion, de la couleur, de l'origine nationale, du genre, de l'orientation sexuelle, de l'âge, de l'état civil, du statut d'ancien combattant ou du handicap.",
  interviewGuide: "Guide d'Entretien",
  behavioralQuestions: 'questions comportementales',
  starFormat: 'Format STAR recommandé',
  technical: 'Technique',
  softSkill: 'Compétence Comportementale',
  general: 'Général',
  whatToListenFor: 'Ce qu\'il faut écouter',
  lookingFor: 'Nous recherchons un/e',
  withExperience: 'avec',
  toJoinOurTeam: 'pour rejoindre notre équipe et avoir un impact immédiat.',
  inThisRole: 'Dans ce rôle, vous serez responsable de',
  theIdealCandidate: 'Le candidat idéal apporte une expertise en',
  relevantExperience: "d'expérience",
};

const TRANSLATIONS: Record<Locale, Translations> = { en: EN, ar: AR, es: ES, fr: FR };

export function t(locale: Locale): Translations {
  return TRANSLATIONS[locale] || TRANSLATIONS.en;
}
