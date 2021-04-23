import React from 'react';
import Profile from "../images/profile";
import heroImage from '../../images/hackericon.svg';

const Hero=() => {
        return ( 
        <div className="min-h-screen" >
            <section className="container-inner mx-auto flex flex-col justify-center text-center items-center min-h-2" >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-black dark:text-white" > I code simple things, and I love what I do . </h1> 
                <h5 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-light mb-10" > Web Designer, Web Developer &amp; Blogger </h5> 
                <div className='block' >
                    <Profile />
                </div>
            </section> 
            <section className="container-inner mx-auto" >
                <img className="mx-auto" src={ heroImage } width='600' height='300' alt='hero with computers' />
                <div className="bg-purple-450 h-1" style={{ width: "100%" }} />
            </section> 
            <section className="relative flex flex-col content-center justify-center" >
                <div className="relative text-dark dark:text-white" >
                    <div className="container-inner mx-auto" >
                        <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center" >
                            <div className="pt-2" >
                                <h1 className='font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-none sm:leading-tight md:leading-normal lg:leading-relaxed xl:leading-loose mb-4'> What 's up. I'm Bonvic, Nice to meet you </h1> 
                                <p className="font-light" >
                                    I 'm a Fullstack developer and a blogger.
                                    I enjoy turning complex problems into simple, beautiful and intuitive.
                                </p> 
                            </div> 
                        </div> 
                    </div> 
                </div>
            </section> 
        </div>
            )
        }

        export default Hero;
