import React,{useState,useEffect,useContext} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import {UserContext} from '../../App'
import '../Profile/Profile.css'

function OtherProfile() {

  const {state,dispatch} =useContext(UserContext)
  const [profile,setProfile]=useState()
  const {userId} =useParams()

  const [showFollow,setShowFollow]=useState(state ? !state.following.includes(userId) : true)

  //console.log(userId)

  const headers = {
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  useEffect(()=>{
    axios.get(`/user/${userId}`, {
      headers: headers
    })
    .then(response=>{
      //console.log(response.data)
      setProfile(response.data)
      //setMyPosts(response.data.posts)
    })
    .catch(error=>console.log(error))
  },[])

  const headers1 = {
    "Content-Type": "application/json",
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  const follow=(followId)=>{
    axios.put('/follow',JSON.stringify({followId}), {
      headers: headers1
    })
    .then(response=>{
      //console.log(response.data)
      dispatch({type:"UPDATE",payload:{following:response.data.following,followers:response.data.followers}})
      localStorage.setItem("userInfo",JSON.stringify(response.data))
      setProfile((prevState)=>{
        return{
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers,response.data._id]
          }
        }
      })
      setShowFollow(false)
    })
    .catch(error=>console.log(error))
  }

  const unfollow=(unfollowId)=>{
    axios.put('/unfollow',JSON.stringify({unfollowId}), {
      headers: headers1
    })
    .then(response=>{
      //console.log(response.data)
      dispatch({type:"UPDATE",payload:{following:response.data.following,followers:response.data.followers}})
      localStorage.setItem("userInfo",JSON.stringify(response.data))
      setProfile((prevState)=>{
        const updatedFollowers=prevState.user.followers.filter(uid=>uid!=response.data._id)
        return{
          ...prevState,
          user: {
            ...prevState.user,
            followers: updatedFollowers
          }
        }
      })
      setShowFollow(true)
    })
    .catch(error=>console.log(error))
  }

  return (

    <>
        {
            profile 
            ? <div className='my-profile'>
            <div className='profile'>
              <div>
                <img style={{width:"166px", height:"166px", borderRadius:"83px"}} 
                  src={profile.user.profileImg} alt="" />
              </div>
              <div className='details'>
                <h4>{profile.user.username}</h4>
                <h4>{profile.user.email}</h4>
                <div className="acc-info">
                  <h6>{profile.posts.length} posts</h6>
                  <h6>{profile.user.followers.length} followers</h6>
                  <h6>{profile.user.following.length} following</h6>
                </div>
                {
                  showFollow
                  ?<button className='btn btn-info p-1' onClick={()=>follow(profile.user._id)}>Follow</button>
                  :<button className='btn btn-info p-1' onClick={()=>unfollow(profile.user._id)}>UnFollow</button>
                }
              </div>
            </div>
            <div className="posts">
              {
                profile.posts.map((post)=>{
                  return(
                    <img className='post' src={post.image} alt={post.title} />
                  )
                })
              }
            </div>
          </div>
            : <h1>Loading........</h1>
        }
    </>

    
  )
}

export default OtherProfile