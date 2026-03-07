from machine import I2C
import time

# I2C Andress
AHT20_ADDR = 0x38

class AHT20:
    """
    Biblioteca para ler temperatura e umidade do AHT20.
    """
    def __init__(self, i2c):
        self.i2c = i2c
        self.addr = AHT20_ADDR
        self.is_ready = False
        self._initialize_sensor()

    def _initialize_sensor(self):
        """Inicializa e verifica a conexão com o sensor."""
        try:
            self.i2c.writeto(self.addr, b'\xbe') # Wake-up
            time.sleep(0.1)
            status = self.i2c.readfrom(self.addr, 1)[0]
            if (status & 0x08) == 0x08:
                self.is_ready = True
                print("AHT20: Sensor de temperatura e umidade pronto.")
            else:
                self.is_ready = False
                print("AHT20: Erro ao inicializar. Calibração falhou.")
        except OSError as e:
            print(f"AHT20: Erro de comunicação I2C durante a inicialização: {e}")
            self.is_ready = False

    def get_data(self):
        """
        Retorna a temperatura (°C) e a umidade (%) ou None, None em caso de erro.
        """
        if not self.is_ready:
            return None, None
        
        try:
            self.i2c.writeto(self.addr, b'\xac\x33\x00')
            time.sleep(0.1)
            while self.i2c.readfrom(self.addr, 1)[0] & 0x80:
                time.sleep(0.01)

            data = self.i2c.readfrom(self.addr, 6)
            
            hum_raw = ((data[1] << 16) | (data[2] << 8) | data[3]) >> 4
            temp_raw = ((data[3] & 0x0F) << 16) | (data[4] << 8) | data[5]
            
            humidity = (hum_raw * 100) / 0x100000
            temperature = (temp_raw * 200 / 0x100000) - 50
            
            return temperature, humidity
        except OSError as e:
            print(f"AHT20: Erro na leitura de dados: {e}")
            return None, None