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
        greenhouseTitle: 'Assemble and test the AHT20 sensor',
        greenhouseArticleIntro: 'BitDogLab uses the AHT20 to measure air temperature and humidity. After assembly, both readings can be viewed in the program or on the board display.',
        greenhouseGoalTitle: 'Assembly goal',
        greenhouseGoalText: 'Connect the AHT20 to BitDogLab with four wires and verify that the sensor sends temperature and humidity readings.',
        greenhouseMaterialsTitle: 'Prepare these materials',
        greenhouseMaterial1: '1 BitDogLab board and 1 USB cable;',
        greenhouseMaterial2: '1 AHT20 sensor;',
        greenhouseMaterial3: '1 adapter PCB with polarized cable or 4 female-to-female Dupont jumpers.',
        whatIsAhtTitle: 'What is the AHT20?',
        whatIsAhtText: 'AHT20 measures two things: air temperature and humidity, which indicates the amount of water vapor in the air. Blocks in the Sensors category read these values.',
        ahtPinsText: 'The sensor has four pins: VCC receives power, GND completes the circuit, SDA carries data and SCL sets the communication timing. Pin order may vary by manufacturer, so read the labels printed on your sensor.',
        ahtPhotoAlt: 'AHT20 temperature and humidity sensor',
        ahtPhotoCaption: 'AHT20 sensor used in the greenhouse project.',
        pcbRecommendationTitle: 'Recommended assembly',
        pcbRecommendationText: 'Use the adapter PCB and polarized cable when available. The connector has one correct insertion direction, making assembly faster and reducing the risk of swapped wires. With the board powered off, fit the sensor to the PCB and connect the cable to an upper I2C connector on BitDogLab.',
        withoutPcbTitle: 'Jumper option without the PCB',
        withoutPcbAhtText: 'Use four female-to-female Dupont jumpers. With BitDogLab powered off and USB disconnected, connect every AHT20 pin to the matching pin on an upper I2C connector. Make one connection at a time and mark each checked table row.',
        ahtPin: 'AHT20 pin', boardPin: 'BitDogLab pin', purpose: 'Purpose',
        logicPower: 'Sensor power', ground: 'Ground', i2cData: 'I2C data', i2cClock: 'I2C clock',
        ahtBusChoice: 'Which connector should you choose? For one sensor, choose either upper I2C connector and keep all four wires together on it. The system finds AHT20 automatically. In an activity with two sensors, I2C1 — SDA GP2 and SCL GP3 — is Sensor 1, and I2C0 — SDA GP0 and SCL GP1 — is Sensor 2.',
        ahtDiagramAlt: 'AHT20 connection: SCL to SCL, SDA to SDA, VCC to 3V3 and GND to GND',
        diagramCaption: 'The image shows the jumper alternative. Use the table above as the primary reference for checking each pin.',
        assemblyOrderTitle: 'Step by step',
        ahtProcedure1: 'Power BitDogLab off and disconnect the USB cable.',
        ahtProcedure2: 'Find the VCC, GND, SDA and SCL labels on AHT20.',
        ahtProcedure3: 'Choose an upper I2C connector and make the four table connections one at a time.',
        ahtProcedure4: 'Before powering on, check again that VCC is connected to 3V3 and GND to GND.',
        ahtProcedure5: 'Connect USB, open the platform and use the temperature and humidity blocks to take a reading.',
        greenhouseCheckTitle: 'How to know it worked',
        greenhouseCheckText: 'The assembly is correct when the platform shows numeric temperature and humidity readings without a disconnected-sensor warning. Hold your hand near the sensor for a few seconds: the temperature may change slowly.',
        greenhouseTroubleText: 'If no reading appears: power the board off, remove USB and check all four wires. Check VCC and GND first, then confirm that SDA and SCL belong to the same I2C connector.'
      }
    }
  });
})(window.DeviceHardwareGuides);
