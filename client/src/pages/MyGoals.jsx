import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Loader, Pen, ChevronDown, ChevronUp, Trash2, CirclePlus } from 'lucide-react'

const MyGoals = () => {
    axios.defaults.withCredentials = true

    const navigate = useNavigate()
    const {backendUrl, isLoggedIn, userData, getUserData, authLoading} = useContext(AppContext)

    /* To get all goals */
    const [goals, setGoals] = useState([])

    /* To filter goals */
    const filter = ['All', 'Completed', 'Pending']
    const [selectedFilter, setSelectedFilter] = useState('All')

    /* Expand goals with longer description */
    const [expandedGoalId, setExpandedGoalId] = useState(null)

    /* Edit particular goals */
    const [editGoal, setEditGoal] = useState(false)

    /* To check whether to show edit goals window or not */
    const [EditGoalTitle, setEditGoalTitle] = useState('')  /* To store title of selected goals which user wants to edit */
    const [editGoalDescription, setEditGoalDescription] = useState('')  /* To store description of selected goals which user wants to edit */
    const [EditGoalTitleCheck, setEditGoalTitleCheck] = useState('')  /* To check where old and new title of selected goals which user wants to edit are same or not */
    const [editGoalDescriptionCheck, setEditGoalDescriptionCheck] = useState('')  /* To check where old and new description of selected goals which user wants to edit are same or not */
    const [editGoalDateCheck, setEditGoalDateCheck] = useState('')  /* To check where old and new date of selected goals which user wants to edit are same or not */
    const [editGoalId, setEditGoalId] = useState('')  /* To store id of selected goals which user wants to edit */

    /* Create new goals */
    const [createNewGoal, setCreateNewGoal] = useState(() => {
        const saved = localStorage.getItem('createNewGoal-state')
        return saved === 'true'
    })  /* To check whether to show create new goals window or not */
    const [createNewGoalTitle, setCreateNewGoalTitle] = useState('')  /* To store title of new goals */
    const [createNewGoalDescription, setCreateNewGoalDescription] = useState('')  /* To store description of new goals */
    const [createNewGoalDate, setCreateNewGoalDate] = useState('')  /* To store request date of new goals */

    /* To get data of all goals */
    const getGoals = async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/goals/get-all-goals/${userData.id}`)
            if (data.success) {
                setGoals(data.goals)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To mark goals as completed */
    const completeGoal = async (goalsId, isGoalCompleted) => {
        try {
            let data
            if (!isGoalCompleted) {
                const response = await axios.patch(`${backendUrl}/api/goals/complete-goal/${goalsId}`, {})
                data = response.data
            }
            else {
                const response = await axios.patch(`${backendUrl}/api/goals/pending-goal/${goalsId}`, {})
                data = response.data
            }
            if (data.success) {
                toast.success(data.message)
                getGoals()
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }
    

    /* To get data of selected goals which user wants to edit */
    const getSelectedGoal = async (goalsId) => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/goals/get-single-goal/${goalsId}`)
            if (data.success) {
                setEditGoal(true)
                setEditGoalTitle(data.goals.title)
                setEditGoalDescription(data.goals.description)
                setEditGoalTitleCheck(data.goals.title)
                setEditGoalDescriptionCheck(data.goals.description)
                setEditGoalId(goalsId)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To edit selected goals which user wants to edit */
    const editSelectedGoal = async (e) => {
        e.preventDefault()
        try {
            if (EditGoalTitleCheck === EditGoalTitle && editGoalDescriptionCheck === editGoalDescription) {
                toast.error('Title and description are same as before.')
                return
            }
            
            const {data} = await axios.patch(`${backendUrl}/api/goals/edit-goal/${editGoalId}`, {title: EditGoalTitle, description: editGoalDescription})
            if (data.success) {
                getGoals()
                toast.success(data.message)
                setEditGoal(false)
                setEditGoalTitle('')
                setEditGoalDescription('')
                setEditGoalTitleCheck('')
                setEditGoalDescriptionCheck('')
                setCreateNewGoal(false)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To create a new goals */
    const createGoal = async (e) => {
        try {
            e.preventDefault()

            const {data} = await axios.post(`${backendUrl}/api/goals/create-goal`, {title: createNewGoalTitle, description: createNewGoalDescription, date: new Date(createNewGoalDate).getTime()})
            if (data.success) {
                getGoals()
                toast.success(data.message)
                setCreateNewGoalTitle('')
                setCreateNewGoalDescription('')
                setCreateNewGoalDate('')
                setCreateNewGoal(false)
                setEditGoal(false)
            }
            else {
                toast.error(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
    }

    /* To delete a goals */
    const deleteGoal = async (goalsId) => {
        try {
            const {data} = await axios.delete(`${backendUrl}/api/goals/delete-goal/${goalsId}`)
            if (data.success) {
                toast.success(data.message)
                getGoals()
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
        getGoals()
        getUserData()
    }, [authLoading, isLoggedIn])

    useEffect(() => {
        localStorage.setItem('createNewGoal-state', createNewGoal)
    }, [createNewGoal])

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
                            My Goals
                        </h1>

                        <h1 className='text-2xl text-center font-semibold mb-6 cursor-pointer hover:scale-110 transition-all' onClick={() => setCreateNewGoal(true)}>
                            <CirclePlus className='size-5 inline-block' /> Setup a new goal target
                        </h1>

                        {/* Goal filter */}
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
                            {/* Filter goals according to selected type */}
                            {(() => {
                                const filteredGoals = goals.filter(goals => {
                                    if (selectedFilter === 'Completed') return goals.isCompleted
                                    if (selectedFilter === 'Pending') return !goals.isCompleted
                                    return true
                                })

                                if (filteredGoals.length === 0) {
                                    return (
                                        <p className='text-lg font-semibold text-black mt-10 col-span-full'>
                                            No goals found
                                        </p>
                                    )
                                }

                                /* Map filtered goals */
                                return filteredGoals.map(goals => (
                                    <div
                                    key={goals._id}
                                    className={`${selectedFilter !== 'All' ? 'transition-opacity' : ''} p-4 bg-white shadow-md rounded-lg hover:shadow-xl hover:z-10 hover:scale-[1.03] transition-all w-full h-full`}>
                                        {/* Title */}
                                        <h3 className='font-semibold text-lg text-gray-800 border-b pb-2'>
                                            {goals.title}
                                        </h3>

                                        {/* Description */}
                                        <p className='text-gray-600 text-sm mt-2 transition-all duration-300 break-all whitespace-normal min-h-[50px]'>
                                            {
                                                expandedGoalId === goals._id ? goals.description : goals.description.length > 50 ? goals.description.substring(0, 100) + '...' : goals.description
                                            }
                                        </p>

                                        {/* Expand description */}
                                        {
                                            goals.description?.length > 50 &&
                                            <div className='flex justify-center items-center mt-3 gap-2'>
                                                <p className='text-gray-600 cursor-pointer transition-all hover:scale-120' onClick={() => setExpandedGoalId(expandedGoalId === goals._id ? null : goals._id)}>
                                                    {
                                                        expandedGoalId === goals._id ? <ChevronUp /> : <ChevronDown />
                                                    }
                                                </p>
                                            </div>
                                        }

                                        {/* Checkbox to mark goals as completed/pending */}
                                        <div className='flex justify-center items-center mt-3 transition-all'>
                                            <label className='flex items-center gap-2 cursor-pointer transition-all hover:scale-120'>
                                                <input
                                                type='checkbox'
                                                checked={goals.isCompleted}
                                                onChange={() => completeGoal(goals._id, goals.isCompleted)}
                                                className={`accent-green-600 cursor-pointer`} />
                                                <p className={`${goals.isCompleted ? 'text-green-600' : 'text-yellow-600'} text-xs`}>
                                                    {goals.isCompleted ? 'Completed' : 'Pending'}
                                                </p>
                                            </label>
                                        </div>

                                        {/* Goal created at */}
                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                            <p className='text-xs text-gray-500'>
                                                Created at: {convertTime(new Date(goals.createdAt))}
                                            </p>
                                        </div>

                                        {/* Goal edited at */}
                                        {
                                            goals.editedAt !== 0 && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-xs text-gray-500'>
                                                        Edited at: {convertTime(new Date(goals.editedAt))}
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Goal completed at */}
                                        {
                                            goals.completedAt !== 0 && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-xs text-gray-500'>
                                                        Completed at: {convertTime(new Date(goals.completedAt))}
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Edit goals */}
                                        {
                                            !goals.isCompleted && (
                                                <div className='flex justify-center items-center mt-3 gap-2'>
                                                    <p className='text-gray-500'>
                                                        <Pen className='size-5 cursor-pointer transition-all hover:scale-120'
                                                        onClick={() => {
                                                            setEditGoal(true)
                                                            getSelectedGoal(goals._id)
                                                        }}/>
                                                    </p>
                                                </div>
                                            )
                                        }

                                        {/* Delete goals */}
                                        <div className='flex justify-center items-center mt-3 gap-2'>
                                            <p className='text-red-500'>
                                                <Trash2 className='size-5 cursor-pointer transition-all hover:scale-120' onClick={() => deleteGoal(goals._id)} />
                                            </p>
                                        </div>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </div>

                {
                    /* Gray backgroung while editing/craeting goals */
                    (editGoal || createNewGoal) && (
                        <div
                        className='flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-400/60 z-99 fixed top-0 left-0'
                        onClick={() => {
                            setEditGoal(false)
                            setCreateNewGoal(false)
                        }}>
                            <div
                            className='flex flex-col items-center mt-20 px-4 text-center bg-slate-900 p-10 rounded-lg shadow-lg w-[70%] sm:w-96 text-indigo-300 text-sm z-100'
                            onClick={(e) => e.stopPropagation()}>
                                {
                                    editGoal
                                    ? (
                                        /* Edit goals form */
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Edit goal
                                            </h1>

                                            <form onSubmit={editSelectedGoal}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={EditGoalTitle} onChange={e => setEditGoalTitle(e.target.value)} className='bg-transparent outline-none text-white' placeholder='What is your goal?' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <textarea value={editGoalDescription} onChange={e => setEditGoalDescription(e.target.value)} className='bg-transparent outline-none text-white w-full min-h-[200px] resize overflow-auto' placeholder='Descibe your goal' maxLength='200' required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
                                                    Save
                                                </button>
                                            </form>
                                        </>
                                    ) :
                                    (
                                        /* Create new goals form */
                                        <>
                                            <h1 className='text-3xl text-center font-semibold text-white mb-5'>
                                                Setup a new goal target
                                            </h1>

                                            <form onSubmit={createGoal}>
                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='text' value={createNewGoalTitle} onChange={e => setCreateNewGoalTitle(e.target.value)} className='bg-transparent outline-none text-white w-full' placeholder='What is your goal?' maxLength='20' required />
                                                </div>

                                                <div className='mb-4 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <textarea value={createNewGoalDescription} onChange={e => setCreateNewGoalDescription(e.target.value)} className='bg-transparent outline-none text-white w-full min-h-[150px] resize overflow-auto' placeholder='Descibe your goal' maxLength='200' required />
                                                </div>

                                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-lg bg-[#333A5C]'>
                                                    <input type='date' value={createNewGoalDate} onChange={e => setCreateNewGoalDate(e.target.value)} className='bg-transparent outline-none text-white w-full' placeholder='Select date'
                                                    maxLength='20' min={new Date().toISOString().split('T')[0]} required />
                                                </div>

                                                <button className='w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-900 text-white rounded-full cursor-pointer'>
                                                    Setup
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

export default MyGoals