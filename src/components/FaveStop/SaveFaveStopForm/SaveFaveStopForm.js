import React from 'react';
import styles from './SaveFaveStopForm.module.css';

const saveFaveStopForm = (props) => {
return (
  <div>
     <form className={styles.theForm}>
          <div className={styles.formGroup}>

            <label>Bus Stop Name</label>
            <p>What would you like to call this stop?
              <br></br>
              <small>eg. Work, Susan's house?</small>
            </p>
            <input 
            id="saveFave"
            type = "text"
            onChange={(e)=>props.handleFaveInputChange(e)}
            />
          </div>
          <p className={styles.error}>{props.faveStopFail}</p>
          {
                (props.faveStopValidity.validMsgs.length) 

                ?

                <p className={styles.error}>{props.faveStopValidity.validMsgs[0]}</p>

                : 
                
                null
          }

          <p>{props.saveFeedbackMsg}</p>
          <button className={styles.buttonSmall} onClick={(e)=>props.handleSubmitFave(e)} >Save</button>
      </form>
  </div>
)
}

export default saveFaveStopForm;