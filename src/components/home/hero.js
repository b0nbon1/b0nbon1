import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Profile from "../images/profile";
import heroImage from '../../images/hackericon.svg';
import { MdImportantDevices } from "react-icons/md";
import { FaRegNewspaper } from "react-icons/fa";
import { GiPencilBrush } from "react-icons/gi";

const hero = () => {
  return (
    <div className="min-h-screen">
  <div className="container-inner mx-auto flex flex-col justify-center text-center items-center min-h-3">
    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-white">Web Designer, Web &amp; Mobile Developer &amp; Blogger</h1>
    <h5 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-light mb-10">I code simple things, and I love what I do.</h5>
    <div className='block'>
    <Profile />
    </div>
  </div>
  <div className="container-inner mx-auto">
    <img className="mx-auto" src={heroImage} width='600' height='300' alt='hero with computers' />
  </div>
  <div className="relative flex flex-col content-center justify-center -mt-px">
    <div className="relative bg-purple-450 dark:bg-purple-700 text-white min-h-2">
      <div className="container-inner mx-auto">
        <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center">
          <div className="pt-20">
          <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose mb-4'>What's up. I'm Bonvic, Nice to meet you</h1 >
            <p className="font-light">
              I'm a Full-stack developer and a writer, currently based in beautiful Kigali, Rwanda.
              I enjoy turning complex problems into simple, beautiful and intuitive. When I'm not coding, tweeting or writing, you'll find me watching movies, walking around the city or Reading books.
          </p>
        </div>
        </div>
      </div>
    </div>
    <div className="w-full min-h-2 z-50 -mt-16 sm:-mt-20 md:-mt-24 lg:-mt-32 xl:-mt-32">
      <div className="bg-white w-11/12 min-h-2 dark:bg-grey-900 shadow-2xl mx-auto rounded-lg">
        <div className="flex flex-col lg:flex-row justify-around min-h-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center">
        <div className="m lg:w-2/6 border-gray-300 dark:border-gray-800 p-16 border-b lg:border-r lg:border-b-0">
            <MdImportantDevices className='text-purple-450 dark:text-purple-200 align-middle mx-auto mb-8' size='5rem' />
            <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose mb-4'>Develop</h1>
            <p className='font-light text-lg min-h-sm'>I Build things on the web that are a little bit more complicated than your simple template-based blog. And also mobile apps to make your life easier.</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>Languages I can speak:</h2>
            <p className='font-light'>Python, PHP, CSS, JavaScript, HTML...</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>Dev Tools:</h2>
            <p className='font-light'>Visual Studio code</p>
            <p className='font-light'>Android Studio</p>
            <p className='font-light'>Figma</p>
            <p className='font-light'>AWS</p>
            <p className='font-light'>Github</p>
            <p className='font-light'>Terminal</p>
            <p className='font-hairline'>many more...</p>
          </div>
          <div className="m lg:w-2/6 border-gray-300 dark:border-gray-800 p-16 border-b lg:border-r lg:border-b-0">
            <GiPencilBrush className='text-purple-450 dark:text-purple-200 align-middle mx-auto mb-8' size='5rem' />
            <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose mb-4'>Web Design</h1>
            <p className='font-light text-lg min-h-sm'>I value simple content structure, clean design patterns, and thoughtful interactions.</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>Hey oh! paint what:</h2>
            <p className='font-light'>Apps, Web, UI, UX, mobile apps, more...</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>Dev Tools:</h2>
            <p className='font-light'>Visual Studio code</p>
            <p className='font-light'>Android Studio</p>
            <p className='font-light'>Figma</p>
            <p className='font-light'>AWS</p>
            <p className='font-light'>Github</p>
            <p className='font-light'>Terminal</p>
            <p className='font-hairline'>many more...</p>
          </div>
          <div className="m lg:w-2/6 p-16">
          <FaRegNewspaper className='text-purple-450 dark:text-purple-200 align-middle mx-auto mb-8' size='5rem' />
            <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose mb-4'>Blog</h1>
            <p className='font-light text-lg min-h-sm'>I genuinely care about people, and love helping fellow developers by providing and sharing articles to guiding them through developing.</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>What I Pen down:</h2>
            <p className='font-light'>Programming languages, Web frameworks, Designs, Random...</p>
            <h2 className='font-normal text-purple-450 dark:text-purple-200 my-6'>blogs Stats:</h2>
            <p className='font-light'>1 year of writing</p>
            <p className='font-light'>5 posts</p>
            <p className='font-light'>12 comments</p>
            <p className='font-light'>100 views</p>
            <p className='font-light'>300 likes</p>
          </div>
        </div>
      </div>
    </div>
    <div className="min-h-screen dark:bg-grey-900 relative"></div>
  </div>
  </div>
  )
}

export default hero
