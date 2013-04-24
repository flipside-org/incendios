// Groups data by administrative area counting the occurrences and the area burnt.
// Final object structure example:
// {
//   _id: ObjectId("516678dfc33cc43add35b3c1"),
//   "2011": {
//       total: 565,
//       nulls: 0,
//       aa_total: 167.886,
//       incendio: 51,
//       fogacho: 343,
//       falso_alarme: 124,
//       queimada: 0,
//       agricola: 47
//    },
//    ine: "8",
//    total: 5537,
//    aa_total: 111642.74662,
//    admin: "distrito"
// }


function reducer(curr, result) {
  result.total++;
  // Total burnt area.
  if (!isNaN(curr.aa_total)){
    result.aa_total += parseFloat(curr.aa_total);
  }
  
  var date = new Date(curr.data_alerta);
  var year = date.getFullYear();
  
  var types = ['incendio', 'fogacho', 'falso_alarme', 'queimada', 'agricola'];
  // Create year group if it doesn't exit.
  if (!(year in result.data)){
    result.data[year] = {
      total : 0,
      nulls : 0,
      aa_total: 0
    };
    
    // Initialize all types.
    for (var i = 0; i < types.length; i++) {
      result.data[year][types[i]] = 0;
    }
  }
  
  // Total fires per year.
  result.data[year]['total']++;
  
  // Total burnt area per year.
  result.data[year]['aa_total'] += parseFloat(curr.aa_total);
  
  // Get the worst occurrence by comparing aa.
  if (curr.aa_total > result.top.incendio.aa_total ) {
    result.top.incendio.aa_total = curr.aa_total;
    result.top.incendio.date = curr.data_alerta;
  }
  
  // Get the worst year.
  if (result.top.year == 0) {
    result.top.year = year;
  }
  else {
    var top_year = result.top.year;
    // If the current aa id greater than the aa of the stored year.
    if (result.data[year]['aa_total'] > result.data[top_year]['aa_total']) {
      result.top.year = year;
    }
  }
  
  // Increment type.
  for (var i = 0; i < types.length; i++) {
    var type = types[i];
    
    if (curr[type]) {
      result.data[year][type]++;
      return;
    }
    
  }
  
  // If it gets here it's null.
  result.data[year]['nulls']++;
}
  


print('================== START ==================');
use if_project;

print('Grouping data by distrito...');

var group_dist = db.detailed.group({
  keyf : function(doc) {
    // Get the ine.
    var ine = doc.ine.toString();
    // The ine is constructed by two digits identifiers.
    // Distrito - Concelho - Freguesia
    if (ine.length == 5) {
      // If the first digit is a 0 and it's removed.
      var distrito = ine.substring(0,1);
    }
    else {
      // 6 digits. get the first two.
      var distrito = ine.substring(0,2);
    }
    
    // Group by distrito.
    return {
      // Change from ine to aaid
      aaid : distrito,
    };
  },
  reduce : reducer,
  initial : {
    total : 0,
    aa_total : 0,
    top : {
      incendio : {
        date : 0,
        aa_total : 0,
      },
      year : 0,
    },
    data : {}
  },
  finalize: function(result) {
    result.admin = 'distrito';
  }
});

print('Inserting into collection...');
for (var i = 0; i < group_dist.length; i++) {
  if (group_dist[i].ine != 0) {
    db.admin_types.save(group_dist[i]);
  }
}

print('Grouping data by Concelho...');

var group_con = db.detailed.group({
  keyf : function(doc) {
    // Get the ine.
    var ine = doc.ine.toString();
    // The ine is constructed by two digits identifiers.
    // Distrito - Concelho - Freguesia
    if (ine.length == 5) {
      // If the first digit is a 0 and it's removed.
      var concelho = ine.substring(0,3);
    }
    else {
      // 6 digits. get the first two.
      var concelho = ine.substring(0,4);
    }
    
    // Group by concelho.
    return {
      // Change from ine to aaid
      aaid : concelho,
    };
  },
  reduce : reducer,
  initial : {
    total : 0,
    aa_total : 0,
    top : {
      incendio : {
        date : 0,
        aa_total : 0,
      },
      year : 0,
    },
    data : {}
  },
  finalize: function(result) {
    result.admin = 'concelho';
  }
});

print('Inserting into collection...');
for (var i = 0; i < group_con.length; i++) {
  if (group_con[i].ine != 0) {
    db.admin_types.save(group_con[i]);
  }
}



print('Grouping data by Freguesia...');

var group_freg = db.detailed.group({
  keyf : function(doc) {
    // Group by Freguesia.
    return {
      // Change from ine to aaid
      aaid : doc.ine.toString(),
    };
  },
  reduce : reducer,
  initial : {
    total : 0,
    aa_total : 0,
    top : {
      incendio : {
        date : 0,
        aa_total : 0,
      },
      year : 0,
    },
    data : {}
  },
  finalize: function(result) {
    result.admin = 'freguesia';
  }
});

print('Inserting into collection...');
for (var i = 0; i < group_freg.length; i++) {
  if (group_freg[i].ine != 0) {
    db.admin_types.save(group_freg[i]);
  }
}

print('================== FINISH =================');