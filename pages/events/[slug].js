import Layout from '@/components/Layout';
import { API_URL } from '@/config';
import Link from 'next/link';
import styles from '../../styles/Event.module.css';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

export default function EventPage({ evt, img }) {
  return (
    <Layout>
      <div className={styles.event}>
        <span>
          {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
        </span>
        <h1>{evt.name}</h1>
        <ToastContainer />
        <div className={styles.image}>
          <Image
            src={img?.url ? img.url : '/images/event-default.png'}
            width={900}
            height={600}
            alt='event-image'
          />
        </div>

        <h3>Performers:</h3>
        <p>{evt.performers}</p>

        <h3>Description:</h3>
        <p>{evt.description}</p>

        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // check if ADMIN
  const userResponse = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });

  const userData = await userResponse.json();

  if (userData.isAdmin) {
    const res = await fetch(
      `${API_URL}/api/events?filters[slug]=${context.query.slug}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${context.req.cookies.token}`,
        },
      }
    );
    const evt = await res.json();

    return {
      props: {
        evt: evt.data[0].attributes,
        img: evt.data[0]?.attributes?.image?.data?.attributes || '',
      },
    };
  }

  const res = await fetch(
    `${API_URL}/api/myevents`,
    {
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    }
  );
  const evt = await res.json();

  const data = evt.filter((e) => {
    if (e.slug === context.query.slug) {
      return e;
    }
  });

  return {
    props: {
      evt: data[0],
      img: data[0].image,
    },
  };
}

//!-========

// export async function getStaticPaths(context) {
//   const res = await fetch(`${API_URL}/api/events`);
//   const evts = await res.json();

//   const paths = evts.data.map((evt) => ({
//     params: {
//       slug: evt.attributes.slug.toString(),
//     },
//   }));

//   return {
//     paths,
//     fallback: false, // show 404 if slug not found
//   };
// }

//!-========

// If a page has Dynamic Routes and uses getStaticProps,
// it needs to define a list of paths to be statically
// generated.
// export async function getStaticProps(context) {
//   const { slug } = context.params;

//   const res = await fetch(
//     `${API_URL}/api/events?filters[slug]=${slug}&populate=*`
//   );
//   const evt = await res.json();

//   return {
//     props: {
//       evt: evt.data[0].attributes,
//       mg: evt.data[0]?.attributes?.image?.data?.attributes || '',
//     },
//   };
// }
