export const isMinLength = (val: string, minLength: number) => {
  return val.length >= minLength;
};

export const isMaxLength = (val: string, maxLength: number) => {
  return val.length <= maxLength;
};


export const isCharacterAndNumber = (val: string) => {
  if (!/^[a-zA-Z0-9]+$/.test(val)) {
    return false;
  }
  return true;
};
