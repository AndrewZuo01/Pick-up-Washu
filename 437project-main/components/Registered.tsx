import React, { useState } from 'react';
import Router from "next/router";
import { useSession } from 'next-auth/react';

export type RegisteredProps = {
  userEmail: string;
  postId: string,
  announcement: string
};

const Registered: React.FC<{ registered: RegisteredProps }> = ({ registered }) => {

  const { data: session, status } = useSession();

        async (e: React.SyntheticEvent) => {
          e.preventDefault();
          
          try {
            let type = "registered"
            let userEmail = session.user?.email
            let postId = registered.postId
            let announcement = registered.announcement
            const body = { type, userEmail, postId, announcement };

            await fetch('/api/post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body),
            });
            await Router.push('/');
          } catch (error) {
            console.error(error);
          }
        };

  return (
    <div>
      <h2>{registered.postId}</h2>
      <p>Organizer: {registered.userEmail}</p>
    </div>
  );
};

export default Registered;