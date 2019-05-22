const enemy_filename = "../enemy_stats/characters.json";
var enemy_obj;

function myFunction() {
    const fs = require('fs');
    var enemy_file = fs.readFileSync(enemy_filename);
    enemy_obj = JSON.parse(enemy_file);
    
  };
  myFunction();