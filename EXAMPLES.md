# Claude Buddy — Examples

Three ready-to-use programs. Open the `.ts` file in MakeCode's JavaScript editor,
or import the `.blocks` file to get the block view directly.

---

## 1. Simple Approve / Deny

**Files:** [`examples/simple-approve.ts`](examples/simple-approve.ts) · [`examples/simple-approve.blocks`](examples/simple-approve.blocks)

The minimal starting point. Button A approves, button B denies.
The display shows what's happening at every step.

```
┌──────────────────────────────┐
│ on start                     │
│  [start Claude Buddy]        │
│  show icon ◆                 │
└──────────────────────────────┘

┌──────────────────────────────┐   ┌──────────────────────────────┐
│ on Claude connected          │   │ on Claude disconnected       │
│  show icon ♥                 │   │  show icon ◆                 │
└──────────────────────────────┘   └──────────────────────────────┘

┌──────────────────────────────┐   ┌──────────────────────────────┐
│ on Claude permission request │   │ on Claude response           │
│  show string [pending tool]  │   │  show icon ♥                 │
│  show leds (chessboard)      │   └──────────────────────────────┘
└──────────────────────────────┘

┌──────────────────────────────┐   ┌──────────────────────────────┐
│ on button A pressed          │   │ on button B pressed          │
│  if [permission pending?]    │   │  if [permission pending?]    │
│    [approve permission]      │   │    [deny permission]         │
│    show icon ✓               │   │    show icon ✗               │
│    pause 500                 │   │    pause 500                 │
│    show icon ♥               │   │    show icon ♥               │
└──────────────────────────────┘   └──────────────────────────────┘
```

---

## 2. Status Dashboard

**Files:** [`examples/status-dashboard.ts`](examples/status-dashboard.ts) · [`examples/status-dashboard.blocks`](examples/status-dashboard.blocks)

Shows live Claude activity counts. The display updates automatically on every
heartbeat — shows waiting task count when tasks are blocked, a music note when
Claude is busy, or a heart when idle. Press A+B to scroll through all stats.

```
┌──────────────────────────────┐
│ on start                     │
│  [start Claude Buddy]        │
│  show icon ◆                 │
└──────────────────────────────┘

┌──────────────────────────────────────┐
│ on Claude heartbeat                  │
│  if [waiting tasks] > 0              │
│    show number [waiting tasks]       │
│  else if [running tasks] > 0         │
│    show icon ♪                       │
│  else                                │
│    show icon ♥                       │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ on Claude permission request         │
│  show string [pending tool]          │
│  show string [pending hint]          │
└──────────────────────────────────────┘

┌──────────────────────────────┐   ┌──────────────────────────────┐
│ on button A pressed          │   │ on button B pressed          │
│  if [permission pending?]    │   │  if [permission pending?]    │
│    [approve permission]      │   │    [deny permission]         │
│    show icon ✓               │   │    show icon ✗               │
└──────────────────────────────┘   └──────────────────────────────┘

┌────────────────────────────────────────────┐
│ on button A+B pressed                      │
│  show string "Run " + [running tasks]      │
│  show string "Wait " + [waiting tasks]     │
│  show string "Tok " + [tokens today]       │
│  show string "OK " + [approvals]           │
│  show string "No " + [denials]             │
└────────────────────────────────────────────┘
```

---

## 3. Sound and Light

**Files:** [`examples/sound-and-light.ts`](examples/sound-and-light.ts) · [`examples/sound-and-light.blocks`](examples/sound-and-light.blocks)

Full audio and visual feedback for every Claude event. A good starting point
for adding Calliope RGB LED colors. Connect = rising C–E–G chord.
Disconnect = falling G–E–C chord. Permission request = three alert beeps.
Approve = high C. Deny = deep low C.

```
┌──────────────────────────────┐
│ on start                     │
│  [start Claude Buddy]        │
│  show icon ◆                 │
└──────────────────────────────┘

┌────────────────────────────────┐   ┌────────────────────────────────┐
│ on Claude connected            │   │ on Claude disconnected         │
│  show icon ♥                   │   │  show icon ◆                   │
│  play tone C5 1/8              │   │  play tone G4 1/8              │
│  play tone E5 1/8              │   │  play tone E4 1/8              │
│  play tone G5 1/4              │   │  play tone C4 1/4              │
└────────────────────────────────┘   └────────────────────────────────┘

┌──────────────────────────────────────┐
│ on Claude permission request         │
│  play tone A5 1/8  (×3 alert)        │
│  show string [pending tool]          │
│  show string [pending hint]          │
│  show leds (chessboard pattern)      │
└──────────────────────────────────────┘

┌──────────────────────────────┐
│ on Claude response           │
│  play tone E5 1/16           │
│  show icon ◇  pause 300      │
│  show icon ♥                 │
└──────────────────────────────┘

┌──────────────────────────────┐   ┌──────────────────────────────┐
│ on button A pressed          │   │ on button B pressed          │
│  if [permission pending?]    │   │  if [permission pending?]    │
│    [approve permission]      │   │    [deny permission]         │
│    play tone C6 1/4          │   │    play tone C3 1/2          │
│    show icon ✓  pause 600    │   │    show icon ✗  pause 600    │
│    show icon ♥               │   │    show icon ♥               │
└──────────────────────────────┘   └──────────────────────────────┘

┌──────────────────────────────────────┐
│ on button A+B pressed                │
│  show string "A" + [approvals]       │
│             + " D" + [denials]       │
└──────────────────────────────────────┘
```

---

## Tips for extending these examples

- **RGB LED (Calliope mini):** Add `calliope.setRGB(r, g, b)` calls — green for connected, orange for permission pending, red for denied
- **More events:** Use `on Claude heartbeat` to animate an idle pattern
- **Countdown timer:** After a permission request, start a timer and auto-deny after 10 seconds if no button is pressed
- **Score display:** Show `approvals` and `denials` as a running score using `show string`
