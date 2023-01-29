import React from "react";

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard",
    },
  };
};

const Home = () => {
  return null;
};

export default Home;
