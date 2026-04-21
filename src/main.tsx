import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { FavoritesProvider } from './context/FavoritesContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FavoritesProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </StrictMode>,
)
