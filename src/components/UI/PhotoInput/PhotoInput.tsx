import React from 'react'
import classes from './PhotoInput.module.css'

interface IPhotoInput{
    uploadRef: any
    openPhoto(): any,
    background: string
}


export default function PhotoInput(props: any) {
    const {uploadRef, openPhoto, background} = props as IPhotoInput

	return (
		<div className={classes.photo_input} onClick={() => {props.uploadRef.current?.click()}} >
			<input ref={uploadRef} type='file' name='photo' id='photo' onChange={openPhoto} />
		</div>
	)
}
