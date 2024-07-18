import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { store, persistor } from './redux/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Theme from './components/Theme.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <PersistGate persistor={persistor} >
            <Provider store={store}>
                <Theme>
                    <App />
                    <ToastContainer
                        autoClose={5000}
                        newestOnTop={true}
                        draggable
                    />
                </Theme>
            </Provider>
        </PersistGate>
    </React.StrictMode>,
)
