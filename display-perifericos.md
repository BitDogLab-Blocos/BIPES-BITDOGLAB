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

### Blocos para Criar
- Bloco: Mostrar Status do Buzzer
  - Entradas: Numero da Linha.
  - Saida no Display: "Som: Ativo" ou "Som: Mudo".

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