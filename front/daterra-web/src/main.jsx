import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// 1. AGREGA ESTA IMPORTACIÓN:
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. CREA EL CLIENTE:
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* 3. ENVUELVE TU COMPONENTE PRINCIPAL AQUÍ: */}
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </React.StrictMode>,
)