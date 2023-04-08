import Layout from '@/components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/AuthForm.module.css';
import { useContext, useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { register, error, setError } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    register({
      username,
      email,
      password,
    });
  };

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message);
      setError(null);
    }
  }, [error]);

  return (
    <Layout title='User Registration'>
      <div className={styles.auth}>
        <h1>
          <FaUser /> Register
        </h1>

        <ToastContainer theme='colored' />

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor='passwordConfirm'>Confirm Password</label>
            <input
              type='password'
              id='passwordConfirm'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <input type='submit' value='Register' className='btn' />
        </form>

        <p>
          Already have an account?
          <Link href='/account/login'> Login</Link>
        </p>
      </div>
    </Layout>
  );
}
