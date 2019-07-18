import React, { Component } from 'react';
import axios from 'axios';
import wet from '../../img/wet.svg';
import dry from '../../img/dry.svg';
import styles from './Weather.module.css';
const KEY = process.env.REACT_APP_WEATHER;
class Weather extends Component{

  state = {gotWeather:false,weather:null, weatherError:null}

  componentDidMount(){
    //console.log("getting...")
    const corsAnywhere ='https://cors-anywhere.herokuapp.com/';

    axios.get(`${corsAnywhere}https://api.darksky.net/forecast/${KEY}/53.2747740041651,-9.04875088331228`)
    .then(r=>{
     // console.log("werther ", r.data.currently)
      this.setState({gotWeather:true,weather: r.data.currently})
    })
    .catch(e=>{
      console.log("weather error ", {...e})
      this.setState({weatherError:'Could not get Weather.'})
    })
  }

 


  

  render(){
    return(
      <React.Fragment>
  
      {
       
        (this.state.gotWeather) ?
        <div className={styles.weatherCompDiv}>
          <p className={styles.weatherP}>{(this.state.weather.precipIntensity <= 0 ) ? 'Dry' : 'Wet'}
        <img className={styles.weatherIcon} src={(this.state.weather.precipIntensity <= 0 ) ? dry : wet} alt='icon'/></p>
        <p className={styles.infoText}>Eyre Square {new Date().toString()}</p>
        

        </div>
        :
        <div className={styles.weatherCompDiv}>
          <p>Loading weather...</p>
        </div>
        
      }
      
      </React.Fragment>

    )
  }
}

export default Weather;