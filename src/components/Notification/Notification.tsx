import React, { useEffect, useState } from 'react'

import classes from './Notification.module.css'

interface INotificationProps {
	isVisible: boolean
	type: string
	notificationProps: any
}

export default function Notification(props: any): React.ReactElement {
	const { isVisible, type, ...notificationProps } = props as INotificationProps

	const [notificationClass, setNotificationClass] = useState<string>(classes.error_notification)

	const animation: any = {
		animation: 'slidein',
		opacity: isVisible ? '1' : '0',
		transition: 'opacity 200ms',
	}

	// Effect для установки класса уведомления в зависимости от типа
	useEffect(() => {
		switch (type) {
			case 'error':
				setNotificationClass(classes.error_notification)
				break

			case 'success':
				setNotificationClass(classes.success_notification)
				break
		}
	}, [type])

	return (
		<div className={notificationClass} style={animation} {...notificationProps}>
			{props.children}
		</div>
	)
}
