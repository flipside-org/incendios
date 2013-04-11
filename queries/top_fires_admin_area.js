
// NOT Being used
exit;

print('================== START ==================');
use if_project;

// Drop existing temp.
print('Drop existing temp collection...');
db.temp_data.drop();

print('Adding parsed ine to each document...');

// Add parsed ine to each object.
db.detailed.find({},{data_alert: 1, aa_total: 1, causa: 1, causa_name: 1, causa_description: 1, ine :1}).forEach( function(doc){
  // Get the ine.
  var ine = doc.ine.toString();
  // The ine is constructed by two digits identifiers.
  // Distrito - Concelho - Freguesia
  if (ine.length == 5) {
    // If the first digit is a 0 and it's removed.
    var distrito = ine.substring(0,1);
    var concelho = ine.substring(0,3);
  }
  else {
    // 6 digits. get the first two.
    var distrito = ine.substring(0,2);
    var concelho = ine.substring(0,4);
  }
  
  doc.freguesia = ine;
  doc.distrito = distrito;
  doc.concelho = concelho;
  
  delete doc.ine;
  // Save to temp collection.
  db.temp_data.insert(doc);
  
});

print('Adding top fires to admin areas...');
var tot = db.admin_types.count();
var count = 0;

var updated = [];
db.admin_types.find().forEach( function(doc){
  var ine = doc.ine;
  var q = {};
  q[doc.admin] = ine;
  
  doc.top = [];
  
  db.temp_data.find(q).sort({aa_total : -1}).limit(10).forEach( function(doc2){
    
    var prepared = {};
    prepared._id = doc2._id;
    prepared.causa = doc2.causa;
    prepared.causa_name = doc2.causa_name;
    prepared.aa_total = doc2.aa_total;
    
    doc.top.push(prepared);    
    
  });
  
  updated.push(doc);
  
  // Counting...
  count++;
  print(Math.round((100*count / tot)*100)/100 + ' %');
  
});

print('Saving data...');
updated.forEach( function(doc3){
  db.admin_types.save(doc3);
}

db.temp_data.drop();

print('================== FINISH =================');