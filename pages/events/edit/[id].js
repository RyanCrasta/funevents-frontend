import Modal from '@/components/Modal';
import Layout from '@/components/Layout';
import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import styles from '../../../styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '@/config';
import moment from 'moment';
import Image from 'next/image';
import { FaImage } from 'react-icons/fa';
import ImageUpload from '@/components/ImageUpload';
import NotFoundPage from '@/pages/404';

export default function EditEventPage({ 
  token, 
  show, 
  id,
  name,
  venue,
  address,
  date,
  time,
  performers,
  description,
  image }) {
  const [values, setValues] = useState({
    name: name,
    performers: performers,
    venue: venue,
    address: address,
    date: date,
    time: time,
    description: description,
    image: image,
  });

  const [showModal, setShowModal] = useState(false);

  const [imagePreview, setImagePreview] = useState(
    image?.url
      ? image.url
      : null
  );

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    // Object.values(values) gives an array full of values
    const hasEmptyFields = Object.values(values).some((ele) => ele === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
    }

    const res = await fetch(`${API_URL}/api/events/${router.query.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: values,
      }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('Unauthorized');
        return;
      }
      toast.error('Something went wrong :(', res);
    } else {
      const evt = await res.json();
      router.push(`/events/${evt.data.attributes.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setImagePreview(
      data.data.attributes.image.data.attributes.formats.thumbnail.url
    );
    setShowModal(false);
  };

  return (
    show ? <NotFoundPage /> : (
      <Layout title='Edit Event'>
      <h1>Edit event page</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Movie Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.address}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={moment(values.date).format('yyyy-MM-DD')}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Edit Event' className='btn' />

        <ToastContainer theme='colored' />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} alt='event image' height={100} width={170} />
      ) : (
        <div>
          <p>No image</p>
        </div>
      )}
      <div>
        <button className='btn-secondary' onClick={() => setShowModal(true)}>
          <FaImage /> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload
          handleInputChange={handleInputChange}
          id={id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
    )
  );
}

export async function getServerSideProps(context) {
  // we can parse it we can send it on Authorization header
  const userResponse = await fetch(`${API_URL}/api/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${context.req.cookies.token}`,
    },
  });
  
  const userData = await userResponse.json();
  
  if(userData?.error && userData?.error?.status === 401){
    return{
      props: {
        show: true
      }
    }
  }
  
  if(userData.isAdmin){
    return {
      props: {
        show: userData.isAdmin,
      }
    }
  }

  let dataEvent = [];
  const myEventsRes = await fetch(
    `${API_URL}/api/myevents`,
    {
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`,
      },
    }
  );
  const myEventsData = await myEventsRes.json();

  myEventsData.map((e) => {
    if(e.id === Number(context.query.id)){
      dataEvent.push(e);
    }
  })

  if(dataEvent.length === 0){
   return{
    redirect: {
      destination: '/events',
      permanent: false,
    }
   }
  }else{
    const {id, name, venue, address, date, time, performers, description, image} = dataEvent[0];
    return{
      props:{
        token: context.req.cookies.token,
        show: userData.isAdmin,
        id,
        name,
        venue,
        address,
        date,
        time,
        performers,
        description,
        image
      }
    }
  }
}
