class Sun{
  constructor(x,y){
    this.x = x / width;
    this.y = x / height;
    this.sunColor = [255, 204, 0];
  }
  draw(){
    push();
    this.x *= width;
    this.y *= height;
    fill(this.sunColor);
    ellipse(this.x, this.y, width * 0.13, height * 0.2);
    this.x /= width;
    this.y /= height;
    pop();
  }
}

class Moon{
  constructor(x,y){
    this.x = x / width;
    this.y = x / height;
    this.moonColor = [246, 241, 213]; 
  }
  draw(){
    this.x *= width;
    this.y *= height;
    push();
    fill(this.moonColor);
    drawingContext.shadowColor = 'white';
    translate(this.x, this.y);
      // Define the polygon points for the crescent moon
     let points = [];

     // Outer crescent points
     for (let angle = -PI / 2; angle < PI / 2; angle += 0.02) {
       let x = cos(angle) * width * 0.083; // Adjust the outer radius as needed
       let y = sin(angle) * height * 0.125; // Adjust the outer radius as needed
       points.push(createVector(x, y));
     }

     // Inner crescent points
     for (let angle = PI / 2; angle > -PI / 2; angle -= 0.02) {
       let x = cos(angle) * width * 0.05; // Adjust the inner radius as needed
       let y = sin(angle) * height * 0.125; // Adjust the inner radius as needed
       points.push(createVector(x, y));
     }
     beginShape();
     for (let point of points) {
       vertex(point.x, point.y);
     }
     rotate(0.3);
     endShape(CLOSE); 
     drawingContext.shadowColor = 'black';
    pop();
    this.x /= width;
    this.y /= height;
  }
}

class ShootingStar {
  constructor(_x, _y, _r1, _r2, _npoints, _colr, _colg, _colb) {
    this.x = _x;
    this.y = _y;
    this.r1 = _r1;
    this.r2 = _r2;
    this.npoints = _npoints;
    this.colr = _colr;
    this.colg = _colg;
    this.colb = _colb;
    this.sx = 0;
    this.sy = 0;
    this.angle = TWO_PI / _npoints;
    this.halfAngle = TWO_PI / _npoints / 2;
    this.alpha = 255; // Initial alpha value for fading effect
    this.curveX = random(-5, 5); // Random horizontal curve offset

    // Initialize an empty array to store previous positions for the tail
    this.tailPositions = [];
    this.canRemove = false;
  }

  updateStar() {
    noStroke();
    for (let a = 0; a < TWO_PI; a += this.angle) {
      let x1 = this.x + cos(a) * this.r2;
      let y1 = this.y + sin(a) * this.r2;
      let x2 = this.x + cos(a + this.halfAngle) * this.r1;
      let y2 = this.y + sin(a + this.halfAngle) * this.r1;
      let c = color(this.colr, this.colg, this.colb, this.alpha);

      fill(c);
      beginShape();
      vertex(this.x + this.curveX, this.y);
      vertex(x1 + this.curveX, y1);
      vertex(x2 + this.curveX, y2);
      endShape(CLOSE);

      this.alpha -= 2; // Decrease alpha value for fading effect
      if (this.alpha <= 0) this.canRemove = true;
    }

    // Store current position in the tailPositions array
    this.tailPositions.push({ x: this.x, y: this.y });
    
    // Remove the oldest position if the tail becomes too long
    if (this.tailPositions.length > 30) {
      this.tailPositions.shift();
    }
    
    // Draw the curved tail
    for (let i = 0; i < this.tailPositions.length; i++) {
      let tailAlpha = map(i, 0, this.tailPositions.length, 0, this.alpha);
      fill(this.colr, this.colg, this.colb, tailAlpha);
      let tailX = this.tailPositions[i].x + this.curveX;
      let tailY = this.tailPositions[i].y;
      ellipse(tailX, tailY, this.r1 * 2, this.r1 * 2);
    }
  }

  moveStar() {
    this.y += pow(this.r1, 0.9);
    this.x += this.curveX * 0.5; // Adjust the horizontal position for the curve

    if (this.y > height) {
      let index = shootingStars.indexOf(this);
      shootingStars.splice(index, 1);
    }
  }
}

class Cloud {
  constructor(x, y, size, vertices, speed, colour=255) {
    this.x = x / width;
    this.y = y / height;
    this.size = size / width;
    this.vertices = vertices;
    this.speed = speed / width;
    this.colour = colour;
  }

  draw() {
    this.x *= width;
    this.y *= height;
    fill(this.colour); // White color for the cloud
    noStroke();

    beginShape();
    for (let i = 0; i < this.vertices.length; i++) {
      let cloudVertex = this.vertices[i];
      let cloudX = this.x + cloudVertex.x * width;
      vertex(cloudX, this.y + cloudVertex.y * height);
    }
    endShape(CLOSE);
    this.x /= width;
    this.y /= height;
  }

  update() {
    this.x *= width;
    this.y *= height;
    this.size *= width;
    this.speed *= width;
    // Move the cloud based on its speed and the cloud movement direction
    this.x += this.speed * cloudMovementDirection;

    // Wrap the cloud to the opposite side when it goes out of the canvas
    if (cloudMovementDirection === 1 && this.x > width + 2*this.size) {
      this.x = -2*this.size; // Move to the left side
    } else if (cloudMovementDirection === -1 && this.x < -2*this.size) {
      this.x = width + 2*this.size; // Move to the right side
    }
    this.x /= width;
    this.y /= height;
    this.size /= width;
    this.speed /= width;
  }
}

function generateRandomCloudShapes(numClouds, maxSize) {
  let clouds = [];
  for (let i = 0; i < numClouds; i++) {
    let numVertices = int(random(5, 15)); // Randomize the number of vertices
    let cloudShape = [];
    for (let j = 0; j < numVertices; j++) {
      let angle = map(j, 0, numVertices, 0, TWO_PI);
      let xOffset = random(maxSize * 0.8, maxSize * 1.2) / width; // Randomize cloud shape
      let yOffset = random(maxSize * 0.2, maxSize * 0.8) / height; // Randomize cloud shape
      cloudShape.push(createVector(xOffset * cos(angle), yOffset * sin(angle)));
    }
    let x = random(width); // Randomize initial x-coordinate
    let y = random(height/2); // Randomize initial y-coordinate
    let size = maxSize; // Set size based on maxSize
    let speed = random(0.5, 1.5); // Randomize cloud speed
    let colour = [random(50,150), random(50,150), random(50,150)];
    clouds.push(new Cloud(x, y, size, cloudShape, speed, colour));
  }
  return clouds;
}

class Star {
  constructor(x, y, radius1, radius2, npoints, originalColor=color(255,205,165)) {
    this.x = x / width;
    this.y = y / height;
    this.radius1 = radius1 / width;
    this.radius2 = radius2 / height;
    this.npoints = npoints;
    this.originalColor = originalColor;
    this.starColor = originalColor;
    this.transitionSpeed = random(1, 5);
    this.fadingOut = true; // Flag to indicate fading out or fading in
    this.alpha = 255; // Initial alpha value for fading effect
  }

  draw() {
    this.x *= width;
    this.y *= height;
    this.radius1 *= width;
    this.radius2 *= height;
    fill(this.starColor);
    this.starColor.setAlpha(this.alpha);

    let angle = TWO_PI / this.npoints;
    let halfAngle = angle / 2.0;

    beginShape();
    for (let a = -PI / 10; a < TWO_PI; a += angle) {
      let sx = this.x + cos(a) * this.radius2;
      let sy = this.y + sin(a) * this.radius2;
      vertex(sx, sy);
      sx = this.x + cos(a + halfAngle) * this.radius1;
      sy = this.y + sin(a + halfAngle) * this.radius1;
      vertex(sx, sy);
    }
    endShape(CLOSE);

    if (this.alpha <= 0 && this.fadingOut) {
      this.fadingOut = false;
    } else if (this.alpha > 255) {
      this.fadingOut = true;
    }
    
    if (this.fadingOut){
      this.alpha -= this.transitionSpeed;
    } else {
      this.alpha += this.transitionSpeed;
    }
    this.x /= width;
    this.y /= height;
    this.radius1 /= width;
    this.radius2 /= height;
  }
}

function generateStarPositions(starPositions){
  let starNum = random(30,50);
  for (let i = 0; i < starNum; ++i) {
    let x = random(0, width);
    let y = random(0, height / 2);
    let radius1 = random(width * 0.001, width * 0.002);
    let star = new Star(x, y, radius1, 2*radius1, 5, color(random(250,255),random(150,205),random(130,165))); // TODO
    starPositions.push(star);
  }
  return starPositions;
}

class Rainbow{
  constructor() {
    this.centerX = random(0, width) / width;
    this.centerY = 1;
  }
  draw(){
    push();
      this.centerX *= width;
      this.centerY *= height;
      let radiusStep = max(width, height) / 12;
      strokeWeight(width * 0.025);
      noFill();
      stroke(255, 173, 173);
      arc(this.centerX, this.centerY, radiusStep * 12, radiusStep * 10.5, radians(180), radians(0)); // red band

      stroke(255, 214, 165);
      arc(this.centerX, this.centerY, radiusStep * 11.5, radiusStep * 10, radians(180), radians(0)); // orange band

      stroke(253, 255, 182);
      arc(this.centerX, this.centerY, radiusStep * 11, radiusStep * 9.5, radians(180), radians(0)); // yellow band

      stroke(202, 255, 191);
      arc(this.centerX, this.centerY, radiusStep * 10.5, radiusStep * 9, radians(180), radians(0)); // green band

      stroke(155, 246, 255);
      arc(this.centerX, this.centerY, radiusStep * 10, radiusStep * 8.5, radians(180), radians(0)); // blue band

      stroke(255, 198, 255);
      arc(this.centerX, this.centerY, radiusStep * 9.5, radiusStep * 8, radians(180), radians(0)); // pink band
      this.centerX /= width;
      this.centerY /= height;
    pop();
  }
}
