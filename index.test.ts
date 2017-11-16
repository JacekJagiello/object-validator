import {
  schema,
  required,
  string,
  number,
  notEmpty,
  array,
  numeric,
  minLength,
  maxLength,
  email,
  url,
  minNumbersInString,
  maxNumbersInString,
} from './index'

interface Product {
  name: string
  price: number
  description: string
}

type PartialProduct = Partial<Product>

const productSchema = schema<PartialProduct>({
  name: [
    { message: 'Name must be as string', validator: string },
    { message: 'Name must contain minimum 5 characters', validator: minLength(5) },
  ],
  price: [{ message: 'Price must be a number', validator: number }],
})

describe('validateField()', () => {
  test('validate single field according to schema', () => {
    const { validateField } = productSchema

    expect(validateField('name', null)).toEqual('Name must be as string')
    expect(validateField('name', 123)).toEqual('Name must be as string')
    expect(validateField('name', 'A')).toEqual('Name must contain minimum 5 characters')
  })

  test('works in curried mode', () => {
    const { validateField } = productSchema

    const validatePrice = validateField('price')

    expect(validatePrice(null)).toEqual('Price must be a number')
    expect(validatePrice('Not a number')).toEqual('Price must be a number')
  })

  test('do not validate field, which does not have rules in schema', () => {
    const { validateField } = productSchema

    expect(validateField('description', null)).toEqual(null)
    expect(validateField('description', 'bla bla')).toEqual(null)
  })
})

describe('validate()', () => {
  test('validate all fields of the object according to schema', () => {
    const product = {
      name: 'A',
      price: null,
      description: 'bla bla',
    }

    const { validate } = productSchema

    expect(validate(product)).toEqual({
      name: 'Name must contain minimum 5 characters',
      price: 'Price must be a number',
    })
  })
})

describe('validators functions', () => {
  test('required', () => {
    expect(required('Lorem ipsum')).toBe(true)

    expect(required(null)).toBe(false)
    expect(required(undefined)).toBe(false)
  })

  test('string', () => {
    expect(string('Lorem ipsum')).toBe(true)
    expect(string('123')).toBe(true)
    expect(string('')).toBe(true)

    expect(string(123)).toBe(false)
    expect(string(1.23)).toBe(false)
    expect(string({})).toBe(false)
    expect(string([])).toBe(false)
    expect(string(() => ({}))).toBe(false)
  })

  test('number', () => {
    expect(number(123)).toBe(true)
    expect(number(1.23)).toBe(true)

    expect(number('123')).toBe(false)
    expect(number('Lorem ipsum')).toBe(false)
    expect(number({})).toBe(false)
    expect(number([])).toBe(false)
    expect(number(() => ({}))).toBe(false)
  })

  test('numeric', () => {
    expect(numeric(123)).toBe(true)
    expect(numeric(1.23)).toBe(true)
    expect(numeric('123')).toBe(true)

    expect(numeric('Lorem ipsum')).toBe(false)
    expect(numeric({})).toBe(false)
    expect(numeric([])).toBe(false)
    expect(numeric(() => ({}))).toBe(false)
  })

  test('notEmpty', () => {
    expect(notEmpty('Lorem ipsum')).toBe(true)

    expect(notEmpty('')).toBe(false)
  })

  test('minLength', () => {
    const minLengthValidator = minLength(5)

    expect(minLengthValidator('Lorem ipsum')).toBe(true)

    expect(minLengthValidator('')).toBe(false)
    expect(minLengthValidator('Lor')).toBe(false)
  })

  test('maxLength', () => {
    const maxLengthValidator = maxLength(5)

    expect(maxLengthValidator('Lor')).toBe(true)
    expect(maxLengthValidator('12345')).toBe(true)

    expect(maxLengthValidator('Lorem ipsum')).toBe(false)
  })

  test('array', () => {
    expect(array([])).toBe(true)
    expect(array(['john'])).toBe(true)

    expect(array('john')).toBe(false)
  })

  test('email', () => {
    expect(email('john.doe@gmail.com')).toBe(true)
    expect(email('johndoe@exmaple.com')).toBe(true)

    expect(email('johndoe')).toBe(false)
    expect(email('johndoe@')).toBe(false)
    expect(email('johndoe@gmail')).toBe(false)
    expect(email('johndoe@!@#.com')).toBe(false)
    expect(email('john!@#doe@gmail.com')).toBe(false)
  })

  test('url', () => {
    expect(url('http://test.com')).toBe(true)
    expect(url('http://www.test.com')).toBe(true)
    expect(url('http://test-example.com')).toBe(true)
    expect(url('http://test_example.com')).toBe(true)
    expect(url('https://test.com')).toBe(true)
    expect(url('http://test.com/exmaple')).toBe(true)
    expect(url('http://test.com:8000/exmaple')).toBe(true)
    expect(url('http://test.com/exmapl?param=test')).toBe(true)

    expect(url('test')).toBe(false)
    expect(url('http://test')).toBe(false)
    expect(url('https://test')).toBe(false)
    expect(url('http://test:8000')).toBe(false)
    expect(url('http://test.com1')).toBe(false)
  })

  test('minNumbersInString', () => {
    const minNumbersInStringValidator = minNumbersInString(3)

    expect(minNumbersInStringValidator('abcde12')).toBe(false)

    expect(minNumbersInStringValidator('abcde123')).toBe(true)
    expect(minNumbersInStringValidator('abcde123456')).toBe(true)
  })

  test('maxNumbersInString', () => {
    const maxNumbersInStringValidator = maxNumbersInString(3)

    expect(maxNumbersInStringValidator('abcde12')).toBe(true)
    expect(maxNumbersInStringValidator('abcde123')).toBe(true)

    expect(maxNumbersInStringValidator('abcde123456')).toBe(false)
  })
})

test('validation rule supports array of validators', () => {
  interface User {
    shortName: string
  }

  const { validateField } = schema<User>({
    shortName: [
      {
        message: 'Short name must be minimum 3 chars and maximum 5 chars',
        validator: [minLength(3), maxLength(5)],
      },
    ],
  })

  const error = validateField('shortName', 'a')

  expect(error).toEqual('Short name must be minimum 3 chars and maximum 5 chars')
})
