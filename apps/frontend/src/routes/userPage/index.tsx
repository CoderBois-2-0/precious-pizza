import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '@/services/authService';
import { useDeleteFavourite, useFavourites } from '@/dataHooks/favouriteData';

export const Route = createFileRoute('/userPage/')({
  component: UserPage,
  preload: false,
});

function UserPage() {
  const { pageGuard, authStore } = useAuth();
  const favouritesQuery = useFavourites();
  const favouriteDelete = useDeleteFavourite();

  pageGuard();

  const removeFavourite = (favouriteID: string) =>
    favouriteDelete.mutate(favouriteID);

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
                <strong>Name:</strong> {authStore.user?.firstName}{' '}
                {authStore.user?.lastName}
              </p>
              <p className="card-text text-muted">
                <strong>Email:</strong> {authStore.user?.email}
              </p>
              <p className="card-text text-muted">
                <strong>Phone:</strong> {authStore.user?.phoneNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Favourites list */}
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Your Favourite Pizzas</h5>

              <ul className="list-group">
                {favouritesQuery.isSuccess &&
                  favouritesQuery.data.map((favourite) => (
                    <li
                      key={favourite.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {favourite.pizza.name}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFavourite(favourite.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
