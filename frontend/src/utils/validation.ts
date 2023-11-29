import validator from "validator";

export namespace Validate {
  export const validatePasswordLength = (password: string) => {
    const validateOption = {
      minLength: 8,
    };
    return validator.isStrongPassword(password, validateOption);
  };

  export const validatePasswordUppercase = (password: string) => {
    const validateOption = {
      minUppercase: 1,
    };
    return validator.isStrongPassword(password, validateOption);
  };

  export const validatePasswordSymbol = (password: string) => {
    const validateOption = {
      minSymbols: 1,
    };
    return validator.isStrongPassword(password, validateOption);
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
