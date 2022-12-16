import React, { useState, useEffect } from 'react';
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';
import { useSession } from 'next-auth/react';
import { RegisteredProps } from "../components/Registered"

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const allRegisteredEvent = await prisma.registered.findMany()

  return {
    props: { feed, allRegisteredEvent },
    revalidate: 1
  };
};

type Props = {
  feed: PostProps[]
  allRegisteredEvent: RegisteredProps[]
}

const Blog: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  var results = [];
  var resultsToDisplay = []
  var allRegisteredEvent = [];
  results = JSON.parse(JSON.stringify(props.feed))
  allRegisteredEvent = JSON.parse(JSON.stringify(props.allRegisteredEvent))
  console.log("allRegisteredEvent: ", allRegisteredEvent)

  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [filterTag, setFilterTag] = useState("Current Filter: Sport")

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('sport');

  // when the user input changes, update the query state
  const handleChange = (e) => {
    // console.log(e.target.value)
    console.log("handleChange")
    setQuery(e.target.value)
    
  }

  // when different category is selected on the dropdown, update the category state
  const handleCategory = (category) => {
    console.log("handleCategory:", category)
    setCategory(category)
    results = searchFilter(results)
  }

  // filter function called onChange of search input
  const searchFilter = (array) => {
    if (category == 'sport') {
      var filtered = array.filter((el) => el.sport.toLowerCase().includes(query))
      return filtered
    }
    else if (category == 'organizer') {
      var filtered = array.filter((el) => el.author.name.toLowerCase().includes(query))
      return filtered
    }
    else if (category == 'description') {
      var filtered = array.filter((el) => el.description.toLowerCase().includes(query))
      return filtered
    }
    return []
  }

  // update results
  results = searchFilter(results)

  let noOfferings = "";

  if (results.length == 0) {
    noOfferings = "There are no offerings at this time."
  }

  function dropdownToggle() {
    document.getElementById("dropdown-count").classList.toggle("show");
  }

  // Close the dropdown menu if the user clicks outside of it
  useEffect(() => {
    window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }
  }, [])

  // we can check is session exists inside the return statement, not here
  // this is very clunky
  if (!session) {
    for (let i = 0; i < results.length; i++) {
      results[i].author.name = "<Log in to see this information>"
      results[i].sport = "<Log in to see this information>"
      results[i].description = "<Log in to see this information>"
      results[i].date = "<Log in to see this information>"
      results[i].time = "<Log in to see this information>"
      results[i].capacity = "<Log in to see this information>"
    }
  } else {
    console.log(results)
    const now = new Date()
    for (let i = 0; i < results.length; i++) {
      let year = parseInt(results[i].date.substring(0, 4))
      let month = parseInt(results[i].date.substring(5, 7))
      let day = parseInt(results[i].date.substring(8, 10))
      let hours = parseInt(results[i].time.substring(0, 2))
      let minutes = parseInt(results[i].time.substring(3, 5))

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
      //check event capacity
      const attandenceNumberArray = allRegisteredEvent.filter(allPost => allPost.postId == results[i].id)
      let currentCapacity = attandenceNumberArray.length + 1
      let totalCapacity = parseInt(results[i].capacity)
      var join_button = document.getElementById(results[i].id) as HTMLButtonElement
      // console.log("join_button: ", join_button);
      if (currentCapacity < totalCapacity) {
        hasCapacity = true
      } else {
        // results[i].description += " (EVENT FULL)"
        if (join_button != null) {
          join_button.disabled = true;
          // join_button.textContent = "Event Full"
        }
      }

      if (upToDate) {
        resultsToDisplay.push(results[i])
      }
    }
    console.log(resultsToDisplay)
    resultsToDisplay = resultsToDisplay.sort(function (a, b) {
      let aNewDate = a.date.substring(0, 4) + a.date.substring(5, 7) + a.date.substring(8, 10) + a.time.substring(0, 2) + a.time.substring(3, 5)
      let bNewDate = b.date.substring(0, 4) + b.date.substring(5, 7) + b.date.substring(8, 10) + b.time.substring(0, 2) + b.time.substring(3, 5)
      return aNewDate - bNewDate
    })
  }

  if (session) {
    return (
      <Layout>
        <div className="page">
          <h1 className='page-title'>Current Sports Offerings</h1>

          <main>

            <div className="search-filter">
              <input onChange={handleChange} className="search-filter-text" type='text' />
              <div className="dropdown">
                <button onClick={dropdownToggle} className="dropbtn">Filter By 🔽</button>
                <div id="dropdown-count" className="dropdown-content">
                  <a onClick={() => {handleCategory('sport') 
                  setFilterTag('Current Filter: Sport')}}>Sport</a>
                  <a onClick={() =>{handleCategory('organizer')
                setFilterTag('Current Filter: Organizer')}}>Organizer</a>
                  <a onClick={() => {handleCategory('description')
                setFilterTag('Current Filter: Description')}}>Description</a>
                </div>
                <div className='inline filter-name'>{filterTag}</div>
              </div>
            </div>

            <div id="test-div" className="row row-cols-5">
              {
                resultsToDisplay.map((post) => (
                  <Post post={post} />
                ))
              }
              <p>{noOfferings}</p>
            </div>
          </main>
        </div>
        <footer>
          ©{new Date().getFullYear()}, Pick-Up WashU. All Rights Reserved.
        </footer>
      </Layout>
    )
  } else {
    return (
      <Layout>

        <div className="page">
          <h1 className='page-title'>Current Sports Offerings</h1>

          <main>
            <div id="test-div" className="row row-cols-5">
              {
                resultsToDisplay.map((post) => (
                  <Post post={post} />
                ))
              }
              <p>{noOfferings}</p>
            </div>
          </main>

        </div>

        <footer>
          ©{new Date().getFullYear()}, Pick-Up WashU. All Rights Reserved.
        </footer>

      </Layout>
    )
  }
}

export default Blog