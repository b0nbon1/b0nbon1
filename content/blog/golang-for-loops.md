---
title: Loop patterns in Go
date: 2023-07-05T22:00:00+0300
description: Basic loop patterns in Go. We'll learn how you can write loops in different ways with help of examples ~ Bonvic Bundi
tags: 
     - Golang
author: Bonvic Bundi
---

We use `for` statement block to execute loops in Golang

## Three-component loop

This type of loop works similar to the one in Javascript and C. 
The three parts are: 
- the initialize statement: `i := 0`
- the condition statement: `i < 5` checks if true the loop will continue running
- post statement: `i++` it's the increment statement to make sure it reaches the condition

Below is an example:

```golang
// loops runs from the init which is 0 to condition 5 while incrementing by 1
for i := 0; i < 5; i++ {
	fmt.Println(i) // print the numbers
}

```

The scope of i is limited to the loop.

## While Loop

Unlike other languages where we use `while` keyword, Golang uses `for` keyword but we skip the initializer statement and post statement to get the while loop behaviour.

Below is an example:

```golang
i := 1 // initialize outside the loop
// condition. acts like while
for i < 5 {
	fmt.Println(i) // print number
    i++ // post statement
}

```

## Infinite loop

If you skip all statements on the `for` you will get an infinite loop.

```golang
i := 1 // initialize outside the loop
// infinite loop since there is no condition
for {
	fmt.Println(i) // print number
    i++ // post statement
}

```

## Exit a loop

Like Javascript and C, we have `break` and `continue` keywords here.

Below is example usage:

```golang
for i := 0; i < 10; i++ {
    // if i is divisible by 2, the we skip this step
    if i%2 == 0 {
        continue;
    }
    // if i equals to 7, we'll break out of the loop, the rest of numbers won't be printed
    if i == 7 {
        break;
    }

	fmt.Println(i) // print the numbers
}

```


## For-each range loop

like python, golang has for range loop which is used in looping over elements in arrays, slices, maps, channels and strings. It has the index part and also the range part.

Below are different examples:

```golang
// looping through a slice or an array
a := []string{"Hello", "world", "there"}
for i, s := range a {
	fmt.Println(i, s) // prints the index and the value eg. 0 Hello, 1 world...
}

```

```golang
// looping through a map
m := map[string]int{
	"one":   1,
	"two":   2,
	"three": 3,
}
for k, v := range m {
	fmt.Println(k, v) // will print the key and the value eg. one 1, two 2....
}

```

```golang
// Loop through channels
go func() {
	ch <- 1
	ch <- 2
	ch <- 3
	close(ch)
}()
for n := range ch {
	fmt.Println(n) // prints what is in the channel: 1,2,3
}
```

*NB* if the channel is nil, it blocks the loop forever

Rememeber you need to assign both values a variable when using range, for example:

```golang
// if you do this it will print the indices on p instead of the values 
// since range loop generates two values, index and value
primes := []int{2, 3, 5, 7}
for p := range primes {
	fmt.Println(p)
}

// instead do this if you want value only.
primes := []int{2, 3, 5, 7}
for _, p := range primes {
	fmt.Println(p)
}
```

## Wrapping up

Volla, We know have a basic understanding of loops in Golang.

Thanks for reading, cheers 🥂
