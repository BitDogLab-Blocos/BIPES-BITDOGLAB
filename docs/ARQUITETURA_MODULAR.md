# Arquitetura modular do BIPES BitDogLab

Este documento apresenta a organização do código para desenvolvedores. A arquitetura foi desenhada para continuar próxima do JavaScript original do projeto: scripts clássicos, execução sem backend e fachadas globais compatíveis.

## Visão geral

```text
index.html
   -> bootstrap inicia a página e cria os serviços
   -> core controla workspace, código e armazenamento
   -> blocks define os blocos e gera MicroPython
   -> communication conversa com a placa
   -> ui conecta botões e painéis aos serviços
```

Não há framework, bundler, container de dependências ou barramento global de eventos. A modularização separa somente responsabilidades concretas.

## Estrutura principal

```text
src/js/
├── bootstrap/
│   ├── onboarding.js
│   ├── services.js
│   └── page.js
├── core/
│   ├── workspace/
│   │   ├── lifecycle.js
│   │   ├── toolbox.js
│   │   ├── projects.js
│   │   ├── hints.js
│   │   └── index.js
│   ├── codegen/
│   │   ├── python-organizer.js
│   │   ├── generator.js
│   │   ├── auto-generation.js
│   │   └── index.js
│   ├── execution/
│   │   ├── runner.js
│   │   ├── main-file.js
│   │   └── index.js
│   ├── i18n/
│   │   ├── index.js
│   │   ├── generated-code.js
│   │   └── interface.js
│   ├── storage.js
│   ├── tabs.js
│   ├── terminal.js
│   └── dom.js
├── blocks/
│   ├── definitions/
│   ├── generators/
│   ├── contracts/
│   └── registry.js
├── communication/
├── config/profiles/
└── ui/
    ├── panels.js
    ├── notifications.js
    ├── progress.js
    ├── workspace-controls.js
    └── ui.js
```

## Onde alterar cada comportamento

| Necessidade | Local |
| --- | --- |
| inicialização da página | `src/js/bootstrap/` |
| criação e descarte do Blockly | `src/js/core/workspace/lifecycle.js` |
| categorias disponíveis por projeto | `src/js/core/workspace/toolbox.js` |
| projetos e avisos de hardware | `src/js/core/workspace/projects.js` |
| lembretes educativos | `src/js/core/workspace/hints.js` |
| organização do Python | `src/js/core/codegen/python-organizer.js` |
| geração e validação | `src/js/core/codegen/generator.js` |
| executar, parar ou reiniciar | `src/js/core/execution/runner.js` |
| salvar `main.py` | `src/js/core/execution/main-file.js` |
| conexão Web Serial e REPL | `src/js/communication/` |
| definição visual de um bloco | `src/js/blocks/definitions/` |
| Python produzido por um bloco | `src/js/blocks/generators/` |
| contratos semânticos | `src/js/blocks/contracts/` |
| pinos V6/V7 | `src/js/config/profiles/` |
| botões do workspace | `src/js/ui/workspace-controls.js` |
| painéis e responsividade | `src/js/ui/panels.js` |
| tradução da interface | `src/js/core/i18n/interface.js` |
| tradução do código gerado | `src/js/core/i18n/generated-code.js` |

## Inicialização

`src/pages/index.html` declara as bibliotecas e módulos na ordem necessária. No final da página:

1. `onboarding.js` registra boas-vindas e tutorial;
2. `services.js` sabe criar comunicação, terminal, arquivos e UI;
3. `page.js` chama `Code.init()`, cria os serviços e carrega a toolbox do projeto.

O HTML não contém mais a implementação desses fluxos.

## Fachadas de compatibilidade

Os nomes históricos continuam disponíveis:

- `Code`: workspace, geração, idioma e navegação;
- `Tool`: executar, parar, reiniciar e salvar na placa;
- `UI`: painéis, notificações, progresso e controles;
- `Channel`: canal serial e multiplexador;
- `Files`: gerenciador de arquivos da placa;
- `MSG`: mensagens do idioma ativo.

Os arquivos `index.js` das subpastas publicam as implementações nessas fachadas. Isso permite dividir internamente sem quebrar blocos, mobile ou integrações existentes.

## Blocos

Um tipo Blockly usa o mesmo identificador na definição, no gerador e na toolbox. Quando necessário, também possui contrato semântico.

Para adicionar um bloco:

1. criar sua definição em `blocks/definitions/`;
2. criar seu gerador em `blocks/generators/`;
3. adicioná-lo a `config/toolbox.xml`;
4. adicionar domínio ou contrato quando houver restrição de encaixe;
5. adicionar tradução e exemplo;
6. executar os testes de exemplos e contratos.

`blocks/registry.js` verifica no navegador se os tipos da toolbox possuem definição e gerador.

## Perfis de hardware

`config/profiles/base.js` contém os padrões da V7, a cópia profunda, o merge e a validação. `v7.js` usa esses padrões diretamente. `v6.js` declara somente pinos, brilho, inversões e barramentos diferentes.

O restante da aplicação continua lendo `BitdogLabConfig`, independentemente da versão selecionada.

## Regras de manutenção

- cada arquivo deve ter uma responsabilidade explicável em uma frase;
- não criar um novo arquivo genérico `utils.js`;
- lógica serial permanece em `communication/`;
- lógica de geração permanece em `blocks/generators/` ou `core/codegen/`;
- GPIO e diferenças de placa permanecem nos perfis;
- bibliotecas em `lib/` não são editadas;
- tipos Blockly, campos XML e fachadas globais não são renomeados sem migração;
- uma divisão só é útil quando deixa a localização do código mais óbvia.

## Validação

As verificações principais são:

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/communication/*.test.js
node --test tests/device-files/*.test.js
node --test tests/i18n/*.test.js
node --test src/mobile/tests/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```

O simulador de exemplos abre a interface real, importa todos os XMLs versionados e confirma definição, gerador, contratos e Python produzido.
