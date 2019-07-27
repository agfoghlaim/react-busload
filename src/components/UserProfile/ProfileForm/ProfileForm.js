import React, { Fragment } from 'react'
import styles from './ProfileForm.module.css'

const profileForm = (props) => {
  return <React.Fragment>
         <h3>Profile Form</h3>
        <form className={styles.theForm}>
        <div className={styles.formGroup}>
          <label>Username</label>
            <input 
            // className={(props.emailValidity.isValid) ? styles.valid : styles.invalid}
            type="email"
            id="email"
            value={props.emailValue}
            onChange={(e)=>props.handleFileChange(e)}
            />
            {/* {
                (props.emailValidity.validMsgs.length) ?
                <p className={styles.error}>{props.emailValidity.validMsgs[0]}</p>
                : null
              } */}
          </div>

          <div className={styles.formGroup}>
            <label>Profile Pic label</label>
            <input 
            // className={(props.passwordValidity.isValid) ? styles.valid : styles.invalid}
            type="file"
            id="pic"
            value={props.passwordValue }
            onChange={(e)=>props.handleFileChange(e)}
            />

              {/* {
                (props.passwordValidity.validMsgs.length) 

                ?

                <p className={styles.error}>{props.passwordValidity.validMsgs[0]}</p>

                : 
                
                null
              } */}

          </div>
          {/* <p className={styles.error}>{props.loginFail}</p> */}
           
          <button className={styles.buttonMain} onClick={(e)=>props.handleUploadFile(e)}>Save</button>


          <div className={styles.formGroup}>
            <label>Delete pic</label>
            <button onClick={(e)=>props.deleteProfilePic(e)}>delete pic</button>

  

          </div>
        </form>
  </React.Fragment>
}

export default profileForm; 