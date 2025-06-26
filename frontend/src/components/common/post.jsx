import React from 'react'
import { useParams } from 'react-router-dom';

const Post = () => {
    const { id } = useParams();

  return (
    <div>Post</div>
  )
}

export default Post;
