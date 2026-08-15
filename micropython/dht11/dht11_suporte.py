"""Suporte compartilhado pelos blocos MicroPython do sensor DHT11."""

from machine import Pin
import time


# Na BitDogLab V7, o DHT11 pode usar somente as conexoes DIG 0 e 1.
PINOS_DHT11 = {0: 0, 1: 1}
INTERVALO_MINIMO_MS = 2_000


class DHT11:
    """Driver de um fio usado pelo gerador de blocos do BIPES."""

    def __init__(self, pin):
        self.pin = pin
        self.buf = bytearray(5)
        self.pin.init(Pin.OUT)
        self.pin.value(1)
        time.sleep_ms(1_000)

    def measure(self):
        pin = self.pin
        buf = self.buf

        for indice in range(5):
            buf[indice] = 0

        pin.init(Pin.OUT)
        pin.value(0)
        time.sleep_ms(20)
        pin.value(1)
        pin.init(Pin.IN, Pin.PULL_UP)

        self._esperar_nivel(0, 150, "sensor nao respondeu")
        self._esperar_nivel(1, 150, "timeout na resposta LOW")
        self._esperar_nivel(0, 150, "timeout na resposta HIGH")

        for indice in range(40):
            self._esperar_nivel(1, 100, "timeout LOW no bit {}".format(indice))
            inicio = time.ticks_us()
            self._esperar_nivel(0, 100, "timeout HIGH no bit {}".format(indice))
            duracao = time.ticks_diff(time.ticks_us(), inicio)
            byte = indice // 8
            buf[byte] = ((buf[byte] << 1) | (1 if duracao > 40 else 0)) & 0xFF

        checksum = (buf[0] + buf[1] + buf[2] + buf[3]) & 0xFF
        if checksum != buf[4]:
            raise OSError("DHT11: checksum incorreto {}".format(list(buf)))

    def _esperar_nivel(self, nivel, limite_us, mensagem):
        inicio = time.ticks_us()
        while self.pin.value() != nivel:
            if time.ticks_diff(time.ticks_us(), inicio) > limite_us:
                raise OSError("DHT11: " + mensagem)

    def humidity(self):
        return self.buf[0] + self.buf[1] / 10.0

    def temperature(self):
        return self.buf[2] + self.buf[3] / 10.0


_sensores = {}
_cache = {}


def _obter_sensor(conexao):
    conexao = int(conexao)
    if conexao not in PINOS_DHT11:
        raise ValueError("Conexao DHT11 invalida; use DIG 0 ou DIG 1")
    if conexao not in _sensores:
        _sensores[conexao] = DHT11(Pin(PINOS_DHT11[conexao]))
        _cache[conexao] = {
            "instante": -INTERVALO_MINIMO_MS,
            "temperatura": 0,
            "umidade": 0,
            "ok": False,
        }
    return _sensores[conexao]


def ler_dht11(conexao=0):
    """Le o sensor ou devolve o cache se ainda nao passaram 2 segundos."""
    conexao = int(conexao)
    sensor = _obter_sensor(conexao)
    estado = _cache[conexao]
    agora = time.ticks_ms()

    if time.ticks_diff(agora, estado["instante"]) < INTERVALO_MINIMO_MS:
        return estado

    estado["instante"] = agora
    try:
        sensor.measure()
        estado["temperatura"] = sensor.temperature()
        estado["umidade"] = sensor.humidity()
        estado["ok"] = True
    except Exception:
        estado["ok"] = False
    return estado


def temperatura_dht11(conexao=0):
    return ler_dht11(conexao)["temperatura"]


def umidade_dht11(conexao=0):
    return ler_dht11(conexao)["umidade"]
