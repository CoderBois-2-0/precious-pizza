import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Home, Menu, ShieldUser, User, UserPlus, X } from 'lucide-react';
import { useAuth } from '@/services/authService';

export default function Header() {
  const { signOut, authStore, isAuthenticated } = useAuth();

  isAuthenticated();

  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <header className="d-flex align-items-center justify-content-between px-3 py-1 shadow-sm header-light-green mb-3">
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

        <div>
          {authStore.user && (
            <button className="btn btn-danger" onClick={signOut}>
              Sign out
            </button>
          )}
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
