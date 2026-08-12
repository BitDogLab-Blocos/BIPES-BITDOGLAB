"""Driver MicroPython para o sensor digital de temperatura e umidade DHT11.

Uso:
    import dht
    from machine import Pin

    sensor = dht.DHT11(Pin(15))
    sensor.measure()
    temperatura = sensor.temperature()
    umidade = sensor.humidity()
"""

from machine import Pin
import time


class DHTBase:
    """Base para sensores da família DHT que usam o protocolo de um fio."""

    def __init__(self, pin):
        self.pin = pin
        self.buf = bytearray(5)
        self.pin.init(Pin.OUT, Pin.PULL_DOWN)
        self.pin(1)
        time.sleep_ms(20)

    def _wait_for_level(self, level, timeout_us):
        start = time.ticks_us()
        while self.pin.value() != level:
            if time.ticks_diff(time.ticks_us(), start) > timeout_us:
                raise OSError("DHT11: timeout na comunicacao")

    def measure(self):
        """Lê uma amostra do sensor e valida o checksum."""
        pin = self.pin
        buf = self.buf

        for index in range(5):
            buf[index] = 0

        pin.init(Pin.OUT, Pin.PULL_DOWN)
        pin(0)
        time.sleep_ms(20)
        pin(1)
        pin.init(Pin.IN, Pin.PULL_UP)

        # Resposta do sensor: pulso baixo, seguido de pulso alto.
        self._wait_for_level(0, 100)
        self._wait_for_level(1, 100)
        self._wait_for_level(0, 100)

        for index in range(40):
            # Cada bit começa com um pulso baixo e fica alto por um
            # período curto (0) ou longo (1).
            self._wait_for_level(1, 100)
            start = time.ticks_us()
            self._wait_for_level(0, 100)
            duration = time.ticks_diff(time.ticks_us(), start)

            byte_index = index // 8
            buf[byte_index] = (buf[byte_index] << 1) | (1 if duration > 40 else 0)

        if (buf[0] + buf[1] + buf[2] + buf[3]) & 0xFF != buf[4]:
            raise OSError("DHT11: checksum invalido")


class DHT11(DHTBase):
    """Sensor DHT11, com temperatura e umidade em resolução inteira."""

    def humidity(self):
        """Retorna a umidade relativa em porcentagem."""
        return self.buf[0] + self.buf[1] / 100

    def temperature(self):
        """Retorna a temperatura em graus Celsius."""
        return self.buf[2] + self.buf[3] / 100
