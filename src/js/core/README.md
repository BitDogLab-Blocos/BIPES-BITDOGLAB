# Núcleo da aplicação BIPES

**Português** · [Read in English](README.en.md)

Esta pasta reúne a coordenação principal da aplicação no navegador. Seus módulos compartilham o namespace global `Code` para inicializar a interface, administrar o workspace Blockly, gerar Python, navegar entre painéis, persistir projetos e aplicar o idioma escolhido.

## Arquitetura

![Arquitetura dos módulos centrais](images/architecture.png)

Cada arquivo concentra uma responsabilidade e publica apenas os pontos necessários em `Code` ou, no caso do armazenamento e das utilidades, em APIs globais específicas.

| Arquivo | Responsabilidade |
| --- | --- |
| `app.js` | Executa o bootstrap e coordena a inicialização dos subsistemas. |
| `workspace/` | Separa ciclo Blockly, toolbox, projetos e lembretes, publicando a API em `Code`. |
| `codegen/` | Separa validação, organização do Python e geração automática. |
| `execution/` | Executa, interrompe, reinicia e salva `main.py` pela fachada `Tool`. |
| `tabs.js` | Alterna, divide, renderiza e redimensiona os painéis da aplicação. |
| `language.js` | Escolhe o idioma, carrega o catálogo e configura a direção da página. |
| `i18n/` | Separa tradução da interface, Blockly e código gerado. |
| `storage.js` | Salva projetos e backups do workspace no navegador e restaura a última sessão. |
| `terminal.js` e `dom.js` | Integram o terminal e mantêm os pequenos helpers visuais. |
| `utils.js` | Caminho temporário de compatibilidade; a implementação já foi extraída. |

## Como é iniciado

Os módulos usam o mesmo objeto global sem substituir extensões já registradas:

```js
var Code = window.Code || (window.Code = {});
```

Depois que os scripts são carregados, `src/pages/index.html` inicia o núcleo com uma única chamada:

```js
Code.init();
```

`app.js` então prepara mensagens, workspace, idioma, abas e gerenciador de arquivos. A ordem de carregamento declarada na página é importante porque o bootstrap chama funções publicadas pelos módulos anteriores.

## Fluxo básico

1. `app.js` inicia os serviços disponíveis no namespace `Code`.
2. `workspace/` cria o Blockly e carrega as categorias de blocos.
3. Alterações no workspace são persistidas por `storage.js`.
4. `codegen/` transforma os blocos em Python; `execution/` envia o resultado para a placa.
5. `tabs.js` apresenta Blockly, console, arquivos, referência da placa ou painel de dados.
6. `language.js` e `i18n/` mantêm interface, toolbox e código gerado no idioma selecionado.

## Catálogo de traduções

`src/translations/catalog.js` é a fonte única das traduções próprias da BitDogLab. Ele reúne mensagens da interface, textos dos blocos, labels legados do Blockly, nomes e comentários gerados no MicroPython e as regras que impedem identificadores traduzidos de quebrar o código.

Para novos textos de interface, prefira uma chave estável com `Code.t('app.nomeDaMensagem')` ou `data-i18n="app.nomeDaMensagem"`. O tradutor antigo por texto continua disponível para preservar os blocos existentes durante a migração.

> Este código usa scripts clássicos e globais compartilhados. Ao adicionar um módulo, preserve o namespace `Code` e confira sua posição em `src/pages/index.html`.
