const sp = new URLSearchParams(window.location.search);
const isMob = /Android|webOS|iPhone|iPad|IEMobile|Opera Mini/i.test(navigator.userAgent);
let globalSeed;
let balloon;
let water;
let birds = []; // Bird array
let sun;
let moon;
let moonAppeared = false; // Flag to track moon appearance
let shootingStars = []; // Star array
let waveY; // Y-coordinate for the wave layer
let waveSpeed = 2; // Adjust the speed of the wave layer
let clouds = []; // Cloud array
let starPositions = [];
let shootingStar; // Shootingstar
let drawWater;
let rainBowAppeared = false;
let mountains = [];
let scaleFactor = 1.5;

// Define colors in the global scope
const skyColor = [52, 95, 130]; // Background color for the sky
const darkSkyColor = [24, 46, 64];
const mountainColors = [
  [100, 100, 100],
  [120, 120, 120],
  [140, 140, 140]
]; // Colors for the mountains

window.preload = function () {
  globalSeed = Math.round($fx.rand() * 2e9) * Math.round($fx.randminter() * 2e9);
}

window.windowResized = function() {
  randomSeed(globalSeed);
  noiseSeed(globalSeed);

  // Determine the scale factor for width and height
  let newWidth = windowWidth;
  let newHeight = windowWidth * 0.669;

  // Adjust pixel density based on the device and set up the canvas
  (isMob) ? pixelDensity(1): pixelDensity(min(window.devicePixelRatio), 2);
  createCanvas(newWidth, newHeight);

  // Set up shadow properties
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = windowWidth / 12;
  drawingContext.shadowColor = 'black';
}

window.setup = function() {
  let originalHeight = window.innerHeight;
  let originalWidth = originalHeight * 1.5;
  randomSeed(globalSeed);
  noiseSeed(globalSeed);
  (isMob) ? pixelDensity(1): pixelDensity(min(window.devicePixelRatio));
  createCanvas(originalWidth, originalHeight);
  noStroke();
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;
  drawingContext.shadowBlur = windowWidth / 12;
  drawingContext.shadowColor = 'black';
  generateMountains(mountains);
  balloon = new Balloon(width/2, height/1.5);
  createInitialBirds(birds);

  moonAppeared = random() < 0.5 ? true : false;
  if (moonAppeared){
    starPositions = generateStarPositions(starPositions);
    moon = new Moon(random(0, width), random(0, height / 2));
  } else {
    sun = new Sun(random(width / 2), random(height / 4));
  }
  
  drawWater = random() < 0.5 ? true : false; // Set water or not
  if (drawWater) water = new Water(height / random(1.1, 1.2));
  
  cloudMovementDirection = random() < 0.5 ? 1 : -1; // 1 for left to right, -1 for right to left
  
  clouds = generateRandomCloudShapes(random(1,10), random(width * 0.08, width * 0.15));
  if (!moonAppeared){
    rainBowAppeared = random() < 0.5 ? true : false;
    if (rainBowAppeared) rainbow = new Rainbow();
  }
}

window.draw = function() {
  $fx.rand.reset()
  noStroke();
  if (!moonAppeared) {
    background(skyColor); // Use predefined background color
    // Draw the sun if the moon hasn't appeared
    sun.draw();
    if (rainBowAppeared) rainbow.draw();
  } else {
    background(darkSkyColor); // Use predefined background color
    // Draw stars using the stored star positions
    for (let i = 0; i < starPositions.length; ++i) {
      starPositions[i].draw();
    }
    
    // Update and display the star along the path
    for (let star of shootingStars) {
      star.moveStar();
      star.updateStar();
    }
    moon.draw();
  }
  
  for (let mountain of mountains) {
    mountain.draw();
  }
  
  if (drawWater == true) water.draw();
  // Draw clouds and update their positions
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].draw();
    clouds[i].update();
  }

  // Draw and update the birds
  for (let i = birds.length - 1; i >= 0; i--) {
    birds[i].draw();
  }

  // Draw the hot air balloon with basket in front of the mountains
  balloon.draw();
  if (frameCount === 1) $fx.preview();

  // Garbage collection  
  for (let i = 0; i < shootingStars.length; ++i) {
    if (shootingStars[i].canRemove) {
      // Delete the element at index i
      shootingStars.splice(i, 1);
      // Decrement i to account for the removed element
      --i;
    }
  }
}

window.mousePressed = function() {
  if (!moonAppeared) return;
  if (shootingStars.length >= 20) return;

  let x = mouseX;
  let y = mouseY;
  let r1 = random(width * 0.001, width * 0.0055); // Random size for the inner part of the star
  let r2 = r1 * 2; // Twice the size of the inner part
  let npoints = 5; // Number of points in the star
  let colr = random(150, 255); // Random red color component
  let colg = random(150, 255); // Random green color component
  let colb = random(150, 255); // Random blue color component

  let newStar = new ShootingStar(x, y, r1, r2, npoints, colr, colg, colb);
  shootingStars.push(newStar);
}
