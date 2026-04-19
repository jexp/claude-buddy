# Claude Buddy

**MakeCode extension for Calliope mini and micro:bit**

Connect your **Calliope mini** (2 or 3) or **micro:bit** (v1 or v2) to **Claude Desktop** via Bluetooth and let kids approve or deny AI tool permissions with physical buttons — no screen, no keyboard required.

Claude Desktop has a built-in "Hardware Buddy" developer feature (enable via *Help → Troubleshooting → Developer Mode*) that sends permission requests over Bluetooth whenever Claude wants to run a tool (e.g. a shell command or file operation). This extension gives you drag-and-drop blocks to receive those requests, show information on the device, and respond with a button press.

---

## Blocks

### Setup

| Block | What it does |
|---|---|
| `start Claude Buddy` | Sets the BLE device name to `"Claude <friendly-name>"` and starts advertising. **Always call this first.** |

### Events

These blocks run your code automatically when something happens.

| Block | When it fires |
|---|---|
| `on Claude connected` | Claude Desktop found and connected to the device |
| `on Claude disconnected` | The Bluetooth connection was lost |
| `on Claude heartbeat` | Claude sent an update — running/waiting counts may have changed |
| `on Claude permission request` | Claude wants to use a tool and needs your approval |
| `on Claude response` | Claude finished writing a response turn |

### Actions

| Block | What it does |
|---|---|
| `approve permission` | Tells Claude Desktop to allow the pending tool (once) |
| `deny permission` | Tells Claude Desktop to block the pending tool |

### Values

These blocks return the current value of something — use them inside other blocks.

| Block | Type | What it returns |
|---|---|---|
| `permission pending?` | boolean | `true` when a tool is waiting for approval |
| `Claude connected?` | boolean | `true` when Desktop is connected |
| `pending tool` | text | Name of the tool asking permission, e.g. `"Bash"` |
| `pending hint` | text | Short description of what Claude wants to do |
| `running tasks` | number | How many Claude tasks are currently running |
| `waiting tasks` | number | How many tasks are waiting for permission |
| `tokens today` | number | Total tokens Claude has used today |
| `approvals` | number | Permissions approved this session |
| `denials` | number | Permissions denied this session |

---

## Example program

```typescript
claudeBuddy.start()
basic.showIcon(IconNames.SmallDiamond)

claudeBuddy.onConnected(function () {
    basic.showIcon(IconNames.Heart)
    music.playTone(Note.C5, music.beat(BeatFraction.Quarter))
})

claudeBuddy.onPermission(function () {
    basic.showString(claudeBuddy.pendingTool())
    basic.showString(claudeBuddy.pendingHint())
})

input.onButtonPressed(Button.A, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.approve()
        basic.showIcon(IconNames.Yes)
    }
})

input.onButtonPressed(Button.B, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.deny()
        basic.showIcon(IconNames.No)
    }
})
```

---

## Compatibility

| Device | Status |
|---|---|
| Calliope mini 3 | ✅ Primary target |
| Calliope mini 2 | ✅ Same DAL |
| micro:bit v1 | ✅ Same DAL (`uBit.bleManager`) |
| micro:bit v2 | ⚠️ Should work via compatibility layer — test and report |

The `supportedTargets` field in `pxt.json` lists both `calliope3` and `microbit`. The underlying C++ uses `uBit.bleManager`, which is the same API across Calliope mini and micro:bit v1. On micro:bit v2 (CODAL), MakeCode provides a compatibility shim — if you hit an issue there, open an issue on this repo.

---

<details>
<summary>Protocol &amp; implementation details</summary>

### Claude Desktop BLE protocol

Claude Desktop's Hardware Buddy feature (developer mode only) communicates over **Bluetooth Low Energy** using the **Nordic UART Service (NUS)** — the same BLE profile used by micro:bit and Calliope mini out of the box.

**Service UUIDs:**
- Service: `6E400001-B5A3-F393-E0A9-E50E24DCCA9E`
- RX (Desktop → device): `6E400002-B5A3-F393-E0A9-E50E24DCCA9E`
- TX (Device → desktop): `6E400003-B5A3-F393-E0A9-E50E24DCCA9E`

**Message format:** UTF-8 JSON, one object per line, `\n` terminated, chunked into 20-byte BLE packets.

**Desktop → device messages:**

```json
// Heartbeat (sent on change and every ~10 s)
{"total":3,"running":1,"waiting":1,"tokens_today":31200}

// Permission request (heartbeat with "prompt" field added)
{"total":3,"running":2,"waiting":1,"tokens_today":31200,
 "prompt":{"id":"req_abc","tool":"Bash","hint":"run ls -la"}}

// Turn event (after each assistant response, dropped if > 4 KB)
{"evt":"turn","role":"assistant","content":[{"type":"text","text":"..."}]}

// Owner info (sent on connect)
{"cmd":"owner","name":"Michael"}
```

**Device → desktop messages:**

```json
// Approve
{"cmd":"permission","id":"req_abc","decision":"once"}

// Deny
{"cmd":"permission","id":"req_abc","decision":"deny"}
```

**Discovery:** Claude Desktop scans for BLE devices whose advertisement name **starts with `"Claude"`**. Standard Calliope mini and micro:bit devices advertise as `"Calliope [xxxxx]"` or `"BBC micro:bit [xxxxx]"`, so they are not found by default.

### What we added to the Bluetooth library

The standard Calliope bluetooth MakeCode extension does not expose a way to change the BLE advertisement name at runtime. We added one function to the three extension files:

**`bluetooth.cpp`** — C++ implementation using the micro:bit DAL:
```cpp
void setDeviceName(String name) {
    uBit.bleManager.setDeviceName(MSTR(name));
}
```
This updates the GAP device name in the BLE stack. Calling it before `startUartService()` ensures the new name is used in the advertisement and scan response packets.

**`shims.d.ts`** — TypeScript declaration that links the C++ function to MakeCode's device build:
```typescript
//% shim=bluetooth::setDeviceName
function setDeviceName(name: string): void;
```

**`bluetooth.ts`** — Simulator stub (no-op in the browser IDE, C++ is used on device):
```typescript
export function setDeviceName(name: string): void {
    // simulator stub
}
```

The `claude-buddy.ts` namespace wraps the full NUS + JSON protocol into the high-level blocks described above, including:
- Line-buffered reassembly of 20-byte BLE chunks into complete JSON lines
- String-based JSON field extraction (MakeCode has no `JSON.parse`)
- Event routing via `control.raiseEvent` / `control.onEvent`
- State tracking for pending permission ID, tool name, hint, and counters

</details>
