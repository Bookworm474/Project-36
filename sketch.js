var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood, feedTheDog;
var foodObj;
//create feed and lastFed variable here
var feed, lastFed;

function preload(){
	sadDog=loadImage("Dog.png");
	happyDog=loadImage("happy dog.png");
}

function setup() {
	database=firebase.database();
	createCanvas(1000,400);

	foodObj = new Food();

	foodStock=database.ref('Food');
	foodStock.on("value",readStock);

	dog=createSprite(800,200,150,150);
	dog.addImage(sadDog);
	dog.scale=0.15;

	//create feed the dog button here
	feedTheDog = createButton("Feed the Dog");
	feedTheDog.position(700,95);
	feedTheDog.mousePressed(feedDog);

	addFood=createButton("Add Food");
	addFood.position(800,95);
	addFood.mousePressed(addFoods);
}

function draw() {
	background(46,139,87);
	foodObj.display();

	//write code to read fedtime value from the database 
	var lastFedRef = database.ref('feedTime');
	lastFedRef.on("value",function(data){
		lastFed = data.val();
	})

	//write code to display text lastFed time here
	fill(255);
	textSize(15);
	if (lastFed != undefined){
		if (lastFed > 12){
			var pmTime = lastFed - 12;
			text("Last fed: "+pmTime+" PM",350,30);
		}
		else if (lastFed === 12){
			text("Last fed: 12 PM",350,30);
		}
		else if(lastFed === 0){
			text("Last fed: 12 AM",350,30);
		}
		else{
			text("Last fed: "+lastFed+" AM",350,30);
		}
	}

	drawSprites();
}

	//function to read food Stock
function readStock(data){
	foodS=data.val();
	foodObj.updateFoodStock(foodS);
}


function feedDog(){
	dog.addImage(happyDog);
	//write code here to update food stock and last fed time
	//foodStock -= 1;
	var currentTime = hour();
	database.ref('/').update({
		feedTime: currentTime
	})
	foodObj.deductFood();
	database.ref('/').update({
		Food: foodObj.foodStock
	})
}

//function to add food in stock
function addFoods(){
	foodS++;
	database.ref('/').update({
		Food:foodS
	})
}
