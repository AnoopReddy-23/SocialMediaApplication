import React,{useState,useEffect,useContext} from 'react'
import axios from 'axios'

import {UserContext} from '../../App'
import './Profile.css'

function Profile() {

  const {state,dispatch} =useContext(UserContext)
  const [myposts,setMyPosts]=useState([])

  const headers = {
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  useEffect(()=>{
    axios.get('/myposts', {
      headers: headers
    })
    .then(response=>{
      //console.log(response.data.posts)
      setMyPosts(response.data.posts)
    })
    .catch(error=>console.log(error))
  },[])

  return (
    <div className='my-profile'>
      <div className='profile'>
        <div>
          <img style={{width:"166px", height:"166px", borderRadius:"83px"}} 
            src={state ? state.profileImg : "Loading..."} alt="" />
        </div>
        <div className='details'>
          <h4>{state? state.username : "Loading...."}</h4>
          <h5>{state? state.email : "Loading...."}</h5>
          <div className="acc-info">
            <h6>{myposts.length} posts</h6>
            <h6>{state && state.hasOwnProperty('followers') ? state.followers.length : 0} followers</h6>
            <h6>{state && state.hasOwnProperty('following') ? state.following.length : 0} following</h6>
          </div>
        </div>
      </div>
      <div className="posts">
        {
          myposts.map((post)=>{
            return(
              <img className='post' src={post.image} alt={post.title} />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile