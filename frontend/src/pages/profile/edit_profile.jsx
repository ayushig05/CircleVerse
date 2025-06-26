import React from 'react'
import { useParams } from 'react-router-dom';

const EditProfile = () => {
  const { id } = useParams();
  console.log(id);
  

  return (
    <div className='text-black'>Edit profile for user ID: {id}</div>
  )
}

export default EditProfile;
