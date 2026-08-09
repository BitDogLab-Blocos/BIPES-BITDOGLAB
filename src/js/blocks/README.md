# Blocos Blockly do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/js/blocks/` define a linguagem visual do BIPES–BitDogLab. Cada tipo Blockly possui aparência, regras de encaixe e uma tradução para Python. A pasta também protege o usuário contra combinações semanticamente inválidas.

![Arquitetura do sistema de blocos](images/architecture.png)

## Fluxo de um bloco

```text
toolbox.xml → definição → contrato → gerador → core/codegen → MicroPython
```

| Caminho | Responsabilidade |
| --- | --- |
| `definitions/` | Forma, campos, entradas, saídas e conexões Blockly. |
| `generators/` | Imports, configuração e instruções Python de cada tipo. |
| `contracts/types.js` | Domínios semânticos aceitos pelas conexões. |
| `contracts/registry.js` | Requisitos, dependências e mensagens bilíngues. |
| `contracts/validator.js` | Avisos no workspace e bloqueio de código inválido. |
| `registry.js` | Confere se cada tipo da toolbox tem definição e gerador. |
| `sensor_libs.js` | Drivers MicroPython incorporados por alguns geradores. |

Os arquivos `index.js` de definições e geradores funcionam como pontos de entrada; eles não devem concentrar implementações de domínio.

## Identidade de um tipo

O mesmo identificador deve aparecer em três lugares:

```js
Blockly.Blocks['meu_bloco'] = {
  init: function() {
    this.appendDummyInput().appendField('Meu bloco');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Python['meu_bloco'] = function() {
  return 'print("BitDogLab")\n';
};
```

```xml
<block type="meu_bloco"></block>
```

Renomear um tipo quebra XMLs salvos. Se uma mudança for inevitável, implemente uma migração antes de remover o identificador antigo.

## Adicionar um bloco

1. Escolha o arquivo de domínio em `definitions/`.
2. Registre a definição com um tipo único e estável.
3. Crie o gerador correspondente em `generators/`.
4. Adicione o tipo a `src/js/config/toolbox.xml`.
5. Registre domínio ou contrato quando houver restrições de encaixe ou contexto.
6. Inclua mensagens em português e inglês.
7. Crie pelo menos um XML de exemplo que exercite o gerador.

## Regras para geradores

- Leia pinos e periféricos de `BitdogLabConfig`; não espalhe números GPIO.
- Coloque imports e inicializações em `Blockly.Python.definitions_`.
- Use os marcadores de `BitdogLabConfig.MARKERS` para setup e loop.
- Preserve os formatos de retorno esperados pelo Blockly: string para comandos e `[code, order]` para valores.
- Não traduza identificadores MicroPython diretamente; a camada `core/i18n/` trata o código final.
- Reutilize helpers e drivers existentes antes de duplicar código Python.

## Ordem de carregamento

`src/pages/index.html` deve carregar contratos e definições antes dos consumidores correspondentes. `BlockRegistry.validateToolbox()` é executado no navegador para detectar tipos ausentes cedo.

## Validação obrigatória

```powershell
node tests/block_contracts_smoke.js
node tests/examples_generation_smoke.js
node --test tests/i18n/*.test.js
```

Uma alteração de bloco só está pronta quando todos os exemplos importam no Blockly real, nenhum tipo fica sem gerador e o Python resultante continua válido para V6 e V7.
