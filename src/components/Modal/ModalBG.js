import React from 'react'
import styles from './ModalBg.module.css';

const modalBG = (props) => {

return props.show ? <div 
className={styles.ModalBg}
onClick = {props.clickBg}
>
  
</div> 

: 
null
}

export default modalBG;