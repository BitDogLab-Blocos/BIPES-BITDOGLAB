# JavaScript do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/js/` contém a aplicação executada no navegador e na WebView Android. O projeto usa scripts clássicos e fachadas globais por compatibilidade com Blockly, projetos salvos e a versão publicada.

## Módulos

| Pasta | Responsabilidade | Guia |
| --- | --- | --- |
| `bootstrap/` | Sequência de inicialização e criação dos serviços. | [README](bootstrap/README.md) |
| `blocks/` | Definições, contratos e geradores MicroPython. | [README](blocks/README.md) |
| `communication/` | Fila, Web Serial e scanner I²C. | [README](communication/README.md) |
| `config/` | Perfis V6/V7 e toolbox Blockly. | [README](config/README.md) |
| `core/` | Workspace, geração, execução, abas, idioma e armazenamento. | [README](core/README.md) |
| `lib/` | Dependências de terceiros vendorizadas. | [README](lib/README.md) |
| `ui/` | Componentes, eventos, feedback e temas. | [README](ui/README.md) |

## Dependências entre camadas

```text
lib + config
      ↓
blocks + communication
      ↓
core
      ↓
ui
      ↓
bootstrap
```

A figura representa ordem de disponibilidade, não autorização para dependências circulares. Um componente UI pode chamar uma fachada do core; o core não deve conhecer detalhes visuais do componente.

## Fachadas estáveis

| Global | Papel |
| --- | --- |
| `Code` | Workspace, geração, abas e internacionalização. |
| `UI` | Registro dos componentes da interface. |
| `Tool` | Execução, parada, reset e gravação de `main.py`. |
| `Channel` | Transporte serial e multiplexador do protocolo. |
| `Files` | Gerenciador de arquivos da placa. |
| `BitdogLabConfig` | Perfil de hardware ativo. |

Módulos podem estender essas fachadas, mas não devem substituí-las nem renomeá-las sem migração.

## Convenções

- um arquivo deve ter responsabilidade explicável em uma frase;
- prefira pastas de domínio a novos `utils.js` genéricos;
- preserve tipos Blockly, campos XML e chaves de tradução;
- leia hardware de `BitdogLabConfig`;
- mantenha valores externos fora de `innerHTML`;
- confirme a ordem do script em `src/pages/index.html`;
- mantenha navegador e WebView Android no mesmo caminho compartilhado.

## Escolher o módulo correto

- forma ou Python de um bloco → `blocks/`;
- GPIO, revisão ou categoria → `config/`;
- transformação do programa → `core/codegen/`;
- comando ou estado serial → `communication/` e `core/execution/`;
- DOM e interação visual → `ui/`;
- montagem inicial → `bootstrap/`.

## Validação

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/**/*.test.js
node --test src/mobile/tests/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```
