/*------------------------------------------
IMPORTANT
For best performance
  - have everyone join at once
  - no one should join and then attempt to rejoin after everyone has joined
  - for testing purposes. if users decides to leave, they must press the unsub
    button before closing the window
  - reason because pubnub doesn't fire a 'leave' presence event when a user closes
    their window, it'll simply wait 5 minutes and then time them out
  - unsub button allows for immediate leaving, so testing can be done quicker
------------------------------------------*/


let dataServer;
let pubKey = 'pub-c-805c3b5f-556c-445d-a31a-212349dfe307';
let subKey = 'sub-c-9587a9fa-d5af-11e9-9fd1-52d10f2427f8';

let channelName = "whoSaysStuff";

/*variable for identifying users
1 is the main file, 2-4 are players, 0 is for spectators when there are more than 4 users subscribed.*/
let playerNum;
//for checking is user is unsubbed to channel, prevents further publishing
let unSubbed = false;

let xa; //move img1 on x axis
let ya; //move img1 on y axis
let xb; //move img2 on x axis
let yb; //move img2 on y axis
let xc; //move img3 on x axis
let yc; //move img3 on y axis
let xv = 0; //x velocity
let yv = 0; //y velocity

function setup(){
  
  createCanvas(1400,700);

   // initialize pubnub
  dataServer = new PubNub({
    publish_key   : pubKey,  
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming, presence: presenceChange});
  dataServer.subscribe({channels: [channelName], withPresence: true});
}

function draw(){
  //publish key and player number if still subbed to channel
  if(keyIsPressed == true && !unSubbed){
    console.log(key);
    dataServer.publish({
      channel: channelName,
      message: {
        player: playerNum,
        pressedKey: key
      }
    });
  }
}

function presenceChange(pInfo){
    console.log(pInfo.occupancy);
    totalPopulation = pInfo.occupancy;

    //determine player number based on # of users subscribed
    if(playerNum == undefined){
      switch(pInfo.occupancy){
        case 2:
          playerNum = 2;
          break;
        case 3: 
          playerNum = 3;
          break;
        case 4:
          playerNum = 4;
          break;
        default:
          playerNum = 0;
          break;     
      }
      console.log('user number is ' + playerNum);
    }
}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{                               // this works becsuse we subscribed to the channel in setup()
  /*
  //logs which player pressed which button for debug purposes
  console.log('player number ' + inMessage.message.player + ' pressed ' + inMessage.message.pressedKey);
  // simple error check to match the incoming to the channelName
  if(inMessage.channel == channelName)
  {


  let playerwho = inMessage.message.player; //hold inmessage.who
  let sentKey = inMessage.message.messageText;

     if (sentKey === 'a') {
      xv += moveDistance*-1;
    } else
    if (sentKey === 'd')  {
      xv += moveDistance;
    } else
    if (sentKey === 'w')  {
      yv += moveDistance*-1;
    } else
    if (sentKey === 's') {
      yv += moveDistance;
    } 

      if(playerNum === '2'){
          xa = xv;
          ya = yv;
          console.log('image 1s x velocity is' + xa);
          console.log('image 1s y velocity is' + ya);
        } else if (playerNum === '3'){
          xb = xv;
          yb = yv;
          console.log('image 2s x velocity is' + xb);
          console.log('image 2s y velocity is' + yb);
        } else if (playerNum === '4'){
          xc = xv;
          yc = yv;
          console.log('image 3s x velocity is' + xc);
          console.log('image 3s y velocity is' + yc);
        } else {
          console.log('nope');
        }
      }
      */
  }



//unsub to channel if button clicked
$('document').ready(function(){
  $('.unSubButton').on('click', function(){
    dataServer.unsubscribe({
      channels: [channelName]
    });
    unSubbed = true;
  });
});
