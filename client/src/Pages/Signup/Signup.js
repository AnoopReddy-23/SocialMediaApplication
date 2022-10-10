import React,{useState,useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {Form, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import './Signup.css'

function Signup() {
  const {register,handleSubmit,formState:{errors}}=useForm();
  const navigate=useNavigate()

  //state for image
  let [img,setImg]=useState("")
  let [url,setUrl]=useState(undefined)

  //on image select
  const onImageSelect=(event)=>{
    setImg(event.target.files[0]);
  }

  //submit form
  const onFormSubmit=(userObj)=>{
    if(img){
    delete userObj.photo
    const formData=new FormData()
    formData.append("file",img)
    formData.append("folder","SociaMediaApp/ProfilePics")
    formData.append("upload_preset","insta-clone-app")
    formData.append("cloud_name","anoop23")

    fetch("https://api.Cloudinary.com/v1_1/anoop23/image/upload",{
      method:"post",
      body: formData

    }).then(response=>response.json())
    .then(data=>{
      //console.log(data)
      setUrl(data.url)
      userObj.profileImg=data.url
      //console.log(userObj)
      axios.post('/register',userObj)
      .then(res=>{
        alert(res.data.result)
        if(res.data.result==="User Registered successfully"){
          navigate('/login')
        }
      })
      .catch(error=>console.log(error))
    })
    .catch(error=>console.log(error))

    }
    else{
      userObj.profileImg=url
      //console.log(userObj)
      axios.post('/register',userObj)
      .then(res=>{
        alert(res.data.result)
        if(res.data.result==="User Registered successfully"){
          navigate('/login')
        }
      })
      .catch(error=>console.log(error))
    }
  }

  return (
    <>
      <div className="register-form col-10 col-sm-8 col-md-7 mt-5 mx-auto border border-2">
        {/* form */}
        <Form onSubmit={handleSubmit(onFormSubmit)} className='p-5'>
          {/* username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" autoComplete="Username" placeholder="Enter username" {...register('username',{required:true})} />
             {/* validation error message for username */}
             {errors.username && <p className='text-danger'>*Username is required</p>}
          </Form.Group>
          {/* password */}
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" autoComplete="Current-password" placeholder="Password" {...register('password',{required:true})}/>
             {/* validation error message for password */}
             {errors.password && <p className='text-danger'>*password is required</p>}
          </Form.Group>
          {/* email */}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" {...register('email',{required:true})} />
             {/* validation error message for city */}
             {errors.email && <p className='text-danger'>*Email is required</p>}
          </Form.Group>
           {/* city */}
           <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control type="text" placeholder="Enter City" {...register('city',{required:true})} />
             {/* validation error message for city */}
             {errors.city && <p className='text-danger'>*City is required</p>}
          </Form.Group>

          {/* Profile image */}
         <Form.Group className="mb-3">
            <Form.Label>Profile picture</Form.Label>
            <Form.Control 
              type="file" 
              {...register("photo")} 
              onChange={(event)=>onImageSelect(event)}
            />
          </Form.Group>

          {/* Button */}
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>

        </div>
    </>
  )
}

export default Signup