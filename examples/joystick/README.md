# Exemplos de joystick

[Português](README.md) · [Read in English](README.en.md)

![Coleção de exemplos de joystick](../../images/joystick/14_jogo_do_alvo_no_oled.png)

Esta coleção reúne **16 projetos conectados** para explorar o joystick da BitDogLab com blocos. Os exemplos começam com ações simples — controlar o brilho do LED e a frequência do buzzer — e avançam para interfaces no OLED, desenhos, matriz de LEDs, seletores e jogos.

## Como usar

Abra a aplicação, carregue qualquer arquivo `.xml` desta pasta no workspace Blockly e execute ou gere o MicroPython. As imagens abaixo mostram a montagem correspondente a cada projeto; clique em uma imagem ou no nome para abrir o XML.

O joystick usa os eixos analógicos **GPIO 27 (X)** e **GPIO 26 (Y)**, além do botão central em **GPIO 22**. A configuração da BitDogLab v6 ou v7 aplica a orientação correta dos eixos.

## Coleção

<table>
  <tr>
    <td width="50%" valign="top">
      <a href="01_led_brilho_com_direcoes.xml"><img src="../../images/joystick/01_led_brilho_com_direcoes.png" alt="Brilho do LED com direções" width="100%"></a>
      <strong>01 — Brilho do LED com direções</strong><br>
      Aumente ou reduza o brilho do LED vermelho movendo o joystick para cima ou para baixo.<br>
      <a href="01_led_brilho_com_direcoes.xml">Abrir XML</a>
    </td>
    <td width="50%" valign="top">
      <a href="02_led_intensidade_no_oled.xml"><img src="../../images/joystick/02_led_intensidade_no_oled.png" alt="Intensidade do LED no OLED" width="100%"></a>
      <strong>02 — Intensidade no OLED</strong><br>
      Controle o LED azul e mostre sua intensidade atual no display OLED.<br>
      <a href="02_led_intensidade_no_oled.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="03_led_faixa_de_brilho.xml"><img src="../../images/joystick/03_led_faixa_de_brilho.png" alt="Faixa de brilho do LED" width="100%"></a>
      <strong>03 — Faixa de brilho</strong><br>
      Transforme o movimento do joystick em um valor contínuo de brilho entre 0 e 100%.<br>
      <a href="03_led_faixa_de_brilho.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="04_buzzer_frequencia_com_direcoes.xml"><img src="../../images/joystick/04_buzzer_frequencia_com_direcoes.png" alt="Frequência do buzzer com direções" width="100%"></a>
      <strong>04 — Frequência do buzzer com direções</strong><br>
      Aumente ou reduza a frequência do buzzer entre 200 e 4000 Hz.<br>
      <a href="04_buzzer_frequencia_com_direcoes.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="05_buzzer_frequencia_no_oled.xml"><img src="../../images/joystick/05_buzzer_frequencia_no_oled.png" alt="Frequência do buzzer no OLED" width="100%"></a>
      <strong>05 — Frequência no OLED</strong><br>
      Controle o buzzer e acompanhe a frequência atual no display.<br>
      <a href="05_buzzer_frequencia_no_oled.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="06_player_movido_no_oled.xml"><img src="../../images/joystick/06_player_movido_no_oled.png" alt="Player movido no OLED" width="100%"></a>
      <strong>06 — Player movido no OLED</strong><br>
      Mova um quadrado pela tela sem deixá-lo ultrapassar as bordas.<br>
      <a href="06_player_movido_no_oled.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="07_player_com_coordenadas.xml"><img src="../../images/joystick/07_player_com_coordenadas.png" alt="Player com coordenadas no OLED" width="100%"></a>
      <strong>07 — Player com coordenadas</strong><br>
      Mova o player e apresente suas posições X e Y no OLED.<br>
      <a href="07_player_com_coordenadas.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="08_lousa_magica.xml"><img src="../../images/joystick/08_lousa_magica.png" alt="Lousa mágica no OLED" width="100%"></a>
      <strong>08 — Lousa mágica</strong><br>
      Desenhe uma trilha persistente no display movendo o joystick.<br>
      <a href="08_lousa_magica.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="09_lousa_com_coordenadas.xml"><img src="../../images/joystick/09_lousa_com_coordenadas.png" alt="Lousa com coordenadas" width="100%"></a>
      <strong>09 — Lousa com coordenadas</strong><br>
      Desenhe livremente e mostre as coordenadas atuais do cursor.<br>
      <a href="09_lousa_com_coordenadas.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="10_cursor_na_matriz.xml"><img src="../../images/joystick/10_cursor_na_matriz.png" alt="Cursor na matriz de LEDs" width="100%"></a>
      <strong>10 — Cursor na matriz</strong><br>
      Mova um ponto pela grade RGB 5×5 usando as quatro direções.<br>
      <a href="10_cursor_na_matriz.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="11_seletor_de_emojis.xml"><img src="../../images/joystick/11_seletor_de_emojis.png" alt="Seletor de emojis" width="100%"></a>
      <strong>11 — Seletor de emojis</strong><br>
      Navegue entre opções e escolha um emoji para a matriz.<br>
      <a href="11_seletor_de_emojis.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="12_seletor_de_numeros.xml"><img src="../../images/joystick/12_seletor_de_numeros.png" alt="Seletor de números" width="100%"></a>
      <strong>12 — Seletor de números</strong><br>
      Use o joystick para navegar por números e exibir a escolha.<br>
      <a href="12_seletor_de_numeros.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="13_luz_e_som_combinados.xml"><img src="../../images/joystick/13_luz_e_som_combinados.png" alt="Luz e som combinados" width="100%"></a>
      <strong>13 — Luz e som combinados</strong><br>
      Combine o controle do LED e do buzzer em uma experiência interativa.<br>
      <a href="13_luz_e_som_combinados.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="14_jogo_do_alvo_no_oled.xml"><img src="../../images/joystick/14_jogo_do_alvo_no_oled.png" alt="Jogo do alvo no OLED" width="100%"></a>
      <strong>14 — Jogo do alvo no OLED</strong><br>
      Mova o player até o alvo e combine movimento, condições e pontuação.<br>
      <a href="14_jogo_do_alvo_no_oled.xml">Abrir XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="15_estudio_interativo.xml"><img src="../../images/joystick/15_estudio_interativo.png" alt="Estúdio interativo" width="100%"></a>
      <strong>15 — Estúdio interativo</strong><br>
      Navegue por uma sequência de opções e execute somente a opção selecionada.<br>
      <a href="15_estudio_interativo.xml">Abrir XML</a>
    </td>
    <td valign="top">
      <a href="16_lousa_apagar_com_botao.xml"><img src="../../images/joystick/16_lousa_apagar_com_botao.png" alt="Lousa que apaga com o botão" width="100%"></a>
      <strong>16 — Lousa com botão de apagar</strong><br>
      Desenhe no OLED e pressione o botão central do joystick para limpar a tela.<br>
      <a href="16_lousa_apagar_com_botao.xml">Abrir XML</a>
    </td>
  </tr>
</table>
