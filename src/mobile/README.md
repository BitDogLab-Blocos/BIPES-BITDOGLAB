# Aplicativo Android da BIPES BitDogLab

Esta pasta concentra todo o código específico do aplicativo Android. O site
continua usando o Web Serial existente e não depende deste diretório.

## Princípio de isolamento

O aplicativo usa a USB Host API nativa do Android para acessar a porta CDC do
MicroPython. Ele não usa WebUSB e não exige `webusb.py`, `boot.py` especial ou
outro firmware na BitDogLab.

A interface roda em uma WebView Android nativa. Durante o build, o Gradle lê os
arquivos web existentes e os empacota em um diretório temporário dentro de
`android/app/build/`. Não existe uma segunda cópia versionada nem uma pasta
`www` mantida neste projeto.

```text
Site: navigator.serial -> Web Serial -> USB CDC
App:  compatibilidade serial -> Android USB Host -> USB CDC
```

## O que o aplicativo reaproveita

Blocos, geradores MicroPython, projetos, temas, mensagens, tutoriais de
hardware, terminal, arquivos e scanner I2C continuam vindo dos mesmos arquivos
usados pelo computador. Uma alteração futura nesses arquivos entra no próximo
APK automaticamente ao compilar. A única implementação exclusiva do celular é
a integração com o Android e sua apresentação responsiva.

## Estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `web-boundary.json` | Hashes dos arquivos do navegador protegidos durante o trabalho. |
| `scripts/` | Validação da fronteira entre aplicativo e site. |
| `android/` | Aplicativo Android nativo, WebView e ponte USB CDC. |
| `android/app/build/` | Ativos temporários gerados pelo Gradle e APKs locais. |

Os pontos principais do aplicativo ficam em:

| Arquivo | Responsabilidade |
| --- | --- |
| `android/app/src/main/java/.../MainActivity.java` | WebView local, origem segura e injeções exclusivas do app. |
| `android/app/src/main/java/.../NativeSerialBridge.java` | Permissão, abertura, leitura e escrita USB CDC. |
| `android/app/src/main/res/raw/mobile_serial_shim.js` | Compatibilidade entre a CDC nativa e o contrato `navigator.serial`. |
| `android/app/src/main/res/raw/mobile_layout.css` | Layout para toque, retrato, paisagem e áreas seguras. |
| `tests/mobile-serial-shim.test.js` | Contrato de seleção, leitura, escrita e desconexão. |

## Proteção do navegador

Antes e depois de qualquer etapa móvel, execute:

```powershell
node src/mobile/scripts/check-web-boundary.mjs
```

O comando falha se a implementação móvel alterar acidentalmente os arquivos
estáveis de comunicação, execução ou inicialização do site.

## Requisitos para usar

- Celular Android 8.0 ou mais recente com suporte a USB Host/OTG.
- Adaptador OTG e cabo USB de dados; cabos somente de energia não funcionam.
- BitDogLab com o MicroPython padrão já usado no computador.

Não é necessário instalar arquivo adicional na placa nem modificar `boot.py`.
A bateria, quando presente na BitDogLab, não substitui a conexão USB de dados.

## Compilar e instalar

Com JDK 17 e o Android SDK configurados, execute na raiz do repositório:

```powershell
cd src/mobile/android
.\gradlew.bat assembleDebug
```

O APK de desenvolvimento será criado em
`android/app/build/outputs/apk/debug/app-debug.apk`. O Gradle também gera, sob
`android/app/build/generated/webAssets/`, a cópia temporária da interface que
entra no APK. As duas saídas são ignoradas pelo Git.

Para instalar em um aparelho autorizado para depuração USB:

```powershell
adb install -r .\app\build\outputs\apk\debug\app-debug.apk
```

Também é possível transferir o APK para o celular e abri-lo diretamente,
autorizando a instalação local quando o Android solicitar.

## Usar com a BitDogLab

1. Abra o aplicativo e monte o programa com os mesmos blocos da plataforma.
2. Conecte a BitDogLab ao adaptador OTG e depois ao celular.
3. Abra as ferramentas no canto superior direito e toque no controle de conexão.
4. Autorize o acesso USB solicitado pelo Android.
5. Use executar, parar, mensagens, salvar na placa, arquivos e scanner I2C normalmente.

A porta é aberta em 115200 baud e 8N1, como no fluxo atual do computador. Ao
retirar o cabo, o aplicativo encerra a leitura, atualiza a interface e permite
uma nova conexão.

## Validação local

```powershell
node src/mobile/scripts/check-web-boundary.mjs
node --test src/mobile/tests/*.test.js
npm test

cd src/mobile/android
.\gradlew.bat lintDebug assembleDebug
```

O primeiro comando protege o site; o segundo testa a ponte JavaScript móvel; os
testes da raiz caracterizam o protocolo existente; e o Gradle analisa e compila
o APK.

O aplicativo abre a plataforma a partir de uma origem HTTPS local segura, sem
servidor e sem internet. O build móvel não chama o fluxo de deploy do site.
