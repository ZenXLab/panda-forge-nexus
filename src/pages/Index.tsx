import { BookOpen, Code2, Workflow, Zap, Database, Users } from "lucide-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import ContentCard from "@/components/ContentCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Learn Cutting-Edge Tech",
      description: "Master AI/ML, Agentic AI, Blockchain, Cloud, and DevOps with premium courses and learning paths.",
    },
    {
      icon: Code2,
      title: "Build Real Projects",
      description: "Enterprise-level architecture, source code, and deployment guides for production-ready applications.",
    },
    {
      icon: Workflow,
      title: "Automate Everything",
      description: "Ready-made workflows for n8n, Zapier, Make.com, and LangChain to streamline your processes.",
    },
    {
      icon: Database,
      title: "Developer API Platform",
      description: "LLM API, Model Serving, webhooks, and SDKs for building intelligent applications.",
    },
  ];

  const courses = [
    {
      title: "Agentic AI Mastery",
      description: "Build autonomous AI agents that can reason, plan, and execute complex tasks.",
      badge: "Premium",
      tags: ["AI", "LangChain", "Python"],
    },
    {
      title: "Full-Stack Web3 Development",
      description: "Create decentralized applications with Solidity, React, and IPFS.",
      badge: "New",
      tags: ["Blockchain", "Solidity", "React"],
    },
    {
      title: "Cloud Native Architecture",
      description: "Design scalable systems with Kubernetes, Docker, and microservices.",
      badge: "Popular",
      tags: ["DevOps", "Kubernetes", "AWS"],
    },
    {
      title: "ML Engineering Pipeline",
      description: "End-to-end machine learning systems from data to deployment.",
      badge: "Free",
      tags: ["ML", "Python", "TensorFlow"],
    },
  ];

  const projects = [
    {
      title: "AI-Powered Customer Service Bot",
      description: "Multi-language support with sentiment analysis and ticket routing automation.",
      badge: "Featured",
      tags: ["AI", "NLP", "Automation"],
    },
    {
      title: "DeFi Trading Platform",
      description: "Decentralized exchange with liquidity pools and yield farming.",
      badge: "New",
      tags: ["Web3", "Solidity", "DeFi"],
    },
    {
      title: "Real-time Analytics Dashboard",
      description: "Stream processing with Kafka, Spark, and interactive visualizations.",
      tags: ["Data", "Real-time", "Analytics"],
    },
  ];

  const automationTemplates = [
    {
      title: "Lead Scoring & Enrichment",
      description: "Automated lead qualification with AI-powered scoring and CRM integration.",
      badge: "n8n",
      tags: ["Sales", "CRM", "AI"],
    },
    {
      title: "Content Publishing Pipeline",
      description: "Multi-platform content distribution with SEO optimization and scheduling.",
      badge: "Zapier",
      tags: ["Marketing", "SEO", "Social"],
    },
    {
      title: "Invoice Processing Workflow",
      description: "OCR extraction, validation, and automatic bookkeeping integration.",
      badge: "Make.com",
      tags: ["Finance", "OCR", "Automation"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <Hero />

        {/* Value Proposition */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <FeatureCard
                  key={i}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Learn What Matters in 2025 and Beyond
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Premium courses designed by industry experts to accelerate your engineering career.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course, i) => (
                <ContentCard key={i} {...course} />
              ))}
            </div>
          </div>
        </section>

        {/* Projects Marketplace */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Build Production Projects. Ship Like a Pro.
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Complete project kits with architecture diagrams, source code, and deployment guides.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ContentCard key={i} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Automation Templates */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Automate Your Stack in Minutes
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Pre-built workflows for n8n, Zapier, Make.com, and LangChain.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automationTemplates.map((template, i) => (
                <ContentCard key={i} {...template} />
              ))}
            </div>
          </div>
        </section>

        {/* API Platform CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="relative rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
              <div className="relative z-10">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  A Developer-First API Hub
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Token-based LLM API, Agentic workflow API, Webhooks, and SDKs (JS, Python, .NET)
                </p>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 hover-glow">
                  Explore the Docs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Stay Ahead of the Future
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                AI, Automation, Engineering, and Future Tech. Delivered Weekly.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Join 20,000+ Engineers
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
