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
} from './index'

interface Product {
  name: string
  price: number
  description: string
}

type PartialProduct = Partial<Product>

const productSchema = {
  name: [
    { message: 'Name must be as string', validator: string },
    { message: 'Name must contain minimum 5 characters', validator: minLength(5) },
  ],
  price: [{ message: 'Price must be a number', validator: number }],
}

describe('validateField()', () => {
  test('validate single field according to schema', () => {
    const { validateField } = schema<PartialProduct>(productSchema)

    expect(validateField('name', null)).toEqual('Name must be as string')
    expect(validateField('name', 123)).toEqual('Name must be as string')
    expect(validateField('name', 'A')).toEqual('Name must contain minimum 5 characters')
  })

  test('works in curried mode', () => {
    const { validateField } = schema<PartialProduct>(productSchema)

    const validatePrice = validateField('price')

    expect(validatePrice(null)).toEqual('Price must be a number')
    expect(validatePrice('Not a number')).toEqual('Price must be a number')
  })

  test('do not validate field, which does not have rules in schema', () => {
    const { validateField } = schema<PartialProduct>(productSchema)

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

    const { validate } = schema<PartialProduct>(productSchema)

    expect(validate(product)).toEqual({
      name: 'Name must contain minimum 5 characters',
      price: 'Price must be a number',
    })
  })
})

describe('validators functions', () => {
  test('validator required', () => {
    expect(required('Lorem ipsum')).toBe(true)

    expect(required(null)).toBe(false)
    expect(required(undefined)).toBe(false)
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
})
