import React from 'react'
import styles from './ChooseTimetable.module.css';

const chooseTimetable = (props) => {
  //timetables
  return <div className={styles.timetableBtnGrpDiv}>
    
  {
   
    props.timetables.map(bus=><button key={bus.label} className={(bus.active)? styles.buttonInfoActive : styles.buttonInfo} onClick={()=>props.changeBusTimes_X(bus.dayNum)}>{bus.label}</button>
    
    )
  }
</div>
}

export default chooseTimetable;