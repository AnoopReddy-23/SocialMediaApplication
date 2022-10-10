import React,{useContext} from 'react'
import {Navbar, Container, Nav} from 'react-bootstrap'
import {Route, Routes, NavLink, useNavigate} from 'react-router-dom'

import './Header.css'
import Home from '../../Pages/Home/Home'
import Login from '../../Pages/Login/Login'
import SignUp from '../../Pages/Signup/Signup'
import Profile from '../../Pages/Profile/Profile'
import CreatePost from '../../Pages/CreatePost/CreatePost'
import OtherProfile from '../../Pages/OtherProfile/OtherProfile'
import FollowingPosts from '../../Pages/FollowingPosts/FollowingPosts'

import {UserContext} from '../../App'

function Header() {

  const {state,dispatch} =useContext(UserContext)
  const navigate=useNavigate()

  const logout=()=>{
    navigate('/login')
    localStorage.clear()
    dispatch({type:"LOGOUT"})
  }

  const navList=()=>{
    if(state){
      return[
        <Nav.Link as={NavLink} eventKey={4} to="/createpost">Post</Nav.Link>,
        <Nav.Link as={NavLink} eventKey={7} to="/postsfromfollowing">Posts From Following</Nav.Link>,
        <Nav.Link as={NavLink} eventKey={5} to="/profile">Profile</Nav.Link>,
        <li className='m-1' eventKey={6}>
           <button className='btn btn-light p-1' onClick={()=>logout()}>Logout</button>
        </li>
      ]
    }else{
        return[
          <Nav.Link as={NavLink} eventKey={2} to="/login">Login</Nav.Link>,
          <Nav.Link as={NavLink} eventKey={3} to="/signup">SignUp</Nav.Link>
        ]
      }
  }

  return (
    <div>
      {/* Navbar */}
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark" sticky='top'>
        <Container>
          <Navbar.Brand as={NavLink} to={state? '/' : '/login'}>Instagram</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              {navList()}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Routes */}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route  path='/login' element={<Login />} />
        <Route  path='/signup' element={<SignUp />} />
        <Route  path='/createpost' element={<CreatePost />} />
        <Route exact path='/profile' element={<Profile />} />
        <Route path='/profile/:userId' element={<OtherProfile />} />
        <Route path='/postsfromfollowing' element={<FollowingPosts />} />

      </Routes>
    </div>
  )
}

export default Header