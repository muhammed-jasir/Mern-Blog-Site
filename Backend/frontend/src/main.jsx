import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store, persistor } from './redux/store'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Theme from './components/Theme.jsx'
import ToastContainer from './components/Toast.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PersistGate persistor={persistor} >
            <Provider store={store}>
                <Theme>
                    <App />
                    <ToastContainer />
                </Theme>
            </Provider>
        </PersistGate>
    </React.StrictMode>,
)
