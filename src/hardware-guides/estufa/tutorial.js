(function (registry) {
  'use strict';

  registry.register({
    id: 'estufa',
    order: 2,
    template: '../hardware-guides/estufa/tutorial.html',
    menu: {
      'pt-br': {title: 'Estufa com AHT20', description: 'Temperatura e umidade'},
      en: {title: 'AHT20 greenhouse', description: 'Temperature and humidity'}
    },
    translations: {
      en: {
        greenhouseEyebrow: 'GREENHOUSE PROJECT',
        greenhouseTitle: 'Measuring temperature and humidity with AHT20',
        greenhouseArticleIntro: 'This project uses the AHT20 to measure air temperature and humidity. It communicates with BitDogLab over I2C and needs only four connections: power, ground, data and clock.',
        whatIsAhtTitle: 'What is the AHT20?',
        whatIsAhtText: 'AHT20 is a digital sensor that measures temperature and humidity in one module. Its readings can be shown on the display or used by logic blocks.',
        ahtPinsText: 'The module has VCC, GND, SDA and SCL pins. Pin order may vary by manufacturer, so follow the printed labels rather than relying only on wire order or color in a photo.',
        ahtPhotoAlt: 'AHT20 temperature and humidity sensor',
        ahtPhotoCaption: 'AHT20 sensor used in the greenhouse project.',
        pcbRecommendationTitle: 'Recommended assembly: adapter PCB and polarized cable',
        pcbRecommendationText: 'The project uses and recommends an adapter PCB with polarized cables. The PCB organizes all four signals, and the polarized connector only fits in the correct orientation. This reduces the chance of reversing 3V3 and GND, misplacing a signal or causing a short circuit.',
        withoutPcbTitle: 'If you do not have the PCB',
        withoutPcbAhtText: 'The same connection can be made with four female-to-female Dupont jumpers. Keep BitDogLab powered off and connect each AHT20 pin to the matching signal on either upper I2C connector.',
        ahtPin: 'AHT20 pin', boardPin: 'BitDogLab pin', purpose: 'Purpose',
        logicPower: 'Sensor power', ground: 'Ground', i2cData: 'I2C data', i2cClock: 'I2C clock',
        ahtBusChoice: 'You may connect the AHT20 to either I2C connector. The system searches both buses and recognizes the sensor automatically. If the project uses two AHT20 modules, the blocks identify I2C1 — SDA GP2 and SCL GP3 — as Sensor 1, and I2C0 — SDA GP0 and SCL GP1 — as Sensor 2. Keep SDA and SCL on the same bus for each sensor.',
        ahtDiagramAlt: 'AHT20 connection: SCL to SCL, SDA to SDA, VCC to 3V3 and GND to GND',
        diagramCaption: 'The image shows the jumper alternative. Use the table above as the primary reference for checking each pin.',
        assemblyOrderTitle: 'Assembly order',
        ahtProcedure1: 'Power BitDogLab off and disconnect the USB cable.',
        ahtProcedure2: 'Locate VCC, GND, SDA and SCL on the AHT20.',
        ahtProcedure3: 'Choose one upper I2C connector and attach the four jumpers according to the table.',
        ahtProcedure4: 'Double-check 3V3 and GND before powering the board.',
        ahtProcedure5: 'Connect the board and test it with the temperature and humidity blocks.'
      }
    }
  });
})(window.DeviceHardwareGuides);
