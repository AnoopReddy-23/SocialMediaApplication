import { useEffect,createContext,useReducer, useContext } from 'react';
import {useNavigate} from 'react-router-dom'
import './App.css'

import Header from './Components/Header/Header'
import {initialState,reducer} from './reducers/userReducer'

 export const UserContext=createContext()

const CustomRouting=()=>{

  const navigate=useNavigate();
  const {state,dispatch} =useContext(UserContext)

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo){
      dispatch({type:"USER",payload:userInfo})
      //navigate('/')
    }else{
      navigate('/login')
    }
  },[])

  return(
    <>
      <div className="header">
        <Header />
      </div>
    </>
  )
}

function App() {

  const [state,dispatch]=useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{state:state, dispatch:dispatch}}>
      <div className='App'>
        <CustomRouting /> 
      </div>
    </UserContext.Provider>
  );
}

export default App;