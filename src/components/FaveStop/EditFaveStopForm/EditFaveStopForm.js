import React from 'react'
import styles from './EditFaveStopForm.module.css';

const editFaveStopForm = (props) => {
 console.log("edit ", props)
  return(
    <form className={styles.theForm}>
    <div className={styles.formGroup}>
      <label>{props.stopName}</label>
      <input 
      type = "text"
      placeholder="Enter you name for this bus stop..."
      onChange={(e)=>props.handleFaveInputChange(e)}
      />
    </div>
    <button onClick={(e)=>props.editFaveStop(e)} >Save</button>
</form>
  )
}

export default editFaveStopForm;