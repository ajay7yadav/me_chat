import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import loader from '../Images/loader.gif';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { setAvatarRoute } from '../Utils/APIRoutes';
import { Buffer } from 'buffer';

export default function SetAvatar() {
    // Open source API for avatar its free just pass random number
    const api = 'https://api.multiavatar.com/45678945';
    const navigate = useNavigate();

    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastObj = {
        position: "top-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    useEffect(()=>{
        if(!localStorage.getItem('chat-app-user')){
            navigate('/login');
        }
    }, []);

    const setProfilePicture = async () => {
        if (selectedAvatar === undefined) {
            toast.error("Please select profile picture", toastObj)
        }
        else{
            const user = await JSON.parse(localStorage.getItem('chat-app-user'));
            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image:avatars[selectedAvatar]
            })
            console.log(data);
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem('chat-app-user', JSON.stringify(user));
                navigate('/');
            }
            else{
                toast.error('Error setting avatar, Please try again',toastObj);
            }
        }
    }
    const findAvatar = async () => {
        let data = [];
        for (let i = 0; i < 4; i++) {
            // get random avatar
            let randomNumber = Math.round(Math.random() * 1000);
            let image = await axios.get(`${api}/${randomNumber}`);

            // make buffer image
            const buffer = new Buffer(image.data);
            // store as base64 string
            data.push(buffer.toString('base64'));
        }
        return data;
    };

    // This useEffect is use to generate 5 random avatar from open source website
    useEffect(() => {
        const fetchData = async () => {
            try {
                let data = await findAvatar();
                setAvatars(data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching avatars:', error);
            }
        };
        fetchData();
    }, []);



    return (
        <>
            {
                isLoading ? <Container>
                    <img src={loader} alt='loader' className='loader' />
                </Container> : (

                    <Container>
                        <div className='title-container'>
                            <h1>Pick an avatar as your profile picture</h1>
                        </div>
                        <div className='avatars'>{
                            avatars.map((avatar, index) => {
                                return (
                                    <div className={`avatar ${selectedAvatar === index ? "selected" : ""
                                        }`}>
                                        {/* here this would be read this base64 string as image */}
                                        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar"
                                            onClick={() => setSelectedAvatar(index)}
                                        />
                                    </div>
                                )
                            })
                        }</div>
                        <button className='submit-btn' onClick={setProfilePicture}>Set as Profile Picture</button>
                    </Container>
                )
            }
            <ToastContainer />
        </>
    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-item: center;
    flex-direction: column;
    gap: 3rem;
    background-color: #131324;
    height: 100vh;
    width: 100vw;
    .loader {
        max-inline-size: 100%
    }

    .title-container {
        h1{
            color: white;
        }
    }

    .avatars {
        display: flex;
        gap: 2rem;
        .avatar {
            border: 0.4rem solid transparent;
            padding: 0.4rem;
            border-radius : 5rem;
            display: flex;
            justify-content: center;
            align-item: center;
            transition: 0.5 ease-in-out;
        }
        img{
            height: 6rem;
        }
        .selected {
            border: 0.4rem solid #4e0eff
        }
    }
    .submit-btn {
        background-color: #997af0;
        padding:1rem 2rem;
        border:none;
        font-weight:bold;
        color:white;
        cursor : pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform:uppercase;
        transition:0.5s ease-in-out;
        &:hover{
            background-color : #4e0eff;
        }
    }

`;