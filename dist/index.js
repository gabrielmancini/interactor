(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Interactor = require('./interactor');
// An example instantiation with custom arguments
module.exports = new Interactor({
  endpoint: '/usage/interactions',
  async: true,
  debug: true
});

},{"./interactor":2}],2:[function(require,module,exports){
/*
BSD 2-Clause License

Copyright (c) 2016, Benjamin Cordier
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Interactor (config) {
  var interactor = this;
  if (!(interactor instanceof Interactor)) return new Interactor(config);
  // Call Initialization on Interactor Call

  // Argument Assignment      // Type Checks                                      // Default Values
  interactor.endpoint = typeof (config.endpoint) === 'string' ? config.endpoint : '/interactions';
  interactor.async = typeof (config.async) === 'boolean' ? config.async : true;
  interactor.debug = typeof (config.debug) === 'boolean' ? config.debug : true;
  interactor.user = typeof (config.user) === 'string' ? config.user : '';
  interactor.password = typeof (config.password) === 'string' ? config.password : '';

  interactor.records = [];
  interactor.session = {};
  interactor.loadTime = new Date();

  // Initialize Session
  interactor.__initializeSession__();
  // Call Event Binding Method
  interactor.__bindEvents__();

  return interactor;
}

Interactor.prototype = {

  // Create Events to Track
  __bindEvents__: function () {
    var interactor = this;

    // The magic code
    var oldAddEventListener = window.EventTarget.prototype.addEventListener;

    window.EventTarget.prototype.addEventListener = function (eventName, eventHandler) {
      oldAddEventListener.call(this, eventName, function (event) {
        event.stopPropagation();
        interactor.__addInteraction__(event, 'interaction');
        eventHandler(event);
      });
    };

    // Bind onbeforeunload Event
    window.onbeforeunload = function (e) {
      interactor.__sendInteractions__();
    };

    return interactor;
  },

  // Add Interaction Object Triggered By Events to Records Array
  __addInteraction__: function (e, type) {
    var interactor = this;
      // Interaction Object
    var interaction = {
      type: type,
      event: e.type,
      targetTag: e.target.nodeName,
      targetClasses: e.target.className,
      content: e.target.innerText,
      clientPosition: {
        x: e.clientX,
        y: e.clientY
      },
      screenPosition: {
        x: e.screenX,
        y: e.screenY
      },
      createdAt: new Date().toISOString()
    };

    // Insert into Records Array
    interactor.records.push(interaction);

    // Log Interaction if Debugging
    if (interactor.debug) {
      // Close Session & Log to Console
      interactor.__closeSession__();
      console.log('Session:\n', interactor.session);
    }

    return interactor;
  },

  // Generate Session Object & Assign to Session Property
  __initializeSession__: function () {
    var interactor = this;
    var html = document.getElementsByTagName('html')[0];
    // Assign Session Property
    interactor.session = {
      loadTime: interactor.loadTime,
      unloadTime: new Date(),
      language: window.navigator.language,
      platform: window.navigator.platform,
      port: window.location.port,
      clientStart: {
        name: window.navigator.appVersion,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      },
      page: {
        location: window.location.pathname,
        href: window.location.href,
        origin: window.location.origin,
        title: document.title,
        html: html.innerHTML,
        text: html.innerText
      },
      endpoint: interactor.endpoint
    };

    return interactor;
  },

  // Insert End of Session Values into Session Property
  __closeSession__: function () {
    var interactor = this;

    // Assign Session Properties
    interactor.session.unloadTime = new Date();
    interactor.session.interactions = interactor.records;
    interactor.session.clientEnd = {
      name: window.navigator.appVersion,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    };

    return interactor;
  },

  // Gather Additional Data and Send Interaction(s) to Server
  __sendInteractions__: function () {
    var interactor = this;
      // Initialize Cross Header Request
    var xhr = new XMLHttpRequest();

    // Close Session
    interactor.__closeSession__();

    // Post Session Data Serialized as JSON
    xhr.open('POST', interactor.endpoint, interactor.async);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(interactor.user + ':' + interactor.password));
    interactor.session.type = 'tracking';
    xhr.send(JSON.stringify(interactor.session));

    return interactor;
  }

};

module.exports = Interactor;

},{}]},{},[1]);
