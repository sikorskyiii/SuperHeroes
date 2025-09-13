import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/index.js'
import App from './App.jsx'
import './styles.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_MOCKS === '1') {
  import('./mocks/mockServer.js')
    .then(({ default: setupMockServer }) => setupMockServer())
    .catch((e) => console.error('Mock init failed:', e))
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
)
