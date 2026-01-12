import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Products from './components/Products';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SEO from './components/SEO';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import ProjectsPage from './pages/Projects';
import ProductsPage from './pages/Products';
import NotFound from './pages/NotFound';

// Admin Imports
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';

// Placeholder components for Admin routes
import AdminProjects from './pages/admin/Projects';
import AdminArticles from './pages/admin/Articles';
import AdminProducts from './pages/admin/Products';
import AdminProfile from './pages/admin/Profile';
import ContactMessages from './pages/admin/ContactMessages';

import { supabase } from './lib/supabaseClient';

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        const offsetTop = element.offsetTop - 64;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return null;
};

const FaviconUpdater = () => {
  useEffect(() => {
    const updateFavicon = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .single();

      if (data?.avatar_url) {
        const link = document.querySelector("link[rel~='icon']");
        if (!link) {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          document.head.appendChild(newLink);
          newLink.href = data.avatar_url;
        } else {
          link.href = data.avatar_url;
        }
      }
    };

    updateFavicon();
  }, []);

  return null;
};

function App() {
  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-primary selection:text-white transition-colors duration-300">
      <ScrollToHash />
      <FaviconUpdater />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <SEO
              title="Bisbiss"
              description="Portfolio of Bisri Mustofa, a tech enthusiast and developer specializing in modern web technologies. Explore my projects, articles, and products."
              keywords="Bisri Mustofa, Bisbiss, web developer, portfolio, React, JavaScript, full-stack developer, tech enthusiast"
            />
            <Navbar />
            <main>
              <Hero />
              <About />
              <Projects />
              <Products />
              <Articles />
              <Contact />
            </main>
            <Footer />
          </>
        } />

        <Route path="/projects" element={
          <>
            <Navbar />
            <ProjectsPage />
            <Footer />
          </>
        } />

        <Route path="/products" element={
          <>
            <Navbar />
            <ProductsPage />
            <Footer />
          </>
        } />

        <Route path="/articles" element={
          <>
            <Navbar />
            <Articles />
            <Footer />
          </>
        } />

        <Route path="/articles/:slug" element={
          <>
            <Navbar />
            <ArticleDetail />
            <Footer />
          </>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="messages" element={<ContactMessages />} />
        </Route>

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
