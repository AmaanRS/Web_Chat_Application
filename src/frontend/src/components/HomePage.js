import React from 'react'
import { Form } from 'react-router-dom'

export default function HomePage() {
  return (
    <>
    <div>
      
      <div>
        <Form method='post'>
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
        </Form>
      </div>

      <div>
        <Form method='post'>
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
        </Form>
      </div>

    </div>
    </>
  )
}
