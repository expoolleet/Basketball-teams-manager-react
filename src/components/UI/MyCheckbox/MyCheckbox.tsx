import React, { useState } from 'react'
import classes from './MyCheckbox.module.css'

interface ICheckboxProps {
	children: any
	checkboxProps: any
	errorMessage: string
	isErrorMessageForced: boolean
	isChecked: boolean
	setIsChecked(flag: boolean): any
}

export default function MyCheckbox(props: any): JSX.Element {
	const { children, errorMessage, isErrorMessageForced, isChecked, setIsChecked, ...checkboxProps } =
		props as ICheckboxProps

	const checkboxClasses = [classes.checkbox]
	const textClasses = [classes.text]
	let errorClass = classes.error_message_hide

	if (isChecked) {
		checkboxClasses.push(classes.active)
	}

	if (isErrorMessageForced) {
		textClasses.push(classes.error)
		errorClass = classes.error_message_show
	}

	return (
		<p>
			<label className={classes.container} onClick={() => setIsChecked(!isChecked)}>
				<span className={checkboxClasses.join(' ')} />
				<span className={textClasses.join(' ')}>{children}</span>
			</label>
			<span className={errorClass}>{errorMessage}</span>
		</p>
	)
}
