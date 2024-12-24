---
title: "Days since I bricked a server: 0"
slug: days-since-i-bricked-a-server-0
tags: 
published: 2021-05-21
---

Today was going to be the day I launched this site.

I bought a new domain. I pointed the DNS to the server. I configured Nginx to accept traffic from the new domain. Then I ran `sudo apt update`, and I tried to install Certbot. I got an error I had never seen before:

```
Citing for cache lock: Could not get lock /var/lib/dpkg/lock-frontend. It is held by process 44114 (apt)... 3s
```

I didn't know what the error meant, so I ran `ps -aux | grep 44114` to see what process 44114 was.

```
root       44114  0.1  3.5  72716 35664 ?        S    May21   1:56 apt upgrade
```

I waited a minute, and then I tried to install Certbot again. I got the same error.

So, I nuked the process with the nifty command I just learned: `killall`. I like this command because you don't need a PID: you just need the name of the app and it'll yeet all of the running instances into the sun.

```
killall apt
```

I tried the install command again. I got a new error:

```
E: dpkg was interrupted, you must manually run 'sudo dpkg --configure -a' to correct the problem.
```

I figured that I had gotten my system into a weird state, but maybe a reboot would fix it.

**A reboot did not fix it**.

It turns out I nuked a software update and the system is irrecoverable.

And _that's_ why I'm not completing the site setup tonight.

Weirdly enough, I'm kind of excited about setting this all up again. I've been living in the console lately, and I'm eager to see how much I'm retaining.

Either way, with any luck this site will be up on a domain tomorrow. 