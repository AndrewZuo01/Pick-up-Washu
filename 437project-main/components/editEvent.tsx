// pages/create.tsx
import React, { Component, useEffect, useState } from 'react';
import Layout from './Layout';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import PostEvent, { PostProps } from './PostEvent';
import { useLocation } from 'react-router-dom';

// const getStaticProps: GetStaticProps = async () => {
//   const postCurr = await prisma.post.findUnique({
//     where: {
//       id: postIdFromEdit
//     }
//   })
//   return {
//     props: { postCurr }
//   };
// };
export type PostEventProps = {
  postIdFromEdit: string;
  sportFromEdit: string;
  descriptionFromEdit: string;
  dateFromEdit: string;
  timeFromEdit: string;
  capacityFromEdit: string;
};

const EditForm: React.FC<PostEventProps> = (props) => {
  
  //example of router
  // const router = useRouter();
  // let postIdFromEdit = router.query.id as string;
  // let sportFromEdit = router.query.sport as string;
  // let descriptionFromEdit = router.query.description as string;
  // let dateFromEdit = router.query.date;
  // let timeFromEdit = router.query.time;
  // let capacityFromEdit = router.query.capacity;
  let postIdFromEdit = props.postIdFromEdit as string;
  let sportFromEdit = props.sportFromEdit as string;
  let descriptionFromEdit = props.descriptionFromEdit as string;
  let dateFromEdit = props.dateFromEdit;
  let timeFromEdit = props.timeFromEdit;
  let capacityFromEdit = props.capacityFromEdit;

  console.log(postIdFromEdit, sportFromEdit, descriptionFromEdit, dateFromEdit, timeFromEdit, capacityFromEdit);

  var frontId = "front" + postIdFromEdit
  var backId = "back" + postIdFromEdit
  const front = document.getElementById(frontId)
  const back = document.getElementById(backId)
  function flipcard() {
    front.classList.toggle('flipped')
    back.classList.toggle('flipped')
  }
  // const isActive: (pathname: string) => boolean = (pathname) =>
  //   router.pathname === pathname;
  
  const { data: session, status } = useSession();
  
  const [sport, setTitle] = useState(sportFromEdit);
  const [description, setContent] = useState(descriptionFromEdit);
  const [date, setDate] = useState(dateFromEdit);
  const [time, setTime] = useState(timeFromEdit);
  const [capacity, setCapacity] = useState(capacityFromEdit);

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      let type = "updateEvent";
      const body = { type, sport, description, date, time, capacity, postIdFromEdit };
      const response = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      console.log(response)
    } catch (error) {
      console.error(error);
    }
    Router.reload()
  }
  
    return (
        // submitData();
        <div className='card-matchfullsize'>
          <div className='card-header'>
          <h1>Edit Event</h1>
          </div>
          <form id="editform" onSubmit={submitData}>
          <select className = "form-select form-select-lg mb-11 card-back-edit" id="sports-options" name="sports" defaultValue={sportFromEdit} onChange={(e) => setTitle(e.target.value)}>
            <option disabled>Select A Sport...</option>
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
          <textarea
            className='form-control create-title card-back-edit'
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Description"
            rows={3}
            value={description}
            
          />
          <div className='warp-timedatecapacity-card'>
            <input
              className='md-form md-outline input-with-post-icon datepicker card-back-edit'
              id="date-input"
              autoFocus
              onChange={(e) => setDate(e.target.value)}
              type="date"
              value={date}
            />
            <input
              className='input-group date card-back-edit'
              id="time-input"
              autoFocus
              onChange={(e) => setTime(e.target.value)}
              type="time"
              value={time}
            />
            <input
              className='form-control card-back-edit'
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
              className=' join-btn btn leave-event rounded-pill edit-event-btn'
              disabled={!sport || !description || !date || !time || !capacity}
              type="submit"
              value="Edit"
              // form="editform" 
            />
        </form>
        <div className='card-footer card-back-button'>
          
            <button className="join-btn btn leave-event rounded-pill" onClick={flipcard}>Back</button>
          
        </div>
        
        
      </div>
    );
};

export default EditForm;