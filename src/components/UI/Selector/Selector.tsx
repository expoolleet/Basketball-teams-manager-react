import React, { useEffect, useRef, useState } from 'react'
import classes from './Selector.module.css'

interface ISelectorProps {
	items: number[]
	selectedItem: string
	type: string
	isBlur: boolean
	setIsBlur(flag: boolean): any
	onChange(item: string): any
}

const delayMS: number = 200

export const SELECTOR_INPUT_TYPE = 'input'
export const SELECTOR_PAGE_TYPE = 'page'

export default function Selector(props: any): React.ReactElement {
	const { items, isBlur, setIsBlur, selectedItem, type, onChange } = props as ISelectorProps

	const [itemsClass, setItemsClass] = useState<string>(classes.items_hide)
	const [areItemsHiden, setAreItemsHiden] = useState<boolean>(true)
	const [arrowAnimClass, setArrowAnimClass] = useState<string>('')
	const [selectorType, setSelectorType] = useState<string>(classes.page)

	const selectorRef = useRef<HTMLElement>(null)

	useEffect(() => {
		switch (type) {
			case SELECTOR_INPUT_TYPE:
				setSelectorType(classes.input)
				break
			default:
				setSelectorType(classes.page)
		}
	}, [type])

	useEffect(() => {
		document.documentElement.style.setProperty('--itemsCount', `${items.length}`)
	}, [items.length])

	useEffect(() => {
		if (isBlur) {
			hideSelector()
			setAreItemsHiden((areItemsHiden) => !areItemsHiden)
		}
	}, [isBlur])

	const opacityAnimation: any = {
		opacity: areItemsHiden ? '0' : '1',
		transition: `opacity ${delayMS}ms`,
		cursor: areItemsHiden ? 'default' : 'pointer',
	}

	function openSelector(): void {
		setIsBlur(false)
		setItemsClass(classes.items)
		setArrowAnimClass(classes.arrow_rotate_animation_1)
	}

	function hideSelector(): void {
		setArrowAnimClass(classes.arrow_rotate_animation_2)
		setTimeout(() => {
			setItemsClass(classes.items_hide)
		}, delayMS)
	}

	function onClickSelect(): void {
		if (areItemsHiden) openSelector()
		else hideSelector()

		setAreItemsHiden(!areItemsHiden)
	}

	function onClickItem(event: any): void {
		const item = event.target.innerText as string
		setAreItemsHiden(true)
		hideSelector()

		onChange(item)
	}

	return (
		<div
			className={classes.container}
			onClick={(e) => {
				e.stopPropagation()
			}}>
			<span
				ref={selectorRef}
				className={[classes.selector, selectorType].join(' ')}
				onClick={onClickSelect}
				style={selectedItem.length === 0 ? { color: '#707070' } : { color: '#303030' }}>
				{selectedItem.length === 0 ? 'Select...' : selectedItem}
			</span>
			<span className={[classes.arrow, arrowAnimClass].join(' ')} onClick={onClickSelect} />
			<ul className={itemsClass} style={opacityAnimation}>
				{items.map((item) => (
					<li key={item} className={classes.item} onClick={onClickItem}>
						{item}
					</li>
				))}
			</ul>
		</div>
	)
}
