import { useState, createContext, useContext, ReactNode, FC } from 'react'

const defaultTheme = () => {
    const StorageTheme = localStorage.getItem('theme')
    if (StorageTheme) {
        document.body.classList.add(`${StorageTheme === 'dark' ? 'dark' : undefined}`)
        return StorageTheme
    } else {
        return 'light'
    }
}

export const ThemeContext = createContext(defaultTheme)
export const ThemeUpdateContext = createContext(defaultTheme)

export function useTheme() {
    return useContext(ThemeContext)
}

export function useThemeUpdate() {
    return useContext(ThemeUpdateContext)
}

interface ThemeProviderProps {
    children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<string>(defaultTheme)

    const changeTheme = () => {
        document.body.classList.toggle('dark', undefined)
        if (theme === 'dark') {
            setTheme('light')
            localStorage.setItem('theme', 'light')
        } else {
            setTheme('dark')
            localStorage.setItem('theme', 'dark')
        }
    }

    return (
        <ThemeContext.Provider value={theme as unknown as () => string}>
            <ThemeUpdateContext.Provider value={changeTheme as unknown as () => string}>{children}</ThemeUpdateContext.Provider>
        </ThemeContext.Provider>
    )
}
