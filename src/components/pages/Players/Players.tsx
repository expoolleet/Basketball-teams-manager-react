import React, { useContext, useEffect, useState } from 'react' // Импорт React, хуков и контекстов
import classes from './Players.module.css' // Импорт стилей для Players
import Search from '../../UI/Search/Search' // Импорт компонента поиска
import AddButton from '../../UI/AddButton/AddButton' // Импорт компонента кнопки добавления
import { useLocation, useNavigate } from 'react-router-dom' // Импорт хуков для работы с роутингом
import Pagination from '../../Pagination/Pagination' // Импорт компонента пагинации
import Selector from '../../UI/Selector/Selector' // Импорт компонента выбора количества элементов на странице
import PlayerCard from '../../PlayerCard/PlayerCard' // Импорт компонента карточки игрока
import shared from '../../shared/MainPages.module.css' // Импорт общих стилей для основных страниц
import MultiSelector from '../../UI/MultiSelector/MultiSelector' // Импорт компонента мульти-выбора
import { playersList } from '../../../utils/players' // Импорт данных игроков для инициализации
import PageLoader from '../../UI/PageLoader/PageLoader' // Импорт компонента загрузчика
import NewPlayer from '../NewPlayer/NewPlayer' // Импорт компонента создания нового игрока
import { PlayerContext } from '../../context/PlayerContext' // Импорт контекста игроков
import { ITeam } from '../Teams/Teams' // Импорт интерфейса команды из Teams
import SelectedPlayer from '../SelectedPlayer/SelectedPlayer' // Импорт компонента просмотра выбранного игрока
import { SelectedPlayerContext } from '../../context/SelectedPlayerContext' // Импорт контекста выбранного игрока

export interface IPlayer {
	// интерфейс игрока
	photo: string
	name: string
	position: string
	team: string
	height_cm: string
	weight_kg: string
	birthday: string
	number: string
	[key: string]: string
}

const PLAYERS: string = 'players'

const PLAYERS_STATE: string = 'players' // константа состояния players

const SELECTED_PLAYERS_STATE: string = 'selected' // константа состояния selected

const EDIT_EXIST_PLAYER_STATE: string = 'edit' // константа состояния edit

const NEW_PLAYER_STATE: string = 'newplayer' // константа состояния newplayer

const itemsPerPage: number[] = [6, 12, 24]

export default function Players(): JSX.Element {
	const navigate = useNavigate() // Хук навигации
	const location = useLocation() // Хук поисковой строки браузера

	// currentState - текущее состояние компонента
	const [currentState, setCurrentState] = useState<string>(PLAYERS_STATE)

	// filter - строка фильтра для поиска игроков
	const [filter, setFilter] = useState<string>('')

	// playersToRender - массив игроков для отображения на текущей странице
	const [playersToRender, setPlayersToRender] = useState<IPlayer[]>([])

	// players - массив всех игроков
	const [players, setPlayers] = useState<IPlayer[]>([])

	// playersCount - общее количество игроков
	const [playersCount, setPlayersCount] = useState<number>(0)

	// totalPages - общее количество страниц (для пагинации)
	const [totalPages, setTotalPages] = useState<number>(0)

	// isLoading - флаг загрузки данных
	const [isLoading, setIsLoading] = useState<boolean>(true)

	// currentPage - текущая страница (для пагинации)
	const [currentPage, setCurrentPage] = useState<number>(0) // Изначально первая страница

	// currentAmountOfItemsPerPage - количество элементов на странице (для пагинации)
	const [currentAmountOfItemsPerPage, setCurrentAmountOfItemsPerPage] = useState<number>(itemsPerPage[0]) // Первое значение из массива itemsPerPage

	// selectedTeams - выбранные команды
	const [selectedTeams, setSelectedTeams] = useState<string[]>([])

	// editPlayer - редактируемый игрок
	const [editPlayer, setEditPlayer] = useState<IPlayer>()

	// itemOffset - смещение для пагинации
	const [itemOffset, setItemOffset] = useState<number>(0)

	// isBlur - флаг размытия
	const [isBlur, setIsBlur] = useState<boolean>(true)

	const { selectedPlayer, setSelectedPlayer } = useContext(SelectedPlayerContext)

	const [filteredPlayers, setFilteredPlayers] = useState<IPlayer[]>([])

	// Состояние списка команд
	const [teams, setTeams] = useState<string[]>([])

	// Определение состояния компонента в зависимости от текущего маршрута
	useEffect(() => {
		if (location.pathname === '/' + PLAYERS_STATE) setCurrentState(PLAYERS_STATE)
		else if (location.pathname === '/' + NEW_PLAYER_STATE) setCurrentState(NEW_PLAYER_STATE)

		// Загрузка команд из хранилища
		LoadTeams()
	}, [location])

	// Загрузка состояния выбранного игрока, если это произошло из просмотра команды
	useEffect(() => {
		if (selectedPlayer) setCurrentState(SELECTED_PLAYERS_STATE)
	}, [selectedPlayer])

	useEffect(() => {
		setIsLoading(true)
		const localPlayers = localStorage.getItem(PLAYERS) as string
		if (localPlayers) setPlayers(JSON.parse(localPlayers))
		else {
			setPlayers(playersList)
			localStorage.setItem(PLAYERS, JSON.stringify(playersList))
		}

		// Загрузка команд из хранилища
		LoadTeams()

		setIsLoading(false)
	}, [currentState]) // Зависимость от состояния, чтобы обновлять данные при переключении

	useEffect(() => {
		let currentPlayers: IPlayer[] = []

		const localPlayers = localStorage.getItem(PLAYERS) as string | null
		if (!localPlayers) return

		currentPlayers = JSON.parse(localPlayers) as IPlayer[]

		if (filter.length !== 0) {
			currentPlayers = filteredPlayers
		}

		// выборка игроков с их соответсвующей командой
		let selectedPlayers: IPlayer[] = []
		if (selectedTeams.length !== 0) {
			selectedTeams.forEach((team) =>
				currentPlayers.forEach((player) => {
					if (player.team === team) {
						selectedPlayers.push(player)
					}
				})
			)
			currentPlayers = selectedPlayers
		}

		setPlayersCount(currentPlayers.length)

		const endOffset = itemOffset + currentAmountOfItemsPerPage
		setTotalPages(Math.ceil(currentPlayers.length / currentAmountOfItemsPerPage))
		setPlayersToRender(Array.from(currentPlayers).slice(itemOffset, endOffset))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedTeams, filteredPlayers, currentState, itemOffset, currentAmountOfItemsPerPage])

	// Метод, загружающий команды из хранилища
	function LoadTeams(): void {
		const storage = localStorage.getItem('teams')
		if (storage) {
			const localTeams = JSON.parse(storage) as ITeam[]
			const teams: string[] = []
			localTeams.forEach((team) => {
				teams.push(team.name)
			})
			setTeams(teams)
		}
	}

	// Обработчик ввода текста в поле поиска
	function handleSearch(event: any): void {
		const search: string = event.target.value

		setCurrentPage(0)
		setItemOffset(0)

		let filteredPlayers: IPlayer[] = []
		const selectedPlayers: IPlayer[] = []

		selectedTeams.forEach((team) =>
			players.forEach((player) => {
				if (player.team === team) {
					selectedPlayers.push(player)
				}
			})
		)

		if (selectedPlayers.length !== 0)
			selectedPlayers.forEach((player) => {
				if (player.name.toLowerCase().includes(search.toLowerCase())) filteredPlayers.push(player)
			})
		else if (selectedTeams.length === 0)
			players.forEach((player) => {
				if (player.name.toLowerCase().includes(search.toLowerCase())) filteredPlayers.push(player)
			})

		setFilter(search)
		setFilteredPlayers(filteredPlayers)
	}

	function calculateOffset(value: number) {
		const newOffset = (value * currentAmountOfItemsPerPage) % playersCount
		setItemOffset(newOffset)
	}

	function handlePaginationClick(event: any): void {
		const selectedValue = event.selected as number
		setCurrentPage(selectedValue)
		calculateOffset(selectedValue)
	}

	function handlePlayerCardClick(name: string): void {
		playersToRender.forEach((player) => {
			if (player.name === name) {
				setSelectedPlayer(player)
				return
			}
		})
	}

	function handleItemsPerPageChange(item: any): void {
		if (Number(item) === currentAmountOfItemsPerPage) return

		setCurrentPage(0)
		setItemOffset(0)
		setCurrentAmountOfItemsPerPage(Number(item))
	}

	// Функция перехода в режим редактирования команды
	function handleEditPlayer(player: IPlayer): void {
		setEditPlayer(player)
		setCurrentState(EDIT_EXIST_PLAYER_STATE)
	}

	// Функция удаления команды
	function handleDeletePlayer(team: ITeam): void {
		const updatedPlayersList = players.filter((p) => p.name !== team.name)
		setPlayers(updatedPlayersList)
		localStorage.setItem(PLAYERS, JSON.stringify(updatedPlayersList))

		if (updatedPlayersList.length === currentAmountOfItemsPerPage) {
			setCurrentPage(currentPage > 0 ? currentPage - 1 : 0)
			calculateOffset(currentPage > 0 ? currentPage - 1 : 0)
		}

		if (filteredPlayers.length !== 0) {
			setCurrentPage(0)
			setItemOffset(0)
			setFilter('')
		}
		setPlayersCount(updatedPlayersList.length)
		navigate('/players')
	}

	function handleTeamsChange(item: any): void {
		setSelectedTeams([...selectedTeams, item])
	}

	const searchInput = {
		type: 'text',
		placeholder: 'Search...',
	}

	// Отображение компонента загрузчика, пока данные не загружены
	if (isLoading) {
		return <PageLoader />
	}

	function getState(currentState: string): JSX.Element {
		switch (currentState) {
			case PLAYERS_STATE:
				return (
					<div
						className={shared.container}
						onClick={() => {
							setIsBlur(true)
						}}>
						<div className={shared.header}>
							<Search {...searchInput} onChange={handleSearch} value={filter} />
							<MultiSelector
								items={teams}
								selectedItems={selectedTeams}
								setSelectedPositions={setSelectedTeams}
								onChahgedSelectorItems={handleTeamsChange}
							/>
							<AddButton
								onClick={() => {
									navigate('/newplayer')
								}}
							/>
						</div>
						<div className={shared.cards}>
							{playersToRender.length === 0 ? (
								<div className={shared.empty}>
									<div
										className={[
											classes.background,
											shared.background,
										].join(' ')}
									/>
									<div className={shared.text}>
										<h1>Empty here</h1>

										{filter.length === 0 &&
										selectedTeams.length === 0 ? (
											<h3>Add new players to continue</h3>
										) : (
											<h3>Search got no results</h3>
										)}
									</div>
								</div>
							) : (
								playersToRender.map((player) => (
									<PlayerCard
										key={player.name}
										photo={player.photo}
										name={player.name}
										number={player.number}
										team={player.team}
										onClick={handlePlayerCardClick}
									/>
								))
							)}
						</div>

						<div className={shared.footer}>
							<Pagination
								totalPages={totalPages}
								onPageChange={handlePaginationClick}
								currentPage={currentPage}
							/>
							<Selector
								items={itemsPerPage}
								selectedItem={currentAmountOfItemsPerPage}
								onChange={handleItemsPerPageChange}
								isBlur={isBlur}
								setIsBlur={setIsBlur}
							/>
						</div>
					</div>
				)
			case NEW_PLAYER_STATE:
				return <NewPlayer isEditPlayer={false} />
			case EDIT_EXIST_PLAYER_STATE:
				return <NewPlayer editPlayer={editPlayer} isEditPlayer={true} />
			case SELECTED_PLAYERS_STATE:
				return (
					<SelectedPlayer
						selectedPlayer={selectedPlayer}
						deletePlayer={handleDeletePlayer}
						editPlayer={handleEditPlayer}
					/>
				)
			default:
				return <></>
		}
	}

	return (
		<PlayerContext.Provider
			value={{
				players,
				setPlayers,
				teams,
			}}>
			{getState(currentState)}
		</PlayerContext.Provider>
	)
}
