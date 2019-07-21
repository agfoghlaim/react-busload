import React from 'react';
import styles from './Modal.module.css';
import ModalBG from './ModalBG';
import Tux from '../../hoc/Tux';


const modal = (props) => {
  console.log("propw show ", props)
  const cssClasses = [
    `${styles.Modal}`,
   (props.show === 'entering') ?
    `${styles.ModalShow}`
    : (props.show === 'exiting') ?
    `${styles.ModalHide}`
    : null
  ]
return (

        <Tux>
          <ModalBG  show={props.show} clickBg={props.clickBg}   />
          <div 
            className={cssClasses.join('')}
            >{props.children}
          </div>
        </Tux>
  

)
}

export default modal;

