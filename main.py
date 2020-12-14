#!/usr/bin/python
# -*- coding: utf-8 -*-
import os
import re
import urllib3
import certifi
import codecs

from argparse import ArgumentParser


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


def get_local_list(filename):
    whitelist = []
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                l = re.findall(r'(?<==/).+?(?=/)', line)
                if l:
                    whitelist.append('"{}":1,'.format(l[0]))
    except IOError:
        print('Unable to open local rule file, exiting...')
        exit(1)
    return whitelist


def get_online_list():
    print('Getting domain whitelist...')
    dnsmasq_china_list = 'https://raw.githubusercontent.com/felixonmars/dnsmasq-china-list/master/accelerated-domains.china.conf'
    whitelist = []
    try:
        content = getList(dnsmasq_china_list)
        content = content.decode('utf-8')
        f = codecs.open('whitelistCache', 'w', 'utf-8')
        f.write(content)
        f.close()
    except:
        print('Get list update failed,use cache to update instead.')

    try:
        f = codecs.open('whitelistCache', 'r', 'utf-8')
    except IOError:
        print('Unable to get domain whitelist, exiting...')
        exit(1)

    for line in f:
        l = re.findall(r'(?<==/).+?(?=/)', line)
        whitelist.append('"' + l[0] + '":1,')
    f.close()

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
        list_result = get_local_list(rulesfile)
    else:
        list_result = get_online_list()
    content = '\n'.join(list_result)
    content = '{\n' + content + '\n"yourdomainhere.com":1\n}'
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
