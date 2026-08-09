# Bootstrap do BIPES–BitDogLab

**Português** · [Read in English](README.en.md)

`src/js/bootstrap/` inicia a página depois que bibliotecas e módulos de domínio já foram carregados. O bootstrap apenas conecta serviços existentes; regras de negócio permanecem em `core/`, `communication/` e `ui/`.

## Arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `onboarding.js` | Boas-vindas, parceria, tutorial inicial e marca de primeira visita. |
| `services.js` | Cria `Channel`, terminal, `Files` e registro `UI`. |
| `page.js` | Chama `Code.init()`, inicializa serviços e carrega a toolbox do projeto. |

## Ordem de inicialização

```text
scripts de domínio
      ↓
onboarding.js
      ↓
services.js → AppServices.init()
      ↓
page.js → Code.init() → toolbox → seletor de projeto
```

Os três scripts são carregados no final de `src/pages/index.html`. Alterar essa ordem pode chamar classes antes de elas existirem.

## Fachadas publicadas

- `BitDogLabOnboarding.init()` reinicializa os listeners de boas-vindas;
- `AppServices.init()` cria e devolve os serviços globais;
- `PageBootstrap.init()` inicia núcleo e serviços;
- `PageBootstrap.loadProjectToolbox()` valida e aplica `toolbox.xml`.

Esses nomes são contratos da página e dos testes de integração. Não mova implementações de transporte ou workspace para esta pasta.

## Alterações seguras

- onboarding visual pertence a `onboarding.js`;
- criação de um serviço global pertence a `services.js`;
- sequência de inicialização e carregamento inicial pertence a `page.js`;
- comportamento interno de um serviço deve ser alterado no módulo que o define.

## Validação

Abra a interface com armazenamento limpo e confira boas-vindas, tutorial, toolbox, projeto salvo e ausência de erros de página. Depois execute:

```powershell
node tests/examples_generation_smoke.js
node src/mobile/scripts/check-web-boundary.mjs
```
