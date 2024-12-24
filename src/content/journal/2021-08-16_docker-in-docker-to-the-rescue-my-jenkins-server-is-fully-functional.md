---
title: "Docker-in-Docker to the rescue: my Jenkins server is fully-functional"
slug: docker-in-docker-to-the-rescue-my-jenkins-server-is-fully-functional
tags:
published: 2021-08-16
---

I sat down to work on my Jenkins server this morning and started looking at what it would take to get some client certificates working. I immediately decided I wanted to be working on code instead of configuring certificates, so I copied my Docker-in-Docker settings from my [Jenkins/Docker repo](https://github.com/tylerlwsmith/Local-Jenkins-Blue-Ocean-and-Docker), made some small tweaks and called it a day. The pipeline pushed my code to production. I've been fiddling with Jenkins for a month, but now it's basically done. Docker-in-Docker is definnitely the way to go.

I tightened up some parts of SacMusic's codebase. Most notably, I have the front-end and back-end containers running as unprivileged users inside the containers. I also shut down the Django error pages, which I had left enabled. I need to go through the Django docs and actually learn how to deploy a Django app properly.

I read the 12-factor app site again today. Last time I read it a few years ago I didn't understand any of it. Now I understand most of it, and I was already working towards most of the steps already. After reading it though, I am starting to think that I should use `venv` in my Python containers. OS packages are implicit and could change out from under me. Using `venv` also means I could get auto-complete in VS Code without having to connect into the container.

## Next steps

I'm trying to wrap up just a few loose ends on SacMusic and Jenkins before I move on to other things.

- Get Jenkins to email me when builds succeed or fail
- Add the GitHub Authorization and email packages to my Jenkins Dockerfile
- Switch my nginx container to the unprivileged image from nginx
- Copy my Next.js static assets into the nginx container
- Make a better error page for Next.js
- Finish optimizing Django for production
- Add `venv` into the mix

After that, I'm going to call development done on SacMusic for a while. I want to prioritize containerizing this blog next.

Anyway, I didn't proof read any of this so it might now make a lot of sense. I'm pretty tired.
