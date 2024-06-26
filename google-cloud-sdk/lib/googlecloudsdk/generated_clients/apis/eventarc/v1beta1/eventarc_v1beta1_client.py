"""Generated client library for eventarc version v1beta1."""
# NOTE: This file is autogenerated and should not be edited by hand.

from __future__ import absolute_import

from apitools.base.py import base_api
from googlecloudsdk.generated_clients.apis.eventarc.v1beta1 import eventarc_v1beta1_messages as messages


class EventarcV1beta1(base_api.BaseApiClient):
  """Generated client library for service eventarc version v1beta1."""

  MESSAGES_MODULE = messages
  BASE_URL = 'https://eventarc.googleapis.com/'
  MTLS_BASE_URL = 'https://eventarc.mtls.googleapis.com/'

  _PACKAGE = 'eventarc'
  _SCOPES = ['https://www.googleapis.com/auth/userinfo.email']
  _VERSION = 'v1beta1'
  _CLIENT_ID = 'CLIENT_ID'
  _CLIENT_SECRET = 'CLIENT_SECRET'
  _USER_AGENT = 'google-cloud-sdk'
  _CLIENT_CLASS_NAME = 'EventarcV1beta1'
  _URL_VERSION = 'v1beta1'
  _API_KEY = None

  def __init__(self, url='', credentials=None,
               get_credentials=True, http=None, model=None,
               log_request=False, log_response=False,
               credentials_args=None, default_global_params=None,
               additional_http_headers=None, response_encoding=None):
    """Create a new eventarc handle."""
    url = url or self.BASE_URL
    super(EventarcV1beta1, self).__init__(
        url, credentials=credentials,
        get_credentials=get_credentials, http=http, model=model,
        log_request=log_request, log_response=log_response,
        credentials_args=credentials_args,
        default_global_params=default_global_params,
        additional_http_headers=additional_http_headers,
        response_encoding=response_encoding)
