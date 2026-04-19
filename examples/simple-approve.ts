// Simple Approve/Deny
// The most basic Claude Buddy program.
// Button A = approve, Button B = deny.
// LED shows current status at all times.

claudeBuddy.start()
basic.showIcon(IconNames.SmallDiamond)

claudeBuddy.onConnected(function () {
    basic.showIcon(IconNames.Heart)
})

claudeBuddy.onDisconnected(function () {
    basic.showIcon(IconNames.SmallDiamond)
})

claudeBuddy.onPermission(function () {
    basic.showString(claudeBuddy.pendingTool())
    basic.showLeds(`
        # . # . #
        . # . # .
        # . # . #
        . # . # .
        # . # . #
    `)
})

claudeBuddy.onTurn(function () {
    basic.showIcon(IconNames.Heart)
})

input.onButtonPressed(Button.A, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.approve()
        basic.showIcon(IconNames.Yes)
        basic.pause(500)
        basic.showIcon(IconNames.Heart)
    }
})

input.onButtonPressed(Button.B, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.deny()
        basic.showIcon(IconNames.No)
        basic.pause(500)
        basic.showIcon(IconNames.Heart)
    }
})
