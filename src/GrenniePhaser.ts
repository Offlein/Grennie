import {grEnv} from 'src/grEnv';

var env = new grEnv();

class GrenniePhaser {
    constructor() {
        env.game = new Phaser.Game(1024, 800, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            collisionHandler: this.collisionHandler
        });
    }

    preload()
    {
        env.game.load.tilemap("map001", "assets/maps/map001.json", null, Phaser.Tilemap.TILED_JSON);
        env.game.load.image("tiles001", "assets/tiles/tiles001.png");
        env.game.load.spritesheet("squab", "assets/sprites/squab3.png", 64, 64, 17, 1, 1);
    }

    create()
    {
        /* Tilemap */
        env.map = env.game.add.tilemap("map001", 80, 80, 64, 64);
        env.map.addTilesetImage("tiles001");

        env.collisionLayer = env.map.createLayer(1);
        env.map.setCollision(1, true, env.collisionLayer);

        var layer = env.map.createLayer(0);
        layer.resizeWorld();

        /* Squab animations */
        env.squab.sprite = env.game.add.sprite(36, 104, "squab");
        env.squab.sprite.anchor.setTo(0.5, 0.5);
        env.squab.sprite.animations.add("idle", [0,1], 0.5, true);
        env.squab.sprite.animations.add("walk", [2,3,4,5], 9, true);
        env.squab.sprite.animations.add("clutch", [6,7], 15, false);
        env.squab.sprite.animations.add("squat", [8,9, 10], 15, false);
        env.squab.sprite.animations.add("jump", [11], 1, false);
        env.squab.sprite.animations.add("fall", [12,13], 15, false);
        env.squab.sprite.animations.add("jumpangle", [14,15,16], 15, false);
        env.squab.sprite.animations.play('idle');

        env.cursors = env.game.input.keyboard.createCursorKeys();

        env.game.physics.enable(env.squab.sprite, Phaser.Physics.ARCADE);

        env.game.physics.arcade.gravity.y = 980;

        env.squab.sprite.body.setSize(46, 58, 5, 0);
        env.squab.sprite.body.collideWorldBounds = true;

        env.game.camera.follow(env.squab.sprite);
    }

    update()
    {
        env.game.physics.arcade.collide(env.squab.sprite, env.collisionLayer, this.collisionHandler);

        if (env.squab.action != 'clutchpop') {
            env.squab.sprite.body.velocity.x = 0;
        }

        if (!env.squab.tweening && !env.squab.clutchCooldown) {
            if (!env.squab.sprite.body.onFloor()) {
                if (env.squab.sprite.body.velocity.y > 0 && env.squab.action != 'fall') {
                    env.squab.sprite.animations.play("fall");
                    env.squab.action = "fall";
                }
            }

            if (env.cursors.up.isDown) {
                if (env.squab.clutchCooldown) {
                    return;
                }
                if (env.squab.clutched) {
                    if (env.cursors.right.isDown && env.squab.clutched == "right") {
                        env.squab.clutched = null;
                        env.squab.sprite.body.moves = true;
                        //console.log("unclutched by walkleft");
                        env.squab.clutchCooldown = true;
                        env.squab.action = 'clutchpop';
                        env.squab.sprite.animations.play('jumpangle');
                        env.squab.sprite.body.velocity.y = -370;
                        env.squab.sprite.body.velocity.x = 200;
                        setTimeout(function(){
                            env.squab.clutchCooldown = false;
                        }, 200);
                    }
                    else if (env.cursors.left.isDown && env.squab.clutched == "left") {
                        env.squab.clutched = null;
                        env.squab.sprite.body.moves = true;
                        //console.log("unclutched by walkright");
                        env.squab.clutchCooldown = true;
                        env.squab.action = 'clutchpop';
                        env.squab.sprite.animations.play('jumpangle');
                        env.squab.sprite.body.velocity.y = -370;
                        env.squab.sprite.body.velocity.x = -200;
                        setTimeout(function(){
                            env.squab.clutchCooldown = false;
                        }, 200);
                    } else {
                        var popOffVelocity;
                        env.squab.clutched == 'left' ? popOffVelocity = 20 : popOffVelocity = -20;
                        env.squab.clutched = null;
                        env.squab.sprite.body.moves = true;
                        //console.log("unclutched by Jump");
                        env.squab.clutchCooldown = true;
                        env.squab.action = 'clutchpop';
                        env.squab.sprite.animations.play("jumpangle");
                        env.squab.sprite.body.velocity.y = -420;
                        env.squab.sprite.body.velocity.x = popOffVelocity;
                        setTimeout(function () {
                            env.squab.clutchCooldown = false;
                        }, 200);
                    }
                }
                else {
                    // Jump
                    if (env.squab.sprite.body.onFloor()) {
                        if (env.squab.action == 'squat') {
                            env.squab.action = 'jump';
                            env.squab.sprite.animations.play("jump");
                            env.squab.sprite.body.velocity.y = -530;
                        } else if (env.cursors.left.isDown || env.cursors.right.isDown) {
                            env.squab.sprite.animations.play("jumpangle");
                            env.squab.action = 'jump';
                            env.squab.sprite.body.velocity.y = -445;
                        } else if (env.squab.action != 'prejump' && env.squab.action != 'jump') {
                            console.log("jump");
                            env.squab.action = 'prejump';
                            env.squab.sprite.animations.play("squat", 30);
                            setTimeout(function() {
                                //console.log("Jumping");
                                env.squab.action = 'jump';
                                env.squab.sprite.animations.play("jump");
                                env.squab.sprite.body.velocity.y = -530;
                            }, 200);
                        }
                    }
                }
            }

            if (env.cursors.left.isDown) {
                if (env.squab.clutchCooldown) {
                    return;
                }
                if (env.squab.clutched == "right") {
                    env.squab.clutched = null;
                    env.squab.sprite.body.moves = true;
                    //console.log("unclutched by walkleft");
                    env.squab.clutchCooldown = true;
                    setTimeout(function(){
                        env.squab.action = 'jump';
                        env.squab.sprite.animations.play('jumpangle');
                        env.squab.sprite.body.velocity.y = -420;
                        env.squab.clutchCooldown = false;
                    }, 200);
                }
                else if (!env.squab.clutched) {
                    if (env.squab.sprite.scale.x > 0) {
                        env.squab.sprite.scale.x *= -1;
                    }
                    if (env.squab.action != 'prejump' && env.squab.action != 'jump' && env.squab.sprite.body.onFloor()) {
                        env.squab.action = 'walk';
                        env.squab.sprite.animations.play('walk');
                    }
                    env.squab.sprite.body.velocity.x = -200;
                }

            } else if (env.cursors.right.isDown) {
                if (env.squab.clutchCooldown) {
                    return;
                }
                if (env.squab.clutched == "left") {
                    env.squab.clutched = null;
                    env.squab.sprite.body.moves = true;
                    //console.log("unclutched by walkright");
                    env.squab.clutchCooldown = true;
                    setTimeout(function(){
                        env.squab.action = 'jump';
                        env.squab.sprite.animations.play('jumpangle');
                        env.squab.sprite.body.velocity.y = -420;
                        env.squab.clutchCooldown = false;
                    }, 200);
                }
                else if (!env.squab.clutched) {
                    if (env.squab.sprite.scale.x < 0) {
                        env.squab.sprite.scale.x *= -1;
                    }
                    if (env.squab.action != 'prejump' && env.squab.action != 'jump' && env.squab.sprite.body.onFloor()) {
                        env.squab.action = 'walk';
                        env.squab.sprite.animations.play('walk');
                    }
                    env.squab.sprite.body.velocity.x = 200;
                }
            } else {
                if (env.cursors.down.isDown) {
                    if (env.squab.sprite.body.onFloor() && ['squat', 'prejump', 'jump'].indexOf(env.squab.action) == -1) {
                        //console.log("squatting...");
                        env.squab.action = 'squat';
                        env.squab.sprite.animations.play("squat");
                    } else if (env.squab.action == 'clutched') {
                        env.squab.action = null;
                        env.squab.clutched = null;
                        env.squab.sprite.body.moves = true;
                        //console.log("unclutched by walkright");
                        env.squab.clutchCooldown = true;
                        setTimeout(function(){
                            env.squab.clutchCooldown = false;
                        }, 200);
                    }
                } else {
                    if (!env.squab.sprite.body.onFloor() && env.squab.action != 'clutched') {
                        // We're falling or jumping.
                    } else if (['clutched', 'prejump'].indexOf(env.squab.action) == -1) {
                        // We're not clutched and we're not in-air or moving.
                        env.squab.action = 'idle';
                        env.squab.sprite.animations.play('idle');
                    }
                }
            }
        }
    }

    collisionHandler(object, tile)
    {
        // Already transitioning to tile. Just return.
        if (env.squab.clutchCooldown || env.squab.tweening || env.squab.clutched || tile.index != 1
                || tile.layer.name != "collision" // Must be a collision tile
                || tile.worldY > object.y         // Hitting from above
                || (tile.worldY + (tile.height)) < object.y  // Must hit on the upper half of the tile
        ) {
            return;
        }

        // Hit tile from right.
        console.log(env.squab.clutchCooldown);
        if ((tile.faceRight || tile.faceLeft) && tile.faceTop && !env.squab.clutchCooldown) {
            var tileFace;
            tile.faceLeft ? tileFace = 'left' : tileFace = 'right';

            // Ensure there is no tile down and to the right of this one, or even below that.
            for (var i = 1; i <= 2; i++) {
                for (var j = 1; j <= 2; j++) {
                    var checkXPos;
                    tileFace == 'left' ? checkXPos = (tile.x - j) : checkXPos = (tile.x + j);
                    var checkTile = env.map.getTile(checkXPos,(tile.y)+i, "collision");
                    if (checkTile && checkTile.index == 1) {
                        // There's a tile right below Squab. Do nothing.
                        return;
                    }
                }
            }

            //console.log(tile.worldX,',',tile.worldY);
            var xDest;
            // Is this the right-side of the tile?
            tileFace == 'right' ? xDest = tile.worldX-object.width-13 : xDest = tile.worldX-19;
            var dest = {
                'x': xDest,
                'y': (tile.worldY+(tile.height * 0.75))
            };
            env.squab.sprite.body.moves = false;
            env.squab.action = 'clutched';
            env.squab.clutched = (tileFace == 'right' ? 'left' : 'right');
            console.log("Is clutched", env.squab.clutched);
            env.squab.tweening = true;
            //console.log("Clutching to ", dest);
            env.squab.sprite.animations.play("clutch");
            env.game.add.tween(object).to(dest, 150, Phaser.Easing.Circular.Out, true, 0, 0).onComplete.add(function() {
                //console.log("CLUTCHED.");
                env.squab.tweening = false;
                env.squab.clutchCooldown = true;
                env.squab.sprite.body.velocity.y = 0;
                setTimeout(function(){
                    env.squab.clutchCooldown = false;
                }, 100);
            });

        }
        return;
    }
}

export = GrenniePhaser;