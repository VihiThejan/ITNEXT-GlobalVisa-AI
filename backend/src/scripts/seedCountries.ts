import mongoose from 'mongoose';
import Country from '../models/Country';
import dotenv from 'dotenv';

dotenv.config();

const COUNTRIES_DATA = [
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
    ],
    isActive: true
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
    ],
    isActive: true
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
    ],
    isActive: true
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
    history: 'Founded on principles of liberty and democracy, the US has evolved into a global superpower with diverse cultural influences.',
    geography: 'A vast nation spanning from Atlantic to Pacific, featuring diverse climates and landscapes from deserts to mountains to tropical islands.',
    politics: 'A federal republic with a strong tradition of constitutional governance and a two-party political system.',
    studentInfo: 'US universities dominate global rankings. International students can work on-campus and apply for Optional Practical Training (OPT) after graduation.',
    jobInfo: 'The H-1B visa program attracts top global talent. Tech companies in Silicon Valley and major cities offer competitive compensation packages.',
    visas: [
      {
        id: 'us-h1b',
        name: 'H-1B Visa',
        purpose: 'Work visa for specialty occupations.',
        eligibility: ['Bachelors degree', 'Job offer', 'Specialty occupation'],
        qualifications: 'Bachelors or higher in relevant field.',
        experience: 'Varies by position.',
        language: 'English proficiency.',
        finance: 'Employer sponsored.',
        processingTime: '3-6 months',
        settlementPotential: true
      }
    ],
    isActive: true
  }
];

const seedCountries = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing countries
    console.log('Clearing existing countries...');
    await Country.deleteMany({});
    console.log('Existing countries cleared');

    // Insert countries
    console.log('Inserting countries...');
    const result = await Country.insertMany(COUNTRIES_DATA);
    console.log(`Successfully inserted ${result.length} countries`);

    result.forEach(country => {
      console.log(`  - ${country.flag} ${country.name} (${country.id})`);
    });

    console.log('\n✅ Country seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding countries:', error);
    process.exit(1);
  }
};

seedCountries();
