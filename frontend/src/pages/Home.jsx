import React, { useState } from 'react'
import logo from "../assets/images/logo.svg";
import { Link, useNavigate } from 'react-router-dom';
import {v4 as uuid} from 'uuid';
import toast from 'react-hot-toast';

export const Home = () => {

  const navigate = useNavigate();
  const [state, setState] = useState({
    roomId: "",
    username: ""
  });

  const generateID = async ()=>{
    setState({
      ...state,
      roomId: uuid()
    })
    toast.success("Created a new room")
  }

  const handleForm = (e) =>{
    setState({
        ...state,
        [e.target.name]: e.target.value,
      }
    )
  }

  const joinRoom = async () =>{
    if(!state.roomId || !state.username){
      toast.error("Room ID and username is required")
    } else{
      navigate(`/editor/${state.roomId}`, {
        state: {
          username: state.username
        }
      })
    }
      
  }
  return (
    <div className='w-screen h-screen grid justify-center content-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
      
      <div className="container w-96 rounded-lg p-4 bg-white">
        <div className="container flex flex-row content-center">
          <img src={logo} alt="logo" className='object-cover h-14'/>
          <h1 className='h1 self-center ml-4 text-lg font-bold font-xl'>Code Editor</h1>
        </div>
        <p className='text-sm text-gray-500 my-3'>Paste invitation Room ID</p>
        <input className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name='roomId' placeholder="Room ID" value={state.roomId} onChange={handleForm}/>
        
        <input className="border rounded w-full py-2 px-3 my-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Username" value={state.username} name='username' onChange={handleForm}/>
  
        <div className="flex justify-end">
          <button onClick={joinRoom} className="bg-purple-900 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded">
    Join
  </button>
        </div>
        <p className='text-sm text-gray-500 my-3 text-center'>if you don't have an invite then create <Link onClick={generateID} className='text-purple-900 underline'>new room</Link></p>
      </div>
    </div>
  )
}
