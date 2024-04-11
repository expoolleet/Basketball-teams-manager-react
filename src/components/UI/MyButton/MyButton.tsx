import classes from '../../shared/Button.module.css'

interface IButtonProps {
	isButtonDisabled: boolean
	styleType : string
	buttonProps: any
}

export default function MyButton(props: any): JSX.Element {
	const { isButtonDisabled, styleType, ...buttonProps } = props as IButtonProps

	return (
		<button
			disabled={isButtonDisabled}
			{...buttonProps}
			style={ styleType === 'gray' ? {
				backgroundColor: '#fff',
				color: '#9c9c9c',
				border: '2px solid #c9c9c9',
			} : {}}
			className={classes.button}>
			{props.children}
		</button>
	)
}
