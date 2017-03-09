"use strict";

function level_one() {
    var i = sim.iteration;
    var ret = [];

    if (i % 100 === 99) {
        ret.push(new_stupid());
    }
    if (i % 450 === 449) {
        ret.push(new_shooter());
    }

    if (i === 1500) {
        sim.next_level();
    }

    return ret;
}

function level_two() {
    var i = sim.iteration;
    var ret = [];

    if (i === 300) {
        ret.push(make_revolver());
        mixer("warning");
    }

    if (i > 500 && sim.entities.length === 0) {
        sim.next_level();
    }

    return ret;
}

function level_three() {
    var i = sim.iteration;
    var ret = [];

    if (i > 2000) {
        if (sim.entities.length === 0) {
            sim.next_level();
        }
    } else {
        if (i % 100 === 99) {
            ret.push(new_chaser());
        }
        if (i % 350 === 349) {
            ret.push(new_shooter());
        }
    }

    return ret;
}

function level_four() {
    var i = sim.iteration;
    var ret = [];

    if (i === 100) {
        ret.push(make_shooter_shooter());
        mixer("warning");
    }

    if (i > 300 && sim.entities.length === 0) {
        sim.next_level();
    }

    return ret;
}

function level_five() {
    var i = sim.iteration;
    var ret = [];

    if (i > 2000) {
        if (sim.entities.length === 0) {
            sim.next_level();
        }
    } else {
        if (i % 40 === 39) {
            ret.push(new_boulder());
        }
    }

    return ret;
}

function level_six() {
    var i = sim.iteration;
    var ret = [];

    if (i % 100 === 99) {
        ret.push(new_apple());
    }
    if (i === 300) {
        ret.push(make_snake());
        mixer("warning");
    }

    if (i > 500 && sim.boss_present() === false) {
        sim.next_level();
    }

    return ret;
}

function enemy_gen() {

    // Each level_x function is responsible for calling sim.next_level() when it's done.

    switch (sim.level) {
    case 1:
        return level_one();
    case 2:
        return level_two();
    case 3:
        return level_three();
    case 4:
        return level_four();
    case 5:
        return level_five();
    case 6:
        return level_six();
    default:
        return [];
    }
}
