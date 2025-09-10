# Blocos LED RGB - BitDogLab

Esta pasta contém arquivos de demonstração e teste para os blocos de controle do LED RGB do BitDogLab.

## Arquivos

- **led-blocks-demo.html** - Demonstração completa dos blocos LED com interface interativa
- **led-blocks-test.html** - Arquivo de teste simples para verificar funcionamento dos blocos

## Como usar

1. Abra um dos arquivos HTML em um navegador web
2. Os blocos LED estarão disponíveis na categoria "LEDs" da toolbox
3. Arraste e solte os blocos para criar programas de controle do LED RGB

## Blocos disponíveis

- 🔴 **Ligar LED Vermelho** - Liga o LED vermelho (GPIO 13)
- 🟢 **Ligar LED Verde** - Liga o LED verde (GPIO 11)
- 🔵 **Ligar LED Azul** - Liga o LED azul (GPIO 12)
- ⚪ **Desligar LED Vermelho** - Desliga o LED vermelho
- ⚪ **Desligar LED Verde** - Desliga o LED verde
- ⚪ **Desligar LED Azul** - Desliga o LED azul
- 🌈 **Desligar Todos os LEDs** - Desliga todos os LEDs RGB

## Código gerado

Os blocos geram código Python compatível com MicroPython para Raspberry Pi Pico:

```python
from machine import Pin

# Ligar LED vermelho
Pin(13, Pin.OUT).value(1)

# Desligar todos os LEDs
Pin(13, Pin.OUT).value(0)
Pin(11, Pin.OUT).value(0)
Pin(12, Pin.OUT).value(0)
```

## Integração com BitDogLab

Os blocos estão integrados na interface principal do BitDogLab através dos arquivos:
- `ui/core/block_definitions.js` - Definições dos blocos
- `ui/core/generator_stubs.js` - Geradores de código Python
- `ui/toolbox/rpi_pico.xml` - Configuração da toolbox
- `ui/toolbox/default.xml` - Configuração da toolbox padrão