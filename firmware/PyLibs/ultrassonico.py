from machine import I2C
import time


class SensorUltrassonico:
    I2C_ADDR = 0x57
    CMD_START = 0x01
    REG_READ = 0xAF
    TIMEOUT_MS = 600

    def __init__(self, i2c: I2C):
        self.i2c = i2c
        self.ultimo_cm = None
        self.ultimo_tempo = 0

        if self.I2C_ADDR not in self.i2c.scan():
            raise RuntimeError("Sensor nao encontrado no barramento I2C")

    def _ler_bruto(self):
        try:
            self.i2c.writeto(self.I2C_ADDR, bytes([self.CMD_START]))
        except Exception:
            return None

        time.sleep_ms(120)

        try:
            self.i2c.writeto(self.I2C_ADDR, bytes([self.REG_READ]))
            dados = self.i2c.readfrom(self.I2C_ADDR, 3)
            if dados[0] == 0xFF and dados[1] == 0xFF:
                return None
            micrometros = (dados[0] << 16) | (dados[1] << 8) | dados[2]
            cm = micrometros / 10000.0
            if 2.0 <= cm <= 450.0:
                return cm
        except Exception:
            pass

        return None

    def ler(self):
        """Retorna a distancia em cm ou None quando nao ha eco valido."""
        agora = time.ticks_ms()
        cm = self._ler_bruto()

        if cm is not None:
            self.ultimo_cm = cm
            self.ultimo_tempo = agora
        elif time.ticks_diff(agora, self.ultimo_tempo) > self.TIMEOUT_MS:
            self.ultimo_cm = None

        return self.ultimo_cm
