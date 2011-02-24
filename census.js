var xVersion = 3;
var G = google.maps;
var fc = 1;
var zoom = 4; //4-12 are valid, 12 is all the way in, 4 is zoomed all the way out.
var centerPoint = new G.LatLng(39.1, -92.767578);
var xKML = 0;
var xProperty = 0;
var container;
var map;
var geocoder;
var datatype = 1;
var maptype = 2;
var xTiles = []; 
var xActive = 0;
var opacity = 100;
var category = 0; //1 = population, 2= race/eth, 3 = housing
var dataChose = 0;
var xMarker = 0;
var activeClick = 0; //keeps track if you clicked map, before data comes back, did you zoom, if so, stop click action
var info = $("#info_div"); //This way we only have to look up this location once.
var stylez = [
{
    featureType: "all",
    elementType: "all",
    stylers: [{
        visibility: "off"
    }]
},
{
    featureType: "water",
    elementType: "geometry",
    stylers: [{
        visibility: "simplified"
    }, {
        lightness: 50
    }]
}];
var labelStyleOut = 'p.v:off,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01,s.t:18|s.e:g|p.v:on|p.il:true|p.l:-100|p.g:0.01,s.t:17|s.e:g|p.v:on|p.il:true|p.l:41';
var overlayMaps = [
// These are simply ImageMapTypeOptions we keep to create ImageMapTypes on demand when checkboxes are clicked - opacity:0.9,
{
    getTileUrl: function (coord, zoom) {
            var apistyle = labelStyleOut;
            switch (zoom) {
                case 6:
                        apistyle = 'p.v:off,s.t:1|s.e:g|p.v:on|p.g:0.04|p.il:true,s.t:19|s.e:l|p.il:true|p.g:0.01|p.v:on,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01';
                        break;
                case 7:
                        apistyle = 'p.v:off,s.t:1|s.e:g|p.v:on|p.g:0.04|p.il:true,s.t:19|s.e:l|p.il:true|p.g:0.01|p.v:on,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01';
                        break;
                case 8:
                        apistyle = 'p.v:off,s.t:3|p.s:-100|p.g:0.01|p.v:simplified,s.t:1|s.e:g|p.v:on|p.g:0.04|p.il:true,s.t:19|s.e:l|p.il:true|p.g:0.01|p.v:on,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01';
                        break;
                case 9:
                case 10:
                        apistyle = 'p.v:off,s.t:49|p.s:-100|p.g:0.01|p.v:simplified,s.t:3|p.s:-100|p.g:0.01|p.v:simplified,s.t:1|s.e:g|p.v:on|p.g:0.04|p.il:true,s.t:19|s.e:l|p.il:true|p.g:0.01|p.v:on,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01';
                        break;
                case 11:
                        apistyle = 'p.v:off,s.t:49|s.e:g|p.v:simplified|p.s:-100|p.g:0.01,s.t:3|p.s:-100|p.g:0.01|p.v:simplified,s.t:1|s.e:g|p.v:on|p.g:0.04|p.il:true,s.t:19|s.e:l|p.il:true|p.g:0.01|p.v:on,s.t:18|s.e:l|p.v:on|p.il:true|p.g:0.01';
                        break;
                default:
                        apistyle = labelStyleOut;
        }
        return 'http://mt1.googleapis.com/vt?lyrs=h@142&src=apiv3&hl=en-US&apistyle=' + apistyle + '&x=' + coord.x + '&y=' + coord.y + '&z=' + zoom + '&s=Galile';
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true
}];
var xHeadlines = Array('', 'Percent hispanic population 2010', '2010 Population per square mile', 'Percent change in total population 2010-2000', 'USA TODAY Diversity Index 2010', 'Percent housing units vacant 2010', 'Largest minority excluding white, not hispanic');
var xZoomChatters = Array('', '', '', '', 'Zoom for more detail. Color coded by county. Click to get state information.', 'Zoom for more detail. Color coded by county. Click to get county information.', 'Zoom for more detail. Color coded by county. Click to get county information.', 'Zoom for more detail. Color coded by county. Click to get county information.', 'Color coded by tract. Click to get county information.', 'Color coded by tract. Click to get tract information.', 'Color coded by tract. Click to get tract information.', 'Color coded by tract. Click to get tract information.', 'Color coded by tract. Click to get tract information.');
var xListArray = {
    '4': {
        "xmin": 2,
        "xmax": 5,
        "ymin": 5,
        "ymax": 6
    },
    '5': {
        "xmin": 4,
        "xmax": 10,
        "ymin": 10,
        "ymax": 13
    },
    '6': {
        "xmin": 9,
        "xmax": 20,
        "ymin": 21,
        "ymax": 27
    },
    '7': {
        "xmin": 19,
        "xmax": 41,
        "ymin": 42,
        "ymax": 55
    },
    '8': {
        "xmin": 39,
        "xmax": 80,
        "ymin": 87,
        "ymax": 110
    },
    '9': {
        "xmin": 78,
        "xmax": 161,
        "ymin": 175,
        "ymax": 220
    },
    '10': {
        "xmin": 155,
        "xmax": 322,
        "ymin": 348,
        "ymax": 441
    },
    '11': {
        "xmin": 312,
        "xmax": 644,
        "ymin": 698,
        "ymax": 881
    },
    '12': {
        "xmin": 625,
        "xmax": 1288,
        "ymin": 1396,
        "ymax": 1762
    }
};
var cjMaps = [{
    getTileUrl: function (p, z) {
        var url = '';
        if (((p.x < xListArray[z]['xmin']) || (p.x > xListArray[z]['xmax'])) || ((p.y < xListArray[z]['ymin']) || (p.y > xListArray[z]['ymax']))) {
            url = 'xmap/empty.gif';
        } else {
            if (z >= 10) {
                if (z >= 12) {
                    //high res tile
                    url = 'get_tile.php?tile=' + p.x + '-' + p.y + '-' + z + '.gif&xd=' + datatype;
                } else {
                    url = 'tile/' + datatype + '/' + z + '/' + p.y + '/' + p.x + '-' + p.y + '-' + z + '.gif?xv=' + xVersion; //?r=' + Math.random();
                }
            } else {
                url = 'tile/' + datatype + '/' + z + '/' + p.x + '-' + p.y + '-' + z + '.gif?xv=' + xVersion; //?r=' + Math.random();
            }
        }
        return url;
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: false
}];
var PropertyArray = {
    'montgomeryadvertiser': {
        "xlat": 32.378996,
        "xlon": -86.31438,
        "zoom": 7
    },
    'azcentral': {
        "xlat": 33.451449,
        "xlon": -112.071202,
        "zoom": 7
    },
    'tucsoncitizen': {
        "xlat": 32.164453,
        "xlon": -110.956334,
        "zoom": 7
    },
    'baxterbulletin': {
        "xlat": 36.335319,
        "xlon": -92.385498,
        "zoom": 7
    },
    'mydesert': {
        "xlat": 33.831965,
        "xlon": -116.502701,
        "zoom": 7
    },
    'californianonline': {
        "xlat": 36.673219,
        "xlon": -121.658118,
        "zoom": 7
    },
    'tulareadvanceregister': {
        "xlat": 36.213758,
        "xlon": -119.344937,
        "zoom": 7
    },
    'visaliatimesdelta': {
        "xlat": 36.332398,
        "xlon": -119.296455,
        "zoom": 7
    },
    'coloradoan': {
        "xlat": 40.574757,
        "xlon": -105.052715,
        "zoom": 7
    },
    'delawareonline': {
        "xlat": 39.17,
        "xlon": -74.83,
        "zoom": 8
    },
    'floridatoday': {
        "xlat": 28.227179,
        "xlon": -80.700136,
        "zoom": 7
    },
    'news-press': {
        "xlat": 26.640733,
        "xlon": -81.863611,
        "zoom": 7
    },
    'pensacolanewsjournal': {
        "xlat": 30.41151,
        "xlon": -87.213887,
        "zoom": 7
    },
    'guampdn': {
        "xlat": 13.44953,
        "xlon": 144.749847,
        "zoom": 7
    },
    'indystar': {
        "xlat": 39.93,
        "xlon": -86.08,
        "zoom": 7
    },
    'jconline': {
        "xlat": 40.419364,
        "xlon": -86.890465,
        "zoom": 7
    },
    'thestarpress': {
        "xlat": 40.191571,
        "xlon": -85.387844,
        "zoom": 7
    },
    'pal-item': {
        "xlat": 39.830408,
        "xlon": -84.886629,
        "zoom": 7
    },
    'desmoinesregister': {
        "xlat": 41.586639,
        "xlon": -93.626587,
        "zoom": 7
    },
    'press-citizen': {
        "xlat": 41.679562,
        "xlon": -91.511178,
        "zoom": 7
    },
    'courier-journal': {
        "xlat": 38.246398,
        "xlon": -85.760507,
        "zoom": 7
    },
    'thetowntalk': {
        "xlat": 31.310339,
        "xlon": -92.443418,
        "zoom": 7
    },
    'theadvertiser': {
        "xlat": 31.41,
        "xlon": -91.92,
        "zoom": 7
    },
    'thenewsstar': {
        "xlat": 32.50619,
        "xlon": -92.117309,
        "zoom": 7
    },
    'dailyworld': {
        "xlat": 30.503782,
        "xlon": -92.071696,
        "zoom": 7
    },
    'shreveporttimes': {
        "xlat": 32.511578,
        "xlon": -93.74392,
        "zoom": 7
    },
    'delmarvanow': {
        "xlat": 38.363298,
        "xlon": -75.598315,
        "zoom": 7
    },
    'battlecreekenquirer': {
        "xlat": 42.323469,
        "xlon": -85.184774,
        "zoom": 7
    },
    'freep': {
        "xlat": 42.328908,
        "xlon": -83.053928,
        "zoom": 7
    },
    'lansingstatejournal': {
        "xlat": 42.728437,
        "xlon": -84.551868,
        "zoom": 7
    },
    'livingstondaily': {
        "xlat": 42.606285,
        "xlon": -83.927694,
        "zoom": 7
    },
    'thetimesherald': {
        "xlat": 42.974766,
        "xlon": -82.424672,
        "zoom": 7
    },
    'sctimes': {
        "xlat": 45.563921,
        "xlon": -94.194413,
        "zoom": 7
    },
    'hattiesburgamerican': {
        "xlat": 31.32876,
        "xlon": -89.293648,
        "zoom": 7
    },
    'clarionledger': {
        "xlat": 32.298383,
        "xlon": -90.183221,
        "zoom": 7
    },
    'news-leader': {
        "xlat": 37.214609,
        "xlon": -93.292452,
        "zoom": 7
    },
    'greatfallstribune': {
        "xlat": 47.499528,
        "xlon": -111.306386,
        "zoom": 7
    },
    'rgj': {
        "xlat": 39.528499,
        "xlon": -119.797218,
        "zoom": 7
    },
    'app': {
        "xlat": 40.222527,
        "xlon": -74.087385,
        "zoom": 7
    },
    'mycentraljersey': {
        "xlat": 40.566949,
        "xlon": -74.60886,
        "zoom": 7
    },
    'courierpostonline': {
        "xlat": 39.925412,
        "xlon": -75.055365,
        "zoom": 7
    },
    'dailyrecord': {
        "xlat": 40.848891,
        "xlon": -74.454487,
        "zoom": 7
    },
    'thedailyjournal': {
        "xlat": 39.500816,
        "xlon": -75.009278,
        "zoom": 7
    },
    'pressconnects': {
        "xlat": 42.142688,
        "xlon": -75.939363,
        "zoom": 7
    },
    'stargazette': {
        "xlat": 42.089538,
        "xlon": -76.803402,
        "zoom": 7
    },
    'theithacajournal': {
        "xlat": 42.439406,
        "xlon": -76.499476,
        "zoom": 7
    },
    'poughkeepsiejournal': {
        "xlat": 41.706528,
        "xlon": -73.927719,
        "zoom": 7
    },
    'democratandchronicle': {
        "xlat": 43.154241,
        "xlon": -77.612068,
        "zoom": 7
    },
    'citizen-times': {
        "xlat": 35.595226,
        "xlon": -82.557113,
        "zoom": 7
    },
    'bucyrustelegraphforum': {
        "xlat": 40.807422,
        "xlon": -82.975982,
        "zoom": 7
    },
    'chillicothegazette': {
        "xlat": 39.332833,
        "xlon": -82.983607,
        "zoom": 7
    },
    'cincinnati': {
        "xlat": 39.09858,
        "xlon": -84.515495,
        "zoom": 7
    },
    'coshoctontribune': {
        "xlat": 40.273634,
        "xlon": -81.862263,
        "zoom": 7
    },
    'thenews-messenger': {
        "xlat": 41.363988,
        "xlon": -83.132066,
        "zoom": 7
    },
    'lancastereaglegazette': {
        "xlat": 39.712337,
        "xlon": -82.603115,
        "zoom": 7
    },
    'mansfieldnewsjournal': {
        "xlat": 40.761233,
        "xlon": -82.518152,
        "zoom": 7
    },
    'marionstar': {
        "xlat": 40.589305,
        "xlon": -83.12816,
        "zoom": 7
    },
    'newarkadvocate': {
        "xlat": 40.05938,
        "xlon": -82.399227,
        "zoom": 7
    },
    'portclintonnewsherald': {
        "xlat": 41.51173,
        "xlon": -82.941507,
        "zoom": 7
    },
    'zanesvilletimesrecorder': {
        "xlat": 39.939551,
        "xlon": -82.007597,
        "zoom": 7
    },
    'statesmanjournal': {
        "xlat": 44.941039,
        "xlon": -123.034421,
        "zoom": 7
    },
    'greenvilleonline': {
        "xlat": 34.847344,
        "xlon": -82.400383,
        "zoom": 7
    },
    'argusleader': {
        "xlat": 43.545875,
        "xlon": -96.73112,
        "zoom": 6
    },
    'theleafchronicle': {
        "xlat": 36.526309,
        "xlon": -87.358186,
        "zoom": 7
    },
    'jacksonsun': {
        "xlat": 35.615348,
        "xlon": -88.821836,
        "zoom": 7
    },
    'dnj': {
        "xlat": 35.84754,
        "xlon": -86.393503,
        "zoom": 7
    },
    'tennessean': {
        "xlat": 36.157353,
        "xlon": -86.786031,
        "zoom": 7
    },
    'thespectrum': {
        "xlat": 37.110068,
        "xlon": -113.577528,
        "zoom": 7
    },
    'burlingtonfreepress': {
        "xlat": 44.477049,
        "xlon": -73.212473,
        "zoom": 7
    },
    'newsleader': {
        "xlat": 38.149594,
        "xlon": -79.073547,
        "zoom": 7
    },
    'postcrescent': {
        "xlat": 44.263148,
        "xlon": -88.409048,
        "zoom": 7
    },
    'fdlreporter': {
        "xlat": 43.775484,
        "xlon": -88.448617,
        "zoom": 7
    },
    'greenbaypressgazette': {
        "xlat": 44.513221,
        "xlon": -88.012659,
        "zoom": 7
    },
    'htrnews': {
        "xlat": 44.090674,
        "xlon": -87.659332,
        "zoom": 7
    },
    'marshfieldnewsherald': {
        "xlat": 44.664967,
        "xlon": -90.175301,
        "zoom": 7
    },
    'thenorthwestern': {
        "xlat": 44.016213,
        "xlon": -88.53621,
        "zoom": 7
    },
    'sheboyganpress': {
        "xlat": 43.750988,
        "xlon": -87.710223,
        "zoom": 7
    },
    'stevenspointjournal': {
        "xlat": 44.524115,
        "xlon": -89.584568,
        "zoom": 7
    },
    'wausaudailyherald': {
        "xlat": 44.960445,
        "xlon": -89.618684,
        "zoom": 7
    },
    'wisconsinrapidstribune': {
        "xlat": 44.391682,
        "xlon": -89.828416,
        "zoom": 7
    },
    'myatltv': {
        "xlat": 33.809345,
        "xlon": -84.370555,
        "zoom": 7
    },
    '11alive': {
        "xlat": 33.809345,
        "xlon": -84.370555,
        "zoom": 7
    },
    'wlbz': {
        "xlat": 44.816807,
        "xlon": -68.752785,
        "zoom": 7
    },
    'wgrz': {
        "xlat": 42.891436,
        "xlon": -78.876341,
        "zoom": 7
    },
    'wkyc': {
        "xlat": 41.507805,
        "xlon": -81.68726,
        "zoom": 7
    },
    'wltx': {
        "xlat": 33.982931,
        "xlon": -80.965943,
        "zoom": 7
    },
    'my20denver': {
        "xlat": 39.721773,
        "xlon": -104.981565,
        "zoom": 7
    },
    '9news': {
        "xlat": 39.721773,
        "xlon": -104.981565,
        "zoom": 7
    },
    'wzzm13': {
        "xlat": 43.014223,
        "xlon": -85.685409,
        "zoom": 7
    },
    'digtriad': {
        "xlat": 35.72,
        "xlon": -79.6968,
        "zoom": 7
    },
    'firstcoastnews': {
        "xlat": 30.324096,
        "xlon": -81.64286,
        "zoom": 7
    },
    'wbir': {
        "xlat": 35.998446,
        "xlon": -83.923266,
        "zoom": 7
    },
    'todaysthv': {
        "xlat": 34.74323,
        "xlon": -92.281244,
        "zoom": 7
    },
    '13wmaz': {
        "xlat": 32.861125,
        "xlon": -83.614126,
        "zoom": 7
    },
    'kare11': {
        "xlat": 44.983938,
        "xlon": -93.390738,
        "zoom": 7
    },
    'wcsh6': {
        "xlat": 43.654032,
        "xlon": -70.262918,
        "zoom": 7
    },
    'news10': {
        "xlat": 38.565815,
        "xlon": -121.508466,
        "zoom": 6
    },
    'ksdk': {
        "xlat": 38.626743,
        "xlon": -90.195732,
        "zoom": 7
    },
    'tampabays10': {
        "xlat": 27.870458,
        "xlon": -82.615701,
        "zoom": 7
    },
    'wusatv9': {
        "xlat": 38.942279,
        "xlon": -77.076664,
        "zoom": 7
    }
};
//'nky' : {"xlat" : , "xlon" : , "zoom" : 7 },
//'hometownlife' : {"xlat" : , "xlon" : , "zoom" : 7 },
//'lohud' : {"xlat" :, "xlon" : , "zoom" : 7 },
//'centralohio' : {"xlat" :, "xlon" : , "zoom" : 7 },


function DetermineCenter() {
    if (xProperty != 0) {
        if (PropertyArray[xProperty] !== undefined) {
            centerPoint = new G.LatLng(PropertyArray[xProperty]['xlat'], PropertyArray[xProperty]['xlon']);
            zoom = PropertyArray[xProperty]['zoom'];
        }
    }
}

function load() {
    DetermineCenter();
    container = $('#mapDiv');
    var myOptions = {
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Easy']
        },
        zoom: zoom,
        center: centerPoint,
        mapTypeId: 'Easy',
        maxZoom: 12,
        minZoom: 4,
        panControl: false,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    };
    map = new G.Map(container, myOptions);
    geocoder = new google.maps.Geocoder();
    map.overlayMapTypes.push(null);
    map.overlayMapTypes.push(null);
    map.overlayMapTypes.push(null);
    var styledMapOptions = {
        name: "Simple"
    };
    var jayzMapType = new google.maps.StyledMapType(stylez, styledMapOptions);
    map.mapTypes.set('Easy', jayzMapType);
    //----add the labels overlay
    var overlayMap = new google.maps.ImageMapType(overlayMaps[0]);
    map.overlayMapTypes.setAt(1, overlayMap);
    var xActive = new google.maps.ImageMapType(cjMaps[0]);
    map.overlayMapTypes.setAt(0, xActive);
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var zoomLevel = map.getZoom();
        log( zoomLevel );
        $("#zoom_div").html("Zoom: " + zoomLevel);
        $("#xChatter").html(xZoomChatters[zoomLevel]);
        activeClick = 0;
    });
    google.maps.event.addListener(map, 'click', function (event) {
        getClickLocation(event.latLng);
    });
    if (fc) {
        google.maps.event.addListener(map, 'mouseup', function () {
            info.html(map.getCenter());
        });
    }
    clickDat(3);
    $("#xHelpBox").hide(); //hide help box
    // this is the functionality for the hover on the choose map type box
    $("#xChooseBox").hover(

    function () {}, function () {
        $("#xChooseBox").hide();
    });
}

$(document).ready(function(){
        load();
});


function ChangeLabelVis(xitem) {
    log( xitem.checked );
    if (xitem.checked) {
        var overlayMap = new google.maps.ImageMapType(overlayMaps[0]);
        map.overlayMapTypes.setAt(1, overlayMap);
    } else {
        map.overlayMapTypes.setAt(1, null);
    }
}

function getData(state, county, third, postal, statename, latlng) {
    var StateFips = {
        'AL': 1,
        'DE': 10,
        'DC': 11,
        'FL': 12,
        'GA': 13,
        'HI': 15,
        'ID': 16,
        'IL': 17,
        'IN': 18,
        'IA': 19,
        'AK': 2,
        'KS': 20,
        'KY': 21,
        'LA': 22,
        'ME': 23,
        'MD': 24,
        'MA': 25,
        'MI': 26,
        'MN': 27,
        'MS': 28,
        'MO': 29,
        'MT': 30,
        'NE': 31,
        'NV': 32,
        'NH': 33,
        'NJ': 34,
        'NM': 35,
        'NY': 36,
        'NC': 37,
        'ND': 38,
        'OH': 39,
        'AZ': 4,
        'OK': 40,
        'OR': 41,
        'PA': 42,
        'RI': 44,
        'SC': 45,
        'SD': 46,
        'TN': 47,
        'TX': 48,
        'UT': 49,
        'AR': 5,
        'VT': 50,
        'VA': 51,
        'WA': 53,
        'WV': 54,
        'WI': 55,
        'WY': 56,
        'CA': 6,
        'PR': 72,
        'VI': 78,
        'CO': 8,
        'CT': 9
    };
    var x = latlng.lng();
    var y = latlng.lat();
    var zoom = map.getZoom();
    var xURL = 'get_data.php?z=' + zoom + '&sf=' + StateFips[state] + '&xd=' + datatype + '&cn=' + county + '&x=' + x + '&y=' + y;
switch (datatype) {
    case 1://  HISPANIC
        $.get(xURL, function (data) {
            if ((data !== '') && (activeClick)) {
                $('#data_box_1').dialog('open');
                data = data.split("~");
                if (data.length >= 7) {
                    $("#side_bar_1").css("visibility", "visible");
                    $("#hd_1").html(data[0].toUpperCase());
                    $("#h2").html('2010 Population: ' + Comma(data[1]));
                    $("#h3").html(data[2] + '%');
                    $("#h6").css("width", 0.95 * data[3] + "px");
                    $("#h7").html(data[3] + '%');
                    $("#h7").css("left", ((0.95 * data[3]) + 14) + "px");
                    $("#h8").html(data[5] + '%');
                    activeClick = 0;
                    DrawKML(zoom, data[8]);
                }
            }
        });
        break;
    case 2:
    case 3://  POPULTION CHANGE and DENSITY
        $.get(xURL, function (data) {
            if ((data !== '') && (activeClick)) {
                $('#data_box_3').dialog('open');
                data = data.split("~");
                $("#side_bar_3").css("visibility", "visible");
                $("#hd_3").html(data[0].toUpperCase());
                $("#x2").html('2010 Population: ' + Comma(data[1]));
                $("#x3").html(data[2] + '%');
                $("#x6").css("width", 0.95 * data[4] + "px");
                $("#x7").html(data[4] + '%');
                $("#x7").css("left", ((0.95 * data[4]) + 14) + "px");
                $("#x8").html(data[13] + '%');
                $("#x10").css("width", 0.95 * data[5] + "px");
                $("#x11").html(data[5] + '%');
                $("#x11").css("left", ((0.95 * data[5]) + 14) + "px");
                $("#x12").html(data[14] + '%');
                $("#x14").css("width", 0.95 * data[6] + "px");
                $("#x15").html(data[6] + '%');
                $("#x15").css("left", ((0.95 * data[6]) + 14) + "px");
                $("#x16").html(data[15] + '%');
                $("#x18").css("width", 0.95 * data[7] + "px");
                $("#x19").html(data[7] + '%');
                $("#x19").css("left", ((0.95 * data[7]) + 14) + "px");
                $("#x20").html(data[16] + '%');
                $("#x22").css("width", 0.95 * data[8] + "px");
                $("#x23").html(data[8] + '%');
                $("#x23").css("left", ((0.95 * data[8]) + 14) + "px");
                $("#x24").html(data[17] + '%');
                $("#x26").css("width", 0.95 * data[10] + "px");
                $("#x27").html(data[10] + '%');
                $("#x27").css("left", ((0.95 * data[10]) + 14) + "px");
                $("#x28").html(data[19] + '%');
                $("#x30").css("width", 0.95 * data[9] + "px");
                $("#x31").html(data[9] + '%');
                $("#x31").css("left", ((0.95 * data[9]) + 14) + "px");
                $("#x32").html(data[18] + '%');
                $("#x34").css("width", 0.95 * data[11] + "px");
                $("#x35").html(data[11] + '%');
                $("#x35").css("left", ((0.95 * data[11]) + 14) + "px");
                $("#x36").html(data[20] + '%');
                DrawKML(zoom, data[22]);
                activeClick = 0;
            }
        });
        break;

    case 4://  DIVERSITY
        $.get(xURL, function (data) {
            if ((data !== '') && (activeClick)) {
                $('#data_box_4').dialog('open');
                data = data.split("~");
                $("#side_bar_4").css("visibility", "visible");
                $("#hd_4").html(data[0].toUpperCase());
                $("#d2").html('2010 Population: ' + Comma(data[1]));
                $("#d3").html(data[2] + '%');
                $("#d37").html('USA TODAY');
                $("#d38").html('Diversity Index 2010');
                $("#d39").html(data[21] + '%');
                DrawKML(zoom, data[22]);
                activeClick = 0;
            } 
        });
        break;
    case 5://  VACANCY RATE
        $.get(xURL, function (data) {
            if ((data !== '') && (activeClick)) {
                //Indiana~6483802~6.63~2795541~10.49~89.51
                data = data.split("~");
                $('#data_box_5').dialog('open');
                $("#side_bar_5").css("visibility", "visible");
                $("#hd_5").html(data[0].toUpperCase());
                $("#v2").html('2010 Population: ' + Comma(data[1]));
                $("#v3").html(data[2] + '%');
                $("#v4").html('Total housing units: ' + Comma(data[3]));
                $("#v6").html(data[5] + '%');
                $("#v8").html(data[4] + '%');
                $("#v10").css("width", 2.70 * data[4] + "px");
                activeClick = 0;
                DrawKML(zoom, data[6]);
            }
        });
        break;
    case 6://  largest minority
        $.get(xURL, function (data) {
            if ((data !== '') && (activeClick)) {
                $('#data_box_6').dialog('open');
                data = data.split("~");
                if ((data.length >= 11) && (data[9] > 0)) {
                    ximage = data[11].split('<img src="');
                    ximage = ximage[1].split('" alt=');
                    ximage = ximage[0];
                    $("#side_bar_6").css("visibility", "visible");
                    $("#hd_6").html(data[0].toUpperCase());
                    $("#p2").html('2010 Population: ' + Comma(data[1]));
                    $("#p5").html('');
                    $("#p5").css("background-image", "url('" + ximage + "')");
                    activeClick = 0;
                    DrawKML(zoom, data[12]);
                }
            }
        });
        break;
    default:
    }
}

function DrawKML(zoom, fip) {
    if (zoom >= 6) {
        if (xKML != 0) {
            xKML.setMap(null);
        }
        xURL = 'http://www2.indystar.com/images/graphics/hold/local/census/maptest/KML_export.php?z=' + zoom + '&fip=' + fip;
        log( xURL );
        xKML = new google.maps.KmlLayer(xURL, {
            preserveViewport: true,
            suppressInfoWindows: true,
            clickable: false
        });
        log( xKML );
        xKML.setMap(map);
    }
}

function getClickLocation(latlng) {
    activeClick = 1;
    info.html('');
    geocoder.geocode({
        'latLng': latlng
    }, function (result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (result[1]) {
                state = '';
                county = '';
                third = '';
                postal = '';
                statename = '';
                for (var component in result[1]['address_components']) {
                    for (var i in result[1]['address_components'][component]['types']) {
                        if (result[1]['address_components'][component]['types'][i] == "administrative_area_level_1") {
                            state = result[1]['address_components'][component]['short_name'];
                            statename = result[1]['address_components'][component]['long_name'];
                        }
                        if (result[1]['address_components'][component]['types'][i] == "administrative_area_level_2") {
                            county = result[1]['address_components'][component]['long_name'];
                        }
                        if (result[1]['address_components'][component]['types'][i] == "administrative_area_level_3") {
                            third = result[1]['address_components'][component]['long_name'];
                        }
                        if (result[1]['address_components'][component]['types'][i] == "postal_code") {
                            postal = result[1]['address_components'][component]['long_name'];
                        }
                    }
                }
                if ((activeClick) && (county != '')) {
                    log('getdata: ' + county);
                    getData(state, county, third, postal, statename, latlng);
                    $("#side_bar_" + datatype).css("visibility", "hidden");
                    if (xKML != 0) {
                        xKML.setMap(null);
                    }
                } else {
                    if (activeClick) {
                        info.html('Error: Google could not pinpoint last click location');
                    }
                }
            } else {
                log("No results found");
                info.html('');
            }
        } else {
            log("Geocoder failed due to: " + status);
            info.html('');
        }
    });
}

function xxFunction(theme) {
    log('xxFunction: ' + theme);
}

function addOverlay(theme) {
    //return new MCustomTileLayer( map, theme, maptype, datatype );
}

function ChangeDataType(xChoice) {
    datatype = xChoice;
}

function ChangeOpacity(xChoice) {
    opacity = xChoice;
}

function clickCat(xChoice) {
    if (category != xChoice) {
        category = xChoice;
        dataChose = 0; //this keeps clickDat working
    }
}

function clickDat(xChoice) {
    if (datatype != xChoice) {
        map.overlayMapTypes.setAt(0, null);
        $("#dt" + datatype).removeClass('xmaptypeactive');
        $("#dt" + datatype).addClass('xmaptype');
        datatype = xChoice;
        xActive = new google.maps.ImageMapType(cjMaps[0]);
        map.overlayMapTypes.setAt(0, xActive);
        $("#xChooseBox").hide();
        $("#dt" + datatype).addClass('xmaptypeactive');
        $("#dt" + datatype).removeClass('xmaptype');
        $("#data_box_1").dialog("close");
        $("#data_box_3").dialog("close");
        $("#data_box_4").dialog("close");
        $("#data_box_5").dialog("close");
        $("#data_box_6").dialog("close");
        $("#topper").focus();
        ChangeDataType(datatype);
        $("#xTitle").html(xHeadlines[datatype]);
        $("#xChatter").html(xZoomChatters[map.getZoom()]);
        log( "images/key_"+ datatype +".png" );
        $("#keybox").html('<img src="images/key_' + datatype + '.png" alt="" />');
    }
}

function InputAddress(xChoice) {
    var address = xChoice;
    if (xMarker != 0) {
        xMarker.setMap(null);
    }
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            if (map.getZoom() < 10) {
                map.setZoom(10);
            }
            xMarker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                animation: google.maps.Animation.DROP
            });
        } else {
            log("Geocode was not successful for the following reason: " + status);
        }
    });
}
//-------jquery UI
$(function () {
    $('#dialog_link').mouseover(function () {
        var options = {};
        $("#xChooseBox").show();
        return false;
    });
    //hover states on the static widgets
    $('#dialog_link, ul#icons li').hover(

    function () {
        $(this).addClass('ui-state-hover');
    }, function () {
        $(this).removeClass('ui-state-hover');
    });
    $('#helpbutton').hover(

    function () {
        $(this).addClass('ui-state-hover');
        $("#xHelpBox").show();
        $("#xHelpBox").css("width", $('#mapDiv').width() + 'px');
        $("#xHelpBox").css("height", $('#mapDiv').height() + 'px');
    }, function () {
        $(this).removeClass('ui-state-hover');
        $("#xHelpBox").hide();
    });
    $('#infobutton').hover(

    function () {
        $(this).addClass('ui-state-hover');
        $("#xInfoBox").css("visibility", "visible");
    }, function () {
        $(this).removeClass('ui-state-hover');
    });
    $('#xInfoBox').hover(

    function () {}, function () {
        $("#xInfoBox").css("visibility", "hidden");
    });
    height_arr = ['',120,'',270,100,135,200];
    for (i=1; i <= 6; i++){
        if (i != 2) {
                $('#data_box_'+i).dialog({
                    autoOpen: false,
                    width: 300,
                    height: height_arr[i],
                    position: [50, 260],
                    close: function () {
                        if (xKML != 0) {
                            xKML.setMap(null);
                        }
                    }
                });
        }
    }
});

function Comma(number) {
        //This function takes an integer and returns a string formatted with comma separators.
        //
    number = '' + number; // implicitly convert number to a string
    if (number.length > 3) { // if we have a 3 digit number or larger...
        var mod = number.length % 3; //grab the remainder of that number divided by 3
        var output = (mod > 0 ? (number.substring(0, mod)) : ''); //output = a substring consisting of the first [remainder of number/3] digits
        for (i = 0; i < Math.floor(number.length / 3); i++) { //for every 3rd digit:
            if ((mod == 0) && (i == 0)) output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            else
            output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
        }
        return (output);
    } else
    return number;
}

function log(msg) {
    if (window.console) {
        console.log(msg);
    } else if ($("#info_box")) {
            $("#info_box").html(msg);
    }
}
