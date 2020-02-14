his Cordova plugin is used for monitoring device's battery status. The plugin will monitor every change that happens to device's battery.

Step 1 - Installing Battery Plugin
To install this plugin, we need to open the command prompt window and run the following code.

C:\Users\username\Desktop\CordovaProject>cordova plugin add cordova-pluginbattery-status 
Step 2 - Add Event Listener
When you open the index.js file, you will find the onDeviceReady function. This is where the event listener should be added.

window.addEventListener("batterystatus", onBatteryStatus, false); 
Step 3 - Create Callback Function
We will create the onBatteryStatus callback function at the bottom of the index.js file.

function onBatteryStatus(info) { 
   alert("BATTERY STATUS:  Level: " + info.level + " isPlugged: " + info.isPlugged); 
}
When we run the app, an alert will be triggered. At the moment, the battery is 100% charged.

When the status is changed, a new alert will be displayed. The battery status shows that the battery is now charged 99%.

Battery Status Change
If we plug in the device to the charger, the new alert will show that the isPlugged value is changed to true.

Battery Status Plugged