# Mapa do código-fonte BIPES–BitDogLab

`src/` contém a interface web compartilhada do BIPES–BitDogLab e seu empacotamento Android. Este arquivo é o ponto de entrada para localizar responsabilidades; cada módulo possui um README mais específico.

## Estrutura principal

```text
src/
├── pages/              # documentos HTML e pontos de entrada
├── styles/             # CSS global, páginas e temas
├── assets/             # imagens, ícones, cursores e mídia Blockly
├── js/
│   ├── bootstrap/      # inicialização da página e dos serviços
│   ├── blocks/         # definições, contratos e geradores
│   ├── communication/  # fila, Web Serial e scanner I²C
│   ├── config/         # perfis V6/V7 e toolbox
│   ├── core/           # workspace, geração, execução, abas e idioma
│   ├── lib/            # bibliotecas de terceiros vendorizadas
│   └── ui/             # componentes e eventos da interface
├── translations/       # catálogo PT-BR/EN e dados Blockly
├── hardware-guides/    # tutoriais modulares da aba Dispositivo
└── mobile/             # WebView Android e ponte USB Host
```

## Guias por domínio

| Área | Português | English |
| --- | --- | --- |
| Assets | [README](assets/README.md) | [README](assets/README.en.md) |
| Guias de hardware | [README](hardware-guides/README.md) | [README](hardware-guides/README.en.md) |
| Blocos | [README](js/blocks/README.md) | [README](js/blocks/README.en.md) |
| Comunicação | [README](js/communication/README.md) | [README](js/communication/README.en.md) |
| Configuração | [README](js/config/README.md) | [README](js/config/README.en.md) |
| Núcleo | [README](js/core/README.md) | [README](js/core/README.en.md) |
| Bibliotecas | [README](js/lib/README.md) | [README](js/lib/README.en.md) |
| Interface | [README](js/ui/README.md) | [README](js/ui/README.en.md) |
| Traduções | [README](translations/README.md) | [README](translations/README.en.md) |
| Android | [README](mobile/README.md) | — |

## Fluxo da aplicação

```text
index.html
   ↓
bootstrap → Code.init()
   ↓
workspace + toolbox + UI
   ↓
blocos → contratos → Python
   ↓
execução → comunicação → BitDogLab
```

O aplicativo Android empacota esse mesmo fluxo e fornece um shim `navigator.serial` apoiado pela USB Host nativa.

## Onde fazer uma mudança

| Necessidade | Local correto |
| --- | --- |
| Novo bloco ou gerador | `js/blocks/` e `js/config/toolbox.xml` |
| Novo pino ou revisão da placa | `js/config/profiles/` |
| Alteração no workspace ou Python final | `js/core/workspace/` ou `js/core/codegen/` |
| Nova operação serial | `js/communication/` ou `js/core/execution/` |
| Novo componente visual | `js/ui/` e `styles/` |
| Novo texto traduzível | `translations/catalog.js` |
| Novo tutorial de montagem | `hardware-guides/<projeto>/` |
| Adaptação exclusiva do Android | `mobile/android/` |

## Contratos que devem permanecer estáveis

- tipos e campos Blockly usados por XMLs salvos;
- fachadas globais `Code`, `UI`, `Tool`, `Channel` e `Files`;
- estrutura dos perfis `BitdogLabConfig`;
- protocolo Web Serial e reconhecimento do prompt MicroPython;
- chaves de tradução e identificadores executáveis do Python;
- fronteira de assets compartilhados com o APK.

## Validação padrão

```powershell
node tests/examples_generation_smoke.js
node tests/block_contracts_smoke.js
node --test tests/communication/*.test.js tests/device-files/*.test.js tests/i18n/*.test.js
node --test src/mobile/tests/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```

Além dos testes, abra `src/pages/index.html` por um servidor HTTP e confira onboarding, projetos, abas, idiomas, temas, V6/V7 e geração de código sem erros no navegador.
