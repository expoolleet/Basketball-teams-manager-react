import React from 'react'
import classes from './MyCheckbox.module.css'

export default function MyCheckbox(props: any) : JSX.Element {
	interface ICheckboxProps {
		children: any
		checkboxProps: any
	}

	const { children, ...checkboxProps } = props as ICheckboxProps

	return (
		<label className={classes.checkbox}>
			<input {...checkboxProps} type='checkbox' />
			<span>{children}</span>
		</label>
	)
}
