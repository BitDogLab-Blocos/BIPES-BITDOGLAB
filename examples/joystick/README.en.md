# Joystick examples

[Read in Portuguese](README.md) · [English](README.en.md)

![Joystick examples collection](../../images/joystick/14_jogo_do_alvo_no_oled.png)

This collection contains **16 connected projects** for exploring the BitDogLab joystick with blocks. The examples start with simple actions—controlling LED brightness and buzzer frequency—and progress to OLED interfaces, drawing, the LED matrix, selectors, and games.

## How to use

Open the application, load any `.xml` file from this folder into the Blockly workspace, and run it or generate MicroPython. The images below show the block arrangement for each project; click an image or its name to open the XML file.

The joystick uses the analog axes **GPIO 27 (X)** and **GPIO 26 (Y)**, plus the center button on **GPIO 22**. The BitDogLab v6 or v7 configuration applies the correct axis orientation.

## Collection

<table>
  <tr>
    <td width="50%" valign="top">
      <a href="01_led_brilho_com_direcoes.xml"><img src="../../images/joystick/01_led_brilho_com_direcoes.png" alt="LED brightness with directions" width="100%"></a>
      <strong>01 — LED brightness with directions</strong><br>
      Increase or reduce the red LED brightness by moving the joystick up or down.<br>
      <a href="01_led_brilho_com_direcoes.xml">Open XML</a>
    </td>
    <td width="50%" valign="top">
      <a href="02_led_intensidade_no_oled.xml"><img src="../../images/joystick/02_led_intensidade_no_oled.png" alt="LED intensity on OLED" width="100%"></a>
      <strong>02 — LED intensity on OLED</strong><br>
      Control the blue LED and show its current intensity on the OLED display.<br>
      <a href="02_led_intensidade_no_oled.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="03_led_faixa_de_brilho.xml"><img src="../../images/joystick/03_led_faixa_de_brilho.png" alt="LED brightness range" width="100%"></a>
      <strong>03 — Brightness range</strong><br>
      Turn joystick movement into a continuous brightness value from 0 to 100%.<br>
      <a href="03_led_faixa_de_brilho.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="04_buzzer_frequencia_com_direcoes.xml"><img src="../../images/joystick/04_buzzer_frequencia_com_direcoes.png" alt="Buzzer frequency with directions" width="100%"></a>
      <strong>04 — Buzzer frequency with directions</strong><br>
      Increase or reduce the buzzer frequency between 200 and 4000 Hz.<br>
      <a href="04_buzzer_frequencia_com_direcoes.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="05_buzzer_frequencia_no_oled.xml"><img src="../../images/joystick/05_buzzer_frequencia_no_oled.png" alt="Buzzer frequency on OLED" width="100%"></a>
      <strong>05 — Frequency on OLED</strong><br>
      Control the buzzer and track its current frequency on the display.<br>
      <a href="05_buzzer_frequencia_no_oled.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="06_player_movido_no_oled.xml"><img src="../../images/joystick/06_player_movido_no_oled.png" alt="Player moved on OLED" width="100%"></a>
      <strong>06 — Player moved on OLED</strong><br>
      Move a square across the screen without letting it cross the edges.<br>
      <a href="06_player_movido_no_oled.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="07_player_com_coordenadas.xml"><img src="../../images/joystick/07_player_com_coordenadas.png" alt="Player with coordinates on OLED" width="100%"></a>
      <strong>07 — Player with coordinates</strong><br>
      Move the player and display its X and Y positions on the OLED.<br>
      <a href="07_player_com_coordenadas.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="08_lousa_magica.xml"><img src="../../images/joystick/08_lousa_magica.png" alt="Magic canvas on OLED" width="100%"></a>
      <strong>08 — Magic canvas</strong><br>
      Draw a persistent trail on the display by moving the joystick.<br>
      <a href="08_lousa_magica.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="09_lousa_com_coordenadas.xml"><img src="../../images/joystick/09_lousa_com_coordenadas.png" alt="Canvas with coordinates" width="100%"></a>
      <strong>09 — Canvas with coordinates</strong><br>
      Draw freely and show the cursor's current coordinates.<br>
      <a href="09_lousa_com_coordenadas.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="10_cursor_na_matriz.xml"><img src="../../images/joystick/10_cursor_na_matriz.png" alt="Cursor on the LED matrix" width="100%"></a>
      <strong>10 — Cursor on the matrix</strong><br>
      Move a point around the 5×5 RGB grid using the four directions.<br>
      <a href="10_cursor_na_matriz.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="11_seletor_de_emojis.xml"><img src="../../images/joystick/11_seletor_de_emojis.png" alt="Emoji selector" width="100%"></a>
      <strong>11 — Emoji selector</strong><br>
      Navigate between options and choose an emoji for the matrix.<br>
      <a href="11_seletor_de_emojis.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="12_seletor_de_numeros.xml"><img src="../../images/joystick/12_seletor_de_numeros.png" alt="Number selector" width="100%"></a>
      <strong>12 — Number selector</strong><br>
      Use the joystick to browse numbers and display the selected value.<br>
      <a href="12_seletor_de_numeros.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="13_luz_e_som_combinados.xml"><img src="../../images/joystick/13_luz_e_som_combinados.png" alt="Combined light and sound" width="100%"></a>
      <strong>13 — Combined light and sound</strong><br>
      Combine LED and buzzer control in an interactive experience.<br>
      <a href="13_luz_e_som_combinados.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="14_jogo_do_alvo_no_oled.xml"><img src="../../images/joystick/14_jogo_do_alvo_no_oled.png" alt="Target game on OLED" width="100%"></a>
      <strong>14 — Target game on OLED</strong><br>
      Move the player to the target and combine movement, conditions, and scoring.<br>
      <a href="14_jogo_do_alvo_no_oled.xml">Open XML</a>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <a href="15_estudio_interativo.xml"><img src="../../images/joystick/15_estudio_interativo.png" alt="Interactive studio" width="100%"></a>
      <strong>15 — Interactive studio</strong><br>
      Navigate through a sequence of options and execute only the selected option.<br>
      <a href="15_estudio_interativo.xml">Open XML</a>
    </td>
    <td valign="top">
      <a href="16_lousa_apagar_com_botao.xml"><img src="../../images/joystick/16_lousa_apagar_com_botao.png" alt="Canvas cleared with the button" width="100%"></a>
      <strong>16 — Canvas with clear button</strong><br>
      Draw on the OLED and press the joystick's center button to clear the screen.<br>
      <a href="16_lousa_apagar_com_botao.xml">Open XML</a>
    </td>
  </tr>
</table>
