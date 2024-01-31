import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HandleLoginAndSignup } from './HandleLoginAndSignup';
export default function HomePage() {
  const [success,setSuccess] = useState(false)

  const  handleSubmitAndLogin = async (event) =>{
    event.preventDefault()

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');

    // Create request object
    const request = {
      email: email,
      password: password,
      username: username,
      method:"POST"
    };

    const isSuccess = await HandleLoginAndSignup(request)
    setSuccess(isSuccess)
  }
  const navigate = useNavigate()
  useEffect(() => {
    // Check if success is true and navigate
    if (success) {
      navigate('/main', { replace: true });
    }
  }, [success]);
  
  return (
    <>
    {!success && (
    <div>
      <div>
        <form method='post' onSubmit={handleSubmitAndLogin}>
        <label>Login</label>
        <br></br>
        <br></br>
        <label>Email</label>
        <br></br>
        <input type='email' name='email' required></input>
        <br></br>
        <label>Password</label>
        <br></br>
        <input type='password' name='password' required></input>
        <button type='submit'>Login</button>
        </form>
      </div>

      <div>
        <form method='post' onSubmit={handleSubmitAndLogin}>
        <br></br>
        <br></br>
        <br></br>
        <label>SignUp</label>
        <br></br>
        <br></br>
        <label>Username</label>
        <br></br>
        <input type='text' name='username' required></input>
        <br></br>
        <label>Email</label>
        <br></br>
        <input type='email' name='email' required></input>
        <br></br>
        <label>Password</label>
        <br></br>
        <input type='password' name='password' required></input>
        <button type='submit'>SignUp</button>
        </form>
      </div>
    </div>)}
    </>
  )
}
