---
title: "Final hurdles with setting up my Jenkins server (hopefully)"
slug: final-hurdles-with-setting-up-my-jenkins-server-hopefully
tags:
published: 2021-08-15
---

Last night, I spun up a new Droplet, installed `docker` and `docker-compose`, then put a Compose file with Jenkins on the server and mounted my host's `docker.sock` file. I then copied the nginx config from the Jenkins docs, removing the static file bits because the whole thing was a in a container.

Everything was working, but then my server got stuck in a 301 redirect loop. I spent over an hour debugging the nginx config, but you think I'd know by now it was a Cloudflare issue. Their "Flexible Ecryption" option will be the death of me.

Docker also wasn't bringing Jenkins back up after server restarts, but in debugging that I discovered that putting `restart: always` under the service in the Compose file is actually what brings the service up after the server restarts. Neat.

## Locking down Jenkins, or at least trying

A CI server is critical infrastructure. It's remote code execution as a service. It's not a thing you want to leave vulnerable on the Internet.

I went to search for a two-factor authentication plugin and was surprised to see that there were absolutely none. PAM and LDAP are installed as Jenkins recommended plugins, but for someone like me, these feel like ancient hold-outs from the days of large on-premise enterprise IT teams.

I found a [GitHub Authentication](https://plugins.jenkins.io/github-oauth/) plugin. As I followed the docs to try to install it, I was overwhelmingly confused. I felt helpless. How could software be so hard to understand? Thankfully, [this YouTube video](https://www.youtube.com/watch?v=ExeYI10w3L8) set me on the right path. Seriously, I would have never figured this out by myself in a million years. Would you have?

As I searched for solutions, I was amused to see that the [Securing Jenkins page](https://www.jenkins.io/doc/book/security/securing-jenkins/) from the user handbook said, "In the default configuration of Jenkins 1.x, Jenkins does not perform any security checks." Sounds about right.

## The final hurdle (I think)

After setting everything up, I ran my pipeline, and on the deploy stage I got the following error:

```
TLS configuration is invalid - make sure your DOCKER_TLS_VERIFY and DOCKER_CERT_PATH are set correctly.
```

It turns out that I need some certificates. What kind? I'm not sure. How do I generate them? No idea. Docker-in-Docker was handling this for me. I took a look at its entrypoint source code and it was bewildering to me. I suck at Bash scripts, and all that I know about certificates is Certbot is a thing.

Despite being painfully unaware in this area, [this Stack Overflow answer](https://stackoverflow.com/a/54542073/7759523) pointed me in the direction of [Docker's docs for protecting the daemon socket](https://docs.docker.com/engine/security/protect-access/). This [Server Fault answer](https://serverfault.com/a/9717) was kind enough to explain some of the file extensions pertaining to certificates.

It's my hope that once I get this configured, the Jenkins server setup will be complete. But I don't know that for sure. I know certificates expire: is that something I'll need to worry about in the short term? Are there other things that I don't know I don't know that are standing in my way? Probably.

I'm willing to sink a couple of days into solving this certificate problem, but if I don't have it figured out by then I'm going to just install Docker-in-Docker on the server and call it done.

## Maybe don't use Jenkins

In 2021, greenfield projects probably shouldn't use Jenkins. It's technology of the early 2000s that's an embodiment of its time. Even Jenkins Blue Ocean–CloudBee's Hail Mary attempt at modernizing Jenkins–[is no longer a core priority of the Jenkins project](https://groups.google.com/g/jenkinsci-users/c/rOjXIB-pkQ8/m/V1FC4d5aCAAJ?pli=1). The ability for Jenkins to work with containers is sorely lacking. Jenkins doesn't have 2FA in 2021. Neither the UI nor any of the plugins give any visual cues to the user of what a page is for, how to configure the app, etc. It's a lot of headache with very little reward.

I'm using a $15/mo Droplet to power Jenkins, but GitLab's CI is only $20/mo for 10,000 build minutes. It's hard for me to imagine that I wouldn't save time and money by switching to GitLab CI or GitHub actions. But I'm already here. I _really_ want to get this working.

## The upside

I've learned a lot about Docker during this process that may have been abstracted away from me had I used GitHub actions, Travis or GitLab CI. Or maybe it wouldn't have been abstracted away. I'm not sure.

I'm looking for a silver lining, but it's hard to find one. My experience with Jenkins has been bad. And most of the bad wasn't Docker-related.

I guess the upside is that Jenkins is self-hostable on a Raspberry Pi, and by the end of this experience I'll know how to set that up. I've also wanted to learn more about self-signed certificates for Pi projects, and maybe this Docker stuff I'm dealing with is a good start.

Let's just hope I'm done setting up Jenkins soon so I can get back to building software.
