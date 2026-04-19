/**
 * Claude Buddy — connect your Calliope mini to Claude Desktop
 * Blocks for kids to approve/deny AI tool permissions over Bluetooth.
 */
//% color=#7B2FBE weight=95 icon="\uf2db"
//% groups='["Setup","Events","Actions"]'
namespace claudeBuddy {

    // ── Internal event IDs ──────────────────────────────────────────────────
    const EVT_BASE        = 9000
    const EVT_CONNECTED    = 1
    const EVT_DISCONNECTED = 2
    const EVT_PERMISSION   = 3
    const EVT_TURN         = 4
    const EVT_HEARTBEAT    = 5

    // ── State ───────────────────────────────────────────────────────────────
    let _pendingId    = ""
    let _pendingTool  = ""
    let _rxBuf        = ""
    let _connected    = false
    let _approveCount = 0
    let _denyCount    = 0
    let _running      = 0
    let _waiting      = 0
    let _tokensToday  = 0
    let _pendingHint  = ""

    // ── Tiny JSON helpers (no JSON.parse in MakeCode) ───────────────────────
    function jStr(json: string, key: string): string {
        if (!json) return ""
        let s = '"' + key + '":"'
        let i = json.indexOf(s)
        if (i < 0) return ""
        i += s.length
        let j = json.indexOf('"', i)
        return j < 0 ? "" : json.substr(i, j - i)
    }
    function jNum(json: string, key: string): number {
        if (!json) return -1
        let s = '"' + key + '":'
        let i = json.indexOf(s)
        if (i < 0) return -1
        i += s.length
        let j = i
        while (j < json.length && "0123456789.-".indexOf(json.charAt(j)) >= 0) j++
        return parseFloat(json.substr(i, j - i))
    }
    function jHas(json: string, key: string): boolean {
        if (!json) return false
        return json.indexOf('"' + key + '"') >= 0
    }

    // ── Internal message dispatch ───────────────────────────────────────────
    function _handleLine(line: string): void {
        if (!line || line.length === 0) return
        if (jHas(line, "time")) return                   // time-sync, ignore
        if (jStr(line, "cmd") === "owner") return        // owner info, ignore
        if (jHas(line, "ack")) return                    // ack, ignore

        if (jStr(line, "evt") === "turn") {
            control.raiseEvent(EVT_BASE, EVT_TURN)
            return
        }

        if (jHas(line, "total") || jHas(line, "running")) {
            let r = jNum(line, "running"); if (r >= 0) _running = r
            let w = jNum(line, "waiting"); if (w >= 0) _waiting = w
            let t = jNum(line, "tokens_today"); if (t >= 0) _tokensToday = t
            if (jHas(line, "prompt")) {
                _pendingId   = jStr(line, "id")
                _pendingTool = jStr(line, "tool")
                _pendingHint = jStr(line, "hint")
                control.raiseEvent(EVT_BASE, EVT_PERMISSION)
            } else {
                control.raiseEvent(EVT_BASE, EVT_HEARTBEAT)
            }
            return
        }
    }

    function _setupHandlers(): void {
        bluetooth.onBluetoothConnected(function () {
            _connected = true
            _rxBuf = ""
            control.raiseEvent(EVT_BASE, EVT_CONNECTED)
        })
        bluetooth.onBluetoothDisconnected(function () {
            _connected = false
            _pendingId = ""
            _rxBuf = ""
            control.raiseEvent(EVT_BASE, EVT_DISCONNECTED)
        })
        bluetooth.onUartDataReceived(serial.delimiters(Delimiters.NewLine), function () {
            let chunk = bluetooth.uartReadUntil(serial.delimiters(Delimiters.NewLine))
            if (chunk) _rxBuf += chunk
            let nl = _rxBuf.indexOf("\n")
            while (nl >= 0) {
                let line = _rxBuf.substr(0, nl).trim()
                _rxBuf = _rxBuf.substr(nl + 1)
                _handleLine(line)
                nl = _rxBuf.indexOf("\n")
            }
        })
    }

    // ── Setup ───────────────────────────────────────────────────────────────

    /**
     * Start Claude Buddy. Sets the BLE name and begins advertising.
     * Always call this first, before any other Claude Buddy blocks.
     */
    //% blockId=claude_buddy_start
    //% block="start Claude Buddy"
    //% weight=100 group="Setup"
    export function start(): void {
        bluetooth.setDeviceName("Claude " + (control.deviceName() || "mini"))
        _setupHandlers()
        bluetooth.startUartService()
    }

    // ── Event handlers ──────────────────────────────────────────────────────

    /**
     * Run code when Claude Desktop connects.
     */
    //% blockId=claude_buddy_on_connected
    //% block="on Claude connected"
    //% weight=90 group="Events"
    export function onConnected(handler: () => void): void {
        control.onEvent(EVT_BASE, EVT_CONNECTED, handler)
    }

    /**
     * Run code when Claude Desktop disconnects.
     */
    //% blockId=claude_buddy_on_disconnected
    //% block="on Claude disconnected"
    //% weight=89 group="Events"
    export function onDisconnected(handler: () => void): void {
        control.onEvent(EVT_BASE, EVT_DISCONNECTED, handler)
    }

    /**
     * Run code when Claude asks for permission to use a tool.
     * Use the ``pending tool`` and ``pending hint`` blocks to see what's waiting.
     */
    //% blockId=claude_buddy_on_permission
    //% block="on Claude permission request"
    //% weight=88 group="Events"
    export function onPermission(handler: () => void): void {
        control.onEvent(EVT_BASE, EVT_PERMISSION, handler)
    }

    /**
     * Run code on every heartbeat from Claude (running/waiting counts updated).
     */
    //% blockId=claude_buddy_on_heartbeat
    //% block="on Claude heartbeat"
    //% weight=86 group="Events"
    export function onHeartbeat(handler: () => void): void {
        control.onEvent(EVT_BASE, EVT_HEARTBEAT, handler)
    }

    /**
     * Run code when Claude finishes a response turn.
     */
    //% blockId=claude_buddy_on_turn
    //% block="on Claude response"
    //% weight=87 group="Events"
    export function onTurn(handler: () => void): void {
        control.onEvent(EVT_BASE, EVT_TURN, handler)
    }

    // ── Actions ─────────────────────────────────────────────────────────────

    /**
     * Approve the pending tool permission (allow once).
     */
    //% blockId=claude_buddy_approve
    //% block="approve permission"
    //% weight=80 group="Actions"
    export function approve(): void {
        if (_pendingId === "") return
        bluetooth.uartWriteString(
            '{"cmd":"permission","id":"' + _pendingId + '","decision":"once"}\n'
        )
        _approveCount++
        _pendingId = ""
        _pendingTool = ""
    }

    /**
     * Deny the pending tool permission.
     */
    //% blockId=claude_buddy_deny
    //% block="deny permission"
    //% weight=79 group="Actions"
    export function deny(): void {
        if (_pendingId === "") return
        bluetooth.uartWriteString(
            '{"cmd":"permission","id":"' + _pendingId + '","decision":"deny"}\n'
        )
        _denyCount++
        _pendingId = ""
        _pendingTool = ""
    }

    // ── Values ───────────────────────────────────────────────────────────────

    /**
     * The tool Claude is asking permission for (e.g. "Bash", "computer").
     */
    //% blockId=claude_buddy_pending_tool
    //% block="pending tool"
    //% weight=72 group="Actions"
    export function pendingTool(): string {
        return _pendingTool
    }

    /**
     * A short description of what Claude wants to do with the tool.
     */
    //% blockId=claude_buddy_pending_hint
    //% block="pending hint"
    //% weight=71 group="Actions"
    export function pendingHint(): string {
        return _pendingHint
    }

    /**
     * True if there is a permission request waiting to be approved or denied.
     */
    //% blockId=claude_buddy_has_pending
    //% block="permission pending?"
    //% weight=70 group="Actions"
    export function hasPending(): boolean {
        return _pendingId !== ""
    }

    /**
     * True if Claude Desktop is currently connected.
     */
    //% blockId=claude_buddy_is_connected
    //% block="Claude connected?"
    //% weight=69 group="Actions"
    export function isConnected(): boolean {
        return _connected
    }

    /**
     * Number of permissions approved this session.
     */
    //% blockId=claude_buddy_approve_count
    //% block="approvals"
    //% weight=60 group="Actions"
    export function approvals(): number {
        return _approveCount
    }

    /**
     * Number of permissions denied this session.
     */
    //% blockId=claude_buddy_deny_count
    //% block="denials"
    //% weight=59 group="Actions"
    export function denials(): number {
        return _denyCount
    }

    /**
     * Number of Claude tasks currently running.
     */
    //% blockId=claude_buddy_running
    //% block="running tasks"
    //% weight=55 group="Actions"
    export function runningTasks(): number {
        return _running
    }

    /**
     * Number of Claude tasks waiting for permission.
     */
    //% blockId=claude_buddy_waiting
    //% block="waiting tasks"
    //% weight=54 group="Actions"
    export function waitingTasks(): number {
        return _waiting
    }

    /**
     * Tokens used by Claude today.
     */
    //% blockId=claude_buddy_tokens
    //% block="tokens today"
    //% weight=53 group="Actions"
    export function tokensToday(): number {
        return _tokensToday
    }
}
