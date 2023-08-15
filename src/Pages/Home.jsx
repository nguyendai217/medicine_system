import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Home = () => {
    const [connect, setConnect] = useState('');
    useEffect(() => {
        // call api check_connection
        axios.get('/check_connect_db')
            .then((res) => {
                setConnect(res.data);
            })
            .catch((error) => {
                toast.error('Lỗi kết nối cơ sở dữ liệu !', {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
    }, [])
    return (
        <div className=" m-2 md:m-8 mt-24 p-2 md:p-8 bg-white rounded-2xl">
            <p className='text-2xl font-bold'>Automation System</p>
            <ToastContainer autoClose={3000} />
            <div>
                {connect == 'connected' ? 'Connect database sucess !' : 'Connect database failed !'}
            </div>
        </div>
    );
};
export default Home;