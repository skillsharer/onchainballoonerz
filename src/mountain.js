class Mountain{
  constructor(range){
    this.range = range;
    this.mountainPoints = this.generateMountainPoints(this.range);
  }
    
  generateMountainPoints(range) {
    let points = [];
    for (let i = 0; i < range.numberOfPoints; i++) {
      let x = (i * range.stepX) / width;
      let y = (random(height / 1.2, range.mountainTopY * height)) / height;
      points.push([x, y]);
    }
    return points;
  }

  draw(){
    fill(this.range.color);
    beginShape();
    vertex(0, height);
    for (let point of this.mountainPoints) {
      vertex(point[0] * width, point[1] * height);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}

function generateMountains(mountains){
  for (let i = 0; i < random(1, 6); i++) {
    let range = {
      mountainTopY: random(i * (height / 10), height / 2) / height,
      numberOfPoints: random(30,40),
      stepX: width / random(7,10),
      color: [random(100, 170), random(100, 170), random(100, 170)], // Use predefined colors
    };
    let mountain = new Mountain(range);
    mountains.push(mountain);
  }
  return mountains;
}