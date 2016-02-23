#!/usr/bin/python
# -*- coding: utf-8 -*-

def get_all_list(lists):
    all_list = set()
    result = list()
    for item in lists:
        all_list = all_list | item.getlist()
    all_list.remove('')
    url_dict = []
    for item in all_list:
        url_dict.append(item)

    url_dict.sort()

    for key in url_dict:
		
        result.append('"%s":1,\n' % key )

    return result

def final_list():
    import lists
    list_result = get_all_list(lists.get_list_set())
    content = ''.join(list_result)
    content = '{\n' + content + '\n"yourdomainhere.com":1\n}'
    return content


