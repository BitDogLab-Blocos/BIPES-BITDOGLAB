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
          subtitle: 'Uma luz que mistura vermelho, verde e azul.',
          image: ledConcept,
          text: [
            'Na BitDogLab, o LED RGB e uma luz pequena que consegue mostrar varias cores.',
            'Cada bloco desta categoria manda uma ordem simples para essa luz: ligar, apagar, piscar, mudar o brilho ou fazer uma animacao.',
            'Comece pela teoria e depois escolha um bloco na lista ao lado.'
          ],
          teacher: 'Para a aula: trate o LED como uma saida. A crianca monta os blocos e ve a placa responder com luz.'
        },
        blocks: [
          {
            type: 'bloco_ligar_led',
            name: 'Ligar LED da cor',
            shortName: 'Ligar',
            screenshot: '../../images/leds/led_01_ligar.png',
            conceptImage: ledConcept,
            child: 'Este bloco acende o LED na cor escolhida.',
            how: ['Arraste o bloco para a area de trabalho.', 'Encaixe uma cor no espaco lateral.', 'Coloque uma espera depois, para dar tempo de ver a luz.'],
            teacher: 'Bom primeiro bloco para mostrar entrada e saida: a cor entra no bloco, a luz aparece na placa.',
            tryIt: 'Faca um semaforo: vermelho, amarelo e verde.',
            questions: ['Posso trocar a cor?', 'Da para deixar mais forte?']
          },
          {
            type: 'bloco_desligar_led',
            name: 'Desligar LED da cor',
            shortName: 'Desligar cor',
            screenshot: '../../images/leds/led_02_desligar.png',
            conceptImage: ledConcept,
            child: 'Este bloco apaga a parte do LED que forma a cor escolhida.',
            how: ['Use depois de acender uma cor.', 'Escolha a cor que voce quer apagar.', 'Observe se outra cor ainda ficou acesa.'],
            teacher: 'Use para mostrar que o LED RGB tem partes separadas. Amarelo, por exemplo, usa mais de uma parte.',
            tryIt: 'Acenda branco e apague uma cor por vez.',
            questions: ['Se apagar vermelho, o que sobra?', 'Por que amarelo usa duas luzes?']
          },
          {
            type: 'bloco_desligar_todos_leds',
            name: 'Desligar todos os LEDs',
            shortName: 'Apagar tudo',
            screenshot: '../../images/leds/led_03_desligar_todos.png',
            conceptImage: ledConcept,
            child: 'Este bloco apaga o LED inteiro.',
            how: ['Coloque no fim de uma sequencia.', 'Use antes de comecar uma nova cor.', 'Nao precisa encaixar cor nele.'],
            teacher: 'Explique como limpar o quadro antes de desenhar outra coisa.',
            tryIt: 'Acenda tres cores e termine apagando tudo.',
            questions: ['Ele apaga tudo mesmo?', 'Quando eu uso esse bloco?']
          },
          {
            type: 'bloco_acender_led_brilho',
            name: 'Ligar LED com brilho',
            shortName: 'Brilho',
            screenshot: '../../images/leds/led_04_brilho.png',
            conceptImage: pwmConcept,
            child: 'Este bloco acende uma cor mais fraca ou mais forte.',
            how: ['Escolha a cor.', 'Digite um brilho de 0 a 100.', 'Teste 25, 50 e 100 para comparar.'],
            teacher: 'Aqui a turma ve porcentagem virando luz. Nao precisa falar de PWM primeiro; mostre o efeito.',
            tryIt: 'Faca um amanhecer: 10%, 40%, 70%, 100%.',
            questions: ['O que acontece com 0?', '100 e o maximo?']
          },
          {
            type: 'bloco_piscar_led',
            name: 'Piscar LED rapidamente',
            shortName: 'Piscar rapido',
            screenshot: '../../images/leds/led_05_piscar_rapido.png',
            conceptImage: pwmConcept,
            child: 'Este bloco faz o LED piscar rapido, como um aviso.',
            how: ['Escolha uma cor forte.', 'Use sozinho ou antes de outra acao.', 'Compare com o piscar devagar.'],
            teacher: 'Converse sobre sinais do dia a dia: alerta, botao de emergencia, luz de aviso.',
            tryIt: 'Use vermelho para criar um alerta.',
            questions: ['Da para piscar mais devagar?', 'Parece um alarme?']
          },
          {
            type: 'piscar_led_lento',
            name: 'Piscar LED devagar',
            shortName: 'Piscar devagar',
            screenshot: '../../images/leds/led_06_piscar_lento.png',
            conceptImage: pwmConcept,
            child: 'Este bloco faz o LED piscar com calma.',
            how: ['Escolha a cor.', 'Use para mostrar que a placa esta esperando.', 'Compare com a piscada rapida.'],
            teacher: 'Mostre que o tempo muda a mensagem. Rapido parece alerta; devagar parece espera.',
            tryIt: 'Faca uma luz verde de espera.',
            questions: ['Por que esse parece mais calmo?', 'Posso usar quando o programa espera?']
          },
          {
            type: 'bloco_animar_led_coracao',
            name: 'Batimento cardiaco',
            shortName: 'Coracao',
            screenshot: '../../images/leds/led_07_coracao.png',
            conceptImage: pwmConcept,
            child: 'Este bloco faz dois pulsos de luz, parecendo um coracao batendo.',
            how: ['Escolha uma cor.', 'Use vermelho para ficar parecido com coracao.', 'Observe o ritmo dos pulsos.'],
            teacher: 'Bom para mostrar que programar tambem cria expressao, ritmo e sentido.',
            tryIt: 'Coloque no fim de um projeto como comemoracao.',
            questions: ['Parece um coracao?', 'Posso usar azul?']
          },
          {
            type: 'bloco_sinalizar_led_sos',
            name: 'Sinal SOS',
            shortName: 'SOS',
            screenshot: '../../images/leds/led_08_sos.png',
            conceptImage: pwmConcept,
            child: 'Este bloco pisca uma mensagem de ajuda: SOS.',
            how: ['Escolha a cor.', 'Veja a sequencia de piscadas curtas e longas.', 'Converse sobre mensagens feitas com sinais.'],
            teacher: 'Use para introduzir codigos. A luz vira linguagem: curto e longo contam uma mensagem.',
            tryIt: 'Compare com uma sequencia inventada pela turma.',
            questions: ['O que quer dizer SOS?', 'Da para mandar outra palavra?']
          },
          {
            type: 'bloco_animar_led_brilhar',
            name: 'Brilhar e desaparecer',
            shortName: 'Brilhar',
            screenshot: '../../images/leds/led_09_brilhar_fade.png',
            conceptImage: pwmConcept,
            child: 'Este bloco faz o LED acender aos poucos e apagar aos poucos.',
            how: ['Escolha uma cor.', 'Observe que a mudanca nao pula de uma vez.', 'Use como efeito de espera.'],
            teacher: 'Explique como uma escada: muitos passos pequenos deixam o movimento suave.',
            tryIt: 'Faca uma luz respirando em verde.',
            questions: ['Como ele fica suave?', 'Da para fazer respirando?']
          },
          {
            type: 'bloco_alternar_led',
            name: 'Alternar cores',
            shortName: 'Alternar',
            screenshot: '../../images/leds/led_10_alternar.png',
            conceptImage: mixConcept,
            child: 'Este bloco troca entre varias cores.',
            how: ['Coloque duas ou mais cores.', 'Use a engrenagem para adicionar cores.', 'A ordem das cores e a ordem da animacao.'],
            teacher: 'Mostre lista e ordem sem usar esse nome no inicio: primeira cor, segunda cor, terceira cor.',
            tryIt: 'Alterne vermelho, verde e azul.',
            questions: ['Como coloco mais cores?', 'A ordem muda tudo?']
          },
          {
            type: 'bloco_transicao_led',
            name: 'Transicao entre cores',
            shortName: 'Transicao',
            screenshot: '../../images/leds/led_11_transicao.png',
            conceptImage: mixConcept,
            child: 'Este bloco muda de uma cor para outra de forma suave.',
            how: ['Escolha a cor inicial.', 'Escolha a cor final.', 'Veja a luz passar pelo caminho entre elas.'],
            teacher: 'Use a ideia de mistura: a cor nao salta; ela vai mudando aos poucos.',
            tryIt: 'Faca um por do sol: amarelo para vermelho, vermelho para azul.',
            questions: ['Como vira outra cor?', 'Da para fazer arco-iris?']
          },
          {
            type: 'bloco_batalhar_led',
            name: 'Batalhar cores',
            shortName: 'Batalha',
            screenshot: '../../images/leds/led_12_batalhar.png',
            conceptImage: mixConcept,
            child: 'Este bloco sorteia entre duas cores e cria uma disputa de luz.',
            how: ['Escolha duas cores.', 'Rode e observe qual aparece.', 'Use como jogo ou sorteio.'],
            teacher: 'Bom para falar de sorteio: o programa tem regras, mas o resultado muda.',
            tryIt: 'Vermelho contra azul: qual time aparece mais?',
            questions: ['Quem ganhou?', 'Da para escolher os times?']
          },
          {
            type: 'bloco_criar_animacao_led',
            name: 'Criar animacao',
            shortName: 'Animacao',
            screenshot: '../../images/leds/led_13_animacao_livre.png',
            conceptImage: mixConcept,
            child: 'Este bloco deixa voce montar sua propria sequencia de luz.',
            how: ['Coloque uma acao.', 'Coloque um tempo de espera.', 'Repita esses passos para criar a animacao.'],
            teacher: 'Apresente como receita: fazer algo, esperar, fazer outra coisa, esperar de novo.',
            tryIt: 'Crie uma danca de luzes com tres cores.',
            questions: ['Posso inventar minha sequencia?', 'Onde coloco o tempo?']
          }
        ],
        projects: [
          { id: 'led_14_semaforo', title: 'Semaforo', screenshot: '../../images/leds/led_14_semaforo.png', text: 'Um exemplo pronto para falar de ordem: vermelho, amarelo e verde.' },
          { id: 'led_15_respiracao_rgb', title: 'Respiracao RGB', screenshot: '../../images/leds/led_15_respiracao_rgb.png', text: 'Um exemplo para ver brilho mudando devagar.' },
          { id: 'led_16_arcoiris_transicoes', title: 'Arco-iris', screenshot: '../../images/leds/led_16_arcoiris_transicoes.png', text: 'Um exemplo para ver varias cores se transformando.' }
        ]
      },
      { id: 'matrix', title: 'Matriz de LEDs', number: '2', color: '#4a69bd', disabled: true },
      { id: 'timing', title: 'Temporizacao', number: '3', color: '#16a085', disabled: true },
      { id: 'display', title: 'Display OLED', number: '4', color: '#27ae60', disabled: true },
      { id: 'buttons', title: 'Botoes', number: '5', color: '#ee5a24', disabled: true },
      { id: 'sound', title: 'Som', number: '6', color: '#9a5ba5', disabled: true }
    ]
  };
})(window);
