import React, { useEffect, useRef, useState } from 'react'
import logo from "../assets/images/logo.svg";
import Client from '../components/Client';
import Editor from '../components/Editor';
import { ACTIONS } from '../socket/actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { initSocket } from '../socket';

export const EditorPage = () => {

  const navigate = useNavigate();
  const [code, setCode] = useState();

  const socketRef = useRef(null);

  const[clients, setClients] = useState([])

  const {roomId} = useParams();
  const username = useLocation().state?.username;
  const myName = username;
  

  const handleErrors = (err) =>{
    toast.error("Connection failed, try again");
    navigate("/");
  }

  useEffect(() => {
      
    
      console.log("init called")
      // socketRef.current = io(process.env.REACT_APP_BACKEND_URL, {autoConnect: false});
      socketRef.current = initSocket();
      socketRef.current.connect();
      

      socketRef.current.on("connect_error",(err)=> handleErrors(err));
      socketRef.current.on("connect_failed",(err)=> handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN, {username, roomId});

      socketRef.current.on(ACTIONS.USER_JOINED, ({username, clients, code})=>{

        setClients(clients)
        console.log("clients JOINED ", clients)
        console.log("User joined", username);
        if(myName !== username){
          toast.success(`${username} joined the room`);
        }

        setCode(code);
        
      })  

      socketRef.current.on(ACTIONS.LEAVE, ({username, clients})=>{

        setClients(clients)
        console.log("clients LEAVE ", clients)
        toast.success(`${username} left the room`);
      })
      
    
  


    return ()=>{
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
    }
  }, [])

  const leaveRoom = ()=>{
    socketRef.current?.removeAllListeners();
    socketRef.current?.disconnect();
    navigate("/")

  }
  const copyRoomId = ()=>{
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID is coppied")
  }

  if(!username){
    return <Navigate to="/"/>
  }

  return (
    <div className="grid grid-cols-5 w-screen h-screen">

      <div className='col-span-1 p-4 flex flex-col bg-[#282C34] text-white'>

        <div className="grow">
              <div className="flex flex-row content-center border-b-2 pb-2">
                  <img src={logo} alt="logo" className='object-cover h-14'/>
                  <h1 className='h1 self-center ml-4 text-lg font-bold font-xl'>Code Editor</h1>
              </div>

              <h3 className='h3 font-bold my-3'>Connected</h3>


            <div className="flex flex-wrap grow">
            

              {
                clients?.map((client) =>( 

                  <Client key={client.socketId} name={client.userName}/>

                ))
              }
            </div>

        </div>

        <div className='flex flex-col gap-2 place-content-end mt-4 '>
              <button className="bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded text-black" onClick={copyRoomId}>Copy Room Id</button>
              <button className="bg-purple-900 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded" onClick={leaveRoom}>Leave</button>
          </div>
        


        

      </div>




      {/* Text Editor */}
      <div className='col-span-4'>
        <Editor socketRef={socketRef} code={code}/>
      </div>

    </div>
  )
}
