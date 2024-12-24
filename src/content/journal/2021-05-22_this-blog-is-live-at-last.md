---
title: "This blog is live at last!"
slug: this-blog-is-live-at-last
tags:
published: 2021-05-22
---

I did it. I may have bricked a server last night, but this morning I set up a new Droplet and got everything up-and-running. This is [tinkerlog.dev](https://tinkerlog.dev).

## The final setup

Between a couple of dry-run installs on a local VM and an unintentional dry-run install on a server, I've gotten pretty comfortable at getting Rails running on Ubuntu. I only had to reference my notes for the systemd setup.

I _did_ try to get clever by creating a `webadmin` user that would be soley responsible for running Rails. However, after creating the new user, I discovered that it couldn't run the app unless I also installed `rbenv` on their profile. This may be worth exploring in the future, but for the time being I'll just continued using my nain user account.

Adding Certbot was the only new step for me during this final setup of the site. Cerbot's official docs recommend installing on it Ubuntu using `snapd`, while nginx's docs recommend simply using `apt` to install Cerbot. Maybe it's because I listen to too many Linux podcasts, but something about using Snaps to install server software offends my sensibilities. I installed Certbot with `apt` and everything worked fine.

## Leaning into Linux

While I was doing the install, I wanted to add my Linux laptops' public SSH keys to the server. After all, I've been doing all of the development of the site on these Pop!\_OS machines. But I was doing the server setup on my Macbook Pro because it has a WAY more comfortable keyboard.

I was trying to figure out the best way to get the keys onto my Macbook, and then I remembered: my laptops are just Linux machines! I installed openssh-server on both of my Linux laptops, gave them `.local` hostnames so I could find them easily with mDns, disabled password access, and then set up `ufw`. After that, I was able to grab my public keys via ssh like any other Linux machine.

One of the reasons I've started using Linux desktops was so I could take advantage of Linux features more easily. It's nice that it's paying off.

## Pinebook Pro first reactions

I told myself I wasn't going to touch my Pinebook Pro until July, but I dislike the keyboard on my System76 machine so much I was eager to give it a try.

It's a lot of machine for $220! It's got a metal case and a nice screen. The KDE desktop is suprisingly fast compared to how slowly it runs on my Raspberry Pi. The keyboard is sensible, and I really like that the alternate actions on the left and right arrows are `home` and `end`. Importantly, it doesn't have `PgUp` and `PgDn` right on top of the left and right arrow keys, which is the most frustrating feature of my System76 Lemur.

The speakers and trackpad leave a lot to be desired though.

It's running Manjaro, which is a great distro, but since I'm deploying to Ubuntu servers, I'd rather run something Debian-based. I may try installing Ubuntu Mate on the Pinebook Pro at some point.

## Next steps for Tinker log

I want to get www.tinkerlog.dev to redirect to tinkerlog.dev. I've done this before with nginx, but I'll need to look at my notes.

Next up after that is pagination. I'm posting every day and the homepage is getting long.

I'm excited to have this site online, and I look forward to tinkering with new features regularly.
