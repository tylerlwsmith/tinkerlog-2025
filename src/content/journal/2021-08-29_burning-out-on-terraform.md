---
title: "Burning out on Terraform"
slug: burning-out-on-terraform
tags:
published: 2021-08-29
---

If this site had any regular readers, they would have noticed that the site hasn't had any updates in about two weeks. Here's what happened:

I was so pumped that I got Jenkins and Docker working, I decided that I'd go ahead and throw Tinkerlog in Docker on a new Git branch and put the Rails app in a subdirectory. I figured I'd pause publishing until I had finished. Days later, I hadn't finished so I checked out the master branch. Changing the folder structure bit me: my `.gitignore` caused a bunch of folders from the Docker branch to be left behind and mucked up master.

Meanwhile, I was getting antsy. I wanted to learn Terraform and Ansible and add them to the SacMusic project. I had an early win with Terraform, so I had hoped I could get everything set up in a few days for SacMusic and then come back and finish Tinkerlog. That's not what happened.

## Burnout

I've lost my steam during the past two weeks. It might be from information overload: since I left my job at the beginning of July I've learned Django, Tailwind, Docker, Jenkins and now I'm learning Ansible and Terraform. It might be from lack of delivered value: while these technologies certainly will be helpful with future development, they add literally no value to end-users.

And last night, another possibility struck me: maybe the lack of journaling is killing my momentum. Before I paused Tinkerlog, I posted what I worked on everyday and laid out next steps. I'd start my development most days by checking the next steps I had posted the night before. I used my posts as a reference to remind me what I had learned. And the very act of writing the posts helped make the concepts stick.

I can't help but think that my lack of posting slowed my momentum substantially. I haven't been writing what I've learned about Ansible and Terraform as I've been learning, which means it isn't sticking in my head, which means I'm learning slower. This is stupid.

## Moving forward with Tinkerlog

I don't want to pause SacMusic's Ansible and Terraform tasks to work on Dockerizing Tinkerlog. But I do want to continue publishing daily. And I know that switching back and forth between `master` and `docker` branches of the Tinkerlog projects is going to cause a mess because of files in `.gitignore`.

So I moved the `docker` branch to a separate directory on my machine then cleaned up the `master` branch. I just published a few draft entries I wrote while the site was broken.

Hopefully now that I have a working local copy of Tinkerlog, I can resume writing and publishing almost daily.

## What I've been up to while I wasn't posting

In my personal life, I've been busy working through the process of getting a Real ID, getting a new passport, and getting health insurance. I've also been making an effort to focus on my health: I'm back on keto and I weigh less than I have in eight years. I've been going to the chiropractor, which I think is helping with straightening my back, but has done almost nothing to manage my back pain. As the summer weather dies down, I plan to exercise a _lot_ more. While the weight loss has been nice, my goal is improving my health and how I feel. I mean honestly, at 300 pounds I was never too hung up about my weight: fat guy with a beard is kind of a classic look. I don't feel great though, so I've gotta make a change.

In tech, I've been working through Ansible and Terraform. So far, I've got a daily database backup going to DigitalOcean's S3-compatable object storage using Jenkins and Ansible. Ansible was unnecessary here, but I figured that starting with something small would help get me hands-on experience with Ansible (and it did). Now I'm in the process of provisioning my Cloudflare DNS and infrastructure for SacMusic with Terraform. The Cloudflare bit is done, but my burnout is causing me to set up the DigitalOcean infrastructure to go _very_ slowly.

I've also been bombarded with opportunities, which I'll talk about in another post.

I'll pick up Terraform and Ansible again soon, but I may take a break for a few days to try to recover from this burnout. I'm eager to get to the [top of the mountain](/journal/the-top-of-the-mountain) that I'm currently climbing with development.
