import cors from "cors";
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import nodemailer, { type Transporter } from 'nodemailer';
import {
  db,
  isDatabaseAvailable,
  isDatabaseConfigured,
  testDatabaseConnection,
} from './src/db/index.ts';
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
  contactSubmissions,
  manpowerRequests,
  activityLogs,
  media,
} from './src/db/schema.ts';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { seedDatabase } from './src/db/seed.ts';
import { eq, desc, count } from 'drizzle-orm';
import {
  fallbackSettings,
  fallbackServices,
  fallbackWorkforceCategories,
  fallbackIndustries,
  fallbackPortfolio,
  fallbackBlogPosts,
  fallbackTestimonials,
  fallbackFaqs,
  fallbackFormOptions,
} from './src/data/fallbackData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: ["https://almathabirihltd.com", "https://www.almathabirihltd.com", "http://localhost:5173"], credentials: true }));
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage for media uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedMime = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      'application/pdf',
    ];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
});

// ==========================================
// SMTP / EMAIL SERVICE (Configured via env vars)
// ==========================================
const isSmtpConfigured = Boolean(
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
);

let mailTransporter: Transporter | null = null;
if (isSmtpConfigured) {
  try {
    mailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    console.log(`[SMTP] Mailer configured for host: ${process.env.SMTP_HOST}`);
  } catch (err) {
    console.warn('[SMTP] Failed to initialize mail transporter:', err);
  }
} else {
  console.log('[SMTP] No SMTP credentials provided. Running in preview notification mode.');
}

async function sendNotificationEmail(options: {
  to?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  if (mailTransporter && isSmtpConfigured) {
    try {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || `"EquipWorkforce Notifications" <${process.env.SMTP_USER}>`,
        to: options.to || process.env.SMTP_USER,
        subject: options.subject,
        text: options.text,
        html: options.html || options.text,
      });
      console.log(`[SMTP] Email notification delivered: "${options.subject}"`);
      return true;
    } catch (err) {
      console.error('[SMTP] Failed to deliver email notification:', err);
      return false;
    }
  } else {
    console.log(`[SMTP Preview Mode] Simulated email notification:`);
    console.log(`  Subject: ${options.subject}`);
    console.log(`  To: ${options.to || 'Admin'}`);
    console.log(`  Message: ${options.text.slice(0, 140)}...`);
    return true;
  }
}

// In-memory runtime settings cache (allows preview modifications to stick in-session)
let sessionSettings = { ...fallbackSettings };

// ==========================================
// SYSTEM STATUS ENDPOINT
// ==========================================
app.get('/api/system/status', (_req, res) => {
  const dbConnected = isDatabaseAvailable();
  const dbConfigured = isDatabaseConfigured();

  res.json({
    status: 'ok',
    previewMode: !dbConnected,
    database: {
      configured: dbConfigured,
      connected: dbConnected,
      mode: dbConnected ? 'connected' : 'preview_fallback',
      connectionType: process.env.DATABASE_URL
        ? 'DATABASE_URL'
        : process.env.SQL_HOST
        ? 'SQL_HOST'
        : 'none',
    },
    smtp: {
      configured: isSmtpConfigured,
      host: process.env.SMTP_HOST || null,
      port: process.env.SMTP_PORT || null,
      from: process.env.SMTP_FROM || null,
      mode: isSmtpConfigured ? 'live_mailer' : 'preview_simulation',
    },
    environment: {
      hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
      hasSqlHost: Boolean(process.env.SQL_HOST),
      hasSqlUser: Boolean(process.env.SQL_USER),
      hasSmtpHost: Boolean(process.env.SMTP_HOST),
      hasSmtpUser: Boolean(process.env.SMTP_USER),
    },
  });
});

// ==========================================
// PUBLIC API ENDPOINTS
// ==========================================

// Global initial data (high performance batching)
app.get('/api/public/initial-data', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const [
        settingsRows,
        serviceRows,
        workforceRows,
        industryRows,
        portfolioRows,
        blogRows,
        testimonialRows,
        faqRows,
        formOptionRows,
      ] = await Promise.all([
        db.select().from(siteSettings).limit(1),
        db.select().from(services).where(eq(services.isPublished, true)),
        db.select().from(workforceCategories),
        db.select().from(industries),
        db.select().from(portfolio),
        db
          .select()
          .from(blogPosts)
          .where(eq(blogPosts.status, 'published'))
          .orderBy(desc(blogPosts.publishedAt)),
        db.select().from(testimonials),
        db.select().from(faqs).where(eq(faqs.isPublished, true)),
        db.select().from(formOptions).where(eq(formOptions.isActive, true)),
      ]);

      return res.json({
        dbConnected: true,
        previewMode: false,
        settings: settingsRows[0] || sessionSettings,
        services: serviceRows.length > 0 ? serviceRows : fallbackServices,
        workforceCategories:
          workforceRows.length > 0 ? workforceRows : fallbackWorkforceCategories,
        industries: industryRows.length > 0 ? industryRows : fallbackIndustries,
        portfolio: portfolioRows.length > 0 ? portfolioRows : fallbackPortfolio,
        blogPosts: blogRows.length > 0 ? blogRows : fallbackBlogPosts,
        testimonials:
          testimonialRows.length > 0 ? testimonialRows : fallbackTestimonials,
        faqs: faqRows.length > 0 ? faqRows : fallbackFaqs,
        formOptions:
          formOptionRows.length > 0 ? formOptionRows : fallbackFormOptions,
      });
    } catch (error: any) {
      console.warn(
        '[Database] Error fetching initial data from DB, serving fallback:',
        error.message || error
      );
    }
  }

  // Graceful fallback for preview mode when database is not connected or error occurred
  res.json({
    dbConnected: false,
    previewMode: true,
    message:
      'Running in preview mode. Production environment variables are not required for preview.',
    settings: sessionSettings,
    services: fallbackServices,
    workforceCategories: fallbackWorkforceCategories,
    industries: fallbackIndustries,
    portfolio: fallbackPortfolio,
    blogPosts: fallbackBlogPosts,
    testimonials: fallbackTestimonials,
    faqs: fallbackFaqs,
    formOptions: fallbackFormOptions,
  });
});

// Services public
app.get('/api/public/services', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const allServices = await db
        .select()
        .from(services)
        .where(eq(services.isPublished, true));
      return res.json(allServices.length > 0 ? allServices : fallbackServices);
    } catch (error) {
      console.warn('DB error on /api/public/services, using fallback');
    }
  }
  res.json(fallbackServices);
});

app.get('/api/public/services/:slug', async (req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const item = await db
        .select()
        .from(services)
        .where(eq(services.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    } catch (error) {
      console.warn('DB error on service slug, using fallback');
    }
  }
  const fallback = fallbackServices.find((s) => s.slug === req.params.slug);
  if (!fallback) return res.status(404).json({ error: 'Service not found' });
  res.json(fallback);
});

// Workforce Categories public
app.get('/api/public/workforce', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const categories = await db.select().from(workforceCategories);
      return res.json(
        categories.length > 0 ? categories : fallbackWorkforceCategories
      );
    } catch (error) {
      console.warn('DB error on /api/public/workforce, using fallback');
    }
  }
  res.json(fallbackWorkforceCategories);
});

app.get('/api/public/workforce/:slug', async (req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const item = await db
        .select()
        .from(workforceCategories)
        .where(eq(workforceCategories.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    } catch (error) {
      console.warn('DB error on workforce slug, using fallback');
    }
  }
  const fallback = fallbackWorkforceCategories.find(
    (w) => w.slug === req.params.slug
  );
  if (!fallback) return res.status(404).json({ error: 'Category not found' });
  res.json(fallback);
});

// Industries public
app.get('/api/public/industries', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const list = await db.select().from(industries);
      return res.json(list.length > 0 ? list : fallbackIndustries);
    } catch (error) {
      console.warn('DB error on /api/public/industries, using fallback');
    }
  }
  res.json(fallbackIndustries);
});

app.get('/api/public/industries/:slug', async (req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const item = await db
        .select()
        .from(industries)
        .where(eq(industries.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    } catch (error) {
      console.warn('DB error on industry slug, using fallback');
    }
  }
  const fallback = fallbackIndustries.find((i) => i.slug === req.params.slug);
  if (!fallback) return res.status(404).json({ error: 'Industry not found' });
  res.json(fallback);
});

// Portfolio public
app.get('/api/public/portfolio', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const list = await db.select().from(portfolio);
      return res.json(list.length > 0 ? list : fallbackPortfolio);
    } catch (error) {
      console.warn('DB error on /api/public/portfolio, using fallback');
    }
  }
  res.json(fallbackPortfolio);
});

app.get('/api/public/portfolio/:slug', async (req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const item = await db
        .select()
        .from(portfolio)
        .where(eq(portfolio.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    } catch (error) {
      console.warn('DB error on portfolio slug, using fallback');
    }
  }
  const fallback = fallbackPortfolio.find((p) => p.slug === req.params.slug);
  if (!fallback) return res.status(404).json({ error: 'Project not found' });
  res.json(fallback);
});

// Blog public
app.get('/api/public/blog', async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const posts = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.publishedAt));
      return res.json(posts.length > 0 ? posts : fallbackBlogPosts);
    } catch (error) {
      console.warn('DB error on /api/public/blog, using fallback');
    }
  }
  res.json(fallbackBlogPosts);
});

app.get('/api/public/blog/:slug', async (req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const item = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, req.params.slug))
        .limit(1);
      if (item.length) return res.json(item[0]);
    } catch (error) {
      console.warn('DB error on blog slug, using fallback');
    }
  }
  const fallback = fallbackBlogPosts.find((b) => b.slug === req.params.slug);
  if (!fallback) return res.status(404).json({ error: 'Article not found' });
  res.json(fallback);
});

// Submit Contact Form
app.post('/api/public/contact', async (req, res) => {
  try {
    const { name, email, phone, country, subject, inquiryType, message } =
      req.body;
    if (!name || !email || !phone || !inquiryType || !message) {
      return res.status(400).json({
        error: 'Name, email, contact phone/WhatsApp, inquiry type, and message are required.',
      });
    }

    const submissionId = `CONT-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    if (isDatabaseAvailable()) {
      try {
        await db.insert(contactSubmissions).values({
          submissionId,
          name,
          email,
          phone: phone || '',
          country: country || '',
          subject: subject || 'New Website Contact Inquiry',
          inquiryType,
          message,
          status: 'new',
        });

        await db.insert(activityLogs).values({
          userEmail: email,
          action: 'SUBMIT_CONTACT',
          entity: 'ContactSubmission',
          entityId: submissionId,
          details: `New contact submission from ${name} (${email}) - ${inquiryType}`,
        });
      } catch (dbErr) {
        console.warn(
          '[Database] Could not persist contact submission to DB:',
          dbErr
        );
      }
    }

    // Trigger notification email (live SMTP if configured, or simulated preview log)
    await sendNotificationEmail({
      subject: `New Inquiry [${submissionId}]: ${subject || inquiryType}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${
        phone || 'N/A'
      }\nCountry: ${country || 'N/A'}\nType: ${inquiryType}\n\nMessage:\n${message}`,
    });

    res.status(201).json({
      success: true,
      message:
        'Your inquiry has been received. Our team will contact you shortly.',
      submissionId,
      previewMode: !isDatabaseAvailable(),
    });
  } catch (error: any) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to record contact inquiry.' });
  }
});

// Submit Manpower Request Form
app.post('/api/public/manpower-request', async (req, res) => {
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      country,
      city,
      service,
      manpowerCategory,
      workerCount,
      startDate,
      duration,
      skills,
      experience,
      reqAccommodation,
      reqTransport,
      reqFood,
      otherReqs,
      preferredContact,
    } = req.body;

    if (
      !companyName ||
      !contactPerson ||
      !email ||
      !phone ||
      !service ||
      !manpowerCategory
    ) {
      return res
        .status(400)
        .json({ error: 'Missing mandatory company or requirement details.' });
    }

    const requestNumber = `REQ-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    if (isDatabaseAvailable()) {
      try {
        await db.insert(manpowerRequests).values({
          requestNumber,
          companyName,
          contactPerson,
          email,
          phone,
          country: country || 'International',
          city: city || '',
          service,
          manpowerCategory,
          workerCount: Number(workerCount) || 1,
          startDate: startDate || '',
          duration: duration || '',
          skills: skills || '',
          experience: experience || '',
          reqAccommodation: Boolean(reqAccommodation),
          reqTransport: Boolean(reqTransport),
          reqFood: Boolean(reqFood),
          otherReqs: otherReqs || '',
          preferredContact: preferredContact || 'email',
          status: 'new',
        });

        await db.insert(activityLogs).values({
          userEmail: email,
          action: 'SUBMIT_MANPOWER_REQUEST',
          entity: 'ManpowerRequest',
          entityId: requestNumber,
          details: `New manpower requisition for ${
            workerCount || 1
          }x ${manpowerCategory} from ${companyName}`,
        });
      } catch (dbErr) {
        console.warn(
          '[Database] Could not persist manpower request to DB:',
          dbErr
        );
      }
    }

    // Trigger notification email
    await sendNotificationEmail({
      subject: `New Manpower Requisition [${requestNumber}] from ${companyName}`,
      text: `Company: ${companyName}\nContact: ${contactPerson} (${email}, ${phone})\nService: ${service}\nCategory: ${manpowerCategory} (${
        workerCount || 1
      } workers)\nStart Date: ${startDate || 'Immediate'}\nDuration: ${
        duration || 'TBD'
      }`,
    });

    res.status(201).json({
      success: true,
      message:
        'Manpower requisition submitted successfully. Our deployment coordinator will review and provide a formal proposal.',
      requestNumber,
      previewMode: !isDatabaseAvailable(),
    });
  } catch (error: any) {
    console.error('Manpower request submission error:', error);
    res.status(500).json({ error: 'Failed to record manpower requisition.' });
  }
});

// Dynamic Sitemap.xml
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const baseUrl = process.env.APP_URL || 'https://equipworkforce.com';

    let allServices = fallbackServices;
    let allCategories = fallbackWorkforceCategories;
    let allProjects = fallbackPortfolio;
    let allPosts = fallbackBlogPosts;

    if (isDatabaseAvailable()) {
      try {
        const [dbServices, dbCats, dbProj, dbPosts] = await Promise.all([
          db.select().from(services).where(eq(services.isPublished, true)),
          db.select().from(workforceCategories),
          db.select().from(portfolio),
          db.select().from(blogPosts).where(eq(blogPosts.status, 'published')),
        ]);
        if (dbServices.length) allServices = dbServices as any;
        if (dbCats.length) allCategories = dbCats as any;
        if (dbProj.length) allProjects = dbProj as any;
        if (dbPosts.length) allPosts = dbPosts as any;
      } catch (e) {
        // Fallback to static lists
      }
    }

    const staticUrls = [
      '',
      '/about',
      '/services',
      '/workforce',
      '/industries',
      '/portfolio',
      '/blog',
      '/contact',
      '/request-manpower',
      '/privacy-policy',
      '/terms',
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticUrls.forEach((route) => {
      xml += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    allServices.forEach((s) => {
      xml += `  <url>\n    <loc>${baseUrl}/services/${s.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    allCategories.forEach((w) => {
      xml += `  <url>\n    <loc>${baseUrl}/workforce/${w.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    });

    allProjects.forEach((p) => {
      xml += `  <url>\n    <loc>${baseUrl}/portfolio/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    allPosts.forEach((b) => {
      xml += `  <url>\n    <loc>${baseUrl}/blog/${b.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic Robots.txt
app.get('/robots.txt', (_req, res) => {
  const baseUrl = process.env.APP_URL || 'https://equipworkforce.com';
  const content = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/admin\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
  res.header('Content-Type', 'text/plain');
  res.send(content);
});

// ==========================================
// ADMIN PROTECTED APIS
// ==========================================

// Current Admin User
app.get('/api/admin/me', requireAuth, (req: AuthRequest, res) => {
  res.json({
    user: req.user,
    dbUser: req.dbUser,
  });
});

// Admin Dashboard Real Statistics
app.get('/api/admin/stats', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const [
        totalContact,
        newContact,
        totalManpower,
        newManpower,
        totalServicesCount,
        totalBlogCount,
        totalPortfolioCount,
        recentContacts,
        recentRequests,
      ] = await Promise.all([
        db.select({ count: count() }).from(contactSubmissions),
        db
          .select({ count: count() })
          .from(contactSubmissions)
          .where(eq(contactSubmissions.status, 'new')),
        db.select({ count: count() }).from(manpowerRequests),
        db
          .select({ count: count() })
          .from(manpowerRequests)
          .where(eq(manpowerRequests.status, 'new')),
        db.select({ count: count() }).from(services),
        db.select({ count: count() }).from(blogPosts),
        db.select({ count: count() }).from(portfolio),
        db
          .select()
          .from(contactSubmissions)
          .orderBy(desc(contactSubmissions.createdAt))
          .limit(5),
        db
          .select()
          .from(manpowerRequests)
          .orderBy(desc(manpowerRequests.createdAt))
          .limit(5),
      ]);

      return res.json({
        totalContactMessages: totalContact[0]?.count || 0,
        newContactMessages: newContact[0]?.count || 0,
        totalManpowerRequests: totalManpower[0]?.count || 0,
        newManpowerRequests: newManpower[0]?.count || 0,
        totalServices: totalServicesCount[0]?.count || 0,
        totalBlogPosts: totalBlogCount[0]?.count || 0,
        totalPortfolioProjects: totalPortfolioCount[0]?.count || 0,
        recentContacts,
        recentRequests,
        previewMode: false,
      });
    } catch (error: any) {
      console.warn('DB error on admin stats, serving fallback stats');
    }
  }

  // Preview Mode Stats
  res.json({
    previewMode: true,
    totalContactMessages: 2,
    newContactMessages: 1,
    totalManpowerRequests: 1,
    newManpowerRequests: 1,
    totalServices: fallbackServices.length,
    totalBlogPosts: fallbackBlogPosts.length,
    totalPortfolioProjects: fallbackPortfolio.length,
    recentContacts: [
      {
        id: 1,
        submissionId: 'CONT-PREVIEW-001',
        name: 'Apex Infrastructure Lead',
        email: 'inquiries@apexcorp.com',
        inquiryType: 'Workforce Deployment Inquiry',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    ],
    recentRequests: [
      {
        id: 1,
        requestNumber: 'REQ-PREVIEW-001',
        companyName: 'Gulf Marine Contractors',
        contactPerson: 'Kareem Fahad',
        manpowerCategory: 'Certified Welders & Structural Fabricators',
        workerCount: 50,
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

// Contact Submissions List & Manage
app.get('/api/admin/contact-submissions', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(contactSubmissions)
        .orderBy(desc(contactSubmissions.createdAt));
      return res.json(rows);
    } catch (error) {
      console.warn('DB error fetching contact submissions');
    }
  }
  res.json([
    {
      id: 1,
      submissionId: 'CONT-PREVIEW-001',
      name: 'Apex Infrastructure Lead',
      email: 'inquiries@apexcorp.com',
      phone: '+971 4 391 0000',
      country: 'United Arab Emirates',
      subject: 'Mobilization for Yanbu Storage Jetty',
      inquiryType: 'workforce_deployment',
      message:
        'Requisitioning 40 certified structural steel fabricators and 20 pipefitters for Q3 start.',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      submissionId: 'CONT-PREVIEW-002',
      name: 'Nordic EPC Director',
      email: 'logistics@nordic-offshore.dk',
      phone: '+45 33 12 34 56',
      country: 'Denmark',
      subject: 'Offshore Substation GWO Technicians',
      inquiryType: 'headhunting',
      message:
        'Need 15 BOSIET certified HV technicians for North Sea wind assembly project.',
      status: 'in_review',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
});

app.patch(
  '/api/admin/contact-submissions/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        const { status, notes } = req.body;
        const updated = await db
          .update(contactSubmissions)
          .set({
            ...(status ? { status } : {}),
            ...(notes !== undefined ? { notes } : {}),
            updatedAt: new Date(),
          })
          .where(eq(contactSubmissions.id, id))
          .returning();

        return res.json({ success: true, updated: updated[0] });
      } catch (error) {
        console.warn('DB error updating contact submission');
      }
    }
    res.json({
      success: true,
      previewMode: true,
      message: 'Status updated in preview mode.',
    });
  }
);

app.delete(
  '/api/admin/contact-submissions/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db
          .delete(contactSubmissions)
          .where(eq(contactSubmissions.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting contact submission');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Manpower Requests List & Manage
app.get('/api/admin/manpower-requests', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(manpowerRequests)
        .orderBy(desc(manpowerRequests.createdAt));
      return res.json(rows);
    } catch (error) {
      console.warn('DB error fetching manpower requests');
    }
  }
  res.json([
    {
      id: 1,
      requestNumber: 'REQ-PREVIEW-001',
      companyName: 'Gulf Marine Contractors',
      contactPerson: 'Kareem Fahad',
      email: 'procurement@gulfmarine.com',
      phone: '+966 13 800 1234',
      country: 'Saudi Arabia',
      city: 'Yanbu Industrial City',
      service: 'Offshore, Oil & Gas Technical Staffing',
      manpowerCategory: 'Certified Welders & Structural Fabricators',
      workerCount: 50,
      startDate: '2026-10-01',
      duration: '12 Months',
      skills: '6G TIG/SMAW, ASME Sec IX, Pipefitting',
      experience: '5+ years refinery / terminal project experience',
      reqAccommodation: true,
      reqTransport: true,
      reqFood: true,
      preferredContact: 'phone',
      status: 'new',
      createdAt: new Date().toISOString(),
    },
  ]);
});

app.patch(
  '/api/admin/manpower-requests/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        const { status, notes, assignedCoordinator } = req.body;
        const updated = await db
          .update(manpowerRequests)
          .set({
            ...(status ? { status } : {}),
            ...(notes !== undefined ? { notes } : {}),
            ...(assignedCoordinator !== undefined
              ? { assignedCoordinator }
              : {}),
            updatedAt: new Date(),
          })
          .where(eq(manpowerRequests.id, id))
          .returning();

        return res.json({ success: true, updated: updated[0] });
      } catch (error) {
        console.warn('DB error updating manpower request');
      }
    }
    res.json({
      success: true,
      previewMode: true,
      message: 'Status updated in preview mode.',
    });
  }
);

app.delete(
  '/api/admin/manpower-requests/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(manpowerRequests).where(eq(manpowerRequests.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting manpower request');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

function sanitizePayload(data: any, jsonArrayFields: string[] = []) {
  if (!data || typeof data !== 'object') return data;
  const { id: _ignoredId, createdAt: _ignoredCreatedAt, ...clean } = data;
  for (const field of jsonArrayFields) {
    if (clean[field] !== undefined && clean[field] !== null) {
      if (Array.isArray(clean[field])) {
        clean[field] = JSON.stringify(clean[field]);
      } else if (typeof clean[field] === 'string') {
        const trimmed = clean[field].trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
          try {
            JSON.parse(trimmed);
            clean[field] = trimmed;
          } catch {
            clean[field] = JSON.stringify(trimmed.split(',').map((s: string) => s.trim()).filter(Boolean));
          }
        } else {
          clean[field] = JSON.stringify(trimmed.split(',').map((s: string) => s.trim()).filter(Boolean));
        }
      }
    }
  }
  return clean;
}

// Services CRUD
app.get('/api/admin/services', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(services)
        .orderBy(services.displayOrder);
      return res.json(rows.length ? rows : fallbackServices);
    } catch (error) {
      console.warn('DB error fetching admin services');
    }
  }
  res.json(fallbackServices);
});

app.post('/api/admin/services', requireAuth, async (req: AuthRequest, res) => {
  const payload = sanitizePayload(req.body, ['benefits', 'industries']);
  if (payload.image && !payload.featuredImage) {
    payload.featuredImage = payload.image;
  }
  delete payload.image;
  if (isDatabaseAvailable()) {
    try {
      const [created] = await db
        .insert(services)
        .values(payload)
        .returning();
      return res.status(201).json(created);
    } catch (error) {
      console.warn('DB error creating service', error);
    }
  }
  res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
});

app.put(
  '/api/admin/services/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const payload = sanitizePayload(req.body, ['benefits', 'industries']);
    if (payload.image && !payload.featuredImage) {
      payload.featuredImage = payload.image;
    }
    delete payload.image;
    if (isDatabaseAvailable()) {
      try {
        const [updated] = await db
          .update(services)
          .set({ ...payload, updatedAt: new Date() })
          .where(eq(services.id, id))
          .returning();
        return res.json(updated);
      } catch (error) {
        console.warn('DB error updating service', error);
      }
    }
    res.json({
      ...payload,
      id,
      previewMode: true,
    });
  }
);

app.delete(
  '/api/admin/services/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(services).where(eq(services.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting service');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Workforce Categories CRUD
app.get('/api/admin/workforce', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(workforceCategories)
        .orderBy(workforceCategories.displayOrder);
      return res.json(rows.length ? rows : fallbackWorkforceCategories);
    } catch (error) {
      console.warn('DB error fetching admin workforce');
    }
  }
  res.json(fallbackWorkforceCategories);
});

app.post('/api/admin/workforce', requireAuth, async (req: AuthRequest, res) => {
  const payload = sanitizePayload(req.body, ['skills', 'relatedIndustries']);
  if (payload.featuredImage && !payload.image) {
    payload.image = payload.featuredImage;
  }
  delete payload.featuredImage;
  if (isDatabaseAvailable()) {
    try {
      const [created] = await db
        .insert(workforceCategories)
        .values(payload)
        .returning();
      return res.status(201).json(created);
    } catch (error) {
      console.warn('DB error creating workforce category', error);
    }
  }
  res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
});

app.put(
  '/api/admin/workforce/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const payload = sanitizePayload(req.body, ['skills', 'relatedIndustries']);
    if (payload.featuredImage && !payload.image) {
      payload.image = payload.featuredImage;
    }
    delete payload.featuredImage;
    if (isDatabaseAvailable()) {
      try {
        const [updated] = await db
          .update(workforceCategories)
          .set({ ...payload, updatedAt: new Date() })
          .where(eq(workforceCategories.id, id))
          .returning();
        return res.json(updated);
      } catch (error) {
        console.warn('DB error updating workforce category', error);
      }
    }
    res.json({
      ...payload,
      id,
      previewMode: true,
    });
  }
);

app.delete(
  '/api/admin/workforce/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db
          .delete(workforceCategories)
          .where(eq(workforceCategories.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting workforce category');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Industries CRUD
app.get('/api/admin/industries', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(industries)
        .orderBy(industries.displayOrder);
      return res.json(rows.length ? rows : fallbackIndustries);
    } catch (error) {
      console.warn('DB error fetching admin industries');
    }
  }
  res.json(fallbackIndustries);
});

app.post('/api/admin/industries', requireAuth, async (req: AuthRequest, res) => {
  const payload = sanitizePayload(req.body);
  if (payload.featuredImage && !payload.image) {
    payload.image = payload.featuredImage;
  }
  delete payload.featuredImage;
  if (isDatabaseAvailable()) {
    try {
      const [created] = await db
        .insert(industries)
        .values(payload)
        .returning();
      return res.status(201).json(created);
    } catch (error) {
      console.warn('DB error creating industry', error);
    }
  }
  res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
});

app.put(
  '/api/admin/industries/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const payload = sanitizePayload(req.body);
    if (payload.featuredImage && !payload.image) {
      payload.image = payload.featuredImage;
    }
    delete payload.featuredImage;
    if (isDatabaseAvailable()) {
      try {
        const [updated] = await db
          .update(industries)
          .set({ ...payload, updatedAt: new Date() })
          .where(eq(industries.id, id))
          .returning();
        return res.json(updated);
      } catch (error) {
        console.warn('DB error updating industry', error);
      }
    }
    res.json({
      ...payload,
      id,
      previewMode: true,
    });
  }
);

app.delete(
  '/api/admin/industries/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(industries).where(eq(industries.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting industry');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Portfolio Projects CRUD
app.get('/api/admin/portfolio', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(portfolio)
        .orderBy(desc(portfolio.createdAt));
      return res.json(rows.length ? rows : fallbackPortfolio);
    } catch (error) {
      console.warn('DB error fetching admin portfolio');
    }
  }
  res.json(fallbackPortfolio);
});

app.post('/api/admin/portfolio', requireAuth, async (req: AuthRequest, res) => {
  const payload = sanitizePayload(req.body, ['gallery', 'servicesProvided', 'workforceCategories']);
  if (payload.image && !payload.featuredImage) {
    payload.featuredImage = payload.image;
  }
  delete payload.image;
  if (isDatabaseAvailable()) {
    try {
      const [created] = await db
        .insert(portfolio)
        .values(payload)
        .returning();
      return res.status(201).json(created);
    } catch (error) {
      console.warn('DB error creating portfolio project', error);
    }
  }
  res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
});

app.put(
  '/api/admin/portfolio/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const payload = sanitizePayload(req.body, ['gallery', 'servicesProvided', 'workforceCategories']);
    if (payload.image && !payload.featuredImage) {
      payload.featuredImage = payload.image;
    }
    delete payload.image;
    if (isDatabaseAvailable()) {
      try {
        const [updated] = await db
          .update(portfolio)
          .set({ ...payload, updatedAt: new Date() })
          .where(eq(portfolio.id, id))
          .returning();
        return res.json(updated);
      } catch (error) {
        console.warn('DB error updating portfolio project', error);
      }
    }
    res.json({
      ...payload,
      id,
      previewMode: true,
    });
  }
);

app.delete(
  '/api/admin/portfolio/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(portfolio).where(eq(portfolio.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting portfolio project');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Blog Posts CRUD
app.get('/api/admin/blog', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt));
      return res.json(rows.length ? rows : fallbackBlogPosts);
    } catch (error) {
      console.warn('DB error fetching admin blog posts');
    }
  }
  res.json(fallbackBlogPosts);
});

app.post('/api/admin/blog', requireAuth, async (req: AuthRequest, res) => {
  const payload = sanitizePayload(req.body, ['tags']);
  if (payload.image && !payload.featuredImage) {
    payload.featuredImage = payload.image;
  }
  delete payload.image;
  if (isDatabaseAvailable()) {
    try {
      const [created] = await db
        .insert(blogPosts)
        .values(payload)
        .returning();
      return res.status(201).json(created);
    } catch (error) {
      console.warn('DB error creating blog post', error);
    }
  }
  res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
});

app.put('/api/admin/blog/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const payload = sanitizePayload(req.body, ['tags']);
  if (payload.image && !payload.featuredImage) {
    payload.featuredImage = payload.image;
  }
  delete payload.image;
  if (isDatabaseAvailable()) {
    try {
      const [updated] = await db
        .update(blogPosts)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();
      return res.json(updated);
    } catch (error) {
      console.warn('DB error updating blog post', error);
    }
  }
  res.json({ ...payload, id, previewMode: true });
});

app.delete(
  '/api/admin/blog/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(blogPosts).where(eq(blogPosts.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting blog post');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Form Options CRUD
app.get('/api/admin/form-options', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(formOptions)
        .orderBy(formOptions.displayOrder);
      return res.json(rows.length ? rows : fallbackFormOptions);
    } catch (error) {
      console.warn('DB error fetching admin form options');
    }
  }
  res.json(fallbackFormOptions);
});

app.post(
  '/api/admin/form-options',
  requireAuth,
  async (req: AuthRequest, res) => {
    const payload = sanitizePayload(req.body);
    if (isDatabaseAvailable()) {
      try {
        const [created] = await db
          .insert(formOptions)
          .values(payload)
          .returning();
        return res.status(201).json(created);
      } catch (error) {
        console.warn('DB error creating form option', error);
      }
    }
    res.status(201).json({ ...payload, id: Date.now(), previewMode: true });
  }
);

app.put(
  '/api/admin/form-options/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    const id = Number(req.params.id);
    const payload = sanitizePayload(req.body);
    if (isDatabaseAvailable()) {
      try {
        const [updated] = await db
          .update(formOptions)
          .set(payload)
          .where(eq(formOptions.id, id))
          .returning();
        return res.json(updated);
      } catch (error) {
        console.warn('DB error updating form option', error);
      }
    }
    res.json({ ...payload, id, previewMode: true });
  }
);

app.delete(
  '/api/admin/form-options/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    if (isDatabaseAvailable()) {
      try {
        const id = Number(req.params.id);
        await db.delete(formOptions).where(eq(formOptions.id, id));
        return res.json({ success: true });
      } catch (error) {
        console.warn('DB error deleting form option');
      }
    }
    res.json({ success: true, previewMode: true });
  }
);

// Site Settings Management
app.get('/api/admin/settings', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db.select().from(siteSettings).limit(1);
      if (rows[0]) return res.json(rows[0]);
    } catch (error) {
      console.warn('DB error fetching site settings');
    }
  }
  res.json(sessionSettings);
});

app.put('/api/admin/settings', requireAuth, async (req: AuthRequest, res) => {
  // Update in-memory session settings so changes reflect immediately in preview
  sessionSettings = { ...sessionSettings, ...req.body };

  if (isDatabaseAvailable()) {
    try {
      const updateData = { ...req.body };
      delete updateData.id;
      delete updateData.updatedAt;

      const rows = await db.select().from(siteSettings).limit(1);
      if (rows.length > 0) {
        const [resRow] = await db
          .update(siteSettings)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(siteSettings.id, rows[0].id))
          .returning();
        return res.json(resRow);
      } else {
        const [resRow] = await db
          .insert(siteSettings)
          .values(updateData)
          .returning();
        return res.json(resRow);
      }
    } catch (error: any) {
      console.warn('DB error updating settings:', error.message || error);
    }
  }

  res.json({
    ...sessionSettings,
    previewMode: true,
    message:
      'Settings updated in preview session. Configure DATABASE_URL for permanent persistence.',
  });
});

// Upload and update company profile PDF
app.post(
  '/api/admin/company-profile/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded.' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      const originalName = req.file.originalname;

      sessionSettings = {
        ...sessionSettings,
        companyProfilePdfUrl: fileUrl,
        companyProfilePdfName: originalName,
      };

      if (isDatabaseAvailable()) {
        try {
          const rows = await db.select().from(siteSettings).limit(1);
          if (rows.length > 0) {
            await db
              .update(siteSettings)
              .set({
                companyProfilePdfUrl: fileUrl,
                companyProfilePdfName: originalName,
                updatedAt: new Date(),
              })
              .where(eq(siteSettings.id, rows[0].id));
          } else {
            await db.insert(siteSettings).values({
              companyProfilePdfUrl: fileUrl,
              companyProfilePdfName: originalName,
            });
          }
        } catch (dbErr: any) {
          console.warn('[Database] Could not persist company profile PDF to DB:', dbErr);
        }
      }

      res.status(200).json({
        success: true,
        message: 'Company profile PDF uploaded and updated successfully.',
        url: fileUrl,
        filename: req.file.filename,
        originalName,
      });
    } catch (err: any) {
      console.error('Company profile PDF upload error:', err);
      res.status(500).json({ error: err.message || 'Failed to upload company profile PDF.' });
    }
  }
);

// Global in-memory sets to track deleted media items in preview/session
const deletedMediaSet = new Set<string>();

// Built-in project stock visual assets so they are visible and selectable in Media Gallery
const stockAssets = [
  {
    id: 9001,
    filename: 'hero_workforce_logistics_1790187512878.jpg',
    originalName: 'Hero Workforce Logistics & Heavy Industrial (Case Study / Banner)',
    url: '/src/assets/images/hero_workforce_logistics_1790187512878.jpg',
    mimeType: 'image/jpeg',
    size: 320000,
    category: 'case_study',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9002,
    filename: 'service_industrial_construction_1790187524192.jpg',
    originalName: 'Civil & Heavy Construction Infrastructure (Case Study / Gallery)',
    url: '/src/assets/images/service_industrial_construction_1790187524192.jpg',
    mimeType: 'image/jpeg',
    size: 280000,
    category: 'case_study',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9003,
    filename: 'service_technical_logistics_1790187537100.jpg',
    originalName: 'Marine Terminals & Port Automation Logistics',
    url: '/src/assets/images/service_technical_logistics_1790187537100.jpg',
    mimeType: 'image/jpeg',
    size: 310000,
    category: 'service',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9004,
    filename: 'service_hospitality_facility_1790187549977.jpg',
    originalName: 'Facility Management & Commercial Real Estate',
    url: '/src/assets/images/service_hospitality_facility_1790187549977.jpg',
    mimeType: 'image/jpeg',
    size: 290000,
    category: 'service',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9005,
    filename: 'about_global_workforce_1790187561296.jpg',
    originalName: 'Global Workforce Deployment Operations',
    url: '/src/assets/images/about_global_workforce_1790187561296.jpg',
    mimeType: 'image/jpeg',
    size: 330000,
    category: 'workforce',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9006,
    filename: 'company_logo_primary.svg',
    originalName: 'AL Mathabirih HR & EquipWorkforce Official Logo (Light/Primary)',
    url: '/uploads/company_logo_primary.svg',
    mimeType: 'image/svg+xml',
    size: 2700,
    category: 'branding',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9007,
    filename: 'company_logo_dark.svg',
    originalName: 'AL Mathabirih HR & EquipWorkforce Official Logo (Dark Theme)',
    url: '/uploads/company_logo_dark.svg',
    mimeType: 'image/svg+xml',
    size: 2100,
    category: 'branding',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  {
    id: 9008,
    filename: 'company_logo_primary.png',
    originalName: 'AL Mathabirih HR & EquipWorkforce Official High-Res PNG Logo',
    url: '/uploads/company_logo_primary.png',
    mimeType: 'image/png',
    size: 14200,
    category: 'branding',
    createdAt: new Date('2025-01-01').toISOString(),
  },
];

// Media Library Management (Reads uploads from disk even without DB!)
app.post(
  '/api/admin/media/upload',
  requireAuth,
  upload.single('file'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file was uploaded.' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      let mediaItem: any = {
        id: Date.now(),
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: fileUrl,
        mimeType: req.file.mimetype,
        size: req.file.size,
        category: req.body.category || 'general',
        createdAt: new Date().toISOString(),
      };

      if (isDatabaseAvailable()) {
        try {
          const [dbMedia] = await db
            .insert(media)
            .values({
              filename: req.file.filename,
              originalName: req.file.originalname,
              url: fileUrl,
              mimeType: req.file.mimetype,
              size: req.file.size,
              altText: req.file.originalname,
            })
            .returning();
          if (dbMedia) mediaItem = dbMedia;
        } catch (dbErr) {
          console.warn('DB insert failed for media upload, file saved to disk');
        }
      }

      res.status(201).json({
        success: true,
        file: mediaItem,
        previewMode: !isDatabaseAvailable(),
      });
    } catch (error: any) {
      console.error('Media upload error:', error);
      res.status(500).json({ error: error.message || 'File upload failed.' });
    }
  }
);

app.get('/api/admin/media', requireAuth, async (_req, res) => {
  let combinedMedia: any[] = [];

  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(media)
        .orderBy(desc(media.createdAt));
      if (rows.length > 0) {
        combinedMedia = [...rows];
      }
    } catch (error) {
      console.warn('DB error fetching media, falling back to disk files');
    }
  }

  // Scan disk uploads
  try {
    const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
    const diskUploads = files
      .filter((f) => !f.startsWith('.'))
      .map((f) => {
        const fileUrl = `/uploads/${f}`;
        const dbMatch = combinedMedia.find((m) => m.url === fileUrl || m.filename === f);
        return {
          id: dbMatch ? dbMatch.id : f,
          filename: f,
          originalName: f.split('-').slice(2).join('-') || f,
          url: fileUrl,
          mimeType: f.endsWith('.png')
            ? 'image/png'
            : f.endsWith('.svg')
            ? 'image/svg+xml'
            : f.endsWith('.webp')
            ? 'image/webp'
            : 'image/jpeg',
          size: fs.statSync(path.join(uploadDir, f)).size,
          category: 'upload',
          createdAt: fs.statSync(path.join(uploadDir, f)).birthtime.toISOString(),
        };
      });

    // Merge disk uploads that aren't already in db list
    for (const d of diskUploads) {
      if (!combinedMedia.some((m) => m.url === d.url || m.filename === d.filename)) {
        combinedMedia.push(d);
      }
    }
  } catch (err) {
    console.warn('Error reading uploadDir:', err);
  }

  // Also include built-in stock visual assets (so case study & service images appear in library)
  for (const s of stockAssets) {
    if (!combinedMedia.some((m) => m.url === s.url)) {
      combinedMedia.push(s);
    }
  }

  // Filter out any assets that have been deleted
  const filtered = combinedMedia.filter(
    (m) =>
      !deletedMediaSet.has(String(m.id)) &&
      !deletedMediaSet.has(m.url) &&
      !deletedMediaSet.has(m.filename)
  );

  return res.json(filtered);
});

app.delete(
  '/api/admin/media/:id',
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const rawParamId = req.params.id;
      const paramId = decodeURIComponent(rawParamId);
      const queryUrl = typeof req.query.url === 'string' ? decodeURIComponent(req.query.url) : '';
      const queryFilename = typeof req.query.filename === 'string' ? decodeURIComponent(req.query.filename) : '';
      const numId = Number(paramId);

      // Record in deleted set so it won't show up again
      deletedMediaSet.add(rawParamId);
      deletedMediaSet.add(paramId);
      if (queryUrl) deletedMediaSet.add(queryUrl);
      if (queryFilename) deletedMediaSet.add(queryFilename);
      if (!isNaN(numId)) {
        deletedMediaSet.add(String(numId));
      }

      // Check stock assets and mark all identifiers
      for (const s of stockAssets) {
        if (
          String(s.id) === paramId ||
          s.url === paramId ||
          s.filename === paramId ||
          rawParamId === s.url ||
          (queryUrl && s.url === queryUrl) ||
          (queryFilename && s.filename === queryFilename)
        ) {
          deletedMediaSet.add(String(s.id));
          deletedMediaSet.add(s.url);
          deletedMediaSet.add(s.filename);
        }
      }

      // Check if file is in uploads and delete from filesystem
      try {
        const files = fs.existsSync(uploadDir) ? fs.readdirSync(uploadDir) : [];
        for (const file of files) {
          const fileUrl = `/uploads/${file}`;
          const isMatch =
            file === paramId ||
            file === queryFilename ||
            fileUrl === paramId ||
            fileUrl === queryUrl ||
            (queryUrl && queryUrl.endsWith(file)) ||
            (paramId && paramId.endsWith(file)) ||
            (!isNaN(numId) && (file.startsWith(`${numId}-`) || file.includes(`-${numId}-`)));

          if (isMatch) {
            const diskPath = path.join(uploadDir, file);
            if (fs.existsSync(diskPath)) {
              fs.unlinkSync(diskPath);
            }
            deletedMediaSet.add(file);
            deletedMediaSet.add(fileUrl);
          }
        }
      } catch (fsErr) {
        console.warn('Filesystem delete warning:', fsErr);
      }

      // If database is available, delete from database
      if (isDatabaseAvailable()) {
        try {
          if (!isNaN(numId) && numId > 0) {
            const item = await db
              .select()
              .from(media)
              .where(eq(media.id, numId))
              .limit(1);
            if (item.length) {
              const filePath = path.join(
                __dirname,
                'public',
                item[0].url.replace(/^\//, '')
              );
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
              await db.delete(media).where(eq(media.id, numId));
            }
          }
          if (queryUrl) {
            await db.delete(media).where(eq(media.url, queryUrl));
          }
          if (queryFilename) {
            await db.delete(media).where(eq(media.filename, queryFilename));
          }
        } catch (dbErr) {
          console.warn('DB error deleting media record:', dbErr);
        }
      }

      res.json({ success: true, id: paramId, previewMode: !isDatabaseAvailable() });
    } catch (error: any) {
      console.error('Delete media error:', error);
      res.status(500).json({ error: 'Failed to delete media asset' });
    }
  }
);

// Activity Logs
app.get('/api/admin/activity-logs', requireAuth, async (_req, res) => {
  if (isDatabaseAvailable()) {
    try {
      const rows = await db
        .select()
        .from(activityLogs)
        .orderBy(desc(activityLogs.createdAt))
        .limit(100);
      return res.json(rows);
    } catch (error) {
      console.warn('DB error fetching activity logs');
    }
  }
  res.json([
    {
      id: 1,
      userEmail: 'admin@equipworkforce.com',
      action: 'SYSTEM_BOOT_PREVIEW',
      entity: 'System',
      entityId: 'SYS-INIT',
      details: 'EquipWorkforce started in preview mode with fallback seed data.',
      createdAt: new Date().toISOString(),
    },
  ]);
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// ==========================================
// VITE INTEGRATION / PRODUCTION SERVING
// ==========================================
async function startServer() {
  // Test database connection asynchronously without crashing server
  testDatabaseConnection()
    .then((connected) => {
      if (connected) {
        console.log('✅ PostgreSQL Database connected successfully.');
        seedDatabase().catch((err) =>
          console.error('Database seed notice:', err)
        );
      } else {
        console.log(
          'ℹ️ Running in Preview Mode: No database credentials configured or database unreachable.'
        );
        console.log(
          'ℹ️ Application frontend and APIs are available in preview mode without requiring DATABASE_URL.'
        );
      }
    })
    .catch((err) => {
      console.warn('Database availability check error:', err);
    });

  if (
    process.env.NODE_ENV === 'production' &&
    fs.existsSync(path.join(__dirname, 'dist'))
  ) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite dev server middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EquipWorkforce Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
