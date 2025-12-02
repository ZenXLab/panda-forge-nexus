import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Workflow, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-16 bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-white px-4 py-1.5 text-sm shadow-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">100+ Premium Courses & Projects</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-fade-up">
            Build, Learn, and <span className="text-gradient">Automate</span> the Future
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.1s" }}>
            A next-gen engineering platform for AI/ML, Agentic AI, Automation Workflows, 
            Blockchain, Cloud, DevOps, and real-world projects.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-3 text-sm animate-fade-up" style={{ animationDelay: "0.2s" }}>
            {[
              { icon: BookOpen, text: "Learn Cutting-Edge Tech" },
              { icon: Code2, text: "Build Real Projects" },
              { icon: Workflow, text: "Automate Everything" },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-2 rounded-lg border border-border bg-white px-4 py-2 shadow-sm">
                <item.icon className="h-4 w-4 text-primary" />
                <span className="text-foreground">{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="shadow-sm hover:shadow-md transition-all">
              Explore Projects
            </Button>
          </div>

          {/* Sub-CTA text */}
          <p className="text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Free courses included. No credit card required.
          </p>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-4 pt-8 text-sm animate-fade-up" style={{ animationDelay: "0.5s" }}>
            {["Try Demo Dashboard", "Explore API Docs", "View Automation Templates", "Join Newsletter"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
