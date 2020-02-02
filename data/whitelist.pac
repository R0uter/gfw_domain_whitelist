// if false, use proxy[0] by default
var okToLoadBalance = false;

var proxy = [
    // add more proxies to load-balance!
    __PROXY__,
    "SOCKS5 127.0.0.1:1081; SOCKS 127.0.0.1:1081",
    "SOCKS5 127.0.0.1:1082; SOCKS 127.0.0.1:1082",
    "SOCKS5 127.0.0.1:1083; SOCKS 127.0.0.1:1083"
];

var direct = "DIRECT";

/*
 * Copyright (C) 2015 - 2017 R0uter
 * https://github.com/R0uter/gfw_domain_whitelist
 */

var white_domains = __DOMAINS__;

// ip list must in order for matching
var subnetIp4RangeList = [
  0, 1,                    // 0.0.0.0/32
  167772160, 184549376,    // 10.0.0.0/8
  2130706432, 2130706688,  // 127.0.0.0/24
  2886729728, 2887778304,  // 172.16.0.0/12
  3232235520, 3232301056   // 192.168.0.0/16
];

var subnetIp6RangeList = [
    0x0n, 0x1n,                  // ::/128
    0xfe800000000000000000000000000000n, 0xfe80000000000000ffffffffffffffffn,  // fe80::/64
    0xfec00000000000000000000000000000n, 0xfec000000000ffffffffffffffffffffn,  // fec0::/48
    0x1n, 0x2n   // ::1/128
];

var hasOwnProperty = Object.hasOwnProperty;

function check_ipv4(host) {
    var re_ipv4 = /^\d+\.\d+\.\d+\.\d+$/;
    return re_ipv4.test(host);
}

function convertIp4Address(strIp) {
    var bytes = strIp.split('.');
    var result = (bytes[0] << 24) |
        (bytes[1] << 16) |
        (bytes[2] << 8) |
        (bytes[3]);
    // javascript simulates the bit operation of 32-bit signed int
    // so 0x80000000 is a negative number, use ">>>" to fix it
    return result >>> 0;
}

function isInIp4RangeList(ipRange, intIp) {
    if (ipRange.length === 0)
        return false;
    var left = 0, right = ipRange.length - 1;
    do {
        var mid = Math.floor((left + right) / 2);
        if (mid & 0x1) {
            if (intIp >= ipRange[mid - 1]) {
                if (intIp < ipRange[mid]) {
                    return true
                } else {
                    left = mid + 1;
                }
            } else {
                right = mid - 2
            }
        } else {
            if (intIp >= ipRange[mid]) {
                if (intIp < ipRange[mid + 1]) {
                    return true;
                } else {
                    left = mid + 2;
                }
            } else {
                right = mid - 1;
            }
        }
    } while (left < right);
    return false;
}

function getProxyFromIp4(strIp) {
    var intIp = convertIp4Address(strIp);

    if (isInIp4RangeList(subnetIp4RangeList, intIp)) {
        return direct;
    }
    // in theory, we can add chnroutes test here.
    return loadBalance();
}

function check_ipv6(host) {
    // http://home.deds.nl/~aeron/regex/
    var re_ipv6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2})$/i;
    return re_ipv6.test(host)
}

function convertIp6Address(strIp) {
    var hexs = strIp.split(':');
    var pos = hexs.indexOf("");
    if (pos === 0) { // ::1
        pos = hexs.indexOf("", pos + 1);
    }
    var hexLen = hexs.length;
    var result = 0n;
    var scale = 112n, index = 0;
    do {
        if (pos === index) {
            scale -= 16n * BigInt(9 - hexs.length)
        } else {
            var hex = hexs[index];
            if (hex !== "" && hex !== "0") {
                result = result | (BigInt("0x" + hexs[index]) << scale);
            }
            scale -= 16n;
        }
        index++;
    } while (index < hexLen);
    return result;
}

function isInSubnetIp6Range(ipRange, intIp) {
    for (var i = 0; i < 10; i += 2) {
        if (ipRange[i] <= intIp && intIp < ipRange[i + 1])
            return true;
    }
    return false;
}

function getProxyFromIp6(strIp) {
    var intIp = convertIp6Address(strIp);

    if (isInSubnetIp6Range(subnetIp6RangeList, intIp)) {
        return direct;
    }

    return loadBalance();
}

function isInDomains(domain_dict, host) {
    var pos = host.lastIndexOf('.');
    var suffix = host.substring(pos + 1);

    if (suffix === "cn") {
        return true;
    }

    pos = host.lastIndexOf('.', pos - 1);

    while (true) {
        if (pos === -1) {
            return hasOwnProperty.call(domain_dict, host);
        }

        suffix = host.substring(pos + 1);
        if (hasOwnProperty.call(domain_dict, suffix)) {
            return true;
        }

        pos = host.lastIndexOf('.', pos - 1);
    }
}

function loadBalance() {
    if (okToLoadBalance) {
        var random = Math.floor(Math.random() * proxy.length);
        return proxy[random];
    }
    return proxy[0];
}

function FindProxyForURL(url, host) {
    if (isPlainHostName(host)) {
        return direct;
    }

    if (check_ipv4(host)) {
        return getProxyFromIp4(host);
    }

    if (check_ipv6(host)) {
        return getProxyFromIp6(host);
    }

    if (isInDomains(white_domains, host)) {
        return direct;
    }

    return loadBalance();
}
