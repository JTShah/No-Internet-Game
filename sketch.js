//variables
var trex, trex_running;
var edges;
var ground,ground_img;
var invisiGround;
var cloud,cloud_img;
var cactus,cactus_1,cactus_2,cactus_3,cactus_4,cactus_5,cactus_6;
var cloud_grp,cactus_grp;
var score=0;
var trex_scared;
var gameover,gameover_img,restart,restart_img;
var checkpoint,die,jump

PLAY=1;
END=0;

var gamestate=PLAY;


//basics
function preload() {
//load media files

  trex_running=loadAnimation("trex1.png","trex3.png","trex4.png");
  ground_img=loadImage("ground2.png");
  cloud_img=loadImage("cloud.png");
  
  cactus_1=loadImage("obstacle1.png");
  cactus_2=loadImage("obstacle2.png");
  cactus_3=loadImage("obstacle3.png");
  cactus_4=loadImage("obstacle4.png");
  cactus_5=loadImage("obstacle5.png");
  cactus_6=loadImage("obstacle6.png");
  
  trex_scared=loadAnimation("trex_collided.png");

  gameover_img=loadImage("gameover.png");
  restart_img=loadImage("restart.png");


  die=loadSound("die.mp3");
  checkpoint=loadSound("checkpoint.mp3");
  jump=loadSound("jump.mp3");


}

function setup () {
  //creates elements for site

  //creating canvas
  createCanvas(windowWidth,windowHeight);

  // creating t rex
  trex=createSprite(100,height-70,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("scared",trex_scared);
  
  //creating edges
  edges=createEdgeSprites();

  //creating ground
  ground=createSprite(width/2,height-10,width,20);
  ground.addImage("ground",ground_img);

  //creating invisible grounddd
  invisiGround=createSprite(width/2,height-5,width,20);

  // cloaking with invisibility
  invisiGround.visible=false;



  //create gameover and restart
  gameover=createSprite(width/2,height/2-50);
  gameover.addImage(gameover_img);
  gameover.visible=false;
 
  restart=createSprite(width/2,height/2+50);
  restart.addImage(restart_img);
  restart.visible=false;






  //random number generator
  // var x =Math.round(random(10,60));
  // console.log(x);

  //Seperation

  cloud_grp=new Group();
  cactus_grp=new Group();



}

function draw() {
//main content of site.

 // console.log(frameCount);

  //background greation
  background("white");

  text("Score: " + score,1300,50);

  //Collidal Radius

  trex.setCollider("circle",0,0,40);
    trex.debug=true;


  if((mousePressedOver(restart) || touches.length>0)) 
  {
    reset();
    touches=[];
  }


  //Adding Gamestates
   
  if(gamestate===PLAY) {
    

    //adding score
    score=score+Math.round(frameCount/60);
    
    if(score>0 && score%300===0){
      checkpoint.play();
    }
   
    //

   //adding ground movement
    ground.velocityX= -(5+3*score/100);


    //Infinite Ground
    if(ground.x<0) {
      ground.x=ground.width/4;
    }
  console.log(trex.y);
    //Jump for me, jump for me, jump for me, oh oh.

    if((keyDown("space") || touches.length>0) && trex.y>height-100) {
      trex.velocityY=-13;
      jump.play();
      touches=[];

    }
    //applying gravity
    trex.velocityY=trex.velocityY+0.5;

    //spawning clouds and cacti
    spawnCloud();
    spawnCacti();

    //checking for the end of the world

    if(cactus_grp.isTouching(trex)) {
      die.play(); 
      gamestate=END;
      //trex.velocityY=-10;
    }
  
   }

  else if(gamestate===END) {

    //removing ground movement 
    ground.velocityX=0;


    //scaring trex
    trex.changeAnimation("scared",trex_scared);
    
    
    //changing lifetime to ban evaporation
    cactus_grp.setLifetimeEach(-1);
    cloud_grp.setLifetimeEach(-1);
    trex.velocityY=0;
  
    cloud_grp.setVelocityXEach(0);
    cactus_grp.setVelocityXEach(0);

    //revealing the reset

    gameover.visible=true;
    restart.visible=true;
    

  


  }

  //console.log(trex.y);

  //ADDING JUMP CAPACITY

  trex.collide(invisiGround);

 // console.log(ground.x);



  

  //drawing sprites
  drawSprites();
}



//cloud spawning

function spawnCloud() {

  if(frameCount%60===0) {
    cloud=createSprite(width+20,height-300,40,10);
    //random y position
    cloud.y=Math.round(random(300,500));
    cloud.velocityX=-5;
    cloud.addImage("cloud",cloud_img);

    // limiting clouds' lifetime

    cloud.lifetime=365;

    //adjusting sprite depth
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;

    cloud_grp.add(cloud);

  }

}

// Obstacle Spawnation

function spawnCacti() {
  if(frameCount%80===0) {
    cactus=createSprite(width+20,height-40,10,40);
    cactus.velocityX=-7;
    cactus.scale=0.9;
    var num1=Math.round(random(1,6));
    console.log(num1);

    switch(num1) {

      case 1:
        cactus.addImage(cactus_1);
        break;

      case 2:
        cactus.addImage(cactus_2);
        break;

      case 3:
        cactus.addImage(cactus_3);
        break;

      case 4:
        cactus.addImage(cactus_4);
        break;

      case 5:
        cactus.addImage(cactus_5);
        break;

      case 6:
        cactus.addImage(cactus_6);
        break;

      default:
        break;
    }
    cactus.lifetime=262;

    cactus_grp.add(cactus);
    restart.depth= cactus.depth+1;

  }

  

}

function reset() {
  gamestate=PLAY;
  gameover.visible=false;
  restart.visible=false;
  score=0;
  cloud_grp.destroyEach();
  cactus_grp.destroyEach();
  trex.changeAnimation("running",trex_running);
}




