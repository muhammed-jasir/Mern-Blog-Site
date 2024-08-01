import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
    return (
        <div className='bg-slate-100 dark:bg-slate-700 my-10 w-full flex flex-col sm:flex-row gap-8 p-5 border border-slate-500 justify-center items-center rounded-md '>
            <div className='flex-1 flex justify-center items-center flex-col text-center'>
                <h2 className='mb-3 text-2xl '>
                    Want to learn more about JavaScript?
                </h2>
                <p className='mb-3 text-lg'>
                    Learn JavaScript from scratch, build projects, and explore the world of web development
                </p>
                <p className='mb-3'>
                    Start Learning JavaScript
                </p>
                <Button
                    gradientDuoTone='greenToBlue'
                    outline
                    className='mb-3 max-sm:w-full'
                >
                    <a href="https://www.javascript.com/" target="_blank" rel="noopener noreferrer">
                        <span className="ml-2 text-sm font-medium">
                            Learn JavaScript
                        </span>
                    </a>
                </Button>
            </div>
            <div className=''>
                <img
                    src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZq_FDxj8jleGCeDXaWUdeuD1XGtvc2wG0Vg&s'
                    alt='javascript'
                ></img>
            </div>
        </div>
    )
}

export default CallToAction