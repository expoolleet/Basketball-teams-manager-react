// Импорт необходимых компонентов из React
import React, { useContext, useEffect, useRef, useState } from 'react'

// Импорт стилей из файла NewTeam.module.css
import classes from './NewPlayer.module.css'

// Импорт компонентов из других модулей
import { Link, useNavigate } from 'react-router-dom'
import MyInput, { SELECT_TYPE } from '../../UI/MyInput/MyInput'
import MyButton from '../../UI/MyButton/MyButton'
import PhotoInput from '../../UI/PhotoInput/PhotoInput'
import Notification from '../../Notification/Notification'
import shared from '../../shared/AdditionalPages.module.css'
import { IPlayer } from '../Players/Players'
import { PlayerContext } from '../../context/PlayerContext'
import { SELECTOR_INPUT_TYPE } from '../../UI/Selector/Selector'
import { ErrorMessageType } from '../../UI/MyInput/MyInput'

// Константа для таймаута уведомления
const timeoutMS: number = 3000

// Интерфейс для описания свойств компонента NewPlayer
interface INewPlayerProps {
	editPlayer: IPlayer // Редактируемый игрок (если режим редактирования)
	isEditPlayer: boolean // Флаг режима редактирования
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

// Функциональный компонент NewPlayer
export default function NewPlayer(props: any) {
	// Деструктуризация параметров props
	const { editPlayer, isEditPlayer }: INewPlayerProps = props

	// Хук useNavigate для перехода по маршрутам
	const navigate = useNavigate()

	// Получение команд и функции для их обновления из контекста PlayerContext
	const { players, setPlayers, teams } = useContext(PlayerContext)

	// Ссылка на элемент для загрузки изображения команды
	const uploadRef = useRef<HTMLInputElement>(null)

	// Состояния для управления изображением игрока
	const [photo, setPhoto] = useState<any>()
	const [photoUrl, setPhotoUrl] = useState<string>('')

	// Состояния для управления уведомлением
	const [isNotificationVisible, setIsNotificationVisible] = useState<boolean>(false)
	const [notificationMessage, setNotificationMessage] = useState<string>('')
	const [notificationType, setNotificationType] = useState<string>('')

	// Состояния для сохранения выбранных элементов селекторов
	const [selectedPosition, setSelectedPosition] = useState<string>('')
	const [selectedTeam, setSelectedTeam] = useState<string>('')

	// Состояние насильной ошибки
	const [forcedErrorMessage, setForcedErrorMessage] = useState<ErrorMessageType>({
		name: '',
		isError: false,
	})

	// Состояние расфокуса селектора
	const [isBlur, setIsBlur] = useState<boolean>(true)

	// Состояние для хранения данных игрока
	const [values, setValues] = useState<IPlayer>(
		isEditPlayer
			? editPlayer // Данные редактируемого игрока
			: {
					photo: '/photos/placeholder.png',
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
		if (isEditPlayer) {
			setSelectedTeam(editPlayer.team)
			setSelectedPosition(editPlayer.position)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditPlayer])

	// Описание полей формы для создания/редактирования команды
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
		values['position'] = position
	}

	function handleTeamSelector(team: string): void {
		setSelectedTeam(team)
		values['team'] = team
	}

	function openPhoto(event: any): void {
		setPhoto(event.target.files[0])
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
	function onFormSumbit(event: any): void {
		event.preventDefault()

		console.log(values)

		// Проверка заполненности полей
		for (const key in values) {
			if (values[key] === '') {
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

		// Подготовка нового списка команд
		let newPlayersList: IPlayer[] = []
		const newValues = {
			photo: values.photo,
			name: values.name,
			position: values.position,
			team: values.team,
			height_cm: values.height_cm,
			weight_kg: values.weight_kg,
			birthday: values.birthday,
			number: String(Number(values.number)),
		}

		// Редактирование существующего игрока
		if (isEditPlayer) {
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
				photo: '/photos/placeholder.png',
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
		}

		inputsFirstPart.forEach((input) => {
			setForcedErrorMessage({ name: input.name, isError: false })
		})
		inputsSecondPart.forEach((input) => {
			setForcedErrorMessage({ name: input.name, isError: false })
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
				<PhotoInput uploadRef={uploadRef} openPhoto={openPhoto} background={photoUrl} />
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
