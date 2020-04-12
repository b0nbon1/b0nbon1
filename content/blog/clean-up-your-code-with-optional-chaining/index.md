---
title: Cleaning up your code using optional chaining Javascript
featured: true
date: 2020-04-12 00:00:00 +0200
description: The optional chaining javascript operator ?. permits reading the value of a property located deep within a chain of connected objects without having to expressly validate that each reference in the chain is valid.
img: ./chain.svg
tags: [ Javascript, new features, EsNext]
color: yellow
---

> Optional chaining landed in Chrome 80.

I bet that if you have been writing javascript code you have interacted with such syntax somewhere in your life:

```javascript

// assuming this our object or data
const car = {
  name: 'BMW',
  engine: {
    model: 2019
  },
}

// when accessing values from an object
// What we all know is:
let numberOfWheels = car.wheels.numberOfWheels
// outputs error: Uncaught TypeError: Cannot read property 'numberOfWheels' of undefined

// so we have to do checks to access the objects values
// using if else
let model
if (car.engine) {
  model = car.engine.model
}
// outputs: 2019
console.log(model)

// which does not exist in our object
let numberOfWheels
if (car.wheels) {
  numberOfWheels = car.wheels.number
}
// outputs: undefined
console.log(numberOfWheels)

// OR

// using logical AND
let model = car.engine && car.engine.model
// outputs: 2019
console.log(model)

let numberOfWheels = car.wheels && car.wheels.numberOfWheels
// outputs: undefined
console.log(numberOfWheels)
```
Javascript has now introduced optional chaining operator `?.` provides a way to simplify accessing values through connected objects when it's possible that a reference or function may be `undefined` or `null`.

Usage of the chaining operator using the same example up there is:

```js

let model = car.engine?.model
// outputs: 2019
console.log(model)

let numberOfWheels = car.wheels?.numberOfWheels
// outputs: undefined
```


Optional chaining can also be used in calling a method that may not exist in an object.
Using optional chaining with function calls causes the expression to automatically return undefined instead of throwing an exception if the method isn't found.

```js
// if you call the method from an object that does not exist, it will throw an exception
car.create()
// outputs: TypeError: car.create is not a function

// optional chaining handling
car.create?.()
// outputs: undefined
```
Also when accessing arrays, optional chaining can be used when accessing an item that may not exist:
```js
let arr = []

let item = arr?.[1]
console.log(item)
// outputs: undefined
```

### More Examples

#### Combining with the nullish coalescing operator

The [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) may be used after optional chaining in order to build a default value when none was found:

```js

const carCountry = car?.country ?? 'Unknown country'
console.log(carCountry)
// outputs: Unknown Unknown country
```

#### map function and undefined problem

Suppose you've got the following array:

```js
const carModels = [
  { new: 'brand new' },
  { old: 'old car' },
  { new: 'new car' },
  { new: 'Latest model car' },
  { old: 'vintage car' }
]
```
You want to loop over it to produce a new array containing only those objects with the new property. The map function is your friend and we can do:

```js
const newModels = arr.map(function(element) {
  if (element.new) return element
})

console.log(newModels);
// outputs: [ { new: 'brand new' }, undefined, { new: 'new car' }, { new: 'Latest model car' }, undefined]
```
So if you try to access property new of `newModels[1]`:

```js
let car = newModels[1].new
console.log(car)
// outputs error: Uncaught TypeError: Cannot read property 'new' of undefined

// optional chaining solves the problem
let car = newModels[1]?.new
```


## Wrapping Up

As we have seen optional chaining aims to simplify one of the most common patterns in JavaScript: nested property access on objects.
Now you write a clean code using optional chaining.

For more examples and reference go to [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

Thanks for reading, cheers 🥂
