/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var cordova = require('cordova');
var exec = require('cordova/exec');

var STATUS_CRITICAL = 5;
var STATUS_LOW = 20;

var Battery = function () {
    this._level = null;
    this._isPlugged = null;
    this.channels = {
        batterystatus: cordova.addWindowEventHandler('batterystatus'),
        batterylow: cordova.addWindowEventHandler('batterylow'),
        batterycritical: cordova.addWindowEventHandler('batterycritical')
    };
    for (var key in this.channels) {
        this.channels[key].onHasSubscribersChange = Battery.onHasSubscribersChange;
    }
};

function handlers () {
    return battery.channels.batterystatus.numHandlers +
        battery.channels.batterylow.numHandlers +
        battery.channels.batterycritical.numHandlers;
}


Battery.onHasSubscribersChange = function () {
    if (this.numHandlers === 1 && handlers() === 1) {
        exec(battery._status, battery._error, 'Battery', 'start', []);
    } else if (handlers() === 0) {
        exec(null, null, 'Battery', 'stop', []);
    }
};


Battery.prototype._status = function (info) {

    if (info) {
        if (battery._level !== info.level || battery._isPlugged !== info.isPlugged) {

            if (info.level === null && battery._level !== null) {
                return; 
            }

            cordova.fireWindowEvent('batterystatus', info);

            if (!info.isPlugged) { 
                if (battery._level > STATUS_CRITICAL && info.level <= STATUS_CRITICAL) {
                    cordova.fireWindowEvent('batterycritical', info);
                } else if (battery._level > STATUS_LOW && info.level <= STATUS_LOW) {
                    cordova.fireWindowEvent('batterylow', info);
                }
            }
            battery._level = info.level;
            battery._isPlugged = info.isPlugged;
        }
    }
};


Battery.prototype._error = function (e) {
    console.log('Error initializing Battery: ' + e);
};

var battery = new Battery(); 

module.exports = battery;




// var app = {
//     // Application Constructor
//     initialize: function() {
//         document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
//     },

//     // deviceready Event Handler
//     //
//     // Bind any cordova events here. Common events are:
//     // 'pause', 'resume', etc.
//     onDeviceReady: function() {
//         this.receivedEvent('deviceready');
//         window.addEventListener('batterystatus', onbattery, false);
//     },

//     // Update DOM on a Received Event
//     receivedEvent: function(id) {
//         var parentElement = document.getElementById(id);
//         var listeningElement = parentElement.querySelector('.listening');
//         var receivedElement = parentElement.querySelector('.received');

//         listeningElement.setAttribute('style', 'display:none;');
//         receivedElement.setAttribute('style', 'display:block;');

//         console.log('Received Event: ' + id);
//     }
// };

// app.initialize();
// function onbattery(info)
// {
//     alert('Battery level is : ' + info.level + ' isPlugged '+info.isPlugged);
// }