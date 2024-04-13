import React, { useState } from 'react'
import classes from './Players.module.css'
import Search from '../../UI/Search/Search'
import AddButton from '../../UI/AddButton/AddButton'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../Pagination/Pagination'
import Selector from '../../UI/Selector/Selector'
import PlayerCard from '../../PlayerCard/PlayerCard'
import shared from '../../shared/MainPages.module.css'
import MultiSelector from '../../UI/MultiSelect/MultiSelector'

export interface IPlayer {
	photo: string
	name: string
	position: string
	team: string
	height_cm: number
	weight_kg: number
	birthday: Date
	number: number
}

const PLAYERS_STATE: string = 'teams'

const SELECTED_PLAYERS_STATE: string = 'selected'

const NEW_PLAYER_STATE: string = 'newteam'

const itemsPerPage: number[] = [6, 12, 24]

const positions: string[] = ['Center Forward', 'Guard Forward', 'Forward', 'Center', 'Guard']

export default function Players(): JSX.Element {
	const navigate = useNavigate()

	const [currentState, setCurrentState] = useState<string>(PLAYERS_STATE)
	const [filter, setFilter] = useState<string>('')
	const [playersToRender, setPlayersToRender] = useState<IPlayer[]>([])
	const [players, setPlayers] = useState<IPlayer[]>([])
	const [playersCount, setPlayersCount] = useState<number>(0)
	const [totalPages, setTotalPages] = useState<number>(0)
	const [currentPage, setCurrentPage] = useState<number>(0)
	const [currentAmountOfItemsPerPage, setCurrentAmountOfItemsPerPage] = useState<number>(itemsPerPage[0])
	const [selectedPositions, setSelectedPositions] = useState<string[]>([])
	const [itemOffset, setItemOffset] = useState<number>(0)
	const [selectedPlayer, setSelectedPlayer] = useState<IPlayer>({
		photo: '',
		name: '',
		position: '',
		team: '',
		height_cm: 0,
		weight_kg: 0,
		birthday: new Date(),
		number: 0,
	})

	function handleSearch(event: any): void {}

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
				setCurrentState(SELECTED_PLAYERS_STATE)
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

	function handlePositionsChange(item: any): void {
		setSelectedPositions([...selectedPositions, item])
	}

	const searchInput = {
		type: 'text',
		placeholder: 'Search...',
	}

	return (
		<div className={shared.container}>
			<div className={shared.header}>
				<Search {...searchInput} onChange={handleSearch} value={filter} />
				<MultiSelector
					items={positions}
					selectedItems={selectedPositions}
					setSelectedPositions={setSelectedPositions}
					onChahgedSelectorItems={handlePositionsChange}
				/>
				<AddButton
					onClick={() => {
						navigate('/players')
					}}
				/>
			</div>
			<div className={shared.cards}>
				{playersToRender.length === 0 ? (
					<div className={shared.empty}>
						<div className={[classes.background, shared.background].join(' ')} />
						<div className={shared.text}>
							<h1>Empty here</h1>

							{filter.length === 0 ? (
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
					onChahgedSelectorItems={handleItemsPerPageChange}
				/>
			</div>
		</div>
	)
}
