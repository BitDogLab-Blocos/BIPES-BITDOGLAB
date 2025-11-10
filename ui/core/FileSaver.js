/* FileSaver.js - Simplified for BIPES-BITDOGLAB
 * Based on FileSaver.js 1.3.2 by Eli Grey (MIT License)
 * Stripped down to only saveAs() functionality used by the project
 * Original: https://github.com/eligrey/FileSaver.js
 */

'use strict';

var saveAs = saveAs || (function(view) {
  // IE <10 is explicitly unsupported
  if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
    return;
  }

  var doc = view.document,
      get_URL = function() { return view.URL || view.webkitURL || view; },
      save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
      can_use_save_link = "download" in save_link,
      click = function(node) {
        var event = new MouseEvent("click");
        node.dispatchEvent(event);
      },
      is_safari = /constructor/i.test(view.HTMLElement),
      is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
      revoke_timeout = 1000 * 40, // 40s timeout to revoke object URLs
      revoke = function(file) {
        setTimeout(function() {
          if (typeof file === "string") { // Object URL
            get_URL().revokeObjectURL(file);
          }
        }, revoke_timeout);
      },
      auto_bom = function(blob) {
        // Prepend BOM for UTF-8 XML and text/* types
        if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
          return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
        }
        return blob;
      },
      saveAs = function(blob, name) {
        blob = auto_bom(blob); // Always apply auto BOM
        name = name || blob.name || "download";

        var object_url,
            force = blob.type === "application/octet-stream";

        // Try HTML5 download attribute first
        if (can_use_save_link) {
          object_url = get_URL().createObjectURL(blob);
          setTimeout(function() {
            save_link.href = object_url;
            save_link.download = name;
            click(save_link);
            revoke(object_url);
          });
          return;
        }

        // Fallback for Safari/Chrome iOS
        if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
          var reader = new FileReader();
          reader.onloadend = function() {
            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
            var popup = view.open(url, '_blank');
            if (!popup) view.location.href = url;
          };
          reader.readAsDataURL(blob);
          return;
        }

        // Fallback: create object URL and open in new window
        object_url = get_URL().createObjectURL(blob);
        if (force) {
          view.location.href = object_url;
        } else {
          var opened = view.open(object_url, "_blank");
          if (!opened) { // Popup blocked
            view.location.href = object_url;
          }
        }
        revoke(object_url);
      };

  // IE 10+ native saveAs
  if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
    return function(blob, name) {
      name = name || blob.name || "download";
      return navigator.msSaveOrOpenBlob(auto_bom(blob), name);
    };
  }

  return saveAs;
}(
     typeof self !== "undefined" && self
  || typeof window !== "undefined" && window
  || this.content
));

// CommonJS export
if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
}
// AMD export
else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define([], function() { return saveAs; });
}
