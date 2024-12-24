---
title: "Python, venv and Docker are not friends"
slug: python-venv-and-docker-are-not-friends
tags:
published: 2021-08-21
---

I got a slow start today, but it was still productive. I'm still tightening up SacMusic. It wasn't my plan for the day, but it was something to do. I want to get my containers/pipeline/deployment in excellent shape so I can use this as a blueprint for future projects. Very few of the changes I've been making are user-facing, but cumulatively I think they're adding up.

1. I decided to set my working directory as `/srv/app` on the front-end and back-end apps. I haven't seen established best practices about where to store apps in a container, but this feels like the most reasonable place to put it based on the [Linux Filesystem Hierarchy](https://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/srv.html). I've skipped adding a protocol subdirectory because each container should only run one service.
1. I swapped out my nginx container for the official unprivileged nginx container. This was almost painless; I just had to update ports in my nginx config file and compose files.
1. I set Django's cookies to be secure.
1. I swapped `psycopg2` for `psycopg2-binary` and removed `gcc`. This shrunk my container from about 120mb to about 85mb. Nice!
1. I set `SECURE_SSL_REDIRECT` to `True` in production. Apparently this feature doesn't expect to be behind a reverse proxy, so the app got stuck in an endless redirect loop. On the bright side, I learned that Uptime Robot works 🤷‍♂️
1. I set a secret key in Django. It's annoying that `manage.py` doesn't have a built in way to generate these.
1. I tried installing `venv` in my Python container. Yes, I know that containers already provide isolation, but [The Twelve-Factor App chapter on dependencies](https://12factor.net/dependencies) got me thinking about vendoring–especially since I'm on Debian and not Alpine. I got it working using [a guide from Bobcares](https://bobcares.com/blog/activate-python-virtualenv-in-dockerfile/), but it added 20mb to the container size, made `docker exec` commands break, and it didn't give me the editor autocomplete that I had hoped for, since the attached binary symlinked to the non-mounted Linux binary. For autocomplete, my best option would be to install `venv` on my host file system, but never actually execute the app with it.

What keeps surprising me as I make these changes is how fast the feedback cycle is going. I used to hoard changes locally because pushing to production was a chore. Now, each incremental change gets a commit. I push code at least once every couple of hours, often more frequently. Within minutes of the code push, I get an email notifying me of the build status. If the build passes, I can visit the site and verify that the changes indeed work in production. It the changes don't work as expected, I can quickly identify the problem and fix it while the code is still fresh in my head. I never want to work any other way again.

I'm still planning to build out provisioning, configuration management, automated database backups, error monitoring, logging and more testing. The site is essentially feature-complete, which gives me the opportunity to dig deep into these other areas.
