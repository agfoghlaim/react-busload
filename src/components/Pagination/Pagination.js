import React from 'react'

const pagination = (props) => {
  console.log(props)
  const getPage = ()=>{
    let { route, direction, bestopid } = props.match.params;
    return <p>{route} > {direction} > {bestopid}</p>
  }
  return getPage()
}

export default pagination;