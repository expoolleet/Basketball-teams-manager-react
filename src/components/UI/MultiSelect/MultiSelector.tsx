import React, { useState, useEffect, useRef } from 'react'
import classes from './MultiSelector.module.css'
import useRefDimensions from '../../../hooks/useRefDimensions'

interface IMultiSelectorProps {
	items: string[]
	selectedItems: string[]
	setSelectedPositions(items: string[]): any
	onChahgedSelectorItems(item: string): any
}

const delayMS: number = 200

export default function MultiSelector(props: any) {
	const { selectedItems, items, setSelectedPositions, onChahgedSelectorItems }: IMultiSelectorProps = props
	const [itemsClass, setItemsClass] = useState<string>(classes.items_hide)
	const [itemClass, setItemClass] = useState<string>(classes.item_hide)
	const [areItemsHiden, setAreItemsHiden] = useState<boolean>(true)
	const [arrowAnimClass, setArrowAnimClass] = useState<string>('')
	const [multiSelectorStyle, setMultiSelectorStyle] = useState<{}>({ backgroundColor: '#fff' })

	const { dimensions, dimensionsRef } = useRefDimensions<HTMLSpanElement>()

	useEffect(() => {
		document.documentElement.style.setProperty('--itemsCount', `${items.length}`) // отслеживаем длину элементов, передаваемых селектору

		if (selectedItems.length === 0)
			setMultiSelectorStyle({
				backgroundColor: '#fff',
			})
		// изменение цвет фона на #fff в случае, если отсутствуют выбранные элементы в селекторе
		else setMultiSelectorStyle({ backgroundColor: '#f6f6f6' }) // изменение цвет фона на #f6f6f6 в случае, если есть элементы в селекторе
	}, [items.length, selectedItems.length])

	let remove_items_icon: string = classes.remove_items_icon
	let multiSelector: string = classes.multiselector_active
	let placeholder: string = ''

	if (selectedItems.length === 0) {
		remove_items_icon = ''
		multiSelector = classes.multiselector
		placeholder = 'Select...'
	}

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
			setMultiSelectorStyle({ backgroundColor: '#fff' })
			setItemsClass(classes.items)
			setItemClass(classes.item)
			setArrowAnimClass(classes.arrow_animation_up)
		} else {
			if (selectedItems.length !== 0) setMultiSelectorStyle({ backgroundColor: '#f6f6f6' })
			hideSelector()
			setArrowAnimClass(classes.arrow_animation_down)
		}
		setAreItemsHiden(!areItemsHiden)
	}

	function onClickItem(event: any): void {
		const item = event.target.innerText as string
		onChahgedSelectorItems(item)
		onClickSelect()
	}

	function removeSelectedItem(item: string): void {
		setSelectedPositions(selectedItems.filter((i) => i !== item))
	}

	function removeItems(): void {
		setSelectedPositions([])
	}

	const itemsToRender: string[] = []
	const offset: number = 110
	const letterWidth: number = 10
	let width: number = 0

	for (let i = 0; i < selectedItems.length; i++) {
		width += selectedItems[i].length * letterWidth
		if (width < dimensions.width - offset) itemsToRender.push(selectedItems[i])
		else {
			itemsToRender.push('...')
			break
		}
	}

	return (
		<div className={classes.container}>
			<span className={multiSelector} onClick={onClickSelect} style={multiSelectorStyle} ref={dimensionsRef}>
				{itemsToRender.map((item) => (
					<span
						className={classes.selected_item}
						key={item}
						onClick={(e) => {
							e.stopPropagation()
						}}>
						<span>{item}</span>
						{item === '...' ? (
							<></>
						) : (
							<span
								className={classes.remove_selected_item_icon}
								onClick={() => {
									removeSelectedItem(item)
								}}
							/>
						)}
					</span>
				))}
				{placeholder}
				<span
					className={remove_items_icon}
					onClick={(e) => {
						e.stopPropagation()
						removeItems()
					}}
				/>
			</span>
			<span className={[classes.arrow, arrowAnimClass].join(' ')} onClick={onClickSelect}></span>

			<ul className={itemsClass} style={opacityAnimation}>
				{items
					.filter((item) => !selectedItems.includes(item))
					.map((item) => (
						<li key={item} className={itemClass} onClick={onClickItem}>
							{item}
						</li>
					))}
			</ul>
		</div>
	)
}
