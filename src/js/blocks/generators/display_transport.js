// Selects the Python display transport without changing the base drivers.
'use strict';

(function(global) {
  var SSD1306_PAGED_DEFINITION =
    'class SSD1306_I2C_PAGED(SSD1306_I2C):\n' +
    '  def __init__(self, width, height, i2c, addr=0x3c, external_vcc=False):\n' +
    '    self._last_pages = [None] * (height // 8)\n' +
    '    super().__init__(width, height, i2c, addr, external_vcc)\n' +
    '  def show(self):\n' +
    '    _data = memoryview(self.buffer)[1:]\n' +
    '    for _page in range(self.pages):\n' +
    '      _start = _page * self.width\n' +
    '      _page_data = bytes(_data[_start:_start + self.width])\n' +
    '      if self._last_pages[_page] == _page_data:\n' +
    '        continue\n' +
    '      self.write_cmd(SET_COL_ADDR)\n' +
    '      self.write_cmd(0)\n' +
    '      self.write_cmd(self.width - 1)\n' +
    '      self.write_cmd(SET_PAGE_ADDR)\n' +
    '      self.write_cmd(_page)\n' +
    '      self.write_cmd(_page)\n' +
    '      self.i2c.writevto(self.addr, (b"\\x40", _page_data))\n' +
    '      self._last_pages[_page] = _page_data\n';

  function select(profile, displayType, busPolicy) {
    if (displayType === 'LARGE') {
      return { driverClass: 'SH1107_I2C' };
    }

    var usePagedSsd1306 = profile && profile.VERSION === 'v7' &&
      busPolicy && busPolicy.sharesUltrasonic;
    if (usePagedSsd1306) {
      return {
        driverClass: 'SSD1306_I2C_PAGED',
        definitionKey: 'lib_ssd1306_paged_transport',
        pythonDefinition: SSD1306_PAGED_DEFINITION
      };
    }

    return { driverClass: 'SSD1306_I2C' };
  }

  global.BitdogLabDisplayTransport = {
    select: select
  };
})(window);
