import { ITeam } from '../pages/Teams/Teams'
import { IPlayer } from './../pages/Players/Players'
import { createContext } from 'react'

type PlayerContextType =
	// тип контекса игрока
	{
		players: IPlayer[]
		setPlayers: React.Dispatch<React.SetStateAction<IPlayer[]>>
		teams: string[]
	}

const PlayerContextState = {
	// контекст по умолчанию
	players: [
		{
			photo: '',
			name: '',
			position: '',
			team: '',
			height_cm: '',
			weight_kg: '',
			birthday: '',
			number: '',
		},
	],
	teams: [],
	setPlayers: () => {},
}

export const PlayerContext = createContext<PlayerContextType>(PlayerContextState)
