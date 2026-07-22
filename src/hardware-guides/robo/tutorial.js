(function (registry) {
  'use strict';

  registry.register({
    id: 'robo',
    order: 3,
    template: '../hardware-guides/robo/tutorial.html',
    menu: {
      'pt-br': {title: 'Robô móvel', description: 'Ponte H, motores e MPU6050'},
      en: {title: 'Mobile robot', description: 'H-bridge, motors and MPU6050'}
    },
    translations: {
      en: {
        robotEyebrow: 'MOBILE ROBOT PROJECT',
        robotTitle: 'Assembling the mobile robot',
        robotArticleIntro: 'The robot uses four DC motors, a TB6612FNG H-bridge to control them, and an MPU6050 to measure acceleration and rotation. BitDogLab is the main board and already includes the battery and electrical monitoring required by the project.',
        robotMountedAlt: 'Assembled mobile robot with BitDogLab installed',
        robotMountedCaption: 'Complete robot with BitDogLab installed over the four-wheel chassis.',
        robotPartsTitle: 'How the assembly is organized',
        robotPartsText: 'The four motors form two groups: two on the left and two on the right. The H-bridge receives commands from BitDogLab and controls each side’s direction and speed. MPU6050 connects to an upper I2C port and provides angular-control measurements.',
        robotPowerIntegrated: 'The battery and voltage/current sensor are already on BitDogLab. They do not need to be purchased or connected as separate modules.',
        robotElectronicsAlt: 'H-bridge and MPU6050 installed on the chassis',
        robotElectronicsCaption: 'H-bridge and MPU6050 using the laboratory adapter PCBs.',
        robotChassisAlt: 'Chassis with four motors and electronic modules',
        robotChassisCaption: 'Chassis view with the four motors separated into two sides.',
        robotPcbRecommendationTitle: 'Recommended assembly: PCBs and polarized ribbon cable',
        robotPcbRecommendationText: 'In the lab assembly, adapter PCBs and the polarized 14-pin IDC ribbon cable group the connections and prevent reversed insertion. We recommend this arrangement because it is safer, cleaner and more durable for classroom use.',
        manualRobotTitle: 'Manual assembly without the PCBs',
        manualRobotText: 'If the PCBs are unavailable, use individual jumpers between the H-bridge and BitDogLab lower bus. Do not use a wire illustration as your only reference: read every pin name on the module and follow the table one row at a time.',
        driverPin: 'TB6612FNG pin', boardPin: 'BitDogLab', purpose: 'Purpose',
        motorPower: 'Motor power from the board', logicPower: 'Logic power', ground: 'Common ground',
        leftDirection1: 'Channel A direction — input 1', leftDirection2: 'Channel A direction — input 2', leftSpeed: 'Channel A speed',
        rightDirection1: 'Channel B direction — input 1', rightDirection2: 'Channel B direction — input 2', rightSpeed: 'Channel B speed',
        standby: 'Enables the H-bridge',
        motorsTitle: 'Connecting the four motors',
        motorIndependenceText: 'A DC motor has no fixed operating polarity: swapping both wires only reverses rotation. Connect the two left motors in parallel to AO1 and AO2, and the two right motors in parallel to BO1 and BO2. Keep both motors on each side oriented alike. If only one turns backward, swap that motor’s two wires.',
        driverOutput: 'H-bridge output', motorGroup: 'Motors', howConnect: 'Connection',
        leftMotors: 'Two left-side motors', rightMotors: 'Two right-side motors', parallel: 'In parallel',
        motorWireWarning: 'Use Dupont jumpers for control signals. For motors and power, use heavier wire with firm, insulated terminals.',
        mpuTitle: 'Connecting the MPU6050',
        mpuIntro: 'The MPU6050 uses four jumpers and may be connected to either upper I2C connector. The system checks both buses, automatically recognizes where the module is connected and works the same way on either one. Use one complete pair from the table.',
        mpuPin: 'MPU6050 pin', or: 'or',
        robotProcedureTitle: 'Before the first test',
        robotProcedure1: 'Install every wire with BitDogLab powered off.',
        robotProcedure2: 'Confirm VM is on 5V, VCC is on 3V3 and all grounds are common.',
        robotProcedure3: 'Check all seven H-bridge control signals against the table.',
        robotProcedure4: 'Check for loose wires or terminals touching neighboring pins.',
        robotProcedure5: 'For the first test, raise the wheels off the surface and use a low speed.'
      }
    }
  });
})(window.DeviceHardwareGuides);
