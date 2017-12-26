/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/
 
function SHA256(s){
 
    var chrsz   = 8;
    var hexcase = 0;
 
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
 
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
 
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
 
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
 
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
 
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
 
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
 
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
 
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
 
            var c = string.charCodeAt(n);
 
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
 
        }
 
        return utftext;
    }
 
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
 
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
 
}
1
2
3
4
5
6
7
8
9
10
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
50
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127

/**
*
*  Secure Hash Algorithm (SHA256)
*  http://www.webtoolkit.info/
*
*  Original code by Angel Marin, Paul Johnston.
*
**/

 


function SHA256(s){

 


    var chrsz   = 8;


    var hexcase = 0;

 


    function safe_add (x, y) {


        var lsw = (x & 0xFFFF) + (y & 0xFFFF);


        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);


        return (msw << 16) | (lsw & 0xFFFF);


    }

 


    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }


    function R (X, n) { return ( X >>> n ); }


    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }


    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }


    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }


    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }


    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }


    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

 


    function core_sha256 (m, l) {


        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);


        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);


        var W = new Array(64);


        var a, b, c, d, e, f, g, h, i, j;


        var T1, T2;

 


        m[l >> 5] |= 0x80 << (24 - l % 32);


        m[((l + 64 >> 9) << 4) + 15] = l;

 


        for ( var i = 0; i<m.length; i+=16 ) {


            a = HASH[0];


            b = HASH[1];


            c = HASH[2];


            d = HASH[3];


            e = HASH[4];


            f = HASH[5];


            g = HASH[6];


            h = HASH[7];

 


            for ( var j = 0; j<64; j++) {


                if (j < 16) W[j] = m[j + i];


                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

 


                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);


                T2 = safe_add(Sigma0256(a), Maj(a, b, c));

 


                h = g;


                g = f;


                f = e;


                e = safe_add(d, T1);


                d = c;


                c = b;


                b = a;


                a = safe_add(T1, T2);


            }

 


            HASH[0] = safe_add(a, HASH[0]);


            HASH[1] = safe_add(b, HASH[1]);


            HASH[2] = safe_add(c, HASH[2]);


            HASH[3] = safe_add(d, HASH[3]);


            HASH[4] = safe_add(e, HASH[4]);


            HASH[5] = safe_add(f, HASH[5]);


            HASH[6] = safe_add(g, HASH[6]);


            HASH[7] = safe_add(h, HASH[7]);


        }


        return HASH;


    }

 


    function str2binb (str) {


        var bin = Array();


        var mask = (1 << chrsz) - 1;


        for(var i = 0; i < str.length * chrsz; i += chrsz) {


            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);


        }


        return bin;


    }

 


    function Utf8Encode(string) {


        string = string.replace(/\r\n/g,"\n");


        var utftext = "";

 


        for (var n = 0; n < string.length; n++) {

 


            var c = string.charCodeAt(n);

 


            if (c < 128) {


                utftext += String.fromCharCode(c);


            }


            else if((c > 127) && (c < 2048)) {


                utftext += String.fromCharCode((c >> 6) | 192);


                utftext += String.fromCharCode((c & 63) | 128);


            }


            else {


                utftext += String.fromCharCode((c >> 12) | 224);


                utftext += String.fromCharCode(((c >> 6) & 63) | 128);


                utftext += String.fromCharCode((c & 63) | 128);


            }

 


        }

 


        return utftext;


    }

 


    function binb2hex (binarray) {


        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";


        var str = "";


        for(var i = 0; i < binarray.length * 4; i++) {


            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +


            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);


        }


        return str;


    }

 


    s = Utf8Encode(s);


    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

 

}
    
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};




var user = false;
var SessionManager = function()
{
    this.init = function()
    {
        this.form = document.getElementById('pg-login');
        this.username;
        this.password;
        console.log('in the init;')
    }
    this.setCookie = function(user_id_value, username_value,avatar) 
    {
        var time = Math.floor(Date.now() / 1000);
        var expires = time + 3600; //(adding an hour) before expiration
        document.cookie = "user_id=" + user_id_value + ";" ;
        document.cookie = "username" + '=' + username_value + ";";
        document.cookie = 'avatar' + '=' + avatar + ";";
            // Default at 365 days.
        days = 365;
        var date = new Date();
        // Get unix milliseconds at current time plus number of days
        date.setTime(+ date + (days * 86400000)); //24 * 60 * 60 * 1000

        document.cookie = "expires=" + date.toGMTString();
        //document.cookie = "expires" + ''
    }  
    this.listen = function()
    {
        //
        $(this.form).submit(function(e){
            e.preventDefault();
            var username = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            var sha_password = SHA256(password);
            data = {"username":username, "password":sha_password};            
            $.ajax({
                url:"https://sharefuly.com/api/login",
                data:data,
                method:"POST",
                success:function(results)
                {
                    if (results && results != 'false')
                    {
                    var json_parse = JSON.parse(results);

                        if (!json_parse.user_id || json_parse.user_id === undefined)
                        {
                            if(confirm("Wrong login credentials"))
                            {
                                window.location = "index.html";
                            }                        
                        }
                        else
                        {
                            this.setCookie(json_parse.user_id, json_parse.username, json_parse.avatar);
                            window.location ='actions.html';
                        }
                    }
                    else
                    {
                        if(confirm("Wrong login credentials"))
                        {
                            window.location = "index.html";
                        }                        
                    }

                }.bind(this)

            });
        }.bind(this));
        console.log('in the listen');
    }.bind(this)
    this.init();
    this.listen();
}
var sm = new SessionManager();




