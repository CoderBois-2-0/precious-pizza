import { useState } from 'react';
import { Link, createFileRoute } from '@tanstack/react-router';
import type { FormEventHandler } from 'react';
import { useAuth } from '@/services/authService';

export const Route = createFileRoute('/(auth)/signUp')({
  component: RouteComponent,
});

const SignUpForm = () => {
  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    // if (password !== confirmPassword) {
    //   alert('Passwords do not match!');
    //   return;
    // }

    signUp({
      'first-name': firstName,
      'last-name': lastName,
      email: email,
      'phone-number': phoneNumber,
      password: password,
      'confirm-password': confirmPassword,
    });
  };

  return (
    <form
      id="sign-up-form"
      onSubmit={submit}
      className="d-flex gap-y-2 flex-column gap-2"
    >
      <div className="input-group">
        <span className="input-group-text">First name</span>
        <input
          id="first-name"
          type="text"
          className="form-control"
          onChange={(event) => setFirstName(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Last name</span>
        <input
          id="last-name"
          type="text"
          className="form-control"
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Email</span>
        <input
          id="email"
          type="text"
          className="form-control"
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Phone number</span>
        <input
          id="phone-number"
          type="text"
          className="form-control"
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Password</span>
        <input
          id="password"
          type="password"
          className="form-control"
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="input-group">
        <span className="input-group-text">Confirm password</span>
        <input
          id="confirm-password"
          type="password"
          className="form-control"
          onChange={(event) => setConfirmPassword(event.target.value)}
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
          <h5 className="card-title">Sign up</h5>

          <SignUpForm></SignUpForm>

          <div className="d-flex justify-content-end pt-2 column-gap-2 align-items-center">
            <Link to="/login" aria-label="go to login">
              Already have an account?
            </Link>

            <button
              form="sign-up-form"
              type="submit"
              className="btn btn-primary"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
