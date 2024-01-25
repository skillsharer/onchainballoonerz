class Water{
  constructor(y){
    this.y = y / height;
  }
  
  draw(){
    let waveY = this.y * height
    fill(0, 102, 204, 100); // Blue color with transparency
    beginShape();
    let endOff = (width * 0.016);
    let xoff = 0; // Initialize the noise offset
    for (let x = 0; x <= width + endOff; x += (width * 0.016)) {
      let y = map(noise(xoff, frameCount * 0.02), 0, 1, waveY - (height * 0.05), waveY + (height * 0.05));
      vertex(x, y);
      xoff += 0.1; // Increase the noise offset for the next point
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }
}