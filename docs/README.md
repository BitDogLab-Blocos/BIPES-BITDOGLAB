# Documentação da Estrutura do Projeto BIPES-BITDOGLAB

## 📁 Estrutura de Diretórios

Esta documentação descreve a estrutura organizada do projeto BIPES-BITDOGLAB, seguindo as melhores práticas de engenharia de software.

```
BIPES-BITDOGLAB/
├── .github/                          # Configurações do GitHub
│   └── workflows/
│       └── static.yml               # CI/CD - Deploy para GitHub Pages
│
├── docs/                            # Documentação do projeto
│   ├── hardware/
│   │   └── BitDogLab_HDB.pdf       # Especificações de hardware
│   └── README.md                    # Este arquivo
│
├── src/                             # Código-fonte da aplicação
│   ├── assets/                      # Assets estáticos
│   │   ├── audio/                   # Sons de feedback (click, delete, disconnect)
│   │   ├── cursors/                 # Cursores customizados
│   │   ├── images/
│   │   │   ├── logos/              # Logos (BIPES, BitdogLab)
│   │   │   └── blockly/            # Imagens do Blockly
│   │   ├── icons/                   # Ícones SVG
│   │   └── media/                   # Assets do Blockly (sprites, etc.)
│   │
│   ├── js/                          # JavaScript modularizado
│   │   ├── blocks/                  # Definições de blocos customizados
│   │   │   ├── basic/              # Blocos básicos (repetição, lógica)
│   │   │   ├── definitions.js      # Blocos do BitdogLab
│   │   │   └── generators.js       # Geradores de código Python
│   │   ├── config/                  # Configurações
│   │   │   ├── bitdoglab.js        # Config do hardware BitdogLab
│   │   │   └── toolbox.xml         # Paleta de blocos
│   │   ├── core/                    # Núcleo da aplicação
│   │   │   ├── app.js              # Controlador principal
│   │   │   ├── storage.js          # Auto-save (localStorage)
│   │   │   └── utils.js            # Funções utilitárias
│   │   ├── communication/           # Comunicação serial
│   │   │   ├── channel.js          # Abstração de canais
│   │   │   └── webserial.js        # Web Serial API
│   │   ├── ui/                      # Interface do usuário
│   │   │   └── ui.js               # Componentes UI
│   │   └── lib/                     # Bibliotecas externas (vendor)
│   │       ├── blockly/            # Google Blockly
│   │       ├── codemirror/         # Editor de código
│   │       ├── xterm/              # Emulador de terminal
│   │       └── filesaver/          # Download de arquivos
│   │
│   ├── styles/                      # Estilos CSS
│   │   ├── main.css                # Estilos principais
│   │   └── libs.css                # Estilos de bibliotecas
│   │
│   ├── translations/                # Traduções e internacionalização
│   │   ├── blockly/                # Traduções do Blockly (89 idiomas)
│   │   │   ├── messages.js
│   │   │   ├── languages/          # Arquivos de tradução (.js)
│   │   │   └── data/               # JSON de configuração
│   │   └── app/                     # Traduções customizadas da aplicação
│   │       └── pt-br.js
│   │
│   └── pages/                       # Páginas HTML
│       ├── index.html              # Aplicação principal
│       └── device-reference.html   # Referência de hardware
│
├── firmware/                        # Código para o dispositivo
│   └── PyLibs/
│       └── ssd1306.py              # Driver do display OLED (MicroPython)
│
├── .gitignore                       # Arquivos ignorados pelo Git
├── index.html                       # Entry point (redireciona para src/pages/)
├── LICENSE                          # Licença do projeto
└── README.md                        # Documentação principal
```

## 🎯 Principais Mudanças

### Organização por Responsabilidade

1. **`src/js/blocks/`** - Todos os blocos customizados agrupados
   - Blocos básicos separados dos específicos do BitdogLab
   - Definições e geradores de código juntos logicamente

2. **`src/js/config/`** - Configurações centralizadas
   - Hardware (pinagem, constantes)
   - Interface (toolbox XML)

3. **`src/js/core/`** - Lógica principal da aplicação
   - Separado de bibliotecas externas
   - Módulos com responsabilidades únicas

4. **`src/js/communication/`** - Camada de comunicação isolada
   - Fácil adicionar novos protocolos
   - Abstração clara de canais

5. **`src/js/lib/`** - Vendor/Bibliotecas externas
   - Separadas do código próprio
   - Fácil atualização de dependências

### Assets Organizados

- **Por tipo**: `audio/`, `cursors/`, `images/`, `icons/`
- **Por propósito**: `images/logos/`, `images/blockly/`
- **Compatibilidade Blockly**: `media/` com sprites e ícones

### Traduções Estruturadas (translations/)

- **89 idiomas** organizados em `translations/blockly/languages/`
- **Dados de tradução** em JSON (`translations/blockly/data/`)
- **Traduções customizadas** em `translations/app/`

## 🔧 Mapeamento de Caminhos

### Arquivos Movidos

| Localização Antiga | Localização Nova |
|-------------------|------------------|
| `ui/core/code.js` | `src/js/core/app.js` |
| `ui/core/bitdoglab_config.js` | `src/js/config/bitdoglab.js` |
| `ui/toolbox/default.xml` | `src/js/config/toolbox.xml` |
| `ui/core/block_definitions.js` | `src/js/blocks/definitions.js` |
| `ui/core/generator_stubs.js` | `src/js/blocks/generators.js` |
| `ui/core/basic_blocks/*.js` | `src/js/blocks/basic/*.js` |
| `ui/core/webserial.js` | `src/js/communication/webserial.js` |
| `ui/core/channel.js` | `src/js/communication/channel.js` |
| `ui/core/blockly_compressed.js` | `src/js/lib/blockly/blockly_compressed.js` |
| `ui/core/xterm.js` | `src/js/lib/xterm/xterm.js` |
| `ui/core/FileSaver.js` | `src/js/lib/filesaver/FileSaver.js` |
| `ui/style.css` | `src/styles/main.css` |
| `ui/media/*` | `src/assets/audio/`, `src/assets/images/`, etc. |
| `ui/b.msg/` | `src/translations/blockly/` |
| `ui/msg/` | `src/translations/app/` |
| `ui/index.html` | `src/pages/index.html` |
| `ui/Bitdoglab_device/bitdoglab.html` | `src/pages/device-reference.html` |
| `Hardware_Reference/*.pdf` | `docs/hardware/*.pdf` |
| `ssd1306.py` | `firmware/PyLibs/ssd1306.py` |

### Caminhos Relativos Atualizados

**Em `src/pages/index.html`:**
- CSS: `../styles/main.css`, `../styles/libs.css`
- JS Core: `../js/core/app.js`, `../js/core/storage.js`, `../js/core/utils.js`
- JS Config: `../js/config/bitdoglab.js`, `../js/config/toolbox.xml`
- JS Blocks: `../js/blocks/definitions.js`, `../js/blocks/generators.js`
- JS Communication: `../js/communication/webserial.js`, `../js/communication/channel.js`
- JS Libs: `../js/lib/blockly/`, `../js/lib/codemirror/`, `../js/lib/xterm/`
- Assets: `../assets/images/logos/`, `../assets/icons/`
- Traduções: `../translations/app/`, `../translations/blockly/languages/`

**Em `src/js/core/app.js`:**
- Media path: `../assets/media/` (para compatibilidade com Blockly)
- Traduções: `../translations/app/`, `../translations/blockly/languages/`

**Em `src/styles/main.css`:**
- Imagens: `url(../assets/images/logos/bitdoglab.jpg)`
- Ícones: `url(../assets/icons/icons.svg)`

## 🚀 Como Executar

1. **Desenvolvimento Local:**
   - Abra `index.html` na raiz do projeto
   - Ou sirva via HTTP server: `python -m http.server 8000`
   - Acesse: `http://localhost:8000`

2. **GitHub Pages:**
   - O deploy é automático via GitHub Actions
   - Configurado em `.github/workflows/static.yml`
   - Acessa todo o repositório incluindo a nova estrutura `src/`

## 🔄 Compatibilidade

- ✅ Todos os caminhos de importação atualizados
- ✅ Referências CSS atualizadas
- ✅ Assets do Blockly compatíveis (pasta `media/`)
- ✅ Sistema de traduções funcional (89 idiomas)
- ✅ Web Serial API preservada
- ✅ Auto-save (localStorage) intacto

## 📦 Dependências (Bundled)

Todas as dependências estão incluídas em `src/js/lib/`:

- **Blockly** (~664KB) - Framework de programação visual
- **xterm.js** (~313KB) - Emulador de terminal
- **CodeMirror** - Editor de código Python
- **FileSaver.js** - Download de arquivos no navegador

## 🎨 Características Preservadas

- ✨ Tema espacial com estrelas no workspace
- 🎮 Blocos customizados do BitdogLab
- 🌐 Suporte a 89 idiomas
- 📱 Design responsivo
- 🔊 Feedback de áudio (opcional)
- 💾 Auto-save automático
- 🎄 Blocos temáticos de Natal
- 📺 Referência interativa de hardware

## 📝 Notas para Desenvolvedores

1. **Adicionar Novos Blocos:**
   - Definições: `src/js/blocks/definitions.js`
   - Geradores: `src/js/blocks/generators.js`
   - Toolbox: `src/js/config/toolbox.xml`

2. **Modificar Hardware:**
   - Configuração: `src/js/config/bitdoglab.js`

3. **Adicionar Traduções:**
   - App: `src/translations/app/[idioma].js`
   - Blockly: `src/translations/blockly/languages/[idioma].js`

4. **Atualizar Estilos:**
   - Principal: `src/styles/main.css`
   - Usar variáveis CSS para temas

5. **Assets:**
   - Imagens em `src/assets/images/`
   - Ícones em `src/assets/icons/`
   - Áudio em `src/assets/audio/`
   - Media do Blockly em `src/assets/media/`

## 🐛 Correções Recentes

- ✅ **Bug das imagens de lixeira e zoom:** Corrigido o caminho do `media` no Blockly
- ✅ **Pasta i18n renomeada:** Agora é `translations/` para melhor compreensão

---

**Última Atualização:** 2025-12-26
**Versão da Estrutura:** 2.1.0
**Compatibilidade:** Mantida 100% com versão anterior
