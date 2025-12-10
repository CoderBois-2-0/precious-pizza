import { createFileRoute } from '@tanstack/react-router';
import BasketPage from '@/components/BasketPage';

export const Route = createFileRoute('/basketPage/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <BasketPage />
    </>
  );
}
