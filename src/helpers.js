module.exports = {
  isWithinMinutesOf: function(busLoadTime,beTime,numMinutes){
 
    let theirDate = new Date();
    let myDate = new Date();
    
    theirDate.setHours(beTime.substr(0,2))
    theirDate.setMinutes(beTime.substr(3,2))
    
    myDate.setHours(busLoadTime.substr(0,2))
    myDate.setMinutes(busLoadTime.substr(3,2))

    //subtract the largest time from the smallest time
    var diff = Math.max(theirDate.valueOf(), myDate.valueOf()) - Math.min(theirDate.valueOf(), myDate.valueOf()); 

    diff = diff/1000/60

    //is the difference less than numMinutes???
    return (diff <= numMinutes)? true : false;
  }
}