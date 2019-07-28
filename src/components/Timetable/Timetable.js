import React, { Component } from 'react';
import wet from '../../img/wet_white.svg';
import dry from '../../img/dry_white.svg';
//import { isWithinMinutesOf } from '../../helpers';
import styles from './Timetable.module.css';
import BusDets from './BusDets/BusDets';
import Modal from '../Modal/Modal';
import NextPrevStop from '../NextPrevStop/NextPrevStop';
import ChooseTimetable from '../ChooseTimetable/ChooseTimetable';
import { isWithinMinutesOf, inTheFuture } from '../../helpers';
import { isIt } from '../../helpers';





class Timetable extends Component {

  //maybe this should happen on the server??
  //check the busRoutes.bus_times for corresponding rtpiData results
  //add a busRoutes.bus_times.rtpi field: false for no result, scheduleddeparture datetime if there is a result
//console.log(this.props.busRoutes)

state = {showModal:false, selectedBus:null, wetOrDry:null, showAll:false}

filterNext = (resp) =>{
  //get the next few buses only
  console.log(resp)
  let timeNow = new Date().toString().substring(16,21);
  console.log(timeNow,resp[0].time)
  return resp.filter((item,i,arr)=>{
    return inTheFuture(item.time) && isWithinMinutesOf(timeNow,item.time,120)
   })
}


handleToggleShowAll = ()=>{
  this.setState((prev,current)=>{
    return{showAll:!prev.showAll}
  })
}

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

  const reJigRtpiStr = (str)=>{
    if(!str) return;
    return <span>
      <p>{str.substring(10,16)}</p>
      <p><small>{str.substring(0,10)}</small></p>
    </span>
  }
  const { stop_sequence,bestopid} = this.props.busRoutes;
  if(this.props.rtpiData){
    this.props.busRoutes.bus_times.map(bus=>bus.rtpi = this.findBus(this.props.rtpiData.rtpiRequest.results,bus.time))
  }

  let busesToShow = this.filterNext(this.props.busRoutes.bus_times);
  console.log(busesToShow)
  if(this.state.showAll){
    busesToShow = this.props.busRoutes.bus_times;
  }
    return(
      <div className={styles.timetableDiv}>
          {this.showModal()}

        <NextPrevStop route={this.props.route} direction={this.props.direction} sequence={stop_sequence} stopName={this.props.busRoutes.name} bestopid={bestopid} />

        <ChooseTimetable timetables={this.props.timetables} changeBusTimes_X={this.props.changeBusTimes_X} />
          
      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}>Bus</span></div><h3>Scheduled</h3><span className={styles.span}>time</span></div></th>
            {
              (this.props.isToday) ?
              <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}></span></div><h3>Realtime<br></br>Time<br></br>Info</h3><span className={styles.span}></span></div></th>
              :
              null
            }
            
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><img src={wet} alt='wet'/><span className={styles.span}>If it's wet</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><img src={dry} alt='dry'/><span className={styles.span}>If it's Dry</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}>On Average</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
          </tr>
        </thead>
        
          
          <tbody className={styles.allNextWrap} onClick={this.handleToggleShowAll}><tr><td colSpan="5">{(!this.state.showAll)? 'Show All' : 'Show Next'}</td></tr></tbody>
         
        
        
      { 
        
        
        //this.props.busRoutes.bus_times.map((b,i)=>{
          busesToShow.map((b,i)=>{
     
          return(
            <tbody key={b.bus}>
            <tr className={styles.tr}>
              <td className={styles.td}>{b.time}</td> 
              
              {
              (this.props.isToday) ?
              <td className={styles.td}>{reJigRtpiStr(b.rtpi.departuredatetime)}</td>
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