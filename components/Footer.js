import Link from 'next/link';
import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Copyright &copy; Movie events</p>

      <p>
        <Link href='/about'>About ths project</Link>
      </p>
    </footer>
  );
}
