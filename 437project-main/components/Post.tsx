import React, { useState, useEffect } from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import {GetStaticProps} from 'next';
import prisma from '../lib/prisma';
import { text } from 'node:stream/consumers';
const myLoader = ({ src, width, quality }) => {
  return `https://unsplash.com/photos/${src}?w=${width}&q=${quality || 75}`
}

export type PostProps = {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
  } | null;
  sport: string;
  description: string;
  content: string;
  date: string;
  time: string;
  capacity: string;
  title: string;
  attendees: string;

};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {

  const { data: session, status } = useSession();
  
  const [currentRegistered, setCurrentRegistered] = useState(null);
  
  const getRegistered = () => {
    console.log("test in Post");
    useEffect(() => {
      console.log("useEffect in test in Post");
      let type = "read";
      let userEmail = session.user?.name;
      let postId = post.id;
      const body = {type, userEmail, postId};

      fetch("api/post", {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(body)
      })
      .then((res) => res.json())
      .then((data) => {
        let names = [];
        if (data.length != 0){
          for (let i = 0; i < data.length; i++){
            names.push(data[i].userEmail);
          }
          console.log("getRegistered:", names);
        }
        setCurrentRegistered(names);
      })
    },[])
  }

  console.log("currentUser: ", currentRegistered);
  if (currentRegistered != null){
    console.log("array length: ", currentRegistered[0]);
  }
  getRegistered();

  const viewRoster = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
      console.log("Please log in to view and join events.");
    } else {

      try {

        let type = "read"
        let userEmail = session.user?.name
        let postId = post.id
        const body = { type, userEmail, postId };

        const response = await fetch("api/post", {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })

        const stuff = await response.json()
        var users = []
        for (let i = 0; i < stuff.length; i++) {
          users.push(stuff[i].userEmail)
        }

        let myUsers = post.author.name

        if (users.length > 0) {
          for (let i = 0; i < users.length; i++) {
            myUsers += ", " + users[i]
          }
        }

        let myParticipants = document.getElementById(postId)
        if (myParticipants.innerHTML != "") {
          myParticipants.innerHTML = ""
        } else {
          myParticipants.innerHTML = myUsers;
        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
      console.log("Please log in to view and join events.");
    } else {

      if (session.user.name != post.author.name) {
        if (parseInt(post.attendees) == parseInt(post.capacity)) {
          console.log("The event is full, sorry!")
        } else {
          try {
            let type = "registered"
            let userEmail = session.user.name
            console.log(userEmail)
            let postId = post.id
            const body = { type, userEmail, postId };
  
            const response = await fetch('/api/post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            await Router.push('/myEvents');
          } catch (error) {
            console.error(error);
          }
        }
      } else {
        console.log("You cannot join your own event!")
      }
    }
  };

  const leavePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { data: session, status } = useSession();

    if (status !== "authenticated") {
      console.log("Please log in to view and join events.");
    } 
    else {
      try {
        let type = "delete";
        let userEmail = session.user.name;
        console.log(userEmail);

        let postId = post.id
        const body = { type, userEmail, postId };

        const response = await fetch('/api/post', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        await Router.push('/');
      } 
      catch (error) {
        console.error(error);
      }
    }
  };

  const leaveRegistered = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { data: session, status } = useSession();
    
    if (!session) {
      console.log("Please log in to view and join events.");
    }
    else {
      try {
        let type = "deleteRegistered"
        let userEmail = session.user.email
        let postId = post.id
        let postAttendees = post.attendees
        const body = {type, userEmail, postId, postAttendees };

        const response = await fetch('/api/post', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        await Router.push('/');
        console.log("You left the event :(");
      }
      catch (error) {
        console.error(error); 
      }
    }
  };

  const authorName = post.author ? post.author.name : "Unknown author";
  post.title = "/images/" + post.sport.toLowerCase() + ".jpg"
  var checkJoinDisabled = false
  var textForJoin = "Join Event"
  if(post.attendees >= post.capacity){
      checkJoinDisabled = true;
      textForJoin = "Event Full"
    }
  if(session.user?.name == post.author.name){
    checkJoinDisabled = true;
    textForJoin = "You are hosting this event"
  }
  else if (currentRegistered != null){
    console.log("currentRegistered: ", currentRegistered);
    if (currentRegistered.includes(session.user?.name)) {
      console.log("from else if: ", session.user?.name);
      checkJoinDisabled = true;
      textForJoin = "You have joined this event";
    }
  }
  if (!session) {
    console.log("You don't have access");
    return null;
  } else { // a session exists
     
      console.log("authorname doesnt match user");
      const post_button_id = "join-button-index" + post.id

      let slotsRemaining = Number(post.capacity) - Number(post.attendees)
      return (

        <div className="col">
          <div className="card post-card">
          <Image
              src={post.title}
              width = {300}
              height = {200}
              />

            <div className="card-body">
              <h2 className="card-title post-info fw-bolder">{post.sport}</h2>
              <strong className="post-info-label">Organizer: <p className="card-organizer">{authorName}</p></strong>
              <br></br>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong className="post-info-label">Date: <p className="post-info">{post.date}</p></strong>
                </li>
                <li className="list-group-item">
                  <strong className="post-info-label">Time: <p className="post-info">{post.time}</p></strong>
                </li>
                <li className="list-group-item">
                <strong className="post-info-label">Max Capacity: <p className="post-info">{post.capacity} (<span className="slots-left">Slots Left: {slotsRemaining}</span>)</p></strong>
                </li>
              </ul>
              <br></br>
              <strong className="post-info-label fst-italic "><p className="post-info fst-italic">{post.description}</p></strong>
              
              
            </div>
            <div className="card-footer">
              <button id="show-participants" className="btn btn-2 show-attendance" onClick={viewRoster}>Who's Going</button>
              <strong className="post-info-label"><p id={post.id} className="post-info">{viewRoster}</p></strong>

              <button id={post.id} disabled={checkJoinDisabled} className="join-btn btn rounded-pill join-event " onClick={submitData}>{textForJoin}</button>
              
              
              
            </div>
          </div>
        </div>
        
      );
    }
  // lien comment
  
};

export default Post;