---
title: "Docker, Docker-in-Docker and disappointment"
slug: docker-docker-in-docker-and-disappointment
tags:
published: 2021-07-21
---

The past few days have been frustrating. I'm trying to get Jenkins set up in a container and I have no idea what I'm doing.

Over the weekend I completed coding the new version of SacMusic, which felt great. But rewriting the app in a new stack wasn't my main goal: I wanted to learn how to build production images in CI/CD pipelines and deploy them using Jenkins. I'm forcing myself to get this pipeline nonsense working before I move onto literally anything else. I'm feeling overwhelmed but trying to stay focused.

## Installing Jenkins

I've been following [the official Docker installation guide from the Jenkins website](https://www.jenkins.io/doc/book/installing/docker/) for the past couple of days. Docker is literally the first approach under "Installing Jenkins," so it seems like it's the recommended approach.

Unfortunately the Jenkins Docker installation guide leaves a lot to be desired. It walks you through the process of imperatively creating a network from the Docker CLI. You then imperatively create a Docker-in-Docker container by passing nearly a dozen arguments into the Docker CLI. Then you create a `Dockerfile` for a Jenkins container, and imperatively create a container through Docker's CLI, again passing in nearly a dozen arguments so Jenkins and Docker-in-Docker can talk through the network that you created in the first step.

This process seems nonsensical: Docker Compose is a declarative format specifically for orchestrating containers and networks. Why would the docs recommend setting all of this up imperatively? Why wouldn't they just have a `Dockerfile` and `docker-compose.yml` in an easy-to-clone GitHub repo?

I decided to convert this imperative CLI soup into a compose file. If nothing else, it was a learning experience. Here are some of the things I learned along the way:

- The ["official" Docker image for Jenkins](https://hub.docker.com/_/jenkins) is deprecated and hasn't been updated in more than two years 😩 You need to dig for the community-maintained [jenkins/jenkins image](https://hub.docker.com/r/jenkins/jenkins).
- [Docker-in-Docker is a thing](https://www.docker.com/blog/docker-can-now-run-within-docker/) and for some reason it is the recommended way of setting up Jenkins and Docker.
- Docker-in-Docker needs to run as privileged.
- Named networks exist in Docker, though I'm not entirely sure why. Maybe it's so there's no clashing incase you have multiple Docker Compose projects running?
- Volumes that don't start with `./` are named volumes, which are persistent but not available to the host.
- You can't easily share named volumes with the host machine in non-hacky ways (there are some [hacky](https://stackoverflow.com/a/40030535/7759523) [ways](https://github.com/moby/moby/issues/19990#issuecomment-248955005) [though](https://github.com/MatchbookLab/local-persist)).
- Network aliases exist, though if the Jenkins guide had just used Docker Compose they'd alias to the container name and be unnecessary.
- Using Docker-in-Docker with CIs like Jenkins is [a really bad idea](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

Wait, what? Using Docker-in-Docker with CIs is a bad idea? It's literally recommended in the Jenkins docs!

## Docker-in-Docker considered harmful

According to Docker engineer Jérôme Petazzoni's [blog post](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/), using Docker-in-Docker can cause issues with Linux security systems; lead to headaches with conflicting filesystems; and cause build cache misses. Petazzoni instead recommends connecting CI systems to the host Docker instance using a Unix socket, which avoid the issues that come from using Docker-in-Docker. To me, this also feels less janky, though I don't understand enough about these technologies to articulate why.

## Advantages of sockets

It hadn't occurred to me that I could use sockets across containers with Docker. A quick search on the subject showed me that [connecting Nginx to a container via socket instead of HTTP could improve performance by 40-45%](https://docs.docker.com/network/host/). The same article said that connecting via [host network mode](https://docs.docker.com/network/host/) would give me similar results, but this mode is only available on Linux hosts. [Another article](https://www.getpagespeed.com/server-setup/faster-web-server-stack-powered-by-unix-sockets-proxy) said that bypassing the network stack makes sockets faster, and it also suggested that sockets are more secure because they are subject to system file permissions while TCP is not. I'll likely start favoring sockets for Nginx on future Docker projects.

I'm essentially back at square one with standing up Jenkins in a container, but I learned a lot along the way. Hopefully it goes better tomorrow.
