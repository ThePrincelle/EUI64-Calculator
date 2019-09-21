// mactoeui.js
// Mac to EUI-64 converter
// Created by Maxime Princelle
//
// Usage : call mactoeui function with Mac address (xx-xx-xx-xx-xx-xx). 
//
// ---------

function hex2dec(val) { // convert hex to decimal
    return parseInt("0x"+val);
}

function dec2hex(val) { // convert decimal to hex
    var str="";
    var minus = false;
    
    if (val < 0) {
        minus = true; val *= -1;
    }

    val = Math.floor(val);
    
    while (val > 0) {
        var v = val % 16;
        
        val /= 16; val = Math.floor(val);
        
        switch(v){
            case 10: v="A";break;
            case 11: v="B";break;
            case 12: v="C";break;
            case 13: v="D";break;
            case 14: v="E";break;
            case 15: v="F";break;
        }

        str = v + str;
    }
    if (str == "") {
        str = "0";
    }

    if (minus) {
        str = "-" + str;
    }

    return str;
}

function gen_null_ip6() { // generate a null ipv6 array
    var ar = new Array;
    for (var i = 0; i < 8; i++) {
        ar[i] = 0;
    }
    return ar;
}

function ip6toString(ar) { // convert ipv6 array to string
    // Init
    var str = "";
        
    // find longest stretch of zeroes
    var zs = -1, zsf = -1;
    var zl = 0, zlf = 0;
    var md = 0;
    
    for(var i=0;i<8;i++){
        if(md){
            if (ar[i] == 0) {
                zl++;
            }
            else {
                md = 0;
            }
        } else {
            if (ar[i] == 0) {
                zs = i; zl = 1; md = 1;
            }
        }
        if (zl > 2 && zl > zlf) {
            zlf = zl; zsf = zs;
        }
    }

    // Print
    for(var i=0;i<8;i++){
        if (i == zsf) {
            str += ":";
            i += zlf - 1;
            if (i >= 7) {
                str += ":";
            }
            continue;
        }

        if (i) {
            str += ":";
        }

        str += dec2hex(ar[i]);
    }

    return str;
}

function mactoeui(addr) {
    var mac = addr.replace(/:/g, "-").split("-");

    if (mac.length != 6) {
        alert("Not a Mac address. \nCall mactoeui function with Mac address (xx-xx-xx-xx-xx-xx).");
        return;
    }

    var ip6 = gen_null_ip6();

    ip6[4] = hex2dec()
    ip6[4] ^= 0x200;
    ip6[5] = hex2dec(mac[2])<<8 | 0xff;
    ip6[6] = hex2dec(mac[3]) | 0xfe00;
    ip6[7] = hex2dec(mac[4])<<8 | hex2dec(mac[5]);
    
    echo("Result (end of IP6) : " + ip6toString(ip6));
    return ip6toString(ip6)
}
