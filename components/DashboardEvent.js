import Link from 'next/link';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import styles from '../styles/DashboardEvent.module.css';

export default function DashboardEvent({ evt, handleDelete }) {
  return (
    <div className={styles.event}>
      <h4>
        <Link href={`/events/${evt.slug}`}>{evt.name}</Link>
      </h4>

      <Link href={`/events/edit/${evt.id}`}>
        <FaPencilAlt /> <span>Edit</span>
      </Link>

      <a
        href='#'
        className={styles.delete}
        onClick={() => handleDelete(evt.id)}
      >
        <FaTimes /> <span>Delete</span>
      </a>
    </div>
  );
}
