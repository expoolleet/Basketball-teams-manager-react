import React, { useContext, useEffect, useRef, useState } from 'react'
import classes from './NewPlayer.module.css'
import { Link, useNavigate } from 'react-router-dom'
import MyInput, { SELECT_TYPE } from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import ImageInput from '../../UI/ImageInput/ImageInput'
import Notification from '../../Notification/Notification'
import shared from '../../shared/AdditionalPages.module.css'
import { IPlayer } from '../Players/Players'
import { PlayerContext } from '../../context/PlayerContext'
import { SELECTOR_INPUT_TYPE } from '../../UI/Selector/Selector'
import { ErrorMessageType } from '../../UI/MyInput/MyInput'
import axios from 'axios'
import { requestURL } from '../../../utils/requestURL'

const timeoutMS: number = 3000

interface INewPlayerProps {
	editPlayer: IPlayer
	isEditPlayer: boolean
	setEditPlayer(player: IPlayer): any
}

export type SelectPropsType = {
	items: string[]
	selectedItem: string
	onChange(item: string): any
	type: string
	isBlur: boolean
	setIsBlur(flag: boolean): any
}

const positions: string[] = ['Center Forward', 'Guard Forward', 'Forward', 'Center', 'Guard', 'Forward-Center']

export default function NewPlayer(props: any): React.ReactElement {
	const { setEditPlayer, editPlayer, isEditPlayer }: INewPlayerProps = props

	const navigate = useNavigate()

	const { players, setPlayers, teams } = useContext(PlayerContext)

	const [photoRaw, setPhotoRaw] = useState<any>()

	const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false)

	const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false)
	const [notificationMessage, setNotificationMessage] = useState<string>('')
	const [notificationType, setNotificationType] = useState<string>('')

	const [inputImageBackround, setInputImageBackround] = useState<string>()

	const [selectedPosition, setSelectedPosition] = useState<string>('')
	const [selectedTeam, setSelectedTeam] = useState<string>('')

	const [forcedErrorMessage, setForcedErrorMessage] = useState<ErrorMessageType>({
		name: '',
		isError: false,
	})

	const [isBlur, setIsBlur] = useState<boolean>(true)

	const placeholder: string = '/photos/placeholder.png'

	const [values, setValues] = useState<IPlayer>(
		isEditPlayer
			? editPlayer // Данные редактируемого игрока
			: {
					photo: '',
					name: '',
					position: '',
					team: '',
					height_cm: '',
					weight_kg: '',
					birthday: '',
					number: '',
			  }
	)

	useEffect(() => {
		if (editPlayer) {
			setSelectedTeam(editPlayer.team)
			setSelectedPosition(editPlayer.position)
			setInputImageBackround(editPlayer.photo)
		}
	}, [editPlayer])

	console.log(editPlayer)

	const inputsFirstPart = [
		{
			type: 'text',
			name: 'name',
			label: 'Name',
			errorMessage: 'Name should be 3-30 characters without any special symbol',
			pattern: `^[A-Za-z .]{3,30}$`,
		},
		{
			type: 'select',
			selectProps: {
				items: positions,
				selectedItem: selectedPosition,
				onChange: handlePositionSelector,
				type: SELECTOR_INPUT_TYPE,
				isBlur,
				setIsBlur,
			} as SelectPropsType,
			name: 'position',
			label: 'Position',
		},
		{
			type: 'select',
			selectProps: {
				items: teams,
				selectedItem: selectedTeam,
				onChange: handleTeamSelector,
				type: SELECTOR_INPUT_TYPE,
				isBlur,
				setIsBlur,
			} as SelectPropsType,
			name: 'Team',
			label: 'Team',
		},
	]

	const inputsSecondPart = [
		{
			type: 'number',
			name: 'height_cm',
			label: 'Height (cm)',
			value: 0,
			errorMessage: 'Enter valid height in cm',
		},
		{
			type: 'number',
			name: 'weight_kg',
			label: 'Weight (kg)',
			value: 0,
			errorMessage: 'Enter valid weight in kg',
		},
		{
			type: 'date',
			name: 'birthday',
			label: 'Birhday',
		},
		{
			type: 'number',
			name: 'number',
			label: 'Number',
			value: 0,
			errorMessage: 'Enter valid number between 1 and 99',
		},
	]

	function handlePositionSelector(position: string): void {
		setSelectedPosition(position)
		setValues({...values, 'position' : position})
	}

	function handleTeamSelector(team: string): void {
		setSelectedTeam(team)
		setValues({...values, 'team' : team})
	}

	function openPhoto(photo: any): void {
		setPhotoRaw(photo)

		setIsPhotoUploaded(true)

		const photoUrl = URL.createObjectURL(photo)

		setInputImageBackround(photoUrl)
	}

	function sendNotification(message: string, type: string): void {
		setNotificationMessage(message)
		setNotificationType(type)
		setIsNotificationVisible(true)
		setTimeout(() => {
			setIsNotificationVisible(false)
		}, timeoutMS)
	}

	// Функция-обработчик submit формы создания/редактирования игрока
	async function onFormSumbit(event: any): Promise<void> {
		event.preventDefault()

		// Проверка заполненности полей
		for (const key in values) {
			if (values[key] === '' && key !== 'photo') {
				sendNotification('Some inputs are missing data', 'error')
				return
			}
		}

		// Проверка на редактирование существующего игрока
		if (!isEditPlayer) {
			// Проверка существования игрока при добавлении нового
			const isPlayerExisting = players.find((player) => player.name.toLowerCase() === values.name.toLowerCase())
			if (isPlayerExisting) {
				sendNotification('Current player already exists', 'error')
				return
			}
		}

		// Проверка инпутов на подлиность данных
		if (Number(values.height_cm) < 0 || Number(values.height_cm) > 999) {
			setForcedErrorMessage({ name: 'height_cm', isError: true })
			return
		} else if (Number(values.weight_kg) < 0 || Number(values.weight_kg) > 999) {
			setForcedErrorMessage({ name: 'weight_kg', isError: true })
			return
		} else if (Number(values.number) < 1 || Number(values.number) > 99) {
			setForcedErrorMessage({ name: 'number', isError: true })
			return
		}

		const formData = new FormData()

		formData.append('image', photoRaw)

		// удаление предыдущей фотографии, если произошла замена на другую при редактировании игрока
		if (isEditPlayer && photoRaw && editPlayer.photo.includes('uploads')) {
			await axios.delete(editPlayer.photo).catch((error) => console.error(error))
		}

		// отправка пост запроса для загрузки фотографии
		await axios
			.post(requestURL + '/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			.then((res): any => {
				if (res.data.path) values.photo = requestURL + '/' + res.data.path
				else if (!isEditPlayer) values.photo = placeholder

				let newPlayersList: IPlayer[] = []

				const newValues: IPlayer = {
					photo: values.photo,
					name: values.name,
					position: values.position,
					team: values.team,
					height_cm: values.height_cm,
					weight_kg: values.weight_kg,
					birthday: values.birthday,
					number: String(Number(values.number)),
				}

				console.log(newValues)
				console.log(editPlayer)

				// Редактирование существующего игрока
				if (isEditPlayer) {
					let hasChanges: boolean = false
					for (const key in values) {
						if (newValues[key] !== editPlayer[key]) {
							hasChanges = true
							break
						}
					}

					if (!hasChanges && !isPhotoUploaded) return
					setEditPlayer(newValues)

					const player = players.find((p) => p.name === editPlayer.name) as IPlayer
					const index = players.indexOf(player)

					newPlayersList = players
					newPlayersList[index] = newValues
				} else {
					// Добавление нового игрока
					newPlayersList = [...players, newValues]
				}

				// Обновление контекста игрока и localStorage
				setPlayers(newPlayersList)
				localStorage.setItem('players', JSON.stringify(newPlayersList))

				// Отображение уведомления об успехе
				if (isEditPlayer) sendNotification('Your player has been edited successfully', 'success')
				else {
					sendNotification('Your player has been added successfully', 'success')
					setValues({
						photo: '',
						name: '',
						position: '',
						team: '',
						height_cm: '',
						weight_kg: '',
						birthday: '',
						number: '',
					})
					setSelectedTeam('')
					setSelectedPosition('')
					setPhotoRaw('')
					setInputImageBackround('')
				}

				inputsFirstPart.forEach((input) => {
					setForcedErrorMessage({ name: input.name, isError: false })
				})
				inputsSecondPart.forEach((input) => {
					setForcedErrorMessage({ name: input.name, isError: false })
				})
			})
	}

	// Функция-обработчик изменения значений полей формы
	function onChangeInput(event: any): void {
		setValues({ ...values, [event.target.name]: event.target.value })
	}

	return (
		<div
			className={[classes.container, shared.container].join(' ')}
			onClick={() => {
				setIsBlur(true)
			}}>
			<div className={shared.header}>
				<div>
					<span>
						<Link to='/'>Players</Link>
					</span>{' '}
					<span>
						<Link to='/newplayer'>
							{isEditPlayer ? `Edit ${editPlayer.name}` : 'Add new player'}
						</Link>
					</span>
				</div>
			</div>
			<form onSubmit={onFormSumbit}>
				<Notification type={notificationType} isVisible={isNotificationVisible}>
					{notificationMessage}
				</Notification>
				<ImageInput saveImage={openPhoto} backgroundImage={inputImageBackround} />
				<div className={classes.inputs}>
					{inputsFirstPart.map((input) => (
						<MyInput
							key={input.name}
							{...input}
							forcedErrorMessage={forcedErrorMessage}
							selectProps={input.type === SELECT_TYPE ? input.selectProps : {}}
							errorMessage={input.errorMessage}
							value={values[input.name]}
							onChange={onChangeInput}
						/>
					))}
					<div className={classes.short_inputs}>
						{inputsSecondPart.map((input) => (
							<MyInput
								key={input.name}
								{...input}
								forcedErrorMessage={forcedErrorMessage}
								errorMessage={input.errorMessage}
								value={values[input.name]}
								onChange={onChangeInput}
							/>
						))}
					</div>

					<div className={classes.buttons}>
						<MyButton
							onClick={() => {
								navigate('/players')
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
