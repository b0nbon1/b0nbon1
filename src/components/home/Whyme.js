import React from "react"
// import Thatsme from '../images/thatsme';
import { AiOutlineCheck } from "react-icons/ai";
// AiOutlineCheck

export default () => {
  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-black dark:text-white text-center mb-5">
        Why Me?
      </h1>
      <div className="flex flex-col md:flex-row justify-around md:justify-start">
        <div className="why-me mx-auto md:mx-0 md:-ml-10 md:max-w-md md:max-h-screen md:rounded-tr-lg md:rounded-br-xl rounded-lg" />
        <div className="w-full p-5 md:p-10">
          <h1 className="text-lg text-black tracking-wide dark:text-white text-justify md:text-left mb-5 md:-mt-10 font-thin">
            As a programmer, it is my job to put myself out of business. What I
            do today can be automated tomorrow.
          </h1>
          <div className="flex items-center justify-start mb-6">
              <AiOutlineCheck className='border-2 p-2 w-10 h-10 rounded-full text-purple-450 dark:text-purple-400 border-gray-400' />
            <span className="ml-8 text-xl">Problem Solver.</span>
          </div>
          <div className="text-xs md:text-base leading-loose ml-16 o-check">
            <h6>Research on the problems</h6>
            <h6>Seek permanent solutions</h6>
            <h6>Find common problems</h6>
            <h6>Re-define the problems</h6>
          </div>
          <div className="flex items-center justify-start my-6">
              <AiOutlineCheck className='border-2 p-2 w-10 h-10 rounded-full text-purple-450 dark:text-purple-400 border-gray-400' />
            <span className="ml-8 text-xl">Creative Ideas.</span>
          </div>
          <div className="text-xs md:text-base ml-16 o-check">
            <h6>Sensitive and Open to Experience, but Happy and Joyful</h6>
            <h6>Passionate and objective about my work</h6>
            <h6>Energetic, but Focused</h6>
            <h6>A realistic Dreamer</h6>
          </div>
        </div>
      </div>
    </div>
  )
}
