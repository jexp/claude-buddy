#include "pxt.h"
#include "MicroBitUARTService.h"
#include "ble.h"
#include "ble_gap.h"

using namespace pxt;

/**
 * Support for additional Bluetooth services.
 */
//% color=#0082FB weight=96 icon="\uf294"
namespace bluetooth {
    MicroBitUARTService *uart = NULL;

    /**
    *  Starts the Bluetooth UART service
    */
    //% help=bluetooth/start-uart-service
    //% blockId=bluetooth_start_uart_service block="bluetooth uart service"
    //% parts="bluetooth" advanced=true
    void startUartService() {
        if (uart) return;
        uart = new MicroBitUARTService(*uBit.ble, 61, 60);
    }

    //%
    void uartWriteString(String data) {
        startUartService();
        uart->send(MSTR(data));
    }

    //%
    String uartReadUntil(String del) {
        startUartService();
        return PSTR(uart->readUntil(MSTR(del)));
    }

    //%
    void uartWriteBuffer(Buffer buffer) {
        startUartService();
        uart->send(buffer->data, buffer->length);
    }

    //%
    Buffer uartReadBuffer() {
        startUartService();
        int bytes = uart->rxBufferedSize();
        auto buffer = mkBuffer(NULL, bytes);
        auto res = buffer;
        registerGCObj(buffer);
        int read = uart->read(buffer->data, buffer->length);
        if (read < 0) {
            res = mkBuffer(NULL, 0);
        } else if (read != buffer->length) {
            res = mkBuffer(buffer->data, read);
        }
        unregisterGCObj(buffer);
        return res;
    }

    /**
    * Registers an event to be fired when one of the delimiter is matched.
    * @param delimiters the characters to match received characters against.
    */
    //% help=bluetooth/on-uart-data-received
    //% weight=18 blockId=bluetooth_on_data_received block="bluetooth|on data received %delimiters=serial_delimiter_conv"
    void onUartDataReceived(String delimiters, Action body) {
        startUartService();
        uart->eventOn(MSTR(delimiters));
        registerWithDal(MICROBIT_ID_BLE_UART, MICROBIT_UART_S_EVT_DELIM_MATCH, body);
    }

    /**
     * Register code to run when the micro:bit is connected to over Bluetooth
     * @param body Code to run when a Bluetooth connection is established
     */
    //% help=bluetooth/on-bluetooth-connected weight=20
    //% blockId=bluetooth_on_connected block="on bluetooth connected" blockGap=8
    //% parts="bluetooth"
    void onBluetoothConnected(Action body) {
        registerWithDal(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_CONNECTED, body);
    }

    /**
     * Register code to run when a bluetooth connection to the micro:bit is lost
     * @param body Code to run when a Bluetooth connection is lost
     */
    //% help=bluetooth/on-bluetooth-disconnected weight=19
    //% blockId=bluetooth_on_disconnected block="on bluetooth disconnected"
    //% parts="bluetooth"
    void onBluetoothDisconnected(Action body) {
        registerWithDal(MICROBIT_ID_BLE, MICROBIT_BLE_EVT_DISCONNECTED, body);
    }

    /**
     * Sets the BLE GAP device name. Call before startUartService().
     * Name must start with "Claude" for Claude Desktop Hardware Buddy to connect.
     * @param name the device name to advertise, eg: "Claude mini"
     */
    //% blockId=bluetooth_set_device_name block="bluetooth set device name %name"
    //% parts=bluetooth weight=6 advanced=true
    void setDeviceName(String name) {
        ManagedString n = MSTR(name);
        ble_gap_conn_sec_mode_t perm;
        BLE_GAP_CONN_SEC_MODE_SET_NO_ACCESS(&perm);
        sd_ble_gap_device_name_set(&perm, (const uint8_t *)n.toCharArray(), n.length());
    }
}
