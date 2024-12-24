---
title: Too many options, too much to know
slug: too-many-options-and-too-much-to-know
tags: VirtualBox, Ruby On Rails, Linux, Deployment
published: 2021-05-10
---
I'm constantly overwhelmed by the amount of options in software. RVM or rbenv? Nodesource or NVM? What format should I use to store the data for my VirtualBox?

I'm working through the steps necessary to get this blog deployed online. I decided to install Ubuntu Server locally using VirtualBox so I could do a dry-run installation before moving to a production server. I found the experience a little confusing: there's a dropdown to select what operating system you'd like to install, but you still need to bring your own OS image. That took me longer to figure out than I care to admit. If I need to bring my own image, why have the dropdown at all?

I also found the size of the VirtualBox screen so tiny it was nearly unusable. I tried full-screen mode, but it gave me the same tiny box in the center of a black screen. Next I tried scaled mode, but scaled mode didn't lock the aspect ratio, so the terminal text was very distorted. I decided the best way to handle this would be to SSH into the VM, and [I found an article by Pierangelo that walked me through how to SSH into the VirtualBox](https://medium.com/@pierangelo1982/setting-ssh-connection-to-ubuntu-on-virtualbox-af243f737b8b).

It turns out the View menu actually had an option to scale up the screen proportionally under the Virtual Screen option. Ugh.

With my virtual machine in hand, I started poking around to find out how to deploy a Rails app. I watched the [Go Rails Ubuntu deployment guide](https://gorails.com/deploy/ubuntu/20.04). After watching it, I'm reminded once again that installing applications on production servers is nothing short of a nightmare. Chris Oliver was typing a dozen packages for `apt` to install seemingly from memory, but it feels exceptionally unlikely that he didn't have notes sitting right next to him.

The whole experience left me with more questions than answers. Why rbenv instead of RVM? What is Capistrano? Is Passenger better than Puma? Do they even do the same thing? Why wasn't there a bigger focus on server security in the video?

There has to be a better way to do all of this. Maybe containers are the answer. Yet containers certainly come with their own set of problems.

In the short term, I'd like to get _acceptable_ at deploying PHP, Ruby and Python apps directly to VMs by hand. Once I can reliably do that (albeit with plenty of notes), I'd like to explore containers, deployment automation, CI/CD, etc.

This is my first step. Here's to hoping it gets easier with time.