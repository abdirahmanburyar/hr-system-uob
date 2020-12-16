const Validator = require("validator");

module.exports.userRegistration = ({ body }) => {
  const {
    firstName,
    middleName,
    email,
    address,
    surname,
    age,
    certs,
    bod,
  } = body;
  const errors = {};
  if (Validator.isEmpty(firstName)) {
    errors.firstName = "is required";
  }
  if (Validator.isEmpty(middleName)) {
    errors.middleName = "is required";
  }
  if (Validator.isEmpty(surname)) {
    errors.surname = "is required";
  }
  if (Validator.isEmpty(email)) {
    errors.email = "is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Invalid email";
  }

  if (Validator.isEmpty(address)) {
    errors.address = "is required";
  }
  if (Validator.isEmpty(age)) {
    errors.age = "is required";
  }
  if (Validator.isEmpty(certs)) {
    errors.certs = "is required";
  }
  if (Validator.isEmpty(bod)) {
    errors.bod = "is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0,
  };
};

module.exports.adminsRegistration = ({ body }) => {
  const {
    firstName,
    middleName,
    email,
    address,
    surname,
    age,
    certs,
    bod,
  } = body;
  const errors = {};
  if (Validator.isEmpty(firstName)) {
    errors.firstName = "is required";
  }
  if (Validator.isEmpty(middleName)) {
    errors.middleName = "is required";
  }
  if (Validator.isEmpty(surname)) {
    errors.surname = "is required";
  }
  if (Validator.isEmpty(email)) {
    errors.email = "is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Invalid email";
  }

  if (Validator.isEmpty(address)) {
    errors.address = "is required";
  }
  if (Validator.isEmpty(age)) {
    errors.age = "is required";
  }
  if (Validator.isEmpty(certs)) {
    errors.certs = "is required";
  }
  if (Validator.isEmpty(bod)) {
    errors.bod = "is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0,
  };
};

module.exports.userLogIn = ({ body }) => {
  const { email, password } = body;
  const errors = {};
  if (Validator.isEmpty(email)) {
    errors.email = "is required";
  } else if (!Validator.isEmail(email)) {
    errors.email = "Invalid email";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length > 0,
  };
};
