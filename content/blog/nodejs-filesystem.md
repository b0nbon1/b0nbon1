---
title: Read, Write, Update and Delete files in Node.js (File Systems)
featured: True
date: "2022-01-28T22:00:00+0300"
description: Let's learn how to write files, read files, update files and delete files with Nodejs ~ Bonvic Bundi
tags: 
    - Javascript
    - fs
    - nodejs
author: Bonvic Bundi
---

<br />

We use the `fs` module in Nodejs which allows you to work with the file systems on your computer.
You just Nodejs installed on your computer because `fs` module is part of the Nodejs core.

## Read Files

You can read files from your nodejs application using `fs.readFile` and `fs.readFileSync`(for synchronous form) methods.

Examples for reading files:
We can read files a non-blocking asynchronously by `fs.readFile` or in synchronous way with `fs.readFileSync`.

#### Synchronous example

syntax for `readFileSync` is:

```
fs.readFileSync( path, options )
```

where **path** takes the relative path of the text file and **options** are the optional parameters like encoding and flag, you can refer more from [readFileSync options](https://nodejs.org/api/fs.html#fs_fs_readfilesync_path_options)

```js
// create textFile.txt on the same folder with the below function
// reading textFile.txt
const fs = require('fs');

try {
  const fileFetched = fs.readFileSync('./textFile.txt', {
    encoding: 'utf8',
    flag: 'r',
  });

  // display data fetched
  console.log(fileFetched);
} catch (error) {
  console.log(error);
}
```

#### Asynchronous example

syntax for `readFile` is:

```
fs.readFile(path, options, callback)
```

More details about the parameters are available in [fs.readFile](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)

```js
const fs = require('fs');

fs.readFile('./textFile.txt', (err, data) => {
  if (err) throw err;

  // display data fetched
  console.log(data);
});


// or
// using async await 

async function fileReader() {
    const data = await fs.readFile("./textFile.txt");
    return new data;
}
```

## Write Files

You can readfiles from your nodejs application using `fs.writeFile` and `fs.writeFileSync`(for synchronous form) methods.

Examples for reading files:
We can read files a non-blocking asynchronously by `fs.writeFile` or in synchronous way with `fs.writeFileSync`.

#### Asynchronous example

syntax for `readFile` is:

```
fs.writeFile(path, data, options, callback)
```

where **path** takes the relative path of the text file, **data** takes the data that you want to store in the file, **options** are the optional parameters like encoding and flag, you can refer more from [writefile options](https://nodejs.org/docs/latest-v15.x/api/fs.html#fs_fs_writefile_file_data_options_callback)

```js
const fs = require('fs')

const data = 'Hello Node.js';
fs.writeFile('message.txt', data, (err) => {
  if (err) throw err;
  console.log('The file has been saved!');
  //file written successfully
});

// or
// using async await 

async function fileWriter() {
    const data = await fs.writeFile("./textFile.txt");
    return new data;
}
```

#### synchronous example

syntax for `writeFileSync` is:

```
fs.writeFileSync(path, data, options, callback)
```

More details about the parameters are available in [fs.writeFileSync](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options)

```js
const fs = require('fs')

const content = 'Some content!'

try {
  fs.writeFileSync('/Users/joe/test.txt', content)
  //file written successfully
} catch (err) {
  console.error(err)
}
```

The flags you'll likely use are:
- r+ open the file for reading and writing
- w+ open the file for reading and writing, positioning the stream at the beginning of the file. The file is created if it does not exist
- a open the file for writing, positioning the stream at the end of the file. The file is created if it does not exist
- a+ open the file for reading and writing, positioning the stream at the end of the file. The file is created if it does not exist

you can find more flags at [Nodejs Write Flags](https://nodejs.org/api/fs.html#fs_file_system_flags)


## Append to a file

A handy method to append content to the end of a file is `fs.appendFile()` (and its `fs.appendFileSync()` counterpart):

```js
const fs = require('fs')

const content = 'Some content!'

fs.appendFile('file.log', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //done!
})
```

## Delete a File

Node offers a synchronous method, and an asynchronous method through the fs built-in module.

The asynchronous one is `fs.unlink()`.

```js
const fs = require('fs')

const path = './file.txt'

try {
  fs.unlinkSync(path)
  //file removed
} catch(err) {
  console.error(err)
}
```

The synchronous one is `fs.unlinkSync()`.

```js
const fs = require('fs')

const path = './file.txt'

fs.unlink(path, (err) => {
  if (err) {
    console.error(err)
    return
  }

  //file removed
})
```


## Wrapping up

Volla, we have successfully create, read, updated and delete the files successfully using Nodejs.
Learn the difference between [Asynchronous and Synchronous programming in JavaScript in this post](https://bonvic.dev/writings/diferrence-between-synchronous-and-asynchronous-javascript/)

If you have any questions drop them in the [comment section of this tweet](https://twitter.com/b0nvic/status/1487140065394446340?s=20&t=DdwQ9-NXntP6_mAkrGmkNw).

Thanks for reading, cheers 🥂
