"""Explicit, one-shot hardware check of the browser-generated tutorial program.

Requires pyserial (or the local tests/vendor copy). Writes only to RAM/display;
does not save files or reset the board. This interrupts the running program.
"""
import argparse
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "vendor"))
import serial


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", required=True)
    parser.add_argument("--generated", type=Path, default=Path(__file__).parent / "oled-generated-large.py")
    args = parser.parse_args()
    source = args.generated.read_text(encoding="utf-8")
    if source.count("\nwhile True:\n") != 1:
        raise ValueError("Expected the generated tutorial program with one main loop")
    source = source.replace("\nwhile True:\n", "\nfor _oled_test_once in range(1):\n")
    source += (
        '\n_oled_test_lit = sum(oled.pixel(x,y) for y in range(128) for x in range(128))\n'
        'assert _oled_test_lit == 3254\n'
        'print("__OLED_PHYSICAL_OK__", len(oled.buffer), _oled_test_lit)\n'
    )
    with serial.Serial(args.port, 115200, timeout=0.2, write_timeout=3) as port:
        raw = False
        try:
            port.write(b"\x03\x03")
            time.sleep(0.3)
            port.reset_input_buffer()
            port.write(b"\x01")
            time.sleep(0.3)
            header = port.read(port.in_waiting)
            if b"raw REPL" not in header:
                raise RuntimeError("MicroPython raw REPL was not available: " + repr(header))
            raw = True
            data = source.encode("utf-8")
            for offset in range(0, len(data), 128):
                port.write(data[offset:offset + 128])
                time.sleep(0.005)
            port.write(b"\x04")
            output = b""
            deadline = time.monotonic() + 15
            while time.monotonic() < deadline:
                output += port.read(max(1, port.in_waiting))
                if output.count(b"\x04") >= 2 and output.endswith(b">"):
                    break
            print(output.decode(errors="replace").replace("\x04", " [EOT] "))
            if b"__OLED_PHYSICAL_OK__ 2048 3254" not in output or b"Traceback" in output:
                raise RuntimeError("OLED rendering did not pass on the connected board")
            print("PASS: physical MicroPython rendering, 2048 bytes, 3254 lit pixels, I2C writes completed")
            print("No board files written. Check image orientation visually on the physical display.")
        finally:
            if raw:
                port.write(b"\x03\x02")


if __name__ == "__main__":
    main()
