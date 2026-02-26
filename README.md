# BitDogLab - Visual Programming Platform

[Portugues](#portugues) | [English](#english)

---

<a name="portugues"></a>
## Portugues

### O que e este projeto

BitDogLab Blocos e uma plataforma educacional de programacao em blocos visuais para o Raspberry Pi Pico W com a placa BitDogLab. O objetivo e tornar a programacao de sistemas embarcados acessivel para iniciantes e estudantes, sem necessidade de escrever codigo manualmente.

A plataforma roda diretamente no navegador e se comunica com a placa via Web Serial API, compativel com Chrome e Edge.

Esta e a versao 1.0, com suporte completo a todos os perifericos da BitDogLab.

### Perifericos suportados

- LED RGB
- Matriz de LED 5x5
- Display OLED
- Joystick
- Buzzer e som
- Microfone
- Botoes A e B

### Categorias de blocos disponiveis

- Logica e condicionais
- Repeticao
- Matematica
- Texto
- Listas
- Variaveis
- Funcoes
- Temporizacao

### Estrutura do repositorio

```
src/
  js/          - logica principal, geradores de codigo e configuracao da placa
  pages/       - paginas da interface web
  styles/      - estilos CSS
  assets/      - imagens e recursos estaticos
  translations/- arquivos de traducao
index.html     - entrada da aplicacao
firmware/      - firmware auxiliar
docs/          - documentacao de hardware
.github/       - workflow de deploy GitHub Pages
```

### Como usar

1. Acesse a plataforma pelo GitHub Pages
2. Conecte a placa BitDogLab via cabo USB
3. Clique em conectar e selecione a porta serial
4. Arraste os blocos para montar o programa
5. Clique em executar para enviar o codigo para a placa

### Baseado em

Este projeto e baseado no [BIPES](https://bipes.net.br/), plataforma original de Rafael Vidal Aroca et al. Licenca GPL v3.

---

<a name="english"></a>
## English

### What is this project

BitDogLab Blocks is an educational visual block-based programming platform for the Raspberry Pi Pico W using the BitDogLab board. The goal is to make embedded systems programming accessible to beginners and students, without the need to write code manually.

The platform runs directly in the browser and communicates with the board via the Web Serial API, compatible with Chrome and Edge.

This is version 1.0, with full support for all BitDogLab peripherals.

### Supported peripherals

- RGB LED
- 5x5 LED Matrix
- OLED Display
- Joystick
- Buzzer and sound
- Microphone
- Buttons A and B

### Available block categories

- Logic and conditionals
- Loops
- Math
- Text
- Lists
- Variables
- Functions
- Timing

### Repository structure

```
src/
  js/          - core logic, code generators and board configuration
  pages/       - web interface pages
  styles/      - CSS styles
  assets/      - images and static resources
  translations/- translation files
index.html     - application entry point
firmware/      - auxiliary firmware
docs/          - hardware documentation
.github/       - GitHub Pages deploy workflow
```

### How to use

1. Access the platform via GitHub Pages
2. Connect the BitDogLab board via USB cable
3. Click connect and select the serial port
4. Drag blocks to build your program
5. Click run to send the code to the board

### Based on

This project is based on [BIPES](https://bipes.net.br/), the original platform by Rafael Vidal Aroca et al. GPL v3 license.
