import React, { useContext, useState } from 'react'
import classes from './SignUp.module.css'
import shared from '../../shared/Form.module.css'
import MyInput from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import { Link } from 'react-router-dom'
import MyCheckbox from '../../UI/MyCheckbox/MyCheckbox'
import Notification from '../../Notification/Notification'
import { AuthContext } from '../../context/AuthContext'


// Интерфейс для данных формы регистрации
interface ISignUpValues {
	name: string
	login: string
	password: string
	confirmPassword: string
	[key: string]: string // Разрешение дополнительных свойств
}

const timeoutMS: number = 3000

export default function SignUp(): JSX.Element {
	const [isSignupError, setIsSignupError] = useState<boolean>(false)
	const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [isChecked, setIsChecked] = useState<boolean>(false)
	const [isCheckBoxError, setIsCheckBoxError] = useState<boolean>(false)
	// Подключение к контексту AuthContext
	const { setIsAuth, setAuthName } = useContext(AuthContext)

	// Состояние для хранения значений формы
	const [values, setValues] = useState<ISignUpValues>({
		name: '',
		login: '',
		password: '',
		confirmPassword: '',
	})

	// Описание полей ввода для формы
	const inputs = [
		{
			type: 'text',
			name: 'name',
			label: 'Name',
			errorMessage: 'Name should be 3-16 characters without any special symbol.',
			pattern: `^[A-Za-z0-9 ]{3,16}$`,
		},
		{
			type: 'text',
			name: 'login',
			label: 'Login',
			errorMessage: 'Login should be 3-16 characters without any special symbol.',
			pattern: `^[A-Za-z0-9]{3,16}$`,
		},
		{
			type: 'password',
			name: 'password',
			label: 'Password',
			errorMessage: 'Password should be 8 characters at least.',
			pattern: `[A-Za-z0-9]{8,99}$`,
		},
		{
			type: 'password',
			name: 'confirmPassword',
			label: 'Enter your password again',
			errorMessage: "Passwords don't match.",
			pattern: values.password,
		},
	]

	// Функция для обработки отправки формы
	function submitForm(event: any): void {
		event.preventDefault()

		if ((values.name === '' || values.login === '' || values.password === '' || values.confirmPassword === ''))
		{
			sendError('Some inputs are missing data')
			return
		}


		if (localStorage.getItem(values.login))
		{
			sendError('This login is unavailable')
			return
		}

		if (!isChecked) {
			if (isSignupError) return

			setIsCheckBoxError(true)
			return
		}

		const jsonString = JSON.stringify(values) // Converting SignUpValues to JSON data

		console.log(jsonString) // testing

		localStorage.setItem(values.login, values.password)
		localStorage.setItem(`${values.login}.name`, values.name)
		localStorage.setItem('auth', 'true')
		localStorage.setItem('lastLogin', values.login)
		setIsAuth(true)
		setAuthName(values.name)

	}

	function sendError(error: string) : void {
		setErrorMessage(error)
		setIsSignupError(true)
		setTimeout(() => {	
			setIsSignupError(false)
		}, timeoutMS)
	}

  	// Функция для обработки изменения значений полей ввода
	function onChangeInput(event: any): void {
		setValues({ ...values, [event.target.name]: event.target.value })
	}

	return (
		<div className={shared.container}>
			<div className={classes.signup}>
				<p className={shared.form_title}>Sign Up</p>
				<Notification isVisible={isSignupError}>{errorMessage}</Notification>
				<form autoComplete='off' onSubmit={(event) => submitForm(event)}>
					{inputs.map((input) => (
						<MyInput
							key={input.label}
							{...input}
							errorMessage={input.errorMessage}
							value={values[input.name]}
							onChange={onChangeInput}
						/>
					))}
					<MyCheckbox isChecked={isChecked} setIsChecked={setIsChecked} isErrorMessageForced={isCheckBoxError}  errorMessage='You must be accept the agreement.'>
						I accept the agreement
					</MyCheckbox>
					<MyButton isButtonDisabled={isButtonDisabled}>Sign Up</MyButton>
				</form>
				<p className={shared.form_footer}>
					Already a member?{' '}
					<Link to='/signin' style={{ color: '#E4163A' }}>
						Sign in
					</Link>
				</p>
			</div>
			<div className={[shared.background, classes.background].join(' ')}></div>
		</div>
	)
}
