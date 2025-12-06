import React , { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const Header = () => {
    const [swiperLoaded, setSwiperLoaded] = useState(false)
    const [benefitsLoaded, setBenefitsLoaded] = useState(false)
    const swiperImages = [
        'https://images.unsplash.com/photo-1540420773420-3366772f4999',
        'https://images.unsplash.com/photo-1543362906-acfc16c67564',
        'https://images.unsplash.com/photo-1467453678174-768ec283a940',
    ]

    const benefits = [
        {
            title: 'Boost Mental Health',
            desc: 'Regular physical activity reduces stress, anxiety, and boosts mood through the release of endorphins.',
            img: 'https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c',
        },
        {
            title: 'Increase Energy Levels',
            desc: 'Healthy habits strengthen your body, improve sleep quality, and increase overall daily productivity.',
            img: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15',
        },
        {
            title: 'Reduce Chronic Disease Risk',
            desc: 'Proper nutrition and movement help prevent diabetes, hypertension, and heart disease.',
            img: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7',
        },
    ]

    const goals = [
        'Walk 8,000–10,000 steps daily',
        'Drink at least 8 glasses of water',
        'Exercise 30 minutes a day',
        'Practice meditation or journaling',
        'Eat fruits and vegetables daily',
        'Get 7–8 hours of sleep consistently',
    ]

    return (
        <div className='min-h-screen w-full bg-linear-to-br from-blue-200 to-purple-400 pb-16'>
            
            {/* Swiper */}
            <div className='w-full h-[50vh] sm:h-[60vh]'>
                <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{clickable: true}}
                autoplay={{delay: 2500, disableOnInteraction: false}}
                className='w-full h-full'
                >
                    {
                        swiperImages.map((img, i) => (
                            <SwiperSlide key={i}>
                                <img
                                src={img} alt='health'
                                className={`w-full h-full object-cover ${swiperLoaded ? 'opacity-100' : 'opacity-0'}`}
                                loading='lazy' onLoad={() => setSwiperLoaded(true)}/>
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            </div>

            {/* Heading */}
            <div className='text-center mt-10 px-6'>
                <h1 className='text-4xl font-extrabold text-white drop-shadow'>
                    Build a Healthier & Happier You
                </h1>
                <p className='text-white mt-3 text-lg max-w-2xl mx-auto'>
                    Small consistent steps toward your well-being can transform your mental and physical health.
                </p>
            </div>

            {/* Benefits */}
            <div className='mt-14 px-6 sm:px-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-10'>
                {
                    benefits.map((b, i) => (
                        <div
                        key={i}
                        className='bg-slate-900 text-indigo-300 rounded-lg shadow-lg p-5 hover:scale-105 transition-all'
                        >
                            <img
                            src={b.img}
                            className={`rounded-lg h-40 w-full object-cover mb-4 ${benefitsLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading='lazy' onLoad={() => setBenefitsLoaded(true)}/>
                            <h3 className='text-white text-xl font-bold'>{b.title}</h3>
                            <p className='mt-2'>{b.desc}</p>
                        </div>
                    ))
                }
            </div>

            {/* Goals */}
            <div className='mt-20 px-6 sm:px-20'>
                <h2 className='text-3xl text-center font-extrabold text-white'>
                    Simple Daily Goals To Improve Your Health
                </h2>

                <div className='bg-slate-900 text-indigo-300 rounded-lg shadow-lg max-w-2xl mx-auto p-6 mt-6'>
                    <ul className='space-y-4'>
                        {
                            goals.map((g, i) => (
                                <li key={i} className='flex gap-3 items-center hover:scale-105 transition-all'>
                                    <CheckCircle className='text-green-400' />
                                    <span>{g}</span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header
