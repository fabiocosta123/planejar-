export function isoToBrazilian(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);

  return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
}

export function maskBrazilianDate(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Converte DD/MM/AAAA para AAAA-MM-DD. Texto vazio vira "".
 * Uma data incompleta ou inexistente volta como veio, para o servidor recusar.
 */
export function brazilianToIso(display: string): string {
  const text = display.trim();

  if (!text) {
    return "";
  }

  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);

  if (!match) {
    return text;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return text;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}
