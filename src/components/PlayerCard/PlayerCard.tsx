import React from 'react'
import classes from './PlayerCard.module.css'
import shared from '../shared/Card.module.css'

// интерфейс карточки команды
interface IPlayerCardProps {
	photo: string
	name: string
	number: string
  team: string
	onClick(name: string): any
}

export default function PlayerCard(props: any) {
	const { photo, name, number, team, onClick } = props as IPlayerCardProps // деструктизация параметров

	return (
		<figure
			className={[shared.card, classes.card].join(' ')}
			onClick={() => {
				onClick(name)
			}}>
			<img draggable='false' src={photo} alt={name} className={classes.photo} />
			<figcaption className={[shared.caption, classes.caption].join(' ')}>
				<h3>{name} <span>{number !== '' ? '#'+number : ''}</span></h3>
				<h5>{team}</h5>
			</figcaption>
		</figure>
	)
}
