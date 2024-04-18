import React from 'react'
import classes from './AddButton.module.css'
import shared from '../../shared/Button.module.css'

interface IAddButtonProps{
  onClick() : any
}

export default function AddButton(props: any): React.ReactElement {

  const {onClick} = props as IAddButtonProps 

  return (
    <button onClick={onClick} className={[classes.add_button, shared.button].join(' ')}>Add</button>
  )
}
