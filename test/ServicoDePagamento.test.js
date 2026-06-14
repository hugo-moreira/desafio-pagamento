import assert from 'node:assert';
import ServicoDePagamento from '../src/ServicoDePagamento.js';

describe('ServicoDePagamento', () => {
  describe('pagar()', () => {
    it('deve classificar como "cara" quando o valor for maior que 100', () => {
      // Arrange
      const servico = new ServicoDePagamento();

      // Act
      servico.pagar('0987-7656-3475', 'Samar', 156.87);
      const resultado = servico.consultarUltimoPagamento();

      // Assert
      assert.strictEqual(resultado.categoria, 'cara');
    });

    it('deve classificar como "padrão" quando o valor for igual ou menor que 100', () => {
      // Arrange
      const servico = new ServicoDePagamento();

      // Act
      servico.pagar('1111-2222-3333', 'Água', 100);
      const resultado = servico.consultarUltimoPagamento();

      // Assert
      assert.strictEqual(resultado.categoria, 'padrão');
    });
  });

  describe('consultarUltimoPagamento()', () => {
    it('deve retornar apenas o último pagamento quando múltiplos pagamentos forem realizados', () => {
      // Arrange
      const servico = new ServicoDePagamento();

      // Act
      servico.pagar('0001-0001-0001', 'Internet', 99.90);
      servico.pagar('0987-7656-3475', 'Samar', 156.87);
      const resultado = servico.consultarUltimoPagamento();

      // Assert
      assert.deepStrictEqual(resultado, {
        codigoBarras: '0987-7656-3475',
        empresa: 'Samar',
        valor: 156.87,
        categoria: 'cara',
      });
    });
  });
});
