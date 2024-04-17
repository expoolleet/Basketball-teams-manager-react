import React, { useEffect, useState, useContext } from 'react'
import classes from './SelectedTeam.module.css'
import shared from '../../shared/AdditionalPages.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { ITeam } from '../Teams/Teams'
import Modal from '../../Modal/Modal'
import MyButton from '../../UI/MyButton/MyButton'
import { IPlayer } from '../Players/Players'
import { SelectedPlayerContext } from '../../context/SelectedPlayerContext'

interface ISelectedTeamProps {
	editTeam(team: ITeam): any
	deleteTeam(team: ITeam): any
	selectedTeam: ITeam
}

export default function SelectedTeam(props: any) {
	const { logo, division, conference, name, year }: ITeam = props.selectedTeam
	const { editTeam, deleteTeam, selectedTeam }: ISelectedTeamProps = props

	// Контекст выбранного игрока
	const { setSelectedPlayer } = useContext(SelectedPlayerContext)

	// Состояние состава команды
	const [roster, setRoster] = useState<IPlayer[]>()

	// Состояние модального окна
	const [modal, setModal] = useState<boolean>(false)

	// Хук навигации
	const navigate = useNavigate()

	// Обработчик удаления команды
	function handleDeleteTeamWindow(): void {
		setModal(!modal)
	}

	// Автоматическое пролистывание наверх (для мобильных устройств)
	window.scrollTo(0, 0);

	useEffect(() => {
		const storage = localStorage.getItem('players')

		if (storage) {
			const localPlayers = JSON.parse(storage) as IPlayer[]

			const players: IPlayer[] = []

			localPlayers.forEach((player) => {
				if (player.team === name) {
					players.push(player)
				}
			})
			setRoster(players)
		}
	}, [name])

	return (
		<div className={shared.container}>
			<div className={shared.header}>
				<div>
					<span>
						<Link to='/'>Teams</Link>
					</span>{' '}
					<span>{name}</span>
				</div>
				<div className={classes.header_buttons}>
					<span
						className={shared.edit}
						onClick={() => {
							editTeam(selectedTeam)
						}}
					/>{' '}
					<span className={shared.remove} onClick={handleDeleteTeamWindow} />
				</div>
			</div>
			<figure className={[classes.background, shared.background].join(' ')}>
				<img className={classes.logo} src={logo} alt={name} />
				<figcaption className={[classes.figcaption, shared.figcaption].join(' ')}>
					<h2 className={classes.name}>{name}</h2>
					<h3 className={classes.year}>
						Year of foundation
						<br />
						<span>{year}</span>
					</h3>
					<h3 className={classes.division}>
						Division
						<br />
						<span>{division}</span>
					</h3>
					<h3 className={classes.conference}>
						Conference
						<br />
						<span>{conference}</span>
					</h3>
				</figcaption>
			</figure>

			<div className={classes.roster_container}>
				<p className={classes.roster_container_header}>Roster</p>
				<div className={classes.roster}>
					<div className={classes.roster_header}>
						<span>#</span>
						<span>Player</span>
						<span>Height</span>
						<span>Weight</span>
						<span>Age</span>
					</div>
					<div className={classes.roster_body}>
						{roster?.map((player) => (
							<div className={classes.roster_player} key={player.name}>
								<span>{player.number === '' ? '-' : player.number}</span>

								<label
									className={classes.roster_player_figure}
									onClick={() => {
										setSelectedPlayer(player)
										navigate('/players')
									}}>
									<img src={player.photo} alt={player.name} />
									<p className={classes.roster_player_caption}>
										<span className={classes.roster_player_name}>
											{player.name}
										</span>
										<span className={classes.roster_player_position}>
											{player.position}
										</span>
									</p>
								</label>

								<span className={classes.roster_player_height}>
									{player.height_cm} cm
								</span>
								<span className={classes.roster_player_weight}>
									{player.weight_kg} kg
								</span>
								<span className={classes.roster_player_age}>
									{new Date().getFullYear() -
										new Date(player.birthday).getFullYear()}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<Modal visible={modal} setVisible={setModal} header='Do you want to delete the team?'>
				<MyButton styleType='gray' onClick={handleDeleteTeamWindow}>
					Cancel
				</MyButton>
				<MyButton
					onClick={() => {
						deleteTeam(selectedTeam)
					}}>
					Proceed
				</MyButton>
			</Modal>
		</div>
	)
}
