import React,{useState} from 'react'
import {useForm} from 'react-hook-form'
import {Form, Button} from 'react-bootstrap'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import './CreatePost.css'

function CreatePost() {

  const {register,handleSubmit,formState:{errors}}=useForm();
  const navigate=useNavigate()

  //state for image
  let [img,setImg]=useState(null)

  //on image select
  const onImageSelect=(event)=>{
    setImg(event.target.files[0]);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': "Bearer " + localStorage.getItem("token")
  }

  //submit form
  const onFormSubmit=(obj)=>{
    delete obj.photo
    const formData=new FormData()
    formData.append("file",img)
    formData.append("folder","SociaMediaApp/PostPics")
    formData.append("upload_preset","insta-clone-app")
    formData.append("cloud_name","anoop23")

    fetch("https://api.Cloudinary.com/v1_1/anoop23/image/upload",{
      method:"post",
      body: formData

    }).then(response=>response.json())
    .then(data=>{
      //console.log(data)
      obj.image=data.url
      //console.log(obj)
      axios.post('/createpost',obj, {
        headers: headers
      })
      .then(res=>{
        alert(res.data.result)
        navigate('/')
        //console.log(res.data)
      })
      .catch(error=>console.log(error))
    })
    .catch(error=>console.log(error))
  }

  return (
    <>
    <div className="register-form col-10 col-sm-8 col-md-7 mt-5 mx-auto border border-2">
      {/* form */}
      <Form onSubmit={handleSubmit(onFormSubmit)} className='p-5'>
        {/* title */}
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" autoComplete="title" placeholder="Enter title" {...register('title',{required:true})} />
           {/* validation error message for title */}
           {errors.title && <p className='text-danger'>*title is required</p>}
        </Form.Group>
        
        {/* Comment */}
        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control type="text" autoComplete="comment" placeholder="Enter comment" {...register('comment',{required:true})} />
           {/* validation error message for comment */}
           {errors.comment && <p className='text-danger'>*comment is required</p>}
        </Form.Group>

         {/* Profile image */}
         <Form.Group className="mb-3">
            <Form.Label>upload Image</Form.Label>
            <Form.Control 
              type="file" 
              {...register("photo",{required:true})} 
              onChange={(event)=>onImageSelect(event)}
            />
            {/* validation error message for photo */}
            {errors.photo && <p className='text-danger'>*Image is required</p>}
          </Form.Group>

        {/* Button */}
        <Button variant="primary" type="submit">
          Upload Post
        </Button>
      </Form>

      </div>
  </>
  )
}

export default CreatePost