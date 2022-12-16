import { getSession } from 'next-auth/react';
import { PHASE_PRODUCTION_BUILD } from 'next/dist/shared/lib/constants';
import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
  const { type } = req.body

  // create a row in Post table
  if (type == "post") {
    const { type, sport, description, date, time, capacity } = req.body
    const session = await getSession({ req });
    const result = await prisma.post.create({
      data: {
        sport: sport,
        description: description,
        date: date,
        time: time,
        capacity: capacity,
        attendees: 1,
        author: { connect: { email: session?.user?.email } },
      },
    });
    res.json(result);
  }

  if (type == "getOwner") {
    console.log("test")
    const { type, userEmail, postId, announcement } = req.body

    const result = await prisma.post.findMany({
      where: {
        id: postId
      }
    });
    res.json(result)
  }

  if (type == "getParticipants") {

    const { type, userEmail, postId, announcement } = req.body

    const result = await prisma.registered.findMany({
      where: {
        postId: postId
      }
    });
    res.json(result)
  }

  if (type == "getMessages") {
    const { type, postId } = req.body
    const result = await prisma.post.findMany({
      where: {
        id: postId
      }
    })
    res.json(result)
  }

  if (type == "addMessage") {
    const { type, sender, recipient, postId, theMessage } = req.body

    const messages = await prisma.post.findMany({
      where: {
        id: postId
      }
    });
    let newMessages = messages[0].messages
    newMessages.push("From " + sender + ": " + theMessage)

    const result = await prisma.post.updateMany({
      where: {
        id: postId
      },
      data: {
        messages: newMessages
      }
    })
    res.json(result)
  }

  if (type == "read") {
    const { type, userEmail, postId } = req.body
    const result = await prisma.registered.findMany({
      where: {
        postId: postId
      }
    })
    res.json(result)
    // res.json({"test" : "test2"})
  }

  if (type == "readPost") {
    const { type, userEmail, postId } = req.body
    const result = await prisma.post.findFirst({
      where: {
        id: postId
      }
    })
    res.json(result)
    // res.json({"test" : "test2"})
  }

  // create a row in Registered table
  if (type == "registered") {
    const { type, userEmail, postId } = req.body
    const checkCapacity = await prisma.post.findMany({
      where: {
        id: postId
      }
    })
    if (checkCapacity[0].attendees < parseInt(checkCapacity[0].capacity)) {
      const result = await prisma.registered.create({
        data: {
          userEmail: userEmail,
          postId: postId,
          announcement: ""
        }
      });
      const updateAttendees = await prisma.post.update({
        where: {
          id: postId
        },
        data: {
          attendees: checkCapacity[0].attendees + 1
        }
      })
      res.json(checkCapacity);
    } else {
      res.json(checkCapacity)
    }

  }

  // delete a post
  if (type == "delete") {
    const {type, userEmail, postId} = req.body
    const result = await prisma.post.delete({
      where: {
        id : postId,
      }
    });
    res.json(result);
  }
  // update a row aka an event in Post table
  if (type == "updateEvent") {
    const { type, sport, description, date, time, capacity, postIdFromEdit } = req.body
    const session = await getSession({ req });
    const result = await prisma.post.update({
      where: {
        id : postIdFromEdit,
      },
      data: {
        sport: sport,
        description: description,
        date: date,
        time: time,
        capacity: capacity,
      },
    });
    res.json(result);
  }

  // if (type == "post") {
  //   const { type, sport, description, date, time, capacity } = req.body
  //   const session = await getSession({ req });
  //   const result = await prisma.post.create({
  //     data: {
  //       sport: sport,
  //       description: description,
  //       date: date,
  //       time: time,
  //       capacity: capacity,
  //       attendees: 1,
  //       author: { connect: { email: session?.user?.email } },
  //     },
  //   });
  //   res.json(result);
  // }

  // delete from registered
  if (type == "deleteRegistered") {
    const {type, userEmail, postId, postAttendees } = req.body
    
    const result = await prisma.registered.delete({
      where: {
        userEmail_postId: {
          userEmail: userEmail,
          postId: postId
        }
      }
    });
    const updatedEntry = await prisma.post.update({
      where: {
        id : postId,
      },
      data: {
        attendees: postAttendees - 1
      },
    });
    res.json(result);
  }

  // get user ID from email
  if (type == "getUser") {
    const {type, userEmail} = req.body;

    const result = await prisma.user.findUnique({
      where: {
        email: userEmail
      }
    });
  }

  // get post ID
  if (type == "AuthorId") {
    const {type, postId} = req.body;

    const result = await prisma.registered.findFirst({
      where: {
        postId: postId
      }
    });
    console.log("result: ", result);
    res.json(result);
  }
}