import React from 'react'
import styles from './RegisterForm.module.css'

const registerForm = (props) => {


  return <div className={styles.formWrapDiv}>
      <h1>Register</h1>
        <form className={styles.theForm}>
          <div className={styles.formGroup}>

            <label>Email</label>
            <input 
              className={(props.emailValidity.isValid) ? styles.valid : styles.invalid}
            type="email"
            value={props.emailValue}
            id="email"
            onChange={(e)=>props.handleAnyInputChange(e)} />
            {
              (props.emailValidity.validMsgs.length) ?
              <p className={styles.error}>{props.emailValidity.validMsgs[0]}</p>
              : 
              <p className={styles.error}></p>
            }
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
            className={(props.passwordValidity.isValid) ? styles.valid : styles.invalid}
            type="password"
            id="password"
            value={props.passwordValue}
            onChange={(e)=>props.handleAnyInputChange(e)}

            />
            {
              (props.passwordValidity.validMsgs.length) ?
              <p className={styles.error}>{props.passwordValidity.validMsgs[0]}</p>
              : 
              <p className={styles.error}></p>
            }

          </div>

          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              className={(props.usernameValidity.isValid) ? styles.valid : styles.invalid} 
              type="text"
              value={props.usernameValue}
              id="username"
              onChange={(e)=>props.handleAnyInputChange(e)}/>
              {

              (props.usernameValidity.validMsgs.length) 

              ?
              
              <p className={styles.error}>{props.usernameValidity.validMsgs[0]}</p>

              : 
              <p className={styles.error}></p>

              }
          </div>
          <p className={styles.error}>{props.registerFail}</p>
     
          <button className={styles.buttonMain} onClick={(e)=>props.handleSubmit(e,"register")}>Register</button>

        </form>
  </div>
}

export default registerForm;