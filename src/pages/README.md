# Páginas do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/pages/` contém os documentos HTML que funcionam como entradas da aplicação. As páginas definem estrutura e ordem de carregamento; comportamento reutilizável deve permanecer em módulos JavaScript e CSS.

## Entradas

| Página | Finalidade |
| --- | --- |
| `index.html` | Interface principal: Blockly, toolbar, projetos, terminal e dispositivo. |
| `device-reference.html` | Hospedeiro leve dos guias modulares de hardware. |

O `index.html` também é carregado pelo APK em `/assets/src/pages/index.html?mobile=1`.

## Responsabilidade do HTML

- declarar elementos estruturais e atributos de acessibilidade;
- carregar CSS, bibliotecas e scripts na ordem correta;
- fornecer texto útil antes da aplicação de traduções;
- manter IDs usados pelos componentes e testes;
- oferecer pontos de montagem para Blockly, terminal, arquivos e guias.

Não coloque regras de geração, comunicação ou estado persistente em scripts inline. O pequeno módulo ES usado para `DeviceFileManager` é uma integração legada e deve ser migrado apenas com teste de compatibilidade.

## Ordem de scripts em `index.html`

```text
bibliotecas → armazenamento/execução → perfis → core
→ comunicação → UI → i18n → blocos/geradores
→ terminal/editor → bootstrap
```

Scripts clássicos compartilham globais; mover uma tag pode quebrar a inicialização mesmo que todos os arquivos continuem presentes.

## Contratos estáveis

- IDs como `content_blocks`, `term`, `device_selector` e botões da toolbar;
- tipos e campos dos XMLs Blockly;
- caminhos relativos calculados a partir de `src/pages/`;
- parâmetros `mobile` e `lang`;
- hashes e caminhos protegidos pela fronteira mobile.

## Alterar uma página

1. Localize o componente JavaScript dono do comportamento.
2. Preserve IDs públicos ou implemente migração no mesmo conjunto.
3. Atualize `data-i18n`, rótulos e atributos ARIA.
4. Revise caminhos a partir da página, não do fragmento que será inserido.
5. Teste web e Android quando `index.html` mudar.

## Validação

```powershell
node tests/examples_generation_smoke.js
node --test tests/i18n/*.test.js
node src/mobile/scripts/check-web-boundary.mjs
```

No navegador, verifique zero erros de página, assets sem 404, onboarding, projetos, abas, temas, idiomas e V6/V7.
