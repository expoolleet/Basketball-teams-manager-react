import React, { useContext, useEffect, useState } from 'react'
import classes from './Players.module.css'
import Search from '../../UI/Search/Search'
import AddButton from '../../UI/AddButton/AddButton'
import { useLocation, useNavigate } from 'react-router-dom'
import Pagination from '../../Pagination/Pagination'
import Selector from '../../UI/Selector/Selector'
import PlayerCard from '../../PlayerCard/PlayerCard'
import shared from '../../shared/MainPages.module.css'
import MultiSelector from '../../UI/MultiSelector/MultiSelector'
import { playersList } from '../../../utils/players'
import PageLoader from '../../UI/PageLoader/PageLoader'
import NewPlayer from '../NewPlayer/NewPlayer'
import { PlayerContext } from '../../context/PlayerContext'
import { ITeam } from '../Teams/Teams'
import SelectedPlayer from '../SelectedPlayer/SelectedPlayer'
import { SelectedPlayerContext } from '../../context/SelectedPlayerContext'
import axios from 'axios'

export interface IPlayer {
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

const PLAYERS_STATE: string = 'players'

const SELECTED_PLAYERS_STATE: string = 'selected'

const EDIT_EXIST_PLAYER_STATE: string = 'edit'

const NEW_PLAYER_STATE: string = 'newplayer'

const itemsPerPage: number[] = [6, 12, 24]

export default function Players(): React.ReactElement {
	const navigate = useNavigate()
	const location = useLocation()

	const [currentState, setCurrentState] = useState<string>(PLAYERS_STATE)

	const [filter, setFilter] = useState<string>('')

	const [playersToRender, setPlayersToRender] = useState<IPlayer[]>([])

	const [players, setPlayers] = useState<IPlayer[]>([])

	const [playersCount, setPlayersCount] = useState<number>(0)

	const [totalPages, setTotalPages] = useState<number>(0)

	const [isLoading, setIsLoading] = useState<boolean>(true)

	const [currentPage, setCurrentPage] = useState<number>(0)

	const [currentAmountOfItemsPerPage, setCurrentAmountOfItemsPerPage] = useState<number>(itemsPerPage[0])

	const [selectedTeams, setSelectedTeams] = useState<string[]>([])

	const [editPlayer, setEditPlayer] = useState<IPlayer>()

	const [itemOffset, setItemOffset] = useState<number>(0)

	const [isBlur, setIsBlur] = useState<boolean>(true)

	const { selectedPlayer, setSelectedPlayer } = useContext(SelectedPlayerContext)

	const [filteredPlayers, setFilteredPlayers] = useState<IPlayer[]>([])

	const [teams, setTeams] = useState<string[]>([])

	useEffect(() => {
		if (location.pathname === '/' + PLAYERS_STATE) setCurrentState(PLAYERS_STATE)
		else if (location.pathname === '/' + NEW_PLAYER_STATE) setCurrentState(NEW_PLAYER_STATE)

		loadTeams()
	}, [location])

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
		loadTeams()
		setIsLoading(false)
	}, [currentState])

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
	function loadTeams(): void {
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

	function handleEditPlayer(player: IPlayer): void {
		setEditPlayer(player)
		setCurrentState(EDIT_EXIST_PLAYER_STATE)
	}

	async function handleDeletePlayer(player: IPlayer): Promise<void> {
		if (player.photo.includes('uploads'))
			await axios
			.delete(player.photo)
			.catch((error) => console.error(error))

		const updatedPlayersList = players.filter((p) => p.name !== player.name)
		setPlayers(updatedPlayersList)
		localStorage.setItem(PLAYERS, JSON.stringify(updatedPlayersList))

		if (updatedPlayersList.length % currentAmountOfItemsPerPage === 0) {
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

	if (isLoading) {
		return <PageLoader />
	}

	function getState(currentState: string): React.ReactElement {
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
				return <NewPlayer editPlayer={editPlayer} isEditPlayer={true} setEditPlayer={setEditPlayer} />
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
