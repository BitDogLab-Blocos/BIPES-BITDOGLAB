# esperar.py
# Funções de espera/delay
# Blocos: Aguardar segundos, Aguardar milissegundos

import time

def esperar_segundos(segundos):
    """
    Pausa a execução por um número de segundos.
    
    Args:
        segundos: Número de segundos para esperar
    """
    time.sleep(segundos)

def esperar_milissegundos(ms):
    """
    Pausa a execução por um número de milissegundos.
    
    Args:
        ms: Número de milissegundos para esperar
    """
    time.sleep_ms(ms)

def tempo_ligado():
    """
    Retorna o tempo desde que o dispositivo foi ligado, em segundos.
    
    Returns:
        int: Tempo em segundos
    """
    return time.ticks_ms() // 1000

# Exemplo de uso
if __name__ == "__main__":
    print("Inicio")
    esperar_segundos(1)
    print("1 segundo depois")
    esperar_milissegundos(500)
    print("500ms depois")
    print(f"Tempo ligado: {tempo_ligado()}s")
