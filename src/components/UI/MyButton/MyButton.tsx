import classes from '../../shared/Button.module.css'

interface IButtonProps {
	isButtonDisabled: boolean
	buttonProps: any
}

export default function MyButton(props: any): JSX.Element {
	const { isButtonDisabled, ...buttonProps } = props as IButtonProps

	return (
		<button disabled={isButtonDisabled} {...buttonProps} className={classes.button}>
			{props.children}
		</button>
	)
}
