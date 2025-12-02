import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ComingSoon = () => {
  const location = useLocation();
  const pageName = location.pathname.split('/').filter(Boolean).join(' / ');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex items-center justify-center px-4 pt-16">
        <div className="text-center space-y-6 max-w-2xl">
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm shadow-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Coming Soon</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            This Page is Under Construction
          </h1>
          
          <p className="text-xl text-muted-foreground">
            We're working hard to bring you <span className="font-semibold text-primary">{pageName}</span>.
            Check back soon!
          </p>

          <div className="pt-4">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;
