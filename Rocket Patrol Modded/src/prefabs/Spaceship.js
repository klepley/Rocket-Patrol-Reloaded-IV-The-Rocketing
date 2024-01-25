//Spaceship Prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)        //add to existing scene
        this.points = pointValue        //store pointval
        this.moveSpeed = game.settings.spaceshipSpeed              //spaceship speed by pixel
        this.reset()
    }

    update() {
      // Move spaceship based on the movement direction
      this.x += this.moveSpeed * this.moveDirection;
      //this.angle += 1; // You can adjust the rotation speed as needed

      // Wrap from left to right or right to left edge
      if ((this.moveDirection === 1 && this.x > game.config.width) || (this.moveDirection === -1 && this.x < 0 - this.width)) {
          this.reset();
      }
  }

    //reset position
    reset() {
        // Set a random movement direction (1 or -1)
        this.moveDirection = Phaser.Math.RND.pick([-1, 1]);
        // Set the initial x position based on the movement direction
        this.x = (this.moveDirection === 1) ? 0 - this.width : game.config.width;

        //this.y = Phaser.Math.RND.between(borderUISize * 3 + borderPadding, game.config.height - borderUISize - borderPadding);

        // Set the spaceship speed
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.setFlipX(this.moveDirection === 1);
        this.angle = 0;

    }
        //this.x = game.config.width
}