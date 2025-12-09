import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/pizzas/$pizzaID')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Work in progress</div>;
}
