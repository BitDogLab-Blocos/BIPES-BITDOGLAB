<p align="center">
  <img src="images/readme/project-banner.png" alt="BIPES BitDogLab Bloques" width="100%">
</p>

<p align="center">
  <a href="README.md">Português</a> · <a href="README.en.md">English</a> · <strong>Español</strong>
</p>

<p align="center">
  <img alt="Licencia GPLv3" src="https://img.shields.io/badge/licencia-GPLv3-9b6cff">
  <img alt="Blockly" src="https://img.shields.io/badge/bloques-Blockly-45dff5">
  <img alt="MicroPython" src="https://img.shields.io/badge/c%C3%B3digo-MicroPython-ff9d2e">
  <img alt="WebSerial" src="https://img.shields.io/badge/hardware-WebSerial-20b486">
</p>

<p align="center"><strong>Programación visual tangible: los niños conectan bloques, generan MicroPython y ven el resultado en hardware real.</strong></p>

## El proyecto

**BIPES BitDogLab Bloques** es una plataforma educativa open source basada en Blockly para enseñar programación, electrónica y pensamiento computacional con la placa BitDogLab y Raspberry Pi Pico W. Funciona en el navegador, convierte bloques conectados en MicroPython organizado y envía el programa a la placa por USB mediante Web Serial.

El proyecto se construye alrededor de la **tangibilidad**: los bloques utilizan lenguaje directo, iconos y acciones relacionadas con periféricos reales. Encender un LED, leer un botón, mostrar un valor en la pantalla OLED o animar la matriz debe seguir siendo comprensible antes de conocer la sintaxis de Python.

## La interfaz en acción

![Proyecto de contador construido con bloques](images/readme/interface-blocks.png)

El ejemplo combina una variable de puntos, los botones A y B y la pantalla OLED. Los bloques permanecen conectados como un programa ejecutable, mientras las categorías siguen visibles a la izquierda.

<table>
  <tr>
    <td width="50%" align="center"><strong>Categorías y bloques tangibles</strong></td>
    <td width="50%" align="center"><strong>Modos de proyecto</strong></td>
  </tr>
  <tr>
    <td><img src="images/readme/categories.png" alt="Categoría Variables abierta en la interfaz"></td>
    <td><img src="images/readme/project-modes.png" alt="Selector de proyectos Básico, Robot, Invernadero y Musical"></td>
  </tr>
</table>

La caja de herramientas contiene actualmente **25 categorías**, filtradas según el proyecto seleccionado:

- **Básico:** lógica, ciclos, matemáticas, variables, tiempo, colores y todos los periféricos integrados.
- **Robot móvil:** motores, movimiento, inclinación y batería.
- **Invernadero:** verificación de sensores, temperatura, humedad y gráficos.
- **Música:** control musical y creación de melodías para el buzzer.

## De una idea a MicroPython

![MicroPython generado a partir del proyecto de bloques](images/readme/micropython-generation.png)

Cada bloque posee una definición visual y un generador. Antes de generar código, los contratos verifican conexiones obligatorias y presentan avisos educativos. El resultado final separa importaciones, configuración y ciclo principal:

```python
pontos = 0

while True:
    if flag_botao_esquerda:
        pontos = pontos + 1
    if flag_botao_direita:
        pontos = pontos - 1
    oled.text(str(pontos), 3, 8)
    oled.show()
```

El programa puede ejecutarse directamente, guardarse como `main.py` o inspeccionarse dentro de la plataforma.

## Hardware que cobra vida

<p align="center">
  <img src="src/assets/images/logos/bitlab.png" alt="Placa BitDogLab y sus periféricos" width="900">
</p>

Los bloques cubren LED RGB, matriz RGB 5×5, OLED, joystick, botones, buzzer, notas musicales, micrófono, sensores y recursos específicos de Robot e Invernadero. La interfaz ofrece configuraciones para BitDogLab v6 y v7.

## Archivos dentro de la placa

![Gestor de archivos conectado a BitDogLab](device-file-manager/images/connected-window.png)

El gestor permite navegar por carpetas, abrir, descargar, mover, renombrar y eliminar archivos. Los CSV pueden mostrarse automáticamente como una hoja de cálculo con encabezados e índices, o como texto original. La implementación está documentada en [`device-file-manager/README.md`](device-file-manager/README.md).

## Ejemplos listos para aprender y mezclar

El repositorio contiene **56 proyectos XML conectados**, acompañados por imágenes de validación. Sirven como lecciones, puntos de partida y pruebas de regresión.

<table>
  <tr>
    <td align="center"><strong>Semáforo</strong></td>
    <td align="center"><strong>Contador con variable</strong></td>
    <td align="center"><strong>Arcoíris</strong></td>
  </tr>
  <tr>
    <td><img src="images/leds/led_14_semaforo.png" alt="Ejemplo de semáforo con LEDs"></td>
    <td><img src="images/variavel/1_contador_de_pontos_no_display_oled.png" alt="Contador de puntos con variable y OLED"></td>
    <td><img src="images/colours/colour_10_arcoiris.png" alt="Ejemplo de transiciones de colores del arcoíris"></td>
  </tr>
</table>

## Arquitectura general

![Arquitectura general de BIPES BitDogLab](images/readme/architecture.svg)

El flujo principal es simple: la interfaz entrega los bloques al workspace de Blockly, los contratos validan el programa, los generadores producen MicroPython y WebSerial se comunica con la placa. Los modos, ejemplos, traducciones y el gestor de archivos complementan este flujo sin mezclar responsabilidades.

## Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| HTML5, CSS3 y JavaScript | Interfaz web, diseño y comportamiento de la aplicación. |
| Blockly | Workspace, conexiones y serialización de bloques. |
| MicroPython | Código ejecutado por Raspberry Pi Pico W. |
| Web Serial API | Comunicación USB con el REPL de la placa. |
| CodeMirror | Visualización de Python, texto y CSV original. |
| xterm.js | Consola serial dentro del navegador. |
| Playwright | Validación automatizada y capturas de la interfaz. |

La aplicación no necesita un backend. El navegador sirve la interfaz y se comunica directamente con el dispositivo autorizado por el usuario. La interfaz está disponible actualmente en portugués de Brasil e inglés; esta documentación también ofrece una versión en español.

## Organización del repositorio

```text
BIPES-BITDOGLAB/
├── src/
│   ├── pages/                 # páginas de la aplicación
│   ├── styles/                # identidad visual y diseño
│   ├── js/
│   │   ├── blocks/            # definiciones, generadores, contratos
│   │   ├── communication/     # WebSerial y canales
│   │   ├── config/            # toolbox y versiones de la placa
│   │   ├── core/              # workspace, generación e inicio
│   │   └── ui/                # componentes de la interfaz
│   └── translations/          # interfaz PT-BR e inglés
├── device-file-manager/       # archivos y carpetas de la placa
├── Examples/                  # proyectos XML conectados
├── images/                    # ejemplos e imágenes del README
├── micropython/               # referencias y ejemplos MicroPython
├── firmware/                  # bibliotecas auxiliares para la placa
├── docs/                      # guías, checklists y notas técnicas
└── tests/                     # validaciones automatizadas locales
```

## Ejecutar localmente

Necesitas Chrome o Edge en una computadora, un cable USB de datos y una BitDogLab con MicroPython instalado.

```bash
git clone https://github.com/BitDogLab-Blocos/BIPES-BITDOGLAB.git
cd BIPES-BITDOGLAB
python -m http.server 5500
```

Abre `http://127.0.0.1:5500`, elige el modo de proyecto, conecta el puerto serial y construye tu programa. La aplicación no requiere `npm install`; las dependencias Node solo se usan en herramientas de validación.

> Web Serial requiere una acción explícita del usuario para elegir el puerto. Utiliza `localhost`, `127.0.0.1` o un origen HTTPS.

## Open source de verdad

Las contribuciones de docentes, estudiantes, makers y desarrolladores son bienvenidas. Puedes:

- informar un problema o proponer una experiencia educativa;
- mejorar el lenguaje y la accesibilidad de los bloques;
- crear definición, generador, contrato y ejemplo conectado para un nuevo bloque;
- probar en hardware real y compartir los resultados;
- traducir documentación o revisar materiales didácticos.

Al contribuir, conserva la tangibilidad, mantén cada responsabilidad dentro de su módulo e incluye un ejemplo que otra persona pueda abrir y ejecutar.

## Origen y licencia

Este trabajo se basa en [BIPES](https://bipes.net.br/), creado por Rafael Vidal Aroca y colaboradores, y evoluciona junto a la comunidad BitDogLab Blocos. Se distribuye bajo la [GNU General Public License v3.0](LICENSE): úsalo, estúdialo, modifícalo y compártelo conservando las mismas libertades.
