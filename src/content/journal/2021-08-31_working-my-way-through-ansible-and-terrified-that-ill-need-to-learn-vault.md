---
title: "Working my way through Ansible and terrified that I'll need to learn Vault"
slug: working-my-way-through-ansible-and-terrified-that-ill-need-to-learn-vault
tags:
published: 2021-08-31
---

I'm not having a good time with DevOps anymore. It's tedious. My sites are stagnant while I figure this stuff out. Even once I learn it it'll still be tedious. But I'm making my way through this nonsense and I'm _really_ hoping to wrap it up sooner rather than later.

Today I've been working on writing an Ansible playbook that will run immediately after provisioning a server on DigitalOcean. I'm trying to incorporate some of [RedHat's security recommendations](https://www.redhat.com/sysadmin/harden-new-system-ansible). I was even learning about [importing variable files](https://www.toptechskills.com/ansible-tutorials-courses/ansible-include-import-variables-tutorial-examples/) into Ansible.

My ultimate goal is to be able to provision infrastructure with Terraform and then have this playbook automatically put the latest version of the app on there and have everything \*just work\*. I was concerned about how to make the latest tag work with my CI pipeline, but a [Stack Overflow answer](https://stackoverflow.com/a/47327980/7759523) gave me the exact solution I was looking for: just build it twice and the built cache will make it fast.

So I started working on getting the `docker-compose.yml` into my container that runs Terraform and Ansible and I came to a soul-crushing realization: the container doesn't have access to the production secrets. I'm running all of this locally, and I don't even have those secrets on my local machine. It really feels like there's no end in sight with this DevOps stuff.

My secrets management has always been a little haphazard and janky. Up until now that's been okay: I had one app and no pipelines. I had one `.env` on my local and one `.env` on the server. It was fine. Adding multiple apps and pipelines has substantially complicated this picture. I don't have a single method. I've tried using Jenkin's secret management, but it mostly left me frustrated. Even if it didn't, I don't think it would work spectacularly now that I need to pass literally everything into a child container to get Docker Compose to work.

I'm not sure what all of Hashicorp's Vault's capabilities are, but I feel like I'm going to have to find out. Maybe it has a good way of loading a dozen environment variables at once. That's what I need.

My sanity is waning: DevOps tools and techniques are necessary but I hate them. I managed to burn myself out when I'm not even employed. This sucks.

---

Hello there. It's Tyler from 8 hours after I wrote the part above. I looked at Vault and decided that I'm not gonna use it. It's too much complexity for too small of a problem: I don't have a massive team and my web app is simple.

I _really_ like how Rails handles credentials. So I'm writing a Bash CLI that uses GPG where I'm going to try to do the same thing with a boring `.env` file. I'm hoping I can load the decrypted environment variables directly into the shell session and make it work with Jenkins|Docker|Ansible, but we'll see.
