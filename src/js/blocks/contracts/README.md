# Contratos dos blocos Blockly

**Português** · [Read in English](README.en.md)

Esta pasta concentra as regras que fazem os blocos Blockly se encaixarem de forma segura e avisam quando um programa está incompleto ou sendo usado no contexto errado.

![Fluxo dos contratos Blockly](images/contracts-flow.svg)

## A diferença entre os arquivos

| Arquivo | Pergunta que responde | Responsabilidade |
| --- | --- | --- |
| `types.js` | “O que pode encaixar aqui?” | Define os tipos semânticos das conexões e aplica `setCheck()` no Blockly. |
| `registry.js` | “O que este bloco exige?” | Registra entradas obrigatórias, dependências, blocos permitidos e textos dos avisos. |
| `external_resources.js` | “Qual recurso físico este bloco ocupa?” | Registra periféricos externos, campos de conexão e GPIOs compartilhados. |
| `validator.js` | “O programa está correto?” | Lê as regras, verifica o workspace e mostra os avisos ou impede a geração inválida. |

`external_resources.js` separa a pinagem física das regras de encaixe. Blocos do mesmo periférico podem compartilhar uma conexão, como temperatura e umidade do mesmo DHT11. Periféricos diferentes que reivindicam o mesmo GPIO recebem aviso nos dois blocos e bloqueiam a geração até que a conexão lógica e o cabo na placa sejam conferidos.

## Por que `types.js` não lista todos os blocos?

`types.js` trabalha com grupos de comportamento chamados domínios. Por exemplo, vários blocos podem pertencer a `LED_COMMANDS` ou `SOUND_COMMANDS`. Assim, uma regra é aplicada ao grupo inteiro.

Além disso, os blocos comuns recebem a regra padrão `ProgramCommand` por meio de `applyDefaultPreviousCheck()`. Por isso eles não precisam aparecer individualmente.

Esse arquivo só precisa declarar explicitamente os casos que têm uma conexão especial, como:

- comandos de LED;
- comandos de som;
- comandos da matriz;
- opções aceitas pelo `joystick_seletor`;
- entradas dinâmicas como `STEP0`, `STEP1` e `DESENHO0`.

## Por que `registry.js` tem mais regras?

O registro não cuida apenas do encaixe visual. Ele descreve exigências específicas de cada bloco, por exemplo:

- uma entrada de valor que não pode ficar vazia;
- um bloco que só funciona depois de outro bloco;
- os blocos permitidos dentro de um contêiner;
- uma família de entradas dinâmicas encontrada por prefixo;
- o texto que deve aparecer no aviso.

Portanto, `registry.js` pode parecer mais detalhado. Ele registra contratos de validação específicos, enquanto `types.js` reaproveita domínios e regras gerais. Nem todo bloco precisa de uma entrada própria em `CONTRACTS`.

## Exemplo real: `criar_trilha_sonora`

O bloco possui entradas de comando chamadas `STEP0`, `STEP1`, `STEP2` e assim por diante.

Em `types.js`:

```js
{
  prefix: 'STEP',
  allow: 'SoundCommand'
}
```

Essa regra controla o encaixe no Blockly: uma entrada `STEP*` deve receber um comando de som.

Em `registry.js`:

```js
{
  prefix: 'STEP',
  allow: SOUND_COMMANDS,
  label: 'comandos de som'
}
```

Essa regra permite ao validador conferir os identificadores reais dos blocos e explicar o erro ao usuário.

As duas regras são importantes porque protegem momentos diferentes: o Blockly controla o encaixe durante a edição, e o validador também consegue detectar XML ou estado inválido criado por importação, código antigo ou alteração programática.

## Exemplo de entrada obrigatória

```js
joystick_controlar_led: {
  requiredValueInputs: {
    COR: 'cor'
  }
}
```

Isso não define a cor em `types.js`. O contrato diz ao `validator.js` que o campo `COR` precisa receber um bloco de cor e fornece o texto do aviso caso esteja vazio.

## Fluxo de execução

```text
definição do bloco
        ↓
types.js aplica os tipos de encaixe
        ↓
usuário monta o workspace Blockly
        ↓
registry.js descreve as exigências
        ↓
external_resources.js registra os recursos físicos
        ↓
validator.js verifica o workspace
        ↓
aviso ao usuário ou geração do código
```

## APIs compartilhadas

| API | Criada por | Usada para |
| --- | --- | --- |
| `Code.BlockTypeDomains` | `types.js` | Consultar domínios, tipos de saída e regras de conexão. |
| `Code.BlockContracts` | `registry.js` | Consultar o contrato e as mensagens de cada bloco. |
| `Code.ExternalResources` | `external_resources.js` | Consultar os recursos físicos reivindicados por cada bloco externo. |

O carregamento deve ocorrer antes do validador. Primeiro os tipos ficam disponíveis, depois os contratos são registrados e, por fim, o validador usa essas informações.

## Regra mental para estudar

```text
types.js    = como o bloco encaixa
registry.js = o que o bloco exige
external_resources.js = qual recurso físico o bloco ocupa
validator.js = como o sistema confere e avisa
```
