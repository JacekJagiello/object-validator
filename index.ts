export interface Options {
  objectName?: string
  strict?: boolean
}

const defaultOptions = {
  strict: false,
}

class Schema<T = any> {
  schema: any
  options: Options

  public constructor(schema, options: Options = defaultOptions) {
    this.schema = schema
    this.options = options
  }

  public validate(object): T {
    const schemaKeys = Object.keys(this.schema)

    const errors = schemaKeys
      .map(field => {
        const valueToValidate = object[field]
        const validators = this.schema[field]
        const errors = this.validateSchemaField(field, valueToValidate, validators)

        return errors.length > 0 ? { [field]: errors } : null
      })
      .filter(v => v != null)

    return this.formatErrors(errors)
  }

  public validateField(object, field?: string): any {
    if (!field) {
      return (field: string) => this.validateField(object, field) as any
    }

    const fieldExist = Object.keys(this.schema).find(f => f === field) !== undefined

    if (!fieldExist) {
      throw new Error(`Field "${field}" does not exist in defiend schema`)
    }

    const valueToValidate = object[field]
    const validators = this.schema[field]
    const errors = this.validateSchemaField(field, valueToValidate, validators)

    return errors.length > 0 ? errors : null
  }

  private validateSchemaField(field, valueToValidate, validators) {
    let errorsOfField = []

    if (!valueToValidate) {
      if (this.options.strict) {
        errorsOfField.push(this.missingFieldMessage(field))
      }

      return errorsOfField
    }

    if (!array(validators)) {
      if (validators.function(valueToValidate) === false) {
        errorsOfField.push(validators.message || this.defaultErrorMessage(field))
      }

      return errorsOfField
    }

    validators.forEach(validator => {
      if (typeof validator === 'function') {
        let validationFunc = validator
        validator = { function: validationFunc }
      }

      if (validator.function(valueToValidate) === false) {
        errorsOfField.push(validator.message || this.defaultErrorMessage(field))
      }
    })

    return errorsOfField
  }

  private formatErrors(errors) {
    return errors.reduce((formatedErrors, error) => {
      const fieldName = Object.keys(error)[0]
      formatedErrors[fieldName] = error[fieldName]
      return formatedErrors
    }, {})
  }

  private missingFieldMessage(field) {
    const { objectName } = this.options
    if (objectName) {
      return `${objectName} ${field} is required`
    }

    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  private defaultErrorMessage(field) {
    const { objectName } = this.options
    if (objectName) {
      return `${objectName} ${field} is invalid`
    }

    return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`
  }
}

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const URL_REGEXP = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

const required = field => field !== '' && field !== null && field !== undefined
const string = field => typeof field === 'string'
const number = field => typeof field === 'number'
const numeric = field => !isNaN(parseFloat(field)) && isFinite(field)
const notEmpty = field => field.length != 0
const minLength = min => field => field.length >= min
const maxLength = max => field => field.length <= max
const email = field => EMAIL_REGEXP.test(field)
const url = field => URL_REGEXP.test(field)
const array = field => field.constructor === Array

export {
  Schema,
  string,
  number,
  numeric,
  notEmpty,
  minLength,
  maxLength,
  email,
  url,
  array,
  required,
}
