import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader, Pen, ChevronDown, ChevronUp, Trash2, CirclePlus } from 'lucide-react'

const MyConsultations = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, userData, getUserData, authLoading} = useContext(AppContext)

    /* To get all consultations */
    const [consultations, setConsultations] = useState([])

    /* To filter consultations */
    const filter = ['All', 'Completed', 'Pending']
    const [selectedFilter, setSelectedFilter] = useState('All')

    /* Expand consultations with longer description */
    const [expandedConsultationId, setExpandedConsultationId] = useState(null)

    /* Edit particular consultations */
    const [editConsultation, setEditConsultation] = useState(false)

    /* To check whether to show edit consultations window or not */
    const [editConsultationTitle, setEditConsultationTitle] = useState('')  /* To store title of selected consultations which user wants to edit */
    const [editConsultationDescription, setEditConsultationDescription] = useState('')  /* To store description of selected consultations which user wants to edit */
    const [editConsultationTitleCheck, setEditConsultationTitleCheck] = useState('')  /* To check where old and new title of selected consultations which user wants to edit are same or not */
    const [editConsultationDescriptionCheck, setEditConsultationDescriptionCheck] = useState('')  /* To check where old and new description of selected consultations which user wants to edit are same or not */
    const [editConsultationId, setEditConsultationId] = useState('')  /* To store id of selected consultations which user wants to edit */

    /* Create new consultations */
    const [createNewConsultation, setCreateNewConsultation] = useState(() => {
        const saved = localStorage.getItem('createNewConsultation-state')
        return saved === 'true'
    })  /* To check whether to show create new consultations window or not */
    const [createNewConsultationTitle, setCreateNewConsultationTitle] = useState('')  /* To store title of new consultations */
    const [createNewConsultationDescription, setCreateNewConsultationDescription] = useState('')  /* To store description of new consultations */
    const [createNewConsultationDate, setCreateNewConsultationDate] = useState('')  /* To store request date of new consultations */

    /* To get data of all consultations */
    const getConsultations = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/consultations/get-all-consultations/${userData.id}`)
            if (data.success) {
                setConsultations(data.consultations)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To mark consultations as completed */
    const completeConsultation = async (consultationsId, isConsultationCompleted) => {
        try {
            let data
            if (!isConsultationCompleted) {
                const response = await axios.patch(`${backendUrl}/api/consultations/complete-consultation/${consultationsId}`, {})
                data = response.data
            }
            else {
                const response = await axios.patch(`${backendUrl}/api/consultations/pending-consultation/${consultationsId}`, {})
                data = response.data
            }
            if (data.success) {
                toast.success(data.message)
                getConsultations()
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }
    

    /* To get data of selected consultations which user wants to edit */
    const getSelectedConsultation = async (consultationsId) => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/consultations/get-single-consultation/${consultationsId}`)
            if (data.success) {
                setEditConsultation(true)
                setEditConsultationTitle(data.consultations.title)
                setEditConsultationDescription(data.consultations.description)
                setEditConsultationTitleCheck(data.consultations.title)
                setEditConsultationDescriptionCheck(data.consultations.description)
                setEditConsultationId(consultationsId)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To edit selected consultations which user wants to edit */
    const editSelectedConsultation = async (e) => {
        e.preventDefault()
        try {
            if (editConsultationTitleCheck === editConsultationTitle && editConsultationDescriptionCheck === editConsultationDescription) {
                toast.error('Title and description are same as before.')
                return
            }
            
            const {data} = await axios.patch(`${backendUrl}/api/consultations/edit-consultation/${editConsultationId}`, {title: editConsultationTitle, description: editConsultationDescription})
            if (data.success) {
                getConsultations()
                toast.success(data.message)
                setEditConsultation(false)
                setEditConsultationTitle('')
                setEditConsultationDescription('')
                setEditConsultationTitleCheck('')
                setEditConsultationDescriptionCheck('')
                setCreateNewConsultation(false)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To create a new consultations */
    const createConsultation = async (e) => {
        try {
            e.preventDefault()

            const {data} = await axios.post(`${backendUrl}/api/consultations/create-consultation`, {title: createNewConsultationTitle, description: createNewConsultationDescription, date: new Date(createNewConsultationDate).getTime()})
            if (data.success) {
                getConsultations()
                toast.success(data.message)
                setCreateNewConsultationTitle('')
                setCreateNewConsultationDescription('')
                setCreateNewConsultationDate('')
                setCreateNewConsultation(false)
                setEditConsultation(false)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To delete a consultations */
    const deleteConsultation = async (consultationsId) => {
        try {
            const {data} = await axios.delete(`${backendUrl}/api/consultations/delete-consultation/${consultationsId}`)
            if (data.success) {
                toast.success(data.message)
                getConsultations()
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To convert time in 'dd/mm/yyyy hh:mm:ss am/pm' format */
    const convertTime = (t) => {
        const day = String(t.getDate()).padStart(2, '0')
        const month = String(t.getMonth() + 1).padStart(2, '0')
        const year = String(t.getFullYear()).slice(-2)

        let hour = t.getHours()
        const min = String(t.getMinutes()).padStart(2, '0')
        const sec = String(t.getSeconds()).padStart(2, '0')
        const ampm = hour >= 12 ? 'pm' : 'am'
        hour = String(hour % 12 || 12).padStart(2, '0')
        
        return `${day}/${month}/${year} ${hour}:${min}:${sec} ${ampm}`
    }

    useEffect(() => {
        if (authLoading) return
        if (!isLoggedIn) {
            navigate('/')
            return
        }
        getConsultations()
        getUserData()
    }, [authLoading, isLoggedIn])

    useEffect(() => {
        localStorage.setItem('createNewConsultation-state', createNewConsultation)
    }, [createNewConsultation])

    return (
        authLoading
        ? (
            <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                <h1 className='text-3xl text-center font-semibold text-black mb-5'>
                    Loading your page...
                </h1>
                <Loader className='animate-spin' />
            </div>
        ) :
        (
            <>
                <div className='flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400'>
                    <Navbar />
                    <div className='flex flex-col items-center mt-20 px-4 text-center p-10 w-[70%] sm:w-[80%] text-black text-sm'>
                        <h1 className='text-3xl text-center font-semibold'>
                            My Consultations
                        </h1>

                        <h1 className='text-2xl text-center font-semibold mb-6 cursor-pointer hover:scale-110 transition-all' onClick={() => setCreateNewConsultation(true)}>
                            <CirclePlus className='size-5 inline-block' /> Cerate a new consultation request
                        </h1>

                        {/* Consultation filter */}
                        <div className='hidden sm:flex gap-4 mb-6 justify-center'>
                            {
                                filter.map((f, index) => (
                                    <button
                                    key = {index}
                                    className={`px-4 py-2 rounded-full border border-indigo-600 transition-all ${selectedFilter === f ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-200 hover:scale-110 cursor-pointer'}`}
                                    onClick={() => setSelectedFilter(f)}>
                                        {f}
                                    </button>
                                ))
                            }
                        </div>
                        <div className='sm:hidden mb-6 justify-center'>
                            <select
                            className='w-full p-2 border border-indigo-600 rounded-lg text-white bg-indigo-600'
                            value={selectedFilter}
                            onChange={((e) => setSelectedFilter(e.target.value))}>
                                {
                                    filter.map((f, index) => (
                                        <option key={index} value={f} className='text-black bg-white'>
                                            {f}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
                            {/* Filter consultations according to selected type */}
                            {(() => {
                                const filteredConsultations = consultations.filter(consultations => {
                                    if (selectedFilter === 'Completed') return consultations.isCompleted
                                    if (selectedFilter === 'Pending') return !consultations.isCompleted
                                    return true
                                })

                                if (filteredConsultations.length === 0) {
                                    return (
                                        <p className='text-lg font-semibold text-black mt-10 col-span-full'>
                                            No consultations found
                                        </p>
                                    )
                                }

                                /* Map filtered consultations */
                                return filteredConsultations.map(consultations => (
                                    <div
                                    key={consultations._id}
                                    className={`${selectedFilter !== 'All' ? 'transition-opacity' : ''} p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:z-10 hover:scale-[1.03] transition-all w-full h-full`}>
                                        {/* Title */}
                                        <h3 className='font-semibold text-lg text-gray-800 border-b pb-2'>
                                            {consultations.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-gray-600 text-sm mt-2 transition-all duration-300 break-all whitespace-normal min-h-[50px]'>
                                            {
                                                expandedConsultationId === consultations._id ? consultations.description : consultations.description.length > 50 ? consultations.description.substring(0, 100) + '...' : consultations.description
                                            }
                                        </p>

                                        {/* Expand description */}
                                        {
                                            consultations.description?.length > 50 &&
                                            <div className='flex justify-center items-center mt-3 gap-2'>
                                                <p className='text-gray-600 cursor-pointer transition-all hover:scale-120' onClick={() => setExpandedConsultationId(expandedConsultationId === consultations._id ? null : consultations._id)}>
                                                    {
                                                        expandedConsultationId === consultations._id ? <ChevronUp /> : <ChevronDown />
                                                    }
                                                </p>
                                            </div>
                                        }

                                        {/* Checkbox to mark consultations as completed/pending */}
                                        <div className='flex justify-center items-center mt-3 transition-all'>
                                            <label className='flex items-center gap-2 cursor-pointer transition-all hover:scale-120'>
                                                <input
                                                type='checkbox'
                                                checked={consultations.isCompleted}
                                                onChange={() => completeConsultation(consultations._id, consultations.isCompleted)}
                                                className={`accent-green-600 cursor-pointer`} />
                                                <p className={`${consultations.isCompleted ? 'text-green-600' : 'text-yellow-600'} text-xs`}>
                                                    {consultations.isCompleted ? 'Completed' : 'Pending'}
                                                </p>
                                            </label>
                                        </div>

                                        {/* Consultation created at */}
                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                            <p className='text-xs text-gray-500'>
                                                Created at: {convertTime(new Date(consultations.createdAt))}
                                            </p>
                                        </div>

                                        {/* Consultation edited at */}
                                        {
                                            consultations.editedAt !== 0 && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-xs text-gray-500'>
                                                        Edited at: {convertTime(new Date(consultations.editedAt))}
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Consultation completed at */}
                                        {
                                            consultations.completedAt !== 0 && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-xs text-gray-500'>
                                                        Completed at: {convertTime(new Date(consultations.completedAt))}
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Edit consultations */}
                                        {
                                            !consultations.isCompleted && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-gray-500'>
                                                        <Pen className='size-5 cursor-pointer transition-all hover:scale-120'
                                                        onClick={() => {
                                                            setEditConsultation(true)
                                                            getSelectedConsultation(consultations._id)
                                                        }}/>
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Delete consultations */}
                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                            <p className='text-red-500'>
                                                <Trash2 className='size-5 cursor-pointer transition-all hover:scale-120' onClick={() => deleteConsultation(consultations._id)} />
                                            </p>
                                        </div>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </div>

                {
                    /* Gray backgroung while editing/craeting consultations */
                    (editConsultation || createNewConsultation) && (
                        <div
                        className='flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-400/60 z-99 fixed top-0 left-0'
                        onClick={() => {
                            setEditConsultation(false)
                            setCreateNewConsultation(false)
                        }}>
                            <div
                            className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm z-100'
                            onClick={(e) => e.stopPropagation()}>
                                {
                                    editConsultation
                                    ? (
                                        /* Edit consultations form */
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Edit consultation
                                            </h1>

                                            <form onSubmit={editSelectedConsultation}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={editConsultationTitle} onChange={e => setEditConsultationTitle(e.target.value)} className='bg-transparent outline-none text-white' placeholder='What is your consultation?' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <textarea value={editConsultationDescription} onChange={e => setEditConsultationDescription(e.target.value)} className='bg-transparent outline-none text-white w-full min-h-[200px] resize overflow-auto' placeholder='Descibe your queries' maxLength='200' required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
                                                    Save
                                                </button>
                                            </form>
                                        </>
                                    ) :
                                    (
                                        /* Create new consultations form */
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Create a new consultation request
                                            </h1>

                                            <form onSubmit={createConsultation}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={createNewConsultationTitle} onChange={e => setCreateNewConsultationTitle(e.target.value)} className='bg-transparent outline-none text-white w-full' placeholder='What is your consultation?' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <textarea value={createNewConsultationDescription} onChange={e => setCreateNewConsultationDescription(e.target.value)} className='bg-transparent outline-none text-white w-full min-h-[150px] resize overflow-auto' placeholder='Descibe your queries' maxLength='200' required />
                                                </div>

                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='date' value={createNewConsultationDate} onChange={e => setCreateNewConsultationDate(e.target.value)} className='bg-transparent outline-none text-white w-full' placeholder='Select date'
                                                    maxLength='20' min={new Date().toISOString().split('T')[0]} required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
                                                    Create
                                                </button>
                                            </form>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    )
                }
            </>
        )
    )
}

export default MyConsultations