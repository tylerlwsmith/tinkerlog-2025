---
title: "Offloading my brain to the Internet"
slug: offloading-my-brain-to-the-internet
tags:
published: 2021-08-14
---

I have a lot of code in private repos, and I've learned how to do a lot of cool stuff over the years. I think a lot of it would also be useful to other people. As I find time, I'm going to start throwing code over the wall and into public repos.

For years I've had a weird apprehension around public repos. I was perfectly happy putting my code into blogs, but putting it in a GitHub repo that anyone could read felt like a much bigger commitment. I think I'm finally starting to push past that anxiety.

Today I published [my Dockerized Jenkins set-up](https://github.com/tylerlwsmith/Local-Jenkins-Blue-Ocean-and-Docker) as a public repo on GitHub. Well, that isn't _exactly_ true: today I _thoroughly_ rewrote my Dockerized Jenkins set-up, sunk hours into a README.md file and _then_ published it. I think this is more useful than a blog post but less discoverable. I can pull it down to other machines if I ever need to. That's far less practical with blog posts.

I'm going to try to keep throwing code over the wall and hopefully I can get more comfortable with working in public. We'll see how it goes.

## What's coming up

I need to set up my production Jenkins server. Cleaning up my Docker and Compose files today seemed like a good starting point. I'm strongly considering running the Jenkins server in a container and attempting to mount the Docker socket into the container. Installing Jenkins directly on a Droplet just sounds like problems waiting to happen. I'd like the option to blow up the container and rebuild if anything weird happened.

After that, I have lots of things I'd like to work on in no particular order. I'd _very_ interested in learning Terraform and Ansible. I'm like to containerize this website. I have things I want to write about. Books to read. And eventually projects to build.
