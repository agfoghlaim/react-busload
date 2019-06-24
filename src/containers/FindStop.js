import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';


import SearchForStop from '../components/SearchForStop/SearchForStop';
import RefineForStop from '../components/RefineForStop/RefineForStop';

const FIND_STOP_QUERY = gql`
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


class FindStop extends Component{
  render(){
    return(
      <div style={{background:'lightgreen'}}>
        <h4>FindStop Component</h4>
         <Query query={FIND_STOP_QUERY}>
           {
             ({ loading, err, data })=>{
               if(loading) return <p>loading...</p>
               if(err)console.log(err)
               console.log(data)
               return <div>
                 {
                  data.busRoutes.map((route,i)=>{
                    return <RefineForStop key={route.routename} route={route} />
                   })
                  }
                 </div>
               
             }
           }
         </Query>
         <SearchForStop />
    
      </div>

    )
  }
}

export default FindStop;