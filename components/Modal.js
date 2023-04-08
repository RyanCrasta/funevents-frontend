import styles from '../styles/Modal.module.css';
import { useEffect, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

export default function Modal({ show, onClose, children, title }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);

    if (show) {
      document.body.classList.add(styles.overflowHidden);
    }
    return () => {
      document.body.classList.remove(styles.overflowHidden);
    };
  });

  const handleClose = () => {
    onClose();
  };

  const modalContent = show ? (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <a href='#' onClick={handleClose}>
            <FaTimes />
          </a>
        </div>
        {title && <div>{title}</div>}

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  ) : null;

  // This is a function that creates a portal and a
  // portal just tells React to render our HTML at some
  // other location inside the DOM.
  if (isBrowser) {
    return createPortal(modalContent, document.getElementById('modal-root'));
  } else {
    return null;
  }
}
