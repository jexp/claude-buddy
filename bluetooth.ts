/// <reference no-default-lib="true"/>
/**
 * Support for additional Bluetooth services.
 */
//% color=#0082FB weight=96 icon="\uf294"
namespace bluetooth {
    export let NEW_LINE = "\r\n";

    /**
     * Sets the BLE GAP device name. Call before startUartService().
     * Name must start with "Claude" for Claude Desktop Hardware Buddy to connect.
     * @param name the device name to advertise, eg: "Claude mini"
     */
    //% blockId=bluetooth_set_device_name block="bluetooth set device name %name"
    //% parts=bluetooth weight=6 advanced=true shim=bluetooth::setDeviceName
    export function setDeviceName(name: string): void {
        // simulator stub — no-op; shim routes to C++ on device
    }

    /**
    *  Writes to the Bluetooth UART service buffer.
    */
    //% help=bluetooth/uart-write-string weight=80
    //% blockId=bluetooth_uart_write block="bluetooth uart|write string %data" blockGap=8
    //% parts="bluetooth" shim=bluetooth::uartWriteString advanced=true
    export function uartWriteString(data: string): void {
        console.log(data)
    }

    /**
    *  Writes a line to the Bluetooth UART service buffer.
    */
    //% help=bluetooth/uart-write-line weight=79
    //% blockId=bluetooth_uart_line block="bluetooth uart|write line %data" blockGap=8
    //% parts="bluetooth" advanced=true
    export function uartWriteLine(data: string): void {
        uartWriteString(data + NEW_LINE);
    }

    /**
     * Writes a ``name: value`` pair line to the serial.
     * @param name name of the value stream, eg: x
     * @param value to write
     */
    //% weight=88 weight=78
    //% help=bluetooth/uart-write-value advanced=true
    //% blockId=bluetooth_uart_writevalue block="bluetooth uart|write value %name|= %value"
    export function uartWriteValue(name: string, value: number): void {
        uartWriteString((name ? name + ":" : "") + value + NEW_LINE);
    }

    /**
     *  Reads from the Bluetooth UART service buffer until the delimiter.
     */
    //% help=bluetooth/uart-read-until weight=75
    //% blockId=bluetooth_uart_read block="bluetooth uart|read until %del=serial_delimiter_conv"
    //% parts="bluetooth" shim=bluetooth::uartReadUntil advanced=true
    export function uartReadUntil(del: string): string {
        return ""
    }
}
