// Shared physical-resource registry for external peripherals.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var PERIPHERALS = [
    {
      id: 'dht11',
      labels: {
        'pt-br': 'DHT11',
        en: 'DHT11'
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

  function getClaims(block, config) {
    var peripheral = getPeripheral(block && block.type);
    if (!peripheral || !block || !block.getFieldValue) return [];

    var claims = [];
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
    VERSION: '2026-08-14-external-resources',
    peripherals: PERIPHERALS,
    getPeripheral: getPeripheral,
    getClaims: getClaims
  };
})(window);
