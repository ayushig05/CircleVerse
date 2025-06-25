import React from 'react';
import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <div>
        hello auth page
        <Outlet />
    </div>
  )
}

export default Auth;
