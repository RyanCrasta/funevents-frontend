import DashboardEvent from '@/components/DashboardEvent';
import EventItem from '@/components/EventItem';
import Layout from '@/components/Layout';
import { API_URL } from '@/config';
import AuthContext from '@/context/AuthContext';
import { useContext } from 'react';
import NotFoundPage from '../404';

export default function EventsPage({ events }) {
  const { user } = useContext(AuthContext);

  return user && user.isAdmin ? (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}
    </Layout>
  ) : (
    <NotFoundPage />
  );
}

export async function getServerSideProps(context) {
  // Server side rendering: fetch data on each request
  const res = await fetch(`${API_URL}/api/events?populate=*`, {
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });
  
  const events = await res.json();

  return {
    props: {
      events: events.data,
    },
  };
}
