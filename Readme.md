# @jacekjagiello/object-validator

[![Build Status](https://travis-ci.org/JacekJagiello/object-validator.svg?branch=master)](https://travis-ci.org/JacekJagiello/object-validator)

### Description
This is simple object validator, based on provided schema. I use it for my personal projects.

### Features
* Zero dependency
* Simple and flexible usage
* Good test coverage
* Basic Typescript support

### Usage
`yarn add @jacekjagiello/object-validator`

**OR**

`npm install --save @jacekjagiello/object-validator`

Each key in productSchema is corresponding to the same key in an object you want to validate. Key contains an array of objects. Each object contains error message and validation function, which returns true if the value is valid, and false if it's not

```
import { Schema, string, minLength } from '@jacekjagiello/object-validator'

const productSchema = {
  name: [
    { message: 'Value must be as string', function: string },
    { message: 'value must have minimum 5 chars', function: minLength(5) }
  ]
}

const productToValidate = { name: 123 }

const validationErrors = new Schema(productSchema).validate(productToValidate)

console.log(validationErrors)
```

Output:

`{ name: ['Value must be as string'] }`

For more examples of usage **please read test file `index.test.ts`**

### Warnings
This is not stable version; **API can change**.
