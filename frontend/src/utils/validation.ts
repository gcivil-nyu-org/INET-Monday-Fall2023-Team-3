import validator from "validator";

const validateOption = {
  minLength: 0,
  minLowercase: 0,
  minUppercase: 0,
  minNumbers: 0,
  minSymbols: 0,
};

export namespace Validate {
  export const validatePasswordLength = (password: string) => {
    return validator.isStrongPassword(password, {
      ...validateOption,
      minLength: 8,
    });
  };

  export const validatePasswordUppercase = (password: string) => {
    return validator.isStrongPassword(password, {
      ...validateOption,
      minUppercase: 1,
    });
  };

  export const validatePasswordSymbol = (password: string) => {
    return validator.isStrongPassword(password, {
      ...validateOption,
      minSymbols: 1,
    });
  };

  export const validateEmailHost = (email: string) => {
    return validator.isEmail(email, {
      host_whitelist: ["nyu.edu"],
    });
  };

  export const validateEmail = (email: string, setError: (err: string) => void) => {
    if (!validateEmailHost(email)) {
      setError("email must end with @nyu.edu");
      return false;
    }
    return true;
  };

  export const validatePassword = (password: string, setError: (err: string) => void) => {
    if (!validatePasswordLength(password)) {
      setError("password must be at least 8 characters long");
      return false;
    }
    if (!validatePasswordUppercase(password)) {
      setError("password must contain at least 1 uppercase character");
      return false;
    }
    if (!validatePasswordSymbol(password)) {
      setError("password must contain at least 1 symbol character");
      return false;
    }
    return true;
  };
}
