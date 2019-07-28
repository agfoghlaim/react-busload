import React, { Fragment } from 'react'
import styles from './ProfileForm.module.css'


const profileForm = (props) => {

  return <React.Fragment>
        <h3>Profile Form</h3>
        <form className={styles.theForm}>
        <div className={styles.formGroup}>
          <label>Username</label>
            <input 
            type="text"
            id="userName"
            value={props.userName}
            onChange={(e)=>props.handleUserNameChange(e)}
            />
            <button 
            className={styles.buttonSmall}
            onClick={(e)=>props.handleUpdateName(e)}
            >Update</button>
          </div>
          <div className={styles.formGroup}>
          {/* <button onClick={(e)=>props.handleShowProfileForm(e)} className={styles.buttonSmall}>
            {(props.showProfilePicForm) ? 'hide' : 'edit pic'}
          </button> */}
          </div>
          {/* <div className={styles.formGroup}>
            <label>Profile Pic label</label>
            <input 
            type="file"
            id="pic"
            value={props.passwordValue }
            onChange={(e)=>props.handleFileChange(e)}
            />
          </div>
      
           
          <button className={styles.buttonMain} onClick={(e)=>props.handleUploadFile(e)}>Save</button> */}

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
                        <div>
                          <img className={styles.profileImgForEdit} src={props.remoteProfileUrl} alt="profile" />
                          <button className={styles.buttonSmall} onClick={(e)=>props.deleteProfilePic(e)}>Change(Delete)</button>
                        </div>
                          {/* <label>Choose File</label>
                          <input 
                          type="file"
                          id="pic"
                          value={props.passwordValue }
                          onChange={(e)=>props.handleFileChange(e)}
                          />

                            <button className={styles.buttonMain} onClick={(e)=>props.handleUploadFile(e)}>Save</button>
                                        
                            <button onClick={(e)=>props.deleteProfilePic(e)}>Use Default (delete)</button> */}
                      </div> 
      
                  }
                </div>

     

          }

        </form>
  </React.Fragment>
}

export default profileForm; 