import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div>
      <header></header>
      {/* Main content placeholder */}
      <div className="p-3">
        <p>
          Hello this is
          page.................................................................
        </p>
      </div>
    </div>
  )
}
