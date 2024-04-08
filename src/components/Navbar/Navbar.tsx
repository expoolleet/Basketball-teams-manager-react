// Импорт необходимых компонентов и библиотек
import React, { useContext, useEffect, useState } from 'react';
import classes from './Navbar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SignOut from '../SignOut/SignOut';
import { AuthContext } from '../context/AuthContext';

// Типы для стилизации ссылок и иконок
type SelectedLink = { color: string };
type SelectedIcon = { backgroundColor: string };

// Функциональный компонент Navbar
export default function Navbar(): JSX.Element {
  // Получение информации о текущем URL-адресе и функции навигации
  const location = useLocation();
  const navigate = useNavigate();

  // Состояние для управления видимостью меню на мобильных устройствах
  const [isMenuHidden, setIsMenuHidden] = useState<boolean>(false);
  const [showMobileMenu, setMobileMenu] = useState<string>('');

  // Управление видимостью мобильного меню и свойством overflow
  useEffect(() => {
    setMobileMenu(isMenuHidden ? classes.show : '');
    document.documentElement.style.setProperty('--mobile_overflow', isMenuHidden ? 'hidden' : 'auto');
  }, [isMenuHidden]); // Эффект запускается при изменении isMenuHidden

  // Скрытие меню при изменении URL-адреса
  useEffect(() => {
    setIsMenuHidden(false);
  }, [location]); // Эффект запускается при изменении location

  // Массивы путей для команд и игроков
  const forTeams = ['/', '/newteam'];
  const forPlayers = ['/players', '/newplayer'];

  // Получение имени авторизованного пользователя
  const { authName } = useContext(AuthContext);

  // Функция для проверки, находится ли текущий путь в заданном массиве путей
  function isSelected(paths: string[]): boolean {
    return paths.includes(location.pathname);
  }

  // Функция для назначения стилей выбранным ссылкам
  function linkStyles(paths: string[]): SelectedLink {
    return { color: isSelected(paths) ? '#E4163A' : '' };
  }

  // Функция для назначения стилей выбранным иконкам
  function iconStyles(paths: string[]): SelectedIcon {
    return { backgroundColor: isSelected(paths) ? '#E4163A' : '' };
  }

	return (
		<nav className={classes.navbar}>
			<header className={classes.header}>
				<span
					className={classes.ham_menu}
					onClick={() => {
						setIsMenuHidden(!isMenuHidden)
					}}
				/>

				<Link to='/' className={classes.logo} />
				<span className={[classes.profile, showMobileMenu].join(' ')}>
					<span onClick={() => {navigate('/profile')}} className={classes.name}>{authName === null ? 'John Smith' : authName}</span>
					<Link to='/profile' id='link' className={classes.icon} />
				</span>
			</header>

			<div className={[classes.menu, showMobileMenu].join(' ')}>
				<ul>
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
