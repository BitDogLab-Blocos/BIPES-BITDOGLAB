(function(window) {
  'use strict';

  var ledConcept = '../assets/images/manual/leds/led-rgb-conceito.png';
  var pwmConcept = '../assets/images/manual/leds/pwm-brilho-led.png';
  var mixConcept = '../assets/images/manual/leds/mistura-rgb.png';

  window.BitDogLabManualData = {
    categories: [
      {
        id: 'leds',
        title: 'LEDs',
        number: '1',
        color: '#f2b705',
        intro: {
          title: 'LED RGB',
          subtitle: 'A luz colorida da BitDogLab.',
          image: ledConcept,
          text: [
            'O LED RGB é uma luz que mistura três luzes pequenas: vermelho, verde e azul.',
            'Quando você muda a cor, o brilho ou o tempo, a placa mostra isso com luz de verdade.',
            'Escolha um bloco na lista para aprender o que ele faz, onde encaixa e uma missão para testar.'
          ],
          cards: [
            {
              title: 'Cor',
              text: 'A cor entra no bloco como uma peça. Vermelho, verde e azul podem aparecer sozinhos ou misturados.'
            },
            {
              title: 'Brilho',
              text: 'Brilho é a força da luz. 0% fica apagado, 50% fica médio e 100% fica bem forte.'
            },
            {
              title: 'Tempo',
              text: 'Para enxergar uma mudança, use blocos de espera. Sem espera, a placa pode mudar rápido demais.'
            }
          ],
          mission: [
            'Abra a categoria LEDs.',
            'Escolha um bloco da lista.',
            'Monte o teste na área de blocos e observe a luz na placa.'
          ]
        },
        blocks: [
          {
            type: 'bloco_ligar_led',
            name: 'Ligar LED da cor',
            shortName: 'Ligar',
            screenshot: '../../images/leds/led_01_ligar.png',
            conceptImage: ledConcept,
            kind: 'Bloco de ação',
            needs: '1 cor',
            place: 'No meio de uma sequência',
            child: 'Acende o LED na cor que você encaixar.',
            idea: 'A cor tem pedacinhos de vermelho, verde e azul. O bloco manda cada pedacinho acender na força certa.',
            fits: 'Use no começo de uma animação, depois de um botão, dentro de uma repetição ou antes de uma espera.',
            steps: [
              'Arraste o bloco para a área de trabalho.',
              'Encaixe uma cor no espaço vazio do bloco.',
              'Coloque uma espera depois dele para dar tempo de ver a luz.'
            ],
            watch: 'Se usar vermelho, a luz fica vermelha. Se usar branco, vermelho, verde e azul acendem juntos.',
            mission: 'Monte vermelho, espere 1 segundo, verde, espere 1 segundo e azul.'
          },
          {
            type: 'bloco_desligar_led',
            name: 'Desligar LED da cor',
            shortName: 'Desligar cor',
            screenshot: '../../images/leds/led_02_desligar.png',
            conceptImage: ledConcept,
            kind: 'Bloco de ação',
            needs: '1 cor',
            place: 'Depois de acender uma cor',
            child: 'Apaga a parte do LED que forma a cor escolhida.',
            idea: 'O LED RGB é feito de três partes. Esse bloco olha a cor escolhida e apaga as partes que ela usa.',
            fits: 'Use quando você quer tirar uma cor sem apagar tudo. Ele encaixa entre outros blocos de ação.',
            steps: [
              'Acenda uma cor primeiro.',
              'Coloque o bloco de desligar logo depois.',
              'Escolha a mesma cor ou teste outra para comparar.'
            ],
            watch: 'Se a cor misturada usa mais de uma parte, pode sobrar outra luz acesa.',
            mission: 'Acenda branco e depois desligue vermelho. Observe que a cor muda.'
          },
          {
            type: 'bloco_desligar_todos_leds',
            name: 'Desligar todos os LEDs',
            shortName: 'Apagar tudo',
            screenshot: '../../images/leds/led_03_desligar_todos.png',
            conceptImage: ledConcept,
            kind: 'Bloco de ação',
            needs: 'Nenhuma cor',
            place: 'Final ou reinício da sequência',
            child: 'Apaga o LED inteiro de uma vez.',
            idea: 'É como limpar a luz antes de começar outra parte do programa.',
            fits: 'Use no final de um teste, antes de trocar de projeto ou antes de começar uma nova animação.',
            steps: [
              'Coloque depois de uma ou mais cores acesas.',
              'Não encaixe cor nele, porque ele já apaga tudo.',
              'Use uma espera antes dele se quiser ver a luz acesa por mais tempo.'
            ],
            watch: 'Depois desse bloco, vermelho, verde e azul ficam apagados.',
            mission: 'Faça três cores aparecerem e termine apagando tudo.'
          },
          {
            type: 'bloco_acender_led_brilho',
            name: 'Ligar LED com brilho',
            shortName: 'Brilho',
            screenshot: '../../images/leds/led_04_brilho.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de ação',
            needs: '1 cor e 1 número',
            place: 'Quando a luz precisa ficar fraca ou forte',
            child: 'Acende uma cor com o brilho que você escolher.',
            idea: 'O número vai de 0 a 100. Quanto maior o número, mais forte a luz fica.',
            fits: 'Use para fazer efeitos suaves, sinais de atenção ou uma luz que muda de intensidade.',
            steps: [
              'Encaixe uma cor no bloco.',
              'Digite um brilho entre 0 e 100.',
              'Teste 25, 50, 75 e 100 para comparar.'
            ],
            watch: '0% parece apagado. 100% é o brilho máximo.',
            mission: 'Crie um amanhecer: 10%, 30%, 60% e 100%, com esperas entre eles.'
          },
          {
            type: 'bloco_piscar_led',
            name: 'Piscar LED rapidamente',
            shortName: 'Piscar rápido',
            screenshot: '../../images/leds/led_05_piscar_rapido.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de ação animada',
            needs: '1 cor',
            place: 'Para aviso ou alerta',
            child: 'Liga e apaga o LED bem rápido.',
            idea: 'Piscar é repetir: liga, espera um pouquinho, apaga, espera outro pouquinho.',
            fits: 'Use quando a placa precisa chamar atenção, como em um alarme, jogo ou aviso.',
            steps: [
              'Escolha uma cor forte, como vermelho.',
              'Coloque o bloco sozinho para repetir sem parar.',
              'Ou coloque uma espera depois dele para controlar por quanto tempo pisca.'
            ],
            watch: 'A piscada rápida parece mais urgente do que a piscada devagar.',
            mission: 'Faça um alerta vermelho que pisca rápido.'
          },
          {
            type: 'piscar_led_lento',
            name: 'Piscar LED devagar',
            shortName: 'Piscar devagar',
            screenshot: '../../images/leds/led_06_piscar_lento.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de ação animada',
            needs: '1 cor',
            place: 'Para espera ou sinal calmo',
            child: 'Faz o LED piscar com calma.',
            idea: 'Ele também liga e apaga, mas deixa mais tempo entre uma mudança e outra.',
            fits: 'Use quando o programa está esperando, carregando ou mostrando que está tudo bem.',
            steps: [
              'Encaixe uma cor.',
              'Coloque o bloco na sequência.',
              'Compare com o bloco de piscar rápido.'
            ],
            watch: 'A piscada devagar parece uma luz de espera.',
            mission: 'Faça uma luz verde piscando devagar como sinal de pronto.'
          },
          {
            type: 'bloco_animar_led_coracao',
            name: 'Batimento cardíaco',
            shortName: 'Coração',
            screenshot: '../../images/leds/led_07_coracao.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de animação',
            needs: '1 cor',
            place: 'Para dar ritmo ao projeto',
            child: 'Faz dois pulsos de luz, parecendo um coração batendo.',
            idea: 'A luz acende, apaga, acende de novo e descansa. Esse ritmo cria a sensação de batimento.',
            fits: 'Use em mascotes, jogos, mensagens de vitória ou projetos que precisam parecer vivos.',
            steps: [
              'Escolha uma cor.',
              'Use vermelho para lembrar um coração.',
              'Coloque uma espera depois se quiser controlar a duração.'
            ],
            watch: 'O efeito fica mais fácil de perceber quando o ambiente está um pouco mais escuro.',
            mission: 'Faça um coração vermelho bater no final de um desafio.'
          },
          {
            type: 'bloco_sinalizar_led_sos',
            name: 'Sinal SOS',
            shortName: 'SOS',
            screenshot: '../../images/leds/led_08_sos.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de animação',
            needs: '1 cor',
            place: 'Para mensagens com luz',
            child: 'Pisca uma mensagem de ajuda usando luz curta e luz longa.',
            idea: 'SOS é um código famoso: três sinais curtos, três longos e três curtos.',
            fits: 'Use para mostrar que luz também pode virar linguagem.',
            steps: [
              'Escolha uma cor fácil de ver.',
              'Rode o programa e conte as piscadas.',
              'Tente perceber as partes curtas e longas.'
            ],
            watch: 'As piscadas não são todas iguais. O tamanho da piscada faz parte da mensagem.',
            mission: 'Use o SOS como sinal secreto de um projeto de resgate.'
          },
          {
            type: 'bloco_animar_led_brilhar',
            name: 'Brilhar e desaparecer',
            shortName: 'Brilhar',
            screenshot: '../../images/leds/led_09_brilhar_fade.png',
            conceptImage: pwmConcept,
            kind: 'Bloco de animação',
            needs: '1 cor',
            place: 'Para efeito suave',
            child: 'Faz o LED acender aos poucos e apagar aos poucos.',
            idea: 'Em vez de pular de apagado para forte, o brilho sobe em pequenos passos e depois desce.',
            fits: 'Use em telas de espera, decoração, respiração de luz ou efeito de magia.',
            steps: [
              'Escolha uma cor.',
              'Coloque o bloco na sequência.',
              'Observe a luz subindo e descendo sem dar saltos.'
            ],
            watch: 'Esse efeito usa vários brilhos diferentes em sequência.',
            mission: 'Faça uma luz azul respirar devagar.'
          },
          {
            type: 'bloco_alternar_led',
            name: 'Alternar cores',
            shortName: 'Alternar',
            screenshot: '../../images/leds/led_10_alternar.png',
            conceptImage: mixConcept,
            kind: 'Bloco com várias cores',
            needs: '2 ou mais cores',
            place: 'Para sequência colorida',
            child: 'Troca entre várias cores, uma depois da outra.',
            idea: 'O bloco lê as cores na ordem em que aparecem. A primeira vem primeiro, depois a segunda, depois a próxima.',
            fits: 'Use para placas de aviso, efeitos de festa ou qualquer sequência de cores.',
            steps: [
              'Encaixe duas cores nos espaços do bloco.',
              'Use a engrenagem para adicionar mais cores.',
              'Mude a ordem das cores e rode de novo.'
            ],
            watch: 'A ordem muda o resultado. Azul depois de vermelho não parece igual a vermelho depois de azul.',
            mission: 'Monte vermelho, verde e azul alternando como um mini show de luzes.'
          },
          {
            type: 'bloco_transicao_led',
            name: 'Transição entre cores',
            shortName: 'Transição',
            screenshot: '../../images/leds/led_11_transicao.png',
            conceptImage: mixConcept,
            kind: 'Bloco de mudança suave',
            needs: '2 cores',
            place: 'Entre uma cor inicial e uma cor final',
            child: 'Muda de uma cor para outra sem trocar de repente.',
            idea: 'A placa cria muitas cores no caminho entre a primeira cor e a segunda.',
            fits: 'Use para pôr do sol, arco-íris, mudança de fase ou efeito de transformação.',
            steps: [
              'Escolha a cor de começo.',
              'Escolha a cor de chegada.',
              'Rode e veja a cor caminhar devagar até a outra.'
            ],
            watch: 'Durante a transição, aparecem cores intermediárias.',
            mission: 'Faça amarelo virar vermelho e depois vermelho virar azul.'
          },
          {
            type: 'bloco_batalhar_led',
            name: 'Batalhar cores',
            shortName: 'Batalha',
            screenshot: '../../images/leds/led_12_batalhar.png',
            conceptImage: mixConcept,
            kind: 'Bloco de sorteio',
            needs: '2 cores',
            place: 'Para jogo ou disputa',
            child: 'Sorteia entre duas cores e mostra uma delas.',
            idea: 'O programa escolhe um lado. Às vezes ganha a primeira cor, às vezes ganha a segunda.',
            fits: 'Use em jogos, sorteios, placares ou desafios de times.',
            steps: [
              'Escolha a cor do primeiro time.',
              'Escolha a cor do segundo time.',
              'Rode várias vezes e veja qual aparece mais.'
            ],
            watch: 'O resultado pode mudar a cada execução.',
            mission: 'Faça vermelho contra azul e conte dez rodadas.'
          },
          {
            type: 'bloco_criar_animacao_led',
            name: 'Criar animação',
            shortName: 'Animação',
            screenshot: '../../images/leds/led_13_animacao_livre.png',
            conceptImage: mixConcept,
            kind: 'Bloco construtor',
            needs: 'Ações e tempos',
            place: 'Para inventar uma sequência própria',
            child: 'Deixa você montar uma animação de LED do seu jeito.',
            idea: 'Uma animação é uma receita: fazer uma ação, esperar, fazer outra ação, esperar de novo.',
            fits: 'Use quando os blocos prontos não fazem exatamente o efeito que você imaginou.',
            steps: [
              'Abra a engrenagem para adicionar passos.',
              'Coloque ações, como ligar ou apagar LED.',
              'Coloque tempos de espera para a animação não passar rápido demais.'
            ],
            watch: 'Se faltar tempo de espera, a animação pode acontecer tão rápido que quase não dá para ver.',
            mission: 'Crie uma dança com três cores e pausas diferentes.'
          }
        ],
        projects: [
          {
            id: 'led_14_semaforo',
            title: 'Semáforo',
            screenshot: '../../images/leds/led_14_semaforo.png',
            text: 'Vermelho, amarelo e verde aparecem em ordem. Bom para treinar sequência.'
          },
          {
            id: 'led_15_respiracao_rgb',
            title: 'Respiração RGB',
            screenshot: '../../images/leds/led_15_respiracao_rgb.png',
            text: 'A luz fica fraca, forte e fraca de novo. Bom para treinar brilho.'
          },
          {
            id: 'led_16_arcoiris_transicoes',
            title: 'Arco-íris',
            screenshot: '../../images/leds/led_16_arcoiris_transicoes.png',
            text: 'As cores mudam suavemente. Bom para treinar transições.'
          }
        ]
      },
      { id: 'matrix', title: 'Matriz de LEDs', number: '2', color: '#4a69bd', disabled: true },
      { id: 'timing', title: 'Temporização', number: '3', color: '#16a085', disabled: true },
      { id: 'display', title: 'Display OLED', number: '4', color: '#27ae60', disabled: true },
      { id: 'buttons', title: 'Botões', number: '5', color: '#ee5a24', disabled: true },
      { id: 'sound', title: 'Som', number: '6', color: '#9a5ba5', disabled: true }
    ]
  };
})(window);
