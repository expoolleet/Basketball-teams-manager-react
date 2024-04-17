import { IPlayer } from './../pages/Players/Players'
import { createContext } from 'react'

type SelectedPlayerContextType =
	// тип контекса игрока
	{
		selectedPlayer: IPlayer | null
		setSelectedPlayer: React.Dispatch<React.SetStateAction<IPlayer | null>>
	}

const SelectedPlayerContextState = {
	// контекст по умолчанию
	selectedPlayer: null,
	setSelectedPlayer: () => {},
}

export const SelectedPlayerContext = createContext<SelectedPlayerContextType>(SelectedPlayerContextState)
