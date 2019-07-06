import React from 'react'

const registerForm = (props) => {
  return <div>
      <h4>Register</h4>
        <form>
          <input 
          type="email"
          value={props.email}
          onChange={props.handleEmailChange}
          />

          <input 
          type="password"
          value={props.password}
          onChange={props.handlePasswordChange}
          />

          <button onClick={(e)=>props.handleSubmit(e,"reg")}>Register</button>

        </form>
  </div>
}

export default registerForm;