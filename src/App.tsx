import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";
import VerificationHero from "./pages/VerificationHero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Learn routes */}
          <Route path="/courses/*" element={<ComingSoon />} />
          <Route path="/learning-paths" element={<ComingSoon />} />
          <Route path="/bootcamps" element={<ComingSoon />} />
          <Route path="/certifications" element={<ComingSoon />} />
          <Route path="/classes" element={<ComingSoon />} />
          
          {/* Articles routes */}
          <Route path="/articles/*" element={<ComingSoon />} />
          
          {/* Projects routes */}
          <Route path="/projects/*" element={<ComingSoon />} />
          
          {/* Automation routes */}
          <Route path="/automation/*" element={<ComingSoon />} />
          
          {/* API routes */}
          <Route path="/api/*" element={<ComingSoon />} />
          
          {/* Resources routes */}
          <Route path="/resources/*" element={<ComingSoon />} />
          
          {/* Mentorship routes */}
          <Route path="/mentorship/*" element={<ComingSoon />} />
          
          {/* Verification routes */}
          <Route path="/verification" element={<VerificationHero />} />
          <Route path="/verification-hero" element={<VerificationHero />} />
          <Route path="/dashboard/verification-home" element={<VerificationHero />} />
          
          {/* Other routes */}
          <Route path="/about" element={<ComingSoon />} />
          <Route path="/login" element={<ComingSoon />} />
          <Route path="/signup" element={<ComingSoon />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
