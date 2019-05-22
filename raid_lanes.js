const fs = require('fs');
const fastcsv = require('fast-csv');
const R = require('ramda');
const _ = require('underscore');
var raid_obj;
var details_obj;
var lanes;

function recurse_lanes (current_node, lane) {
    if(current_node){
        var next_lane = lane.slice(0);
        next_lane.push(current_node);
        var k=0;
        for (var i = 0; i<3; i++){
            if(raid_obj.RaidDetails.rooms[current_node].nextRooms[i]){
                recurse_lanes(raid_obj.RaidDetails.rooms[current_node].nextRooms[i], next_lane)
            }else{
                k++;
            }
        }
        if (k==3){
            lanes.push(next_lane);
        }
    }
}

function total_lane_health (total, current_node) {
    if(raid_obj.RaidDetails.rooms[current_node].missions[1]){
        
    var current_node_details = details_obj.MissionDetails.find(function(element) {
        return element.ID == raid_obj.RaidDetails.rooms[current_node].missions[1].ID;
    });
}
    if (current_node_details){
        return total+current_node_details.Settings[1].TotalHealth;
    }
    else {
        return total;
    }
}

function all_lanes_total_health (current_lane){
    return current_lane.reduce(total_lane_health,0);
}

function all_lanes_length (current_lane){
    return current_lane.length;
}

function myFunction() {
    console.log ("Hello World!");
    const raid = "raid_alpha_a"
    var raid_file = fs.readFileSync("../ave/"+raid+".json","UTF8");
    raid_obj = JSON.parse(raid_file);
    //var details_file = fs.readFileSync("../m3missions/RaidMissionDetails.json","UTF8");
    var details_file = fs.readFileSync("../m3missions/EventRaidMissionDetails.json","UTF8");
    details_obj = JSON.parse(details_file);

    lanes = [];
    recurse_lanes(raid_obj.RaidDetails.startingRoomId, []);
    
    var lanes_health=lanes.map(all_lanes_total_health);
    var lanes_length=lanes.map(all_lanes_length);
    
    var nodes_in_lanes = {};
    lanes.forEach(function(element, index)  {
      element.forEach(element => {
        if (!nodes_in_lanes[element])
          nodes_in_lanes[element] = [];
        nodes_in_lanes[element].push (index); 
      });
    });

    var raid_map = raid_obj.RaidDetails.map;
    var rows = raid_obj.RaidDetails.rows;
    var columns = raid_obj.RaidDetails.columns;
    var html_map = "<table>";
    for (var column = columns-1; column >=0; column--){
    
      html_map+="<tr>"
      for (var row = 0; row < rows; row++){
        html_map+="<td"
//        if nodes_in_lanes[]
        html_map+=">";
        var current_node=raid_map[row][column];
        if (current_node){
          html_map+= current_node;
          html_map+= "<br/>";
          html_map+=raid_obj.RaidDetails.rooms[current_node].name;
          html_map+= "<br/>";
          
          
          if(raid_obj.RaidDetails.rooms[current_node].missions[1]){
            html_map+=raid_obj.RaidDetails.rooms[current_node].missions[1].ID;
            html_map+= "<br/>";
            html_map+=raid_obj.RaidDetails.rooms[current_node].missions[1].icon;
            html_map+= "<br/>";
          
  
          var current_node_details = details_obj.MissionDetails.find(function(element) {
            return element.ID == raid_obj.RaidDetails.rooms[current_node].missions[1].ID;
          });
           
          if (current_node_details){
          html_map+= "Power: "+current_node_details.Settings[1].Power;
          html_map+= "<br/>";
          html_map+= "TotalHealth:"+current_node_details.Settings[1].TotalHealth;
          }
          
          
          html_map+= "<br/>";
        }
  
  
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
    html_map+="</table>";
    fs.writeFileSync("../"+raid+"_map.html",fs.readFileSync("html_pre")+html_map+fs.readFileSync("html_post"));
    
 //   html_map+=(JSON.stringify(lanes, null, 1)+JSON.stringify(lanes_health, null, 1)+JSON.stringify(lanes_health.sort(), null, 1)).replace(/\n/g,"<br/>");
 //   html_map+=(JSON.stringify(lanes_length, null, 1)).replace(/\n/g,"<br/>");
    

  var ws = fs.createWriteStream("../"+raid+"_lanes.csv");  
  fastcsv
    .write(lanes, { headers: true })
    .pipe(ws);
  
  var ws = fs.createWriteStream("../"+raid+"_lanes_stat.csv");  
  fastcsv
    .write(R.transpose([_.range(0,lanes.length),lanes_health,lanes_length]), { headers: true })
    .pipe(ws);
    
   
  };
  myFunction();
  console.log ("Goodbye World!");