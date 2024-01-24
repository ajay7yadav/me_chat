import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// import chatImage from '../Images/chat.jpg';
// import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { allUsersRoutes } from '../Utils/APIRoutes';
import Contacts from '../Components/Contacts';

const Container = styled.div`
  height : 100vh;
  width : 100vw;
  display : flex;
  flex-direction : column;
  justify-content : center;
  gap : 1rem;
  aline-item:center;
  background-color : #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width:1080px) {
      grid-template-columns: 36% 65%;
    }
  }
`;

export default function Chat() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!localStorage.getItem('chat-app-user')) {
          navigate('/login');
        } else {
          setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  
  }, []);
  
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (currentUser) {
          if (currentUser.isAvatarImageSet) {
            const data = await axios.get(`${allUsersRoutes}/${currentUser._id}`);
            setContacts(data.data);
          } else {
            navigate('/setAvatar');
          }
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
  
    fetchContacts();
  
  }, [currentUser]); // Added currentUser as a dependency
  
  return (
    <Container>
      <div className='container'>
        < Contacts contacts={contacts} currentUser={currentUser}/>
      </div>
    </Container>
  )
}
