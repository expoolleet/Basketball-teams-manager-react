import React, { useContext } from 'react'
import classes from './SignOut.module.css'
import { AuthContext } from '../context/AuthContext'

export default function SignOut(): React.ReactElement {

    const {setIsAuth} = useContext(AuthContext) // контекст авторизации

	return (
		<div className={classes.signout}>
			<label onClick={() => {
                localStorage.removeItem('auth')
                setIsAuth(false)
            }}>
				<div className={classes.logo}/>
				<p>Sign out</p>
			</label>
		</div>
	)
}
