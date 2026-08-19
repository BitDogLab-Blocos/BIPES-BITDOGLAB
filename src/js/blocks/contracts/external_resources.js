// Shared physical-resource registry for external and fixed-board peripherals.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var PERIPHERALS = [
    {
      id: 'external-led',
      labels: {
        'pt-br': 'módulo de LED colorido',
        en: 'colour LED module'
      },
      blockTypes: [
        'led_externo_ligar',
        'led_externo_desligar',
        'led_externo_piscar_rapido',
        'led_externo_piscar_lento',
        'led_externo_desligar_todos'
      ],
      connectionFields: ['DIG'],
      channelField: 'CHANNEL',
      moduleLimit: 1,
      claimAllConnections: true,
      claimAllBlockTypes: ['led_externo_desligar_todos'],
      configKey: 'EXTERNAL_LED'
    },
    {
      id: 'external-contact',
      labels: {
        'pt-br': 'contato externo',
        en: 'external contact'
      },
      blockTypes: [
        'external_contact_when_closed',
        'external_contact_is_closed',
        'external_contact_test_matrix'
      ],
      connectionFields: ['DIG'],
      claimAllConnections: true,
      claimAllBlockTypes: ['external_contact_test_matrix'],
      configKey: 'EXTERNAL_CONTACT'
    },
    {
      id: 'dht11',
      labels: {
        'pt-br': 'sensor de temperatura e umidade (DHT11)',
        en: 'temperature and humidity sensor (DHT11)'
      },
      blockTypes: [
        'dht11_temperatura',
        'dht11_umidade'
      ],
      connectionFields: ['DIG']
    },
    {
      id: 'servo',
      labels: {
        'pt-br': 'servo',
        en: 'servo'
      },
      blockTypes: [
        'servo_mover',
        'servo_angulo_atual',
        'servo_joystick_controlar',
        'servo_subir_gradualmente',
        'servo_descer_gradualmente'
      ],
      connectionFields: ['DIG']
    },
    {
      id: 'aht20-i2c',
      labels: {
        'pt-br': 'sensor AHT20',
        en: 'AHT20 sensor'
      },
      blockTypes: [
        'sensor_temperatura',
        'sensor_umidade',
        'sensor_estufa_comparar',
        'estufa_plotar',
        'verificar_conexao_sensor'
      ],
      i2cPairType: 'sensor-auto'
    },
    {
      id: 'mpu6050-i2c',
      labels: {
        'pt-br': 'sensor MPU6050 do robô',
        en: 'robot MPU6050 sensor'
      },
      blockTypes: [
        'robo_inicializar',
        'robo_frente',
        'robo_tras',
        'robo_girar',
        'robo_parar',
        'robo_joystick',
        'robo_giro_valor',
        'robo_aceleracao_x',
        'robo_aceleracao_y',
        'robo_aceleracao_z',
        'robo_transferidor_360'
      ],
      i2cPairType: 'robot'
    },
    {
      id: 'ina226-i2c',
      labels: {
        'pt-br': 'medidor de tensão e corrente da bateria',
        en: 'battery voltage and current meter'
      },
      blockTypes: [
        'robo_tensao_bateria',
        'robo_corrente_robo'
      ],
      i2cPairType: 'ina226'
    }
  ];

  function getPeripheral(blockType) {
    for (var i = 0; i < PERIPHERALS.length; i++) {
      if (PERIPHERALS[i].blockTypes.indexOf(blockType) !== -1) {
        return PERIPHERALS[i];
      }
    }
    return null;
  }

  function getConnectionPin(config, connection) {
    var external = config && config.EXTERNAL;
    var pins = external && external.DIG_PINS;
    if (!pins || pins[String(connection)] === undefined) return null;
    return pins[String(connection)];
  }

  function addI2cPair(pairs, seen, bus, sda, scl) {
    if (sda === undefined || scl === undefined) return;
    var key = String(sda) + ':' + String(scl);
    if (seen[key]) return;
    seen[key] = true;
    pairs.push({ bus: bus, sda: sda, scl: scl });
  }

  // These components automatically try one or both I2C connectors. Claiming
  // every possible pair is intentional: the workspace cannot know where the
  // learner physically plugged the component.
  function getI2cPairs(config, pairType) {
    var pairs = [];
    var seen = {};
    var pins = config.PINS || {};
    var sensor = config.SENSOR || {};
    var robot = config.ROBOT || {};
    var power = config.ROBOT_POWER || {};

    if (pairType === 'sensor-auto') {
      addI2cPair(
        pairs,
        seen,
        sensor.I2C_BUS,
        pins.I2C0_SDA !== undefined ? pins.I2C0_SDA : pins.I2C_SDA,
        pins.I2C0_SCL !== undefined ? pins.I2C0_SCL : pins.I2C_SCL
      );
      if (pins.I2C0_SDA !== undefined && pins.I2C0_SCL !== undefined &&
          pins.I2C_SDA !== undefined && pins.I2C_SCL !== undefined) {
        addI2cPair(
          pairs,
          seen,
          sensor.I2C_BUS_ALT !== undefined ? sensor.I2C_BUS_ALT : 1,
          pins.I2C_SDA,
          pins.I2C_SCL
        );
      }
    } else if (pairType === 'robot') {
      addI2cPair(pairs, seen, robot.MPU_I2C_BUS, robot.MPU_I2C_SDA, robot.MPU_I2C_SCL);
      addI2cPair(pairs, seen, robot.MPU_I2C_BUS_ALT, robot.MPU_I2C_SDA_ALT, robot.MPU_I2C_SCL_ALT);
    } else if (pairType === 'ina226') {
      addI2cPair(pairs, seen, power.INA226_I2C_BUS, power.INA226_I2C_SDA, power.INA226_I2C_SCL);
    }

    return pairs;
  }

  function getI2cClaims(block, config, peripheral) {
    var claims = [];
    var pairs = getI2cPairs(config, peripheral.i2cPairType);
    var seenPins = {};

    for (var pairIndex = 0; pairIndex < pairs.length; pairIndex++) {
      var pair = pairs[pairIndex];
      var pairPins = [pair.sda, pair.scl];
      for (var pinIndex = 0; pinIndex < pairPins.length; pinIndex++) {
        var pin = pairPins[pinIndex];
        var pinKey = String(pin);
        if (seenPins[pinKey]) continue;
        seenPins[pinKey] = true;
        claims.push({
          block: block,
          peripheralId: peripheral.id,
          peripheralLabel: peripheral.labels[Code.LANG || 'pt-br'] || peripheral.labels['pt-br'],
          field: 'I2C',
          connection: pinKey,
          pin: pin,
          resourceKey: 'gpio:' + pinKey,
          internalI2c: true,
          i2cBus: pair.bus
        });
      }
    }

    return claims;
  }

  function getClaims(block, config) {
    var peripheral = getPeripheral(block && block.type);
    if (!peripheral || !block || !block.getFieldValue) return [];

    if (peripheral.i2cPairType) {
      return getI2cClaims(block, config, peripheral);
    }

    var claims = [];
    if (peripheral.claimAllConnections &&
        peripheral.claimAllBlockTypes &&
        peripheral.claimAllBlockTypes.indexOf(block.type) !== -1) {
      var peripheralConfig = config.EXTERNAL && config.EXTERNAL[peripheral.configKey] || {};
      var allConnections = peripheralConfig.ALLOWED_DIG ||
        Object.keys((config.EXTERNAL && config.EXTERNAL.DIG_PINS) || {});
      for (var allIndex = 0; allIndex < allConnections.length; allIndex++) {
        var allConnection = String(allConnections[allIndex]);
        var allPin = getConnectionPin(config, allConnection);
        if (allPin === null) continue;
        claims.push({
          block: block,
          peripheralId: peripheral.id,
          peripheralLabel: peripheral.labels[Code.LANG || 'pt-br'] || peripheral.labels['pt-br'],
          field: 'DIG',
          connection: allConnection,
          pin: allPin,
          resourceKey: 'gpio:' + String(allPin)
        });
      }
      return claims;
    }

    for (var i = 0; i < peripheral.connectionFields.length; i++) {
      var field = peripheral.connectionFields[i];
      var connection = block.getFieldValue(field);
      if (connection === null || connection === undefined || connection === '') continue;

      var pin = getConnectionPin(config, connection);
      if (pin === null) continue;

      claims.push({
        block: block,
        peripheralId: peripheral.id,
        peripheralLabel: peripheral.labels[Code.LANG || 'pt-br'] || peripheral.labels['pt-br'],
        field: field,
        connection: String(connection),
        pin: pin,
        resourceKey: 'gpio:' + String(pin)
      });
    }
    return claims;
  }

  Code.ExternalResources = {
    VERSION: '2026-08-19-external-contacts-i2c',
    peripherals: PERIPHERALS,
    getPeripheral: getPeripheral,
    getClaims: getClaims
  };
})(window);
