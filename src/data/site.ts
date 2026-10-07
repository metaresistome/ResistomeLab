export const site = {
  name: 'Resistome Lab',
  tagline: 'AMR · GENOMICS · ONE HEALTH',
  email: 'drshafiq@resistomelab.com',
  emailUniversity: 'drshafiq@stu.edu.cn',
  phone: '+86-166-6020-2550',
  affiliation: 'Shantou University Medical College',
  department: 'Department of Clinical Pharmacy',
  address: 'Teaching and Research Building, Room 408 · Shantou, China',
  links: {
    scholar: 'https://scholar.google.com/citations?user=JIu0J7AAAAAJ&hl=en',
    orcid: 'https://orcid.org/0000-0002-4346-5903',
    linkedin: 'https://www.linkedin.com/in/muhammad-shafiq-81162b1b9/',
    researchgate: 'https://www.researchgate.net/profile/Muhammad-Shafiq-9',
    doi: 'https://doi.org/10.1146/annurev-environ-102125-040356',
  },
}

export const pi = {
  title: 'Associate Professor',
  metrics: [
    { value: '89', label: 'Peer-reviewed outputs' },
    { value: '23', label: 'First / corresponding author' },
    { value: '1,700+', label: 'Citations' },
    { value: '24', label: 'h-index' },
  ],
  education: [
    {
      years: '2016 – 2019',
      degree: 'Ph.D., Pharmacology & Toxicology',
      institution: 'Nanjing Agricultural University, China',
    },
  ],
  appointments: [
    {
      years: '2026 – Present',
      role: 'Associate Professor',
      institution: 'Department of Clinical Pharmacy, Shantou University Medical College, China',
    },
  ],
  editorial: [
    'Associate Editor — Virulence (Taylor & Francis)',
    'Guest Editor — Frontiers in Cellular and Infection Microbiology',
    'Review Editor — Microbiology Spectrum, Scientific Reports, One Health, FEMS, Frontiers in Microbiology, Antibiotics, and others',
  ],
  memberships: ['American Society for Microbiology (ASM)', 'ESCMID — European Society of Clinical Microbiology and Infectious Diseases'],
}

export type SelectedPublication = {
  year: string
  title: string
  journal: string
  role: string
  doi: string
}

export const selectedPublications: SelectedPublication[] = [
  {
    year: '2026',
    title:
      'From commensal to pathobiont: The emergence of virulence-enhanced Escherichia coli in China’s food-animal systems',
    journal: 'Food Research International',
    role: 'Equal Corresponding Author',
    doi: 'https://doi.org/10.1016/j.foodres.2026.120414',
  },
  {
    year: '2026',
    title:
      'Metagenomic surveillance identifies a high-risk antibiotic resistance profile in community wastewater: a pilot study from Pakistan',
    journal: 'Naunyn-Schmiedeberg’s Archives of Pharmacology',
    role: 'Equal Corresponding Author',
    doi: 'https://doi.org/10.1007/s00210-026-05471-x',
  },
  {
    year: '2026',
    title:
      'Genomic insights into mcr-mediated colistin resistance in Escherichia coli, Aeromonas veronii, and Enterobacter kobei from wastewater',
    journal: 'Journal of Applied Microbiology',
    role: 'Corresponding Author',
    doi: 'https://doi.org/10.1093/jambio/lxaf307',
  },
  {
    year: '2025',
    title:
      'Peste des petits ruminants in Pakistan: current status, challenges and prospects for vaccine development',
    journal: 'Vaccines',
    role: 'Corresponding Author',
    doi: 'https://doi.org/10.3390/vaccines13111101',
  },
  {
    year: '2024',
    title:
      'Ecological consequences of antimicrobial residues and bioactive chemicals on antimicrobial resistance in agroecosystems',
    journal: 'Journal of Advanced Research',
    role: 'First & Corresponding Author',
    doi: 'https://doi.org/10.1016/j.jare.2024.10.013',
  },
  {
    year: '2024',
    title:
      'Integrative metagenomic dissection of last-resort antibiotic resistance genes and mobile genetic elements in hospital wastewaters',
    journal: 'Science of The Total Environment',
    role: 'First Author',
    doi: 'https://doi.org/10.1016/j.scitotenv.2024.174930',
  },
  {
    year: '2022',
    title:
      'Coexistence of blaNDM-5 and tet(X4) in international high-risk Escherichia coli clone ST648 of human origin in China',
    journal: 'Frontiers in Microbiology',
    role: 'First Author',
    doi: 'https://doi.org/10.3389/fmicb.2022.1031688',
  },
  {
    year: '2022',
    title: 'Synergistic activity of tetrandrine and colistin against mcr-1-harboring Escherichia coli',
    journal: 'Antibiotics',
    role: 'First Author',
    doi: 'https://doi.org/10.3390/antibiotics11101346',
  },
]

export type ResearchArea = {
  id: string
  index: string
  title: string
  image: string
  imageAlt: string
  summary: string
  points: string[]
}

export const researchAreas: ResearchArea[] = [
  {
    id: 'resistome',
    index: '01',
    title: 'Resistome & AMR ecology',
    image: '/images/research-resistome.webp',
    imageAlt: 'Three-dimensional antimicrobial-resistance bacteria and plasmid specimen',
    summary:
      'Tracing antimicrobial-resistance genes, mobile elements, and microbial communities across clinical, environmental, and One Health settings.',
    points: [
      'Occurrence and distribution of resistance determinants',
      'Antibiotics and resistance fate across environmental settings',
      'Mobile genetic elements and horizontal transfer',
    ],
  },
  {
    id: 'genomics',
    index: '02',
    title: 'Pathogen genomics & metagenomics',
    image: '/images/research-genomics.webp',
    imageAlt: 'Three-dimensional genomic and plasmid specimen',
    summary:
      'Using genomic and metagenomic methods to interpret infectious agents, fungal pathogens, transmission, and evolutionary change.',
    points: [
      'Whole-genome sequencing of bacterial and fungal pathogens',
      'Metagenomic profiling of complex microbial communities',
      'Phylogenetics, transmission, and evolutionary analysis',
    ],
  },
  {
    id: 'one-health',
    index: '03',
    title: 'One Health surveillance',
    image: '/images/research-one-health.webp',
    imageAlt: 'Three-dimensional One Health wastewater surveillance specimen',
    summary:
      'Integrating wastewater epidemiology, bioinformatics, and public-health context to detect and interpret emerging signals.',
    points: [
      'Wastewater-based epidemiology for AMR tracking',
      'Bioinformatics pipelines for surveillance data',
      'Linking environmental signals to public-health action',
    ],
  },
]

export const approachSteps = [
  {
    step: '01',
    title: 'Frame the question',
    text: 'Begin with carefully framed questions, representative samples, and surveillance systems capable of making hidden microbial patterns visible.',
  },
  {
    step: '02',
    title: 'Resolve the signal',
    text: 'Connect microbiology, genomics, metagenomics, and bioinformatics to resolve the biological and ecological context of each signal.',
  },
  {
    step: '03',
    title: 'Turn evidence into action',
    text: 'Turn robust findings into reproducible outputs, collaborative questions, and evidence that can inform the next stage of research.',
  },
]

export const principles = [
  {
    title: 'Make complex microbial evidence legible',
    text: 'Place individual observations within the environmental, clinical, and population contexts that give them meaning.',
  },
  {
    title: 'Work across disciplines',
    text: 'Let molecular methods, bioinformatics, surveillance, and implementation questions inform one another.',
  },
  {
    title: 'Build a useful record',
    text: 'Share work in formats that enable collaboration, scrutiny, and the next research question.',
  },
]

export const featuredPublication = {
  kind: 'Invited review · Review in Advance',
  title:
    'AMR in Agroecosystems: One Health Strategies for Detection, Mitigation, and Sustainable Solutions',
  journal: 'Annual Review of Environment and Resources',
  year: '2026',
  doi: site.links.doi,
  summary:
    'Dr. Muhammad Shafiq and colleagues review how biosensor monitoring, multi-omics, AI-supported surveillance, and sustainable remediation can strengthen One Health approaches to AMR in agroecosystems.',
}

export const newsItems = [
  {
    date: 'Featured',
    category: 'New publications & data',
    title: 'Invited One Health review published in Annual Reviews',
    text: 'Our invited review on AMR in agroecosystems appears as a Review in Advance in the Annual Review of Environment and Resources, covering biosensor monitoring, multi-omics, AI-supported surveillance, and sustainable remediation.',
    href: featuredPublication.doi,
  },
  {
    date: 'Ongoing',
    category: 'Conference field notes',
    title: 'Field notes from research conversations',
    text: 'Conference observations, posters, and discussions from AMR and One Health meetings will be shared here as the record grows.',
  },
  {
    date: 'Ongoing',
    category: 'Team & collaboration news',
    title: 'New collaborations and datasets',
    text: 'Updates on joint projects, data partnerships, student researchers, and visiting collaborations will appear in this space.',
  },
]

export type Student = {
  name: string
  program: string
  photo: string
  photoAlt: string
  bio: string
  tags: string[]
  email?: string
}

export const students: Student[] = [
  {
    name: 'Eltayeb Mohamedelmamoun Abdulaziz Algimeabi',
    program: 'M.S. Candidate · Pharmacology',
    photo: '/images/students/student-eltayeb.webp',
    photoAlt: 'Portrait of Eltayeb Mohamedelmamoun Abdulaziz Algimeabi',
    bio: 'Eltayeb holds a B.Sc. with Honors (First Class) in Genetics and Microbiology from the University of Khartoum. His Master’s research at Shantou University Medical College focuses on antimicrobial resistance, combining CRISPR-Cas9 gene editing, PCR, and bioinformatics with R-based statistical analysis and data visualization. His interests span molecular biology, microbial genetics, and computational approaches to biomedical research.',
    tags: ['AMR', 'CRISPR-Cas9', 'PCR', 'R & Bioinformatics'],
  },
  {
    name: 'Xu Zeng',
    program: 'M.S. Candidate · Cell Biology (2025– )',
    photo: '/images/students/student-xu-zeng.webp',
    photoAlt: 'Portrait of Xu Zeng',
    bio: 'Xu Zeng earned his B.S. in Biological Science from Inner Mongolia Minzu University and is now pursuing a Master’s in Cell Biology at Shantou University Medical College under the supervision of Dr. Muhammad Shafiq. His research is a computational investigation of antimicrobial resistance — using genomic annotation, evolutionary tracing of resistance determinants, and multi-omics data mining to dissect how resistance emerges and spreads.',
    tags: ['Computational AMR', 'Genomic Annotation', 'Multi-omics'],
    email: '18283176139@163.com',
  },
  {
    name: 'Omnia Sharif Mahmoud Sharif',
    program: 'M.S. Candidate · Pharmacology',
    photo: '/images/students/student-omnia.webp',
    photoAlt: 'Portrait of Omnia Sharif Mahmoud Sharif',
    bio: 'Omnia holds a Bachelor’s degree in Microbiology and Parasitology from Ibn Sina University and completed a qualifying year at the Institute of Endemic Diseases, University of Khartoum. She spent five years in hospital laboratories across Sudan, building strong expertise in clinical microbiology and parasitology diagnostics, and in 2023 collaborated with Shantou University researchers to develop an AI-powered microscope for malaria parasite detection. Her current Master’s research focuses on antimicrobial resistance, applying PCR, R, and Python to understand and combat resistance.',
    tags: ['AMR', 'Clinical Microbiology', 'PCR', 'R & Python'],
  },
]

export const groupCards = [
  {
    title: 'Researcher profiles',
    text: 'A place for future researcher profiles, research interests, and supervised project pathways as the lab grows.',
  },
  {
    title: 'Expertise map',
    text: 'A clear way to show the expertise, disciplines, and locations that make shared research possible.',
  },
  {
    title: 'Training pathways',
    text: 'Training opportunities, alumni stories, and laboratory collaborations can be added here as the network develops.',
  },
]

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/research', label: 'Research' },
  { to: '/publications', label: 'Publications' },
  { to: '/group', label: 'Group' },
  { to: '/news', label: 'News' },
  { to: '/about', label: 'About the PI' },
  { to: '/contact', label: 'Contact' },
]
