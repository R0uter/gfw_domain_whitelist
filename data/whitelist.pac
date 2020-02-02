var okToLoadBalance = false;

var proxy = [
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

var subnetIp4RangeList = [
    0, 1,                    // 0.0.0.0/32
    167772160, 184549376,    // 10.0.0.0/8
    2886729728, 2887778304,  // 172.16.0.0/12
    3232235520, 3232301056,  // 192.168.0.0/16
    2130706432, 2130706688   // 127.0.0.0/24
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

function check_ipv6(host) {
    // http://home.deds.nl/~aeron/regex/
    var re_ipv6 = /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2})$/i;
    return re_ipv6.test(host)
}

function convertIp4Address(strIp) {
    var bytes = strIp.split('.');
    return (bytes[0] << 24) |
        (bytes[1] << 16) |
        (bytes[2] << 8) |
        (bytes[3]);
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

function isInSubnetIp4Range(ipRange, intIp) {
    for (var i = 0; i < 10; i += 2) {
        if (ipRange[i] <= intIp && intIp < ipRange[i + 1])
            return true;
    }
    return false;
}

function isInSubnetIp6Range(ipRange, intIp) {
    for (var i = 0; i < 10; i += 2) {
        if (ipRange[i] <= intIp && intIp < ipRange[i + 1])
            return true;
    }
    return false;
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
    // generate a int range from 0 to proxy.length - 1
    var random = Math.floor(Math.random() * proxy.length);
    return proxy[random];
}

function FindProxyForURL(url, host) {
    if (isPlainHostName(host)) {
        return direct;
    }

    if (check_ipv4(host)) {
        var intIp = convertIp4Address(host);

        if (isInSubnetIp4Range(subnetIp4RangeList, intIp)) {
            return direct;
        }
    } else if (check_ipv6(host)) {
        var intIp = convertIp6Address(host);

        if (isInSubnetIp4Range(subnetIp6RangeList, intIp)) {
            return direct;
        }
    } else {
        if (isInDomains(white_domains, host)) {
            return direct;
        }
    }

    if (okToLoadBalance) {
        return loadBalance();
    }
    return proxy[0];
}
