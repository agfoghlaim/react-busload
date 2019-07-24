import React, { Component } from 'react';
import wet from '../../img/wet_white.svg';
import dry from '../../img/dry_white.svg';
import { isWithinMinutesOf } from '../../helpers';
import styles from './Timetable.module.css';
import BusDets from './BusDets/BusDets';
import Modal from '../Modal/Modal';
import NextPrevStop from '../NextPrevStop/NextPrevStop';
import ChooseTimetable from '../ChooseTimetable/ChooseTimetable';






class Timetable extends Component {

  //maybe this should happen on the server??
  //check the busRoutes.bus_times for corresponding rtpiData results
  //add a busRoutes.bus_times.rtpi field: false for no result, scheduleddeparture datetime if there is a result
//console.log(this.props.busRoutes)

state = {showModal:false, selectedBus:null, wetOrDry:null}

findBus = (rtpiRes, due) =>{

   let relevantRoute = rtpiRes.filter(route=>{
     return isWithinMinutesOf(due, route.scheduleddeparturedatetime.substr(11,5), 3)
   })
 
   //relevantRoute should always be length = 1;
   //0 means the bus being queried for is not on the RTPI for that stop
   return (relevantRoute.length === 1) ? relevantRoute[0] : false
 }


handleShowModal = (b,wetOrDry)=>{
  this.setState({showModal:true,selectedBus:b,wetOrDry:wetOrDry})
}

showModal = ()=>{
  if(this.state.showModal){
    return (
      <Modal 
        clickBg={this.closeModal} 
        show={this.state.showModal}>
          <BusDets busDets={this.state.selectedBus} wetOrDry={this.state.wetOrDry} />
      </Modal> 
    )
  }
}

closeModal = ()=>{
  this.setState({showModal:false})
}

getAvgStrings=(avg)=>{
  //console.log(avg)
  if(avg ==='x'){
    return 'x';
  }
  else if(!isNaN(avg) && avg > 0){
     return `${avg} mins (late)`
  }else if(!isNaN(avg) && avg < 0){
    return `${avg} mins (early)`
  }else if(avg === 0){
   
    return 'on time';
  }
}

 
render(){
  console.log(this.props)
  const { stop_sequence,bestopid} = this.props.busRoutes;
  if(this.props.rtpiData){
    this.props.busRoutes.bus_times.map(bus=>bus.rtpi = this.findBus(this.props.rtpiData.rtpiRequest.results,bus.time))
  }


    return(
      <div className={styles.timetableDiv}>
          {this.showModal()}

        <NextPrevStop route={this.props.route} direction={this.props.direction} sequence={stop_sequence} stopName={this.props.busRoutes.name} bestopid={bestopid} />

        <ChooseTimetable timetables={this.props.timetables} changeBusTimes_X={this.props.changeBusTimes_X} />
          
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            {/* <th>bus</th> */}
            <th className={styles.th}>Scheduled</th>
            {
              (this.props.isToday) ?
              <th className={styles.th}>RTPI</th>
              :
              null
            }
            
            <th className={styles.th}><span className={styles.span}>Wet</span><img src={wet} alt='wet'/><h3>Usually</h3></th>
            <th className={styles.th}><span className={styles.span}>Dry</span><img src={dry} alt='dry'/><h3>Usually</h3></th>
            <th className={styles.th}>Average</th>
          </tr>
        </thead>
      {this.props.busRoutes.bus_times.map((b,i)=>{

     
          return(
            <tbody key={b.bus}>
            <tr className={styles.tr}
             >
              
              <td className={styles.td}>{b.time}</td> 
              
              {
              (this.props.isToday) ?
              <td className={styles.td}>{b.rtpi.departuredatetime}</td>
              :
              null
            }

            
              <td 
                className={styles.tdClickable}
                onClick={()=>this.handleShowModal(b,'wet')}
                
                >
                {(b.wet_avg !==null) ? this.getAvgStrings(b.wet_avg) : '?'}<br />
              </td>

              <td 
                className={styles.tdClickable}
                onClick={()=>this.handleShowModal(b,'dry')}
              >
                {(b.dry_avg !==null) ? this.getAvgStrings(b.dry_avg) : '?'}<br /> 
              </td> 

              <td className={styles.td}
              
              > {(b.total_avg !==null) ? this.getAvgStrings(b.total_avg) : '?'}<br /> ({b.num_total} results)</td> 
              
            </tr>
            </tbody>
          )
        
      })
  }



      </table>
      </div>
    )
      
}

}

export default Timetable;