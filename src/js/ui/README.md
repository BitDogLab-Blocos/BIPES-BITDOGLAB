# Interface do BIPES

**Português** · [Read in English](README.en.md)

Esta pasta conecta eventos do navegador aos serviços do BIPES e mantém o estado visual da aplicação. Ela controla painéis, o estado de projetos usado pelo armazenamento, notificações, responsividade, progresso, ações do workspace e a apresentação dos avisos de contratos Blockly.

## Arquitetura

![Arquitetura da interface do BIPES](images/architecture.png)

Os componentes clássicos agora ficam em arquivos por responsabilidade. `ui.js` apenas cria o registro global `UI`, e `block_warning_ui.js` adapta as bolhas geradas pelo validador de blocos.

| Componente | Responsabilidade |
| --- | --- |
| `panels.js` | Painéis, canal de comunicação e responsividade. |
| `notifications.js` | Mensagens temporárias e logs de diagnóstico. |
| `progress.js` | Progresso de transmissão e operações de arquivo. |
| `workspace-controls.js` | Botões de execução, conexão, dispositivo e arquivos XML. |
| `ui.js` | Cria os componentes e devolve o registro usado pelo bootstrap. |
| `block_warning_ui.js` | Quebra textos longos e estiliza bolhas de avisos de contratos. |
| `device-reference.js` | Carrega e navega pelos módulos independentes documentados em `src/hardware-guides/README.md`. |

## Como é iniciado

Depois que núcleo, comunicação, terminal e arquivos estão disponíveis, `src/pages/index.html` cria o registro global:

```js
var UI = UIFactory.create();
```

Outros módulos acessam esses componentes por chave, por exemplo `UI['notify'].send(message)` e `UI['progress'].start(total)`.

## Fluxo básico

1. Cliques e mudanças de seleção chegam aos componentes de `ui.js`.
2. O componente atualiza o DOM e, quando necessário, chama núcleo, armazenamento ou comunicação.
3. `notify` traduz e apresenta respostas ao usuário.
4. `progress` acompanha filas e transferências.
5. O validador de contratos escreve avisos nos blocos.
6. `block_warning_ui.js` formata a bolha de aviso para leitura no workspace.

> A camada depende de vários globais legados, como `Code`, `Channel`, `Files`, `Tool` e `mux`. Preserve a ordem de carregamento ao dividir ou adicionar componentes.
