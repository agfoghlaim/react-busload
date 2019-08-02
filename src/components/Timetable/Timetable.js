import React, { Component } from 'react';
import wet from '../../img/wet_white.svg';
import dry from '../../img/dry_white.svg';
import styles from './Timetable.module.css';
import BusDets from './BusDets/BusDets';
import Modal from '../Modal/Modal';
import NextPrevStop from '../NextPrevStop/NextPrevStop';
import ChooseTimetable from '../ChooseTimetable/ChooseTimetable';
import { isWithinMinutesOf, inTheFuture } from '../../helpers';





class Timetable extends Component {

  //maybe this should happen on the server??
  //check the busRoutes.bus_times for corresponding rtpiData results
  //add a busRoutes.bus_times.rtpi field: false for no result, scheduleddeparture datetime if there is a r

state = {showModal:false, selectedBus:null, wetOrDry:null, showAll:false}

filterNext = (resp) =>{
  //get the next few buses only
  
  let timeNow = new Date().toString().substring(16,21);
  //console.log(timeNow,resp[0].time)
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

getMinMins=(avg)=>{
  if(avg > 1 || avg < -1 ) return'mins';
  else if(avg === 1 ) return 'min';
  else return 'min';
}
getAvgStrings=(avg)=>{
  //console.log(avg)
  if(avg ==='x'){
    return 'x';
  }
  else if(!isNaN(avg) && avg > 0){
     return <span className={styles.rtpiSpan}>
     <p>{`${Math.abs(avg)} ${this.getMinMins(Math.abs(avg))}`}</p>
     <p>late</p>
   </span>
  }else if(!isNaN(avg) && avg < 0){
    return <span className={styles.rtpiSpan}>
    <p>{`${Math.abs(avg)} ${this.getMinMins(Math.abs(avg))}`} </p>
    <p >early</p>
  </span>
  }else if(avg === 0){
   
    return 'on time';
  }
}

getAvgAvgStrings=(avg)=>{
  //use Math.abs to remove '-' from early results
  if(avg ==='x'){
    return 'x';
  }
  else if(!isNaN(avg) && avg > 0){
     return <span className={styles.rtpiSpan}>
     <p><small>
     <span className={styles.lateTag}>{`${Math.abs(avg)} ${this.getMinMins(Math.abs(avg))}`} late</span></small></p>
   </span>
  }else if(!isNaN(avg) && avg < 0){
    return <span className={styles.rtpiSpan}>
    <p><small>
    <span className={styles.earlyTag}>{`${Math.abs(avg)} ${this.getMinMins(Math.abs(avg))}`} early</span></small></p>
  </span>
  }else if(avg === 0){
   
    return <p><small><span className={styles.ontimeTag}>on time</span></small></p>;
  }
}

 
render(){
  
  const reJigRtpiStr = (str)=>{
    if(!str) return;
    return <span className={styles.rtpiSpan}>
      <p>{str.substring(10,16)}</p>
      <p><small>{str.substring(0,10)}</small></p>
    </span>
  }

  const { stop_sequence,bestopid} = this.props.busRoutes;
  if(this.props.rtpiData){
    this.props.busRoutes.bus_times.map(bus=>bus.rtpi = this.findBus(this.props.rtpiData.rtpiRequest.results,bus.time))
  }

  let busesToShow = this.filterNext(this.props.busRoutes.bus_times);
  
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
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}>Bus</span></div><h3>Scheduled</h3><span className={styles.span}>at</span></div></th>
            {
              (this.props.isToday) ?
              <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}>Bus</span></div><h3>Expected</h3><span className={styles.span}>at</span></div></th>
              :
              null
            }
            
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><img src={wet} alt='wet'/><span className={styles.span}>If it's wet</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><img src={dry} alt='dry'/><span className={styles.span}>If it's Dry</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
            <th className={styles.th}><div className={styles.thWrap}><div className={styles.thTopDiv}><span className={styles.span}>On Average</span></div><h3>BusLoad<br></br>Predicts</h3><span className={styles.span}>this bus will be</span></div></th>
          </tr>
        </thead>
        
          
          <tbody ><tr className={styles.allNextWrap} onClick={this.handleToggleShowAll}><td colSpan="5">{(!this.state.showAll)? 'Show All' : 'Show Next'}</td></tr>
         
        
        
      { 
        
        
        //this.props.busRoutes.bus_times.map((b,i)=>{
          // <tbody >
          busesToShow.map((b,i)=>{
          
          return(
              <React.Fragment key={b.bus}>
              <tr className={styles.tr} >
                <td className={styles.td}>{b.time}</td> 
                
                {
                (this.props.isToday) ?
                <td className={styles.td}>{reJigRtpiStr(b.rtpi.departuredatetime)}</td>
                :
                null
              }

              
                <td 
                  className={styles.tdClickable}
                  onClick={()=>this.handleShowModal(b,'wet')}>
                  <span className={styles.rtpiSpan}>
                  {(b.wet_avg !==null) 
                    ? 
                    this.getAvgStrings(b.wet_avg) 
                    : 
                    <p>?</p>
                    }
                  </span>
                </td>

                <td 
                  className={styles.tdClickable}
                  onClick={()=>this.handleShowModal(b,'dry')}>
                  <span className={styles.rtpiSpan}>
                  {(b.dry_avg !==null) 
                    ? 
                    this.getAvgStrings(b.dry_avg) 
                    : 
                    <p>?</p>}
                  </span>
                </td> 

                <td className={styles.td}> 
                  <span className={styles.rtpiSpan}>
                 
                  {(b.total_avg !==null) 
                    ? 
                    this.getAvgAvgStrings(b.total_avg)
                    : '?'
                    }
          
                  </span>
                  <span className={styles.numResultsSpan}>({b.num_total} results)</span>
                </td> 
                
              </tr>
              </React.Fragment> 
          )
   
          
      })
  }


      </tbody>
      </table>
      </div>
    )
      
}

}

export default Timetable;