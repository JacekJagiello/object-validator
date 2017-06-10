class Schema {
  constructor(schemaObject, options = {}) {
    this.schema = schemaObject
    this.options = options
  }

  validate(object) {
    const objectKeys = Object.keys(this.schema)
    let errors = {}

    objectKeys.forEach(field => {
      errors[field] = []

      let valueToValidate = object[field]
      const validators = this.schema[field]

      if (!valueToValidate) {
        errors[field].push(this.missingFieldMessage(field))
        return
      }

      validators.forEach(validator => {
        if (typeof validator === 'function') {
          let validationFunc = validator
          validator = { function: validationFunc }
        }

        if (validator.function(valueToValidate) === false) {
          errors[field].push(validator.message || this.defaultErrorMessage(field))
        }
      })

      if (errors[field].length == 0) {
        delete errors[field]
      }
    })

    return Object.keys(errors).length > 0 ? errors : null
  }

  missingFieldMessage(field) {
    return `${this.options.objectName || 'Value'} ${field} is required`
  }

  defaultErrorMessage(field) {
    return `${this.options.objectName || 'Value'} ${field} is invalid`
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

module.exports = { Schema, string, number, numeric, notEmpty, minLength, maxLength, email, url }

