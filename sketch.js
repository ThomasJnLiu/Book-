/*

slide 2 images around and then combine once they're close enough to each other
 */


// server variables for apps to communicate they must use THE SAME KEYS
//get these keys from your PubNub account
//within your group, you will use 1 of your accounts for the project


let dataServer;
let pubKey = 'pub-c-59079f0e-c013-49d8-80f9-5d609b16fee0';
let subKey = 'sub-c-4d640c3e-d831-11e9-85e7-eae1db32c94a';

//input variables
let sendText;
let sendButton;
let whoAreYou;

//name used to sort your messages. used like a radio station. can be called anything
let channelName = "whoSaysStuff";

//let incomingText = ""; //variable that will hold the incoming message text



//original pic 852 x 687
//shrunk pic is 426 x 348

let img1; //wood frame image
let coord1; //img1's starting coords

let img2; //bathtub, toilet, sink
let coord2; //img2's starting coords


let img3; //combined, with 1 of the frames covering a corner of the bath tub
let coord3;

let xa; //move img1 on x axis
let ya; //move img1 on y axis
let xb; //move img2 on x axis
let yb; //move img2 on y axis
let xv = 0; //x velocity
let yv = 0; //y velocity


let x11; //img1's starting coords + x movement
let y11; //img1's starting coords + y movement
let x22; //img2's starting coords + x movement
let y22; //img2's starting coords + y movement

let howfar = 15; //how close should images be before combining

function preload() {
  img1 = loadImage('https://i.imgur.com/7Q8Cdcj.png');
  img2 = loadImage('https://i.imgur.com/IIWqHnx.png');
  img3 = loadImage('https://i.imgur.com/aTNnS2H.png');
}

function setup() 
{
  
  createCanvas(1200,900);
  xa = 0;
  ya = 0;
  xb = 0;
  yb = 0;
  
  coord1 = createVector(width-img1.width/2,height-img1.height/2,0);
  coord2 = createVector(img2.width/2,img2.height/2,0);
  
  
  imageMode(CENTER);

  
   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming });
  dataServer.subscribe({channels: [channelName]});

  //create the text fields for the message to be sent
  whoAreYou = createInput('Please enter either 1 or 2');
  whoAreYou.position(5,height+5);
  
  
  /*sendText = createInput('WASD');
  sendText.position(5,height+25);

  sendButton = createButton('Post Message');
  sendButton.position(sendText.x + sendText.width,5);
  sendButton.mousePressed(sendTheMessage);
  */

}

function draw() 
{
  background(255);
   x11 = coord1.x+xa; //img1's starting coords + x movement
   y11 = coord1.x+ya; //img1's starting coords + y movement
   x22 = coord2.x+xb; //img2's starting coords + x movement
   y22 = coord2.x+yb; //img2's starting coords + y movement

    let distance = int(dist(x11,y11,x22,y22));
    print(distance);

  if(distance>howfar) { //if distance is less than accuracy, move
    image(img1,x11,y11);
    image(img2,x22,y22); 
  } else{ //if distance is less than accuracy, combine
    image(img3,(x11+x22)/2,(y11+y22)/2);
  }

  text('Are you player 1 or 2? (Please only put "1" or "2")', 5, height-5);
  text('Try to get the two images to overlap and snap together!', 5, 15);

}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {


  let playerwho = inMessage.message.who; //hold inmessage.who
  let sentKey = inMessage.message.messageText;

     if (sentKey === 'a' && playerwho === '1') {
      xa += -25;
    } else
    if (sentKey === 'd' && playerwho === '1')  {
      xa += 25;
    } else
    if (sentKey === 'w' && playerwho === '1')  {
      ya += -25;
    } else
    if (sentKey === 's' && playerwho === '1') {
      ya += 25;
    } 

    if (sentKey === 'a' && playerwho === '2') {
      xb += -25;
    } else
    if (sentKey === 'd' && playerwho === '2') {
      xb += 25;
    } else
    if (sentKey === 'w' && playerwho === '2')  {
      yb += -25;
    } else
    if (sentKey === 's' && playerwho === '2') {
      yb += 25;
    }

    /*if (playerwho === '1'){
      xa = xv;
      ya = yv;
      console.log(xv);
      console.log(yv);
    } else if (playerwho === '2') {
      xb = xv;
      yb = yv;
      console.log(xv);
      console.log(yv);
    }*/
  }
}

function keyPressed() { //use key press to publish message
  
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        who: whoAreYou.value(),
        messageText: key

      }
    });

}

///uses built in mouseClicked function to send the data to the pubnub server
/*function sendTheMessage() {
 

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message: 
      {
        who: whoAreYou.value(),
        messageText: sendText.value()       //get the value from the text box and send it as part of the message   
      }
    });

}*/