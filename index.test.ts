import {
  Schema,
  string,
  number,
  numeric,
  minLength,
  maxLength,
  notEmpty,
  email,
  url,
  array,
  required,
} from './index'

const productSchema = {
  name: [
    { message: 'Product name must be as string', function: string },
    { message: 'Product name must contain minimum 5 characters', function: minLength(5) },
  ],
  price: [number],
}

interface ProductInterface {
  name: string
  price: number
}

test('it returns validation errors according to schema', () => {
  const invalidProduct = {
    name: 123,
    price: 'invalid-price',
  }

  const validationErrors = new Schema<ProductInterface>(productSchema).validate(invalidProduct)

  const expectedErrors = {
    name: ['Product name must be as string', 'Product name must contain minimum 5 characters'],
    price: ['Price is invalid'],
  }

  expect(validationErrors).toEqual(expectedErrors)
})

test('it returns validation errors according to schema', () => {
  const invalidProduct = {
    name: 123,
    price: 'invalid-price',
  }

  const validationErrors = new Schema<ProductInterface>(productSchema).validate(invalidProduct)

  const expectedErrors = {
    name: ['Product name must be as string', 'Product name must contain minimum 5 characters'],
    price: ['Price is invalid'],
  }

  expect(validationErrors).toEqual(expectedErrors)
})

test('it returns "Field is required" error if strict mode is enabled and object does not contains field defined in schema', () => {
  const invalidProduct = {}
  const validationErrors = new Schema(productSchema, { strict: true }).validate(invalidProduct)

  const expectedPriceErrors = {
    name: ['Name is required'],
    price: ['Price is required'],
  }

  expect(validationErrors).toEqual(expectedPriceErrors)
})

test('it doest not returns "Field is required" error if strict mode is disabled and object does not contains field defined in schema', () => {
  const invalidProduct = {}
  const validationErrors = new Schema(productSchema, { strict: false }).validate(invalidProduct)

  expect(validationErrors).toEqual({})
})

test('it returns "Filed is required" error, if stric mode is disabled, but required validator is added to field', () => {
  const userData = {}
  const validationErrors = new Schema(
    {
      email: { message: 'Email is required', validator: required },
    },
    { strict: true },
  ).validate(userData)

  const expectedEmailErrors = ['Email is required']

  expect(validationErrors.email).toEqual(expectedEmailErrors)
})

test('it includes object name into error message', () => {
  const invalidProduct = {
    price: 'invalid-price',
  }

  const validationErrors = new Schema(productSchema, { objectName: 'Product' }).validate(
    invalidProduct,
  )

  const expectedPriceErrors = ['Product price is invalid']

  expect(validationErrors.price).toEqual(expectedPriceErrors)
})

test('it validates array according to schema', () => {
  const basket = new Schema({
    name: { function: string },
    products: [
      { message: 'Must be an array', function: array },
      { message: 'Must contains at least one item', function: minLength(1) },
    ],
  })

  const fullBasket = { name: 'test', products: ['apple', 'banana', 'orange'] }
  const emptyBasket = { name: 'test', products: [] }
  const invalidBasket = { name: 'test', products: 'invalid_value' }

  expect(basket.validate(fullBasket)).toEqual({})
  expect(basket.validate(emptyBasket)).toEqual({ products: ['Must contains at least one item'] })
  expect(basket.validate(invalidBasket)).toEqual({ products: ['Must be an array'] })
})

test('validateFiled validates single field from schema', () => {
  const invalidProduct = {
    price: 'invalid-price',
  }

  const validationErrors = new Schema(productSchema).validateField(invalidProduct, 'price')

  const expectedPriceErrors = ['Price is invalid']

  expect(validationErrors).toEqual(expectedPriceErrors)
})

test('validateField can be curried', () => {
  const invalidProduct = {
    price: 'invalid-price',
  }

  const validateField = new Schema(productSchema).validateField(invalidProduct)
  const validationErrors = validateField('price')

  const expectedPriceErrors = ['Price is invalid']

  expect(validationErrors).toEqual(expectedPriceErrors)
})

test('validateField throws error if field does not exist in schema', () => {
  const invalidProduct = {
    price: 'invalid-price',
  }

  expect(() => {
    new Schema(productSchema).validateField(invalidProduct, 'notExisting')
  }).toThrow(`Field "notExisting" does not exist in defiend schema`)
})

test('validator required', () => {
  expect(required('Lorem ipsum')).toBe(true)

  expect(required(null)).toBe(false)
  expect(required(undefined)).toBe(false)
  expect(required('')).toBe(false)
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

test('validator array', () => {
  expect(array([])).toBe(true)
  expect(array(['john'])).toBe(true)

  expect(array('john')).toBe(false)
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
