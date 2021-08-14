#!/usr/bin/python3
# mod : app config
# cre : lwx 20180508
# upd : lwx 20180508
# ver : 1.0

LWX = "Li Weixia"
PRODUCT_ID = "hris"
PRODUCT = "lisoft hris"
HEADER_X_A = "XA"

def config(cfgKey):
    _cfg = {
        ## SMTP settings
        'smtp_host': 'smtp.gmail.com',
        'smtp_port': 587,
        'sender_email': 'indo.kadinmms@gmail.com',
        'smtp_username': 'indo.kadinmms@gmail.com',
        'smtp_password': 'k@d1n2019',
        #91o-uZ2z~IDS
        # Application settings
        'token_expire_period': 14 * 86400,  # in seconds
        'upload_path': '/kadin/www/media/file',
        'base_url': 'http://pais.localhost:10500/',
        #'json': '/web/www/topkarirapi/json/',
        #'info_mail_addr': 'info@presencing.com',
        'copyight_year': '2020',
        }
    return _cfg[cfgKey]


def allowedClient():
    return ['127.0.0.1', 'mms.kadin.id']