import React from 'react';
import styles from './Modal.module.css';
import ModalBG from './ModalBG';
import Tux from '../../hoc/Tux';

const modal = (props) => {
  console.log("propw show ", props.show)
return (
  <Tux>
    <ModalBG  show={props.show} clickBg={props.clickBg}   />
    <div 
      className={(props.show) ? `${styles.Modal} ${styles.ModalShow}` : `${styles.Modal} ${styles.ModalHide}`}
     
      >{props.children}
    </div>
  </Tux>
)
}

export default modal;

