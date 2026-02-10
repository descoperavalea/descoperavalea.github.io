import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Video from "./pages/Video";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter
        basename={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Fără slash final (ex. /descopera-valea) → redirecționare la acasă cu slash */}
          <Route path="" element={<Navigate to="/" replace />} />
          {/* Redirect /admin from SPA to static Sveltia admin HTML */}
          <Route
            path="/admin"
            element={<Navigate to="/admin/index.html" replace />}
          />
          <Route path="/despre" element={<About />} />
          <Route path="/galerie" element={<Gallery />} />
          <Route path="/video" element={<Video />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
