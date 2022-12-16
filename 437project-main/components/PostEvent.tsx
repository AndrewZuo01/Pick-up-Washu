// A copy of Post.tsx with a bit of modification

import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import { useLocation } from 'react-router-dom';
import Image from 'next/image';
import Link from 'next/link';
import EditForm from "../components/editEvent"

// import prisma from '../lib/prisma';
// import { useEffect } from 'react';
// import { GetStaticProps } from 'next';

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
  messages: string[];
};

const PostEvent: React.FC<{ post: PostProps }> = ({ post }) => {

  let listOfUsersId = post.id + "-list-of-users"
  let blastButtonId = post.id + "-blast-button"
  let messageBoardId = post.id + "-message-board"
  let messageBoxId = post.id + "-message-box"
  let blastMessageFormId = post.id + "-blast-message-form"

  const { data: session, status } = useSession();

  const deleteEvent = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
    } else {

      try {
        let type = "delete"
        let userEmail = session.user?.email
        let postId = post.id
        const body = { type, userEmail, postId };
        console.log("From submitData: ", body);

        const response = await fetch('/api/post', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        await Router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
  };

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
        try {
          let type = "registered"
          let userEmail = session.user.email
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
      } else {
        console.log("You cannot join your own event!")
      }
    }
  };

  // get author object from querying post ID
  const getAuthor = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
    } else {

      try {
        let type = "getAuthor";
        let postId = post.id;
        const body = { type, postId };
        console.log("From getAuthor: ", body);

        const response = await fetch('/api/post', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        await Router.push('/');

        return response.json();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const authorName = post.author ? post.author.name : "Unknown author";
  post.title = "/images/" + post.sport.toLowerCase() + ".jpg"
  var frontId = "front" + post.id
  var backId = "back" + post.id
  const front = document.getElementById(frontId)
  const back = document.getElementById(backId)
  if(front === null && document.getElementById(post.id)!=null)
      Router.reload()
  function flipcard() {
    if(front === null)
      Router.reload()
    else{
      front.classList.toggle('flipped')
      back.classList.toggle('flipped')
    }
  }

  var toggleMessage = false;
  const toggleMessageBoard = async (e: React.SyntheticEvent) => {

      let type = "getMessages"
      let postId = post.id
      const body = { type, postId }

      const response = await fetch("api/post", {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      })

      const stuff = await response.json()
      let myMessages = stuff[0].messages
      for (let i = 0; i < myMessages.length; i++) {
        let newElement = myMessages[i]
        let newParagraph = document.createElement("p")
        newParagraph.append(newElement)
        document.getElementById(messageBoardId).appendChild(newParagraph);
      }

      if (toggleMessage || document.getElementById(messageBoardId).style.display == "block") {
        document.getElementById(messageBoardId).style.display = "none";
        document.getElementById(messageBoardId).innerHTML = ""
        toggleMessage = false; 
      } else if (document.getElementById(messageBoardId) != null) {
        document.getElementById(messageBoardId).style.display = "block";
        toggleMessage = true;
      }
    }

  var toggle = false;
  const showMessageInterface = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
      console.log("Please log in to view and join events.");
    } else {

      try {

        let type = "getParticipants"
        let userEmail = session.user?.name
        let postId = post.id
        let announcement = ""
        const body = { type, userEmail, postId, announcement };

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


        if (toggle || document.getElementById(messageBoxId).style.display == "block") {
          document.getElementById(messageBoxId).style.display = "none";
          document.getElementById(blastMessageFormId).style.display = "none";
          toggle = false;

          document.getElementById(listOfUsersId).innerHTML = "";
          
        } else if (document.getElementById(messageBoxId) != null) {
          document.getElementById(messageBoxId).style.display = "block";
          document.getElementById(blastMessageFormId).style.display = "block";
          toggle = true;

          if (document.getElementById(listOfUsersId) != null) {
            var allOption = document.createElement("option");
            allOption.innerHTML = "All Users"
            document.getElementById(listOfUsersId).appendChild(allOption);
            for (let i = 0; i < users.length; i++) {
              var newOption = document.createElement("option");
              newOption.innerHTML = users[i];
              document.getElementById(listOfUsersId).appendChild(newOption);
            }
          }

        }

      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitMessage = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
      console.log("Please log in to view and join events.");
    } else {

      try {

        let type = "addMessage"
        // let listOfEmails = document.getElementById(listOfUsersId);
        // let myIndex = (listOfEmails as HTMLSelectElement).selectedIndex

        let recipient = "All Users"
        let postId = post.id

        let sender = session.user?.name

        let theMessage = (document.getElementById(messageBoxId) as HTMLInputElement).value;

        const body = { type, sender, recipient, postId, theMessage };

        const response = await fetch("api/post", {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        })

        const stuff = await response.json();
        if (stuff != null) {
          (document.getElementById(messageBoxId) as HTMLInputElement).value = ""
        }
        
      } catch (error) {
        console.error(error);
      }
    }
  };

  let slotsRemaining = Number(post.capacity) - Number(post.attendees)

  return (
    <div className="col ">
        <div className="card card-flip post-card">
            <div id = {frontId} className="card-front">
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
                <button className="join-btn btn delete-event" onClick={deleteEvent}>Delete</button>
                <button className="join-btn btn edit-event" onClick={flipcard}> Edit Event</button>
                <button id={blastButtonId} className="btn-2 btn blast-message" onClick={showMessageInterface}>Send Announcement</button>
                <textarea id={messageBoxId} className="message-box"></textarea>
                <form id={blastMessageFormId} className="blast-message-form" onSubmit={submitMessage}>
                  {/* <select id={listOfUsersId} className="list-of-users">
                  </select> */}
                  <input id="submit-button" type="submit" value="Send"></input>
                </form>
                <button className="btn-2 btn blast-message" onClick={toggleMessageBoard}>View Announcements</button>
                <div id={messageBoardId}>
                </div>
                {/* </Link>  */}
              </div>
            </div>
          {/* card-back */}
          <div id = {backId} className="card-back card-matchfullsize">
            
            <EditForm postIdFromEdit={post.id} sportFromEdit={post.sport} descriptionFromEdit={post.description} dateFromEdit={post.date} timeFromEdit={post.time} capacityFromEdit={post.capacity}/>
          </div>
      
      </div>
    </div>
  );
};

export default PostEvent;