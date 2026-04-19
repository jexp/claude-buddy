#include "pxt.h"
#include "ble.h"
#include "ble_gap.h"

using namespace pxt;

/**
 * Support for additional Bluetooth services.
 */
//% color=#0082FB weight=96 icon="\uf294"
namespace bluetooth {

    /**
     * Sets the BLE GAP device name advertised over Bluetooth.
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
