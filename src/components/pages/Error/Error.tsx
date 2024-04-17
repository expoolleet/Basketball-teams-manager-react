import classes from './Error.module.css'

export default function Error() {
	// компонент ошибки 404
	return (
		<div className={classes.error}>
			<div>
				<h1>Page not found</h1>
				<p>Sorry, we can’t find what you’re looking for</p>
			</div>
		</div>
	)
}
