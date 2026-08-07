# Assets da aplicação

**Português** · [Read in English](README.en.md)

Esta pasta reúne os arquivos estáticos usados pela interface web: imagens, ícones, cursores, favicon e recursos compatíveis com o Blockly. Os arquivos são servidos junto com `src/pages/` e normalmente são referenciados por caminhos relativos como `../assets/...`.

## Organização

```text
src/assets/
├── cursors/            # cursores usados durante o arraste de blocos
├── favicons/           # favicon e ícones da aplicação
├── icons/              # sprites usados pelos controles visuais da interface
├── images/
│   ├── devices/        # fotos e diagramas dos dispositivos
│   ├── logos/          # marcas BIPES e BitDogLab
│   └── themes/         # previews dos temas visuais
└── media/              # recursos no caminho esperado pelo Blockly
```

## Regras por tipo

- **`cursors/`** contém os cursores de mão usados ao mover blocos; preserve os nomes esperados pelo Blockly.
- **`favicons/`** contém os ícones carregados por `src/pages/index.html`.
- **`icons/`** contém os sprites SVG usados pelo CSS e pelos componentes da interface.
- **`images/devices/`** é o local para imagens de placas, sensores e montagens usadas nos guias de hardware.
- **`images/logos/`** guarda as marcas exibidas na interface e nos guias.
- **`images/themes/`** guarda os previews usados pelos temas visuais.
- **`media/`** contém os recursos compatíveis com o caminho de mídia esperado pelo Blockly.

## Como adicionar um recurso

Escolha a subpasta pelo papel do arquivo, use um nome estável e atualize o código que o referencia. Para imagens de novos tutoriais, prefira `images/devices/`; para imagens de exemplos e validação, use as pastas correspondentes em `images/` na raiz do projeto.

Evite colocar traduções, código JavaScript ou projetos XML nesta pasta. Traduções pertencem a `src/translations/`, e o código da aplicação deve permanecer em `src/` nos módulos responsáveis por seu comportamento.
