import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthContextProvider from './Context/AuthContext';
import Layout from './Components/Layout/Layout';
import Login from './Components/Login/Login';
import './App.css';

let routes = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { path: 'Login', element: <Login /> }
    ]
  }
]);

function App() {
  return (
    <div className='w-[95%] lg:w-[80%] md:w-[90%] mx-auto'>
      <AuthContextProvider>
        <RouterProvider router={routes}>
          <Layout />
        </RouterProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App;