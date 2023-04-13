import styles from '../styles/EventItem.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function EventItem({ evt }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          width={170}
          height={100}
          alt='event-image'
          src={
            evt?.image?.data?.attributes?.url
              ? evt.image.data.attributes.url
              : '/images/event-default.png'
          }
        />
      </div>
      <div className={styles.info}>
        <span>
          {new Date(evt.date).toLocaleDateString('en-US')} at {evt.time}
        </span>
        <h3>{evt.name}</h3>
      </div>

      <div className={styles.link}>
        <Link href={`/events/${evt.slug}`}>
          <p className='btn'>Details</p>
        </Link>
      </div>
    </div>
  );
}
