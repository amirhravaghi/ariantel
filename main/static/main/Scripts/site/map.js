$("document").ready(()=>{
  var map = L.map('map')
  setMap(map,35.6892,51.3890);
  $("#allCity").change(function(){
      let lat = $(this).find(":selected").attr("data-lat");
      let lng = $(this).find(":selected").attr("data-lng");
      setMap(map,lat,lng);
  });
});

function setMap(map,lat,long){
  map.setView([lat, long], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  omnivore.kml('/static/main/hamrah.kml').addTo(map);
}
