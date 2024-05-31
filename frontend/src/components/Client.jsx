import React from 'react'
import Avatar from 'react-avatar'

const Client = ({name}) => {
  return (
    <div className='text-center p-2 rounded-sm hover:bg-[#3c424d] cursor-pointer'>
        <Avatar name={name} size='50' round='14px'/>
        <p className='m-2 font-bold text-sm'>{name}</p>
        
    </div>
  )
}

export default Client