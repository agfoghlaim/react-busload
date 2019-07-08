import React, { Component } from 'react';
import axios from 'axios';

class UserSection extends Component {

  state = {stopName:''}

  handleStopNameChange = (e) =>{
    console.log("hi ", e.target.value)
    this.setState({stopName:e.target.value})
  }

  testSaveToFb = (e)=>{
    e.preventDefault()
    let stop = {stopName:this.state.stopName}
    console.log("will save",stop)
    axios.post(`https://busload-8ae3c.firebaseio.com/favourites.json`,stop)
    .then(r=>{console.log("test resp", r)})
    .catch(e=>console.log("error saving to fb ", e))
  }
  render(){
    return <div>
<h4>UserSection</h4>
  <form>
    <input 
    type="text"
    value={this.state.stopName}
    onChange={this.handleStopNameChange}
    />

    <button onClick={this.testSaveToFb}>Save</button>

  </form>
</div>

  }

}

export default UserSection;