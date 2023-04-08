import AuthContext from '@/context/AuthContext';
import Link from 'next/link';
import { useContext } from 'react';
import styles from '../styles/Header.module.css';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href='/'>DJ Events</Link>
      </div>

      <nav>
        <ul>
          {user ? (
            <>
              {user.isAdmin ? (
                <li>
                  <Link href='/events'>Events</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link href='/events/add'>Add Events</Link>
                  </li>

                  <li>
                    <Link href='/account/dashboard'>Dashboard</Link>
                  </li>
                </>
              )}

              <li>
                <button onClick={() => logout()} className='btn-none'>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href='/account/login'>Login</Link>
              </li>
              <li>
                <Link href='/account/register'>Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
