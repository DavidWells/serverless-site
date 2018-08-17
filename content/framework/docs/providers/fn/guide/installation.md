---
title: 'Serverless Framework - Fn Guide - Installing The Serverless Framework and Fn'
menuText: Installation
menuOrder: 3
description: 'How to install the Serverless Framework and start using it with Fn'
layout: Doc
gitLink: /docs/providers/fn/guide/installation.md
---

# Fn - Installation

## Installing Fn

[Fn](https://github.com/fnproject/fn) can be run in its simplest form as a docker container:

```
docker run --name fnserver --rm -i -v $(pwd)/data:/app/data -v \
/var/run/docker.sock:/var/run/docker.sock --privileged -p 8080:8080 \
--entrypoint ./fnserver fnproject/fnserver
```

For more advanced and robust install options see: [Operating FN](https://github.com/fnproject/fn/blob/master/docs/index.md#for-operators)

## Installing the Serverless Framework

Next, install the Serverless Framework via [npm](https://npmjs.org) which was already installed when you installed Node.js.

Open up a terminal and type `npm install -g serverless` to install Serverless.

```bash
npm install -g serverless
```

Once the installation process is done you can verify that Serverless is installed successfully by running the following command in your terminal:

```bash
serverless
```

To see which version of serverless you have installed run:

```bash
serverless --version
```