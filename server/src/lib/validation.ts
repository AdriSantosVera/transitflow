export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export function assertNonEmptyString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${fieldName} is required`)
  }

  return value.trim()
}

export function assertPositiveNumber(value: unknown, fieldName: string) {
  const numberValue =
    typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new ValidationError(`${fieldName} must be greater than 0`)
  }

  return Number(numberValue)
}

export function assertValidDateString(value: unknown, fieldName: string) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new ValidationError(`${fieldName} must be a valid date`)
  }

  return value
}

export function assertValidExpenseType(value: unknown) {
  if (
    value !== 'transporte' &&
    value !== 'comida' &&
    value !== 'alojamiento' &&
    value !== 'ocio'
  ) {
    throw new ValidationError('type must be one of transporte, comida, alojamiento or ocio')
  }

  return value
}
