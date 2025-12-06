import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader, Mail, Lock } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'

const ResetPassword = () => {    
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const {backendUrl, loading, userData} = useContext(AppContext)

    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [isEmailSent, setIsEmailSent] = useState(() => {
        const saved = localStorage.getItem('isEmailSent-state')
        return saved === 'true'
    })
    const [otp, setOtp] = useState(0)
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(() => {
        const saved = localStorage.getItem('isOtpSubmitted-state')
        return saved === 'true'
    })

    const inputRefs = React.useRef([])

    const handleInput = (e, index) => {
        if(e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if(inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }

    const onSubmitEmail = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
            if (data.success) {
                toast.success(data.message)
                setIsEmailSent(true)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    const onSubmitOtp = async (e) => {
        e.preventDefault()
        const otpArray = inputRefs.current.map(e => e.value)
        setOtp(otpArray.join(''))
        setIsOtpSubmitted(true)
    }

    const onSubmitNewPassword = async (e) => {
        e.preventDefault()
        try {
            const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
            if (data.success) {
                toast.success(data.message)
                setEmail('')
                setNewPassword('')
                setIsEmailSent(false)
                setOtp(0)
                setIsOtpSubmitted(false)
                navigate('/login')
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        localStorage.setItem('isEmailSent-state', isEmailSent)
        localStorage.setItem('isOtpSubmitted-state', isOtpSubmitted)
    }, [isEmailSent, isOtpSubmitted])

    return (
        loading
        ? (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <h1 className='text-3xl text-center font-semibold text-black mb-5'>
                    Loading your page...
                </h1>
                <Loader className='animate-spin'/>
            </div>
        ) :
        (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <Navbar />
                {
                    !isEmailSent && (
                        <div className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm'>
                            <h1 className='text-3xl text-center font-semibold text-white mb-6'>
                                Reset Password
                            </h1>

                            <form onSubmit={onSubmitEmail}>
                                {/* Email */}
                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                    <Mail className='bg-transparent'/>
                                    <input type='text' onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none text-white w-full' placeholder='Enter your email' required/>
                                </div>

                                {/* Submit */}
                                <button className='w-full py-2.5 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer hover:scale-110 transition-all'>
                                    Send OTP
                                </button>
                            </form>
                        </div>
                    )
                }

                {
                    isEmailSent && !isOtpSubmitted && (
                        <div className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm'>
                            <h1 className='text-3xl text-center font-semibold text-white mb-6'>
                                Email Verify OTP
                            </h1>

                            <form onSubmit={onSubmitOtp}>
                                {/* OTP */}
                                <p className='text-center mb-6 text-indigo-300'>
                                    Enter the 6 digit OTP sent on your registered email.
                                </p>
                                <div className='flex justify-between mb-8' onPaste={handlePaste}>
                                    {Array(6).fill(0).map((_, index) => (
                                        <input
                                            type='text' maxLength='1' key={index} required
                                            className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                                            ref={e => inputRefs.current[index] = e}
                                            onInput={(e) => handleInput(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    ))}
                                </div>

                                {/* Submit */}
                                <button className='w-full py-2.5 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer hover:scale-110 transition-all'>
                                    Submit
                                </button>
                            </form>
                        </div>
                    )
                }

                {
                    isEmailSent && isOtpSubmitted && (
                        <div className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm'>
                            <h1 className='text-3xl text-center font-semibold text-white mb-6'>
                                New Password
                            </h1>

                            <form onSubmit={onSubmitNewPassword}>
                                {/* Password */}
                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                    <Lock className='bg-transparent'/>
                                    <input type='password' onChange={e => setNewPassword(e.target.value)} value={newPassword} className='bg-transparent outline-none text-white w-full' placeholder='Enter your password' required/>
                                </div>

                                {/* Submit */}
                                <button className='w-full py-2.5 rounded-full bg-linear-to-br from-indigo-500 to-indigo-900 text-white font-medium cursor-pointer hover:scale-110 transition-all'>
                                    Reset Password
                                </button>
                            </form>
                        </div>
                    )
                }
            </div>
        )
    )
}

export default ResetPassword