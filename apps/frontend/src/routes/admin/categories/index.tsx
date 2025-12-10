import { Link, createFileRoute } from '@tanstack/react-router';
import type { IAPICategory } from '@/apiClients/categoryClient';
import { useCategories } from '@/dataHooks/categoryData';

export const Route = createFileRoute('/admin/categories/')({
  component: RouteComponent,
});

function RouteComponent() {
  const categoryquery = useCategories();

  return (
    <div className="container">
      <Link to="/admin/categories/create">Create category</Link>

      {categoryquery.isSuccess &&
        categoryquery.data.map((category) => (
          <CategorySection
            category={category}
            key={category.id}
          ></CategorySection>
        ))}
    </div>
  );
}

interface ICategorySectionProps {
  category: IAPICategory;
}

const CategorySection = ({ category }: ICategorySectionProps) => {
  return (
    <div className="d-flex column-gap-2 align-items-end">
      <Link
        className="h2"
        to="/admin/categories/$categoryID"
        params={{ categoryID: category.id }}
      >
        {category.name}
      </Link>
    </div>
  );
};
