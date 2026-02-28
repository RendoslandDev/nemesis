import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Ticker from "./components/Ticker";
import Hero from "./components/Hero";
import Issues from "./components/Issues";
import Topics from "./components/Topics";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import ReadPage from "./pages/ReadPage";
import ArchivePage from "./pages/ArchivePage";
import PostPage from "./pages/PostPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ConfirmPage from "./pages/ConfrimPage";
import UnsubscribePage from "./pages/UnsubscribePage";
import AdminPage from "./pages/AdminPage";

const HomePage: React.FC = () => (
  <>
    <Hero />
    <Ticker />
    <Issues />
    <Topics />
    <Testimonials />
    <CTA />
  </>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <div className="min-h-screen bg-cream flex flex-col">
        <Nav />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/read/:id" element={<ReadPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/post" element={<PostPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/unsubscribe" element={<UnsubscribePage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
