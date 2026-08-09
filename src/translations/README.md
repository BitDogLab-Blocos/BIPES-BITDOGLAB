# Traduções do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/translations/` é a fonte de textos em português do Brasil e inglês usados pela interface web, Blockly, código MicroPython gerado, guias e WebView Android.

## Estrutura

```text
src/translations/
├── catalog.js
└── blockly/
    ├── messages.js
    └── data/
        ├── constants.json
        ├── en.json
        ├── pt-br.json
        └── synonyms.json
```

| Parte | Responsabilidade |
| --- | --- |
| `catalog.js` | Mensagens próprias da aplicação e regras de tradução do código gerado. |
| `blockly/messages.js` | Fonte e metadados das mensagens originadas no Blockly. |
| `blockly/data/*.json` | Dados derivados usados pelo tooling de mensagens Blockly. |

## Camadas do catálogo

`Code.TRANSLATION_CATALOG` separa conteúdos com riscos diferentes:

| Camada | Exemplo de consumidor |
| --- | --- |
| `app` | `Code.t('app.saveMainLabel')` e `data-i18n`. |
| `blockly` | Labels, categorias e mensagens do editor. |
| `text` | Compatibilidade com traduções antigas baseadas no texto original. |
| `generated` | Identificadores, comentários e strings emitidos em MicroPython. |

Novos textos de interface devem usar chaves. A tradução textual permanece somente para preservar blocos e projetos antigos.

## Adicionar uma mensagem de interface

1. Escolha uma chave estável que descreva o significado, não a posição visual.
2. Adicione português e inglês em `APP_MESSAGES`.
3. Preserve placeholders como `%1`, `%2` e quebras de linha em ambos os idiomas.
4. Consuma a chave no JavaScript:

```js
UI.notify.send(Code.t('app.versionChanged'));
```

ou no HTML:

```html
<span data-i18n="app.saveMainLabel">Salvar na placa</span>
```

O texto original em HTML deve continuar útil caso o catálogo não carregue.

## Traduzir o código gerado

MicroPython possui nomes que não podem mudar, como módulos, classes, métodos e argumentos de API. `core/i18n/generated-code.js` usa listas explícitas e regras conservadoras para distinguir texto pedagógico de sintaxe executável.

Ao adicionar uma tradução de código:

- não altere imports, nomes de módulos ou atributos MicroPython;
- mantenha pinos, números e valores literais funcionais;
- preserve nomes necessários entre setup e loop;
- teste identificadores compostos e palavras reservadas;
- confira o resultado em V6 e V7.

## Mensagens Blockly

Os JSONs em `blockly/data/` não são um segundo catálogo da BitDogLab. Eles apoiam o conjunto de mensagens do Blockly. Ao mudar essa origem, atualize os idiomas e dados derivados em conjunto, seguindo os comentários de `blockly/messages.js`.

## Guias de hardware

Os tutoriais registram traduções dentro de seu próprio `tutorial.js`, pois cada módulo é carregado de forma independente. O teste de i18n garante que toda chave `data-copy` tenha versão inglesa.

## Checklist

- português e inglês carregam sem chave visível;
- placeholders aparecem na mesma quantidade e ordem;
- textos longos cabem em botões e painéis estreitos;
- atributos `alt`, títulos e mensagens dinâmicas também são traduzidos;
- Python gerado mantém APIs e executabilidade;
- WebView Android apresenta o mesmo catálogo da web.

## Validação

```powershell
node --test tests/i18n/*.test.js
node tests/examples_generation_smoke.js
node --test src/mobile/tests/*.test.js
```
