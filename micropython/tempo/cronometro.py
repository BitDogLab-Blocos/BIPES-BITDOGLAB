# cronometro.py
# Cronômetro para temporização
# Blocos: 🏁 Iniciar Cronômetro, ⏸️ Pausar, 🔄 Reiniciar

import time

class Cronometro:
    """Classe para gerenciar cronômetros."""
    
    def __init__(self, nome="crono1"):
        self.nome = nome
        self.inicio = 0
        self.pausado_em = 0
        self.rodando = False
    
    def iniciar(self):
        """Inicia ou retoma o cronômetro."""
        if not self.rodando:
            self.inicio = time.ticks_ms() - self.pausado_em
            self.rodando = True
    
    def pausar(self):
        """Pausa o cronômetro."""
        if self.rodando:
            self.pausado_em = time.ticks_diff(time.ticks_ms(), self.inicio)
            self.rodando = False
    
    def reiniciar(self):
        """Reinicia o cronômetro para zero."""
        self.inicio = time.ticks_ms()
        self.pausado_em = 0
        self.rodando = True
    
    def tempo_ms(self):
        """Retorna o tempo em milissegundos."""
        if self.rodando:
            return time.ticks_diff(time.ticks_ms(), self.inicio)
        else:
            return self.pausado_em
    
    def tempo_segundos(self):
        """Retorna o tempo em segundos."""
        return self.tempo_ms() // 1000
    
    def tempo_formatado(self):
        """Retorna o tempo formatado como MM:SS.ms."""
        ms = self.tempo_ms()
        segundos = ms // 1000
        minutos = segundos // 60
        segundos = segundos % 60
        millis = ms % 1000
        return f"{minutos:02d}:{segundos:02d}.{millis:03d}"

# Gerenciador de múltiplos cronômetros
cronometros = {}

def obter_cronometro(nome="crono1"):
    """Obtém ou cria um cronômetro pelo nome."""
    if nome not in cronometros:
        cronometros[nome] = Cronometro(nome)
    return cronometros[nome]

def iniciar(nome="crono1"):
    """Inicia um cronômetro."""
    obter_cronometro(nome).iniciar()

def pausar(nome="crono1"):
    """Pausa um cronômetro."""
    obter_cronometro(nome).pausar()

def reiniciar(nome="crono1"):
    """Reinicia um cronômetro."""
    obter_cronometro(nome).reiniciar()

def tempo(nome="crono1"):
    """Retorna o tempo em segundos."""
    return obter_cronometro(nome).tempo_segundos()

# Exemplo de uso
if __name__ == "__main__":
    print("Iniciando cronometro...")
    iniciar("teste")
    
    for i in range(5):
        time.sleep(1)
        t = obter_cronometro("teste").tempo_formatado()
        print(f"Tempo: {t}")
    
    print("Pausando...")
    pausar("teste")
    time.sleep(2)
    print(f"Tempo pausado: {obter_cronometro('teste').tempo_formatado()}")
    
    print("Retomando...")
    iniciar("teste")
    time.sleep(2)
    print(f"Tempo final: {obter_cronometro('teste').tempo_formatado()}")
