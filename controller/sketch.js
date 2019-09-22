let dataServer;
let pubKey = 'pub-c-59079f0e-c013-49d8-80f9-5d609b16fee0';
let subKey = 'sub-c-4d640c3e-d831-11e9-85e7-eae1db32c94a';

let channelName = "whoSaysStuff";

/*number for identifying players
1-3 are players, 0 is for spectators when there are more than 3 people subscribed.*/
let playerNum;
//universally unique identifier, used to differentiate users
let newUUID = PubNub.generateUUID();

function setup() 
{
  
  createCanvas(1400,700);

   // initialize pubnub
  dataServer = new PubNub(
  {
    uuid: newUUID,
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  console.log(newUUID);
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming, presence: presenceChange});
  dataServer.subscribe({channels: [channelName], withPresence: true});

  //publish UUID for main file to record
  /*dataServer.publish({
    channel: channelName,
    message:
    {
      player: playerNum,
      ID: newUUID
    }
  });*/
}

function presenceChange(pInfo){
    console.log(pInfo.occupancy);
    totalPopulation = pInfo.occupancy;

    //determine player number based on # of users subscribed
    if(playerNum == undefined){
      switch(pInfo.occupancy){
        case 2:
          playerNum = 1;
          break;
        case 3: 
          playerNum = 2;
          break;
        case 4:
          playerNum = 3;
          break;
        default:
          playerNum = 0;
          break;     
      }
      console.log('player number is ' + playerNum);
    }

}

  function readIncoming(inMessage) //when new data comes in it triggers this function, 
{ 

}