// Auto-generated. Do not edit.

//% color=#0082FB weight=96 icon="\uf294"
declare namespace bluetooth {

    /**
     * Sets the BLE GAP device name advertised over Bluetooth.
     * Name must start with "Claude" for Claude Desktop Hardware Buddy to connect.
     * @param name the device name to advertise, eg: "Claude mini"
     */
    //% blockId=bluetooth_set_device_name block="bluetooth set device name %name"
    //% parts=bluetooth weight=6 advanced=true shim=bluetooth::setDeviceName
    function setDeviceName(name: string): void;
}
