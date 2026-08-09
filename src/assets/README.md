# Recursos visuais do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/assets/` reúne somente arquivos estáticos consumidos pela interface web. Esta pasta não contém lógica de aplicação: JavaScript fica em `src/js/`, estilos em `src/styles/` e textos traduzíveis em `src/translations/`.

## Mapa da pasta

```text
src/assets/
├── cursors/          # cursores esperados pelo Blockly durante o arraste
├── favicons/         # ícones exibidos pelo navegador
├── icons/            # símbolos e sprites próprios da interface
├── images/
│   ├── devices/      # fotos e diagramas usados nos guias de hardware
│   ├── logos/        # marcas oficiais exibidas pelo produto
│   └── themes/       # ilustrações dos temas visuais
└── media/            # arquivos no caminho legado esperado pelo Blockly
```

## Responsabilidade de cada grupo

| Caminho | Consumidor principal | Regra de manutenção |
| --- | --- | --- |
| `cursors/` | Blockly e CSS | Preserve os nomes dos arquivos; eles fazem parte do contrato com o editor. |
| `favicons/` | `src/pages/index.html` | Troque somente quando a identidade oficial da aplicação mudar. |
| `icons/` | componentes e folhas de estilo | Reutilize símbolos existentes antes de adicionar outro sprite. |
| `images/devices/` | guias de hardware | Use imagens tecnicamente corretas e com origem conhecida. |
| `images/logos/` | cabeçalho, guias e identidade | Não redesenhe nem comprima marcas oficiais sem autorização. |
| `images/themes/` | seletor de aparência | Mantenha o nome alinhado ao identificador do tema. |
| `media/` | integração legada do Blockly | Considere nomes e dimensões como compatibilidade externa. |

## Como adicionar ou substituir um asset

1. Escolha a subpasta pelo consumidor, não apenas pelo formato do arquivo.
2. Use nome minúsculo, descritivo e estável.
3. Prefira SVG para ícones e diagramas; use PNG/JPEG para capturas e fotografias.
4. Atualize todas as referências com `rg "nome-do-arquivo" src`.
5. Abra a interface e confira carregamento, proporção e contraste.
6. Execute os testes de exemplos quando o recurso aparecer no Blockly.

## O que não deve ser alterado em conjunto

Assets de interface e imagens de documentação têm ciclos diferentes. Diagramas arquiteturais pertencem à pasta `images/` do módulo documentado. Imagens de exemplos gerados ficam em `images/` na raiz do repositório. Não copie artefatos de `src/mobile/android/app/build/`: eles são recriados pelo build Android.

## Verificação rápida

```powershell
rg -n "\.png|\.jpe?g|\.gif|\.svg" src/pages src/js src/styles
node tests/examples_generation_smoke.js
```

Uma alteração está pronta quando não há referência quebrada, o navegador não registra erro de carregamento e o asset continua legível nos temas claro e escuro.
