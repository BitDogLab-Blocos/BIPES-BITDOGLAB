# Integracao Display e Perifericos

## 1. LEDs (GPIO)
### Aplicacoes
- Monitor de Estado: Exibir se um LED especifico esta LIGADO ou DESLIGADO.
- Feedback de Pisca: Mostrar texto "Piscando" sincronizado com o LED.

### Blocos para Criar
- Bloco: Mostrar Estado do LED
  - Entradas: Pino do LED, Numero da Linha.
  - Saida no Display: "LED [Pino]: ON" ou "LED [Pino]: OFF".

### Ordem Correta de Uso
O bloco "Mostrar Estado do LED" le o estado atual do LED no momento em que e executado. Para visualizar mudancas de estado (como blink), o bloco deve ser posicionado APOS cada mudanca de estado do LED.

Exemplo correto para exibir blink:
1. Ligar LED
2. Mostrar Estado do LED (mostrara ON)
3. Esperar tempo
4. Desligar LED
5. Mostrar Estado do LED (mostrara OFF)
6. Esperar tempo

Exemplo incorreto:
1. Mostrar Estado do LED (le estado antigo)
2. Ligar LED (estado muda DEPOIS da leitura)

O bloco sempre reflete o estado no momento da leitura, nao preve mudancas futuras.

## 2. Botoes
### Aplicacoes
- Contador de Cliques: Exibir quantas vezes o botao A ou B foi pressionado.
- Status em Tempo Real: Mostrar "Pressionado" ou "Solto" instantaneamente.
- Seletor de Menu: Usar botoes para alternar texto exibido no OLED.

### Blocos para Criar
- Bloco: Monitorar Botao
  - Entradas: Pino do Botao, Numero da Linha.
  - Saida no Display: "Btn A: Press" ou "Btn A: Solto".

## 3. Som (Buzzer)
### Aplicacoes
- Aviso Visual de Alarme: Exibir "TOCANDO" quando uma melodia estiver ativa.
- Frequencia: Mostrar a frequencia da nota atual (ex: 440Hz).

### Blocos Existentes
- Bloco: 🔊 Mostrar status do buzzer
  - Entradas:
    - Linha para o status (1-5)
    - Alinhamento (À esquerda, Ao centro, À direita)
    - Checkbox "🎵 Mostrar frequência" (ativa/desativa exibição da frequência)
    - Linha para a frequência (1-5)
    - Alinhamento da frequência
  - Saída no Display:
    - "Som: TOCANDO" quando o buzzer está ativo
    - "XXXHz" mostra a frequência atual da nota (quando habilitado)
  - **IMPORTANTE**: Este bloco deve ser colocado ANTES dos blocos de som/melodias natalinas
  - Funciona com TODOS os blocos de som, incluindo:
    - Tocar nota
    - Melodias natalinas (Jingle Bells, Noite Feliz, Bate o Sino, Feliz Natal, Ó Vinde)
    - Efeitos sonoros (Bipe curto, Bipe duplo, Som de moeda, etc.)

### Como Usar
1. Adicione o bloco "🔊 Mostrar status do buzzer" NO INÍCIO do seu programa
2. Configure:
   - Linha onde aparecerá "Som: TOCANDO" (ex: linha 1)
   - Marque a checkbox "🎵 Mostrar frequência" se quiser ver as frequências
   - Escolha a linha para mostrar a frequência (ex: linha 2)
3. Adicione os blocos de melodias natalinas ou outros sons DEPOIS
4. Durante a execução, o display mostrará automaticamente:
   - O status do som (TOCANDO)
   - A frequência de cada nota (ex: 659Hz, 392Hz, etc.)

### Exemplo de Uso
```
1. 🔊 Mostrar status do buzzer (linha 1, mostrar freq: SIM, linha freq: 2)
2. 🎄 Jingle Bells (volume 50%)
```

Resultado no Display:
```
Linha 1: Som: TOCANDO
Linha 2: 659Hz
(a frequência muda conforme as notas da melodia)
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
## 4. Matriz de LEDs
### Aplicacoes
- Legenda de Icones: Exibir o nome do desenho mostrado na matriz (ex: Matriz mostra coracao, Display mostra "Amor").
- Status da Matriz: Informar se a matriz esta ligada ou desligada.

### Blocos para Criar
- Bloco: Mostrar Legenda Matriz
  - Entradas: Texto Descritivo, Numero da Linha.
  - Saida no Display: Centraliza e exibe a descricao do desenho atual.

## 5. Matematica e Variaveis
### Aplicacoes
- Visualizador de Calculo: Mostrar o resultado de somas ou operacoes matemat icas.
- Debug de Variaveis: Monitorar valores de variaveis internas durante loops.

### Blocos para Criar
- Bloco: Mostrar Variavel Rotulada
  - Entradas: Nome da Variavel (Texto), Valor da Variavel, Numero da Linha.
  - Saida no Display: "[Nome]: [Valor]".

## 6. Tempo
### Aplicacoes
- Cronometro de Execucao: Mostrar tempo desde que a placa ligou.
- Contagem Regressiva: Visualizar tempo restante para uma acao.

### Blocos para Criar
- Bloco: Mostrar Tempo de Sistema
  - Entradas: Formato (Segundos/Milisegundos), Numero da Linha.
  - Saida no Display: "Tempo: 123s".

  💡 IDEIA 1: Relógio Digital Simples ⭐⭐⭐
Bloco: 🕐 Mostrar Horário Atual
Mostra hora do sistema (HH:MM:SS ou HH:MM)
Configurações:
Linha (1-5)
Alinhamento (Esquerda/Centro/Direita)
Formato (12h ou 24h)
Mostrar segundos? (Sim/Não)
Exemplo: 14:35:42 ou 2:35 PM
💡 IDEIA 2: Tempo de Execução (Uptime) ⭐⭐⭐⭐
Bloco: ⏱️ Mostrar Tempo Ligado
Mostra quanto tempo a placa está rodando desde o boot
Configurações:
Linha (1-5)
Alinhamento
Formato: "Horas:Min:Seg", "Minutos:Segundos", "Segundos totais", "Milissegundos"
Exemplo: 00:05:23 (5 minutos e 23 segundos ligado)
Usa time.ticks_ms() do MicroPython
💡 IDEIA 3: Cronômetro Controlável ⭐⭐⭐⭐⭐ MAIS COMPLETA!
3 Blocos integrados: A) 🏁 Iniciar Cronômetro
Input: Nome do cronômetro (texto)


Inicia contagem do zero
Exemplo: "corrida", "teste"
B) ⏹️ Parar Cronômetro
Input: Nome do cronômetro
Congela o tempo
C) 📊 Mostrar Cronômetro
Inputs:
Nome do cronômetro
Linha (1-5)
Alinhamento
Formato (HH:MM:SS, MM:SS, Segundos)
Mostra o tempo atual do cronômetro nomeado
Exemplo no display: Corrida: 00:12.45
Uso:

1. Iniciar cronômetro "teste"
2. [código qualquer]
3. Mostrar cronômetro "teste" (linha 1)
4. Parar cronômetro "teste"
💡 IDEIA 4: Contador Regressivo (Timer) ⭐⭐⭐⭐
Bloco: ⏲️ Mostrar Contagem Regressiva
Inputs:
Tempo total (segundos)
Linha
Alinhamento
Texto antes: ex "Resta: "
Mostra contagem decrescente
Exemplo: Resta: 00:15 (faltam 15 segundos)
Pode emitir sinal quando chega a zero
💡 IDEIA 5: Monitor de Performance (Debug) ⭐⭐⭐⭐⭐ MAIS ÚTIL PARA CRIANÇAS!
Bloco: 📈 Mostrar Tempo de Execução de Código
Mede quanto tempo um trecho de código demora
2 Blocos:
A) ⏱️ Marcar início
Input: Nome da medição
B) 📊 Mostrar tempo decorrido
Inputs:
Nome da medição
Linha
Alinhamento
Mostra: Loop: 0.023s (23 milissegundos)
Uso prático para crianças:

1. Marcar início "animacao"
2. [Acender 25 LEDs da matriz]
3. Mostrar tempo decorrido "animacao" (linha 1)