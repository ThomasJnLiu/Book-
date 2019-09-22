let dataServer;
let pubKey = 'pub-c-59079f0e-c013-49d8-80f9-5d609b16fee0';
let subKey = 'sub-c-4d640c3e-d831-11e9-85e7-eae1db32c94a';

let channelName = "whoSaysStuff";

/*variable for identifying users
1 is the main file, 2-4 are players, 0 is for spectators when there are more than 4 users subscribed.*/
let playerNum;
//universally unique identifier, used to differentiate users

function setup(){
  
  createCanvas(1400,700);

   // initialize pubnub
  dataServer = new PubNub({
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming, presence: presenceChange});
  dataServer.subscribe({channels: [channelName], withPresence: true});
}

function readIncoming(inMessage) //when new data comes in it triggers this function, 
{ 

}

function draw(){
  if(keyIsPressed == true){
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


