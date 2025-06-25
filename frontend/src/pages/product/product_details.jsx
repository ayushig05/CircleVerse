import React from "react";
import { useParams } from "react-router-dom";

const Product_details = () => {
  const { id } = useParams();

  return (
    <div>
        <div className="text-black">Product Details Page: {id}</div>
    </div>
  );
};

export default Product_details;
