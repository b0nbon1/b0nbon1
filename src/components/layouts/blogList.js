import React from 'react';
import Header from './header';
import Footer from './footer.js';

export default ({ children }) => {
  return (
    <>
    <div className='text-gray-800 bg-white dark:bg-gray-900 dark:text-white leading-normal flex flex-col min-h-full font-mono'>
      <Header />
      <div className="flex-grow  mb-20">
        <main>{ children }</main>
      </div>
        <Footer />
    </div>
    </>
  )
}
