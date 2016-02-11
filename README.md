# GFW White List 

[autoproxy.pac](https://autoproxy.org) (GFW List) is a black list that contains blocked Internet domain, in order to use that, you need to update the gfwlist frequently, if you not to do so, maybe you could not access some website which GFWed recently.

Now more and more website be GFWed, you need to update gfwlist every couple of hours to keep gfwlist effective. Now it's time to use White-list instead.

This PAC file use white list, which contains website can directly access. If some domain are not included, it will access through proxy.

If you use this PAC file, you may need a proxy which not billing with flow. 

>I will write a spider that automaticly update the white list, and as you see, it is not implement yet.

## How to use 

Download the`whitelist.pac`, edit Server IP, and the type of proxy.Then change your browser's config, point to`whitelist.pac`.

	var wall_proxy = new Array( "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;",
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
    

As you see, `wall_proxy` is a array, you can add most ten proxy to load balance! But three is good enough.

There is one more thing you should know, load balance is domain-based load balance, so it would not accelorate video or download something. Also notice: do not use this feature if your proxys not speed same.


PAC's performance (100,000 repeat)
----------------
    firefox  
    whitelist.pac 80ms 
    load balabce: whitelist.pac 94ms

    chrome  
    whitelist.pac 136ms
    load balabce: whitelist.pac 196ms

    safari  
    whitelist.pac 119ms  
    load balabce: whitelist.pac 120ms  

Base on 
------------
[breakwa11 gfw_whitelist](https://github.com/breakwa11/gfw_whitelist)  
[n0wa11 gfw_whitelist](https://github.com/n0wa11/gfw_whitelist)  
[clowwindy gfwlist2pac](https://github.com/clowwindy/gfwlist2pac)  
[Leask Flora_Pac](https://github.com/Leask/Flora_Pac)
