function myFunction() {
  console.log ("Hello World!");
  const fs = require('fs');
  var raid_file = fs.readFileSync("../raid_gamma_a.json","UTF8");
  var raid_obj = JSON.parse(raid_file);
  var details_file = fs.readFileSync("../EventRaidMissionDetails.json","UTF8");
  var details_obj = JSON.parse(details_file);
  var raid_map = raid_obj.RaidDetails.map;
  var rows = raid_obj.RaidDetails.rows;
  var columns = raid_obj.RaidDetails.columns;
  var html_map = "<table>";
  for (var column = columns-1; column >=0; column--){
  
    html_map+="<tr>"
    for (var row = 0; row < rows; row++){
      html_map+="<td>";
      var current_node=raid_map[row][column];
      if (current_node){
        html_map+= current_node;
        html_map+= "<br/>";
        html_map+=raid_obj.RaidDetails.rooms[current_node].name;
        html_map+= "<br/>";
        if(raid_obj.RaidDetails.rooms[current_node].missions[1]){
          html_map+=raid_obj.RaidDetails.rooms[current_node].missions[1].icon;
          html_map+= "<br/>";
        }

        var current_node_details = details_obj.MissionDetails.find(function(element) {
          return element.ID == raid_obj.RaidDetails.rooms[current_node].name;
        });
         
        if (current_node_details){
        html_map+= "Power: "+current_node_details.Settings[1].Power;
        html_map+= "<br/>";
        html_map+= "TotalHealth:"+current_node_details.Settings[1].TotalHealth;
        }
        
        
        html_map+= "<br/>";



        html_map+=raid_obj.RaidDetails.rooms[current_node].nextRooms;
        html_map+= "<br/>";
        
        if (raid_obj.RaidDetails.rooms[current_node].nextRooms[0])
          html_map+="^"+raid_obj.RaidDetails.rooms[current_node].nextRooms[0];
        if (raid_obj.RaidDetails.rooms[current_node].nextRooms[1])
          html_map+="&lt;"+raid_obj.RaidDetails.rooms[current_node].nextRooms[1];
        if (raid_obj.RaidDetails.rooms[current_node].nextRooms[2])
          html_map+=">"+raid_obj.RaidDetails.rooms[current_node].nextRooms[2];
        html_map+= "<br/>";
        if (raid_obj.RaidDetails.rooms[current_node].starting)
          html_map+="<br/>Start!";
      }
      html_map+="</td>";
    }
    html_map+="</tr>";
  }
  html_map+="</table>"
  console.log(html_map)

  
 
};
myFunction();
