import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { FormEventHandler } from 'react';
import { useAuth } from '@/services/authService';

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
});

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    login({
      email: email,
      password: password,
    });
  };

  return (
    <form
      id="login-form"
      onSubmit={submit}
      className="d-flex gap-y-2 flex-column gap-2"
    >
      <div className="input-group">
        <span className="input-group-text">Email</span>
        <input
          id="email"
          type="text"
          className="form-control"
          aria-label="user email"
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Password</span>
        <input
          id="password"
          type="password"
          className="form-control"
          aria-label="user password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
    </form>
  );
};

function RouteComponent() {
  return (
    <div className="container d-flex justify-content-center">
      <div className="card w-50">
        <div className="card-body">
          <h5 className="card-title">Login</h5>

          <LoginForm></LoginForm>

          <div className="d-flex justify-content-end column-gap-2 pt-2 align-items-center">
            <Link to="/signUp" aria-label="go to sign up">
              Dont have an account?
            </Link>

            <button form="login-form" type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
