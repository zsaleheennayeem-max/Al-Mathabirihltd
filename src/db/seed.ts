import { db, testDatabaseConnection, isDatabaseAvailable } from './index.ts';
import {
  siteSettings,
  formOptions,
  services,
  workforceCategories,
  industries,
  portfolio,
  blogPosts,
  testimonials,
  faqs,
} from './schema.ts';

export async function seedDatabase() {
  try {
    const isAvailable = await testDatabaseConnection();
    if (!isAvailable) {
      console.log('[Database] Database is not available or credentials not configured. Skipping seed in preview mode.');
      return;
    }

    console.log('Database connected. Checking seed status...');

    // 1. Site Settings
    const existingSettings = await db.select().from(siteSettings);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        companyName: 'EquipWorkforce Global',
        tagline: 'International Manpower Supply & Technical Staffing Solutions',
        description: 'EquipWorkforce is an internationally accredited manpower supplier delivering compliant, highly-trained workforce teams across heavy engineering, construction, oil & gas, logistics, and facility operations.',
        email: 'contact@equipworkforce.com',
        phone: '+44 20 7946 0920',
        whatsapp: '+447946092000',
        address: '100 Bishopsgate, Level 24, London EC2N 4AG, United Kingdom',
        googleMapsUrl: 'https://maps.google.com/?q=100+Bishopsgate+London',
        businessHours: 'Monday - Friday: 08:00 - 18:00 GMT (24/7 Deployment Operations)',
        facebookUrl: 'https://facebook.com/equipworkforce',
        instagramUrl: 'https://instagram.com/equipworkforce',
        linkedinUrl: 'https://linkedin.com/company/equipworkforce',
        youtubeUrl: 'https://youtube.com/@equipworkforce',
        tiktokUrl: '',
        logoUrl: '',
        darkLogoUrl: '',
        footerLogoUrl: '',
        faviconUrl: '',
        defaultSeoTitle: 'EquipWorkforce – International Manpower & Technical Workforce Solutions',
        defaultSeoDesc: 'Global manpower recruitment, staffing logistics, and technical workforce solutions for enterprise infrastructure, industrial, and offshore projects.',
        defaultOgImage: '/uploads/hero_workforce_logistics_1790187512878.jpg',
      });
      console.log('Site settings seeded.');
    }

    // 2. Form Options
    const existingOptions = await db.select().from(formOptions);
    if (existingOptions.length === 0) {
      const defaultFormOptions = [
        // Inquiry Types for Contact Form
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'Workforce Deployment Inquiry', value: 'workforce_deployment', displayOrder: 1 },
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'Executive & Technical Headhunting', value: 'headhunting', displayOrder: 2 },
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'Tender & Contract Bidding', value: 'tender_bidding', displayOrder: 3 },
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'Visa, Compliance & Mobilization Support', value: 'compliance_mobilization', displayOrder: 4 },
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'Vendor Partnership', value: 'partnership', displayOrder: 5 },
        { formType: 'contact_inquiry', fieldName: 'inquiry_type', label: 'General Corporate Question', value: 'general', displayOrder: 6 },

        // Workforce Tiers
        { formType: 'workforce_tier', fieldName: 'tier', label: 'Certified Specialists & Engineers', value: 'engineers', displayOrder: 1 },
        { formType: 'workforce_tier', fieldName: 'tier', label: 'Skilled Trades & Certified Operators', value: 'skilled', displayOrder: 2 },
        { formType: 'workforce_tier', fieldName: 'tier', label: 'Semi-Skilled Technicians', value: 'semi_skilled', displayOrder: 3 },
        { formType: 'workforce_tier', fieldName: 'tier', label: 'General Site Labor & Support', value: 'general_labor', displayOrder: 4 },

        // Preferred Contact Method
        { formType: 'preferred_contact', fieldName: 'contact_method', label: 'Corporate Email', value: 'email', displayOrder: 1 },
        { formType: 'preferred_contact', fieldName: 'contact_method', label: 'Direct Phone Call', value: 'phone', displayOrder: 2 },
        { formType: 'preferred_contact', fieldName: 'contact_method', label: 'WhatsApp Messenger', value: 'whatsapp', displayOrder: 3 },
      ];
      await db.insert(formOptions).values(defaultFormOptions);
      console.log('Form options seeded.');
    }

    // 3. Services
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      const defaultServices = [
        {
          title: 'Industrial & Heavy Civil Construction Manpower',
          slug: 'industrial-civil-construction-manpower',
          shortDesc: 'Mobilizing certified civil engineering personnel, riggers, scaffolders, and certified structural steel fabricators.',
          fullDesc: 'We supply turnkey workforce solutions for mega-scale civil works, infrastructure projects, commercial towers, and industrial plants. All personnel hold international certifications (OSHA, NEBOSH, CSCS) and undergo pre-deployment vetting, trade testing, and medical clearances.',
          featuredImage: '/uploads/service_industrial_construction_1790187524192.jpg',
          icon: 'HardHat',
          benefits: JSON.stringify([
            'Rapid mobilization of up to 500+ tradesmen within 21 days',
            'Full compliance with host-nation labor laws and visa sponsorship',
            'Pre-deployment trade testing at certified technical academies',
            'On-site bilingual camp supervisors and safety marshals',
          ]),
          industries: JSON.stringify(['Heavy Infrastructure', 'Commercial Construction', 'Civil Engineering']),
          seoTitle: 'Industrial & Civil Construction Manpower Supply | EquipWorkforce',
          seoDesc: 'Certified civil workforce supply, heavy construction tradesmen, and site engineering teams for international contractors.',
          isPublished: true,
          isFeatured: true,
          displayOrder: 1,
        },
        {
          title: 'Offshore, Oil & Gas Technical Staffing',
          slug: 'offshore-oil-gas-technical-staffing',
          shortDesc: 'Deploying OPITO/BOSIET certified technicians, pipeline welders, NDT inspectors, and instrumentation engineers.',
          fullDesc: 'EquipWorkforce delivers high-consequence workforce solutions for upstream exploration, midstream transport, and downstream refinery shutdowns. Our crews possess current sea survival credentials, safety passports, and specialized hydrocarbon processing credentials.',
          featuredImage: '/uploads/hero_workforce_logistics_1790187512878.jpg',
          icon: 'Flame',
          benefits: JSON.stringify([
            'OPITO, BOSIET, HUET & STCW compliant personnel',
            'Certified 6G/TIG alloy and pipeline welders',
            'Turnaround & shutdown rapid deployment squads',
            'Zero-harm HSE track record across 1.8M man-hours',
          ]),
          industries: JSON.stringify(['Oil & Gas', 'Petrochemical', 'Offshore Marine']),
          seoTitle: 'Offshore & Oil/Gas Technical Manpower | EquipWorkforce',
          seoDesc: 'BOSIET and OPITO certified offshore technicians, refinery shutdown manpower, and pipeline specialists.',
          isPublished: true,
          isFeatured: true,
          displayOrder: 2,
        },
        {
          title: 'Port Logistics & Warehouse Fulfillment Operations',
          slug: 'port-logistics-warehouse-fulfillment',
          shortDesc: 'End-to-end staffing for automated container terminals, bonded dry docks, distribution hubs, and cold chains.',
          fullDesc: 'Specialized port crane operators (STS, RTG), reach stacker drivers, certified freight handlers, and logistics inventory specialists deployed with complete seasonal scalability and shift management.',
          featuredImage: '/uploads/service_technical_logistics_1790187537100.jpg',
          icon: 'Truck',
          benefits: JSON.stringify([
            'Heavy port equipment certified operators (STS, RTG, Reach Stacker)',
            'WMS and automated inventory management specialists',
            'Flexible 24/7 continuous shift rota structures',
            'Comprehensive third-party liability insurance coverage',
          ]),
          industries: JSON.stringify(['Maritime & Ports', 'Supply Chain', 'Warehousing']),
          seoTitle: 'Port & Logistics Workforce Supply | EquipWorkforce',
          seoDesc: 'Container terminal operators, logistics inventory personnel, and certified distribution workforce supply.',
          isPublished: true,
          isFeatured: true,
          displayOrder: 3,
        },
        {
          title: 'Integrated Facility Management & MEP Crews',
          slug: 'integrated-facility-management-mep',
          shortDesc: 'Mechanical, electrical, plumbing (MEP), HVAC engineers, and industrial sanitization specialists.',
          fullDesc: 'Providing full-lifecycle facility maintenance personnel for airport hubs, hospital complexes, high-rise corporate campuses, and smart developments. Includes electrical technicians, chiller mechanics, and smart BMS operators.',
          featuredImage: '/uploads/service_hospitality_facility_1790187549977.jpg',
          icon: 'Building2',
          benefits: JSON.stringify([
            'BMS (Building Management System) trained operators',
            'HVAC, Chiller and central cooling system specialists',
            '24/7 rapid dispatch maintenance teams for critical uptime',
            'ISO 9001 and ISO 45001 certified operational workflows',
          ]),
          industries: JSON.stringify(['Facility Management', 'Commercial Real Estate', 'Healthcare Facilities']),
          seoTitle: 'Facility Management & MEP Staffing | EquipWorkforce',
          seoDesc: 'Certified MEP contractors, HVAC technicians, and commercial facility management teams.',
          isPublished: true,
          isFeatured: true,
          displayOrder: 4,
        },
      ];
      await db.insert(services).values(defaultServices);
      console.log('Services seeded.');
    }

    // 4. Workforce Categories
    const existingCategories = await db.select().from(workforceCategories);
    if (existingCategories.length === 0) {
      const defaultCategories = [
        {
          title: 'Certified Welders & Structural Fabricators',
          slug: 'certified-welders-structural-fabricators',
          description: '6G, MIG, TIG, and submerged arc welding specialists certified to ASME Section IX and AWS D1.1 standards.',
          image: '/uploads/service_industrial_construction_1790187524192.jpg',
          skills: JSON.stringify(['ASME Sec IX', '6G TIG/SMAW', 'Pipe Fitting', 'Isometric Drawing Interpretation', 'NDT Preparedness']),
          experienceInfo: 'Minimum 5+ years industrial pressure vessel or pipeline fabrication experience with verifiable logbooks.',
          relatedIndustries: JSON.stringify(['Oil & Gas', 'Shipbuilding', 'Heavy Construction']),
          isFeatured: true,
          displayOrder: 1,
        },
        {
          title: 'Heavy Equipment & Port Machinery Operators',
          slug: 'heavy-equipment-port-machinery-operators',
          description: 'Licensed operators for crawler cranes, STS gantry cranes, excavators, bull-dozers, and heavy haulage trailers.',
          image: '/uploads/service_technical_logistics_1790187537100.jpg',
          skills: JSON.stringify(['STS Crane Operation', 'RTG Gantry', 'Crawler Cranes 100T+', 'Telehandlers', 'Load Chart Computation']),
          experienceInfo: 'Holds valid international heavy machinery operator licenses with zero fatal incidents history.',
          relatedIndustries: JSON.stringify(['Ports & Terminals', 'Civil Mega-Projects', 'Mining']),
          isFeatured: true,
          displayOrder: 2,
        },
        {
          title: 'Electrical, Instrumentation & MEP Technicians',
          slug: 'electrical-instrumentation-mep-technicians',
          description: 'HV/LV substation technicians, PLC automation programmers, calibrated instrumentation fitters, and HVAC engineers.',
          image: '/uploads/service_hospitality_facility_1790187549977.jpg',
          skills: JSON.stringify(['HV/LV Distribution', 'Cable Splicing', 'PLC Debugging', 'BMS Controls', 'Chiller Maintenance']),
          experienceInfo: 'Degree or certified diploma in Electrical/Mechanical Engineering with 4+ years commercial project tenure.',
          relatedIndustries: JSON.stringify(['Industrial Facilities', 'Data Centers', 'Smart Infrastructure']),
          isFeatured: true,
          displayOrder: 3,
        },
        {
          title: 'HSE Marshals & Quality Assurance Inspectors',
          slug: 'hse-marshals-quality-assurance-inspectors',
          description: 'Certified health, safety, and environmental professionals guaranteeing site compliance, incident prevention, and ISO conformity.',
          image: '/uploads/about_global_workforce_1790187561296.jpg',
          skills: JSON.stringify(['NEBOSH IGC', 'OSHA 30', 'Risk Assessment', 'Incident Investigation', 'ISO 45001 Auditor']),
          experienceInfo: 'Certified safety practitioners with direct oversight experience on $100M+ international builds.',
          relatedIndustries: JSON.stringify(['All Industrial Sectors', 'Offshore', 'Civil Infrastructure']),
          isFeatured: true,
          displayOrder: 4,
        },
      ];
      await db.insert(workforceCategories).values(defaultCategories);
      console.log('Workforce categories seeded.');
    }

    // 5. Industries
    const existingIndustries = await db.select().from(industries);
    if (existingIndustries.length === 0) {
      const defaultIndustries = [
        {
          title: 'Oil, Gas & Petrochemicals',
          slug: 'oil-gas-petrochemicals',
          description: 'High-risk upstream exploration, offshore platforms, refinery turnarounds, and cross-country pipeline infrastructure.',
          image: '/uploads/hero_workforce_logistics_1790187512878.jpg',
          icon: 'Flame',
          stats: '4,200+ Personnel Deployed · 12 Major Refineries',
          displayOrder: 1,
        },
        {
          title: 'Civil & Heavy Infrastructure',
          slug: 'civil-heavy-infrastructure',
          description: 'High-speed rail, transport tunnels, bridges, metropolitan airports, and mega-scale urban master developments.',
          image: '/uploads/service_industrial_construction_1790187524192.jpg',
          icon: 'HardHat',
          stats: '8,500+ Tradesmen · 18 Mega-Projects',
          displayOrder: 2,
        },
        {
          title: 'Maritime Ports & Global Logistics',
          slug: 'maritime-ports-global-logistics',
          description: 'Automated deepwater container terminals, bulk cargo transshipment hubs, and regional distribution networks.',
          image: '/uploads/service_technical_logistics_1790187537100.jpg',
          icon: 'Truck',
          stats: '2,900+ Specialists · 7 Deepwater Ports',
          displayOrder: 3,
        },
        {
          title: 'Commercial Facility Operations & Real Estate',
          slug: 'commercial-facility-operations-real-estate',
          description: 'Fortune 500 regional headquarters, international airport terminals, luxury hospitality groups, and health cities.',
          image: '/uploads/service_hospitality_facility_1790187549977.jpg',
          icon: 'Building2',
          stats: '3,600+ Staff · 45 High-Rise Complexes',
          displayOrder: 4,
        },
      ];
      await db.insert(industries).values(defaultIndustries);
      console.log('Industries seeded.');
    }

    // 6. Portfolio
    const existingPortfolio = await db.select().from(portfolio);
    if (existingPortfolio.length === 0) {
      const defaultPortfolio = [
        {
          title: 'Red Sea Petrochemical Terminal Expansion',
          slug: 'red-sea-petrochemical-terminal-expansion',
          client: 'Apex Industrial Consortium',
          industry: 'Oil, Gas & Petrochemicals',
          location: 'Yanbu, Saudi Arabia',
          year: '2025 - 2026',
          description: 'Mobilized a dedicated workforce of 420 certified 6G welders, NDT inspectors, pipefitters, and safety superintendents for cryogenic ethylene storage tanks and export jetty connections.',
          featuredImage: '/uploads/hero_workforce_logistics_1790187512878.jpg',
          gallery: JSON.stringify([
            '/uploads/hero_workforce_logistics_1790187512878.jpg',
            '/uploads/service_industrial_construction_1790187524192.jpg',
          ]),
          servicesProvided: JSON.stringify(['Turnaround Manpower', 'Welding & NDT Inspection', 'Bilingual Safety Oversight']),
          workforceCategories: JSON.stringify(['Certified Welders', 'HSE Marshals', 'Rigging Leads']),
          status: 'Ongoing',
          isFeatured: true,
          seoTitle: 'Red Sea Petrochemical Terminal Case Study | EquipWorkforce',
          seoDesc: 'Deployment of 420 certified petrochemical specialists with zero lost-time incidents.',
        },
        {
          title: 'North Sea Offshore Wind Substation Assembly',
          slug: 'north-sea-offshore-wind-substation',
          client: 'Nordic Marine Power AG',
          industry: 'Renewable Marine Energy',
          location: 'Esbjerg, Denmark / North Sea',
          year: '2024 - 2025',
          description: 'Turnkey technical staffing for offshore high-voltage AC/DC substation jackets, structural cabling, and mechanical load-out operations.',
          featuredImage: '/uploads/service_industrial_construction_1790187524192.jpg',
          gallery: JSON.stringify([
            '/uploads/service_industrial_construction_1790187524192.jpg',
          ]),
          servicesProvided: JSON.stringify(['GWO / BOSIET Technicians', 'HV Cable Pulling', 'Offshore Rigging']),
          workforceCategories: JSON.stringify(['Electrical Specialists', 'Heavy Riggers']),
          status: 'Completed',
          isFeatured: true,
          seoTitle: 'Offshore Substation Workforce Case Study | EquipWorkforce',
          seoDesc: 'Technical manpower supply for offshore renewable energy infrastructure.',
        },
        {
          title: 'Rotterdam Automated Gateway Container Terminal',
          slug: 'rotterdam-automated-gateway-terminal',
          client: 'EuroPort Logistics B.V.',
          industry: 'Maritime Ports & Global Logistics',
          location: 'Rotterdam, Netherlands',
          year: '2024 - 2026',
          description: 'Provided 185 certified automated stacking crane technicians, reach stacker pilots, and logistics control supervisors during facility volume surges.',
          featuredImage: '/uploads/service_technical_logistics_1790187537100.jpg',
          gallery: JSON.stringify([
            '/uploads/service_technical_logistics_1790187537100.jpg',
          ]),
          servicesProvided: JSON.stringify(['Port Equipment Operations', 'WMS Data Entry', 'Safety Coordination']),
          workforceCategories: JSON.stringify(['Machinery Operators', 'Logistics Coordinators']),
          status: 'Completed',
          isFeatured: true,
          seoTitle: 'Rotterdam Terminal Operations Case Study | EquipWorkforce',
          seoDesc: 'High-volume logistics and crane operator workforce supply.',
        },
      ];
      await db.insert(portfolio).values(defaultPortfolio);
      console.log('Portfolio seeded.');
    }

    // 7. Blog Posts
    const existingBlog = await db.select().from(blogPosts);
    if (existingBlog.length === 0) {
      const defaultBlogPosts = [
        {
          title: 'Overcoming International Visa and Mobilization Bottlenecks in 2026',
          slug: 'overcoming-international-visa-mobilization-bottlenecks',
          excerpt: 'How global EPC contractors are navigating stricter regional bilateral labor quotas and tightening biometric immigration policies.',
          content: `
## The Shifting Landscape of Global Workforce Logistics

As mega-projects in EMEA and Asia-Pacific expand rapidly, multinational general contractors face unprecedented regulatory hurdles in candidate verification, consular clearance, and localized labor quotas.

### 1. Pre-Clearance Compliance at Source
Deploying workforce squads is no longer simply about buying airline tickets. Robust compliance mandates trade-testing verification certified by recognized bodies, digitized biometric health assessments, and bilateral ministry approvals before personnel board aircraft.

### 2. Digital Identity & Credential Portability
By partnering with centralized workforce platforms like EquipWorkforce, contractors maintain audit-ready digital dossiers for every operative—including safety tickets, medical clearances, and trade competency scores.

### 3. Mitigating Camp & Welfare Risks
Modern ESG criteria require top-tier housing, nutritional guarantees, and bilingual welfare marshals. Projects that invest in transparent workforce care observe a 34% reduction in site absenteeism and an 89% improvement in first-time weld quality pass rates.
          `,
          featuredImage: '/uploads/about_global_workforce_1790187561296.jpg',
          author: 'Marcus Vance, Head of Global Mobilization',
          category: 'Compliance & Mobility',
          tags: JSON.stringify(['Visa Regulations', 'Global Staffing', 'Compliance', 'Contractor Management']),
          seoTitle: 'Managing Visa & Mobilization for Global Manpower | EquipWorkforce',
          seoDesc: 'Strategic guidance on international manpower mobilization, consular approvals, and project continuity.',
          status: 'published',
          isFeatured: true,
        },
        {
          title: 'Safety First: Achieving 1.8 Million Man-Hours with Zero Lost-Time Incidents',
          slug: 'safety-first-achieving-zero-lost-time-incidents',
          excerpt: 'Inside EquipWorkforce’s standardized pre-mobilization safety academies and peer-marshaling protocol.',
          content: `
## Why High-Hazard Projects Demand Unified Safety Cultures

In petrochemical refineries, deep tunneling, and offshore wind substations, technical expertise is meaningless if site operations are disrupted by avoidable safety incidents.

### The Three Pillars of Site Readiness
1. **Behavioral Safety Inductions**: Going beyond static slide presentations to hands-on simulations of confined-space entry, harness inspections, and emergency evacuation drills.
2. **Bilingual Communication Bridges**: Ensuring tool-box talks and danger signage are understood across multi-lingual crews without semantic distortion.
3. **Continuous Peer Accountability**: Empowering every tradesman with unambiguous Stop-Work Authority without fear of penalty.
          `,
          featuredImage: '/uploads/hero_workforce_logistics_1790187512878.jpg',
          author: 'Elena Rostova, Director of HSE Compliance',
          category: 'HSE & Quality',
          tags: JSON.stringify(['Safety', 'NEBOSH', 'HSE', 'Zero-Harm']),
          seoTitle: 'HSE Protocols in Industrial Workforce Deployment | EquipWorkforce',
          seoDesc: 'How EquipWorkforce achieves industry-leading zero lost-time incident rates in high-risk engineering.',
          status: 'published',
          isFeatured: true,
        },
      ];
      await db.insert(blogPosts).values(defaultBlogPosts);
      console.log('Blog posts seeded.');
    }

    // 8. Testimonials
    const existingTestimonials = await db.select().from(testimonials);
    if (existingTestimonials.length === 0) {
      const defaultTestimonials = [
        {
          clientName: 'David H. Sterling',
          clientRole: 'VP of Global Construction',
          clientCompany: 'Sterling & Balfour Infrastructure',
          avatar: '',
          quote: 'EquipWorkforce mobilized 350 certified structural welders and crane operators to our marine terminal site within three weeks. Their compliance documentation and trade vetting were flawless.',
          rating: 5,
          projectTitle: 'Maritime Terminal Phase II',
          isFeatured: true,
          displayOrder: 1,
        },
        {
          clientName: 'Tariq Al-Mansoor',
          clientRole: 'Project Director',
          clientCompany: 'Gulf Petrochemical Holdings',
          avatar: '',
          quote: 'Their bilingual site marshals and dedication to zero-harm safety culture made our annual shutdown the smoothest in our 15-year operational history.',
          rating: 5,
          projectTitle: 'Refinery Turnaround 2025',
          isFeatured: true,
          displayOrder: 2,
        },
        {
          clientName: 'Sarah Lindqvist',
          clientRole: 'Head of Port Operations',
          clientCompany: 'Nordic Transshipment Alliance',
          avatar: '',
          quote: 'Flexible, certified, and completely dependable. When we encountered seasonal cargo surges, EquipWorkforce scaled our container crane crew by 60 operators without any operational friction.',
          rating: 5,
          projectTitle: 'Terminal Volume Expansion',
          isFeatured: true,
          displayOrder: 3,
        },
      ];
      await db.insert(testimonials).values(defaultTestimonials);
      console.log('Testimonials seeded.');
    }

    // 9. FAQs
    const existingFaqs = await db.select().from(faqs);
    if (existingFaqs.length === 0) {
      const defaultFaqs = [
        {
          question: 'What is your typical lead time for deploying a workforce crew?',
          answer: 'For standard trade categories (certified welders, electricians, heavy machinery operators), our mobilization lead time is typically 14 to 21 calendar days, inclusive of medical clearances, trade testing, and visa endorsements. For urgent turnaround squads, expedited 7-day deployment packages are available.',
          category: 'Deployment & Logistics',
          displayOrder: 1,
          isPublished: true,
        },
        {
          question: 'How do you verify the technical competency of your workers?',
          answer: 'Every candidate is evaluated at our accredited international technical centers. Tradesmen undergo practical performance evaluations witnessed by third-party inspectors (e.g. AWS/ASME test coupons for welders, simulated load lifts for crane operators), followed by background checks and medical fitness testing.',
          category: 'Vetting & Quality',
          displayOrder: 2,
          isPublished: true,
        },
        {
          question: 'Do you provide end-to-end camp management, transport, and catering?',
          answer: 'Yes. Depending on contractor preference, EquipWorkforce provides full turnkey support including worker accommodation, air-conditioned site transit, nutritional meal plans, laundry, and round-the-clock welfare supervisors.',
          category: 'Welfare & Operations',
          displayOrder: 3,
          isPublished: true,
        },
        {
          question: 'What happens if a deployed worker fails site induction or performance expectations?',
          answer: 'We provide a 100% guarantee. If any personnel fail site trade induction or underperform within the initial 14-day warranty period, we provide immediate no-cost replacement within 72 hours.',
          category: 'Contract & Guarantee',
          displayOrder: 4,
          isPublished: true,
        },
      ];
      await db.insert(faqs).values(defaultFaqs);
      console.log('FAQs seeded.');
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
