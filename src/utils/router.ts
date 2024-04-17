import SignIn from '../components/pages/SignIn/SignIn'
import SignUp from '../components/pages/SignUp/SignUp'
import Error from '../components/pages/Error/Error'
import Teams from '../components/pages/Teams/Teams'
import Players from '../components/pages/Players/Players'

interface IRoutesProps {
	path: string
	element: () => JSX.Element
}

export const privateRoutes: IRoutesProps[] = [
	// частные пути и соответсвующие им компоненты
	{ path: '/', element: Teams },
	{ path: 'newteam', element: Teams },
	{ path: 'players', element: Players },
	{ path: 'newplayer', element: Players },
	{ path: '*', element: Error },
]

export const publicRouters: IRoutesProps[] = [
	// открытые пути и соответсвующие им компоненты
	{ path: 'signin', element: SignIn },
	{ path: 'signup', element: SignUp },
]
