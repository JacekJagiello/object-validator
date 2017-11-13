# @jacekjagiello/object-validator

[![Build Status](https://travis-ci.org/JacekJagiello/object-validator.svg?branch=master)](https://travis-ci.org/JacekJagiello/object-validator)

### Description
This is simple object validator, based on provided schema. I use it for my personal projects.

### Features
* Zero dependency
* Simple and flexible usage
* Good test coverage
* Typescript support

### Usage
`yarn add @jacekjagiello/object-validator`

**OR**

`npm install --save @jacekjagiello/object-validator`

Each key in productSchema is corresponding to the same key in an object you want to validate. Key contains an array of rules. Each rule contains error message and validation function, which returns true if the value is valid, and false if not

```
import { schema, string, number, minLength } from '@jacekjagiello/object-validator'

const productSchema = {
  name: [
    { message: 'Name must be as string', validator: string },
    { message: 'Name must contain minimum 5 characters', validator: minLength(5) },
  ],
  price: [{ message: 'Price must be a number', validator: number }],
}

const product = { name: 'A', price: null }

const { validate } = schema(productSchema)

const errors = validate(product)

console.log(errors)
```

Output:

```
{
  name: 'Name must contain minimum 5 characters',
  price: 'Price must be a number'
}
```

For more examples of usage **please read test file `index.test.ts`**

### Warnings
This is not stable version; **API can change**.
