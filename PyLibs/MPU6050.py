from time import sleep_ms


MPU6050_ADDR = 0x68
MPU6050_WHO_AM_I = 0x75
MPU6050_ID = 0x68


class MPU6050:
    """Leitura protegida do giroscopio/acelerometro MPU6050 via I2C."""

    def __init__(self, i2c, addr=MPU6050_ADDR, quiet=False):
        self.i2c = i2c
        self.addr = addr
        self.quiet = quiet
        self.offset_z = 0.0
        self.is_ready = False
        self.last_error = None
        self.identity = None
        self.initialize()

    def initialize(self):
        self.is_ready = False
        try:
            # Preserve the robot's original startup sequence: wake/configure
            # first.  WHO_AM_I is diagnostic only because some boards/clones
            # answer late or report a compatible ID during power-up.
            self.i2c.writeto_mem(self.addr, 0x6B, b"\x00")
            self.i2c.writeto_mem(self.addr, 0x1B, b"\x00")
            self.i2c.writeto_mem(self.addr, 0x1C, b"\x00")
            try:
                self.identity = self.i2c.readfrom_mem(self.addr, MPU6050_WHO_AM_I, 1)[0]
            except Exception:
                self.identity = None
            self.last_error = None
            self.is_ready = True
        except Exception as exc:
            self.last_error = exc
            if not self.quiet:
                print("MPU6050: erro ao inicializar:", exc)
        return self.is_ready

    def set_i2c(self, i2c):
        self.i2c = i2c

    @staticmethod
    def _decode_i16(data, offset):
        value = (data[offset] << 8) | data[offset + 1]
        return value - 65536 if value > 32767 else value

    def _read_i16(self, reg):
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        return self._decode_i16(data, 0)

    def _gyro_dps(self, reg):
        return self._read_i16(reg) / 131.0

    def _accel_g(self, reg):
        return self._read_i16(reg) / 16384.0

    def gz(self):
        if not self.is_ready:
            return 0.0
        try:
            return self._gyro_dps(0x47) - self.offset_z
        except Exception as exc:
            self.last_error = exc
            self.is_ready = False
            return 0.0

    def acceleration(self):
        """Retorna (ax, ay, az) em g na mesma amostra ou None em falha."""
        if not self.is_ready:
            return None
        try:
            data = self.i2c.readfrom_mem(self.addr, 0x3B, 6)
            return (
                self._decode_i16(data, 0) / 16384.0,
                self._decode_i16(data, 2) / 16384.0,
                self._decode_i16(data, 4) / 16384.0,
            )
        except Exception as exc:
            self.last_error = exc
            self.is_ready = False
            return None

    def ax(self):
        return self._accel_g(0x3B) if self.is_ready else 0.0

    def ay(self):
        return self._accel_g(0x3D) if self.is_ready else 0.0

    def az(self):
        return self._accel_g(0x3F) if self.is_ready else 0.0

    def calibrate(self, samples=300, delay=5):
        if not self.is_ready:
            return False
        try:
            total = 0.0
            for _ in range(samples):
                total += self._gyro_dps(0x47)
                sleep_ms(delay)
            self.offset_z = total / samples
            return True
        except Exception as exc:
            self.last_error = exc
            self.is_ready = False
            return False
