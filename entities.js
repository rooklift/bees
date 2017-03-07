"use strict";

// ---------------------------------------------------------------------------------------------
// BASE ENTITY

var base_entity = {
    x: 0,
    y: 0,
    speedx: 0,
    speedy: 0,
    hp: 1,
    sprites: [],
    framerate: 60,
    scary: false,
    harmless: false,
    death_sound: "enemy_death",
    score: 0
};

base_entity.draw = function () {
    var sprite_index;
    var sprite;

    sprite_index = Math.floor(sim.iteration / this.framerate) % this.sprites.length;
    sprite = this.sprites[sprite_index];
    virtue.drawImage(sprite, this.x - sprite.width / 2, this.y - sprite.height / 2);
};

base_entity.move = function () {
    this.x += this.speedx;
    this.y += this.speedy;
};

base_entity.act = function () {
    return;
};

base_entity.out_of_bounds = function () {
    if (this.x < -200 || this.x > canvas.width + 200 || this.y < -200 || this.y > canvas.height + 200) {
        return true;
    }
    return false;
};

base_entity.damage = function () {
    var n;
    var arr = sim.bees;
    var len = sim.bees.length;
    var bee;
    var dx;
    var dy;

    for (n = 0; n < len; n += 1) {
        bee = arr[n];
        dx = Math.abs(bee.x - this.x);
        dy = Math.abs(bee.y - this.y);
        if (dx < this.sprites[0].width / 2 + MARGIN_OF_ERROR) {
            if (dy < this.sprites[0].height / 2 + MARGIN_OF_ERROR) {
                this.hp -= 1;
            }
        }
    }
};

base_entity.unit_vector_to_player = function () {
    return unit_vector(this.x, this.y, sim.player.x, sim.player.y);
};

base_entity.collides_with_player = function () {
    var dx = Math.abs(this.x - sim.player.x);
    var dy = Math.abs(this.y - sim.player.y);
    if (dx < sim.player.sprites[0].width / 2 && dy < sim.player.sprites[0].height / 2) {
        return true;
    }
    return false;
};

// ---------------------------------------------------------------------------------------------
// STUPID

var base_stupid = Object.create(base_entity);
base_stupid.sprites = newimagearray("res/stupid.png");
base_stupid.score = 10;

// ---------------------------------------------------------------------------------------------
// SHOT

var base_shot = Object.create(base_entity);
base_shot.sprites = newimagearray("res/shot.png");

base_shot.damage = function () {
    return;
};

// ---------------------------------------------------------------------------------------------
// SHOT (BLUE VERSION)

var base_shot_blue = Object.create(base_shot);
base_shot_blue.sprites = newimagearray("res/shot_blue.png");

// ---------------------------------------------------------------------------------------------
// SHOOTER

var base_shooter = Object.create(base_entity);
base_shooter.sprites = newimagearray("res/shooter.png");
base_shooter.score = 100;

base_shooter.thing_we_shoot = base_shot;
base_shooter.shotspeed = 5;
base_shooter.shotrate = 50;
base_shooter.age = 0;

base_shooter.can_shoot = function () {
    if (this.age % this.shotrate === Math.floor(this.shotrate / 2) && sim.player.alive) {
        if (this.x > 0 && this.x < canvas.width && this.y > 0 && this.y < canvas.height) {
            return true;
        }
    }
    return false;
};

base_shooter.act = function () {
    this.age += 1;

    var new_shot;
    var vector;

    if (this.can_shoot()) {

        new_shot = Object.create(this.thing_we_shoot);
        new_shot.x = this.x;
        new_shot.y = this.y;

        vector = this.unit_vector_to_player();
        new_shot.speedx = vector[0] * this.shotspeed;
        new_shot.speedy = vector[1] * this.shotspeed;

        sim.entities.push(new_shot);
    }
};

// ---------------------------------------------------------------------------------------------
// CHASER

var base_chaser = Object.create(base_entity);
base_chaser.sprites = newimagearray("res/chaser.png");
base_chaser.score = 100;

base_chaser.finished = false;

base_chaser.move = function () {

    if (sim.player.alive && this.finished === false) {
        var vector = this.unit_vector_to_player();
        this.speedx = vector[0] * 8;
        this.speedy = vector[1] * 8;
    } else {
        this.finished = true;
    }

    // Make sure that finished chasers eventually go out of bounds to get removed...

    if (this.finished && Math.abs(this.speedx) < 1 && Math.abs(this.speedy) < 1) {
        if (this.x > canvas.width / 2) {
            this.speedx = 1;
        } else {
            this.speedx = -1;
        }
    }

    this.x += this.speedx;
    this.y += this.speedy;
};

base_chaser.draw = function () {
    if (sim.player.alive && this.finished === false) {
        draw_line(this.x, this.y, sim.player.x, sim.player.y, "#ffff00");
    }
    base_entity.draw.apply(this);
};

// ---------------------------------------------------------------------------------------------
// CONSTRUCTORS

function new_stupid() {
    var e = Object.create(base_stupid);
    e.x = canvas.width + 32;
    e.y = Math.random() * canvas.height;
    e.speedx = Math.random() * -3 - 1;
    e.speedy = Math.random() * 4 - 2;
    return e;
}

function new_shooter() {
    var e = Object.create(base_shooter);
    e.x = canvas.width + 32;
    e.y = Math.random() * canvas.height;
    e.speedx = -3;
    return e;
}

function new_chaser() {
    var e = Object.create(base_chaser);
    if (sim.player.x > canvas.width / 2) {
        e.x = -32;
    } else {
        e.x = canvas.width + 32;
    }
    e.y = Math.random() * canvas.height;
    return e;
}
