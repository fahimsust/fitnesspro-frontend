export const addValidationErrors = (errors:{ [key: string]: any },validationErrors: Object) => 
{
    Object.entries(validationErrors).forEach(([key, error]) =>
      Object.values(error).forEach((error) => (errors[key] = error))
    )
}