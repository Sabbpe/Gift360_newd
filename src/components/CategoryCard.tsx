import { Card, CardContent } from '@/components/ui/card';
import type { Category } from '@/data/categories';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const Icon = category.icon;

  return (
    <Card
      className="hover-elevate active-elevate-2 cursor-pointer transition-all duration-300 hover:shadow-md"
      onClick={onClick}
      data-testid={`card-category-${category.id}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base" data-testid={`text-category-name-${category.id}`}>
              {category.name}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-category-count-${category.id}`}>
              {category.count} items
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
