# Aplicativo Android da BIPES BitDogLab

Esta pasta concentra todo o código específico do aplicativo Android. O site
continua usando o Web Serial já existente e não depende deste diretório.

## Princípio de isolamento

O aplicativo usará a USB Host API nativa do Android para acessar a porta CDC
do MicroPython. Ele não usa WebUSB e não exige `webusb.py`, `boot.py` especial
ou outro firmware na BitDogLab.

O aplicativo será uma WebView Android nativa. Durante o build, o Gradle lê os
ativos existentes diretamente das pastas atuais e os empacota em um diretório
temporário dentro de `android/app/build/`. Não existe uma segunda cópia
versionada nem uma pasta `www` mantida neste projeto.

```text
Site: navigator.serial -> Web Serial -> USB CDC
App:  compatibilidade serial -> plugin Android -> USB Host -> USB CDC
```

## Estrutura inicial

| Caminho | Responsabilidade |
| --- | --- |
| `web-boundary.json` | Hashes dos arquivos do navegador protegidos durante o trabalho. |
| `scripts/` | Validação da fronteira entre aplicativo e site. |
| `android/` | WebView, layout mobile e plugin Kotlin USB CDC. |
| `android/app/build/` | Ativos temporários gerados pelo Gradle e APKs locais. |

## Proteção do navegador

Antes e depois de qualquer etapa móvel, execute:

```powershell
node src/mobile/scripts/check-web-boundary.mjs
```

O comando falha se a implementação móvel alterar acidentalmente os arquivos
estáveis de comunicação, execução ou inicialização do site.

## Estado atual

Esta primeira etapa cria apenas a fronteira do aplicativo. O projeto Android,
a ponte USB e a interface mobile serão acrescentados em commits posteriores e
independentes.
