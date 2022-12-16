import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import React, { useRef, useLayoutEffect, useState } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 1
  };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  
  const { data: session } = useSession();

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
        <div className="page">
          <h1 className = 'page-title'>My Profile</h1>
          <p className = 'page-title'><strong>Name: </strong> {session.user?.name}</p>
          <p className = 'page-title'><strong>Email: </strong>{session.user?.email}</p>
          <button className='neon-button' onClick={() => Router.push('/')}>Home</button>
        </div>
        <footer>
          ©2022, Pick-Up WashU. All Rights Reserved.
        </footer>
      </Layout>
    )
  }
}

export default Blog