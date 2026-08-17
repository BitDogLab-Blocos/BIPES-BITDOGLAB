// Shared physical-resource registry for external peripherals.
'use strict';

(function(global) {
  var Code = global.Code || (global.Code = {});

  var PERIPHERALS = [
    {
      id: 'external-led',
      labels: {
        'pt-br': 'LED RGB externo',
        en: 'external RGB LED'
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
      claimAllConnections: true
    },
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
    if (peripheral.claimAllConnections && block.type === 'led_externo_desligar_todos') {
      var allConnections = (config.EXTERNAL && config.EXTERNAL.EXTERNAL_LED || {}).ALLOWED_DIG ||
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
    VERSION: '2026-08-14-external-resources',
    peripherals: PERIPHERALS,
    getPeripheral: getPeripheral,
    getClaims: getClaims
  };
})(window);
