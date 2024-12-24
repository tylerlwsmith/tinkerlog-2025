---
title: "The final yard: The final yard: Docker, firewalls and SSH keys"
slug: the-final-yard-docker-firewalls-and-ssh-keys
tags:
published: 2021-08-06
---

Today was gonna be the day I got my project on the Internet. My pipeline was building images and deploying them to my registry. I just needed to get the server set up and add the deploy step.

Except then it all went wrong.

## Docker's gaping security hole

I was starting to think about how to set up the server today, and I realized I hadn't really worried about setting up a firewall with Docker before. `ufw` is a pretty powerful tool though, so I figured it would probably be simple.

It's not.

The first article I stumbled into was [5 Fatal Docker Gotcha's for new users](https://uilicious.com/blog/5-fatal-docker-gotchas-for-new-users/) on UI-licious's blog. I figured that in addition to containing time-honored advice like "use volumes lol," it may have a note about how users forget to set up firewalls when using Docker. Nope.

It turns out Docker just **completely ignores the system firewall rules** and exposes its ports to the public Internet for [reasons](https://docs.docker.com/network/iptables/). The docs mention you can [add iptables policies before Docker's rules](https://docs.docker.com/network/iptables/#add-iptables-policies-before-dockers-rules), but I was kind of hoping to live my whole life without ever having to interact with `iptables`. I'm not a network engineer. [John Carr wrote a blog post](https://unrouted.io/2017/08/15/docker-firewall/) on how to configure Docker with a `iptables` and I got dizzy just looking at it. This wasn't going to work.

A Stack Overflow [answer](https://stackoverflow.com/a/61567700/7759523) ended up saving me with a suggestion that the UI-licious post originally recommended: use a free DigitalOcean network firewall. I didn't know the pros-and-cons of a network firewall vs a host firewall: I didn't even know that network firewalls existed before today.

As I tried to find if there were any major drawbacks to network firewalls, I found [an answer on the DigitalOcean community forums](https://www.digitalocean.com/community/questions/do-network-firewall-vs-ufw?answer=53622) about how network firewalls could actually help mitigate a DDoS attack because disallowed packets would never make it to the origin server. This sold me on using a network firewall, and I decided to go with DigitalOcean to host my project. Sorry Linode.

## Jenkins, Docker and SSH

I spun up my server, created a non-root user, added the user to the `docker` group, and installed Docker. Now it was the moment of truth: I was going to edit my pipeline to run the `docker compose up -d` command on the remote server by setting `DOCKER_HOST=ssh://mydomain.com`. Then something occured to me: how will Docker know where to look for the SSH key?

In an ideal world, I could store the public/private key somewhere in the Jenkins UI and pass it into the Docker command. But I can't do that. The next best thing would be to store it somewhere in the Jenkins Home folder where I already have a Docker volume set up. I can't do that either: Docker just uses the standard system SSH key. Darn.

The fact I have all of this containerized with no build agents is messy. If I had an ephemeral Dockerized build agent, I guess I could store the public and private keys as secrets in Jenkins then pass them to the appropriate location at build time. Though it upsets me that I'd need to store the public key as a secret. Why does Jenkins seemingly not have a way to set declarative pipeline environment variables from the UI? Some of these aren't secrets, but they aren't something I want to commit to version control either.

## Next steps

Tomorrow I'll do whatever hackery I need to in order to connect my local containerized Jenkins instance to my production server. I'll probably just mount my host's `.ssh/` folder into the container and call it a day.

As much as I'm not enjoying Jenkins, I feel like it's taught me a ton about containers, CI and CD. But I feel like the grass is greener with GitLab CI and GitHub actions. It's hard for me to imagine that Jenkins will be my go-to tool for CI/CD long term.

## DNS on Cloudflare

It didn't fit cleanly anywhere else in this post so I'll put it here: I migrated my project's DNS to Cloudflare. Listening to nearly every guest on the [Running in Production Podcast](https://runninginproduction.com/) talk about how they use Cloudflare in front of their apps made me think I should do that too. I've used Cloudflare plenty of times before, but a lot of times I just don't expend the effort to set it up.

Cloudflare automatically sucks the records out of GoDaddy, and GoDaddy had an unbelievable amount of cPanel trash in its records that I needed to remove. I think those records came preconfigured when I bought the domain, though I'm not 100% sure because I bought it from a shady "buy this domain" landing page.

Should I be looking at using a different registrar?
