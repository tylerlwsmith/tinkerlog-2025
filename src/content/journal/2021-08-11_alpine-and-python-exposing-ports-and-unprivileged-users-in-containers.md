---
title: "Alpine and Python, EXPOSE-ing ports and unprivileged users in containers"
slug: alpine-and-python-exposing-ports-and-unprivileged-users-in-containers
tags:
published: 2021-08-11
---

I went to bed last night thinking I'd spend today working on installing Jenkins on a server. Instead, I took the day to dig deeper into optimizing my images and tightening up my `Dockerfile`s and `docker-compose.yml` files. Right now it's all still fresh in my head, and my hope is that if I spend some extra time to dig deeper I won't forget everything immediately.

## Alpine + Python = Headaches

One of the main recommendations I hear about building containers is use small distributions "like Alpine" as a base. Alpine is always the go-to example, and it bothered me that both my Node.js and nginx containers use Alpine while my Python container use a light version of Debian.

I looked up a tag for an Alpine-based Python image off of Docker Hub and then tried to run my `Dockerfile` as-is. No luck: Alpine doesn't use `apt-get`. I switched from `apt-get` to `apk` and tried again. No luck: `apk` has a different API. I looked up `apk`'s API and tried again. No luck: `libpq-dev` is actually called `postgresql-dev` on Alpine. I tried again. No luck: `psycopg2` failed to build because Alpine needs `musl` instead of `gcc`... or something.

This all seemed comically bad. I took to Google and found two articles by pythonspeed.com discussing the trouble with Alpine images for Python. One article said [Alpine builds could take 50 times as long as other distros](https://pythonspeed.com/articles/alpine-docker-python/) because standard PyPI wheels don't work on Alpine, meaning you need to compile all of the dependency code manually during the build process (though this _could_ get better with [PEP 656](https://www.python.org/dev/peps/pep-0656/)). In another article, [Python Speed recommends Ubuntu or a light Debian image as the base for the container](https://pythonspeed.com/articles/base-image-python-docker-images/). I guess I'm sticking with the Debian-based image I already have.

## EXPOSE-ing Docker ports

Today I confirmed what I thought but wasn't 100% sure of: `EXPOSE` in a `Dockerfile` makes the port available within the Docker network without making it available to the host. This is nice, because it also means that these ports aren't out there on the Internet if the container is running on a webserver. It would still be nice if Docker listened to firewall rules.

I removed the 'ports' for the front-end and back-end services on both my development and production Compose files, then added `EXPOSE` near the top of each `Dockerfile` with the relevant port.

## Unprivileged users

I tried using unprivileged `USER`s in the front-end and back-end containers, but everything was exploding from wonky permissions. I still need to figure out how to make this work. I'm keeping my container users as `root` until I can dig into this a bit deeper. Thankfully SacMusic is a non-critical project with no sensitive data.

## Cleaning up development stage

I reworked the development stage in my Dockerfiles so they wouldn't copy in the project files (except for `requirements.txt` in the Python container), opting to mount the host directories using the `docker-compose.yml` file. I also moved the run commands for the development stage from the `docker-compose.yml` file to the respective `Dockerfiles`s to keep everything cleaner. This also leads to extremely fast development builds because I'm not installing NPM packages or system packages in the development stage of my Dockerfiles.

The downside is it makes the initial application wonkier to set up from an initial `git pull`. I have the steps in my head now, but just barely. I wrote thorough documentation on how to do an initial setup of the application because I _will_ forget all of this. I thought about putting the setup steps in a script instead of the README, but I think it's important that I see the commands in front of me so I can reason about what they do.

## Next steps

My next steps are taking a few days away from coding. My carpal tunnel is flaring up today, which means I need to take a break. When I was 19 I got carpal tunnel so bad that it set me back on music for a year. I'm not doing that again. Fortunately, it's not an issue that comes up often, and it usually goes away quickly with rest. I've been hitting this project hard, and doing an abnormal amount of typing from rapid-fire try-and-fail things on my `Dockerfile`s, `Jenkinsfile`, and Compose files. Normal programming tends to be a little more methodical and less frantically-slamming-on-the-keyboard.

I've been wanting to dig into some of [the books I planned to read this year](/journal/my-2021-reading-list) (the list is more aspirational than realistic at this point), and this seems like a good excuse to dig in. Maybe I'll start with Mastering Ubuntu Server: it seems appropriate with the server-focused stuff I've been doing lately.
