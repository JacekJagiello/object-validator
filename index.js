class Schema {
  constructor(schemaObject, options = {}) {
    this.schema = schemaObject
    this.options = options
  }

  validate(object) {
    const objectKeys = Object.keys(this.schema)

    const errors = objectKeys.map(field => {
      const valueToValidate = object[field]
      const validators = this.schema[field]
      const errors = this.validateField(field, valueToValidate, validators)

      return errors.length > 0 ? { [field]: errors } : null
    }).filter(v => v != null)

    const formatedErrors = this.formatErrors(errors)

    return Object.keys(formatedErrors).length > 0 ? formatedErrors : null
  }

  validateField(field, valueToValidate, validators) {
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

  formatErrors(errors) {
    let formatedErrors = {}
    errors.forEach(error => {
      const fieldName = Object.keys(error)[0]
      formatedErrors[fieldName] = error[fieldName]
    })

    return formatedErrors
  }

  missingFieldMessage(field) {
    if (this.options.objectName) {
      return `${this.options.objectName} ${field} is required`
    }

    return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
  }

  defaultErrorMessage(field) {
    if (this.options.objectName) {
      return `${this.options.objectName} ${field} is invalid`
    }

    return `${field.charAt(0).toUpperCase() + field.slice(1)} is invalid`
  }
}

const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const URL_REGEXP = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/

const string = field => typeof field === 'string'
const number = field => typeof field === 'number'
const numeric = field => !isNaN(parseFloat(field)) && isFinite(field)
const notEmpty = field => field.length != 0
const minLength = min => field => field.length >= min
const maxLength = max => field => field.length <= max
const email = field => EMAIL_REGEXP.test(field)
const url = field => URL_REGEXP.test(field)
const array = field => field.constructor === Array

module.exports = { Schema, string, number, numeric, notEmpty, minLength, maxLength, email, url, array }
