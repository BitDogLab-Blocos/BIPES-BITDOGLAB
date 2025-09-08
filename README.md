# BitDogLab - Plataforma Educacional para Raspberry Pi Pico


## Descrição

BitDogLab é uma versão simplificada e focada do BIPES (Block based Integrated Platform for Embedded Systems), especificamente desenvolvida para uso educacional com o microcontrolador **Raspberry Pi Pico**. 

Esta plataforma permite programar o Raspberry Pi Pico usando blocos visuais, tornando o aprendizado de programação de sistemas embarcados mais acessível e intuitivo.

## Características

- Interface web simples e intuitiva
- Programação visual com blocos do Blockly
- Foco exclusivo no Raspberry Pi Pico
- 9 categorias essenciais de blocos:
  - 🧠 Lógica
  - 🔄 Repetições  
  - 🧮 Matemática
  - 🔡 Texto
  - 📜 Listas
  - 🏷️ Variáveis
  - ⚙️ Funções
  - ⏱️ Temporização
  - 🔌 Máquina e Pinos

## Uso

1. Abra o arquivo `ui/index.html` em seu navegador
2. Conecte seu Raspberry Pi Pico
3. Arraste e solte blocos para criar seu programa
4. Execute o código diretamente no microcontrolador

## Blocos Disponíveis

### Temporização
- Delay em segundos (campo editável)
- Delay em milissegundos (campo editável)

### Máquina e Pinos
- Configuração de pinos GPIO
- Leitura de entradas digitais
- Controle de saídas digitais  
- Leitura de entradas analógicas (GP26, GP27, GP28)
- Controle PWM
- Operações com frequência da CPU

## Projeto Original

Este projeto é baseado no BIPES original: [bipes.net.br](https://bipes.net.br/)

Algumas funções foram adaptadas do projeto Blopy (https://github.com/mnoriaki/Blopy).
