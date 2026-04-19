// Auto-generated. Do not edit.

    /**
     * Support for additional Bluetooth services.
     */
    //% color=#0082FB weight=96 icon="\uf294"
declare namespace bluetooth {

    /**
     *  Starts the Bluetooth UART service
     */
    //% help=bluetooth/start-uart-service
    //% blockId=bluetooth_start_uart_service block="bluetooth uart service"
    //% parts="bluetooth" advanced=true shim=bluetooth::startUartService
    function startUartService(): void;

    /**
     * Writes to the Bluetooth UART service buffer.
     */
    //% help=bluetooth/uart-write-string weight=80
    //% blockId=bluetooth_uart_write block="bluetooth uart|write string %data" blockGap=8
    //% parts="bluetooth" shim=bluetooth::uartWriteString advanced=true
    function uartWriteString(data: string): void;

    /**
     *  Reads from the Bluetooth UART service buffer until the delimiter.
     */
    //% help=bluetooth/uart-read-until weight=75
    //% blockId=bluetooth_uart_read block="bluetooth uart|read until %del=serial_delimiter_conv"
    //% parts="bluetooth" shim=bluetooth::uartReadUntil advanced=true
    function uartReadUntil(del: string): string;

    /**
     * Sends a buffer of data via Bluetooth UART
     */
    //% shim=bluetooth::uartWriteBuffer
    function uartWriteBuffer(buffer: Buffer): void;

    /**
     * Reads buffered UART data into a buffer
     */
    //% shim=bluetooth::uartReadBuffer
    function uartReadBuffer(): Buffer;

    /**
     * Registers an event to be fired when one of the delimiter is matched.
     * @param delimiters the characters to match received characters against.
     */
    //% help=bluetooth/on-uart-data-received
    //% weight=18 blockId=bluetooth_on_data_received block="bluetooth|on data received %delimiters=serial_delimiter_conv" shim=bluetooth::onUartDataReceived
    function onUartDataReceived(delimiters: string, body: () => void): void;

    /**
     * Register code to run when the micro:bit is connected to over Bluetooth
     * @param body Code to run when a Bluetooth connection is established
     */
    //% help=bluetooth/on-bluetooth-connected weight=20
    //% blockId=bluetooth_on_connected block="on bluetooth connected" blockGap=8
    //% parts="bluetooth" shim=bluetooth::onBluetoothConnected
    function onBluetoothConnected(body: () => void): void;

    /**
     * Register code to run when a bluetooth connection to the micro:bit is lost
     * @param body Code to run when a Bluetooth connection is lost
     */
    //% help=bluetooth/on-bluetooth-disconnected weight=19
    //% blockId=bluetooth_on_disconnected block="on bluetooth disconnected"
    //% parts="bluetooth" shim=bluetooth::onBluetoothDisconnected
    function onBluetoothDisconnected(body: () => void): void;

    /**
     * Sets the BLE GAP device name advertised over Bluetooth.
     * Name must start with "Claude" for Claude Desktop Hardware Buddy to connect.
     * @param name the device name to advertise, eg: "Claude mini"
     */
    //% blockId=bluetooth_set_device_name block="bluetooth set device name %name"
    //% parts=bluetooth weight=6 advanced=true shim=bluetooth::setDeviceName
    function setDeviceName(name: string): void;
}

// Auto-generated. Do not edit. Really.
