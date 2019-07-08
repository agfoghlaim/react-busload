import React from 'react';
import styles from './Modal.module.css';
import ModalBG from './ModalBG';

const modal = (props) => {
return (
  <div>
    <ModalBG show={props.show} clickBg={props.clickBg}/>
  <div className={styles.Modal}>{props.children}</div>
  </div>
)
}

export default modal;