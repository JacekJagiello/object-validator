const { Schema, string, number, numeric, minLength, maxLength, notEmpty, email, url } = require('./index')

const productSchema = {
  name: [
    { message: 'Product name must be as string', function: string },
    { message: 'Product name must contain minimum 5 characters', function: minLength(5) }
  ],
  price: [ number ]
}

test('it returns validation errors according to schema', () => {
  const invalidProduct = {
    name: 123,
    price: 'invalid-price'
  }

  const validationErrors = new Schema(productSchema).validate(invalidProduct)

  const expectedErrors = {
    name: [
      'Product name must be as string',
      'Product name must contain minimum 5 characters'
    ],
    price: [
      'Value price is invalid'
    ]
  }

  expect(validationErrors).toEqual(expectedErrors)
})

test('it return validation error if validating object does not contains field defined in schema', () => {
  const invalidProduct = {}
  const validationErrors = new Schema(productSchema).validate(invalidProduct)

  const expectedPriceErrors = {
    name: ['Value name is required'],
    price: ['Value price is required']
  }

  expect(validationErrors).toEqual(expectedPriceErrors)
})

test('it includes object name into error message', () => {
  const objectName = 'Product'
  const invalidProduct = {
    price: 'invalid-price'
  }

  const validationErrors = new Schema(productSchema, { objectName }).validate(invalidProduct)

  const expectedPriceErrors = ['Product price is invalid']

  expect(validationErrors.price).toEqual(expectedPriceErrors)
})

test('validator string', () => {
  expect(string('Lorem ipsum')).toBe(true)
  expect(string('123')).toBe(true)
  expect(string('')).toBe(true)

  expect(string(123)).toBe(false)
  expect(string(1.23)).toBe(false)
  expect(string({})).toBe(false)
  expect(string([])).toBe(false)
  expect(string(() => ({}))).toBe(false)
})

test('validator number', () => {
  expect(number(123)).toBe(true)
  expect(number(1.23)).toBe(true)

  expect(number('123')).toBe(false)
  expect(number('Lorem ipsum')).toBe(false)
  expect(number({})).toBe(false)
  expect(number([])).toBe(false)
  expect(number(() => ({}))).toBe(false)
})

test('validator numeric', () => {
  expect(numeric(123)).toBe(true)
  expect(numeric(1.23)).toBe(true)
  expect(numeric('123')).toBe(true)

  expect(numeric('Lorem ipsum')).toBe(false)
  expect(numeric({})).toBe(false)
  expect(numeric([])).toBe(false)
  expect(numeric(() => ({}))).toBe(false)
})

test('validator notEmpty', () => {
  expect(notEmpty('Lorem ipsum')).toBe(true)

  expect(notEmpty('')).toBe(false)
})

test('validator minLength', () => {
  const minLengthValidator = minLength(5)

  expect(minLengthValidator('Lorem ipsum')).toBe(true)

  expect(minLengthValidator('Lor')).toBe(false)
})

test('validator maxLength', () => {
  const maxLengthValidator = maxLength(5)

  expect(maxLengthValidator('Lor')).toBe(true)

  expect(maxLengthValidator('Lorem ipsum')).toBe(false)
})

test('validator email', () => {
  expect(email('john.doe@gmail.com')).toBe(true)
  expect(email('johndoe@exmaple.com')).toBe(true)

  expect(email('johndoe')).toBe(false)
  expect(email('johndoe@')).toBe(false)
  expect(email('johndoe@gmail')).toBe(false)
  expect(email('johndoe@!@#.com')).toBe(false)
  expect(email('john!@#doe@gmail.com')).toBe(false)
})

test('validator url', () => {
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