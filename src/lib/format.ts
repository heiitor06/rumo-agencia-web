const moedaFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const moedaCurtaFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const moeda = (valor: number) => moedaFmt.format(valor);
export const moedaCurta = (valor: number) => moedaCurtaFmt.format(valor);

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MESES_LONGOS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** A API manda LocalDate ("2026-11-14"); ler como texto evita o fuso deslocar o dia. */
export function partesData(iso: string) {
  const [ano, mes, dia] = iso.split("-").map(Number);
  return { ano, mes, dia };
}

export function dataCurta(iso: string) {
  const { dia, mes } = partesData(iso);
  return `${String(dia).padStart(2, "0")} ${MESES[mes - 1]}`;
}

export function dataLonga(iso: string) {
  const { dia, mes, ano } = partesData(iso);
  return `${dia} de ${MESES_LONGOS[mes - 1]} de ${ano}`;
}

export function mesAno(chave: string) {
  const [ano, mes] = chave.split("-").map(Number);
  return `${MESES_LONGOS[mes - 1]} ${ano}`;
}

export const chaveMes = (iso: string) => iso.slice(0, 7);

export function plural(n: number, um: string, varios: string) {
  return `${n} ${n === 1 ? um : varios}`;
}

/** Data de hoje no fuso de São Paulo, no mesmo formato da API. A API usa a mesma regra para "já partiu". */
export function hojeSP() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}
