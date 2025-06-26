import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  

  return (
    <div>
        <div className="text-black">Profile Page for User ID: {id}</div>
    </div>
  );
};

export default Profile;
