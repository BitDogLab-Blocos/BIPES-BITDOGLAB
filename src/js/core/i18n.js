'use strict';

Code.APP_MESSAGES = {
  'pt-br': {
    console: 'Mensagens',
    databoard: 'Dados',
    title: 'BitDogLab - Aprenda Programação de Forma Divertida',
    notConnected: 'Sem conexão para enviar dados.',
    serialFroozen: 'A conexão serial não está respondendo.',
    languageTooltip: 'Mudar idioma.',
    languagePanelTitle: 'Idioma da interface',
    languagePortuguese: 'Português (Brasil)',
    languageEnglish: 'English',
    languageCodePt: 'PT',
    languageCodeEn: 'EN',
    toolboxReloaded: 'Toolbox recarregada com sucesso!',
    toolboxDefaultLoaded: 'Toolbox padrão carregada!',
    toolboxLoadError: 'Erro ao carregar a toolbox: %1',
    versionChanged: 'Versão alterada para %1!',
    reconnectUsbPins: 'Desconecte e reconecte a placa USB para aplicar a nova pinagem.',
    projectBasic: 'Básico',
    projectRobot: 'Robô Móvel',
    projectGreenhouse: 'Estufa'
  },
  'en': {
    hello: 'Hello',
    user: 'User',
    projects: 'Projects',
    settings: 'Settings',
    title: 'BitDogLab - Visual Programming for Embedded Systems',
    blocks: 'Blocks',
    files: 'Files',
    shared: 'Shared',
    device: 'Device',
    console: 'Messages',
    databoard: 'Data',
    linkTooltip: 'Save and share the current block workspace.',
    runTooltip: 'Execute the program generated from the workspace blocks.',
    badCode: 'Program error:\n%1',
    timeout: 'Maximum execution iterations exceeded.',
    trashTooltip: 'Discard all blocks.',
    httpRequestError: 'There was a problem with the request.',
    linkAlert: 'Share your blocks with this link:\n\n%1',
    hashError: "Sorry, '%1' does not correspond to a saved program.",
    xmlError: 'Unable to load the saved file. It may have been created with a different Blockly version.',
    badXml: "XML parsing error:\n%1\n\nSelect 'OK' to discard your changes or 'Cancel' to continue editing the XML.",
    saveTooltip: 'Save blocks to a file.',
    loadTooltip: 'Load blocks from a file.',
    notificationTooltip: 'Notification panel.',
    ErrorGET: 'The requested file could not be loaded.',
    invalidDevice: 'Invalid device.',
    languageTooltip: 'Switch interface language.',
    noToolbox: 'The selected device does not expose a toolbox.',
    networkTooltip: 'Connect over network (WebREPL, HTTP).',
    serialTooltip: 'Connect over serial/USB or Bluetooth (Web Serial API, HTTPS).',
    toolbarTooltip: 'Show toolbar',
    wrongDevicePin: 'Check the pin mapping; the target device has changed.',
    notDefined: 'not defined',
    editAsFileValue: 'Edit as file',
    editAsFileTooltip: 'Edit Python code and save it to the device storage.',
    forumTooltip: 'Help forum.',
    accountTooltip: 'Your projects and scenarios.',
    blocksLoadedFromFile: "Blocks loaded from file '%1'.",
    deviceUnavailable: "Device '%1' unavailable.",
    notConnected: 'No connection available to send data.',
    serialFroozen: 'Serial connection is unresponsive.',
    notAvailableFlag: '$1 is not available on your browser.\r\nPlease make sure the $1 flag is enabled.',
    languagePanelTitle: 'Interface language',
    languagePortuguese: 'Português (Brasil)',
    languageEnglish: 'English',
    languageCodePt: 'PT',
    languageCodeEn: 'EN',
    toolboxReloaded: 'Toolbox reloaded successfully!',
    toolboxDefaultLoaded: 'Default toolbox loaded!',
    toolboxLoadError: 'Failed to load the toolbox: %1',
    versionChanged: 'Board revision changed to %1!',
    reconnectUsbPins: 'Disconnect and reconnect the USB board to apply the new pin mapping.',
    projectBasic: 'Basics',
    projectRobot: 'Mobile Robot',
    projectGreenhouse: 'Greenhouse'
  }
};

Code.CUSTOM_OVERRIDES = {
  'en': {
    'resto de': 'remainder of',
    'Mostrar resultado na aba de mensagens:': 'Display result in the messages tab:',
    'No texto': 'Within text',
    '⏱️ Aguardar': '⏱️ Wait',
    '⏱️ Tempo ligado BitDogLab': '⏱️ BitDogLab Uptime',
    '⏱️ Tempo cronômetro': '⏱️ Stopwatch Time',
    '💡 Ligar LED da cor': '💡 Turn On LED Color',
    '🔆 Ligar LED da cor': '🔆 Set LED Color',
    'com brilho de': 'with brightness',
    '⚡ Piscar LED da cor': '⚡ Flash LED Color',
    '🐌 Piscar LED da cor': '🐌 Blink LED Color',
    '💓 Animar LED da cor': '💓 LED Heartbeat Animation',
    '🆘 Sinalizar LED da cor': '🆘 SOS LED Pattern',
    '✨ Animar LED da cor': '✨ Fade LED Color',
    'brilhar e desaparecer': 'fade in/out',
    '🔄 Alternar LED da cor': '🔄 Alternate LED Color',
    '🌈 Transição de LED da cor': '🌈 LED Color Transition',
    '⚔️ Batalhar LED da cor': '⚔️ LED Color Battle',
    '🔲 Ligar matriz de LED da cor': '🔲 Turn On LED Matrix Color',
    '🔲 Ligar LED na linha': '🔲 Turn On Matrix LED at Row',
    '🔲 Ligar linha': '🔲 Turn On Matrix Row',
    '🔲 Ligar coluna': '🔲 Turn On Matrix Column',
    'e brilho de': 'and brightness',
    '🔢 Mostrar número': '🔢 Show Number',
    '😊 Mostrar emoji': '😊 Show Emoji',
    '🎵 Dó': '🎵 Do',
    '👑 Ré': '👑 Re',
    '🧚‍♀️ Fá': '🧚‍♀️ Fa',
    '⭐ Lá': '⭐ La',
    '👍 Si': '👍 Ti',
    '🎵 Tocar nota': '🎵 Play Note',
    'na oitava': 'at octave',
    'por': 'for',
    '📺 Mostrar no display': '📺 Render to Display',
    '✏️ Escrever': '✏️ Write',
    '💫 Piscar texto': '💫 Blink Text',
    'Tempo ligado': 'On time',
    'Tempo apagado': 'Off time',
    '🔢 Mostrar resultado da conta': '🔢 Show Calculation Result',
    '📊 Mostrar valor': '📊 Show Numeric Value',
    '💡 Mostrar se LED': '💡 Show LED State',
    '🔄 Zerar contador do botão': '🔄 Reset Button Counter',
    '🎮 Mostrar se botão': '🎮 Show Button State',
    'foi apertado': 'was pressed',
    '📊 Contar quantas vezes:': '📊 Count Button Presses:',
    '🔊 Mostrar status do buzzer': '🔊 Show Buzzer Status',
    '🎵 Mostrar frequência:': '🎵 Show Frequency:',
    '📊 Monitor da Matriz': '📊 LED Matrix Monitor',
    '⏱️ Tempo BitDogLab ligada': '⏱️ BitDogLab Uptime',
    '🔌 Tempo BitDogLab ligada': '🔌 BitDogLab Uptime',
    'Linha': 'Line',
    'Alinhamento': 'Alignment',
    'Formato': 'Format',
    '🏁 Iniciar/Retomar Cronômetro': '🏁 Start/Resume Stopwatch',
    '⏸️ Pausar Cronômetro': '⏸️ Pause Stopwatch',
    '🔄 Reiniciar Cronômetro': '🔄 Reset Stopwatch',
    '📊 Mostrar Cronômetro': '📊 Display Stopwatch',
    '🎼 Criar Melodia': '🎼 Create Melody',
    '🎵 Criar Trilha Sonora': '🎵 Create Soundtrack',
    '⚡ Fazer Piscar Rápido': '⚡ Fast Blink',
    '🐌 Fazer Piscar Devagar': '🐌 Slow Blink',
    '✨ Fazer Aparecer e Sumir': '✨ Fade In/Out',
    '💫 Fazer Pulsar Brilho': '💫 Pulse Brightness',
    '⬆️ Fazer Deslizar para Cima': '⬆️ Slide Up',
    '⬅️ Fazer Deslizar para Esquerda': '⬅️ Slide Left',
    '⬇️ Fazer Deslizar para Baixo': '⬇️ Slide Down',
    '➡️ Fazer Deslizar para Direita': '➡️ Slide Right',
    '🔄 Fazer Balançar': '🔄 Swing',
    '🔻 Fazer Contração': '🔻 Contract',
    '⚡ Dar um Flash de Cor': '⚡ Color Flash',
    '🎮 Enquanto pressionar o botão': '🎮 While Button Is Pressed',
    '😊 fazer:': '😊 do:',
    '😕 Quando soltar:': '😕 On release:',
    '🎮 Se o botão for pressionado': '🎮 If Button Is Pressed',
    'Ação acontece:': 'Action:',
    '🕹️ Joystick controla LED': '🕹️ Joystick-Controlled LED',
    'cor:': 'color:',
    'início:': 'start:',
    'sobe ao mover:': 'increase on move:',
    'desce ao mover:': 'decrease on move:',
    '🕹️ Intensidade LED %': '🕹️ LED Intensity %',
    '🕹️ Joystick controla Buzzer': '🕹️ Joystick-Controlled Buzzer',
    'frequência inicial:': 'initial frequency:',
    'Hz  (intervalo: 200 – 4000 Hz)': 'Hz  (range: 200-4000 Hz)',
    'volume:': 'volume:',
    '%  (0 = mudo, 100 = máximo)': '%  (0 = mute, 100 = maximum)',
    '🕹️ Frequência Buzzer Hz': '🕹️ Buzzer Frequency Hz',
    '🕹️ Joystick mover no Display': '🕹️ Move Object on OLED Display',
    'tamanho do player:': 'player size:',
    '🎨 Lousa Mágica no Display': '🎨 OLED Sketchpad',
    'tamanho da caneta:': 'pen size:',
    '🕹️ Posição X': '🕹️ X Position',
    '🕹️ Posição Y': '🕹️ Y Position',
    '🕹️ Mover ponto de luz na Matriz de LED  brilho:': '🕹️ Move LED Cursor on Matrix  brightness:',
    '%  cor:': '%  color:',
    'linha inicial:': 'initial row:',
    'coluna inicial:': 'initial column:',
    '🕹️ Trocar emoji na Matriz de LED': '🕹️ Switch LED Matrix Emoji',
    'próximo:': 'next:',
    'anterior:': 'previous:',
    'opções:': 'options:',
    '🎙️ Testar Microfone no Display': '🎙️ Display Microphone Diagnostics',
    '🎙️ Medidor de barulho na Matriz  brilho:': '🎙️ LED Matrix Sound Level Meter  brightness:',
    '🎙️ Nível do som': '🎙️ Sound Level',
    '🖥️ Medidor de barulho no Display  linha:': '🖥️ OLED Sound Level Meter  line:',
    '🖐️ Contar palmas  linha:': '🖐️ Clap Counter  line:',
    '🖐️ Total de palmas': '🖐️ Total Claps',
    '🎙️ Intensidade do barulho (%)': '🎙️ Sound Intensity (%)',
    '💡 Controlar LED com a Voz  cor:': '💡 Voice-Controlled LED  color:',
    'Se': 'If',
    'então': 'then',
    'senão': 'else',
    'NÃO': 'NOT',
    'bloco de desenho': 'drawing block',
    '🎨 Criar Desenho na Matriz': '🎨 Create Matrix Drawing',
    '🌡️ Temperatura (°C)': '🌡️ Temperature (°C)',
    '💧 Umidade (%)': '💧 Humidity (%)',
    '🌱 Efeito Estufa — Comparar 2 sensores': '🌱 Greenhouse Experiment — Compare 2 Sensors',
    'Esquerda: Sensor 1  |  Direita: Sensor 2': 'Left: Sensor 1  |  Right: Sensor 2',
    '🌱 Mostrar/Ocultar medição Sensor 1': '🌱 Toggle Sensor 1 Readout',
    '🌱 Mostrar/Ocultar medição Sensor 2': '🌱 Toggle Sensor 2 Readout',
    '🌡️ Temperatura Sensor 1': '🌡️ Sensor 1 Temperature',
    '💧 Umidade Sensor 1': '💧 Sensor 1 Humidity',
    '🌡️ Temperatura Sensor 2': '🌡️ Sensor 2 Temperature',
    '💧 Umidade Sensor 2': '💧 Sensor 2 Humidity',
    '📊 Mostrar Gráfico': '📊 Plot Graph',
    'tipo': 'type',
    'na': 'on',
    '🔎 Verificar qual sensor está conectado': '🔎 Check Which Sensor Is Connected',
    '🔁 Repetição': '🔁 Repetition',
    '🧮 Matemática': '🧮 Mathematics',
    '🔤 Texto': '🔤 Text',
    '⏱️ Tempo': '⏱️ Time',
    '🎨 Cores': '🎨 Colors',
    '💡 LEDs': '💡 LEDs',
    '🔲 Matriz de LEDs': '🔲 LED Matrix',
    '🔢 Números na Matriz': '🔢 Matrix Numbers',
    '😊 Emojis na Matriz': '😊 Matrix Emojis',
    '🎼 Notas Musicais': '🎼 Musical Notes',
    '🔊 Som': '🔊 Audio',
    '📺 Display': '📺 Display',
    '✨ Animações da Matriz': '✨ Matrix Animations',
    '🎮 Botões': '🎮 Buttons',
    '🕹️ Joystick': '🕹️ Joystick',
    '🎙️ Microfone': '🎙️ Microphone',
    '🌱 Sensores e Estufa': '🌱 Sensors and Greenhouse',
    'Controle Robô': 'Robot Control',
    'Em breve: blocos de motor e sensores': 'Coming soon: motor control and sensor blocks',
    '⏱️ Tempo e Relógio': '⏱️ Time and Clock',
    '🔢 Números na Matriz de LEDs': '🔢 LED Matrix Numbers',
    '😊 Emojis na Matriz de LEDs': '😊 LED Matrix Emojis',
    '✨ Animações da Matriz de LEDs': '✨ LED Matrix Animations',
    '🚀 EXTRAS': '🚀 Extras',
    'IMPORTANTE!': 'IMPORTANT!',
    'Escolha seu Projeto!': 'Select a Project',
    'Estufa': 'Greenhouse',
    'Blocos essenciais para começar a programar': 'Core blocks to start building programs',
    'Controle motores e sensores do robô': 'Control robot motors and sensors',
    'Meça temperatura, luz e umidade': 'Measure temperature, light and humidity',
    'Conecte sua placa BitdogLab': 'Connect your BitDogLab board',
    'Crie seu código': 'Create your program',
    '▶️ Rodar programa em blocos': '▶️ Run Block-Based Program',
    '⏹️ Parar programa': '⏹️ Stop Program',
    '🔄 Reiniciar dispositivo': '🔄 Reboot Device',
    '🧹 Limpar tela': '🧹 Clear Console',
    'Bem-vindo à BitdogLab!': 'Welcome to BitDogLab!',
    'Aqui você vai aprender programação de forma divertida e criativa! Explore os blocos, crie seus próprios projetos e divirta-se programando.': 'Learn programming through hands-on, block-based experimentation. Explore the block library, build your own projects, and test them on the board.',
    'AVISO IMPORTANTE': 'IMPORTANT NOTICE',
    'A BitdogLab é uma parceria oficial do projeto BIPES (Block Based Integrated Platform for Embedded Systems).\n        Essa iniciativa visa democratizar o acesso à programação e robótica para crianças e jovens no Brasil.': 'BitDogLab is an official educational partner of the BIPES project (Block Based Integrated Platform for Embedded Systems). This initiative expands access to programming and robotics education for children and young learners in Brazil.',
    'A BitdogLab é uma parceria oficial do projeto BIPES (Block Based Integrated Platform for Embedded Systems). Essa iniciativa visa democratizar o acesso à programação e robótica para crianças e jovens no Brasil.': 'BitDogLab is an official educational partner of the BIPES project (Block Based Integrated Platform for Embedded Systems). This initiative expands access to programming and robotics education for children and young learners in Brazil.',
    'Através desta parceria, fornecemos uma plataforma educacional completa com hardware (placa BitdogLab baseada no Raspberry Pi Pico)\n        e software (ambiente de programação por blocos), tornando o aprendizado de programação mais acessível e divertido.': 'Through this partnership, we provide a complete educational platform that combines hardware, including the Raspberry Pi Pico-based BitDogLab board, with a block-based programming environment, making programming education more accessible and practical.',
    'Através desta parceria, fornecemos uma plataforma educacional completa com hardware (placa BitdogLab baseada no Raspberry Pi Pico) e software (ambiente de programação por blocos), tornando o aprendizado de programação mais acessível e divertido.': 'Through this partnership, we provide a complete educational platform that combines hardware, including the Raspberry Pi Pico-based BitDogLab board, with a block-based programming environment, making programming education more accessible and practical.',
    'Entendi!': 'Understood',
    'Como Começar': 'Getting Started',
    'Escolha blocos na paleta': 'Select blocks from the palette',
    'Arraste blocos da paleta à esquerda para a área de trabalho.': 'Drag blocks from the palette on the left into the workspace.',
    'Antes de começar, instale o MicroPython na sua placa. Você pode fazer isso via modo BOOTSEL clicando aqui.': 'Before you begin, install MicroPython on the board. You can do this through BOOTSEL mode by clicking here.',
    'Antes de começar, instale o MicroPython na sua placa. Você pode fazer isso via modo BOOTSEL': 'Before you begin, install MicroPython on the board. You can do this through BOOTSEL mode',
    'clicando aqui': 'clicking here',
    'Clique no botão de dispositivo e conecte sua placa via USB.': 'Click the device button and connect the board over USB.',
    'Monte os blocos como um quebra-cabeça para criar seu programa.': 'Assemble the blocks like a puzzle to define your program logic.',
    'Clique no botão de execução para enviar seu código para a placa.': 'Click the run button to upload the generated code to the board.',
    'Observe o console para ver a saída do seu programa e como a placa BitdogLab está respondendo.': 'Monitor the console output to inspect program execution and board responses.',
    'Vamos começar a programar:': 'Programming checklist:',
    'Vamos Programar!': 'Start Programming',
    'Veja o resultado': 'Inspect the output',
    'Use os blocos de controle, entradas e saídas para criar seu algoritmo': 'Use control, input, and output blocks to build your algorithm.',
    'Adicione blocos de leitura de sensores e controle de LEDs': 'Add sensor-reading blocks and LED control blocks.',
    'Bloco de Setup': 'Initialization Block',
    'Sons (execução única)': 'Audio Initialization (single execution)',
    'Como usar: Trocar emoji na Matriz de LED': 'How to use: Change emoji on the LED matrix',
    'Exemplo:': 'Example:',
    'do Display OLED para ver o número na tela!': 'in the OLED Display block to show the value on-screen!',
    'do Display OLED para ver a porcentagem na tela!': 'in the OLED Display block to show the percentage on-screen!',
    'Este bloco': 'This block',
    'sozinho não faz nada!': 'does nothing on its own!',
    'Encaixe-o no bloco': 'Place it inside the',
    'BitDogLab - Conheça sua Placa': 'BitDogLab - Board Reference',
    'Loop de Sons': 'Audio Loop',
    'Configuração estática concluída - LEDs fixos': 'Static configuration complete - fixed LEDs',
    'Loop Principal': 'Main Loop',
    'sobe intensidade': 'increase intensity',
    'desce intensidade': 'decrease intensity',
    'sobe frequência': 'increase frequency',
    'desce frequência': 'decrease frequency',
    'só toca se não foi silenciado': 'only play when not muted',
    'Linha divisória central': 'Center divider line',
    'Lado esquerdo — Sensor 1 (I2C1)': 'Left side - Sensor 1 (I2C1)',
    'Lado direito — Sensor 2 (I2C0)': 'Right side - Sensor 2 (I2C0)',
    'Fonte 3x5': '3x5 font',
    'Barra de notificações': 'Notification panel',
    'Selecione um exemplo:': 'Select an example:',
    'Conecte sua placa:': 'Connect your board:',
    'Montagem dos blocos:': 'Block assembly:',
    'Experimente sensores:': 'Try sensors:',
    'Salve seu projeto:': 'Save your project:',
    'prÃ³ximo:': 'next:',
    'anterior:': 'previous:',
    'por:': 'for:',
    'coluna inicial:': 'initial column:',
    '(vazio)': '(empty)',
    'â† Esquerda': 'â† Left',
    'â†’ Direita': 'â†’ Right',
    'â†‘ Cima': 'â†‘ Up',
    'â†“ Baixo': 'â†“ Down',
    'ðŸ”‡ Pausar por:': 'ðŸ”‡ Pause for:',
    'ðŸ”Š Tocar:': 'ðŸ”Š Play:',
    'ðŸ”´ A (Vermelho)': 'ðŸ”´ A (Red)',
    'Ã€ direita': 'Right',
    'Ã€ esquerda': 'Left',
    'Ao centro': 'Center',
    'Arco cosseno (acos)': 'Arc cosine (acos)',
    'Arco seno (asin)': 'Arc sine (asin)',
    'Arco tangente (atan)': 'Arc tangent (atan)',
    'arredondar': 'round',
    'arredondar para baixo': 'round down',
    'arredondar para cima': 'round up',
    'Brilho %': 'Brightness %',
    'Controla a frequÃªncia do buzzer com o joystick.\nIntervalo de frequÃªncia: 200â€“4000 Hz\nVolume: 0â€“100%\nPara mostrar o valor no display, use o bloco \'ðŸ•¹ï¸ FrequÃªncia Buzzer Hz\'.': 'Controls the buzzer frequency with the joystick.\nFrequency range: 200-4000 Hz\nVolume: 0-100%\nTo display the value on the OLED, use the \'ðŸ•¹ï¸ Buzzer Frequency Hz\' block.',
    'Cor RGB': 'RGB Color',
    'Cosseno (cos)': 'Cosine (cos)',
    'DivisÃ£o Temperatura': 'Temperature Quotient',
    'DivisÃ£o Umidade': 'Humidity Quotient',
    'Exponencial (e^)': 'Exponential (e^)',
    'Ficar assim por:': 'Hold for:',
    'Infinito (âˆž)': 'Infinity (âˆž)',
    'LEDs Acesos': 'Lit LEDs',
    'Logaritmo base 10 (log10)': 'Base-10 logarithm (log10)',
    'Logaritmo natural (ln)': 'Natural logarithm (ln)',
    'Maior nÃºmero': 'Largest number',
    'Menor nÃºmero': 'Smallest number',
    'Metade de Baixo': 'Bottom Half',
    'Metade de Cima': 'Top Half',
    'Milissegundos': 'Milliseconds',
    'MultiplicaÃ§Ã£o Temperatura': 'Temperature Product',
    'MultiplicaÃ§Ã£o Umidade': 'Humidity Product',
    'Nome da Cor': 'Color Name',
    'Nome do Desenho': 'Drawing Name',
    'O que fazer:': 'Action:',
    'Phi - RazÃ£o Ã¡urea (Ï†)': 'Phi - Golden ratio (Ï†)',
    'PotÃªncia de 10 (10^)': 'Power of 10 (10^)',
    'Segundos totais': 'Total seconds',
    'Segundos.ms': 'Seconds.ms',
    'Seno (sin)': 'Sine (sin)',
    'Soma': 'Sum',
    'Soma Temperatura': 'Temperature Sum',
    'Soma Umidade': 'Humidity Sum',
    'Status ON/OFF': 'ON/OFF Status',
    'SubtraÃ§Ã£o Temperatura': 'Temperature Difference',
    'SubtraÃ§Ã£o Umidade': 'Humidity Difference',
    'Tela Toda': 'Full Screen',
    'Temperatura 1': 'Temperature 1',
    'Temperatura 2': 'Temperature 2',
    'Todos': 'All',
    'Um item aleatÃ³rio': 'Random item',
    'Umidade 1': 'Humidity 1',
    'Umidade 2': 'Humidity 2',
    'Valor absoluto (sempre positivo)': 'Absolute value (always positive)',
    'baixo': 'down',
    'cima': 'up',
    'direita': 'right',
    'esquerda': 'left',
    'próximo:': 'next:',
    'anterior:': 'previous:',
    'por:': 'for:',
    'coluna inicial:': 'initial column:',
    '← Esquerda': '← Left',
    '→ Direita': '→ Right',
    '↑ Cima': '↑ Up',
    '↓ Baixo': '↓ Down',
    '🔇 Pausar por:': '🔇 Pause for:',
    '🔊 Tocar:': '🔊 Play:',
    '🔴 A (Vermelho)': '🔴 A (Red)',
    'À direita': 'Right',
    'À esquerda': 'Left',
    'Controla a frequência do buzzer com o joystick.\nIntervalo de frequência: 200–4000 Hz\nVolume: 0–100%\nPara mostrar o valor no display, use o bloco \'🕹️ Frequência Buzzer Hz\'.': 'Controls the buzzer frequency with the joystick.\nFrequency range: 200-4000 Hz\nVolume: 0-100%\nTo display the value on the OLED, use the \'🕹️ Buzzer Frequency Hz\' block.',
    'Divisão Temperatura': 'Temperature Quotient',
    'Divisão Umidade': 'Humidity Quotient',
    'Infinito (∞)': 'Infinity (∞)',
    'Maior número': 'Largest number',
    'Menor número': 'Smallest number',
    'Multiplicação Temperatura': 'Temperature Product',
    'Multiplicação Umidade': 'Humidity Product',
    'Phi - Razão áurea (φ)': 'Phi - Golden ratio (φ)',
    'Potência de 10 (10^)': 'Power of 10 (10^)',
    'Subtração Temperatura': 'Temperature Difference',
    'Subtração Umidade': 'Humidity Difference',
    'Um item aleatório': 'Random item',
    'Emite o sinal de socorro S.O.S. em código Morse (... --- ...)': 'Emits the S.O.S. distress signal in Morse code (... --- ...)',
    'Toca a melodia de Noite Feliz (Silent Night). Use com \'Repetir para sempre\' para loop infinito': 'Plays the Silent Night melody. Use with \'Repeat forever\' for an infinite loop.',
    'Toca a melodia de Bate o Sino (Deck the Halls). Use com \'Repetir para sempre\' para loop infinito': 'Plays the Deck the Halls melody. Use with \'Repeat forever\' for an infinite loop.',
    'Toca a melodia de Ó Vinde (Adeste Fideles). Use com \'Repetir para sempre\' para loop infinito': 'Plays the O Come, All Ye Faithful melody. Use with \'Repeat forever\' for an infinite loop.',
    '  pr\u00f3ximo:': '  next:',
    '  anterior:': '  previous:',
    '  por:': '  for:',
    '  coluna inicial:': '  initial column:',
    '\u2190 Esquerda': '\u2190 Left',
    '\u2192 Direita': '\u2192 Right',
    '\u2191 Cima': '\u2191 Up',
    '\u2193 Baixo': '\u2193 Down',
    '\ud83d\udd07 Pausar por:': '\ud83d\udd07 Pause for:',
    '\ud83d\udd0a Tocar:': '\ud83d\udd0a Play:',
    '\ud83d\udd34 A (Vermelho)': '\ud83d\udd34 A (Red)',
    '\u00c0 direita': 'Right',
    '\u00c0 esquerda': 'Left',
    'Controla a frequ\u00eancia do buzzer com o joystick.\nIntervalo de frequ\u00eancia: 200\u20134000 Hz\nVolume: 0\u2013100%\nPara mostrar o valor no display, use o bloco \'\ud83d\udd79\ufe0f Frequ\u00eancia Buzzer Hz\'.': 'Controls the buzzer frequency with the joystick.\nFrequency range: 200-4000 Hz\nVolume: 0-100%\nTo display the value on the OLED, use the \'\ud83d\udd79\ufe0f Buzzer Frequency Hz\' block.',
    'Divis\u00e3o Temperatura': 'Temperature Quotient',
    'Divis\u00e3o Umidade': 'Humidity Quotient',
    'Infinito (\u221e)': 'Infinity (\u221e)',
    'Maior n\u00famero': 'Largest number',
    'Menor n\u00famero': 'Smallest number',
    'Multiplica\u00e7\u00e3o Temperatura': 'Temperature Product',
    'Multiplica\u00e7\u00e3o Umidade': 'Humidity Product',
    'Phi - Raz\u00e3o \u00e1urea (\u03c6)': 'Phi - Golden ratio (\u03c6)',
    'Pot\u00eancia de 10 (10^)': 'Power of 10 (10^)',
    'Subtra\u00e7\u00e3o Temperatura': 'Temperature Difference',
    'Subtra\u00e7\u00e3o Umidade': 'Humidity Difference',
    'Um item aleat\u00f3rio': 'Random item'
  }
};

Code.ensureMessages = function() {
  if (typeof MSG !== 'object') {
    return;
  }
  Object.assign(MSG, Code.APP_MESSAGES[Code.LANG] || Code.APP_MESSAGES['pt-br']);
};

Code.getProjectLabel = function(project) {
  var keys = {
    basico: 'projectBasic',
    robo: 'projectRobot',
    estufa: 'projectGreenhouse'
  };
  return MSG[keys[project]] || project;
};

Code.escapeRegex = function(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

Code.getLanguageCodeLabel = function(lang) {
  return lang === 'en' ? (MSG.languageCodeEn || 'EN') : (MSG.languageCodePt || 'PT');
};

Code.getCustomTranslationMap = function() {
  var base = {};
  if (window.BITDOGLAB_CUSTOM_TRANSLATIONS && window.BITDOGLAB_CUSTOM_TRANSLATIONS[Code.LANG]) {
    Object.assign(base, window.BITDOGLAB_CUSTOM_TRANSLATIONS[Code.LANG]);
  }
  if (Code.CUSTOM_OVERRIDES[Code.LANG]) {
    Object.assign(base, Code.CUSTOM_OVERRIDES[Code.LANG]);
  }
  return base;
};

Code.translateText = function(text) {
  if (typeof text !== 'string' || Code.LANG === 'pt-br') {
    return text;
  }

  var map = Code.getCustomTranslationMap();
  if (map[text] !== undefined) {
    return map[text];
  }

  var leading = text.match(/^\s*/);
  var trailing = text.match(/\s*$/);
  var prefix = leading ? leading[0] : '';
  var suffix = trailing ? trailing[0] : '';
  var core = text.slice(prefix.length, text.length - suffix.length);

  if (map[core] !== undefined) {
    return prefix + map[core] + suffix;
  }

  var keys = Object.keys(map).sort(function(a, b) {
    return b.length - a.length;
  });
  var replaced = core;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (replaced.indexOf(key) === -1) {
      continue;
    }

    if (/^[\p{L}\p{N}_]+$/u.test(key)) {
      if (key.length < 4) {
        continue;
      }
      var standalonePattern = new RegExp('(^|[^\\p{L}\\p{N}_])(' + Code.escapeRegex(key) + ')(?=$|[^\\p{L}\\p{N}_])', 'gu');
      replaced = replaced.replace(standalonePattern, function(match, prefix) {
        return prefix + map[key];
      });
    } else {
      replaced = replaced.split(key).join(map[key]);
    }
  }
  return prefix + replaced + suffix;
};

Code.translateDom = function(root) {
  if (!root || Code.LANG === 'pt-br') {
    return;
  }

  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (!node.parentElement) {
        return NodeFilter.FILTER_REJECT;
      }
      var tag = node.parentElement.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  var currentNode;
  while ((currentNode = walker.nextNode())) {
    currentNode.nodeValue = Code.translateText(currentNode.nodeValue);
  }

  var attrs = ['title', 'placeholder', 'alt', 'aria-label'];
  var nodes = root.querySelectorAll ? root.querySelectorAll('*') : [];
  for (var n = 0; n < nodes.length; n++) {
    for (var a = 0; a < attrs.length; a++) {
      if (nodes[n].hasAttribute(attrs[a])) {
        nodes[n].setAttribute(attrs[a], Code.translateText(nodes[n].getAttribute(attrs[a])));
      }
    }
  }
};

Code.translateToolboxXml = function(xml) {
  if (!xml || Code.LANG === 'pt-br') {
    return xml;
  }

  var categories = xml.getElementsByTagName('category');
  for (var i = 0; i < categories.length; i++) {
    var name = categories[i].getAttribute('name');
    if (name) {
      categories[i].setAttribute('name', Code.translateText(name));
    }
  }
  var labels = xml.getElementsByTagName('label');
  for (var j = 0; j < labels.length; j++) {
    var text = labels[j].getAttribute('text');
    if (text) {
      labels[j].setAttribute('text', Code.translateText(text));
    }
  }
  return xml;
};

Code.translateGeneratedCode = function(code) {
  if (Code.LANG !== 'en' || typeof code !== 'string') {
    return code;
  }

  return code.split('\n').map(function(line) {
    var match = line.match(/^(.*?#\s*)(.*)$/);
    return match ? match[1] + Code.translateText(match[2]) : line;
  }).join('\n');
};

Code.refreshLanguageUI = function() {
  var button = document.getElementById('languageButton');
  var label = document.getElementById('languageButtonLabel');
  var panelTitle = document.getElementById('languagePanelTitle');
  var ptLabel = document.getElementById('languageOptionPtLabel');
  var enLabel = document.getElementById('languageOptionEnLabel');
  var options = document.querySelectorAll('.language-option');

  if (button) {
    button.title = MSG.languageTooltip || 'Change language.';
  }
  if (label) {
    label.textContent = Code.getLanguageCodeLabel(Code.LANG);
  }
  if (panelTitle) {
    panelTitle.textContent = MSG.languagePanelTitle || 'Interface language';
  }
  if (ptLabel) {
    ptLabel.textContent = MSG.languagePortuguese || 'Português (Brasil)';
  }
  if (enLabel) {
    enLabel.textContent = MSG.languageEnglish || 'English';
  }
  for (var i = 0; i < options.length; i++) {
    var lang = options[i].getAttribute('data-lang');
    options[i].classList.toggle('active', lang === Code.LANG);
  }
};

Code.bindLanguageControls = function() {
  var options = document.querySelectorAll('.language-option');
  for (var i = 0; i < options.length; i++) {
    if (!options[i].dataset.i18nBound) {
      options[i].dataset.i18nBound = 'true';
      options[i].addEventListener('click', function() {
        Code.changeLanguage(this.getAttribute('data-lang'));
      });
    }
  }
  Code.refreshLanguageUI();
};

Code.patchBlocklyI18n = function() {
  if (!window.Blockly || Code._blocklyI18nPatched) {
    return;
  }

  var appendField = Blockly.Input.prototype.appendField;
  Blockly.Input.prototype.appendField = function(field, name) {
    if (typeof field === 'string') {
      field = Code.translateText(field);
    }
    return appendField.call(this, field, name);
  };

  var setTooltip = Blockly.Block.prototype.setTooltip;
  Blockly.Block.prototype.setTooltip = function(newTip) {
    if (typeof newTip === 'string') {
      newTip = Code.translateText(newTip);
    }
    return setTooltip.call(this, newTip);
  };

  var OriginalDropdown = Blockly.FieldDropdown;
  Blockly.FieldDropdown = function(menuGenerator, validator) {
    if (Array.isArray(menuGenerator)) {
      menuGenerator = menuGenerator.map(function(entry) {
        if (Array.isArray(entry) && typeof entry[0] === 'string') {
          return [Code.translateText(entry[0]), entry[1]];
        }
        return entry;
      });
    }
    return new OriginalDropdown(menuGenerator, validator);
  };
  Blockly.FieldDropdown.prototype = OriginalDropdown.prototype;
  Object.setPrototypeOf(Blockly.FieldDropdown, OriginalDropdown);

  var OriginalTextInput = Blockly.FieldTextInput;
  Blockly.FieldTextInput = function(text, validator, config) {
    if (typeof text === 'string') {
      text = Code.translateText(text);
    }
    return new OriginalTextInput(text, validator, config);
  };
  Blockly.FieldTextInput.prototype = OriginalTextInput.prototype;
  Object.setPrototypeOf(Blockly.FieldTextInput, OriginalTextInput);

  Code._blocklyI18nPatched = true;
};

(function() {
  Code.ensureMessages();
  Code.patchBlocklyI18n();

  var nativeAlert = window.alert.bind(window);
  window.alert = function(message) {
    nativeAlert(Code.translateText(String(message)));
  };
})();
