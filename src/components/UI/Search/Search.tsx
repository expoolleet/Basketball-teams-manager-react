import React from 'react'
import classes from './Search.module.css'

export default function Search(props: any): React.ReactElement {
  return (
    <div className={classes.container}>
        <input {...props} className={classes.search}/>
        <span className={classes.search_icon}/>
    </div>
  )
}
