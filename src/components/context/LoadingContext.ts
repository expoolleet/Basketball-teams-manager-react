import { createContext } from 'react'

type LoadingContextType = { isLoading: boolean } // тип контекста загрузки

const loadingContextState = { isLoading: true } // значение по умолчанию

export const LoadingContext = createContext<LoadingContextType>(loadingContextState)
