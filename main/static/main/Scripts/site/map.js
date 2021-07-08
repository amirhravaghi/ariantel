$("document").ready(()=>{
  var map = L.map('map')
  setMap(map,35.6892,51.3890);
  $("#allCity").change(function(){
      let lat = $(this).find(":selected").attr("data-lat");
      let lng = $(this).find(":selected").attr("data-lng");
      setMap(map,lat,lng);
  });

  // Search city
  $("#searchCity").change(function(){
    let val = $(this).val().trim();
    let cities = Array.from($("#allCity option"));
    for(let item of cities){
      if($(item).val().trim().includes(val)){
        $("#allCity option").removeAttr("selected");
        $(item).attr('selected','selected');
        $("#allCity").change();
        break;
      }
    }
  });

});

function setMap(map,lat,long){
  map.setView([lat, long], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  omnivore.kml('/static/main/hamrah.kml').addTo(map);
}
