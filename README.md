# GFW White List 

This PAC file use white list, which contains website can directly access. If some domain are not included, it will access through proxy.

If you use this PAC file, you may need a proxy which not billing with flow. 

>I will write a spider that automaticly update the white list, and as you see, it is not implement yet.

For more infomation
-------
Please go to [wiki](https://github.com/R0uter/gfw_whitelist/wiki)

## How to use 

Download the`whitelist.pac`, edit Server IP, and the type of proxy.Then change your browser's config, point to`whitelist.pac`.

	var proxy = new Array( "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;",
	Change the type of proxy,it also can be 'HTTPS'
    Make sure change both SOCKS5 and SOCKS


### Use script to generate the PAC file

Excute command `$python main.py`.

Then `whitelist.pac` will updated, before you do so, you can simply add other white domain in `lists/custom.py`. 

>I highly recommend you issues or pull requset your `custom.py` to me!


### Load-Balance

You can change `okToLoadBalance` value to `true` to use the load balance feature, when you edit `whitelist.pac` you will found three proxy config in there. Only first config will become effective if you leave `okToLoadBalance` maintain `false`, but if you want to use load balance, you need edit all proxy row as well.

    "SOCKS5 127.0.0.1:1083; SOCKS 127.0.0.1:1083;",
    Different port or ip, and do not lose the comma!
    

As you see, `proxy` is an array, you can add most ten proxy to load balance! But three is good enough.

There is one more thing you should know, load balance is domain-based load balance, so it would not accelorate video or download something. Also notice: do not use this feature if your proxys not speed same.


PAC's performance (100,000 repeat)
----------------
    firefox  
    whitelist.pac 80ms 
    load balabce: whitelist.pac 90ms

    chrome  
    whitelist.pac 120ms
    load balabce: whitelist.pac 170ms

    safari  
    whitelist.pac 80ms  
    load balabce: whitelist.pac 84ms  

Base on 
------------
[breakwa11 gfw_whitelist](https://github.com/breakwa11/gfw_whitelist)  
[n0wa11 gfw_whitelist](https://github.com/n0wa11/gfw_whitelist)  
[clowwindy gfwlist2pac](https://github.com/clowwindy/gfwlist2pac)  
[Leask Flora_Pac](https://github.com/Leask/Flora_Pac)

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
