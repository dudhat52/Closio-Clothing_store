module.exports.validateRegistration = (firstName, lastName, email, password) => {
    const errors = [];
    
    if (!firstName || !lastName || !email || !password) {
      errors.push("All fields are required.");
    }
  
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format.");
    }
  
    // Password validation regex (8-12 chars, uppercase, lowercase, number, symbol)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      errors.push("Password must be 8-12 characters long and include uppercase, lowercase, a number, and a symbol.");
    }
  
    return errors;
  };
  