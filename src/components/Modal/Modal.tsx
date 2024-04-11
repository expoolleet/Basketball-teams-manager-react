import React, { useEffect, useState } from 'react'
import classes from './Modal.module.css'

interface IModalProps {
	header: string
	children: any
	visible: boolean
	setVisible(flag: boolean): any
}

export default function Modal(props: any) {
	const { visible, setVisible, header, children }: IModalProps = props

	const modalClass: string[] = [classes.modal_container]

	if (visible) {
		modalClass.push(classes.active)
	}

	return (
		<div className={modalClass.join(' ')} onClick={() => setVisible(false)}>
			<div className={classes.modal} onClick={(e) => e.stopPropagation()}>
				<h2 className={classes.modal_head}>{header}</h2>
				<div className={classes.modal_body}>{children}</div>
			</div>
		</div>
	)
}
