import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Code2, Workflow, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f15_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm backdrop-blur-sm animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">100+ Premium Courses & Projects</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight animate-fade-up">
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
              <div key={i} className="flex items-center space-x-2 rounded-lg border border-border bg-card/50 px-4 py-2 backdrop-blur-sm">
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 hover-glow">
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="border-glow">
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

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
