var dog, dogImg, happydogImg;
var database;
var foodS, foodStock, foodObj;
var Milk, milkImg;
var lastFed;

function preload(){
  dogImg = loadImage("images/dogImg.png");
  happydogImg = loadImage("images/happydogImg.png");
}

function setup() {
  database = firebase.database();
  createCanvas(800, 600);

  foodObj = new Food();
  
  foodStock = database.ref('food');
  foodStock.on("value", readStock);

  dog = createSprite(500,300,150,150);
  dog.addImage(dogImg)
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}

function draw() {  
  background(46,139,87);

  foodObj.display(); 

  FeedTime = database.ref('FeedTime');
  FeedTime.on("value",function(data){
    lastFed = data.val();
  });
  
  fill(255);
  textSize(15);
  if(lastFed>=12) {
    text("Last Feed : "+lastFed%12 + "PM", 350,30);
  }else if(lastFed == 0) {
    text("Last Feed : 12 AM", 350,30);
  }else{
    text("Last Feed : "+lastFed + "AM", 350,30);
  }

  
  drawSprites(); 
  
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}

function feedDog() {
  dog.addImage(happydogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods() {
  foodS++;
  database.ref('/').update({
    food: foodS
  })
}