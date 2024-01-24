import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import chatImage from '../Images/chat.jpg';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { registerRoute } from '../Utils/APIRoutes';

const FormConatiner = styled.div`
  height : 100vh;
  width : 100vw;
  display : flex;
  flex-direction : column;
  justify-content : center;
  gap : 1rem;
  aline-item:center;
  background-color : #131324;
  
  .brand{
    display : flex;
    aline-item:center;
    gap : 1rem;
    justify-content : center;
    img{
      height:5rem
    }
    h1{
      color:white;
      text-transform:uppercase;
    }
  }
  form{
    display : flex;
    flex-direction : column;
    gap : 2rem;
    background-color : #00000076;
    border-radius: 2rem;
    padding : 3rem 5rem;
    width: 35%;
    margin: auto;
    input {
      background-color:transparent;
      padding:1rem;
      border:0.1rem solid #4e0eff;
      border-radius:0.4rem;
      color:white;
      width:100%;
      font-size: 1rem;
      &:focus{
        border:0.1rem solid #997af0;
        outline:none;
      }
    }
    button {
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
    span {
      color:white;
      text-transform:uppercase;
      a{
        color : #4e0eff;
        
        text-decoration : none;
        font-weight:bold;
      }
    }
  }
`;

export default function Register() {

  const navigate = useNavigate();

  const [values, setValues ] = useState({
    username : "",
    email : "",
    password : "",
    confirmPassword : ""
  })

  const handleSubmit = async(event) =>{
    event.preventDefault();
    // When Validation return "true" than call API otherwise do not do any things
    if(handleValidation()){
      try {
        const { username, email, password } = values;
        const response = await axios.post(registerRoute, {
          username,
          email,
          password
        });
        
        // When ever create then it store user details in browser local storage and navigate to chat page
        if(response.data.status === true){

          localStorage.setItem("chat-app-user", JSON.stringify(response.data.data));
          navigate("/");
        }

      } catch (err) {
        console.log(err.response.data)
        if(err.response.data.status === false){
          toast.error(`${err.response.data.message}`,toastObj);
          return false;
        }
      }
    }
  }

  const handleChange = (event) =>{
    setValues({...values, [event.target.name] : event.target.value});
  }

  const toastObj = {
    position : "top-right",
    autoClose : 8000,
    pauseOnHover : true,
    draggable : true,
    theme : 'dark',
  }

  // Handle Validation using "react-toastify"
  const handleValidation = (event) =>{
    const { username, email, password, confirmPassword } = values;
    if(username.length < 3){
      toast.error("username should be greater than 3 characters.",toastObj);
      return false;
    }
    else if(email === ""){
      toast.error("email is required.",toastObj);
      return false;
    }
    else if(password.length < 8){
      toast.error("password should be equal or greater than 8 characters.",toastObj);
      return false;
    }
    else if(password !== confirmPassword){
      toast.error("password and confirm password should be same.",toastObj)
      return false;
    }
    return true;
  }

    // this useEffect is check when already any user is login and her details is store in localStorage then auto redirect to chat page
    useEffect(() =>{
      if(localStorage.getItem("chat-app-user")){
        navigate("/");
      }
    }, []);

  return (
    <>
      <FormConatiner>
        <form onSubmit={(event) =>handleSubmit(event)}>
          <div className='brand'>
            <img src={chatImage} alt="logo" />
            <h1>A7</h1>
          </div>
          <input type="text" placeholder='Username' name='username' onChange={e =>handleChange(e)} />
          <input type="email" placeholder='Email' name='email' onChange={e =>handleChange(e)} />
          <input type="password" placeholder='Password' name='password' onChange={e =>handleChange(e)} />
          <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={e =>handleChange(e)} />
          <button type='submit'>Create User</button>
          <span>Already have an account ? <Link to="/login">Login</Link> 
          </span>
        </form>
      </FormConatiner>
      <ToastContainer />
    </>
  )
}
