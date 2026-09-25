import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'EquipWorkforce_Company_Profile.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4' });

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Primary colors
const navy = '#0f172a';
const blue = '#2563eb';
const gray = '#475569';
const lightGray = '#f8fafc';

// --- PAGE 1: COVER & EXECUTIVE SUMMARY ---
doc.rect(0, 0, doc.page.width, 140).fill(navy);

doc.fillColor('#ffffff').fontSize(26).font('Helvetica-Bold')
   .text('EQUIPWORKFORCE GLOBAL', 50, 45, { characterSpacing: 1 });

doc.fillColor('#93c5fd').fontSize(12).font('Helvetica')
   .text('INTERNATIONAL TECHNICAL MANPOWER & INDUSTRIAL STAFFING SOLUTIONS', 50, 80);

doc.fillColor('#cbd5e1').fontSize(10)
   .text('Accredited Workforce Supplier · ISO 9001:2015 & ISO 45001 Certified', 50, 100);

doc.moveDown(4);

doc.fillColor(navy).fontSize(18).font('Helvetica-Bold')
   .text('Corporate Capability & Mobilization Profile', 50, 165);

doc.rect(50, 190, 500, 2).fill(blue);

doc.fillColor(gray).fontSize(10).font('Helvetica').moveDown(1.5);
doc.text(
  'EquipWorkforce Global is a premier international manpower supply and recruitment agency specializing in heavy engineering, construction, oil & gas turnarounds, automated maritime ports, petrochemical plants, and critical infrastructure worldwide. With over 18,500+ certified specialists deployed and a 99.4% trade exam pass rate, we deliver turn-key workforce solutions tailored to the strictest international HSE and operational standards.',
  50,
  205,
  { width: 500, lineGap: 4 }
);

// Key Stats Box
const statsY = 280;
doc.rect(50, statsY, 500, 75).fill(lightGray).stroke(navy);
doc.fillColor(blue).fontSize(20).font('Helvetica-Bold').text('18,500+', 70, statsY + 15);
doc.fillColor(gray).fontSize(9).font('Helvetica').text('Specialists Deployed', 70, statsY + 45);

doc.fillColor(blue).fontSize(20).font('Helvetica-Bold').text('99.4%', 200, statsY + 15);
doc.fillColor(gray).fontSize(9).font('Helvetica').text('Trade Exam Pass Rate', 200, statsY + 45);

doc.fillColor(blue).fontSize(20).font('Helvetica-Bold').text('48-Hour', 330, statsY + 15);
doc.fillColor(gray).fontSize(9).font('Helvetica').text('Rapid Mobilization', 330, statsY + 45);

doc.fillColor(blue).fontSize(20).font('Helvetica-Bold').text('24/7', 450, statsY + 15);
doc.fillColor(gray).fontSize(9).font('Helvetica').text('Operations Desk', 450, statsY + 45);

// Core Sectors
doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Primary Industry Specializations', 50, 380);
const sectors = [
  '• Oil & Gas Upstream, Midstream & Refinery Turnarounds (ASME, API certified)',
  '• Civil Infrastructure, Mega-Bridges, Metro Rail & Tunnelling (Saudi Aramco / NEOM standard)',
  '• Offshore & Marine Fabrication (6G/TIG/FCAW AWS-qualified welders, GWO wind technicians)',
  '• Industrial Automation, PLC Engineering & Substation Electrification',
  '• Heavy Rigging, Mobile Crane Operations (100T+) and Critical Lifting Supervisors',
  '• Integrated Camp Management, Medical Support & Turnkey Logistics'
];

let currY = 405;
sectors.forEach((sec) => {
  doc.fillColor(gray).fontSize(10).font('Helvetica').text(sec, 60, currY, { width: 480 });
  currY += 20;
});

// Quality & Compliance
doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Global HSE & Compliance Protocols', 50, 545);
doc.fillColor(gray).fontSize(10).font('Helvetica').text(
  'Every operative undergoes multi-stage biometric vetting, background security clearances, medical fitness testing (OGUK / GCC Approved Medical Centers Association), and rigorous practical trade examination in certified technical workshops prior to mobilization.',
  50,
  570,
  { width: 500, lineGap: 3 }
);

// Footer on Page 1
doc.fillColor(gray).fontSize(8).text('EquipWorkforce Global Profile · Confidential & Proprietary · Page 1 of 2', 50, 780, { align: 'center', width: 500 });

// --- PAGE 2: SERVICES & MOBILIZATION ---
doc.addPage();
doc.rect(0, 0, doc.page.width, 80).fill(navy);
doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold')
   .text('EQUIPWORKFORCE GLOBAL · CAPABILITY OVERVIEW', 50, 30);

doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Turnkey Workforce Categories', 50, 110);

const trades = [
  { category: 'Structural & Pressure Welding', desc: '6G SMAW, GTAW, FCAW, SAW, ASME Sec IX & AWS D1.1 certified welders.' },
  { category: 'Pipefitting & Rigging Specialists', desc: 'Hydraulic torqueing, flange management, certified riggers (OPITO / LEEA).' },
  { category: 'Electrical & Instrumentation (E&I)', desc: 'ATEX / CompEx certified technicians for hazardous offshore and petrochemical environments.' },
  { category: 'Heavy Plant & Mobile Crane Operators', desc: 'Third-party certified operators for mobile, crawler, and tower cranes with valid GCC licenses.' },
  { category: 'Turnaround & Shutdown Taskforces', desc: 'Rapid deployment squads (100–1,000+ men) for time-critical refinery maintenance overhauls.' }
];

let tradeY = 135;
trades.forEach((t) => {
  doc.fillColor(blue).fontSize(11).font('Helvetica-Bold').text(t.category, 50, tradeY);
  doc.fillColor(gray).fontSize(9.5).font('Helvetica').text(t.desc, 50, tradeY + 14, { width: 490 });
  tradeY += 38;
});

// Mobilization Timeline
doc.fillColor(navy).fontSize(14).font('Helvetica-Bold').text('Standard Deployment Timeline', 50, 350);
const timeline = [
  { day: 'Day 1–2', step: 'Requisition Analysis & Candidate Shortlisting from Pre-Vetted Database' },
  { day: 'Day 3–4', step: 'Client Technical Interview, Practical Weld / Trade Test & Biometric Confirmation' },
  { day: 'Day 5–7', step: 'Medical Clearance (GAMCA/OGUK), Police Attestation & Visa Processing' },
  { day: 'Day 8–10', step: 'Travel Logistics, Camp Allocation & HSE Induction on Project Site' }
];

let timeY = 375;
timeline.forEach((item) => {
  doc.fillColor(blue).fontSize(10).font('Helvetica-Bold').text(item.day, 50, timeY, { width: 80 });
  doc.fillColor(gray).fontSize(9.5).font('Helvetica').text(item.step, 140, timeY, { width: 400 });
  timeY += 24;
});

// Corporate Office & Contact Details
doc.rect(50, 490, 500, 160).fill('#f1f5f9');
doc.fillColor(navy).fontSize(13).font('Helvetica-Bold').text('Headquarters & Regional Operations', 70, 510);

doc.fillColor(gray).fontSize(9.5).font('Helvetica')
   .text('Head Office: 100 Bishopsgate, Level 24, London EC2N 4AG, United Kingdom', 70, 535)
   .text('Saudi Arabia Hub: King Abdulaziz Road, Al Jubail Industrial City / Yanbu', 70, 555)
   .text('Direct Telephone: +44 20 7946 0920  |  WhatsApp Dispatch: +966 53 414 7351', 70, 575)
   .text('Corporate Email: contact@equipworkforce.com  |  Tenders: contracts@equipworkforce.com', 70, 595)
   .text('Website & Requisition Portal: https://equipworkforce.com', 70, 615);

// Page 2 Footer
doc.fillColor(gray).fontSize(8).text('EquipWorkforce Global Profile · ISO Certified · Page 2 of 2', 50, 780, { align: 'center', width: 500 });

doc.end();

writeStream.on('finish', () => {
  console.log('Company Profile PDF generated successfully at:', outputPath);
});
