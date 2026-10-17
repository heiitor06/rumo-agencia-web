export const soDigitos = (valor: string) => valor.replace(/\D/g, "");

/** Mesma regra dos dígitos verificadores que a API confere com @CPF. */
export function cpfValido(valor: string) {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const nums = d.split("").map(Number);
  const dv = (n: number) => {
    const soma = nums.slice(0, n).reduce((acc, x, i) => acc + x * (n + 1 - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(9) === nums[9] && dv(10) === nums[10];
}

/** Igual a Cpf.mascarar da API: "***.456.789-**". */
export function mascaraApi(valor: string) {
  const d = soDigitos(valor);
  return `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**`;
}

export function formatarCpf(valor: string) {
  const d = soDigitos(valor).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatarTelefone(valor: string) {
  const d = soDigitos(valor).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
