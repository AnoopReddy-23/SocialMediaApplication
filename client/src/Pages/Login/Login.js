import Reac,{useContext} from 'react'
import {useForm} from 'react-hook-form'
import {Form, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

import {UserContext} from '../../App'
import './Login.css'

function Login() {

  const {state,dispatch}=useContext(UserContext)

  const {register, handleSubmit,formState:{errors}}=useForm();
  const navigate=useNavigate()

  //submit the form
  const onFormSubmit=(userCredObj)=>{
    //console.log(userCredObj)
    axios.post('/login',userCredObj)
    .then(res=>{
      //console.log(res.data)
      alert(res.data.result)
      if(res.data.result==="Login successful"){
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
        //dispatch state and action to reducer
        dispatch({type:"USER",payload:res.data.userInfo })
        navigate('/')
      }
    })
    .catch(error=>console.log(error))  
  }

  return (
    <>
        <div className="col-10 col-sm-8 col-md-7 mt-5 mx-auto border border-2 login-form">
          <Form onSubmit={handleSubmit(onFormSubmit)} className='p-5' >
            {/* username */}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" autoComplete="Username" placeholder="Enter Username" {...register("username",{required:true})} />
              {/* validation error message for username */}
              {errors.username && <p className='text-danger'>*Username is required</p>}
            </Form.Group>

            {/* password */}
            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password"  autoComplete="current-password" placeholder="Enter Password" {...register("password",{required:true})} />
              {/* validation error message for password */}
              {errors.password && <p className='text-danger'>*Password is required</p>}
            </Form.Group>
            
            {/* submit button */}
              <Button variant="primary" type="submit">
                Login
              </Button>

            <div className=" text text-center mt-2">
              <h5 onClick={()=>navigate('/signup')}>Don't have an Account?</h5>
            </div>
          </Form>
        </div>
    </>
  )
}

export default Login