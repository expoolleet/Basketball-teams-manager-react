import React from 'react'
import classes from './TeamCard.module.css'

// интерфейс карточки команды
interface ITeamCardProps {
	logo: string
	name: string
	year: string
	onClick(name: string): any
}

export default function TeamCard(props: any) {
	const { logo, name, year, onClick } = props as ITeamCardProps // деструктизация параметров

	return (
		<figure
			className={classes.card}
			onClick={() => {
				onClick(name)
			}}>
			<img draggable='false' src={logo} alt={name} className={classes.logo} />
			<figcaption className={classes.caption}>
				<h3>{name}</h3>
				<h5>Year of foundation: {year}</h5>
			</figcaption>
		</figure>
	)
}
