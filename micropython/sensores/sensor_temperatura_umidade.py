# sensor_temperatura_umidade.py
# Lê temperatura e umidade do sensor AHT20
# Blocos: Temperatura (°C), Umidade (%)

from machine import Pin, I2C
import time

# O AHT20 pode estar no I2C0 ou I2C1 dependendo da conexão
# Tenta I2C1 primeiro (mesmo barramento do display)
AHT20_ADDR = 0x38

def tentar_i2c():
    """Tenta encontrar o AHT20 em ambos os barramentos."""
 # Tenta I2C1
    try:
        i2c = I2C(1, scl=Pin(3), sda=Pin(2), freq=400000)
        if AHT20_ADDR in i2c.scan():
            print("AHT20 encontrado no I2C1 (SCL=3, SDA=2)")
            return i2c
    except:
        pass
 # Tenta I2C0
    try:
        i2c = I2C(0, scl=Pin(1), sda=Pin(0), freq=400000)
        if AHT20_ADDR in i2c.scan():
            print("AHT20 encontrado no I2C0 (SCL=1, SDA=0)")
            return i2c
    except:
        pass
    return None

i2c_sensor = tentar_i2c()
if i2c_sensor is None:
    print("ERRO: Sensor AHT20 nao encontrado!")
    print("Verifique a conexao do sensor.")
else:
 # Variáveis de cache
    _aht20_temp = 0.0
    _aht20_umid = 0.0
    _aht20_ultimo = 0

    def aht20_atualizar():
        """Lê dados do AHT20 (com cache de 500ms)."""
        global _aht20_temp, _aht20_umid, _aht20_ultimo
        agora = time.ticks_ms()
        if time.ticks_diff(agora, _aht20_ultimo) < 500:
            return
        _aht20_ultimo = agora
        try:
            i2c_sensor.writeto(AHT20_ADDR, bytes([0xAC, 0x33, 0x00]))
            time.sleep_ms(80)
            dados = i2c_sensor.readfrom(AHT20_ADDR, 7)
            if dados[0] & 0x80 == 0:
                raw_umid = ((dados[1] << 16) | (dados[2] << 8) | dados[3]) >> 4
                raw_temp = ((dados[3] & 0x0F) << 16) | (dados[4] << 8) | dados[5]
                _aht20_umid = round(raw_umid * 100 / 1048576, 1)
                _aht20_temp = round(raw_temp * 200 / 1048576 - 50, 1)
        except:
            pass

    def ler_temperatura():
        aht20_atualizar()
        return _aht20_temp

    def ler_umidade():
        aht20_atualizar()
        return _aht20_umid

 # Loop de leitura
    print("Lendo sensor AHT20... Ctrl+C para parar")
    while True:
        temp = ler_temperatura()
        umid = ler_umidade()
        print("Temperatura: {}°C  Umidade: {}%".format(temp, umid))
        time.sleep(1)
