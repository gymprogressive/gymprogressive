    
  function log(msg, color, bgc) {
    let size = '14px';
    color = color || 'black';
    bgc = bgc || 'white';
    
    // Темы
    switch (color) {
        case "success":  color = "Green";           bgc = "LimeGreen";       break;
        case "info":     color = "DarkSlateGray";   bgc = "LightCyan";       break;
        case "error":    color = "DarkRed";             bgc = "Coral";           break;
        case "start":    color = "OliveDrab";       bgc = "PaleGreen";       break;
        case "warning":  color = "Tomato";          bgc = "PapayaWhip";           break;
        case "end":      color = "Orchid";          bgc = "MediumVioletRed"; break;
        default: color = color;
    }

    if (typeof msg == "object") {
        console.log(msg);
    } else if (typeof color == "object") {
        //console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
      
        console.log("%c" + msg, "font-size: " + size + "; color: PowderBlue;font-weight:normal; background-color: RoyalBlue;");
        console.log(color);
    } else {
        //console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
        console.log("%c" + msg, "font-size: " + size + "; color:" + color + ";font-weight:normal; background-color: " + bgc + ";");
    }
  }
  /*
  log("hey"); // Will be black
  log("Hows life?", "green"); // Will be green
  log("I did it", "success"); // Styled so as to show how great of a success it was!
  log("FAIL!!", "error"); // Red on black!
  var someObject = {prop1: "a", prop2: "b", prop3: "c"};
  log(someObject); // prints out object
  log("someObject", someObject); // prints out "someObect" in blue followed by the someObject
  */
/*
https://proglib.io/p/prodvinutye-sovety-i-hitrosti-console-log-2021-06-29?ysclid=l9l48l9s9t918989793
*/
const colors = {
  'vga':[
    {'name':'white'},
    {'name':'silver'},
    {'name':'gray'},
    {'name':'black'},
    {'name':'red'},
    {'name':'maroon'},
    {'name':'yellow'},
    {'name':'olive'},
    {'name':'lime'},
    {'name':'green'},
    {'name':'aqua'},
    {'name':'teal'},
    {'name':'blue'},
    {'name':'navy'},
    {'name':'fuchsia'},
    {'name':'purple'}
  ],
  'pink':[]
};
/*
https://en.wikipedia.org/wiki/Web_colors
VGA colors
----------
White
Silver
Gray
Black
Red
Maroon
Yellow
Olive
Lime
Green
Aqua
Teal
Blue
Navy
Fuchsia
Purple

Pink colors
-----------
MediumVioletRed
DeepPink
PaleVioletRed
HotPink
LightPink
Pink

Red colors
----------
DarkRed
Red
Firebrick
Crimson
IndianRed
LightCoral
Salmon
DarkSalmon
LightSalmon

Orange colors
-------------
OrangeRed
Tomato
DarkOrange
Coral
Orange

Yellow colors
-------------
DarkKhaki
Gold
Khaki
PeachPuff
Yellow
PaleGoldenrod
Moccasin
PapayaWhip
LightGoldenrodYellow
LemonChiffon
LightYellow

Brown colors
------------
Maroon
Brown
SaddleBrown
Sienna
Chocolate
DarkGoldenrod
Peru
RosyBrown
Goldenrod
SandyBrown
Tan
Burlywood
Wheat
NavajoWhite
Bisque
BlanchedAlmond
Cornsilk

Green colors
------------
DarkGreen
Green
DarkOliveGreen
ForestGreen
SeaGreen
Olive
OliveDrab
MediumSealGreen
LimeGreen
Lime
SpringGreen
MediumSpringGreen
DarkSeaGreen
MediumAquamarine
YellowGreen
LawnGreen
Chartreuse
LightGreen
GreenYellow
PaleGreen

White colors
------------
MistyRose
AntiqueWhite
Linen
Beige
WhiteSmoke
LavenderBlush
OldLace
AliceBlue
Seashell
GhostWhite
Honeydew
FloralWhite
Azure
MintCream
Snow
Ivory
White

Gray and black colors
---------------------
Black
DarkSlateGray
DimGray
SlateGray
Gray
LightSlateGray
DarkGray
Silver
LightGray
Gainsboro

Purple, violet and magenta colors
---------------------------------
Indigo
Purple
DarkMagenta
DarkViolet
DarkSlateBlue
BlueViolet
DarkOrchid
Fuchsia
Magenta
SlateBlue
MediumSlateBlue
MediumOrchid
MediumPurple
Orchid
Violet
Plum
Thistle
Lavender

Blue colors
-----------
MidnightBlue
Navy
DarkBlue
MediumBlue
Blue
RoyalBlue
SteelBlue
DodgerBlue
DeepSkyBlue
CornflowerBlue
SkyBlue
LightSkyBlue
LightSteelBlue
LightBlue
PowderBlue

Cyan colors
-----------
Teal
DarkCyan
LightSeaGreen
CadetBlue
DarkTurquoise
MediumTurquoise
Turquoise
Aqua
Cyan
Aquamarine
PaleTurquoise
LightCyan
*/
