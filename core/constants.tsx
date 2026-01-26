
import { Country, Consultancy } from './types';

export const COUNTRIES: Country[] = [
  {
    id: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    description: 'The world leader in welcoming skilled immigrants through transparent point-based systems.',
    economy: 'Stable G7 economy with strong focus on natural resources, tech, and healthcare. Known for its resilience and high GDP per capita.',
    jobMarket: 'Critical demand in tech (Toronto/Vancouver), healthcare, and engineering sectors. Huge shortage in trades and social services.',
    education: 'Home to world-class research institutions like University of Toronto and UBC. Offers the generous Post-Graduation Work Permit (PGWP).',
    prBenefits: 'Universal healthcare, high standard of living, and a rapid 3-year path to citizenship for permanent residents.',
    history: 'A nation built on immigration, Canada transitioned from a British colony to a sovereign multicultural democracy with a rich indigenous heritage.',
    geography: 'The second-largest country in the world, spanning six time zones with diverse climates from temperate rain forests to arctic tundras.',
    politics: 'A constitutional monarchy and federal parliamentary democracy known for social liberal policies and human rights advocacy.',
    studentInfo: 'Canada is the top choice for international students due to its welcoming culture, work-while-you-study permits, and clear paths to permanent residency after graduation.',
    jobInfo: 'The Canadian job market is currently experiencing high vacancy rates. Skilled workers can benefit from high salaries and excellent work-life balance across all major provinces.',
    visas: [
      {
        id: 'ca-ee',
        name: 'Express Entry',
        purpose: 'Fast-track for skilled professionals.',
        eligibility: ['Age under 45', 'Degree holders', 'IELTS 7.0+'],
        qualifications: 'Bachelors/Masters.',
        experience: '1+ year skilled work.',
        language: 'CLB 7/9.',
        finance: '$13,757 CAD+',
        processingTime: '6 months',
        settlementPotential: true
      }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    description: 'A global cultural and financial powerhouse offering prestigious career opportunities.',
    economy: 'The world\'s sixth-largest economy, dominated by the services sector, particularly banking, insurance, and business services.',
    jobMarket: 'Chronic shortages in the NHS, technology sectors, secondary education, and various skilled trades following Brexit.',
    education: 'Global gold standard for higher education with institutions like Oxford, Cambridge, and Imperial College London leading world rankings.',
    prBenefits: 'Path to Indefinite Leave to Remain (ILR) after 5 years of residency, providing full access to the UK social system and healthcare.',
    history: 'From the Roman era through the Industrial Revolution to its modern status as a global influencer, the UK has shaped much of modern law and technology.',
    geography: 'An island nation comprising England, Scotland, Wales, and Northern Ireland, featuring diverse landscapes from the Scottish Highlands to the rolling hills of Kent.',
    politics: 'A parliamentary democracy with a constitutional monarch, the UK is a central player in the G7, NATO, and the Commonwealth.',
    studentInfo: 'With the Graduate Route visa, students can now stay and work in the UK for 2 years (3 years for PhDs) after completing their studies at recognized universities.',
    jobInfo: 'The UK Skilled Worker visa route is highly accessible for those with job offers. Tech hubs in London, Manchester, and Edinburgh offer high earning potential.',
    visas: [
      {
        id: 'uk-sw',
        name: 'Skilled Worker',
        purpose: 'Work for approved UK sponsors.',
        eligibility: ['Job offer', 'Sponsorship', 'Minimum salary'],
        qualifications: 'Level 3+ (A-level equivalent) skills.',
        experience: 'N/A with job offer.',
        language: 'B1 English.',
        finance: '£1,270 savings.',
        processingTime: '3-8 weeks',
        settlementPotential: true
      }
    ]
  },
  {
    id: 'de',
    name: 'Germany',
    flag: '🇩🇪',
    description: 'Europe\'s industrial engine with a massive demand for international talent.',
    economy: 'Largest economy in Europe and fourth-largest globally, famous for precision engineering, automotive, and chemical industries.',
    jobMarket: 'Extreme demand for software developers, engineers, healthcare workers, and specialized technicians across the country.',
    education: 'Known for tuition-free public universities and a dual vocational training system that is copied worldwide.',
    prBenefits: 'Permanent residency available after 3-5 years. Excellent social safety net, pension system, and central European travel access.',
    history: 'A nation that reinvented itself post-WWII into a peaceful industrial giant and the leading force of European integration.',
    geography: 'Located in the heart of Europe, Germany features varied landscapes from the North Sea coast to the Bavarian Alps in the south.',
    politics: 'A federal parliamentary republic with a high emphasis on social market economy and consensus-based governance.',
    studentInfo: 'International students in Germany enjoy low costs and high standards. Most public universities charge zero tuition fees, even for non-EU students.',
    jobInfo: 'The new Opportunity Card (Chancenkarte) allows points-based entry for job seekers. Skilled professionals can also apply for the EU Blue Card.',
    visas: [
      {
        id: 'de-ck',
        name: 'Chancenkarte',
        purpose: 'New points-based job seeker card.',
        eligibility: ['Points for language/age', 'Degree recognized'],
        qualifications: 'Vocational/Academic degree.',
        experience: '2 years.',
        language: 'A1 German/B2 English.',
        finance: '€12,324 p.a.',
        processingTime: '2 months',
        settlementPotential: true
      }
    ]
  },
  {
    id: 'us',
    name: 'United States',
    flag: '🇺🇸',
    description: 'The ultimate destination for innovation, entrepreneurship, and high-tech careers.',
    economy: 'The world\'s largest economy by nominal GDP, characterized by high productivity and technological innovation.',
    jobMarket: 'Highly competitive and lucrative. Strong demand for AI specialists, data scientists, healthcare practitioners, and entrepreneurs.',
    education: 'Home to the Ivy League and world-leading research universities that attract the brightest minds from across the globe.',
    prBenefits: 'The "Green Card" offers permanent residency, high earning potential, and the eventual path to US citizenship.',
    history: 'A nation founded on the principles of liberty, the US has grown from 13 colonies to a global superpower and cultural trendsetter.',
    geography: 'Vast and diverse, from the arid deserts of the Southwest to the lush forests of the Northwest and the bustling East Coast megalopolis.',
    politics: 'A federal constitutional republic with a three-branch system of government, emphasizing individual rights and state sovereignty.',
    studentInfo: 'The Optional Practical Training (OPT) program allows F-1 students to work in the US for up to 3 years (for STEM fields) after graduation.',
    jobInfo: 'While visa processes like the H-1B are competitive, the US remains the highest-paying market in the world for skilled technical and medical roles.',
    visas: [
      {
        id: 'us-h1b',
        name: 'H-1B Specialty Occupation',
        purpose: 'Employment in specialized fields.',
        eligibility: ['Bachelors degree', 'Employer sponsorship'],
        qualifications: 'Specific specialty degree.',
        experience: 'Relevant to role.',
        language: 'Fluent English.',
        finance: 'Salary-based.',
        processingTime: '3-6 months',
        settlementPotential: true
      }
    ]
  },
  {
    id: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    description: 'Exceptional work-life balance in one of the world\'s most resilient economies.',
    economy: 'Highly developed market economy with strong banking, mining, and healthcare sectors. High GDP per capita.',
    jobMarket: 'High wages and strong demand for medical staff, civil engineers, and trade specialists (plumbers, electricians).',
    education: 'Major global destination for international students, particularly in business, tech, and medicine.',
    prBenefits: 'Access to Medicare (healthcare), world-class infrastructure, and a sunny, outdoor-centric lifestyle.',
    history: 'Initially home to the world\'s oldest living cultures (Indigenous Australians), the nation developed into a modern multicultural federation.',
    geography: 'A continent-country with unique biodiversity, spanning from tropical rainforests to the vast Outback and iconic coastal cities.',
    politics: 'A federal parliamentary constitutional monarchy with a high standard of living and social stability.',
    studentInfo: 'Australia offers "Temporary Graduate" visas that allow students to stay and work for several years after completing their degree.',
    jobInfo: 'The Skilled Independent (189) and Skilled Nominated (190) visas provide direct paths to permanent residency for eligible workers.',
    visas: [
      {
        id: 'au-189',
        name: 'Skilled Independent (189)',
        purpose: 'Permanent residence for skilled workers.',
        eligibility: ['Points-based', 'Under 45'],
        qualifications: 'Skill assessment.',
        experience: '3+ years preferred.',
        language: 'IELTS 7.0+.',
        finance: 'Settlement funds.',
        processingTime: '12 months',
        settlementPotential: true
      }
    ]
  },
  {
    id: 'nz',
    name: 'New Zealand',
    flag: '🇳🇿',
    description: 'Safe, scenic, and supportive environment for families and professionals.',
    economy: 'Stable and open economy, heavily reliant on international trade, agriculture, and a growing tech sector.',
    jobMarket: 'The "Green List" identifies high-priority roles like doctors, engineers, and ICT managers with fast-tracked residency paths.',
    education: 'Known for high-quality, student-centered education with a strong emphasis on practical learning and research.',
    prBenefits: 'Universal healthcare, safe communities, stunning natural beauty, and a very straightforward path to citizenship.',
    history: 'A nation defined by the Treaty of Waitangi between the Māori and the British Crown, fostering a unique bicultural identity.',
    geography: 'An archipelago in the South Pacific known for its dramatic volcanic peaks, lush green valleys, and pristine coastlines.',
    politics: 'A unitary parliamentary representative democracy under a constitutional monarchy, often ranked among the least corrupt in the world.',
    studentInfo: 'Students can benefit from post-study work rights of up to 3 years depending on the level of qualification earned.',
    jobInfo: 'New Zealand is actively seeking skilled workers to fill gaps in construction, healthcare, and software development.',
    visas: []
  },
  {
    id: 'jp',
    name: 'Japan',
    flag: '🇯🇵',
    description: 'A blend of deep tradition and cutting-edge future tech with new talent visas.',
    economy: 'Third-largest economy in the world, a leader in robotics, automotive engineering, and electronics.',
    jobMarket: 'Rapidly opening up to international talent through the "J-Find" and specialized professional visas to combat labor shortages.',
    education: 'Highly respected engineering, design, and language programs at institutions like University of Tokyo.',
    prBenefits: 'High levels of safety, incredible public transport, world-class healthcare, and a fascinating culture.',
    history: 'A civilization with thousands of years of imperial history that modernized rapidly to become an industrial superpower.',
    geography: 'A volcanic archipelago with four main islands, featuring mountainous terrain and a wide range of climates from snowy Hokkaido to subtropical Okinawa.',
    politics: 'A constitutional monarchy where the Emperor is the symbol of the State and the Prime Minister leads the government.',
    studentInfo: 'The MEXT scholarship and various university programs make Japan an affordable and prestigious destination for research.',
    jobInfo: 'Tech talent is in high demand in Tokyo and Osaka. Proficiency in Japanese is often required but many global tech firms now use English.',
    visas: []
  },
  {
    id: 'nl',
    name: 'Netherlands',
    flag: '🇳🇱',
    description: 'Highly liberal, tech-forward, and English-friendly European hub.',
    economy: 'Top-tier logistics and financial hub with a strong focus on sustainability, water management, and high-tech manufacturing.',
    jobMarket: 'Excellent for English speakers. Amsterdam and Eindhoven are major European tech hubs for startups and multinational HQs.',
    education: 'Offers more English-taught programs than any other non-English speaking country in Europe.',
    prBenefits: '30% tax ruling for high-skilled migrants, excellent cycling infrastructure, and the highest English proficiency in the world.',
    history: 'A maritime empire that led the world in trade during the 17th century and evolved into a beacon of social tolerance.',
    geography: 'A low-lying coastal country, famous for its reclaimed land, intricate canal systems, and innovative coastal defenses.',
    politics: 'A constitutional monarchy and a decentralized unitary parliamentary representative democracy.',
    studentInfo: 'The "Orientation Year" visa allows graduates from the top 200 world universities to live and work in the Netherlands for a year.',
    jobInfo: 'Highly Skilled Migrant visas are processed very quickly by the IND, making it one of the easiest EU countries for relocation.',
    visas: []
  },
  {
    id: 'ae',
    name: 'UAE',
    flag: '🇦🇪',
    description: 'Tax-free salaries and ultra-modern lifestyle in a global trade nexus.',
    economy: 'Wealthy and diversifying rapidly away from oil into tourism, aviation, finance, and green technologies.',
    jobMarket: 'Huge demand for construction, digital marketing, finance professionals, and specialized medical staff in Dubai and Abu Dhabi.',
    education: 'Becoming a regional education hub with satellite campuses from top universities like NYU and Sorbonne.',
    prBenefits: 'Zero personal income tax, 10-year Golden Visas for investors and high-achievers, and ultra-safe luxury lifestyle.',
    history: 'A federation of seven emirates that united in 1971 and transformed from desert tribal lands to global cosmopolitan cities.',
    geography: 'Located on the Arabian Peninsula, featuring dramatic desert dunes and a long coastline on the Persian Gulf.',
    politics: 'A federal absolute monarchy where each emirate maintains significant autonomy under the Supreme Council.',
    studentInfo: 'The UAE is a popular choice for students seeking international business and hospitality degrees in a truly global environment.',
    jobInfo: 'Employment visas are typically tied to sponsorship, but the new Green Visa offers more flexibility for residents and freelancers.',
    visas: []
  },
  {
    id: 'sg',
    name: 'Singapore',
    flag: '🇸🇬',
    description: 'The gateway to Asia with unparalleled efficiency and financial status.',
    economy: 'A global financial services, port logistics, and technology hub with one of the highest GDPs per capita in the world.',
    jobMarket: 'Intense competition for roles in fintech, AI, biotechnology, and wealth management.',
    education: 'Consistently ranked at the very top of global education metrics (PISA scores) and home to NUS and NTU.',
    prBenefits: 'Low personal taxes, clean and safe environment, world-class airport, and central travel location for Asia.',
    history: 'A former British trading post that gained independence in 1965 and achieved a "miracle" development under Lee Kuan Yew.',
    geography: 'A small city-state island located at the southern tip of the Malay Peninsula, known as the "Garden City" for its green urbanism.',
    politics: 'A unitary parliamentary republic with a high level of government efficiency and social order.',
    studentInfo: 'Singapore is a major research hub, offering numerous scholarships for international graduate students in STEM fields.',
    jobInfo: 'The "ONE Pass" is designed for top-tier global talent, while the Employment Pass (EP) remains the primary route for professionals.',
    visas: []
  }
];

export const CONSULTANCIES: Consultancy[] = [
  {
    id: '1',
    name: 'Global Pathways Inc.',
    location: 'London / Toronto',
    countries: ['UK', 'Canada'],
    specialties: ['Express Entry', 'Skilled Worker'],
    rating: 4.8,
    contact: '+44 20 1234 5678',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'EuroLink Immigration',
    location: 'Berlin / Dubai',
    countries: ['Germany', 'UAE'],
    specialties: ['Job Seeker', 'Blue Card'],
    rating: 4.6,
    contact: '+49 30 9876 5432',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'
  }
];
