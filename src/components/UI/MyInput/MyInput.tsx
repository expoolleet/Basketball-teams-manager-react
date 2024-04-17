import React, { useEffect, useRef, useState } from 'react'
import classes from './MyInput.module.css'
import Selector from '../Selector/Selector'
import { SelectPropsType } from '../../pages/NewPlayer/NewPlayer'

interface IInputProps {
	name: string
	selectProps: SelectPropsType
	errorMessage: string
	forcedErrorMessage: ErrorMessageType
	label: string
	focused: boolean
	inputType: string
	inputProps: any
}

export type ErrorMessageType = {
	name: string
	isError: boolean
}

export const TEXT_TYPE: string = 'text'

export const SELECT_TYPE: string = 'select'

export const PASSWORD_TYPE: string = 'password'

export const DATE_TYPE: string = 'date'

export default function MyInput(props: any): JSX.Element {
	const { name, selectProps, errorMessage, forcedErrorMessage, label, ...inputProps } = props as IInputProps
	const inputType = props.type

	const openEye: string = classes.field_icon_open
	const closedEye: string = classes.field_icon_close

	const [isPasswordShowing, setIsPasswordShowing] = useState<boolean>(true)
	const [type, setType] = useState<string>(inputType)
	const [passwordFieldStyles, setPasswordFieldStyles] = useState<string>(closedEye)
	const [dateInputType, setDateInputType] = useState<string>(TEXT_TYPE)
	const [isFocused, setIsFocused] = useState<boolean>(false)
	const [isInputDisabled, setIsInputDisabled] = useState<boolean>(true)

	const dateInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!dateInputRef.current) return

		const ref = dateInputRef

		ref.current?.addEventListener('blur', hanldeDatePicker)

		return () => {
			ref.current?.removeEventListener('blur', hanldeDatePicker)
		}
	}, [])

	useEffect(() => {
		if (dateInputType === DATE_TYPE) dateInputRef.current?.showPicker()
	}, [dateInputType])

	function hanldeDatePicker(): void {
		setIsInputDisabled(true)
		setDateInputType(TEXT_TYPE)
	}
	function showPassword(): void {
		// метод показа пароля при нажатии на соответствующую иконку
		setIsPasswordShowing(!isPasswordShowing)
		setPasswordFieldStyles(isPasswordShowing ? openEye : closedEye)
		setType(isPasswordShowing ? TEXT_TYPE : PASSWORD_TYPE)
	}

	function handleFocus(): void {
		// обработчик расфокуса инпута
		setIsFocused(true)
	}

	function showDatePicker(): void {
		// обработчик нажатия на значок даты для вызова встроенного функционала
		setIsInputDisabled(false)
		setDateInputType(DATE_TYPE)
	}

	let errorSpan: JSX.Element
	if (forcedErrorMessage && forcedErrorMessage.isError && forcedErrorMessage.name === name)
		errorSpan = <span className={classes.error_message_show}>{errorMessage}</span>
	else if (type === SELECT_TYPE) errorSpan = <span className={classes.error_message_disable}>{errorMessage}</span>
	else errorSpan = <span className={classes.error_message}>{errorMessage}</span>

	function getInputByType(type: string) {
		switch (inputType) {
			case SELECT_TYPE:
				return (
					<Selector
						items={selectProps.items}
						selectedItem={selectProps.selectedItem}
						onChange={selectProps.onChange}
						type={selectProps.type}
						isBlur={selectProps.isBlur}
						setIsBlur={selectProps.setIsBlur}
					/>
				)
			case DATE_TYPE:
				return (
					<>
						<input
							spellCheck='false'
							aria-autocomplete='none'
							{...inputProps}
							name={name}
							id={name}
							type={dateInputType}
							ref={dateInputRef}
							disabled={isInputDisabled}
							onBlur={handleFocus}
							data-focused={isFocused}
						/>
						<span className={classes.date_icon} onClick={showDatePicker} />
					</>
				)
			case PASSWORD_TYPE:
				return (
					<>
						<input
							spellCheck='false'
							aria-autocomplete='none'
							{...inputProps}
							type={type}
							name={name}
							id={name}
							onBlur={handleFocus}
							data-focused={isFocused}
						/>
						<span className={passwordFieldStyles} onClick={showPassword} />
					</>
				)

			default:
				return (
					<input
						spellCheck='false'
						aria-autocomplete='none'
						{...inputProps}
						name={name}
						id={name}
						onBlur={handleFocus}
						data-focused={isFocused}
					/>
				)
		}
	}

	return (
		<div className={classes.myInput}>
			<label className={classes.label}>
				{label}
				{getInputByType(type)}
				{errorSpan}
			</label>
		</div>
	)
}
