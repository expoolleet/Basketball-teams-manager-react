import React, { useContext, useEffect, useState } from 'react'
import classes from './Navbar.module.css'
import { Link, useLocation } from 'react-router-dom'
import SignOut from '../SignOut/SignOut'
import { AuthContext } from '../context/AuthContext'

type SelectedLink = { color: string }
type SelectedIcon = { backgroundColor: string }

export default function Navbar(): React.ReactElement {
	const location = useLocation()

	const [isMobileMenuOpened, setIsMobileMenuOpened] = useState<boolean>(false)
	const [showMobileMenu, setMobileMenu] = useState<string>('')

	const show: string = classes.show
	const hide: string = classes.hide

	useEffect(() => {
		setMobileMenu(isMobileMenuOpened ? show : hide)
		document.documentElement.style.setProperty('--mobile_overflow', isMobileMenuOpened ? 'hidden' : 'auto')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMobileMenuOpened])

	useEffect(() => {
		setIsMobileMenuOpened(false)
	}, [location])

	const forTeams = ['/', '/newteam']
	const forPlayers = ['/players', '/newplayer']

	const { authName } = useContext(AuthContext)

	// Функция для проверки, находится ли текущий путь в заданном массиве путей
	function isSelected(paths: string[]): boolean {
		return paths.includes(location.pathname)
	}

	// Функция для назначения стилей выбранным ссылкам
	function linkStyles(paths: string[]): SelectedLink {
		return { color: isSelected(paths) ? '#E4163A' : '' }
	}

	// Функция для назначения стилей выбранным иконкам
	function iconStyles(paths: string[]): SelectedIcon {
		return { backgroundColor: isSelected(paths) ? '#E4163A' : '' }
	}

	return (
		<nav className={classes.navbar}>
			<header className={classes.header}>
				<span
					className={classes.ham_menu}
					onClick={() => {
						setIsMobileMenuOpened(!isMobileMenuOpened)
					}}
				/>

				<Link to='/' className={classes.logo} />
				<span className={[classes.profile, showMobileMenu].join(' ')}>
					<span className={classes.name}>{authName === null ? 'John Smith' : authName}</span>
					<span className={classes.icon} />
				</span>
			</header>

			<div
				className={[classes.menu, showMobileMenu].join(' ')}
				onClick={() => {
					setIsMobileMenuOpened(false)
				}}>
				<ul
					onClick={(e) => {
						e.stopPropagation()
					}}>
					<li>
						<Link to='/' className={classes.teams} style={linkStyles(forTeams)}>
							<div className={classes.teams_icon} style={iconStyles(forTeams)} />
							<p>Teams</p>
						</Link>
					</li>
					<li>
						<Link to='/players' className={classes.players} style={linkStyles(forPlayers)}>
							<div className={classes.players_icon} style={iconStyles(forPlayers)} />
							<p>Players</p>
						</Link>
					</li>
					<li className={classes.signout}>
						<SignOut />
					</li>
				</ul>
			</div>
		</nav>
	)
}
