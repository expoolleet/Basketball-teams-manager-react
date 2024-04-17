import React, { useState, useEffect } from 'react'
import classes from './Teams.module.css'
import Search from '../../UI/Search/Search'
import AddButton from '../../UI/AddButton/AddButton'
import Pagination from '../../Pagination/Pagination'
import Selector from '../../UI/Selector/Selector'
import TeamCard from '../../TeamCard/TeamCard'
import PageLoader from '../../UI/PageLoader/PageLoader'
import { useLocation, useNavigate } from 'react-router-dom'
import { TeamContext } from '../../context/TeamContext'
import { teamsList } from '../../../utils/teams'
import NewTeam from '../NewTeam/NewTeam'
import SelectedTeam from '../SelectedTeam/SelectedTeam'
import shared from '../../shared/MainPages.module.css'

const TEAMS = 'teams' // Ключ для команд в localStorage
const TEAMS_STATE: string = 'teams' // Состояние отображения списка команд
const SELECTED_TEAM_STATE: string = 'selected' // Состояние просмотра выбранной команды
const NEW_TEAM_STATE: string = 'newteam' // Состояние создания новой команды
const EDIT_EXIST_TEAM_STATE: string = 'edit' // Состояние редактирования существующей команды

// Интерфейс для описания структуры данных команды
export interface ITeam {
	logo: string
	division: string
	conference: string
	name: string
	year: string
	[key: string]: string
}

const itemsPerPage: number[] = [6, 12, 24]

export default function Teams(): JSX.Element {
	const navigate = useNavigate()
	const location = useLocation()

	const [currentState, setCurrentState] = useState<string>(TEAMS_STATE)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [currentAmountOfItemsPerPage, setCurrentAmountOfItemsPerPage] = useState<number>(itemsPerPage[0])
	const [teamsToRender, setTeamsToRender] = useState<ITeam[]>([])
	const [filteredTeams, setFilteredTeams] = useState<ITeam[]>([])
	const [filter, setFilter] = useState<string>('')
	const [itemOffset, setItemOffset] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [editTeam, setEditTeam] = useState<ITeam>()
	const [selectedTeam, setSelectedTeam] = useState<ITeam>({
		logo: '',
		division: '',
		conference: '',
		name: '',
		year: '',
	})
	const [teams, setTeams] = useState<ITeam[]>([])
	const [teamsCount, setTeamsCount] = useState<number>(0)

	const [isBlur, setIsBlur] = useState<boolean>(true)

	useEffect(() => {
		setIsLoading(true)
		const localTeams = localStorage.getItem(TEAMS) as string
		if (localTeams) setTeams(JSON.parse(localTeams))
		else {
			setTeams(teamsList)
			localStorage.setItem(TEAMS, JSON.stringify(teamsList))
		}
		setIsLoading(false)
	}, [currentState]) // Зависимость от состояния, чтобы обновлять данные при переключении

	// Определение состояния компонента в зависимости от текущего маршрута
	useEffect(() => {
		if (location.pathname === '/') setCurrentState(TEAMS_STATE)
		else if (location.pathname === '/' + NEW_TEAM_STATE) setCurrentState(NEW_TEAM_STATE)
	}, [location])

	useEffect(() => {
		let currentTeams: ITeam[] = []

		if (filter.length !== 0) {
			currentTeams = filteredTeams
		} else {
			const localTeams = localStorage.getItem(TEAMS) as string | null
			if (!localTeams) return

			currentTeams = JSON.parse(localTeams) as ITeam[]
		}

		setTeamsCount(currentTeams.length) // Общее количество команд

		const endOffset = itemOffset + currentAmountOfItemsPerPage // конечный офсет для отрисовки карточек на странице
		setTotalPages(Math.ceil(currentTeams.length / currentAmountOfItemsPerPage)) // количество страниц
		setTeamsToRender(Array.from(currentTeams).slice(itemOffset, endOffset)) // нужное количество элментов для отрисовки
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filteredTeams, currentState, itemOffset, currentAmountOfItemsPerPage])

	// Конфигурация для компонента поиска
	const searchInput = {
		type: 'text',
		placeholder: 'Search...',
	}

	// Функция для расчета смещения при переключении страниц
	function calculateOffset(value: number) {
		const newOffset = (value * currentAmountOfItemsPerPage) % teamsCount
		setItemOffset(newOffset)
	}

	// Обработчик события переключения страницы
	function handlePaginationClick(event: any): void {
		const selectedValue = event.selected as number
		setCurrentPage(selectedValue)
		calculateOffset(selectedValue)
	}

	// Обработчик события выбора количества элементов на странице
	function handleSelectorItemsChange(item: any): void {
		if (Number(item) === currentAmountOfItemsPerPage) return

		setCurrentPage(0)
		setItemOffset(0)
		setCurrentAmountOfItemsPerPage(Number(item))
	}

	// Обработчик ввода текста в поле поиска
	function handleSearch(event: any): void {
		const search: string = event.target.value

		setCurrentPage(0)
		setItemOffset(0)
		const filteredTeams: ITeam[] = []
		teams.forEach((team) => {
			if (team.name.toLowerCase().includes(search.toLowerCase())) filteredTeams.push(team)
		})

		setFilter(search)
		setFilteredTeams(filteredTeams)
	}

	// Обработчик клика по карточке команды
	function handleTeamCardClick(name: string): void {
		teamsToRender.forEach((team) => {
			if (team.name === name) {
				setCurrentState(SELECTED_TEAM_STATE)
				setSelectedTeam(team)
				return
			}
		})
	}

	// Функция удаления команды
	function handleDeleteTeam(team: ITeam): void {
		const updatedTeamsList = teams.filter((t) => t.name !== team.name)
		setTeams(updatedTeamsList)
		localStorage.setItem(TEAMS, JSON.stringify(updatedTeamsList))

		if (updatedTeamsList.length === currentAmountOfItemsPerPage) {
			setCurrentPage(currentPage > 0 ? currentPage - 1 : 0)
			calculateOffset(currentPage > 0 ? currentPage - 1 : 0)
		}

		if (filteredTeams.length !== 0) {
			setCurrentPage(0)
			setItemOffset(0)
			setFilter('')
		}
		setTeamsCount(updatedTeamsList.length)
		navigate('/')
	}

	// Функция перехода в режим редактирования команды
	function handleEditTeam(team: ITeam): void {
		setEditTeam(team)
		setCurrentState(EDIT_EXIST_TEAM_STATE)
	}

	// Отображение компонента загрузчика, пока данные не загружены
	if (isLoading) {
		return <PageLoader />
	}

	// Функция для определения состояния в зависимости от значения currentState
	function getState(currentState: string): JSX.Element {
		switch (currentState) {
			case TEAMS_STATE:
				return (
					<div className={shared.container} onClick={() => {setIsBlur(true)}}>
						<div className={shared.header}>
							<Search {...searchInput} onChange={handleSearch} value={filter} />
							<AddButton
								onClick={() => {
									navigate('newteam')
								}}
							/>
						</div>
						<div className={shared.cards}>
							{teamsToRender.length === 0 ? (
								<div className={shared.empty}>
									<div
										className={[
											classes.background,
											shared.background,
										].join(' ')}
									/>
									<div className={shared.text}>
										<h1>Empty here</h1>
										{filter.length === 0 ? (
											<h3>Add new teams to continue</h3>
										) : (
											<h3>Search got no results</h3>
										)}
									</div>
								</div>
							) : (
								teamsToRender.map((team) => (
									<TeamCard
										key={team.name}
										logo={team.logo}
										name={team.name}
										year={team.year}
										onClick={handleTeamCardClick}
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
								color='white'
								items={itemsPerPage}
								selectedItem={currentAmountOfItemsPerPage}
								onChange={handleSelectorItemsChange}
								isBlur={isBlur}
								setIsBlur={setIsBlur}
							/>
						</div>
					</div>
				)
			case NEW_TEAM_STATE:
				return <NewTeam isEditTeam={false} />

			case EDIT_EXIST_TEAM_STATE:
				return <NewTeam editTeam={editTeam} isEditTeam={true} />

			case SELECTED_TEAM_STATE:
				return (
					<SelectedTeam
						selectedTeam={selectedTeam}
						deleteTeam={handleDeleteTeam}
						editTeam={handleEditTeam}
					/>
				)
			default:
				return <></>
		}
	}

	return (
		<TeamContext.Provider
			value={{
				teams: teams,
				setTeams: setTeams,
			}}>
			{getState(currentState)}
		</TeamContext.Provider>
	)
}
