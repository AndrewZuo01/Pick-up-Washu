import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import React, { useRef, useLayoutEffect, useState } from "react";
import Image from 'next/image'

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
          <h1 className = 'page-title'>About Pick-Up WashU</h1>
          <p className = 'page-title'>Pick-Up WashU is dedicated to helping WashU students
                                      create and join different pick-up sports games around
                                      campus. Currently, there are limited options for athletic
                                      activities for those not engaged in varsity, intramural,
                                      or club sports. Connect with other students and join casual
                                      sporting outings today!</p>
          <button className='about-button neon-button' onClick={() => Router.push('/')}>Home</button>
          <div className="about-image-div">
            <Image src="/images/mudd_field.webp" width={640} height={416}></Image>
          </div>
        </div>
        <footer>
          ©2022, Pick-Up WashU. All Rights Reserved.
        </footer>
      </Layout>
    )
  }
}

export default Blog