import React from 'react';
import styles from './Modal.module.css';
import ModalBG from './ModalBG';
import Tux from '../../hoc/Tux';

const modal = (props) => {
  console.log("propw show ", props.show)
return (
  <Tux>
    <ModalBG show={props.show} clickBg={props.clickBg}   />
    <div 
      className={styles.Modal}
     
      >{props.children}
    </div>
  </Tux>
)
}

export default modal;

