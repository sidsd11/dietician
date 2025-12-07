import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import MyConsultations from './pages/MyConsultations'
import MyGoals from './pages/MyGoals'

const App = () => {
    return (
        <div>
            <ToastContainer />
            <Routes>
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/my-consultations' element={<MyConsultations />} />
                <Route path='/my-goals' element={<MyGoals />} />
                <Route path='*' element={<Navigate to='/home' replace />} />
            </Routes>
        </div>
    )
}

export default App