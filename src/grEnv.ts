import Actor = require("./Actor");

export class grEnv {
    game: Phaser.Game;
    squab: Actor.PlayerActor = new Actor.PlayerActor();
    cursors: Phaser.CursorKeys;
    collisionLayer: Phaser.TilemapLayer;
    map: Phaser.Tilemap;
    clutched: boolean = false;
}