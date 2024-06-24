export const formatNumberWithTwoDecimals = (number: any): string => {
  // Parse the input to a number
  const parsedNumber = parseFloat(number);

  // Check if the parsedNumber is a valid number
  if (isNaN(parsedNumber)) {
      return "0.00";
  }

  // Use toFixed to round to 2 decimal places and convert to a string
  let formattedNumber = parsedNumber.toFixed(2);

  // Add .00 if the formatted number doesn't have a decimal part
  if (formattedNumber.indexOf('.') === -1) {
      formattedNumber += '.00';
  }

  return formattedNumber;
};