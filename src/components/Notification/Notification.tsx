import React, { useEffect, useState } from 'react'

// Импорт стилей из файла Notification.module.css
import classes from './Notification.module.css'

// Интерфейс для описания свойств компонента Notification
interface INotificationProps {
	isVisible: boolean // Определяет видимость уведомления
	type: string // Тип уведомления (например, "error" или "success")
	notificationProps: any // Дополнительные свойства для уведомления
}

// Функциональный компонент Notification
export default function Notification(props: any) {
	// Деструктуризация параметров props с учетом интерфейса INotificationProps
	const { isVisible, type, ...notificationProps } = props as INotificationProps

	// Состояние для хранения класса уведомления
	const [notificationClass, setNotificationClass] = useState<string>(classes.error_notification)

	// Определение стилей анимации уведомления
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
