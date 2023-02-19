# GFW White List 
[![Build Status](https://travis-ci.org/R0uter/gfw_domain_whitelist.svg?branch=master)](https://travis-ci.org/R0uter/gfw_domain_whitelist)

This PAC file uses a white list, which contains websites that can be directly accessed. If some domains are not included, they will access through the proxy.

If you use this PAC file, you may need a proxy which not bill with the flow. 

This white list comes from [felixonmars dnsmasq-china-list](https://github.com/felixonmars/dnsmasq-china-list)

This project location : [https://github.com/R0uter/gfw_domain_whitelist](https://github.com/R0uter/gfw_domain_whitelist)

More information
-------
Please go to [WIKI](https://github.com/R0uter/gfw_whitelist/wiki)

## How to use

**Switch to the `gh-pages` branch to [download the latest pac file](https://R0uter.github.io/gfw_domain_whitelist/)!**

Download the [`whitelist.pac`](https://R0uter.github.io/gfw_domain_whitelist/), and edit the server IP and the proxy type. After that, change your browser's config, and point to `whitelist.pac`.

	var proxy = new Array( "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;",
	Change the type of proxy, it also can be 'HTTPS'
    Make sure to change both SOCKS5 and SOCKS


### Use script to generate the PAC file

Execute command `python3 main.py`, `whitelist.pac` will be updated. 


### Load-Balance

You can change the `okToLoadBalance` value to `true` to use the load balance feature. When you edit `whitelist.pac`, you will find three proxy configs in there. Only the first config will become effective if you leave `okToLoadBalance` maintain `false`, but if you want to use load balance, you need to edit all of the proxy row as well.

    "SOCKS5 127.0.0.1:1083; SOCKS 127.0.0.1:1083;",
    Different port or IP, and do not lose the comma!
    

As you see, `proxy` is an array. You can add at most ten proxies to load balance! Though three is good enough.

There is one more thing you should know that load-balancing is domain-based load balance, so it would not accelerate video or download something. Do not use this feature if your proxies are not speed the same.


PAC performance (100,000 repeats)
----------------
    Firefox  
    whitelist.pac 50ms 
    load balance: whitelist.pac 40ms

    Chrome  
    whitelist.pac 70ms
    load balance: whitelist.pac 68ms

    Safari  
    whitelist.pac 50ms  
    load balance: whitelist.pac 44ms  

Based on 
------------
[breakwa11 gfw_whitelist](https://github.com/breakwa11/gfw_whitelist)  
[clowwindy gfwlist2pac](https://github.com/clowwindy/gfwlist2pac)  
[felixonmars dnsmasq-china-list](https://github.com/felixonmars/dnsmasq-china-list)

## MIT License (MIT)

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
