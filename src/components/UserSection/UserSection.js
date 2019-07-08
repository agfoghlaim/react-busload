import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class UserSection extends Component {

  state = {stopName:'', faveStops:[]}

  componentDidMount(){
    //get currently logged in users faveourite stops
    if(!this.props.userDets.userId) return
    const queryParams = `?auth=${this.props.userDets.idToken}&orderBy="userid"&equalTo="${this.props.userDets.userId}"`

    axios.get(`https://busload-8ae3c.firebaseio.com/favourites.json${queryParams}`)

    .then(r=>{
    let faveStops = []
    for(let i in r.data){
      faveStops.push(r.data[i])
    }
    console.log(faveStops)
    this.setState({faveStops:faveStops})
      this.closeModal();
    })
    .catch(e=>console.log({e}))
  }



  render(){
    console.log(this.state)
    return <div>
    <h4>UserSection</h4>
    {
      (this.state.faveStops.length) ?
      this.state.faveStops.map(stop=><div><p>{stop.userStopName}</p>
        <p>{stop.bestopid}</p>
        <p>{stop.stopname}</p>
     
        <Link to={`${stop.route}/${stop.direction}/${stop.bestopid}`}>{stop.userStopName}</Link>
            
        </div>
      )
      : null
    }
     
   
 
</div>

  }

}

export default UserSection;

