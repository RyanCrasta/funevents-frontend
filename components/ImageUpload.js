import { API_URL } from '@/config';
import { useState } from 'react';
import styles from '../styles/Form.module.css';

export default function ImageUpload({ id, imageUploaded, token }) {
  const [files, setFiles] = useState(null);

  const uploadImage = async (e) => {
    //posting logic will go here

    e.preventDefault();
    const formData = new FormData();
    formData.append('files', files);
    formData.append('ref', 'api::event.event');
    // formData.append('ref', 'plugin::users-permissions.user');
    // formData.append('ref', 'api::collection:collection');

    // formData.append('ref', 'api::event.event');
    formData.append('field', 'image');
    formData.append('refId', id);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      imageUploaded();
    }
  };

  return (
    <div className={styles.form}>
      <h1>Upload Event Image</h1>
      <form onSubmit={uploadImage}>
        <div className={styles.file}>
          <input type='file' onChange={(e) => setFiles(e.target.files[0])} />
        </div>
        <input type='submit' value='Upload' className='btn' />
      </form>
    </div>
  );
}
