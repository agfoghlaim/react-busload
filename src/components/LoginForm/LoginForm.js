import React from 'react'
import styles from './LoginForm.module.css'

const loginForm = (props) => {
  return <div>
         <h4>Login</h4>
        <form className={styles.theForm}>
        <div className={styles.formGroup}>
          <label>Email</label>
            <input 
            className={(props.emailValidity.isValid) ? styles.valid : styles.invalid}
            type="email"
            id="email"
            value={props.emailValue}
            onChange={(e)=>props.handleAnyInputChange(e)}
            />
            {
                (props.emailValidity.validMsgs.length) ?
                <p className={styles.error}>{props.emailValidity.validMsgs[0]}</p>
                : null
              }
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <input 
            className={(props.passwordValidity.isValid) ? styles.valid : styles.invalid}
            type="password"
            id="password"
            value={props.passwordValue }
            onChange={(e)=>props.handleAnyInputChange(e)}
            />

              {
                (props.passwordValidity.validMsgs.length) 

                ?

                <p className={styles.error}>{props.passwordValidity.validMsgs[0]}</p>

                : 
                
                null
              }

          </div>
          <p className={styles.error}>{props.loginFail}</p>
            {
              (props.emailVerifyRequired) ?
              <div>
                <p>Please verify your email first.</p>
                <button>Resend Verification Email (doesn't work)</button>
              </div>
              : null
            }
          <button className={styles.buttonMain} onClick={(e)=>props.handleSubmit(e,'login')}>Login</button>
        </form>
  </div>
}

export default loginForm; 