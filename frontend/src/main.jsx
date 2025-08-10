import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './components/Login/Login.jsx'
import Home from './components/Home/Home.jsx'
import Register from './components/Register/Register.jsx'
import { AuthProvider } from './components/AuthContext/AuthContext.jsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'
import MyProfile from './components/MyProfile/MyProfile.jsx'
import { CreateProfile } from './components/CreateProfile/CreateProfile.jsx'
import { EditProfile } from './components/EditProfile/EditProfile.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/profile' element={
        <PrivateRoute>  
          <CreateProfile/>  
        </PrivateRoute>
      }/>
      
      <Route path='/editProfile/:userId' element={
        <PrivateRoute>  
          <EditProfile/>  
        </PrivateRoute>
      }/>
      
      
      <Route path='/profile/:userId' element={
        <PrivateRoute>  
          <MyProfile/>  
        </PrivateRoute>}/>
      </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
