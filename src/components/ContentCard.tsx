import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ContentCardProps {
  title: string;
  description: string;
  badge?: string;
  image?: string;
  tags?: string[];
}

const ContentCard = ({ title, description, badge, image, tags = [] }: ContentCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50 hover-glow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-6xl font-bold text-primary/20">{title[0]}</div>
          </div>
        )}
        {badge && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            {badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA */}
        <Button variant="ghost" size="sm" className="group/btn w-full">
          Learn More
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};

export default ContentCard;
