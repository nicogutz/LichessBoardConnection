import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

export const characteristic = true;

export const BluetoothButton = ({onCharacteristicReceived, setBTConnected}) => {
  const [logMessage, setLogMessage] = useState('');
  const [moveValue, setMoveValue] = useState('');
  const [bluetoothCharacteristic, setBluetoothCharacteristic] = useState(null);

  const log = (message) => {
    setLogMessage((prevLog) => prevLog + '\n' + message);
  };

  // const handleChange = (event) => {
  //   let change = event.target.value.getUint64();
  //   log('> Characteristics changed:  ' + change);
  // };

  // const handleMoveInputChange = (event) => {
  //   setMoveValue(event.target.value);
  // };


  const requestBluetoothDevice = async () => {
    let options = {};
    options.optionalServices = [0x00FF];
    //options.acceptAllDevices = true;
    options.filters = [{services: [0x0FF]}];

    try {
      log('Requesting Bluetooth Device...');
      const device = await navigator.bluetooth.requestDevice(options);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(0x00FF);
      let characteristic;
      // let notifications;
      characteristic = await service.getCharacteristic(0xFF01);
      // notifications = await service.getCharacteristic(0xFF02);
      // notifications.addEventListener('characteristicvaluechanged', handleChange);
      setBluetoothCharacteristic(characteristic);
      log('> Name:             ' + device.name);
      log('> Id:               ' + device.id);
      log('> Connected:        ' + device.gatt.connected);
      log('> Characteristics     ' + characteristic.value);
      setBluetoothCharacteristic(characteristic);
      onCharacteristicReceived(characteristic);
      console.log("this characteristic" + characteristic);
      // let encoder = new TextEncoder('utf-8');
      // try {
      //   // log('> Notifying');
      //   // await notifications.startNotifications();
      //   // log('> Notifycation started');
      //   log('> Writing');
      //   var hex = '0x3FFFFFFFFFF'
      //   // var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      //   //   return parseInt(h, 16)
      //   // }))
      //   await characteristic.writeValueWithResponse(encoder.encode(hex));
      // } catch(error) {
      //   log('Argh! ' + error);
      // }
      setBTConnected(true);
    } catch (error) {
      log('Argh! ' + error);
    }
  };

  // const doMove = async (moveValue) => {
  //   if (!bluetoothCharacteristic) {
  //     log('Bluetooth characteristic not available');
  //     return;
  //   }
  //   try {
  //     let encoder = new TextEncoder('utf-8');
  //     log('> Writing');
  //     // var typedArray = new Uint8Array(moveValue.match(/[\da-f]{2}/gi).map(function (h) {
  //     //   return parseInt(h, 16)
  //     // }))
  //     log(moveValue);
  //     await bluetoothCharacteristic.writeValueWithResponse(encoder.encode(moveValue));
  //   } catch(error) {
  //     log('Argh! ' + error);
  //   }
  // };

  return (
    <div>
      <Button onClick={requestBluetoothDevice}>Request Bluetooth Device</Button>
      <pre>{logMessage}</pre>
      {/* <input type="text" value={moveValue} />
      <button onClick={doMove}>doMove</button> */}
    </div>
  )
};
