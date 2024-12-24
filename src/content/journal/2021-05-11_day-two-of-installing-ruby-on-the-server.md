---
title: Day two of installing Ruby on the server
slug: day-two-of-installing-ruby-on-the-server
tags: Ruby, Linux, VirtualBox, rbenv, RVM, Node.js, NodeSource, NVM, ufw, Puma, Passenger
published: 2021-05-11
---
When I have the time, I try to understand the choices I'm making in tech. I often don't have the luxury of time, but since I'm using this blog site as an excuse to improve both my Ruby and Linux chops, I made time today.

Here are the things I learned and the choices I made as I continued to set up Ruby in my VirtualBox VM today.

## RVM vs rbenv

The first of these choices I needed to make was if I should use RVM or rbenv on the server. After spending a considerable amount of time reading, I discovered [a dev.to article by Kurt Bauer](https://dev.to/krtb/why-and-how-i-replaced-rvm-with-rbenv-23ad) that said RVM uses shell tricks that some developers consider "hacky."

Among other things, RVM seems to hijack the system's `cd` command. I read its implementation could lead to problems when running Ruby via cron, which is a problem I've run into using Node Version Manager. It also seems to take more system memory. Finally, three-fourths of the Rails deployment articles I've read seem to favor rbenv over RVM for deployment, so all of that led me to believe I should favor rbenv over RVM. I'm suddenly wishing I hadn't installed Ruby via RVM on my System76 laptop, but that's a problem for another day.

I was encouraged to discover that rbenv was built by Sam Stephenson, who has been a long-time Basecamp employee and contributor to important Rails projects. Less encouragingly, [Sam publicly announced he will make no further updates to any open source software he contributed to at Basecamp](https://twitter.com/sstephenson/status/1388146131377528832). The larger web development community will probably feel the impact of the [Basecamp incident](https://www.platformer.news/p/-how-basecamp-blew-up) for years to come.

Installing rbenv was simple enough: it was available from `apt`. I used the `rbenv install -l` to see the versions, then `rbenv install 2.4.1` to install Ruby because that was one of the more recent versions I saw. Not being a Ruby developer, I don't really have much context for how old that is. I tried to run `gem install bundler`, but I kept getting an error that I didn't have permission (something like `Gem::FilePermissionError` to something in the `/var/` folder I think). Eventually I realized that `gem` command was running `/usr/bin/gem` instead of `~/.rbenv/shims/gem`, even though `which gem` said I was running the version from my shims folder.

After reviewing the rbenv docs more carefully, it said that I needed to use [ruby-build](https://github.com/rbenv/ruby-build) to install versions of Ruby from rbenv. I found this confusing, since I had already installed a version of Ruby without it, but after I added ruby-build, I got a warning that Ruby 2.4.1 was no longer supported, then I updated to Ruby 3.0.1. Finally after some [rtfd](https://www.urbandictionary.com/define.php?term=RTFD), I ran `rbenv rehash` and I was finally able to install bundler.

## Node.js from NodeSource

Next, I needed to install Node. Having recently experience a lot of pain from using NVM in a cron job on my Raspberry Pi, I opted to use NodeSource to install it. I have used NodeSource on servers in the past, but I couldn't find the install scripts anywhere on their website. Apparently, they live in the [nodesource/distributions](https://github.com/nodesource/distributions) repo on GitHub. Once I found that, the install was painless.

## Firewalls

Next, it was time for a firewall. I've used `ufw` (short for Uncomplicated Firewall) in the past. But I wanted to understand _why_ I was making this decision, and what my other options were. On a recent episode of the [2.5 Admins podcast](https://2.5admins.com), Jim and Allen were discussing IP Tables vs another firewall. I'm not familiar with IP Tables, so I googled "ufw vs ip tables". I discovered that `ufw` was just a wrapper around IP Tables with a simpler interface. Nifty. Knowing that `ufw` is an actual firewall that the enterprise uses except with training wheels gave me the confidence to feel like I was making the right decision by continuing to use it. I enabled ufw and allowed OpenSSH.

That was all the software I felt like installing today.

## Application servers

I also wanted to explore Ruby application servers. There's Passenger, Unicorn, Puma, and several others. I've seen Passenger used as the go-to application server in most tutorials. [Chris Oliver of GoRails explains in a forum post that he prefers Passenger because it's more approachable for beginners](https://gorails.com/forum/passenger-vs-puma). [Scout APM has a fantastic article weighing the costs and benefits of each Ruby server technology](https://scoutapm.com/blog/which-ruby-app-server-is-right-for-you). I'm personally leaning towards Puma because it's built into Rails, and I don't like to veer from defaults until I have a good reason to.

After a bunch of reading, here are my takeaways:

- Unicorn is a bad option. Avoid it.
- Passenger is easier to set up than Puma, but the free version isn't as powerful as Puma.
- Puma is fast, powerful and feature-rich, but configuration can be difficult. Some users reported having memory leaks.

Granted, lots of this information is out of date: Rails has been around for a long time, so a lot of old information ranks high on Google. It's very possible that what I've gathered may no longer be true. It may have also never been true. I don't know for sure because I haven't used any of these application servers in production.

## Next steps

My next steps are setting up an SSH key on this laptop, then I will disable password logins over SSH on my VM. After that, I need to get this site into GitHub (_...yeah, I know..._), then figure out how to get the code into the VM. After that, I'll set up the application server, then I'll make it hold hands with NGINX.

I'm hoping that by documenting my decisions here, this will be a lot quicker next time.