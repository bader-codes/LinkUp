import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
      <RouterProvider router={routes}>
        <Layout />
      </RouterProvider>
    </div>
  )
}

export default App;