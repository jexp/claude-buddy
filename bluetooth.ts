/**
 * Support for additional Bluetooth services.
 */
//% color=#0082FB weight=96 icon="\uf294"
namespace bluetooth {
    export let NEW_LINE = "\r\n";

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
     * Writes a ``name: value`` pair line to the UART buffer.
     * @param name name of the value stream, eg: x
     * @param value to write
     */
    //% weight=78
    //% help=bluetooth/uart-write-value advanced=true
    //% blockId=bluetooth_uart_writevalue block="bluetooth uart|write value %name|= %value"
    export function uartWriteValue(name: string, value: number): void {
        uartWriteString((name ? name + ":" : "") + value + NEW_LINE);
    }
}
