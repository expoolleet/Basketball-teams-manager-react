import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './NewTeam.module.css'
import { Link, useNavigate } from 'react-router-dom'
import MyInput from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import ImageInput from '../../UI/ImageInput/ImageInput'
import { ITeam } from '../Teams/Teams'
import { TeamContext } from '../../context/TeamContext'
import Notification from '../../Notification/Notification'
import shared from '../../shared/AdditionalPages.module.css'
import { ErrorMessageType } from '../../UI/MyInput/MyInput'
import axios from 'axios'

const timeoutMS: number = 3000

const currentYear = new Date().getFullYear()

interface INewTeamProps {
	editTeam: ITeam
	isEditTeam: boolean
	setEditTeam(team: ITeam): any
}

export default function NewTeam(props: any): React.ReactElement {
	const { setEditTeam, editTeam, isEditTeam }: INewTeamProps = props

	const navigate = useNavigate()

	const { teams, setTeams } = useContext(TeamContext)

	const [logoRaw, setLogoRaw] = useState<any>()

	const [inputImageBackround, setInputImageBackround] = useState<string>()

	const placeholder: string = '/portraits/team-placeholder.png'

	const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false)
	const [notificationMessage, setNotificationMessage] = useState<string>('')
	const [notificationType, setNotificationType] = useState<string>('')

	const [forcedErrorMessage, setForcedErrorMessage] = useState<ErrorMessageType>({
		name: '',
		isError: false,
	})

	useEffect(() => {
		if (editTeam) setInputImageBackround(editTeam.logo)
	}, [editTeam])

	const [values, setValues] = useState<ITeam>(
		isEditTeam
			? editTeam
			: {
					logo: '',
					name: '',
					division: '',
					conference: '',
					year: '',
			  }
	)

	const inputs = [
		{
			type: 'text',
			name: 'name',
			label: 'Name',
			errorMessage: 'Name should be 3-30 characters without any special symbol',
			pattern: `^[A-Za-z0-9 ]{3,30}$`,
		},
		{
			type: 'text',
			name: 'division',
			label: 'Division',
			errorMessage: 'Division should be 3-30 characters without any special symbol',
			pattern: `^[A-Za-z0-9 ]{3,30}$`,
		},
		{
			type: 'text',
			name: 'conference',
			label: 'Conference',
			errorMessage: 'Conference should be 3-30 characters without any special symbol',
			pattern: `^[A-Za-z0-9 ]{3,30}$`,
		},
		{
			type: 'number',
			name: 'year',
			label: 'Year of foundation',
			errorMessage: `Please enter year between 1900 and ${currentYear}`,
			placeholder: `${currentYear}`,
		},
	]

	function openLogo(logo: any): void {
		setLogoRaw(logo)

		const logoUrl = URL.createObjectURL(logo)

		setInputImageBackround(logoUrl)
	}

	function sendNotification(message: string, type: string): void {
		setNotificationMessage(message)
		setNotificationType(type)
		setIsNotificationVisible(true)
		setTimeout(() => {
			setIsNotificationVisible(false)
		}, timeoutMS)
	}

	// Функция-обработчик submit формы создания/редактирования команды
	async function onFormSumbit(event: any): Promise<void> {
		event.preventDefault()

		// Проверка заполненности полей
		for (const key in values) {
			if (values[key] === '' && key !== 'logo') {
				sendNotification('Some inputs are missing data', 'error')
				return
			}
		}

		// Проверка на редактирование существующей команды
		if (!isEditTeam) {
			// Проверка существования команды при добавлении новой
			const isTeamExisting = teams.find((team) => team.name.toLowerCase() === values.name.toLowerCase())
			if (isTeamExisting) {
				sendNotification('Current team already exists', 'error')
				return
			}
		}

		// Проверка валидности года основания
		if (Number(values.year) < 1900 || Number(values.year) > currentYear) {
			setForcedErrorMessage({ name: 'year', isError: true })
			return
		}

		const formData = new FormData()

		formData.append('image', logoRaw)

		// удаление предыдущего логотипа, если произошла замена на другой при редактировании команды
		if (isEditTeam && logoRaw) {
			await axios.post('http://localhost:3001/delete', JSON.stringify({ imagePath: editTeam.logo }), {
				headers: {
					'Content-Type': 'application/json',
				},
			})
		}
		// отправка пост запроса для загрузки логотипа
		await axios
			.post('http://localhost:3001/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res): any => {
				if (res.data.path) values.logo = 'http://localhost:3001/' + res.data.path
				else if (!isEditTeam) values.logo = placeholder

				let newTeamsList: ITeam[] = []

				const newValues: ITeam = {
					logo: values.logo,
					name: values.name,
					division: values.division,
					conference: values.conference,
					year: values.year,
				}
				// Редактирование существующей команды
				if (isEditTeam) {
					setEditTeam(newValues)

					let hasChanges: boolean = false
					for (const key in values) {
						if (newValues[key] !== editTeam[key]) {
							hasChanges = true
							break
						}
					}
					if (!hasChanges) return

					const team = teams.find((t) => t.name === editTeam.name) as ITeam
					const index = teams.indexOf(team)

					newTeamsList = teams
					newTeamsList[index] = newValues
				} else {
					// Добавление новой команды
					newTeamsList = [...teams, newValues]
				}

				// Обновление контекста команд и localStorage
				setTeams(newTeamsList)
				localStorage.setItem('teams', JSON.stringify(newTeamsList))

				if (isEditTeam) sendNotification('Your team has been edited successfully', 'success')
				else {
					sendNotification('Your team has been added successfully', 'success')
					setValues({
						logo: '',
						name: '',
						division: '',
						conference: '',
						year: '',
					})
					setLogoRaw('')
				}

				// скрытие ошибок для инпутов после успешной отправки формы
				inputs.forEach((input) => {
					setForcedErrorMessage({ name: input.name, isError: false })
				})
			})
	}

	// Функция-обработчик изменения значений полей формы
	function onChangeInput(event: any): void {
		setValues({ ...values, [event.target.name]: event.target.value })
	}

	return (
		<div className={[classes.container, shared.container].join(' ')}>
			<div className={shared.header}>
				<div>
					<span>
						<Link to='/'>Teams</Link>
					</span>{' '}
					<span>
						<Link to='/newteam'>{isEditTeam ? `Edit ${editTeam.name}` : 'Add new team'}</Link>
					</span>
				</div>
			</div>
			<form onSubmit={onFormSumbit}>
				<Notification type={notificationType} isVisible={isNotificationVisible}>
					{notificationMessage}
				</Notification>
				<ImageInput saveImage={openLogo} backgroundImage={inputImageBackround} />
				<div className={classes.inputs}>
					{inputs.map((input) => (
						<MyInput
							key={input.name}
							{...input}
							forcedErrorMessage={forcedErrorMessage}
							errorMessage={input.errorMessage}
							value={values[input.name]}
							onChange={onChangeInput}
						/>
					))}
					<div className={classes.buttons}>
						<MyButton
							onClick={() => {
								navigate('/')
							}}
							type='button'
							styleType='gray'>
							Cancel
						</MyButton>
						<MyButton>Save</MyButton>
					</div>
				</div>
			</form>
		</div>
	)
}
