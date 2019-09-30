let dataServer;
let pubKey = 'pub-c-805c3b5f-556c-445d-a31a-212349dfe307';
let subKey = 'sub-c-9587a9fa-d5af-11e9-9fd1-52d10f2427f8';

//input variables
let sendText;
let sendButton;
let whoAreYou;

let channelName = "whoSaysStuff";

let img1; //wood frame image
let coord1; //img1's starting coords

let img2; //bathtub, toilet, sink
let coord2; //img2's starting coords

let img3; //combined, with 1 of the frames covering a corner of the bath tub
let coord3;

let moveDistance = 25; // how far to move per press

let xa; //move img1 on x axis
let ya; //move img1 on y axis
let xb; //move img2 on x axis
let yb; //move img2 on y axis
let xc; //move img3 on x axis
let yc; //move img3 on y axis
let xv = 0; //x velocity
let yv = 0; //y velocity


let x11; //img1's starting coords + x movement
let y11; //img1's starting coords + y movement
let x22; //img2's starting coords + x movement
let y22; //img2's starting coords + y movement

function preload() {
  img1 = loadImage('https://i.imgur.com/ulG65nN.png');
  img2 = loadImage('https://i.imgur.com/tLWJ6X2.png');
  img3 = loadImage('https://i.imgur.com/tUkk790.png');
}

function setup() { 
  createCanvas(1400,700);
  xa = 0;
  ya = 0;
  xb = 0;
  yb = 0;
  xc = 0;
  yc = 0;
  
  coord1 = createVector(0,0,0);
  coord2 = createVector(0,img2.height/2,0);
  coord3 = createVector(img2.width/2,0,0);

  
  imageMode(CENTER);

  
   // initialize pubnub
    dataServer = new PubNub({
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    heartbeatInterval: 10,
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming, presence: presenceChange});
  dataServer.subscribe({channels: [channelName], withPresence: true});
}

function draw(){
  background(255);

   x11 = coord1.x+xa; //img1's starting coords + x movement
   y11 = coord1.y+ya; //img1's starting coords + y movement
   x22 = coord2.x+xb; //img2's starting coords + x movement
   y22 = coord2.y+yb; //img2's starting coords + y movement
   x33 = coord3.x+xc; //img2's starting coords + x movement
   y33 = coord3.y+yc; //img2's starting coords + y movement
  image(img1,x11,y11); 
  image(img2,x22,y22); 
  image(img3,x33,y33); 
}

function readIncoming(inMessage){ //when new data comes in it triggers this function, 
                              // this works becsuse we subscribed to the channel in setup()
  
  //logs which player pressed which button for debug purposes
  console.log('player number ' + inMessage.message.player + ' pressed ' + inMessage.message.pressedKey);

  let playerNum = inMessage.message.player;
  let sentKey = inMessage.message.pressedKey;

  switch(playerNum){
    case 2:
      switch(sentKey){
        case 'a':
          xa = xa-moveDistance;
          break;
        case 's':
            ya = ya+moveDistance;
          break;
        case 'd':
            xa = xa+moveDistance; 
          break;
        case 'w':
          ya = ya-moveDistance;
          break;
        default:
          break;
      }
      break;

    case 3:
        switch(sentKey){
          case 'a':
            xb = xb-moveDistance;
            break;
          case 's':
              yb = yb+moveDistance;
            break;
          case 'd':
              xb = xb+moveDistance; 
            break;
          case 'w':
            yb = yb-moveDistance;
            break;
          default:
            break;
        }
        break;

    case 4:
        switch(sentKey){
          case 'a':
            xc = xc-moveDistance;
            break;
          case 's':
              yc = yc+moveDistance;
            break;
          case 'd':
              xc = xc+moveDistance; 
            break;
          case 'w':
            yc = yc-moveDistance;
            break;
          default:
            break;
        }
        break;
    default:
        break;
  }
}

//debug for seeing users join and leave
function presenceChange(pInfo){
  switch(pInfo.action){
    case 'join':
      console.log('user ' + pInfo.occupancy + ' has joined');
      console.log('total number of people in the channel is ' + pInfo.occupancy);
      break;
    case 'leave':
      console.log('user ' + (pInfo.occupancy + 1) +' has left');
      console.log('total number of people in the channel is ' + pInfo.occupancy);
      break;
    case 'timeout':
      console.log('user ' + pInfo.occupancy + ' has timed out');
      console.log('total number of people in the channel is ' + pInfo.occupancy);
    default:
      break;
  }
  totalPopulation = pInfo.occupancy;
}