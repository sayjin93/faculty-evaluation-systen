import React from "react";
import AuthConsumer from "../hooks/auth";

const Home = () => {
  const auth = AuthConsumer();
  console.log(auth);
  
  return <p>Home</p>;
};

export default Home;
