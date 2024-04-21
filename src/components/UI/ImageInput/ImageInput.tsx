import React, { useEffect, useRef, useState } from 'react'
import classes from './ImageInput.module.css'

interface IImageInput {
	saveImage(event: any): any
	backgroundImage: string
}

export default function ImageInput(props: any): React.ReactElement {
	const { saveImage, backgroundImage } = props as IImageInput

	const uploadRef = useRef<HTMLInputElement>(null)

	const [image, setImage] = useState<string>('')

	useEffect(() => {
		setImage(backgroundImage)
	}, [backgroundImage])

	function hanldeOpenPhoto(event: any): void {
		if (!event.target.files.length) return

		const image = event.target.files[0]

		saveImage(image)
	}
	return (
		<div
			className={classes.image_input}
			onClick={() => {
				uploadRef.current?.click()
			}}>
			{image ? <img src={image} alt='' className={classes.background_image} /> : <></>}
			<input ref={uploadRef} type='file' name='photo' id='photo' onChange={hanldeOpenPhoto} />
		</div>
	)
}
