import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pizzaPage/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/pizzaPage/"!</div>;
}
