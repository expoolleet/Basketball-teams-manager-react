import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import { AuthContext } from './components/context/AuthContext'
import PageLoader from './components/UI/PageLoader/PageLoader'
import PrivateRouter from './components/PrivateRouter/PrivateRouter'
import PublicRouter from './components/PublicRouter/PublicRouter'
function App(): JSX.Element {
	const [isAuth, setIsAuth] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [authName, setAuthName] = useState<string>('')

	useEffect(() => {
		if (localStorage.getItem('auth')) {
			setIsAuth(true)
			const lastLogin = localStorage.getItem('lastLogin')
			setAuthName(localStorage.getItem(`${lastLogin}.name`) as string)
		}
		setIsLoading(false)
	}, [])

	useEffect(() => {
		document.documentElement.style.setProperty('--body_mobile_padding_top', isAuth ? '80px' : '0')
	}, [isAuth])

	if (isLoading) {
		return <PageLoader />
	}

	return (
		<AuthContext.Provider
			value={{
				isAuth,
				setIsAuth,
				authName,
				setAuthName,
			}}>
			<BrowserRouter>
				{isAuth ? [<Navbar key={'Navbar'} />, <PrivateRouter key={'PrivateRouter'} />] : <PublicRouter />}
			</BrowserRouter>
		</AuthContext.Provider>
	)
}

export default App
