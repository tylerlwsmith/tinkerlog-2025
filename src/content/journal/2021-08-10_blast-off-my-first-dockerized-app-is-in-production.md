---
title: "Blast off: my first Dockerized app is in production"
slug: blast-off-my-first-dockerized-app-is-in-production
tags:
published: 2021-08-10
---

It finally happened. One pipeline. Seven stages. Four containers. One production server. The site is live at [sacmusic.com](https://sacmusic.com)

## Problems with ARGs

My main goal today was optimizing my containers for production. I managed to cut the size of my Node container in half using a multi-stage build.

I wanted to fix the [jankiness I created with Django's static assets yesterday](trials-and-tribulations-of-sharing-djangos-static-files-with-an-nginx-container) at the build step. I started by splitting my one build command into two commands in my Jenkinsfile, with the first command building the front-end and back-end, and the second building the webserver. I used the back-end image as a stage in the webserver build and tried to grab the files from there.

I tried the following in my `Dockerfile`, but Docker threw a fit:

```Dockerfile
FROM backend:${BUILD_TAG} as backend_assets
```

Docker returned the following error:

```
invalid reference format
```

I had passed the `BUILD_TAG` in as an environment variable, and my syntax looked like the documentation.

It turns out that Dockerfiles don't give a damn about your environment variables. For build time variables, you must declare them with the `ARG` keyword within the `Dockerfile`. Additionally, you must pass them in with the `--build-args` flag in the CLI.

The build command ended up looking like the following:

```sh
docker-compose --build-arg BUILD_TAG=$BUILD_TAG build webserver
```

And here is what went in the `Dockerfile`:

```Dockerfile
ARG BUILD_TAG

FROM tylerlwsmith/sacmusic-backend:${BUILD_TAG} AS backend
```

With this, I was able to use a multistage build to get the static assets from the back-end image into the webserver image. I fixed some pipeline issues, switched the DNS, installed an SSL certificate with certbot and the site was launched 🚀

## Google broke

I ran into a strange bug after launch: my Google maps would load if it were a fresh page, but wouldn't load if I navigated to a page with a map on it. I knew there was something going wrong on the client.

I spent over an hour tracking it down, but it was those pesky ARGs again. Environment variables aren't available at build time, so I had to explicitly pass those in as ARGs then bind them to environment variables in the Dockerfile.

## Next steps

Like any time I finish a project, it feels anticlimactic. Maybe I need other hobbies.

I think my next step should be getting Jenkins off of my local machine and on to a server. I have a strong desire to learn Ansible and Terraform to automate the provisioning and configuration for the site, but I think I'm going to hold off on that.

After I get Jenkins on a server, I'm going to shove this blog into containers then add full text search. Finding things on this blog is painful, and having easier integrations with Elasticsearch, MeiliSearch and Selenium was a huge part of what pushed me to learn Docker in the first place.

I also need to update SacMusic's content. Soon.
