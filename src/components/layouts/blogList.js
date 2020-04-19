import React, { useState, useRef, useEffect } from 'react';
import { Link } from "gatsby";
import Logo from "../images/logo";
import Header from './header';

const numberList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41]

export default ({ children }) => {
  const wholeWindow = useRef()
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(wholeWindow.current.getBoundingClientRect().height)
  }, [height])

  return (
    <div className='text-gray-800 bg-white dark:bg-gray-900 dark:text-white leading-normal flex flex-col min-h-full font-mono' ref={wholeWindow}>
      <aside
      style={{ minHeight: `${height}px` }}
      className="bg-gray-200 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 shadow-lg w-10 flex flex-col absolute">
        <svg version="1.1" viewBox="0 0 24 24" className="line-numbers_icon w-8 h-8 my-3 self-center text-gray-500 svg-fill" style={{ fill: 'currentColor', stroke: 'none' }}>
          <path pid="0" d="M7 11h10a1 1 0 010 2H7a1 1 0 010-2zM5 6h14a1 1 0 010 2H5a1 1 0 110-2zm0 10h14a1 1 0 010 2H5a1 1 0 010-2z" _fill="#FFF" fillRule="evenodd">
          </path>
        </svg>
        <div className="line-numbers__lines">
          {numberList.map((number) => (
            <pre key={number} className="micro2 py-1">{ number }</pre>
          )
          )}
        </div>
        <svg width="10" height="12" viewBox="0 0 10 12" xmlns="http://www.w3.org/2000/svg" className="line-numbers__collapse">
          <g fill="none" fillRule="evenodd">
            <g>
              <path d="M0 0h10v7.826L5 12 0 7.826z" className="fill"></path>
              <path d="M.5.5v7.092L5 11.35 9.5 7.59V.5h-9z" className="stroke"></path>
            </g>
            <path d="M3 5h4" strokeLinecap="square" className="stroke"></path>
          </g>
        </svg>
      </aside>
      <div className="flex-grow">
        <main>{ children }</main>
      </div>
    </div>
  )
}
