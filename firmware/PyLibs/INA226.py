INA226_ADDR = 0x40

CONFIG_REG = 0x00
SHUNT_VOLTAGE_REG = 0x01
BUS_VOLTAGE_REG = 0x02


class INA226:
    """Leitura simples de tensao e corrente pelo INA226 via I2C."""

    def __init__(self, i2c, addr=0x40, shunt_resistor=0.1):
        self.i2c = i2c
        self.addr = addr
        self.shunt_resistor = shunt_resistor
        self.is_ready = False
        try:
            self.configure()
            self.is_ready = True
        except Exception as exc:
            print("INA226: erro ao inicializar:", exc)

    def _write_register(self, reg, value):
        self.i2c.writeto_mem(self.addr, reg, bytearray([
            (value >> 8) & 0xFF,
            value & 0xFF
        ]))

    def _read_register(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        return (data[0] << 8) | data[1]

    def _read_signed_register(self, reg):
        value = self._read_register(reg)
        return value - 65536 if value > 32767 else value

    def configure(self):
        # Configuracao usada no codigo de referencia enviado pelo tecnico.
        self._write_register(CONFIG_REG, 0x4127)

    def voltage(self):
        if not self.is_ready:
            return 0.0
        return self._read_register(BUS_VOLTAGE_REG) * 1.25 / 1000

    def current(self):
        if not self.is_ready or self.shunt_resistor == 0:
            return 0.0
        shunt_voltage = self._read_signed_register(SHUNT_VOLTAGE_REG) * 2.5 / 1_000_000
        return -(shunt_voltage / self.shunt_resistor)
