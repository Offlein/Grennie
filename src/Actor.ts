import {ActorInterface} from './ActorInterface';

class Actor implements ActorInterface {
    name: string;
    sprite: Phaser.Sprite;
}

export class PlayerActor extends Actor implements ActorInterface {
    action: string = "idle";
    clutched: string = null;
    tweening: boolean = false;
    clutchCooldown: boolean = false;
}
export class NonPlayerActor extends Actor implements ActorInterface {}
