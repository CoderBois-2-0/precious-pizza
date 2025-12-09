import BasketPage from '@/components/BasketPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketPage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
    <BasketPage/>  
      {/* <div>Hello "/basket/"!</div> */}
    </>
  )
}
