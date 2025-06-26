import React from 'react'
import { useParams } from 'react-router-dom';

const Saved = () => {
    const { id } = useParams();

  return (
    <div>Saved</div>
  )
}

export default Saved;
