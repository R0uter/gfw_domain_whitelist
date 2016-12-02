# GFW White List 

This PAC file use white list, which contains website can directly access. If some domain are not included, it will access through proxy.

If you use this PAC file, you may need a proxy which not billing with flow. 

This white list come from [felixonmars dnsmasq-china-list](https://github.com/felixonmars/dnsmasq-china-list)

This project location : [https://github.com/R0uter/gfw_domain_whitelist](https://github.com/R0uter/gfw_domain_whitelist)

More infomation
-------
Please go to [WIKI](https://github.com/R0uter/gfw_whitelist/wiki)

## How to use 

Download the`whitelist.pac`, edit Server IP, and the type of proxy.Then change your browser's config, point to`whitelist.pac`.

	var proxy = new Array( "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;",
	Change the type of proxy,it also can be 'HTTPS'
    Make sure change both SOCKS5 and SOCKS


### Use script to generate the PAC file

Excute command `$python3 main.py`.

Then `whitelist.pac` will updated. 


### Load-Balance

You can change `okToLoadBalance` value to `true` to use the load balance feature, when you edit `whitelist.pac` you will found three proxy config in there. Only first config will become effective if you leave `okToLoadBalance` maintain `false`, but if you want to use load balance, you need edit all proxy row as well.

    "SOCKS5 127.0.0.1:1083; SOCKS 127.0.0.1:1083;",
    Different port or ip, and do not lose the comma!
    

As you see, `proxy` is an array, you can add most ten proxys to load balance! But three is good enough.

There is one more thing you should know, load balance is domain-based load balance, so it would not accelorate video or download something. Also notice: do not use this feature if your proxys not speed same.


PAC performance (100,000 repeat)
----------------
    Firefox  
    whitelist.pac 50ms 
    load balabce: whitelist.pac 40ms

    Chrome  
    whitelist.pac 70ms
    load balabce: whitelist.pac 68ms

    Safari  
    whitelist.pac 50ms  
    load balabce: whitelist.pac 44ms  

Base on 
------------
[breakwa11 gfw_whitelist](https://github.com/breakwa11/gfw_whitelist)  
[clowwindy gfwlist2pac](https://github.com/clowwindy/gfwlist2pac)  
[felixonmars dnsmasq-china-list](https://github.com/felixonmars/dnsmasq-china-list)

##MIT License (MIT)

The MIT License (MIT)

Copyright (c) 2016 R0uter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
