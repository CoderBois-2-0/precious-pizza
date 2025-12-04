import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketPage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div>Hello "/basket/"!</div>
    </>
  )
}
