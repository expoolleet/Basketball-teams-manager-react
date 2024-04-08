import { createContext } from "react"

type AuthContextType = { // контекст аутентификации
    isAuth: boolean
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    authName: string
    setAuthName: React.Dispatch<React.SetStateAction<string>>
}

const authContextState = { // состояние по умолчанию
    isAuth : false,
    setIsAuth: () => {},
    authName : '',
    setAuthName: () => {}
}

export const AuthContext = createContext<AuthContextType>(authContextState)