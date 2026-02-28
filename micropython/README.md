# Códigos MicroPython para BitDogLab

Esta pasta contém códigos MicroPython organizados por categorias, correspondentes aos blocos disponíveis no BIPES para a placa BitDogLab.

## Estrutura de Pastas

```
micropython/
├── led_rgb/              # Controle do LED RGB
├── matriz_led/           # Matriz 5x5 de LEDs NeoPixel
├── display_oled/         # Display OLED SSD1306
├── som_buzzer/           # Buzzer e sons
├── botoes/               # Botões A, B e Joystick
├── joystick/             # Controle via joystick analógico
├── microfone/            # Sensor de som/microfone
├── tempo/                # Funções de tempo e delay
├── cores/                # Definições de cores RGB
├── matematica/           # Operações matemáticas
├── animacoes_matriz/     # Animações na matriz de LED
├── condicionais/         # Comparações e lógica
├── emojis/               # Padrões de emojis
├── numeros/              # Números para matriz
├── notas_musicais/       # Definições de notas musicais
├── texto/                # Manipulação de strings
└── desenho_matriz/       # Desenhos customizados
```

## Pinagem da BitDogLab

### LEDs RGB
- **LED Vermelho**: GPIO 11
- **LED Verde**: GPIO 12
- **LED Azul**: GPIO 13

### Matriz NeoPixel 5x5
- **Data**: GPIO 7

### Botões
- **Botão A**: GPIO 5
- **Botão B**: GPIO 6
- **Botão Joystick**: GPIO 22

### Joystick Analógico
- **Eixo X**: GPIO 27 (ADC)
- **Eixo Y**: GPIO 26 (ADC)

### Buzzer
- **PWM**: GPIO 21

### Microfone
- **ADC**: GPIO 28

### Display OLED (I2C)
- **SCL**: GPIO 15
- **SDA**: GPIO 14
- **Endereço I2C**: 0x3C

## Como Usar

1. **Copie o arquivo desejado** para sua placa BitDogLab
2. **Importe as funções** no seu código principal:

```python
from led_rgb.ligar_led import ligar_led
from cores.cores_predefinidas import VERMELHO, AZUL
import time

# Liga o LED na cor vermelha
ligar_led(VERMELHO)
time.sleep(1)

# Liga o LED na cor azul
ligar_led(AZUL)
```

## Exemplos por Categoria

### LED RGB
- `ligar_led.py` - Liga o LED em uma cor específica
- `desligar_led.py` - Desliga o LED
- `ligar_led_brilho.py` - Controla o brilho (0-100%)
- `piscar_led.py` - Faz o LED piscar
- `animar_led_coracao.py` - Efeito de batimento cardíaco
- `sinalizar_led_sos.py` - Sinal de socorro em Morse
- `animar_led_brilhar.py` - Efeito de fade in/out

### Matriz de LED 5x5
- `preencher_matriz.py` - Preenche toda a matriz
- `acender_led_posicao.py` - Acende LED em posição específica
- `mostrar_numero_matriz.py` - Mostra números 0-9
- `mostrar_emoji.py` - Mostra emojis (coração, carinha, etc)

### Som/Buzzer
- `tocar_nota.py` - Toca notas musicais
- `bipe_curto.py` - Bipes e alertas sonoros
- `escala_musical.py` - Escalas e melodias

### Display OLED
- `display_texto.py` - Escreve texto no display
- `display_mostrar_valor.py` - Mostra valores numéricos

### Botões
- `botao_apertado.py` - Verifica estado dos botões

### Joystick
- `joystick_controle.py` - Controla LEDs/buzzer via joystick

### Microfone
- `vu_meter.py` - Medidor de volume

### Tempo
- `esperar.py` - Funções de delay

### Cores
- `cores_predefinidas.py` - Paleta de cores RGB

### Matemática
- `operacoes.py` - Operações matemáticas

### Condicionais
- `comparacoes.py` - Comparações e lógica booleana

## Requisitos

- Placa **BitDogLab** com Raspberry Pi Pico W
- **MicroPython** instalado no Pico
- Biblioteca `ssd1306.py` para o display OLED (incluída na pasta `firmware/`)

## Licença

Estes códigos são parte do projeto BIPES para BitDogLab e seguem a mesma licença do projeto principal.
