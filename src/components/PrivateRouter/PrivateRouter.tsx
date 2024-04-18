import { Routes, Route, Navigate } from 'react-router-dom'
import { privateRoutes, publicRouters } from '../../utils/router'
export default function PrivateRouter(): React.ReactElement {
	// частные пути (для авторизованных пользователей)
	return (
		<Routes>
			{' '}
			/
			{privateRoutes.map((route) => (
				<Route key={route.path} path={route.path} element={route.element()} />
			))}
			{publicRouters.map((route) => (
				<Route key={route.path} path={route.path} element={<Navigate to='/' replace />} />
			))}
		</Routes>
	)
}
