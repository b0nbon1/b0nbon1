// chained promise example
const wait = (time) => new Promise((resolve, reject) => {
  if(typeof time === "number") {
    setTimeout(resolve, time)
  } else {
    reject("time is not a number");
  }
  });
  
  wait("3000")
  .then(() => console.log("hello"))
  .catch(e => console.log(e))
  .finally(() => console.log("we're done here"));