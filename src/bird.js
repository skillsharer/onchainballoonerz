class Bird {
  constructor(x,y,size,speed){
    this.x = x / width;
    this.y = y / width;
    this.size = size / width;
    this.speed = speed;
    this.wingAngle = 0;
    this.wingDirection = -1;
  }

  draw() {
    push();
    stroke(0);
    strokeWeight(width * 0.0025);
    // Update bird's position
    this.x *= width;
    this.y *= height;
    this.size *= width;

    this.x += this.speed;
  
    // Wrap the bird to the left when it goes off-screen
    if (this.x > width) {
      this.x = -this.size;
      this.y = random(height / 3, height / 2);
    }
  
    // Draw the wings flapping
    let wingLength = this.size / 2;
    let wingX = this.x - this.size / 4;
    let wingY = this.y - this.size / 4;
  
    // Calculate wing position based on wingDirection
    if (this.wingDirection === 1) {
      wingY -= sin(this.wingAngle) * wingLength;
    } else {
      wingY += sin(this.wingAngle) * wingLength;
    }
  
    // Draw wings
    line(wingX, wingY, wingX - wingLength, this.y);
    line(wingX, wingY, wingX + wingLength, this.y);
  
    // Update wing angle for flapping effect
    this.wingAngle += 0.05;

    this.x = this.x / width;
    this.y = this.y / height;
    this.size /= width;
    pop();
  }
}

function createInitialBirds(birds){
  for (let i = 0; i < random(0,5); i++) {
    let bird = new Bird(random(width), random(height / 3, height / 1.5), random(width * 0.016, height * 0.075), random(0.1, 1));
    birds.push(bird);
  }
  return birds;
}
