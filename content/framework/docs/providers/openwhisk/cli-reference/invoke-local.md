---
title: 'Serverless Framework Commands - Apache OpenWhisk - Invoke Local'
menuText: 'invoke local'
menuOrder: 7
description: 'Emulate an invocation of your Apache OpenWhisk function locally using the Serverless Framework'
layout: Doc
gitLink: /docs/providers/openwhisk/cli-reference/invoke-local.md
---

# OpenWhisk - Invoke Local

This runs your code locally by emulating the Apache OpenWhisk environment. Please keep in mind, it's not a 100% perfect emulation, there may be some differences, but it works for the vast majority of users.

```bash
serverless invoke local --function functionName
```

__*Please note that only the JavaScript and Python runtimes are supported with this command.*__

## Options

- `--function` or `-f` The name of the function in your service that you want to invoke locally. **Required**.
- `--path` or `-p` The path to a json file holding input data to be passed to the invoked function. This path is relative to the root directory of the service. The json file should have event and context properties to hold your mocked event and context data.
- `--data` or `-d` String data to be passed as an event to your function. Keep in mind that if you pass both `--path` and `--data`, the data included in the `--path` file will overwrite the data you passed with the `--data` flag.

## Examples

### Local function invocation

```bash
serverless invoke local --function functionName
```

This example will locally invoke your function.

### Local function invocation with data

```bash
serverless invoke --function functionName --data "hello world"
```

```bash
serverless invoke --function functionName --data '{"a":"bar"}'
```

### Local function invocation with data from standard input

```bash
node dataGenerator.js | serverless invoke local --function functionName
```

### Local function invocation with data passing

```bash
serverless invoke local --function functionName --path lib/data.json
```

This example will pass the json data in the `lib/data.json` file (relative to the root of the service) while invoking the specified/deployed function.

### Limitations

Currently, `invoke local` only supports the NodeJs and Python runtimes.
