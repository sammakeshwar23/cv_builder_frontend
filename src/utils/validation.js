export const validateStep = (step, data) => {
  switch (step) {
    case 0:
      if (!data.fullName) return { isValid: false, message: 'Full Name is required' };
      return { isValid: true };
    case 1:
      if (!data.email) return { isValid: false, message: 'Email is required' };
      return { isValid: true };
    default:
      return { isValid: true };
  }
};
