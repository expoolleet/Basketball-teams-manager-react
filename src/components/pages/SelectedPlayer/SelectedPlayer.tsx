import React, { useState } from 'react'
import classes from './SelectedPlayer.module.css'
import shared from '../../shared/AdditionalPages.module.css'
import { Link } from 'react-router-dom'
import { IPlayer } from '../Players/Players'
import Modal from '../../Modal/Modal'
import MyButton from '../../UI/MyButton/MyButton'

interface ISelectedPlayerProps {
	editPlayer(player: IPlayer): any
	deletePlayer(player: IPlayer): any
	selectedPlayer: IPlayer
}

export default function SelectedPlayer(props: any): React.ReactElement {
	const { photo, name, position, team, height_cm, weight_kg, birthday, number }: IPlayer = props.selectedPlayer
	const { editPlayer, deletePlayer, selectedPlayer }: ISelectedPlayerProps = props

	const [modal, setModal] = useState<boolean>(false)

	function handleDeletePlayerWindow(): void {
		setModal(!modal)
	}

	// Автоматическое пролистывание наверх (для мобильных устройств)
	window.scrollTo(0, 0)

	return (
		<div className={shared.container}>
			<div className={shared.header}>
				<div>
					<span>
						<Link to='/players'>Players</Link>
					</span>{' '}
					<span>{name}</span>
				</div>
				<div className={classes.header_buttons}>
					<span
						className={shared.edit}
						onClick={() => {
							editPlayer(selectedPlayer)
						}}
					/>{' '}
					<span className={shared.remove} onClick={handleDeletePlayerWindow} />
				</div>
			</div>
			<figure className={[classes.background, shared.background].join(' ')}>
				<img className={classes.photo} src={photo} alt={name} />
				<figcaption className={[classes.figcaption, shared.figcaption].join(' ')}>
					<h2 className={classes.name}>
						{name} <span className={classes.number}>{number !== '' ? '#' + number : ''}</span>
					</h2>
					<div className={classes.info}>
						<h3>
							Position
							<br />
							<span>{position}</span>
						</h3>
						<h3>
							Team
							<br />
							<span>{team}</span>
						</h3>
						<h3>
							Height
							<br />
							<span>{height_cm}</span>
						</h3>
						<h3>
							Weight
							<br />
							<span>{weight_kg}</span>
						</h3>
						<h3>
							Age
							<br />
							<span>{new Date().getFullYear() - new Date(birthday).getFullYear()}</span>
						</h3>
					</div>
				</figcaption>
			</figure>

			<Modal visible={modal} setVisible={setModal} header='Do you want to delete the player?'>
				<MyButton styleType='gray' onClick={handleDeletePlayerWindow}>
					Cancel
				</MyButton>
				<MyButton
					onClick={() => {
						deletePlayer(selectedPlayer)
					}}>
					Proceed
				</MyButton>
			</Modal>
		</div>
	)
}
