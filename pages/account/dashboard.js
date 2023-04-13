//! SERVER SIDE AUTH
import DashboardEvent from '@/components/DashboardEvent';
import Layout from '@/components/Layout';
import { API_URL } from '@/config';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/Dashboard.module.css';
import NotFoundPage from '../404';

export default function DashboardPage({ events, token, show }) {
  const router = useRouter();

  const deleteEvent = async (id) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push('/');
      }
    }
  };

  return show ? (
    <Layout title='User Dashboard'>
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Movie Events</h3>

        {events && events.length > 0 ? (
          events.map((evt) => (
            <DashboardEvent key={evt.id} evt={evt} handleDelete={deleteEvent} />
          ))
        ) : (
          <>No events to show</>
        )}
      </div>
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export async function getServerSideProps(context) {
  const res = await fetch(`${API_URL}/api/myevents`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });

  const events = await res.json();

  const userResponse = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });

  const userData = await userResponse.json();

  // 401 Unauthorized
  if(userData.error && userData.error.status === 401){
    return {
      props: {
        show: false
      }
    }
  }

  return {
    props: {
      events,
      token: context.req.cookies.token,
      show: !userData.isAdmin,
    },
  };
}
