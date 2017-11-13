export type ValidatorFunction = (value: any) => boolean

export interface ValidationRule {
  message: string
  validator: ValidatorFunction
}

export type ObjectSchema<T> = { [K in keyof T]: ValidationRule[] }

const isFalse = (val: boolean) => val === false
const notNull = (val: any) => val !== null
const upperCaseFirstLetter = (val: string) => val.charAt(0).toUpperCase() + val.slice(1)
const getKeys = <T>(object: T) => Object.keys(object) as Array<keyof T>

export function schema<T>(objectSchema: ObjectSchema<T>) {
  const validateRule = (value: any) => (rule: ValidationRule) => {
    const isValid = rule.validator(value)
    return isValid === false ? rule.message : null
  }

  function validateField(key: keyof T): (value: any) => string | null
  function validateField(key: keyof T, value: any): string | null
  function validateField(key: keyof T, value?: any) {
    if (value === undefined) {
      return (value: any) => validateField(key, value)
    }

    const rules = objectSchema[key]
    if (!rules) {
      return null
    }

    return rules.map(validateRule(value)).filter(notNull)[0]
  }

  function validate(object: T) {
    return getKeys(objectSchema)
      .map(key => ({
        [key]: validateField(key, object[key]),
      }))
      .reduce((acc, next) => {
        for (let key in next) acc[key] = next[key]
        return acc
      }, {})
  }

  return { validate, validateField }
}

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const URL_REGEXP = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

export const required = (value: any) => value !== null && value !== undefined
export const string = (value: any) => typeof value === 'string'
export const number = (value: any) => typeof value === 'number'
export const notEmpty = (value: any) => required(value) && value.length != 0
export const email = (value: any) => EMAIL_REGEXP.test(value)
export const url = (value: any) => URL_REGEXP.test(value)
export const array = (value: any) => value.constructor === Array
export const numeric = (value: any) =>
  required(value) && !isNaN(parseFloat(value)) && isFinite(value)
export const minLength = (minLenght: number) => (value: any) =>
  required(value) && value.length && value.length >= minLenght
export const maxLength = (maxLenght: number) => (value: any) =>
  required(value) && value.length <= maxLenght
