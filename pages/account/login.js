import Layout from '@/components/Layout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from '../../styles/AuthForm.module.css';
import { useContext, useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Link from 'next/link';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const { login, error, setError, user } = useContext(AuthContext);

  useEffect(() => {
    if (error && error.message) {
      toast.error(error.message);
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if(user){
      router.push('/')
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
        <Layout title='User Login'>
      <div className={styles.auth}>
        <h1>
          <FaUser /> Log In
        </h1>

        <ToastContainer theme='colored' />

        <form onSubmit={handleSubmit}>
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

          <input type='submit' value='Login' className='btn' />
        </form>

        <p>
          Don't have an account?
          <Link href='/account/register'> Register</Link>
        </p>
      </div>
    </Layout>
      
  );
}


