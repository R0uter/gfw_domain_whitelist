#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import re
import urllib3
import certifi

from argparse import ArgumentParser


PAC_RULE_FMT = '"{}":1,\n'


def parse_args():
    parser = ArgumentParser()
    parser.add_argument(
        '-i',
        '--input',
        dest='input',
        default=os.path.join('data', 'whitelist.pac'),
        help='path to gfwlist',
    )
    parser.add_argument(
        '-o',
        '--output',
        dest='output',
        default='whitelist.pac',
        help='path to output pac',
        metavar='PAC',
    )
    parser.add_argument(
        '-p',
        '--proxy',
        dest='proxy',
        default='"SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;"',
        help='the proxy parameter in the pac file, for example,\
        "SOCKS5 127.0.0.1:1080; SOCKS 127.0.0.1:1080;"',
        metavar='SOCKS5',
    )
    parser.add_argument(
        '-l',
        '--local-rules',
        dest='rules',
        help='use local rule file for whitelist rules, use dnsmasq .conf format, '
        'or one domain per line surrounded by "/".',
        metavar='RULE_FILE',
    )
    return parser.parse_args()


def writefile(input_file, proxy, output_file, rulesfile=None):

    domains_content = final_list(rulesfile)
    proxy_content = get_file_data(input_file)
    proxy_content = proxy_content.replace('__PROXY__', proxy)
    proxy_content = proxy_content.replace('__DOMAINS__', domains_content)

    with open(output_file, 'w') as file_obj:
        file_obj.write(proxy_content)


def reformat(f, fmt):
    whitelist = []
    for line in f:
        l = re.findall(r'(?<==/).+?(?=/)', line)
        if l:
            whitelist.append(fmt.format(l[0]))
    return whitelist


def reformat_from_file(filename, fmt):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return reformat(f, fmt)
    except IOError:
        print('Unable to open local rule file, exiting...')
        exit(1)


def get_online_list(fmt):
    print('Getting domain whitelist...')
    dnsmasq_china_list = 'https://raw.githubusercontent.com/felixonmars/dnsmasq-china-list/master/accelerated-domains.china.conf'
    try:
        content = getList(dnsmasq_china_list)
        content = content.decode('utf-8')
        with open('whitelistCache', 'w', encoding='utf-8') as f:
            f.write(content)
    except:
        print('Get list update failed,use cache to update instead.')

    whitelist = reformat_from_file('whitelistCache', fmt)

    return whitelist


def getList(listUrl):
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',  # Force certificate check.
        ca_certs=certifi.where(),  # Path to the Certifi bundle.
    )

    data = http.request('GET', listUrl, timeout=10).data
    return data


def final_list(rulesfile):
    if rulesfile is not None:
        list_result = reformat_from_file(rulesfile, PAC_RULE_FMT)
    else:
        list_result = get_online_list(PAC_RULE_FMT)
    content = '{\n' + ''.join(list_result) + '"yourdomainhere.com":1\n}'
    print('All done!')
    return content


def get_file_data(filename):
    content = ''
    with open(filename, 'r') as file_obj:
        content = file_obj.read()
    return content


def main():
    args = parse_args()
    writefile(
        args.input,
        '"' + args.proxy.strip('"') + '"',
        args.output,
        args.rules,
    )


if __name__ == '__main__':
    main()
