import React, { useState } from 'react'
import classes from './SelectedTeam.module.css'
import shared from '../../shared/AdditionalPages.module.css'
import { Link } from 'react-router-dom'
import { ITeam } from '../Teams/Teams'
import Modal from '../../Modal/Modal'
import MyButton from '../../UI/MyButton/MyButton'

interface ISelectedTeamProps {
	editTeam(team: ITeam): any
	deleteTeam(team: ITeam): any
	selectedTeam: ITeam
}

export default function SelectedTeam(props: any) {
	const { logo, division, conference, name, year }: ITeam = props.selectedTeam
	const { editTeam, deleteTeam, selectedTeam }: ISelectedTeamProps = props

	const [modal, setModal] = useState<boolean>(false)

	function handleDeleteTeamWindow(): void {
		setModal(!modal)
	}

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
						className={classes.edit}
						onClick={() => {
							editTeam(selectedTeam)
						}}
					/>{' '}
					<span className={classes.remove} onClick={handleDeleteTeamWindow} />
				</div>
			</div>
			<figure className={classes.team}>
				<img className={classes.logo} src={logo} alt={name} />
				<figcaption className={classes.figcaption}>
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
