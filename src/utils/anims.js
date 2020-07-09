import gsap from 'gsap';

export const test = (entry, node) => {
  return gsap.from(
    node.querySelectorAll('h2, p, a, pre'),
    { 
      opacity: 0, 
      y: '+=50',
      duration: 1,
      stagger: 0.1,
    },
  )
}

export const verticalAnimation = ({ length }, direction, transitionCover, layoutContents) => {
  const directionTo = direction === 'up' ? '-100%' : '100%'
  const directionFrom = direction === 'up' ? '100%' : '-100%'

  // convert ms to s for gsap
  const seconds = length

  return gsap.timeline()
    .set(transitionCover, { y: directionFrom })
    .to(transitionCover, {
      y: '0%',
      ease: "power1.easeInOut",
      duration: seconds / 2,
    })
    .set(layoutContents, { opacity: 0 })
    .to(transitionCover, {
      y: directionTo,
      ease: "power1.easeIn",
      duration: seconds / 2,
    })
}
