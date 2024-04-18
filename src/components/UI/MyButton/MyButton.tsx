import shared from '../../shared/Button.module.css'

interface IButtonProps {
	isButtonDisabled: boolean
	styleType: string
	buttonProps: any
}

const BUTTON_STYLE_GRAY: string = 'gray'

export default function MyButton(props: any): React.ReactElement {
	const { isButtonDisabled, styleType, ...buttonProps } = props as IButtonProps

	let buttonStyle: string
	switch (styleType) {
		case BUTTON_STYLE_GRAY:
			buttonStyle = shared.gray_button
			break
		default:
			buttonStyle = shared.button
	}

	return (
		<button disabled={isButtonDisabled} {...buttonProps} className={buttonStyle}>
			{props.children}
		</button>
	)
}
