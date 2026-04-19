// Sound and Light
// Rich audio and visual feedback for every Claude event.
// Great starting point for adding your own Calliope RGB LED colors.

claudeBuddy.start()
basic.showIcon(IconNames.SmallDiamond)

claudeBuddy.onConnected(function () {
    basic.showIcon(IconNames.Heart)
    music.playTone(Note.C5, music.beat(BeatFraction.Eighth))
    music.playTone(Note.E5, music.beat(BeatFraction.Eighth))
    music.playTone(Note.G5, music.beat(BeatFraction.Quarter))
})

claudeBuddy.onDisconnected(function () {
    basic.showIcon(IconNames.SmallDiamond)
    music.playTone(Note.G4, music.beat(BeatFraction.Eighth))
    music.playTone(Note.E4, music.beat(BeatFraction.Eighth))
    music.playTone(Note.C4, music.beat(BeatFraction.Quarter))
})

claudeBuddy.onHeartbeat(function () {
    if (claudeBuddy.waitingTasks() > 0) {
        basic.showNumber(claudeBuddy.waitingTasks())
    } else {
        basic.showIcon(IconNames.Heart)
    }
})

claudeBuddy.onPermission(function () {
    // Three alert beeps
    music.playTone(Note.A5, music.beat(BeatFraction.Eighth))
    basic.pause(80)
    music.playTone(Note.A5, music.beat(BeatFraction.Eighth))
    basic.pause(80)
    music.playTone(Note.A5, music.beat(BeatFraction.Eighth))
    // Scroll tool name then hint
    basic.showString(claudeBuddy.pendingTool())
    basic.showString(claudeBuddy.pendingHint())
    // Flash chessboard — waiting for button
    basic.showLeds(`
        # . # . #
        . # . # .
        # . # . #
        . # . # .
        # . # . #
    `)
})

claudeBuddy.onTurn(function () {
    music.playTone(Note.E5, music.beat(BeatFraction.Sixteenth))
    basic.showIcon(IconNames.Diamond)
    basic.pause(300)
    basic.showIcon(IconNames.Heart)
})

input.onButtonPressed(Button.A, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.approve()
        music.playTone(Note.C6, music.beat(BeatFraction.Quarter))
        basic.showIcon(IconNames.Yes)
        basic.pause(600)
        basic.showIcon(IconNames.Heart)
    }
})

input.onButtonPressed(Button.B, function () {
    if (claudeBuddy.hasPending()) {
        claudeBuddy.deny()
        music.playTone(Note.C3, music.beat(BeatFraction.Half))
        basic.showIcon(IconNames.No)
        basic.pause(600)
        basic.showIcon(IconNames.Heart)
    }
})

input.onButtonPressed(Button.AB, function () {
    basic.showString(
        "A" + claudeBuddy.approvals() +
        " D" + claudeBuddy.denials()
    )
})
