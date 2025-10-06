from machine import I2C, Pin
import time
import framebuf

class SSD1306:
    def __init__(self, width, height, i2c, addr=0x3c):
        self.width = width
        self.height = height
        self.i2c = i2c
        self.addr = addr
        self.buffer = bytearray((height // 8) * width)
        self.framebuf = framebuf.FrameBuffer(self.buffer, width, height, framebuf.MVLSB)
        self.init_display()

    def init_display(self):
        for cmd in (
            0xAE,  # Display off
            0x20, 0x00,  # Set Memory Addressing Mode to Horizontal
            0xB0,  # Set Page Start Address for Page Addressing Mode
            0xC8,  # Set COM Output Scan Direction
            0x00, 0x10,  # Set Lower and Higher Column Address
            0x40,  # Set Display Start Line
            0x81, 0xFF,  # Set Contrast Control
            0xA1,  # Set Segment Re-map
            0xA6,  # Set Normal Display
            0xA8, 0x3F,  # Set Multiplex Ratio
            0xA4,  # Output RAM to Display
            0xD3, 0x00,  # Set Display Offset
            0xD5, 0x80,  # Set Display Clock Divide Ratio/Oscillator Frequency
            0xD9, 0xF1,  # Set Pre-charge Period
            0xDA, 0x12,  # Set COM Pins Hardware Configuration
            0xDB, 0x40,  # Set VCOMH Deselect Level
            0x20, 0x02,  # Set Memory Addressing Mode to Page
            0x8D, 0x14,  # Charge Pump
            0xAF,  # Display on
        ):
            self.write_cmd(cmd)

    def write_cmd(self, cmd):
        self.i2c.writeto(self.addr, bytearray([0x00, cmd]))

    def write_data(self, data):
        self.i2c.writeto(self.addr, bytearray([0x40] + list(data)))

    def fill(self, color):
        self.framebuf.fill(color)

    def pixel(self, x, y, color):
        self.framebuf.pixel(x, y, color)

    def show(self):
        for page in range(self.height // 8):
            self.write_cmd(0xB0 + page)
            self.write_cmd(0x00)
            self.write_cmd(0x10)
            start = page * self.width
            end = start + self.width
            self.write_data(self.buffer[start:end])

    def text(self, string, x, y, color=1):
        self.framebuf.text(string, x, y, color)

    def fill_rect(self, x, y, w, h, color):
        self.framebuf.fill_rect(x, y, w, h, color)