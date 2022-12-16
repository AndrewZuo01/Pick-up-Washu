// pages/create.tsx
import React, { Component, useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import { useSession } from 'next-auth/react';
import { GetStaticProps } from 'next';
import prisma from '../lib/prisma';
import PostEvent, { PostProps } from '../components/PostEvent';
import Post from '../components/Post';
import PostJoined from '../components/PostJoined';
import { RegisteredProps } from "../components/Registered";
import { parse } from 'path';

export const getStaticProps: GetStaticProps = async () => {
    const feed = await prisma.post.findMany({
        include: {
            author: {
                select: { name: true },
            },
        },
    });

    const registeredButNotOwner = await prisma.registered.findMany()

    return {
        props: { feed, registeredButNotOwner },
        revalidate: 1
    };
};

type Props = {
    feed: PostProps[]
    registeredButNotOwner: RegisteredProps[]
}

const filterAllEventsHost: React.FC<Props> = (props) => {
    const { data: session, status } = useSession();
   
    if (!session) {
        return (
            <Layout>
                <div className="page">
                <p className="no-permission">You don't have permission to access this page.</p>
                    <br></br>
                    <button className='neon-button' onClick={() => Router.push('/')}>Home</button>
                </div>
            </Layout>
        );
    } else {
        var result = [];
        var resultsToDisplay = [];

        result = props.feed.filter(allPost => allPost.author.name == session.user.name)
        
        const now = new Date()
    for (let i = 0; i < result.length; i++) {
      let year = parseInt(result[i].date.substring(0, 4))
      let month = parseInt(result[i].date.substring(5, 7))
      let day = parseInt(result[i].date.substring(8, 10))
      let hours = parseInt(result[i].time.substring(0, 2))
      let minutes = parseInt(result[i].time.substring(3, 5))
      
      //two boolean to control whether to push
      var upToDate = false
      var hasCapacity = false
      //check whether the event has passed
      if (year > now.getFullYear()) {
        upToDate = true
      } else {
        if (year == now.getFullYear() && month > now.getMonth() + 1) {
          upToDate = true
        } else {
          if (year == now.getFullYear() && month == now.getMonth() + 1 && day > now.getDate()) {
            upToDate = true
          } else {
            if (year == now.getFullYear() && month == now.getMonth() + 1 && day == now.getDate() && hours > now.getHours()) {
              upToDate = true
            } else {
              if (year == now.getFullYear() && month == now.getMonth() + 1 && day == now.getDate() && hours == now.getHours() && minutes > now.getMinutes()) {
                upToDate = true
              }
            }
          }
        }
      }

      // if(hasCapacity == true && upToDate == true)
      //   resultsToDisplay.push(results[i])
        if (upToDate) {
            resultsToDisplay.push(result[i])
        }
    }

    console.log(resultsToDisplay)
    resultsToDisplay = resultsToDisplay.sort(function(a, b) {
      let aNewDate = a.date.substring(0, 4) + a.date.substring(5, 7) + a.date.substring(8, 10) + a.time.substring(0, 2) + a.time.substring(3, 5)
      let bNewDate = b.date.substring(0, 4) + b.date.substring(5, 7) + b.date.substring(8, 10) + b.time.substring(0, 2) + b.time.substring(3, 5)
      return aNewDate - bNewDate  
    })
        
        
        var other = [];
        other = props.registeredButNotOwner.filter(allPost => allPost.userEmail == session.user?.name)
                
        var otherToDisplay = []

        var next = [];
        for (let i = 0; i < other.length; i++) {
            next.push(other[i].postId)
        }

        var otherTest = props.feed.filter(allPost => next.includes(allPost.id))


        for (let i = 0; i < otherTest.length; i++) {
      let year = parseInt(otherTest[i].date.substring(0, 4))
      let month = parseInt(otherTest[i].date.substring(5, 7))
      let day = parseInt(otherTest[i].date.substring(8, 10))
      let hours = parseInt(otherTest[i].time.substring(0, 2))
      let minutes = parseInt(otherTest[i].time.substring(3, 5))
      
      //two boolean to control whether to push
      var upToDate = false
      var hasCapacity = false
      //check whether the event has passed
      if (year > now.getFullYear()) {
        upToDate = true
      } else {
        if (year == now.getFullYear() && month > now.getMonth() + 1) {
          upToDate = true
        } else {
          if (year == now.getFullYear() && month == now.getMonth() + 1 && day > now.getDate()) {
            upToDate = true
          } else {
            if (year == now.getFullYear() && month == now.getMonth() + 1 && day == now.getDate() && hours > now.getHours()) {
              upToDate = true
            } else {
              if (year == now.getFullYear() && month == now.getMonth() + 1 && day == now.getDate() && hours == now.getHours() && minutes > now.getMinutes()) {
                upToDate = true
              }
            }
          }
        }
      }

      // if(hasCapacity == true && upToDate == true)
      //   resultsToDisplay.push(results[i])
        if (upToDate) {
            otherToDisplay.push(otherTest[i])
        }
    }

    otherToDisplay = otherToDisplay.sort(function(a, b) {
      let aNewDate = a.date.substring(0, 4) + a.date.substring(5, 7) + a.date.substring(8, 10) + a.time.substring(0, 2) + a.time.substring(3, 5)
      let bNewDate = b.date.substring(0, 4) + b.date.substring(5, 7) + b.date.substring(8, 10) + b.time.substring(0, 2) + b.time.substring(3, 5)
      return aNewDate - bNewDate  
    })

        if (result.length <= 0 && other.length <= 0) {
            return (
                <Layout>
                    <div className="page">
                        <h1 className = "page-title">My Events</h1>
                        <div id="container">
                            <button className='neon-button' onClick={() => Router.push('/')}>Home</button>
                        </div>
                        <div className='events-section'>
                            {props.feed.filter(allPost => (next.includes(allPost.id))).map((post) => (
                                <PostEvent post={post} />
                            ))}
                        </div>
                    </div>
                </Layout>
            );
        }
        else {
            return (
                <Layout>
                    <div className="page">
                        <h1 className = "page-title">My Events</h1>
                        <div id="container">
                            <button className='neon-button' onClick={() => Router.push('/')}>Home</button>
                        </div>

                        <div id="all-posts">
                            <hr></hr>
                            <h2 className='events-divider-header page-title'>You are hosting these pick up games:</h2>
                            <div className='events-section'>
                                <div className='row row-cols-5'>
                                {resultsToDisplay.map((post) => (
                                    <PostEvent post={post} />
                                ))}
                            </div>
                            </div>
                            <hr></hr>
                            <h2 className='events-divider-header page-title'>You are participating in these games:</h2>
                            <div className='events-section'>
                                <div className='row row-cols-5'>
                                    {otherToDisplay.map((post) => (
                                        <PostJoined post={post} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer>
                        ©2022, Pick-Up WashU. All Rights Reserved.
                    </footer>
                </Layout>
            );
        }
    }
}

export default filterAllEventsHost
