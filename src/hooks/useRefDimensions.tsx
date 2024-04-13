import { useState, useEffect, useRef } from 'react'

interface IUseRefDimensions { // интерфейс данных, возращаемых хуком
	width: number
	height: number
}

export default function useRefDimensions<T extends HTMLElement>() { // кастомный хук, расширяемый от HTMLElement, для отслеживания размеров элемента на странице
	const [dimensions, setDimensions] = useState<IUseRefDimensions>({ width: 1, height: 1 }) 
	const dimensionsRef = useRef<T>(null) // хук общего типа
	useEffect(() => {
		const observer = new ResizeObserver((entries) => {
			setDimensions({
				width: Math.round(entries[0].contentRect.width),
				height: Math.round(entries[0].contentRect.height),
			})
		})
		if (dimensionsRef.current) {
			observer.observe(dimensionsRef.current)
		}
		return () => {
			dimensionsRef.current && observer.unobserve(dimensionsRef.current)
		}
	}, [])
	return { dimensions, dimensionsRef }
}
