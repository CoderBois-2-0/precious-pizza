import { useQuery, useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ShoppingBasket, X } from 'lucide-react'
import { useState } from 'react'

export default function BasketPage() {
  const [isOpen, setIsOpen] = useState(true)

  const { data: basket, isLoading } = useQuery({
    queryKey: ['basket'],
    queryFn: async () => {
      const res = await fetch('/api/basket/full')
      return res.json()
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/basket/remove/${id}`, { method: 'DELETE' })
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div
      className={`position-fixed top-0 end-0 vh-100 bg-dark text-white shadow-lg d-flex flex-column p-3 ${
        isOpen ? 'translate-middle-x-0' : 'translate-middle-x-100'
      }`}
      style={{
        width: '20rem',
        transition: 'transform 0.3s ease-in-out',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        zIndex: 1050,
      }}
    >
      <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-3">
        <h2 className="h5 mb-0">Your Basket</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-dark"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto">
        {basket.items.length === 0 ? (
          <p>Your basket is empty.</p>
        ) : (
          basket.items.map((item: any) => (
            <div
              key={item.id}
              className="d-flex justify-content-between align-items-center mb-2 p-2 bg-secondary rounded"
            >
              <div>
                <strong>{item.name}</strong>
                <div>Qty: {item.quantity}</div>
                <div>Price: {item.price} DKK</div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => removeMutation.mutate(item.id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      <div className="border-top border-secondary pt-2 mt-3">
        <h4>Total: {basket.totalPrice} DKK</h4>
        <Link to="/pizzaPage" className="btn btn-light w-100 mt-2 text-black">
          <ShoppingBasket /> Checkout
        </Link>
      </div>
    </div>
  )
}
