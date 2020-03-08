import React from "react"
import { FaLinkedinIn, FaTwitter, FaEnvelope, FaDev, FaGithub, FaRegCopyright } from "react-icons/fa";

// Todo: remove hard coded dates
export default () => {
  return (
    <footer className="bg-purple-450 dark:bg-purple-700 text-gray-200 w-full">
      <div className="container-inner mx-auto">
        <div className="flex flex-col items-center justify-center py-8 min-h-3">
          <h1 className="font-black text-4xl">&lt;B /&gt;</h1>
          <div className="md:w-1/3 text-center my-5 mx-auto">
            <span className="font-thin text-2xl">
              Living, learning, & leveling up one day at a time.
            </span>
          </div>
          <div className="w-100 my-10 flex-row flex">
            <a href="https://linkedin.com/in/bonvic-bundi/" target="_blank" rel="noopener noreferrer" className="border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"><FaLinkedinIn className="border-gray-100 p-1 w-6 h-6" /></a>
            <a href="https://twitter.com/messages/compose?recipient_id=1089388990162259969" target="_blank" rel="noopener noreferrer" className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"><FaTwitter className="border-gray-100 p-1 w-6 h-6" /></a>
            <a href="mailto:nyabuyabonvic@gmail.com" target="_blank" rel="noopener noreferrer" className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"><FaEnvelope className="border-gray-100 p-1 w-6 h-6" /></a>
            <a href="https://dev.to/b0nbon1" target="_blank" rel="noopener noreferrer" className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"><FaDev className="border-gray-100 p-1 w-6 h-6" /></a>
            <a href="https://github.com/b0nbon1" target="_blank" rel="noopener noreferrer" className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"><FaGithub className="border-gray-100 p-1 w-6 h-6" /></a>
          </div>
          <p className="flex my-10">
          Handcrafted by me <span className="px-3"><FaRegCopyright className="align-middle copy-right" /></span> twentytwenty
          </p>
          <p>Made with <span role="img" aria-label="purple heart">💜</span> Gatsby</p>
        </div>
      </div>
    </footer>
  )
}

// Username
// @Bonvic7
// ·
// User ID: 1089388990162259969
