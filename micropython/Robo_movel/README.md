<!-- Unified README: Portuguese + English with SVG icons -->

<div align="center">
  <!-- Microcontroller / MicroPython icon -->
  <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin:4px">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#2b2b2b"/>
    <circle cx="7" cy="10" r="1.2" fill="#ffd43b"/>
    <circle cx="12" cy="10" r="1.2" fill="#ffd43b"/>
    <circle cx="17" cy="10" r="1.2" fill="#ffd43b"/>
  </svg>
  <!-- I2C icon -->
  <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin:4px">
    <rect x="3" y="10" width="6" height="4" rx="1" fill="#0b76ef"/>
    <rect x="15" y="10" width="6" height="4" rx="1" fill="#0b76ef"/>
    <path d="M9 12h6" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M12 8v-3" stroke="#0b76ef" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
  <!-- Sensor / MPU icon -->
  <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin:4px">
    <rect x="4" y="4" width="16" height="16" rx="2" fill="#444"/>
    <rect x="7" y="7" width="10" height="10" rx="1" fill="#fff"/>
    <circle cx="12" cy="12" r="2" fill="#444"/>
  </svg>
  <!-- Display icon -->
  <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin:4px">
    <rect x="3" y="5" width="18" height="12" rx="1" fill="#111"/>
    <rect x="5" y="7" width="14" height="8" rx="1" fill="#fff"/>
  </svg>
  <!-- Motor/Gear icon -->
  <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="margin:4px">
    <circle cx="12" cy="12" r="3.2" fill="#222"/>
    <path d="M19 12a7 7 0 0 0-.3-2l1.7-1-1.7-2-2 1a7 7 0 0 0-2-.3V3h-3v1.7a7 7 0 0 0-2 .3l-2-1L3.6 9l1.7 1A7 7 0 0 0 5 12c0 .7.1 1.3.3 2l-1.7 1 1.7 2 2-1c.6.3 1.3.5 2 .6V21h3v-1.7c.7-.1 1.4-.3 2-.6l2 1 1.7-2-1.7-1c.2-.7.3-1.3.3-2z" fill="#555"/>
  </svg>
</div>

# Robo Móvel — Controle Giroscópico / Gyro-Based Mobile Robot

## Índice / Table of contents
- [Português](#português)
  - [Ligações](#ligações)
  - [Uso rápido](#uso-rápido)
  - [Matemática de controle](#matemática-de-controle)
  - [Observações](#observações)
- [English](#english)
  - [Wiring](#wiring)
  - [Quick usage](#quick-usage)
  - [Control math](#control-math)
  - [Notes](#notes)

---

## Português

### Ligações
- MPU6050 (I2C bus 0): SDA = Pin(0), SCL = Pin(1), endereço `0x68`.
- SH1107 OLED (I2C bus 1): SDA = Pin(2), SCL = Pin(3), endereço `0x3C`.
- Botão A: Pin(5) (pull-up).
- Motores:
  - Esquerdo: FWD = Pin(4), BWD = Pin(9), PWM = Pin(8).
  - Direito: FWD = Pin(18), BWD = Pin(19), PWM = Pin(16).
  - Standby: Pin(20) (manter HIGH).

Arquivo de referência: `Controle_giro.py` (mesma pasta).

### Uso rápido
1. Envie `Controle_giro.py` para o microcontrolador e reinicie.
2. O sistema calibra o giroscópio automaticamente e espera o botão A.
3. Funções principais disponíveis no código:
   - `girar(graus, "L"|"R")` — gira em graus na direção esquerda/direita.
   - `frente(t)` — avança por `t` segundos.
   - `re(t)` — marcha-ré por `t` segundos.
   - `stop()` — para os motores.

### Matemática de controle
- Leitura bruta do giroscópio (eixo Z) é convertida para °/s com fator do MPU6050.
- Calibração:
  - Offset: `offset_z = (1/N) * sum(gz_raw)` (média de N amostras).
  - Taxa corrigida: `gz = gz_raw - offset_z`.
- Integração para estimativa de ângulo:
  - `angulo += gz * dt`, com `dt` em segundos (medido por `ticks_ms`).
  - No código a variável `acumulado` soma `gz * dt` até atingir o alvo de graus.
- Estrutura atual: controle open-loop com integração do giroscópio; para maior estabilidade, usar controle proporcional:
  - `erro = alvo - atual`
  - `corr = Kp * erro`
  - ajustar PWM com `corr` (ex.: `pwm_left = base + corr`, `pwm_right = base - corr`).

### Observações
- Sem filtro (complementar/Kalman) a integração do giroscópio deriva com o tempo; combine com acelerômetro para correção.
- Ajuste `SPEED_GIRO` e `Kp` conforme a resposta mecânica do robô.

---

## English

### Wiring
- MPU6050 (I2C bus 0): SDA = Pin(0), SCL = Pin(1), address `0x68`.
- SH1107 OLED (I2C bus 1): SDA = Pin(2), SCL = Pin(3), address `0x3C`.
- Button A: Pin(5) (pull-up).
- Motors:
  - Left: FWD = Pin(4), BWD = Pin(9), PWM = Pin(8).
  - Right: FWD = Pin(18), BWD = Pin(19), PWM = Pin(16).
  - Standby: Pin(20) (keep HIGH).

Reference file: `Controle_giro.py` (same folder).

### Quick usage
1. Flash `Controle_giro.py` to the board and reboot.
2. The script auto-calibrates the gyro and waits for Button A.
3. Main functions in code:
   - `girar(graus, "L"|"R")` — rotate by degrees left/right.
   - `frente(t)` — move forward for `t` seconds.
   - `re(t)` — reverse for `t` seconds.
   - `stop()` — stop motors.

### Control math
- Raw gyro Z-rate is converted to °/s using MPU6050 scale.
- Calibration:
  - Offset: `offset_z = (1/N) * sum(gz_raw)` (average over N samples).
  - Corrected rate: `gz = gz_raw - offset_z`.
- Angle estimation (integration):
  - `angle += gz * dt`, where `dt` is elapsed seconds (measured with `ticks_ms`).
  - In code `accumulated` is updated by `gz * dt` until target degrees reached.
- Current approach: open-loop turning with integrated gyro; for closed-loop improvement:
  - `error = target - current`
  - `corr = Kp * error`
  - apply correction to PWM (e.g. `pwm_left = base + corr`, `pwm_right = base - corr`).

### Notes
- Gyro-only integration drifts over time; fuse accelerometer data or use complementary/Kalman filters for robustness.
- Tune `SPEED_GIRO` and `Kp` to match robot dynamics.

---

Se quiser, eu posso:
- fazer um commit destes READMEs, ou
- adicionar um pequeno bloco com valores de exemplo para `Kp` e um procedimento rápido de tuning.
