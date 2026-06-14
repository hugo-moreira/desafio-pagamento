# Trabalho de Conclusão — Classe de Pagamento

Projeto desenvolvido na disciplina de **Programação para Automações de Testes** da pós-graduação. Implementa um serviço de pagamento simples com testes automatizados e pipeline de integração contínua via **GitHub Actions**.

---

## Objetivo

Demonstrar a aplicação de testes automatizados unitários com **Mocha** e a configuração de uma pipeline de **CI/CD** que executa os testes automaticamente, gera um relatório HTML e o armazena como artefato na própria pipeline.

---

## Estrutura de Arquivos

```
desafio-login/
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline de CI do GitHub Actions
├── src/
│   └── ServicoDePagamento.js   # Implementação da classe
├── test/
│   └── ServicoDePagamento.test.js  # Testes unitários
├── package.json
└── README.md
```

---

## Instalação

Certifique-se de ter **Node.js 20+** instalado. Em seguida, instale as dependências:

```bash
npm install
```

---

## Execução dos Testes

Para executar os testes localmente:

```bash
npm test
```

O comando executa o Mocha com o reporter **mochawesome**, que gera um relatório HTML em:

```
mochawesome-report/index.html
```

Abra esse arquivo no navegador para visualizar os resultados de forma detalhada.

---

## Pipeline de CI — GitHub Actions

O arquivo `.github/workflows/ci.yml` configura a pipeline de integração contínua.

### Quando a pipeline é executada

| Trigger | Descrição |
|---|---|
| `push` | Executa automaticamente em qualquer push para qualquer branch |
| `workflow_dispatch` | Permite execução manual pela aba **Actions** do repositório no GitHub |
| `schedule` | Execução agendada todo **domingo às 15h00 (UTC-3)** — cron `0 18 * * 0` |

### Etapas do Job

```
1. Checkout          → baixa o código do repositório
2. Setup Node.js 20  → configura o ambiente com cache do npm
3. npm ci            → instala as dependências de forma determinística
4. npm test          → executa os testes e gera o relatório mochawesome
5. Upload Artifact   → publica o relatório como artefato da pipeline
```

O step de upload usa `if: always()`, o que garante que o relatório seja publicado **mesmo quando os testes falham** — permitindo diagnóstico do que deu errado.

### Como visualizar o relatório

1. Acesse o repositório no GitHub
2. Clique na aba **Actions**
3. Selecione a execução desejada
4. Na seção **Artifacts**, faça o download do arquivo `mochawesome-report`
5. Extraia o `.zip` e abra o arquivo `index.html` no navegador

---

## Conceitos Utilizados

### CI/CD (Integração Contínua / Entrega Contínua)

**Integração Contínua** é a prática de integrar e validar o código automaticamente a cada alteração. O objetivo é detectar problemas o mais cedo possível, antes que cheguem à produção. A pipeline garante que os testes sejam sempre executados quando o código é modificado.

### GitHub Actions

Plataforma de automação integrada ao GitHub. Permite definir workflows em arquivos YAML dentro da pasta `.github/workflows/`. Cada workflow é composto por:

- **Triggers (`on`)**: eventos que disparam o workflow (push, schedule, manual)
- **Jobs**: unidades de trabalho executadas em uma máquina virtual (runner)
- **Steps**: comandos ou actions executadas sequencialmente dentro de um job

### Mocha

Framework de testes para JavaScript/Node.js. Organiza os testes com `describe` (agrupamento) e `it` (caso de teste individual). Suporta testes síncronos e assíncronos e múltiplos reporters de saída.

### mochawesome

Reporter para Mocha que gera um relatório visual em HTML com detalhes de cada teste: nome, status (passed/failed), duração e mensagem de erro quando aplicável. Facilita a análise dos resultados, especialmente em execuções de CI.

### `npm ci`

Alternativa ao `npm install` recomendada para ambientes de CI. Instala as dependências **exatamente** como definido no `package-lock.json`, garantindo reprodutibilidade entre execuções e ambientes.

---

## Regras de Negócio — ServicoDePagamento

A classe `ServicoDePagamento` possui dois métodos:

### `pagar(codigoBarras, empresa, valor)`

Registra um novo pagamento no histórico interno da instância.

- **`codigoBarras`** `{string}` — identificador do boleto ou fatura
- **`empresa`** `{string}` — nome da empresa beneficiária
- **`valor`** `{number}` — valor monetário do pagamento
- **Retorno:** `void`
- A propriedade `categoria` é calculada automaticamente: `'cara'` quando `valor > 100`, `'padrão'` nos demais casos

### `consultarUltimoPagamento()`

Retorna o objeto do pagamento mais recente registrado.

- **Retorno:** `{Object|undefined}` — objeto com `codigoBarras`, `empresa`, `valor` e `categoria`, ou `undefined` se nenhum pagamento foi realizado

---

## Exemplo de Uso

```javascript
const servico = new ServicoDePagamento();
servico.pagar('0987-7656-3475', 'Samar', 156.87);
console.log(servico.consultarUltimoPagamento());
// { codigoBarras: '0987-7656-3475', empresa: 'Samar', valor: 156.87, categoria: 'cara' }
```
