# Swift/S3 Typescript client

[![npm version](https://img.shields.io/npm/v/@nexys/swifts3-client.svg)](https://www.npmjs.com/package/@nexys/swifts3-client)
[![Build and Test Package](https://github.com/nexys-system/swifts3-client/actions/workflows/test.yml/badge.svg)](https://github.com/nexys-system/swifts3-client/actions/workflows/test.yml)
[![Publish](https://github.com/nexys-system/swifts3-client/actions/workflows/publish.yml/badge.svg)](https://github.com/nexys-system/swifts3-client/actions/workflows/publish.yml)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

Only tested with [Infomaniak Public cloud (OpenStack)](https://www.infomaniak.com/en/hosting/public-cloud)

## Migrate from a folder

See python code below

```
import os
import requests

directory = '.'
files = os.listdir(directory)

token = 'xxx'
swiftUrl = "https://s3.pub1.infomaniak.cloud/object/v1/AUTH_xxx"
containerName = "xxx"


for i, file_path in enumerate(files):
  url = swiftUrl + '/' + containerName + '/' + file_path
  headers =  { "X-Auth-Token": token,
              'Content-Type': 'text/plain',
             'Content-Length': str(os.path.getsize(file_path))
             }
  file = open(file_path, 'rb')
  file_data = file.read()
  #files = {'file': (file_path, file_data)}
  response = requests.put(url, headers=headers, data=file_data)
  print(file_path, os.path.basename(file_path), url, response)
```
