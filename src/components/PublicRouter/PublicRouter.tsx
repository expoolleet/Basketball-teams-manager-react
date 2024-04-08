import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { privateRoutes, publicRouters } from '../../utils/router'
export default function PublicRouter() { // открытые пути (для неавторизированных пользователей)
	return (
		<Routes>
			{publicRouters.map((route) => (
				<Route key={route.path} path={route.path} element={route.element()} />
			))}
			{privateRoutes.map((route) => (
				<Route key={route.path} path={route.path} element={<Navigate to='signin' replace />} />
			))}
		</Routes>
	)
}
