import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const HomePage = () => {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  useEffect(() => {
  console.log("Redux Auth State:", user);
}, [user]);

  
  return (
    <div>Home page hello ayushs</div>
  )
}

export default HomePage;
