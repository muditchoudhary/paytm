import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from "./components/ui/provider.jsx";
import { AuthContextProvider } from './context/AuthContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider >
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>,
);
