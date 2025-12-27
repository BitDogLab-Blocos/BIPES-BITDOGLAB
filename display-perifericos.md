# Integracao Display e Perifericos

## 1. LEDs (GPIO)
### Aplicacoes
- Monitor de Estado: Exibir se um LED especifico esta LIGADO ou DESLIGADO.
- Feedback de Pisca: Mostrar texto "Piscando" sincronizado com o LED.

### Blocos para Criar
- Bloco: Mostrar Estado do LED
  - Entradas: Pino do LED, Numero da Linha.
  - Saida no Display: "LED [Pino]: ON" ou "LED [Pino]: OFF".

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