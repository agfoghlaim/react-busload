import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
//import * as allStops from '../../completeListOfStops.json';
import busStopIcon from '../../img/busStopIcon.svg';
import styles from './Maps.module.css';
import { Link } from 'react-router-dom';

class Maps extends Component{
  

  state={
    viewport:{
      longitude:-9.04875088331228,
      latitude:53.2747740041651,
      zoom: 11,
      width:'100vw',
      height:'400px'
    },
    selectedStop:null,
    setSelectedStop:null
 
  }

  setSelectedStop = (e,stop)=>{
    e.preventDefault();
    this.setState({selectedStop:stop})
  }

  closePopup =()=>{
    this.setState({selectedStop:null})
  }
  render(){
   // console.log(this.props)
    return<div className={styles.mapWrapDiv}>
      <ReactMapGL 
      {...this.state.viewport}
 
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={(viewport) => this.setState({viewport})}
      >
   
        {
          this.props.stops.map(stop=>{
           // console.log(stop)
            return<Marker 
              key={stop.bestopid}
              latitude={JSON.parse(stop.latitude)}
              longitude={JSON.parse(stop.longitude)}>
               <button onClick={(e)=>this.setSelectedStop(e,stop)} className={styles.markerBtn}>
                 <img src={busStopIcon} alt="bus stop icon" />
               </button>
              </Marker>
          
          })
        }
        {
          (this.state.selectedStop) ? 
          (
            <Popup 
              longitude={JSON.parse(this.state.selectedStop.longitude)}
              latitude={JSON.parse(this.state.selectedStop.latitude)}
              onClose={this.closePopup}>
              <div>
                <p>{this.state.selectedStop.name} - {this.state.selectedStop.bestopid}</p>
                <Link to={`${this.props.currentPath}/${this.state.selectedStop.bestopid}`}>Go to stop</Link>
              </div>
            </Popup>
          )
          : null
        }

      </ReactMapGL>
    </div>
  }
}

export default Maps;