from time import sleep_ms


MPU6050_ADDR = 0x68


class MPU6050:
    """Leitura simples do giroscopio/acelerometro MPU6050 via I2C."""

    def __init__(self, i2c, addr=MPU6050_ADDR):
        self.i2c = i2c
        self.addr = addr
        self.offset_z = 0.0
        self.is_ready = False
        try:
            self.i2c.writeto_mem(self.addr, 0x6B, b"\x00")
            self.i2c.writeto_mem(self.addr, 0x1B, b"\x00")
            self.i2c.writeto_mem(self.addr, 0x1C, b"\x00")
            self.is_ready = True
        except Exception as exc:
            print("MPU6050: erro ao inicializar:", exc)

    def _read_i16(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        value = (data[0] << 8) | data[1]
        return value - 65536 if value > 32767 else value

    def _gyro_dps(self, reg):
        return self._read_i16(reg) / 131.0

    def _accel_g(self, reg):
        return self._read_i16(reg) / 16384.0

    def gz(self):
        if not self.is_ready:
            return 0.0
        return self._gyro_dps(0x47) - self.offset_z

    def ax(self):
        return self._accel_g(0x3B) if self.is_ready else 0.0

    def ay(self):
        return self._accel_g(0x3D) if self.is_ready else 0.0

    def az(self):
        return self._accel_g(0x3F) if self.is_ready else 0.0

    def calibrate(self, samples=300, delay=5):
        if not self.is_ready:
            return False
        total = 0.0
        for _ in range(samples):
            total += self._gyro_dps(0x47)
            sleep_ms(delay)
        self.offset_z = total / samples
        return True
