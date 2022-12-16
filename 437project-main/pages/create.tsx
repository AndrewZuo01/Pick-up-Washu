// pages/create.tsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

const Draft: React.FC = () => {

  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let type = "post"
  const [sport, setTitle] = useState('');
  const [description, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [capacity, setCapacity] = useState('');

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log("submitData created");
    try {
      const body = { type, sport, description, date, time, capacity };
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(response)
      await Router.push('/');
    } catch (error) {
      console.error(error);
    }
    
  };

  if (!session) {
    return (
      <Layout>
        <div className="page">
        <p className="no-permission">You don't have permission to access this page.</p>
          <br></br>
          <button className='btn' onClick={() => Router.push('/')}>Home</button>
        </div>
      </Layout>
    )
  } else {
    return (
      <Layout>
        <form className='create-form card' onSubmit={submitData}>
          <h1>Create Event</h1>
          <select className = "form-select form-select-lg mb-11 create-sport" id="sports-options" name="sports" onChange={(e) => setTitle(e.target.value)}>
            <option disabled selected>Select A Sport...</option>
            <option value="Badminton">Badminton</option>
            <option value="Baseball">Baseball</option>
            <option value="Basketball">Basketball</option>
            <option value="Football">Football</option>
            <option value="Frisbee">Frisbee</option>
            <option value="Rugby">Rugby</option>
            <option value="Soccer">Soccer</option>
            <option value="Tennis">Tennis</option>
            <option value="Volleyball">Volleyball</option>
            <option value="Other">Other</option>
          </select>
          {/* <input list="sports-options"
            className='form-field'
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sport"
            type="hidden"
            value={sport}
          /> */}
          <textarea
            className='form-control create-title'
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Description"
            rows={3}
            value={description}
            
          />
          <div className='warp-timedatecapacity'>
            <input
              className='md-form md-outline input-with-post-icon datepicker create-date'
              id="date-input"
              autoFocus
              onChange={(e) => setDate(e.target.value)}
              type="date"
              value={date}
            />
            <input
              className='input-group date create-time'
              id="time-input"
              autoFocus
              onChange={(e) => setTime(e.target.value)}
              type="time"
              value={time}
            />
            <input
              className='form-control create-capacity'
              id="capacity-input"
              type="number"
              autoFocus
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="Capacity"
              pattern="^([2-9]|([1-9][0-9]))$"
              title="Capacity should in range 2 to 99"
            />
          </div>
          <input
            className='create-event-btn'
            disabled={!sport || !description || !date || !time || !capacity}
            type="submit"
            value="Create"
          />
        </form>
        
        <button className='neon-button' onClick={() => Router.push('/')}>Home</button>
        <footer>
          ©2022, Pick-Up WashU. All Rights Reserved.
        </footer>
      </Layout>
    );
  }
};

export default Draft;