import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from 'axios';
import { useStateContext } from "../Contexts/ContextProvider";

const Home = () => {
  const [connect, setConnect] = useState('');
  const [loading, setLoading] = useState(true);
  const cssSpinner = {
    position: 'absolute',
    top: '45%',
    left: '60%',
    zIndex: 999,
  }
  const { currentColor } = useStateContext();
  useEffect(() => {
    // call api check_connection
    axios.get('/check_connect_db')
      .then((res) => {
        setConnect(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error('Lỗi kết nối cơ sở dữ liệu !', {
          position: toast.POSITION.TOP_RIGHT
        });
      });
  }, [])
  return (
    <div className=" m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
      <p className='text-2xl font-bold'>Automation System</p>
      <ToastContainer autoClose={3000} />
      <ScaleLoader
        loading={loading} color={currentColor} height={40} margin={3} radius={2}
        speedMultiplier={1} width={5} cssOverride={cssSpinner} />
      <div>
        {connect == 'connected' ? 'Connect database sucess !' : 'Connect database failed !'}
      </div>
    </div>
  );
};
export default Home;