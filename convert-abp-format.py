from argparse import ArgumentParser

from main import reformat, get_online_list


ABP_ALLOW_FMT = '||{}\n'


def parse_args():
    parser = ArgumentParser()
    parser.add_argument(
        '-i',
        '--input',
        dest='input',
        default='accelerated-domains.china.conf',
        help='path to whitelist',
    )
    parser.add_argument(
        '-o',
        '--output',
        dest='output',
        default='whitelist.txt',
        help='path to output autoproxy rule file',
    )
    return parser.parse_args()

def main():
    args = parse_args()
    try:
        with open(args.input, 'r', encoding='utf8') as fp:
            result = reformat(fp, ABP_ALLOW_FMT)
    except IOError:
        print('Unable to open rule file, trying to get online list...')
        result = get_online_list(ABP_ALLOW_FMT)

    content = ''.join(result)
    with open(args.output, mode='w', encoding='utf8') as fp:
        fp.write(content)
    print('Done!')

if __name__ == '__main__':
    main()
