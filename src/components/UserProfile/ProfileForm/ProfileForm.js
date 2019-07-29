import React  from 'react'
import styles from './ProfileForm.module.css'


const profileForm = (props) => {
  // console.log(props)
  return <React.Fragment>
        <h3>Profile Form</h3>
        <form className={styles.theForm}>
        <div className={styles.formGroup}>
          <label>New Username</label>
            <input 
            type="text"
            id="userName"
            value={props.userName}
            onChange={(e)=>props.handleUserNameChange(e)}
            />

          <p className={styles.error}>{props.userNameFail}</p>
          {
                (props.userNameValidity.validMsgs.length) 

                ?

                <p className={styles.error}>{props.userNameValidity.validMsgs[0]}</p>

                : 
                
                <p className={styles.error}> </p>
          }

            <button 
            className={styles.buttonSmall}
            onClick={(e)=>props.handleUpdateName(e)}
            >Update</button>

          </div>
          <div className={styles.formGroup}>
 
          </div>


          {
  

              <div className={styles.formGroup}>
                  <label>Manage Profile Pic</label>
                  {
                    (!props.remoteProfileUrl && !props.profilePicChangeOngoing) ?
                   
                      <button 
                      onClick={(e)=>props.handleChangeProfilePic(e)}
                      className={styles.buttonSmall}
                      >Upload Profile Picture</button>
                    
                    :  
                    
                    (!props.remoteProfileUrl && props.profilePicChangeOngoing)
                    
                    ?

                    <div className={styles.formGroup}>
                          <label>Choose File</label>
                          <input 
                          type="file"
                          id="pic"
                          value={props.passwordValue }
                          onChange={(e)=>props.handleFileChange(e)}
                          />

                            <button className={styles.buttonSmall} onClick={(e)=>props.handleUploadFile(e)}>Save</button>
                                        
                      
                      </div>

                    :

                      <div className={styles.formGroup}>
                        <div className={styles.profilePicDiv}>
                          <img className={styles.profileImgForEdit} src={props.remoteProfileUrl} alt="profile" />
                          <button className={styles.buttonSmall} onClick={(e)=>props.deleteProfilePic(e)}>Change(Delete)</button>
                        </div>
       
                      </div> 
      
                  }
                </div>

     

          }

        </form>
  </React.Fragment>
}

export default profileForm; 