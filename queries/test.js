
print('================== START ==================');

use if_project;

var a = db.detailed.find({},{
  ine : 1,
  codigo:1,
  
  aa_povoamento:1,
  aa_mato:1,
  aa_agricola:1,
  aa_espaco_florestal: 1,
  aa_total:1,
  
  reacendimento:1,
  queimada:1,
  falso_alarme:1,
  fogacho:1,
  incendio:1,
  agricola:1
});

var r = {
};

while(a.hasNext()){
  var d = a.next();
  var ine = d.ine.toString();
  
  if(d.queimada && d.aa_agricola < d.aa_espaco_florestal && d.aa_total < 1){
    printjson(d);
    print('.....');
  }
    
    
    
}

//printjson(r.control);
//print(r.tot);

exit;