import React from 'react';
import styles from './NextPrevStop.module.css';
import { gql } from 'apollo-boost'; //parse queries
import { Query } from 'react-apollo';
import Tux from '../../hoc/Tux';
import { Link } from 'react-router-dom';
import leftArrow from '../../img/left_arrow.svg';
import rightArrow from '../../img/right_arrow.svg';

const NEXT_PREV_QUERY = gql`
  query nextPrevStops($route:String!, $direction:String!, $sequence:String!){
    nextPrevStops(route:$route, direction:$direction, sequence:$sequence){
      next{
        name
        bestopid
      }
      prev{
        name
        bestopid
      }
    }
  }
`

const NextPrevStop = (props) => {
  console.log(props)
  //need route, direction and stop_sequence
  let { route, direction, sequence } = props;
   route = route.toString();
   direction = direction.toString();
   sequence = sequence.toString();

return<div className={styles.nextPrevWrapDiv}>
  <div className={styles.pretend}></div>
  <Query 
    query={NEXT_PREV_QUERY} 
    variables={{route, direction, sequence}}>
      {
        ({ loading, error, data }) => {
            //console.log(data)
          if (loading) return <p>loading...</p>;
          if (error) return `Error! ${error}`;
          if(data.nextPrevStops){
            //console.log(data.nextPrevStops)
              return <Tux>
                
                <div className={styles.prev}>
                  {
                    (data.nextPrevStops.prev)?
                    <Tux>
                      {/* <p>Previous Stop</p> */}
                      
                      <Link className={styles.prevLink}  to={`/${route}/${direction}/${data.nextPrevStops.prev.bestopid}`}>
                      <img className={styles.leftArrow} src={leftArrow} alt="left-arrow" />
                        <p className={styles.prevP}>{data.nextPrevStops.prev.name}</p>
                      </Link>
                    </Tux>
                    :
                    null
                  }
                 
                </div>

                <div className={styles.thisStop}>
               
                    <Tux>
                    
                      {/* <img className={styles.arrows} src={leftArrow} alt="left-arrow" /> */}
                    
                        <p className={styles.thisStopP}> {props.stopName}
                        
                        </p>
                      
                   
                    </Tux>
                  
                
                 
                </div>


                <div className={styles.next}>
                  {
                    (data.nextPrevStops.next)?
                    <Tux>
                      {/* <p>Next Stop</p> */}
                     
                      <Link className={styles.nextLink} to={`/${route}/${direction}/${data.nextPrevStops.next.bestopid}`}>
                      <img className={styles.rightArrow} src={rightArrow} alt="right-arrow" />
                        <p className={styles.nextP}>{data.nextPrevStops.next.name}</p>
                      </Link>
                    </Tux>
                    :
                    null
                  }
                  
                </div>
              </Tux>

          }

        }
      }
    </Query>
</div>
}

export default NextPrevStop;



