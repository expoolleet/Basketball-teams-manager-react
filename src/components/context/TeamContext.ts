import { createContext } from 'react'
import { ITeam } from '../pages/Teams/Teams'

type TeamContextType =
	// тип контекса команды
	{
		teams: ITeam[]
		setTeams: React.Dispatch<React.SetStateAction<ITeam[]>>
	}

const TeamContextState = {
	// контекст по умолчанию
	teams: [
		{
			logo: '',
			name: '',
			division: '',
			conference: '',
			year: '',
		},
	],
	setTeams: () => {},
}

export const TeamContext = createContext<TeamContextType>(TeamContextState)
