import { ReactNode } from "react";
import { useSelector } from "react-redux"
import { RootState } from "../redux/store";

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme } = useSelector((state: RootState) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 min-h-screen">
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider
