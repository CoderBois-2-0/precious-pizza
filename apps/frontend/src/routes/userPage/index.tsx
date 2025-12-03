import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/userPage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/userPage/"!</div>
}
