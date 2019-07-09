import React from 'react'
import styles from './EditFaveStopForm.module.css';

const editFaveStopForm = (props) => {
  return(
    <form className={styles.theForm}>
    <div className={styles.formGroup}>
      <label>New Name</label>
      <input 
      type = "text"
      onChange={(e)=>props.handleFaveInputChange(e)}
      />
    </div>
    <button onClick={(e)=>props.editFaveStop(e)} >Save</button>
</form>
  )
}

export default editFaveStopForm;