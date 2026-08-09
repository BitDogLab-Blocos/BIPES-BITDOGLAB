'use strict';

class DOM {
  constructor (dom, tags){
    this._dom = document.createElement (dom);
    if (typeof tags == 'object') for (const tag in tags) {
      if (['innerText', 'className', 'id', 'title'].includes(tag))
        this._dom [tag] = tags [tag]
    }
	  return this;
  }

  onclick (self, ev, args){
    // Bind click handler with context preservation
    this._dom.onclick = () => {
			if (typeof args == 'undefined')
				ev.bind(self)()
			else if (args.constructor == Array)
				ev.apply(self, args) // Apply with arguments array
		};
	  return this
  }

}

// Animation utilities for UI transitions
class Animate {
  constructor (){}
  static off (dom, callback){
    dom.classList.remove('on')
    setTimeout(()=>{
      dom.classList.remove('ani', 'on')
      if (callback != undefined)
        callback () // Execute after 250ms fade out
      }, 250) // 250ms fade duration
  }
  static on (dom){
    dom.classList.add('ani')
    setTimeout(()=>{dom.classList.add('ani', 'on')}, 250) // 250ms fade in
  }
}

// Terminal management class for serial communication

globalThis.DOM = DOM;
globalThis.Animate = Animate;

