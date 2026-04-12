import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthContextProvider from './Context/AuthContext';
import Layout from './Components/Layout/Layout';
import Signup from './Components/Signup/Signup';
import Login from './Components/Login/Login';
import './App.css';

let routes = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ]
  }
]);

function App() {
  return (
    <div>
      <AuthContextProvider>
        <RouterProvider router={routes}>
          <Layout />
        </RouterProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App;