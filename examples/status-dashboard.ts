// Status Dashboard
// Shows live Claude stats on the display.
// Heartbeat updates the running/waiting count automatically.
// A+B scrolls through all stats.

claudeBuddy.start()
basic.showIcon(IconNames.SmallDiamond)

claudeBuddy.onConnected(function () {
    basic.showIcon(IconNames.Heart)
})

claudeBuddy.onDisconnected(function () {
    basic.showIcon(IconNames.SmallDiamond)
})

// Update display on every heartbeat
claudeBuddy.onHeartbeat(function () {
    if (claudeBuddy.waitingTasks() > 0) {
        // Tasks blocked waiting for permission — show count
        basic.showNumber(claudeBuddy.waitingTasks())
    } else if (claudeBuddy.runningTasks() > 0) {
        // Claude is busy
        basic.showIcon(IconNames.EigthNote)
    } else {
        // Idle
        basic.showIcon(IconNames.Heart)
    }
})

claudeBuddy.onPermission(function () {
    basic.showString(claudeBuddy.pendingTool())
    basic.showString(claudeBuddy.pendingHint())
})

claudeBuddy.onTurn(function () {
    basic.showIcon(IconNames.Diamond)
    basic.pause(300)
    basic.showIcon(IconNames.Heart)
})

input.onButtonPressed(Button.A, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.approve()
        basic.showIcon(IconNames.Yes)
        basic.pause(400)
    }
})

input.onButtonPressed(Button.B, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.deny()
        basic.showIcon(IconNames.No)
        basic.pause(400)
    }
})

// A+B: scroll through all stats
input.onButtonPressed(Button.AB, function () {
    basic.showString("Run " + claudeBuddy.runningTasks())
    basic.showString("Wait " + claudeBuddy.waitingTasks())
    basic.showString("Tok " + claudeBuddy.tokensToday())
    basic.showString("OK " + claudeBuddy.approvals())
    basic.showString("No " + claudeBuddy.denials())
})
