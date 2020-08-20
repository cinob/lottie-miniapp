"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDynamicProperty = addDynamicProperty;
function addDynamicProperty(prop) {
  if (this.dynamicProperties.indexOf(prop) === -1) {
    this.dynamicProperties.push(prop);
    this.container.addDynamicProperty(this);
  }
}