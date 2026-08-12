"""Driver MicroPython para sensores BMP280/BME280 via I2C."""

from machine import I2C
import time


BMP280_ADDR = 0x77


class BMP280:
    """Leitura compensada de temperatura e pressão do BMP280."""

    def __init__(self, i2c, addr=BMP280_ADDR):
        self.i2c = i2c
        self.addr = addr
        self.is_ready = False
        self.cal_params = {}
        self.t_fine = 0
        self._initialize_sensor()

    def _initialize_sensor(self):
        """Inicializa o sensor e verifica o identificador do chip."""
        try:
            chip_id = self.i2c.readfrom_mem(self.addr, 0xD0, 1)[0]

            # 0x58 = BMP280; 0x60 = BME280 (mesmos dados de temperatura/pressão).
            if chip_id in (0x58, 0x60):
                self._read_calibration_params()
                # Oversampling x1 para temperatura e pressão, modo normal.
                self.i2c.writeto_mem(self.addr, 0xF4, b"\x27")
                self.is_ready = True
                print("BMP/BME280: sensor pronto (ID: {})".format(hex(chip_id)))
            else:
                print("BMP280: ID de chip inesperado: {}".format(hex(chip_id)))
        except OSError as exc:
            print("BMP280: erro de comunicacao I2C:", exc)
            self.is_ready = False

    def _read_word_le(self, reg, signed=False):
        """Lê uma palavra de 16 bits no formato little-endian."""
        data = self.i2c.readfrom_mem(self.addr, reg, 2)
        value = data[0] | (data[1] << 8)
        if signed and value > 32767:
            value -= 65536
        return value

    def _read_calibration_params(self):
        """Lê os coeficientes de calibração gravados na memória do sensor."""
        self.cal_params["dig_T1"] = self._read_word_le(0x88)
        self.cal_params["dig_T2"] = self._read_word_le(0x8A, signed=True)
        self.cal_params["dig_T3"] = self._read_word_le(0x8C, signed=True)
        self.cal_params["dig_P1"] = self._read_word_le(0x8E)
        self.cal_params["dig_P2"] = self._read_word_le(0x90, signed=True)
        self.cal_params["dig_P3"] = self._read_word_le(0x92, signed=True)
        self.cal_params["dig_P4"] = self._read_word_le(0x94, signed=True)
        self.cal_params["dig_P5"] = self._read_word_le(0x96, signed=True)
        self.cal_params["dig_P6"] = self._read_word_le(0x98, signed=True)
        self.cal_params["dig_P7"] = self._read_word_le(0x9A, signed=True)
        self.cal_params["dig_P8"] = self._read_word_le(0x9C, signed=True)
        self.cal_params["dig_P9"] = self._read_word_le(0x9E, signed=True)

    def _compensate_temperature(self, adc_t):
        """Converte a temperatura bruta para graus Celsius."""
        dig_t1 = self.cal_params["dig_T1"]
        dig_t2 = self.cal_params["dig_T2"]
        dig_t3 = self.cal_params["dig_T3"]

        var1 = (adc_t / 16384.0 - dig_t1 / 1024.0) * dig_t2
        var2 = ((adc_t / 131072.0 - dig_t1 / 8192.0) ** 2) * dig_t3
        self.t_fine = int(var1 + var2)
        return (var1 + var2) / 5120.0

    def _compensate_pressure(self, adc_p):
        """Converte a pressão bruta para hectopascals (hPa)."""
        dig_p1 = self.cal_params["dig_P1"]
        dig_p2 = self.cal_params["dig_P2"]
        dig_p3 = self.cal_params["dig_P3"]
        dig_p4 = self.cal_params["dig_P4"]
        dig_p5 = self.cal_params["dig_P5"]
        dig_p6 = self.cal_params["dig_P6"]
        dig_p7 = self.cal_params["dig_P7"]
        dig_p8 = self.cal_params["dig_P8"]
        dig_p9 = self.cal_params["dig_P9"]

        var1 = self.t_fine / 2.0 - 64000.0
        var2 = var1 * var1 * dig_p6 / 32768.0
        var2 = var2 + var1 * dig_p5 * 2.0
        var2 = var2 / 4.0 + dig_p4 * 65536.0
        var1 = (dig_p3 * var1 * var1 / 524288.0 + dig_p2 * var1) / 524288.0
        var1 = (1.0 + var1 / 32768.0) * dig_p1
        if var1 == 0:
            return 0

        pressure = 1048576.0 - adc_p
        pressure = ((pressure - var2 / 4096.0) * 6250.0) / var1
        var1 = dig_p9 * pressure * pressure / 2147483648.0
        var2 = pressure * dig_p8 / 32768.0
        pressure = pressure + (var1 + var2 + dig_p7) / 16.0
        return pressure / 100.0

    def get_data(self):
        """Retorna ``(temperatura_celsius, pressao_hpa)`` ou ``(None, None)``."""
        if not self.is_ready:
            return None, None

        try:
            # Nova conversão: oversampling x1 e modo normal.
            self.i2c.writeto_mem(self.addr, 0xF4, b"\x27")
            time.sleep_ms(100)

            temp_raw = self.i2c.readfrom_mem(self.addr, 0xFA, 3)
            adc_t = (temp_raw[0] << 12) | (temp_raw[1] << 4) | (temp_raw[2] >> 4)

            press_raw = self.i2c.readfrom_mem(self.addr, 0xF7, 3)
            adc_p = (press_raw[0] << 12) | (press_raw[1] << 4) | (press_raw[2] >> 4)

            temperature = self._compensate_temperature(adc_t)
            pressure = self._compensate_pressure(adc_p)
            return temperature, pressure
        except OSError as exc:
            print("BMP280: erro na leitura:", exc)
            return None, None
