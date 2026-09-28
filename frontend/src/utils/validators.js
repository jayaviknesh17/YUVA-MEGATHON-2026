/**
 * Input validators for YUVA platform
 */

/**
 * Validates that student RA Number is exactly 15 alphanumeric characters
 * Pattern: ^[A-Za-z0-9]{15}$
 */
export const isValidRANumber = (raNumber) => {
  if (!raNumber || typeof raNumber !== 'string') return false;
  const cleaned = raNumber.trim();
  const raRegex = /^[A-Za-z0-9]{15}$/;
  return raRegex.test(cleaned);
};

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isNonEmptyString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};
