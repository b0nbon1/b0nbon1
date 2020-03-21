import React from "react";
import {
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaDev,
  FaGithub,
  FaRegCopyright,
} from "react-icons/fa";
import { Link } from "gatsby";
import Logo from "../images/logo";

// Todo: remove hard coded dates
export default () => {
  return (
    <>
      <section className="container-project bg-gray-900 dark:bg-gray-300 -mb-24 mx-auto rounded-lg z-50 shadow-2xl">
        <div className="text-white dark:text-gray-900 flex flex-col lg:flex-row justify-around items-center min-h-1">
          <h4 className="text-center my-2 font-bold text-lg md:text-2xl">Start a project</h4>
          <h6 className="text-center my-2 text-base md:text-lg w-5/6 lg:w-1/3 font-light">Interested in working together? We should queue up a chat. I’ll buy the coffee.</h6>
          <button className="btn my-2 btn-transparent"><Link to='/'>Let's do this</Link></button>
        </div>
      </section>
      <footer className="bg-purple-450 dark:bg-purple-700 text-gray-200 w-full">
        <div className="container-inner mx-auto">
          <div className="flex flex-col items-center justify-center py-8 min-h-3 mt-20">
            <div className='resize-footer-logo'><Logo /></div>
            <div className="md:w-1/3 text-center my-5 mx-auto">
              <span className="font-thin text-2xl">
                Living, learning, & leveling up one day at a time.
              </span>
            </div>
            <div className="w-100 my-10 flex-row flex">
              <a
                href="https://linkedin.com/in/bonvic-bundi/"
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"
              >
                <FaLinkedinIn className="border-gray-100 p-1 w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/messages/compose?recipient_id=1089388990162259969"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"
              >
                <FaTwitter className="border-gray-100 p-1 w-6 h-6" />
              </a>
              <a
                href="mailto:nyabuyabonvic@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"
              >
                <FaEnvelope className="border-gray-100 p-1 w-6 h-6" />
              </a>
              <a
                href="https://dev.to/b0nbon1"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"
              >
                <FaDev className="border-gray-100 p-1 w-6 h-6" />
              </a>
              <a
                href="https://github.com/b0nbon1"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-5 md:ml-16 border rounded-full p-3 text-white hover:bg-white hover:text-purple-450 dark:hover:text-purple-700"
              >
                <FaGithub className="border-gray-100 p-1 w-6 h-6" />
              </a>
            </div>
            <p className="flex my-10">
              Handcrafted by me{" "}
              <span className="px-3">
                <FaRegCopyright className="align-middle copy-right" />
              </span>{" "}
              twentytwenty
            </p>
            <p>
              Made with{" "}
              <span role="img" aria-label="purple heart">
                💜
              </span>{" "}
              Gatsby
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
