import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/services/authService';

export const Route = createFileRoute('/userPage/')({
  component: UserPage,
  preload: false,
});

function UserPage() {
  const { pageGuard, authStore } = useAuth();

  pageGuard();

  return (
    <div className="container mt-5">
      {/* Page Header */}
      <div className="row mb-4">
        <div className="col">
          <h1 className="fw-bold">User Dashboard</h1>
          <p className="text-muted">Manage your profile and favourites</p>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile card */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Your Profile</h5>
              <p className="card-text text-muted">
                <strong>Email:</strong> {authStore.user?.email}
              </p>

              <button className="btn btn-primary w-100 mt-3">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Favourites list */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Your Favourite Pizzas</h5>

              {/* Example list */}
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Pepperoni
                  <button className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Margherita
                  <button className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  BBQ Chicken
                  <button className="btn btn-sm btn-outline-danger">
                    Remove
                  </button>
                </li>
              </ul>

              <button className="btn btn-success mt-4 w-100">
                Add New Favourite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
