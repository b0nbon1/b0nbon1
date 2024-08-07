---
title: Asynchronous and Synchronous Programming javascript with examples
featured: False
date: 2021-06-11T00:00:00+0300
description: Asynchronous vs. Synchronous Programming in javascript, uses of  ~ Bonvic Bundi
tags: 
    - Javascript
    - async
    - nodejs
author: Bonvic Bundi
---

<br />
Asynchronous programming allows you to offload work. That way you can perform that work without blocking the main process/thread (for instance navigation and utilization of the app). It’s often related to parallelization, the art of performing independent tasks in parallel, that is achieved by using asynchronous programming.

With parallelization, you can break what is normally processed sequentially, meaning break it into smaller pieces that can run independently and simultaneously. Parallelization is not just related to processes and capabilities but also with the way systems and software are designed. The biggest advantage of applying parallelization principles is that you can achieve the outcomes much faster and it makes your system easier to evolve and more resilient to failure.

Pretty cool, right? However, not all processes should follow parallelization principles and execute asynchronously. In this blog post, I’ll explain when you should apply asynchronous programming and when sticking to synchronous execution is the best option.

## Asynchronous vs. Synchronous Programming in Javascript
**Synchronous JavaScript**: As the name suggests synchronous means to be in a sequence, i.e. every statement of the code gets executed one by one. So, basically a statement has to wait for the earlier statement to get executed.
Let us understand this with the help of an example.

```js
  console.log("First Statement");

  console.log("Second statement");

  console.log("Last statement");

  //output
  // First Statement
  // Second statement
  // Last statement
```

From the above example, operations tasks are performed one at a time and only when one is completed, the following is unblocked. In other words, you need to wait for a task to finish to move to the next one. 


**Asynchronous JavaScript**: Asynchronous code allows the program to be executed immediately where the synchronous code will block further execution of the remaining code until it finishes the current one. This may not look like a big problem but when you see it in a bigger picture you realize that it may lead to delaying the User Interface.

```js
  console.log("First Statement");

  setTimeout(() => {
        console.log("Second statement");
  }, 2000);

  console.log("Last statement");

  //output
  // First Statement
  // Last statement
  // Second statement
```

So, what the code does is first it logs in Hi then rather than executing the setTimeout function it logs in End and then it runs the setTimeout function.

At first, as usual, the Fist statement got logged in. As we use browsers to run JavaScript, there are the web APIs that handle these things for users. So, what JavaScript does is, it passes the setTimeout function in such web API and then we keep on running our code as usual. So it does not block the rest of the code from executing and after all the code its execution, it gets pushed to the call stack and then finally gets executed. This is what happens in asynchronous JavaScript.

from the above example, asynchronous operations, on the other hand, you can move to another task before the previous one finishes. This way, with asynchronous programming you’re able to deal with multiple requests simultaneously, thus completing more tasks in a much shorter period of time.   

![Asynchronous vs synchronous image](/asynchronous-vs-synchronous-programming.png)


## Understand Promises in asynchronous Programming

**A Promise** is an object that may produce a single value some time in the future: either a resolved value, or a reason that it’s not resolved (e.g., a network error occurred). A promise may be in one of 3 possible states: fulfilled, rejected, or pending. Promise users can attach callbacks to handle the fulfilled value or the reason for rejection.

A Promise is in one of these states:

- *pending*: initial state, neither fulfilled nor rejected.
- *fulfilled*: meaning that the operation was completed successfully.
- *rejected*: meaning that the operation failed.

A pending promise can either be fulfilled with a value or rejected with a reason (error). When either of these options happens, the associated handlers queued up by a promise's then method are called. If the promise has already been fulfilled or rejected when a corresponding handler is attached, the handler will be called, so there is no race condition between an asynchronous operation completing and its handlers being attached.

```js
// chained promise example
const wait = (time) => new Promise((resolve, reject) => {
if(typeof time === "number") {
  setTimeout(resolve, time)
} else {
  reject("time is not a number");
}
});

// when we pass a number
wait(3000)
  .then(() => console.log("hello")); //output:  "Hello!" // after 3000ms

// when we pass a string without error handling
wait("3000")
  .then(() => console.log("hello")); // output: (node:1032858) UnhandledPromiseRejectionWarning: time is not a number

// when we pass a string and also handle errors using .catch
  wait("3000")
  .then(() => console.log("hello"))
  .catch(e => console.log(e)); // output: time is not a number

// when we pass a string and also handle errors using .catch and now you can also add finally to return something when the 
wait(3000)
  .then(() => console.log("hello")) // output: time is not a number
  .catch(e => console.log(e))
  .finally(() => console.log("we're done here"); // output: we're done here
```

From the example above, When we are using chained Promises where the methods `promise.then()`, `promise.catch()`, and `promise.finally()` are used to associate further action with a promise that becomes settled.

```
promise.then(
  onFulfilled?: Function,
  onRejected?: Function
) => Promise
```

The `Promise.then` is a method that takes up two arguements; first one is a callback function for the resolved case of the promise, and the second on is calllback function for the rejected case and it returns a newly generated promise object, which can optionally used for chaining.
We can handle rejected promise seperately by also using `.catch()` especially when you have multiple `.then()` cahined together it is simpler to handle the errors in `.catch()`. A `.catch()` is a `.then()` without the resolved arguement callback function, it takes the rejected callback function only.

We can also have `.finally()` in our promise chain it used to handle the whole promise once it is settled, whether fulfilled or Rejected; it's called.

##### extras on Promises
- Promise.reject() returns a rejected promise.
- Promise.resolve() returns a resolved promise.
- Promise.race() takes an array (or any iterable) and returns a promise that resolves with the value of the first resolved promise in the iterable, or rejects with the reason of the first promise that rejects.
- Promise.all() takes an array (or any iterable) and returns a promise that resolves when all of the promises in the iterable argument have resolved, or rejects with the reason of the first passed promise that rejects.

### Making asynchronous programming easier with async and await

JavaScript Introduced keywords `async` and `await` to EcmaScript in 2015.

When we apppend keyword `async` to a function or method, it will return a promise by default on execution. The `await` keyword is put in front of any async promised-based function to pause your code on that line until the promise fulfils, then return the resulting value. 
`await` keyword only works inside an async functions.

```js
async function hello() {
  const greeting = await Promise.resolve("hello world");
  return greeting;
}

// arrow function
const hello = async () => {
  const greeting = await Promise.resolve("hello world");
  return greeting;
}
```

Let's a look at our wait function and rewrite into **async await** function:
```js
// async await example
const wait = (time) => new Promise((resolve, reject) => {
if(typeof time === "number") {
  setTimeout(resolve, time)
} else {
  reject("time is not a number");
}
});


async function resolveAwait() {
  try {
    await wait(3000); // this will be first executed
    console.log("hello"); // then this
  } catch(error){
    console.log(error); // error will be called incase of one
  } finally{
    console.log("we're done"); // this will be executed once the promise is settled
  }
}
```

It makes code much simpler and easier to understand — no more .then() blocks everywhere!

Try catch block is used for error handling just incase our promise is rejected we will use the `catch(e) {}` block to handle it. And also if wanted to execute something after the promise has settled we can use `finaly()` block to handle that.

### Wrapping Up

Hope this article helps you clear up any questions you may have about when you should use asynchronous or synchronous programming. To wrap it up, here are the main key points:

1. If your operations are not doing very heavy lifting like querying huge data from DB then go ahead with Synchronous way otherwise Asynchronous way.

2. In Asynchronous way you can show some Progress indicator to the user while in background you can continue with your heavy weight works. This is an ideal scenario for GUI apps.

Thanks for reading, cheers 🥂

 