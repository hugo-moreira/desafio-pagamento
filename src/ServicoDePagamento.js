/**
 * Classe de servico de pagamento.
 * Mantém um histórico interno de todos os pagamentos realizados.
 */
export default class ServicoDePagamento {
  /** @type {Array<{codigoBarras: string, empresa: string, valor: number, categoria: string}>} */
  #pagamentos;

  constructor() {
    this.#pagamentos = [];
  }


  pagar(codigoBarras, empresa, valor) {
    const categoria = valor > 100 ? 'cara' : 'padrão';

    this.#pagamentos.push({
      codigoBarras,
      empresa,
      valor,
      categoria,
    });
  }


  consultarUltimoPagamento() {
    return this.#pagamentos.at(-1);
  }
}
