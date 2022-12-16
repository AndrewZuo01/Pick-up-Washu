import React from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';
import Image from 'next/image'
// import {GetStaticProps} from 'next';
// import prisma from '../lib/prisma';
// const myLoader = ({ src, width, quality }) => {
//   return `https://unsplash.com/photos/${src}?w=${width}&q=${quality || 75}`
// }

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


const PostJoined: React.FC<{ post: PostProps }> = ({ post }) => {

  let listOfUsersId = post.id + "-list-of-users"
  let blastButtonId = post.id + "-blast-button"
  let messageBoardId = post.id + "-message-board"
  let messageBoxId = post.id + "-message-box"
  let blastMessageFormId = post.id + "-blast-message-form"
  let leftEventId = post.id + "-left-event"
  let dismissId = post.id + "-dismiss"

  if (document.getElementById(dismissId) != null) {
    document.getElementById(dismissId).onclick = function() {
      document.getElementById(leftEventId).style.display = "none"
    }
  }

  const { data: session, status } = useSession();

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

  const leaveEvent = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
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

  const leavePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (status !== "authenticated") {
      console.log("Please log in to view and join events.");
    } 
    else {
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

        // await Router.push('/');
      } catch (error) {
        console.error(error);
      }
    }
  };

  const leaveRegistered = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (!session) {
    } else {

      try {
        let type = "deleteRegistered"
        let userEmail = session.user.name
        let postId = post.id
        let postAttendees = post.attendees
        const body = {type, userEmail, postId, postAttendees };

        const response = await fetch('/api/post', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
      } catch (error) {
        console.error(error);
      }
    }
    // if (document.getElementById(leftEventId) != null) {
    //   document.getElementById(leftEventId).style.display = "block";
    // }
    await Router.push('/');
  };

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
          if (stuff[i].userEmail != session.user?.name) {
            users.push(stuff[i].userEmail)
          }        
        }

        users.push(post.author.name)

        if (toggle || document.getElementById(messageBoxId).style.display == "block") {
          document.getElementById(messageBoxId).style.display = "none";
          document.getElementById(blastMessageFormId).style.display = "none";
          toggle = false;

          document.getElementById(listOfUsersId).innerHTML = "";
          
        } else if (document.getElementById(messageBoxId) != null) {

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

          document.getElementById(messageBoxId).style.display = "block";
          document.getElementById(blastMessageFormId).style.display = "block";
          toggle = true;

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

  const authorName = post.author ? post.author.name : "Unknown author";
  post.title = "/images/" + post.sport.toLowerCase() + ".jpg"

  let slotsRemaining = Number(post.capacity) - Number(post.attendees)
  if (!session) {
    console.log("You don't have access");
    return null;
  } else { // a session exists
      console.log("authorname doesnt match user");
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
              {/* <button className="join-event2">(Joined)</button> */}
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
              <button className="join-btn btn leave-event rounded-pill" onClick={leaveRegistered}>Leave Event</button>
              <div id={leftEventId} className="left-event">
                Successfully left this event
                <button id={dismissId}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
        
      );
    }
  // lien comment
  
};

export default PostJoined;