import React, { useState } from 'react'
import classes from './MyInput.module.css'

interface IInputProps {
	name: string
	errorMessage: string
	isErrorMessageForced: boolean
	label: string
	focused: boolean
	inputProps: any
}

let errorSpan: JSX.Element

export default function MyInput(props: any): JSX.Element {
	const { name, errorMessage, isErrorMessageForced, label, ...inputProps } = props as IInputProps

	const openEye: string = classes.field_icon_open
	const closedEye: string = classes.field_icon_close

	const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(true)
	const [type, setType] = useState<string>(props.type)
	const [passwordFiledStyles, setPasswordFieldStyles] = useState<string>(props.type === 'password' ? closedEye : '')
	const [isFocused, setIsFocused] = useState<boolean>(false)

	function showPassword(): void {
		setIsPasswordShowing(!isPasswordShowing)
		setPasswordFieldStyles(isPasswordShowing ? openEye : closedEye)
		setType(isPasswordShowing ? 'text' : 'password')
	}

	function handleFocus(): void {
		setIsFocused(true)
	}

	if (isErrorMessageForced) errorSpan = <span className={classes.error_message_show}>{errorMessage}</span>
	else errorSpan = <span className={classes.error_message}>{errorMessage}</span>

	return (
		<div className={classes.myInput}>
			<label className={classes.label}>
				{label}
				<input
					spellCheck='false'
					aria-autocomplete='none'
					{...inputProps}
					name={name}
					id={name}
					type={type}
					onBlur={handleFocus}
					data-focused={isFocused}
				/>
				<span className={passwordFiledStyles} onClick={showPassword} />
				{errorSpan}
			</label>
		</div>
	)
}
