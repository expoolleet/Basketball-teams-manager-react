import React, { useContext, useEffect, useState } from 'react'
import classes from './SignIn.module.css'
import shared from '../../shared/Form.module.css'
import MyButton from '../../UI/MyButton/MyButton'
import MyInput from '../../UI/MyInput/MyInput'
import { Link } from 'react-router-dom'
import Notification from '../../Notification/Notification'
import { AuthContext } from '../../context/AuthContext'
import { ErrorMessageType } from '../../UI/MyInput/MyInput'

// Интерфейс для данных формы авторизации
interface ISigninValues {
	login: string
	password: string
	[key: string]: string // Разрешаем дополнительные свойства
}

const timeoutMS: number = 3000 // Константа для таймаута уведомлений

export default function SignIn(): JSX.Element {
	const { setIsAuth, setAuthName } = useContext(AuthContext)
	const [isSigninError, setIsSigninError] = useState<boolean>(false)
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')

	// useEffect для тестовой настройки localStorage
	useEffect(() => {
		localStorage.setItem('admin', 'admin')
	}, [])

	// Состояние для хранения значений формы
	const [values, setValues] = useState<ISigninValues>({
		login: '',
		password: '',
	})

	// Состояние насильной ошибки
	const [forcedErrorMessage, setForcedErrorMessage] = useState<ErrorMessageType>({
		name: '',
		isError: false,
	})

	// Массив для описания полей ввода
	const inputs = [
		{
			name: 'login',
			type: 'text',
			label: 'Login',
			errorMessage: '',
		},
		{
			name: 'password',
			type: 'password',
			label: 'Password',
			errorMessage: 'Wrong password. Please, try again.',
		},
	]

	// Функция для отображения уведомления об ошибке
	function sendError(error: string): void {
		setErrorMessage(error)
		setIsSigninError(true)
		setTimeout(() => {
			setIsSigninError(false)
		}, timeoutMS)
	}

	// Функция для обработки отправки формы
	function submitForm(event: any): void {
		event.preventDefault()

		if (values.login === '' || values.password === '') {
			sendError('Some inputs are missing data')
			return
		}

		const jsonString = JSON.stringify(values)

		console.log(jsonString) // тест

		if (localStorage.getItem(values.login) == null) {
			sendError('User with the specified username / password was not found')
		} else if (localStorage.getItem(values.login) !== values.password) {
			setForcedErrorMessage({name: 'password', isError: true})
		} else {
			setIsAuth(true)
			setAuthName(localStorage.getItem(`${values.login}.name`) as string)
			localStorage.setItem('lastLogin', values.login)
			localStorage.setItem('auth', 'true')
		}
	}

	// Функция для обработки изменения значений полей ввода
	function onChange(event: any): void {
		setValues({ ...values, [event.target.name]: event.target.value })
	}

	return (
		<div className={shared.container}>
			<div className={classes.signin}>
				<p className={shared.form_title}>Sign In</p>
				<Notification isVisible={isSigninError}>{errorMessage}</Notification>
				<form noValidate autoComplete='off' action='' onSubmit={(event) => submitForm(event)}>
					{inputs.map((input) => (
						<MyInput
							key={input.label}
							{...input}
							forcedErrorMessage={forcedErrorMessage}
							errorMessage={input.errorMessage}
							value={values[input.name]}
							onChange={onChange}></MyInput>
					))}
					<MyButton isButtonDisabled={isButtonDisabled}>Sign In</MyButton>
				</form>
				<p className={shared.form_footer}>
					Not a member yet?{' '}
					<Link to='/signup' style={{ color: '#E4163A' }}>
						Sign up
					</Link>
				</p>
			</div>
			<div className={[shared.background, classes.background].join(' ')}></div>
		</div>
	)
}
