import React from 'react'

const loginForm = (props) => {
  return <div>
         <h4>Login</h4>
        <form>
          <input 
          type="email"
          value={props.emailValue}
          onChange={props.handleEmailChange}
          />
          <input 
          type="password"
          value={props.passwordValue }
          onChange={props.handlePasswordChange}
          />

          <button onClick={(e)=>props.handleSubmit(e,'login')}>Login</button>
        </form>
  </div>
}

export default loginForm; 