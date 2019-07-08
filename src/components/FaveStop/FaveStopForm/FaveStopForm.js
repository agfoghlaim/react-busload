import React from 'react';
import styles from './FaveStopForm.module.css';

const faveStopForm = (props) => {
return (
  <div>
     <form className={styles.theForm}>
          <div className={styles.formGroup}>

            <label>Bus Stop Name</label>
            <p>Save bus stop as... eg.Work, Susan's house?</p>
            <input 
            type = "text"
            onChange={(e)=>props.handleFaveInputChange(e)}
            />
          </div>
          <button onClick={(e)=>props.handleSubmitFave(e)} >Save</button>
      </form>
  </div>
)
}

export default faveStopForm;