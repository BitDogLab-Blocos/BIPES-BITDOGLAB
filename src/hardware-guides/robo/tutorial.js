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
        robotTitle: 'Assemble the mobile robot in stages',
        robotArticleIntro: 'In this activity, BitDogLab controls four motors. The TB6612FNG H-bridge receives commands from the board and moves the wheels. The MPU6050 sensor detects the robot’s acceleration and rotation. Because this assembly has more wires, complete and check one stage before starting the next.',
        robotGoalTitle: 'Assembly goal',
        robotGoalText: 'Assemble the chassis, connect the motors to the H-bridge, connect the H-bridge and MPU6050 to BitDogLab, and perform a safe first test.',
        robotMaterialsTitle: 'Prepare these materials',
        robotMaterial1: '1 BitDogLab with battery and 1 USB cable;',
        robotMaterial2: '1 chassis, 4 DC motors and 4 wheels;',
        robotMaterial3: '1 TB6612FNG H-bridge and 1 MPU6050 sensor;',
        robotMaterial4: 'Adapter PCBs and polarized ribbon cable, or the wires listed in this manual;',
        robotMaterial5: 'Tools suitable for the chassis, such as a screwdriver, and material to secure and insulate wires.',
        robotMountedAlt: 'Assembled mobile robot with BitDogLab installed',
        robotMountedCaption: 'Complete robot with BitDogLab installed over the four-wheel chassis.',
        robotPartsTitle: 'Understand the purpose of each part',
        robotPartsText: 'The motors form two groups: left and right. The H-bridge is a power controller: it receives BitDogLab signals and sets the speed and rotation direction of each side. MPU6050 is a motion sensor connected to an upper I2C connector.',
        robotPowerIntegrated: 'The battery and voltage/current measurement are part of BitDogLab. Do not look for these as separate modules.',
        robotElectronicsAlt: 'H-bridge and MPU6050 installed on the chassis',
        robotElectronicsCaption: 'H-bridge and MPU6050 using the laboratory adapter PCBs.',
        robotChassisAlt: 'Chassis with four motors and electronic modules',
        robotChassisCaption: 'Chassis view with the four motors separated into two sides.',
        robotPcbRecommendationTitle: 'Recommended assembly',
        robotPcbRecommendationText: 'Use the adapter PCBs and 14-pin IDC ribbon cable when available. The polarized connector has one correct insertion direction and groups several wires in one cable. This makes the assembly simpler and more organized. Make all connections with BitDogLab powered off.',
        manualRobotTitle: 'Individual-wire option without the PCBs',
        manualRobotText: 'Use individual wires between the H-bridge and BitDogLab lower bus. Keep the board powered off and USB disconnected. Start with the three power connections — VM, VCC and GND — then make the seven control-signal connections. Read each pin label and mark a table row after checking the connection.',
        driverPin: 'TB6612FNG pin', boardPin: 'BitDogLab', purpose: 'Purpose',
        motorPower: 'Motor power from the board', logicPower: 'Logic power', ground: 'Common ground',
        leftDirection1: 'Channel A direction — input 1', leftDirection2: 'Channel A direction — input 2', leftSpeed: 'Channel A speed',
        rightDirection1: 'Channel B direction — input 1', rightDirection2: 'Channel B direction — input 2', rightSpeed: 'Channel B speed',
        standby: 'Enables the H-bridge',
        motorsTitle: 'Stage 1 — Connect the four motors',
        motorIndependenceText: 'Separate the motors into two groups: two on the left and two on the right. Connect the left group to AO1 and AO2, and the right group to BO1 and BO2. Both motors on each side must share the same two connection points; this is a parallel connection. If only one motor turns backward during testing, power the board off and swap that motor’s two wires.',
        driverOutput: 'H-bridge output', motorGroup: 'Motors', howConnect: 'Connection',
        leftMotors: 'Two left-side motors', rightMotors: 'Two right-side motors', parallel: 'In parallel',
        motorWireWarning: 'Warning: Dupont jumpers are suitable for control signals. For motors and power, use heavier wire that is securely attached with exposed metal insulated.',
        mpuTitle: 'Stage 2 — Connect the MPU6050 sensor',
        mpuIntro: 'Choose either upper I2C connector. Connect VCC, GND, SDA and SCL using only the pins from that connector. The system finds the sensor automatically. Do not mix SDA from one connector with SCL from the other.',
        mpuPin: 'MPU6050 pin', or: 'or',
        robotProcedureTitle: 'Stage 3 — Check and perform the first test',
        robotProcedure1: 'With the board still powered off, confirm VM to 5V, VCC to 3V3 and GND to GND.',
        robotProcedure2: 'Check the seven H-bridge control signals one row at a time.',
        robotProcedure3: 'Gently pull each wire to make sure it is secure. No exposed metal should touch a neighboring pin.',
        robotProcedure4: 'Support the chassis safely so all four wheels are clear of the table.',
        robotProcedure5: 'Power the board and test the motors at low speed. Power off immediately if a wire heats up, an unusual smell appears or movement is unexpected.',
        robotCheckTitle: 'How to know it worked',
        robotCheckText: 'In the first test, both wheels on each side should turn in the same direction and respond to the speed command. The program should also recognize MPU6050 without showing a disconnected-sensor warning.',
        robotTroubleText: 'If something does not work: power the board off before touching the wires. If one motor turns backward, swap its two wires. If an entire side does not move, check outputs A or B and their control signals. If MPU6050 is not found, check VCC, GND and the SDA/SCL pair.'
      }
    }
  });
})(window.DeviceHardwareGuides);
