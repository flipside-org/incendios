# admin_types.json

This file contains data relative to each administrative area. Contains the amount of fires per year and their type as well as the amount of burnt area. It also contains a top section with the most significative event of that area.

#### Import
```
mongoimport -d incendios -c adminstats --jsonArray < adminstats.json
```

#### Example object

```
{
    "_id": {
        "$oid": "5177acf603f671df33a419db"
    },
    "aaid": "8",
    "total": 5537,
    "aa_total": 111642.7466200017,
    "top": {
        "incendio": {
            "date": "2003-09-11",
            "aa_total": 17213
        },
        "year": 2003
    },
    "data": {
        "2001": {
            "total": 215,
            "nulls": 0,
            "aa_total": 3293.274000000004,
            "incendio": 54,
            "fogacho": 138,
            "falso_alarme": 0,
            "queimada": 0,
            "agricola": 23
        },
        "2002": {
            "total": 274,
            "nulls": 0,
            "aa_total": 1833.141700000001,
            "incendio": 73,
            "fogacho": 175,
            "falso_alarme": 0,
            "queimada": 0,
            "agricola": 26
        },
        "2003": {
            "total": 234,
            "nulls": 0,
            "aa_total": 61662.05702,
            "incendio": 79,
            "fogacho": 138,
            "falso_alarme": 0,
            "queimada": 1,
            "agricola": 16
        },
        "2004": {
            "total": 274,
            "nulls": 0,
            "aa_total": 40181.80829999999,
            "incendio": 87,
            "fogacho": 153,
            "falso_alarme": 0,
            "queimada": 0,
            "agricola": 34
        },
        "2005": {
            "total": 345,
            "nulls": 0,
            "aa_total": 1745.445199999998,
            "incendio": 89,
            "fogacho": 256,
            "falso_alarme": 0,
            "queimada": 0,
            "agricola": 0
        },
        "2006": {
            "total": 942,
            "nulls": 0,
            "aa_total": 198.0302000000005,
            "incendio": 64,
            "fogacho": 662,
            "falso_alarme": 166,
            "queimada": 8,
            "agricola": 42
        },
        "2007": {
            "total": 792,
            "nulls": 0,
            "aa_total": 271.7389999999996,
            "incendio": 57,
            "fogacho": 564,
            "falso_alarme": 109,
            "queimada": 0,
            "agricola": 62
        },
        "2008": {
            "total": 640,
            "nulls": 0,
            "aa_total": 305.2593999999983,
            "incendio": 43,
            "fogacho": 471,
            "falso_alarme": 109,
            "queimada": 0,
            "agricola": 17
        },
        "2009": {
            "total": 738,
            "nulls": 0,
            "aa_total": 1795.6202,
            "incendio": 51,
            "fogacho": 550,
            "falso_alarme": 120,
            "queimada": 0,
            "agricola": 17
        },
        "2010": {
            "total": 518,
            "nulls": 0,
            "aa_total": 188.4856000000001,
            "incendio": 24,
            "fogacho": 303,
            "falso_alarme": 142,
            "queimada": 0,
            "agricola": 49
        },
        "2011": {
            "total": 565,
            "nulls": 0,
            "aa_total": 167.8859999999999,
            "incendio": 51,
            "fogacho": 343,
            "falso_alarme": 124,
            "queimada": 0,
            "agricola": 47
        }
    },
    "admin": "distrito"
}
```