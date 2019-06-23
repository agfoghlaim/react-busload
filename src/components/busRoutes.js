import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import BusRoute from './busRoute'

const BUS_ROUTES_QUERY = gql`
  query busRoutesQuery{
    busRoutes {
   
      route
      routename
      direction
      stops{
        name
        bestopid
        
      }
      
   
    }
  }
`;


class BusRoutes extends Component{
  render(){
    return(
      <div style={{background:'lightgreen'}}>
        <h4>BusRoutes Component</h4>
         <Query query={BUS_ROUTES_QUERY}>
           {
             ({ loading, err, data })=>{
               if(loading) return <p>loading...</p>
               if(err)console.log(err)
               console.log(data)
               return <div>
                 {
                  data.busRoutes.map((route,i)=>{
                    return <BusRoute key={route.routename} route={route} />
                   })
                  }
                 </div>
               
             }
           }
         </Query>
      </div>

    )
  }
}

export default BusRoutes;