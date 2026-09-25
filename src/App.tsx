import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { DataProvider, useData } from './context/DataContext.tsx';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { WhatsAppButton } from './components/layout/WhatsAppButton.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ServicesPage } from './pages/ServicesPage.tsx';
import { ServiceDetailPage } from './pages/ServiceDetailPage.tsx';
import { WorkforcePage } from './pages/WorkforcePage.tsx';
import { WorkforceDetailPage } from './pages/WorkforceDetailPage.tsx';
import { IndustriesPage } from './pages/IndustriesPage.tsx';
import { IndustryDetailPage } from './pages/IndustryDetailPage.tsx';
import { PortfolioPage } from './pages/PortfolioPage.tsx';
import { PortfolioDetailPage } from './pages/PortfolioDetailPage.tsx';
import { BlogPage } from './pages/BlogPage.tsx';
import { BlogPostPage } from './pages/BlogPostPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { RequestManpowerPage } from './pages/RequestManpowerPage.tsx';
import { LegalPage } from './pages/LegalPage.tsx';
import { AdminLogin } from './components/admin/AdminLogin.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { PreviewSetupBanner } from './components/layout/PreviewSetupBanner.tsx';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname || '/'
  );
  const { isAdmin, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route parsing
  const renderRoute = () => {
    // 1. Admin Routes
    if (currentPath === '/admin/login') {
      return (
        <AdminLogin
          onSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    if (currentPath.startsWith('/admin')) {
      if (isAdmin) {
        return <AdminLayout onNavigateHome={() => navigate('/')} />;
      }
      return (
        <AdminLogin
          onSuccess={() => navigate('/admin')}
          onNavigateHome={() => navigate('/')}
        />
      );
    }

    // 2. Public Detail Routes
    if (currentPath.startsWith('/services/')) {
      const slug = currentPath.replace('/services/', '');
      return <ServiceDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/workforce/')) {
      const slug = currentPath.replace('/workforce/', '');
      return <WorkforceDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/industries/')) {
      const slug = currentPath.replace('/industries/', '');
      return <IndustryDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/portfolio/')) {
      const slug = currentPath.replace('/portfolio/', '');
      return <PortfolioDetailPage slug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/blog/')) {
      const slug = currentPath.replace('/blog/', '');
      return <BlogPostPage slug={slug} onNavigate={navigate} />;
    }

    // 3. Static Public Routes
    switch (currentPath) {
      case '/about':
        return <AboutPage onNavigate={navigate} />;
      case '/services':
        return <ServicesPage onNavigate={navigate} />;
      case '/workforce':
        return <WorkforcePage onNavigate={navigate} />;
      case '/industries':
        return <IndustriesPage onNavigate={navigate} />;
      case '/portfolio':
        return <PortfolioPage onNavigate={navigate} />;
      case '/blog':
        return <BlogPage onNavigate={navigate} />;
      case '/contact':
        return <ContactPage />;
      case '/request-manpower':
        return <RequestManpowerPage />;
      case '/privacy-policy':
        return <LegalPage type="privacy" />;
      case '/terms':
        return <LegalPage type="terms" />;
      case '/':
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <PreviewSetupBanner />
      {!isAdminRoute && (
        <Header currentPath={currentPath} onNavigate={navigate} />
      )}

      <main className="flex-1">
        {renderRoute()}
      </main>

      {!isAdminRoute && (
        <>
          <Footer onNavigate={navigate} />
          <WhatsAppButton />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
