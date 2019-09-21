let dataServer;
let pubKey = 'pub-c-59079f0e-c013-49d8-80f9-5d609b16fee0';
let subKey = 'sub-c-4d640c3e-d831-11e9-85e7-eae1db32c94a';

let channelName = "whoSaysStuff";


function setup() 
{
  
  createCanvas(1400,700);

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,  
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });
  
  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({message: readIncoming, presence: presenceChange});
  dataServer.subscribe({channels: [channelName], withPresence: true});
}

function presenceChange(pInfo){
    console.log(pInfo.occupancy);
    totalPopulation = pInfo.occupancy;
}

  function readIncoming(inMessage) //when new data comes in it triggers this function, 
{ 

}