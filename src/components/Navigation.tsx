import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const menuItems = [
    {
      title: "Learn",
      items: [
        { label: "Free Courses", href: "/courses/free" },
        { label: "Premium Courses", href: "/courses/premium" },
        { label: "Learning Paths", href: "/learning-paths" },
        { label: "Bootcamps & Workshops", href: "/bootcamps" },
        { label: "Certifications", href: "/certifications" },
        { label: "Recorded Classes", href: "/classes" },
      ],
    },
    {
      title: "Articles",
      items: [
        { label: "All Articles", href: "/articles" },
        { label: "AI/ML", href: "/articles/ai-ml" },
        { label: "Agentic AI", href: "/articles/agentic-ai" },
        { label: "Blockchain & Web3", href: "/articles/blockchain" },
        { label: "Cloud & DevOps", href: "/articles/cloud-devops" },
        { label: "Engineering", href: "/articles/engineering" },
        { label: "Case Studies", href: "/articles/case-studies" },
        { label: "Premium Articles", href: "/articles/premium" },
      ],
    },
    {
      title: "Projects",
      items: [
        { label: "All Projects", href: "/projects" },
        { label: "AI Projects", href: "/projects/ai" },
        { label: "Agentic AI Agents", href: "/projects/agentic-ai" },
        { label: "Blockchain dApps", href: "/projects/blockchain" },
        { label: "Full-Stack Projects", href: "/projects/fullstack" },
        { label: "DevOps Projects", href: "/projects/devops" },
        { label: "Buy Project Kits", href: "/projects/kits" },
      ],
    },
    {
      title: "Automation",
      items: [
        { label: "Workflow Templates", href: "/automation" },
        { label: "n8n Templates", href: "/automation/n8n" },
        { label: "Zapier Templates", href: "/automation/zapier" },
        { label: "Make.com Templates", href: "/automation/make" },
        { label: "LangChain Workflows", href: "/automation/langchain" },
        { label: "AI Agent Pipelines", href: "/automation/ai-agents" },
      ],
    },
    {
      title: "API & Docs",
      items: [
        { label: "API Documentation", href: "/api/docs" },
        { label: "API Catalog", href: "/api/catalog" },
        { label: "SDKs", href: "/api/sdks" },
        { label: "Pricing", href: "/api/pricing" },
        { label: "Status Page", href: "/api/status" },
      ],
    },
    {
      title: "Resources",
      items: [
        { label: "Innovation Papers", href: "/resources/papers" },
        { label: "Tech News", href: "/resources/news" },
        { label: "Guides & E-books", href: "/resources/guides" },
        { label: "Tools & Utilities", href: "/resources/tools" },
        { label: "Events & Meetups", href: "/resources/events" },
      ],
    },
    {
      title: "Mentorship",
      items: [
        { label: "1:1 Mentorship", href: "/mentorship/1-1" },
        { label: "Career Coaching", href: "/mentorship/career" },
        { label: "Mock Interviews", href: "/mentorship/interviews" },
        { label: "Resume Review", href: "/mentorship/resume" },
        { label: "Book a Session", href: "/mentorship/book" },
      ],
    },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-border bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">AP</span>
            </div>
            <span className="text-lg font-semibold text-foreground">AbhishekPanda</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((menu) => (
              <div 
                key={menu.title} 
                className="relative"
                onMouseEnter={() => setActiveDropdown(menu.title)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent">
                  <span>{menu.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {/* Dropdown */}
                {activeDropdown === menu.title && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white border border-border rounded-lg shadow-xl min-w-[240px] p-2 animate-fade-in">
                      {menu.items.map((item) => (
                        <NavLink
                          key={item.label}
                          to={item.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <NavLink to="/about">
              <Button variant="ghost" size="sm">About</Button>
            </NavLink>
            <NavLink to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </NavLink>
            <NavLink to="/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 max-h-[80vh] overflow-y-auto animate-fade-in">
            <div className="space-y-4">
              {menuItems.map((menu) => (
                <div key={menu.title} className="space-y-2">
                  <div className="font-semibold text-sm px-4 text-foreground">{menu.title}</div>
                  <div className="space-y-1">
                    {menu.items.map((item) => (
                      <NavLink
                        key={item.label}
                        to={item.href}
                        className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-4 px-4 space-y-2">
                <NavLink to="/about" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">About</Button>
                </NavLink>
                <NavLink to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </NavLink>
                <NavLink to="/signup" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-primary text-primary-foreground">Get Started</Button>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
