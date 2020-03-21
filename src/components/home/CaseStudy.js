import React, { useState } from 'react';
import Arrows from '../utils/arrows';
import projects from '../../data/projects';

const CaseStudy = () => {
  const [project, setProject] = useState(0);

  return (
    <div className="mx-auto my-16 flex flex-col h-lg relative bg-transparent">
      <div className="bg-purple-50 shadow-2xl rounded-t-lg overflow-hidden">
      { projects[project].image }
      </div>
      <div className="bg-purple-450 dark:bg-purple-700 text-white shadow-2xl flex-grow rounded-br-lg md:rounded-br-xl rounded-bl-lg flex flex-col md:flex-row justify-around items-center text-center">
          <div className="md:w-1/5 text-xs">
            <div className="text-xs md:text-base mt-2 md:mt-0 font-semibold">
              <span>{ project + 1 }</span>
              <span className="pl-3">of</span> 
              <span className="pl-3">{ projects.length }</span>
            </div>
            <div className="flex flex-row">
              <div className="turn-180 mt-4 mr-3">
                <Arrows handleClick={() => project > 0 && setProject(project - 1)} />
              </div>
              <div>
                <Arrows handleClick={() => project < (projects.length - 1) && setProject(project + 1)} />
              </div>
            </div>
          </div>
          <div className="md:w-1/5 flex flex-row md:flex-col">
            <h4 className="colon-after md:text-lg font-bold">Project</h4>
            <h6 className="ml-2"> { projects[project].name }</h6>
          </div>
          <div className="md:w-1/5 flex flex-row md:flex-col">
            <h4 className="colon-after md:text-lg font-bold">Idea</h4>
            <h6 className="ml-2">{ projects[project].idea }</h6>
          </div>
          <div className="md:w-2/5 mx-auto">
            <a type="button" href={projects[project].link} target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-grey-200 cursor-pointer text-purple-450 dark:text-purple-700 font-semibold py-2 my-2 md:py-5 px-4 border border-gray-400 rounded shadow w-32 md:w-48">Full Project</a>
          </div>
      </div>
    </div>
  )
}

export default CaseStudy;
