print('================== START ==================');

use if_project;

print('Grouping data by year and month...');

var group = db.detailed.group({
  keyf : function(doc) {
    // Get the date.
    var d = new Date(doc.data_alerta);
    // Group by year and month.
    return {
      year : d.getFullYear(),
      // Add 1 to have the months starting at 1.
      month : d.getMonth()+1
    };
  },
  cond : {
    data_alerta : {
      $ne : ''
    },
    falso_alarme : 0
  },
  reduce : function(curr, result) {
    // Count result per year.
    result.total++;
  },
  initial : {
    total : 0
  }
});

print('Storing the grouped data in the fires_month collection...');

// Store the results in a new collection.
for (var item in group) {
  // Add compiled date for morris. Year-month.
  group[item]['date'] = group[item]['year'] + '-' + group[item]['month']; 
  db.fires_month.insert(group[item]);
}

print('================== FINISH =================');