# Estilos do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/styles/` define o visual compartilhado da aplicação web. Estilos exclusivos do APK ficam em `src/mobile/android/app/src/main/res/raw/mobile_layout.css`; estilos de bibliotecas permanecem junto de suas distribuições.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `main.css` | Tokens principais, layout, toolbar, painéis, modais e responsividade web. |
| `visual-themes.css` | Seletor de temas e superfícies específicas de cada tema. |
| `device-reference.css` | Sidebar, conteúdo e componentes dos guias de hardware. |
| `libs.css` | Ajustes e licenças de componentes externos, especialmente terminal. |

## Camadas

```text
tokens :root
   ↓
estrutura da página
   ↓
componentes e estados
   ↓
tema visual
   ↓
adaptação mobile injetada pelo APK
```

Variáveis `--bitdoglab-*` são o contrato entre o tema padrão e os temas alternativos. Prefira tokens a valores repetidos.

## Onde colocar uma regra

- comportamento geral de `index.html` → `main.css`;
- tema e painel de aparência → `visual-themes.css`;
- página **Dispositivo** → `device-reference.css`;
- correção específica de biblioteca → `libs.css` com comentário de origem;
- somente Android → `mobile_layout.css`, nunca `main.css`.

Evite seletores que dependam de uma árvore HTML excessivamente profunda. Classes de componente e atributos de estado são mais estáveis.

## Responsividade e acessibilidade

- teste larguras estreitas, paisagem e zoom;
- respeite áreas seguras no Android;
- mantenha foco e contraste visíveis;
- não use apenas cor para comunicar estado;
- preserve alvos de toque adequados;
- considere `prefers-reduced-motion` em novas animações.

## Adicionar um tema

1. Registre metadados em `src/js/ui/visual-themes.js`.
2. Defina tokens e superfícies em `visual-themes.css`.
3. Adicione a ilustração em `src/assets/images/themes/`.
4. Verifique Blockly, Mensagens, modais, notificações e guias.
5. Confira persistência e rótulos PT/EN.

## Validação

Abra a aplicação em desktop e viewport móvel, alterne os seis temas e confira toolbar, toolbox, terminal, modais e textos. Execute também:

```powershell
node tests/examples_generation_smoke.js
node --test src/mobile/tests/mobile-workspace.test.js src/mobile/tests/mobile-device-files-layout.test.js
```
