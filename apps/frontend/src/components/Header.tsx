import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Home,
  Menu,
  Pizza,
  ShieldUser,
  ShoppingBasket,
  User,
  UserPen,
  UserPlus,
  X,
} from 'lucide-react';
import { useAuth } from '@/services/authService';
import { useBasket } from '@/services/basketService';
import '.././styles.css';

export default function Header() {
  const { signOut, authStore, isAuthenticated } = useAuth();
  const { toggleBasket } = useBasket();

  isAuthenticated();

  const [isOpen, setIsOpen] = useState(false);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Top Header */}
      <header className="d-flex align-items-center justify-content-between px-3 py-1 text-white shadow-sm header-light-green ">
        <div className="d-flex align-items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-light me-3"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="text-center">
            <h1>Precious Pizza</h1>
            <p> - The one Pizza to rule them all!</p>
          </div>
        </div>

        <div className="d-flex align-items-end">
          <button
            className="btn btn-light me-3"
            onClick={toggleBasket}
            aria-label="Toggle basket"
          >
            <ShoppingBasket size={28} />
          </button>
          <div>
            {!authStore.user && (
              <Link
                to="/login"
                onClick={closeSidebar}
                className="d-flex align-items-center gap-2 p-2 text-black text-decoration-none bg-light rounded hover-bg-secondary"
              >
                <User size={20} />
                <span className="fw-medium">Login</span>
              </Link>
            )}
          </div>
          <div>
            {authStore.user && (
              <button className="btn btn-danger" onClick={signOut}>
                Sign out
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Side Navigation */}
      <div
        className={`position-fixed top-0 start-0 vh-100 bg-dark text-white shadow-lg d-flex flex-column p-3 ${
          isOpen ? 'translate-middle-x-0' : 'translate-middle-x-n100'
        }`}
        style={{
          width: '20rem',
          transition: 'transform 0.3s ease-in-out',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          zIndex: 1050,
        }}
      >
        {/* Side nav header */}
        <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-2 mb-3">
          <h2 className="h5 mb-0">Navigation</h2>
          <button
            onClick={closeSidebar}
            className="btn btn-dark"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-grow-1 overflow-auto">
          {authStore.user?.role === 'admin' && (
            <Link
              to="/admin/categories"
              onClick={closeSidebar}
              className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
            >
              <ShieldUser size={20} />
              <span className="fw-medium">Admin</span>
            </Link>
          )}
          <Link
            to="/"
            onClick={closeSidebar}
            className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
          >
            <Home size={20} />
            <span className="fw-medium">Home</span>
          </Link>

          {!authStore.user && (
            <AuthLinks closeSidebar={closeSidebar}></AuthLinks>
          )}

          {authStore.user && (
            <Link
              to="/userPage"
              onClick={closeSidebar}
              className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
            >
              <UserPen></UserPen>
              <span className="fw-medium">User page</span>
            </Link>
          )}

          <Link
            to="/pizzaPage"
            onClick={closeSidebar}
            className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
          >
            <Pizza size={20} />
            <span className="fw-medium">Menu</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

interface IAuthLinksProps {
  closeSidebar: () => void;
}

const AuthLinks = ({ closeSidebar }: IAuthLinksProps) => {
  return (
    <>
      <Link
        to="/signUp"
        onClick={closeSidebar}
        className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
      >
        <UserPlus size={20} />
        <span className="fw-medium">Sign up</span>
      </Link>

      <Link
        to="/login"
        onClick={closeSidebar}
        className="d-flex align-items-center gap-2 p-2 mb-2 text-white text-decoration-none rounded hover-bg-secondary"
      >
        <User size={20} />
        <span className="fw-medium">Login</span>
      </Link>
    </>
  );
};
