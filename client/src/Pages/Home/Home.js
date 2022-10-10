import React,{useState,useEffect,useContext} from 'react'
import {Card} from 'react-bootstrap'
import axios from 'axios'
import {AiOutlineLike,AiOutlineDislike} from 'react-icons/ai'
import {MdDeleteForever} from 'react-icons/md'
import {NavLink} from 'react-router-dom'
import {Nav} from 'react-bootstrap'

import { UserContext} from '../../App'
import './Home.css'

function Home() {

  const {state,dispatch}=useContext(UserContext)
  const [posts,setPosts]=useState([])

  const headers = {
    "Content-Type": "application/json",
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  const headers1 = {
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  useEffect(()=>{
    axios.get('/posts',{
      headers:headers1
    })
    .then(response=>{
      //console.log(response.data.posts)
      setPosts(response.data.posts)
    })
    .catch(error=>console.log(error))
  },[])

  const likeunlike=(postId,url)=>{
    axios.put(url,JSON.stringify({postId}), {
      headers: headers
    })
    .then(response=>{
      //console.log(posts)
      const newPostArr=posts.map((oldPost)=>{
        if(oldPost._id==response.data._id){
            return response.data;
        }
        else{
          return oldPost;
        }
      })
      setPosts(newPostArr)
    })
    .catch(error=>console.log(error))
  }

  const submitComment=(e,postId)=>{
    e.preventDefault();
    const commentText=e.target[0].value
    axios.put('/comment',JSON.stringify({commentText,postId}), {
      headers: headers
    })
    .then(response=>{
      const newPostArr=posts.map((oldPost)=>{
        if(oldPost._id==response.data._id){
            return response.data;
        }
        else{
          return oldPost;
        }
      })
      //console.log(newPostArr)
      setPosts(newPostArr)
    })
    .catch(error=>console.log(error))
  }

  const deletePost=(postId)=>{
    axios.delete(`/deletepost/${postId}`,{headers:headers1})
    .then(response=>{
      alert(response.data.result)
      console.log(response.data.data)
      const newPostArr=posts.filter((oldPost)=>{
        return (oldPost._id!==response.data.data._id)
      })
      //console.log(newPostArr)
      setPosts(newPostArr)
    })
    .catch(error=>console.log(error))
  }

  return (
    <div className='home'>

      {
        posts.map((item)=>
        <Card className="card" key={item._id}>
          <Card.Title className='title'>
            <Nav.Link as={NavLink} to={item.author._id!==state._id ? "/profile/"+item.author._id : "/profile"}>
              <Card.Img style={{height:"40px", width:"40px",borderRadius:"20px" ,margin:"6px"}} variant="top" src={item.author.profileImg} />
              {item.author.username}
              {
                item.author._id===state._id &&
                  <MdDeleteForever onClick={()=>deletePost(item._id)} className='icon-delete' color='red' size={30}/>
              }
            </Nav.Link>
          </Card.Title>
          <Card.Img style={{height:"300px", }} variant="top" src={item.image} />
          <Card.Body>
            {
              item.likes.includes(state._id)
              ? <AiOutlineDislike onClick={()=>likeunlike(item._id,'/unlike')} className='icon m-1' color='red' size={30}/>
              : <AiOutlineLike onClick={()=>likeunlike(item._id,'/like')} className='icon m-1' color='blue' size={30}/>
            }            
            <Card.Text className='text-warning'>{item.likes.length} likes</Card.Text>
            <Card.Title>{item.title}</Card.Title>
            <Card.Text>
              {item.comment}
            </Card.Text>

            {
              item.comments.length !== 0
              ? <>
                  <Card.Text className='h5'>All Comments</Card.Text>
                  {
                    item.comments.map((comment)=>{
                      return(
                        <Card.Text key={item._id}>
                          <Card.Img style={{height:"20px", width:"20px",borderRadius:"10px" ,margin:"3px"}} variant="top" src={comment.commentedBy.profileImg} />
                          <span className='mx-1 h5'>{comment.commentedBy.username}</span>
                          <span className='h6'>{comment.commentText}</span>
                        </Card.Text>
                      )
                    })
                  }
                </>
              : ""
            }

            <form onSubmit={(e)=>{submitComment(e,item._id)}}>
              <input type="text" placeholder='Write a comment' />
            </form>

          </Card.Body>
        </Card>
      )}

    </div>
  )
}

export default Home