/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



var state = {
  section: 0,
  sections: [
    {},
    {title: 'Starcraft', search: 'StarCraft%20II'},
    {title: 'Overwatch', search: 'Overwatch'},
    {title: 'Diablo', search:'Diablo%20III:%20Reaper%20of%20Souls'},
    {title: 'Hearthstone', search: 'Hearthstone'},
    {title: 'Heroes of the Storm', search: 'Heroes%20of%20the%20Storm'},
    {title: 'World of Warcraft', search: 'World%20of%20Warcraft'},
    {title: 'League of Legends', search: 'League%20of%20Legends'},
  ],
  streams: []
};

function handleGame(section){
  state.section = section;
  setContent()
  $('#wrap').removeClass ('hidden');

}




function setContent() {
  $('body').removeClass();

  if (state.section === 0){
    $('#content').load('dropdown.html');
  }
  else{

    // (1) Load game.html
    // (2) THEN, change #title

    $('#content').load('game.html', function(){
      $('#title').text(state.sections[state.section].title)
    });

    


    $('body').addClass(state.sections[state.section].title);



    var api = twitchAPI(state.sections[state.section].search);


  }
}

function setGame(streamID) {
  //state.stream = stream;
  // stream = {a bunch of stream data}

  var stream = state.streams[streamID];

  // (1) Load streampage.html
  // (2) THEN, do all the fillGameContent stuff

  $('#content').load('streampage.html', fillGameContent.bind(null, stream));

  //.done(fillGameContent.bind(null, stream));
}

function fillGameContent(stream){

  var iframe = '<iframe ' + 'src=https://player.twitch.tv/?channel=' + stream.channel.name + '&autoplay=true' + ' ' + 'height="300" ' + 'width="500" ' + 'frameborder="<frameborder>" ' + 'scrolling="<scrolling>" ' + 'allowfullscreen="<allowfullscreen>"> ' + '</iframe>'
  var ichat = '<iframe frameborder="<frameborder width>"' + 'scrolling="<scrolling>"' + 'id="' + stream.channel._id + '"' + 'src="' + stream.channel.url + '/chat"' + 'height="500"' + 'width="500">' + '</iframe>'
  var profileBanner = '<img src="' + stream.channel.profile_banner + '">'
  var displayName = stream.channel.display_name
  var createdAt ='Streaming since: ' + moment(stream.channel.created_at).format('MM-DD-YYYY');
  var gameSince ='Streaming ' + stream.game + ' since: ' + moment(stream.created_at).format('MM-DD-YYYY hh:mm:ss a z')
  var partner = 'Partnered: ' + stream.channel.partner
  var twitchviews ='Views: ' + numeral(stream.channel.views).format('0,0')
  var currentviews ="Current viewers: " + numeral(stream.viewers).format('0,0')
  var streamLive = "Streamer is currently: " + stream.stream_type


  if (stream.stream_type === "live"){
    streamLive = stream.channel.display_name + '<br> <img src="http://radiorisaala.com/wp-content/uploads/2017/02/LIVE.png" style="height:100px;width:auto;"/>'
  } else{
    streamLive = stream.channel.display_name + '<br> <img src="http://sdtimes.com/wp-content/uploads/2014/10/goneoffline.png" style="height:100px;width:auto;"/>'
  }

  if (stream.channel.partner === true){
    partner = stream.channel.display_name + '<br>  <img src="https://i.ytimg.com/vi/od1ymZiMvu8/maxresdefault.jpg" style ="height:100px;width:auto;"/>'
  } else{
    partner = 'This streamer is not a Twitch partner <br> <img src="http://savemoneydammit.com/wp-content/uploads/2015/10/partner-not-parent.png" style="height:100px;width:auto;"/>'
  } 

  $('#stream').html(iframe);
  $('#chat').html(ichat);
  $('#banner').html(profileBanner);
  $('#displayname').text(displayName);
  $('#createdat').text(createdAt);
  $('#gamesince').text(gameSince);
  $('#twitchpartner').html(partner);
  $('#twitchviews').text(twitchviews);
  $('#currentviews').text(currentviews);
  $('#streamlive').html(streamLive);
}



function twitchAPI(game){
  $.ajax({
    type: 'GET',
    url: 'https://api.twitch.tv/kraken/streams/?game=' + game,
    headers: {
     'Client-ID': '0pkzta2wa6j8e5uznoy05jsg23kzxt',
     'Accept': 'application/vnd.twitchtv.v5+json'
   },
   success: function(data) {
     state.streams = data.streams;

     for(var count = 0; count <= 5; count++){
        console.log(data.streams)
        var stream = data.streams[count];
        console.log(stream)

        var viewCount = '#view' + count;
        var resultElement = '<div onclick= "setGame(' + count + ')">' + '<img src=' + stream.preview.medium + ' /><div><img src=' + stream.channel.logo + ' class="profilelogo"><b>' + stream.channel.display_name + '</b></div></div>'

        $(viewCount).html(resultElement)

     }


   }
  });
}






function riotApiCall(){
 var summonerName = $('#summonerName').val();
  riotGetSummonerId(summonerName);
}

function riotGetSummonerId(input){
    $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + input ,
    headers: {
     'X-Riot-Token' : 'RGAPI-bed3b0c9-2f04-4ecd-bbc0-a14b609c86b8'
    },
    success : riotGetRankedInfo,
    error: riotError
   });
}

function riotGetRankedInfo(data, status, xhr){
  var id = data.id;
 $.ajax({
    type: 'GET',
    url: 'http://localhost:8080/https://na.api.riotgames.com/api/lol/NA/v1.3/stats/by-summoner/' + id + '/ranked?season=SEASON3',
    headers: {
     'X-Riot-Token' : 'RGAPI-bed3b0c9-2f04-4ecd-bbc0-a14b609c86b8'
    },
    success : successAlert,
    error: riotError
   });

}

function successAlert (data, status, xhr){
  console.log("success")
  console.log(data)
}

function riotError(err) {
  console.error(err)
;}


$(document).ready(setContent);