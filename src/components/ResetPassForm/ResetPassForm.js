import React from 'react'

const resetPassForm = (props) => {

  return <div className ={props.styles.formWrapDiv}>
          <h4>Reset Password</h4>
          <form className={props.styles.theForm}>
          <div className={props.styles.formGroup}>
            <label>Email</label>
              <input 
              className={(props.emailValidity.isValid) ? props.styles.valid : props.styles.invalid}
              placeholder="Your Email..."
              type="email"
              id="email"
              value={props.emailValue}
              onChange={(e)=>props.handleAnyInputChange(e)}
           
              />
               {
                (props.emailValidity.validMsgs.length) ?
                <p className={props.styles.error}>{props.emailValidity.validMsgs[0]}</p>
                : 
                <p className={props.styles.error}></p>
              }
            </div>

            <p className={props.styles.error}>{props.resetFail}</p>

            <p className={props.styles.error}>{props.resetSent}</p>

            <button className={props.styles.buttonMain} onClick={(e)=>props.handleResetPass(e)}>Send</button>
          </form>
          </div>

}

export default resetPassForm;   