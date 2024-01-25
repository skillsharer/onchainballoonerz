class Balloon{
  constructor(x,y){
    this.balloonColor = [207, 181, 59]; // Gold color for the balloon
    this.basketColor = [66, 49, 32]; // Dark brown color for the basket
    this.ropeColor = [0]; // Black color for the ropes
    this.angle = 0;
    this.angleIncrement = 0.005; // Adjust the speed of movement
  }

  draw() {
    push();
    // Update the position of the balloon in a circular path
    let radius = height * 0.125;
    let x = (width / 2 + radius * cos(this.angle));
    let y = (height / 2 + radius * sin(this.angle));
    // Increment the angle to make the balloon move around the canvas (slower)
    this.angle += this.angleIncrement;
    noStroke();
    // Balloon body
    fill(this.balloonColor); // Use predefined color
    ellipse(x, y, width * 0.2, height * 0.35);
    // Basket
    fill(this.basketColor); // Use predefined color
    rect(x - width * 0.03, y + height * 0.25, width * 0.06, height * 0.05);
  
    // Ropes
    stroke(this.ropeColor); // Use predefined color
    strokeWeight(width * 0.0035);
    line(x - width * 0.03, y + height * 0.25, x - width * 0.058, y + height * 0.145);
    line(x + width * 0.03, y + height * 0.25, x + width * 0.058, y + height * 0.145);
    pop();
  }
}