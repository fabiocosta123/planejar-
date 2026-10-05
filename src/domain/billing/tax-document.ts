export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function allSameDigit(digits: string) {
  return /^(\d)\1+$/.test(digits);
}

function checkDigit(digits: string, weights: number[]) {
  const sum = weights.reduce(
    (total, weight, index) => total + Number(digits[index]) * weight,
    0
  );
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

export function isValidCpf(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 11 || allSameDigit(digits)) {
    return false;
  }

  const first = checkDigit(digits, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return first === Number(digits[9]) && second === Number(digits[10]);
}

export function isValidCnpj(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 14 || allSameDigit(digits)) {
    return false;
  }

  const first = checkDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = checkDigit(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return first === Number(digits[12]) && second === Number(digits[13]);
}

export function isValidTaxDocument(value: string) {
  return isValidCpf(value) || isValidCnpj(value);
}

export function formatTaxDocument(value: string) {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}
