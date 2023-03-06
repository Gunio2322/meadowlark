import React from 'react'
import { ActionProps } from 'adminjs'

const ShowRecord = (props) => {
  const { record } = props

  return (
    <Div>
      <h1>This is a simple component</h1>
    <p>Below are our records</p>
    <span>
      {JSON.stringify(record)}
    </span>
    </Div>
  )
}

export default ShowRecord