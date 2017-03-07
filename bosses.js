"use strict";

// ---------------------------------------------------------------------------------------------
// REVOLVER

function make_revolver() {

    var i;
    var revolver = Object.create(base_entity);
    var new_sub;

    var base_sub = Object.create(base_shooter);
    base_sub.sprites = newimagearray("res/skull.png");

    revolver.score = 1000;
    revolver.subentities = [];
    revolver.death_sound = null;        // We do our own sounds, so this means the main loop doesn't.

    for (i = 0; i < 3; i += 1) {
        new_sub = Object.create(base_sub);
        new_sub.angle = 2.094 * i;
        new_sub.hp = 60;
        revolver.subentities.push(new_sub);
    }

    Object.defineProperty(revolver, "hp", {                                 // hp getter.
        get: function () {
            var n;
            var total_health = 0;
            for (n = 0; n < this.subentities.length; n += 1) {
                total_health += Math.max(0, this.subentities[n].hp);        // Count negatives as zero.
            }
            return total_health;
        }
    });

    var initial_health = revolver.hp;
    var last_sound_iteration = 0;

    revolver.draw = function () {
        var n;

        for (n = 0; n < this.subentities.length; n += 1) {
            if (n > 0) {
                draw_lightning(this.subentities[n].x, this.subentities[n].y, this.subentities[n - 1].x, this.subentities[n - 1].y);
            }
        }

        if (this.subentities.length > 2) {
            draw_lightning(
                this.subentities[0].x, this.subentities[0].y, this.subentities[this.subentities.length - 1].x, this.subentities[this.subentities.length - 1].y
            );
        }

        for (n = 0; n < this.subentities.length; n += 1) {
            this.subentities[n].draw();
        }

        draw_boss_hitpoints(this.hp / initial_health);
    };

    revolver.damage = function () {
        var n;
        var hp_before = this.hp;

        for (n = this.subentities.length - 1; n >= 0; n -= 1) {             // Reversed so we can pop.
            this.subentities[n].damage();
            if (this.subentities[n].hp <= 0) {
                this.subentities.splice(n, 1);
                mixer.play("enemy_death");
            }
        }

        if (this.hp !== hp_before) {                                        // We took damage.
            if (sim.iteration_total - last_sound_iteration > 3) {
                last_sound_iteration = sim.iteration_total;
                mixer.play("click");
            }
        }
    };

    revolver.out_of_bounds = function () {
        return false;
    };

    revolver.collides_with_player = function () {
        var n;
        for (n = 0; n < this.subentities.length; n += 1) {
            if (this.subentities[n].collides_with_player()) {
                return true;
            }
        }
        return false;
    };

    revolver.move = function () {
        var n;
        var sub;

        if (this.x < 100) {
            this.speedx = Math.abs(this.speedx);
        }
        if (this.x > canvas.width - 100) {
            this.speedx = Math.abs(this.speedx) * -1;
        }
        if (this.y < 100) {
            this.speedy = Math.abs(this.speedy);
        }
        if (this.y > canvas.height - 100) {
            this.speedy = Math.abs(this.speedy) * -1;
        }
        this.x += this.speedx;
        this.y += this.speedy;

        for (n = 0; n < this.subentities.length; n += 1) {
            sub = this.subentities[n];
            sub.move();                                     // Uses the base_shooter's move() method...
            sub.x = Math.cos(sub.angle) * 150 + this.x;     // But now overriding the resulting
            sub.y = Math.sin(sub.angle) * 150 + this.y;     // x and y values.
            sub.angle += 0.025;
        }
    };

    revolver.x = canvas.width + 200;
    revolver.y = canvas.height / 2;
    revolver.speedx = -2;
    revolver.speedy = -1;

    return revolver;
}
