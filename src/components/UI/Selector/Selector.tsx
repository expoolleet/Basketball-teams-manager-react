import React, { useEffect, useState } from 'react'
import classes from './Selector.module.css'

interface ISelectorProps {
	items: number[]
	selectedItem: number | string
	totalItems: number
	onChahgedSelectorItems(item: number): any
}

const delayMS: number = 200

export default function Selector(props: any) {
	const { items, selectedItem, onChahgedSelectorItems } = props as ISelectorProps

	const [itemsClass, setItemsClass] = useState<string>(classes.items_hide)
	const [itemClass, setItemClass] = useState<string>(classes.item_hide)
	const [areItemsHiden, setAreItemsHiden] = useState<boolean>(true)
	const [arrowAnimClass, setArrowAnimClass] = useState<string>('')

	useEffect(() => {
		document.documentElement.style.setProperty('--itemsCount', `${items.length}`)
	}, [items.length])

	const opacityAnimation: any = {
		opacity: areItemsHiden ? '0' : '1',
		transition: `opacity ${delayMS}ms`,
		cursor: areItemsHiden ? 'default' : 'pointer',
	}

	function hideSelector(): void {
		setTimeout(() => {
			setItemsClass(classes.items_hide)
			setItemClass(classes.item_hide)
		}, delayMS)
	}

	function onClickSelect(): void {
		if (areItemsHiden) {
			setItemsClass(classes.items)
			setItemClass(classes.item)
			setArrowAnimClass(classes.arrow_animation_down)
		} else {
			hideSelector()
			setArrowAnimClass(classes.arrow_animation_up)
		}
		setAreItemsHiden(!areItemsHiden)
	}

	function onClickItem(event: any): void {
		const item = event.target.innerText as number
		setAreItemsHiden(true)
		hideSelector()
		setArrowAnimClass(classes.arrow_animation_up)

		onChahgedSelectorItems(item)
	}

	return (
		<div className={classes.container}>
			<span className={classes.selector} onClick={onClickSelect}>
				{selectedItem}
			</span>
			<span className={[classes.arrow, arrowAnimClass].join(' ')} onClick={onClickSelect}></span>

			<ul className={itemsClass} style={opacityAnimation}>
				{items.map((item) => (
					<li key={item} className={itemClass} onClick={onClickItem}>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}
