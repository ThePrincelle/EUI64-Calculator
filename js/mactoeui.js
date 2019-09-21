// mactoeui.js
// Mac to EUI-64 converter
// Created by Maxime Princelle
//
// Usage : call mactoeui function with Mac address (xx-xx-xx-xx-xx-xx). 
//
// ---------


function hex2dec(val) //convert hex to decimal
{
    return parseInt("0x" + val);
}

function dec2hex(val) {
    var str = "";
    var minus = false;
    if (val < 0) {
        minus = true;
        val *= -1;
    }
    val = Math.floor(val);
    while (val > 0) {
        var v = val % 16;
        val /= 16;
        val = Math.floor(val);
        switch (v) {
            case 10:
                v = "A";
                break;
            case 11:
                v = "B";
                break;
            case 12:
                v = "C";
                break;
            case 13:
                v = "D";
                break;
            case 14:
                v = "E";
                break;
            case 15:
                v = "F";
                break;
        }
        str = v + str;
    }
    if (str == "") str = "0";
    if (minus) str = "-" + str;
    return str;
}

function gen_null_ip6() { // generate a null ipv6 array
    var ar = new Array;
    for (var i = 0; i < 8; i++) {
        ar[i] = 0;
    }
    return ar;
}

//convert ipv6 array to string
function ip6toString(ar) {
    //init
    var str = "";
    //find longest stretch of zeroes
    var zs = -1,
        zsf = -1;
    var zl = 0,
        zlf = 0;
    var md = 0;
    for (var i = 0; i < 8; i++) {
        if (md) {
            if (ar[i] == 0) zl++;
            else md = 0;
        } else {
            if (ar[i] == 0) {
                zs = i;
                zl = 1;
                md = 1;
            }
        }
        if (zl > 2 && zl > zlf) {
            zlf = zl;
            zsf = zs;
        }
    }
    //print
    for (var i = 0; i < 8; i++) {
        if (i == zsf) {
            str += ":";
            i += zlf - 1;
            if (i >= 7) str += ":";
            continue;
        }
        if (i) str += ":";
        str += dec2hex(ar[i]);
    }
    //   alert("printv6 str="+str+" zsf="+zsf+" zlf="+zlf);
    return str;
}

function mactoeui() {
    var addr = document.getElementById("mac").value
    var mac = addr.replace(/:/g,"-").split("-");

    if (mac.length != 6) {
        alert("Not a Mac address. \nFormat : xx-xx-xx-xx-xx-xx.");
        return;
    }

    var ip6 = gen_null_ip6();

    ip6[4] = hex2dec(mac[0])<<8 | hex2dec(mac[1]);
    ip6[4] ^= 0x200;
    ip6[5] = hex2dec(mac[2])<<8 | 0xff;
    ip6[6] = hex2dec(mac[3]) | 0xfe00;
    ip6[7] = hex2dec(mac[4])<<8 | hex2dec(mac[5]);
    
    console.log("Result (end of IP6) : " + ip6toString(ip6));
    document.getElementById("ip").value = ip6toString(ip6);

    var start_ip = document.getElementById("ip-start");

    if (start_ip.value.length) {
        var ip6strf = ip6toString(ip6);
        ip6strf = ip6strf.substring(1, ip6strf.length);
        
        document.getElementById("ip-full").value = start_ip.value + ip6strf;
        console.log("Result (full IP6) : " + start_ip.value + ip6strf);
    }

    return ip6toString(ip6)
}
