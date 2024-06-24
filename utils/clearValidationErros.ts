export const clearValidationErrors = (errors:{ [key: string]: any }) => 
{
    if (errors) {
        for (const [key, value] of Object.entries(errors)) {
          delete errors[key];
        }
      }
}