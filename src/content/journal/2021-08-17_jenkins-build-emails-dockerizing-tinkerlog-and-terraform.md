---
title: "Jenkins build emails, Dockerizing Tinkerlog, and Terraform"
slug: jenkins-build-emails-dockerizing-tinkerlog-and-terraform
tags:
published: 2021-08-17
---

I've been writing these when I'm absolutely exhasuted lately so today I'm going to treat this more as an actual log rather than a thoughtful retrospective. I'm not doing proofreading, so apologies if this sounds unhinged.

## Jenkins Build Emails

I hooked up Jenkins build emails today with the Email Extension plugin. The Jenkins administration plugin is beyond terrible and nearly impossible to understand. Jenkins doesn't have any integrations with Mailgun or friends, so I needed to use SMTP. I have a gmail account that I don't use for anything important, so I tried to hook that up. As if the Jenkins admin wasn't confusing enough with having two fields to enter emails in, Gmail doesn't play nice with SMTP. To use SMPT, I needed an [App Password](https://support.google.com/accounts/answer/185833?hl=en). To use an App Password, I needed to enable 2-factor auth on this email I don't use. The whole process was very confusing and poorly documented, but it's working now. And getting the build notifications is a total game-changer. The CI/CD pipeline really opens up a whole new world of development that's much faster-paced and more incremental. I'm a fan.

## Dockerizing Tinkerlog

I felt I had gotten enough out of Jenkins and SacMusic momentarily, so I started the process of Dockerizing this site. Surprisingly, it's in nearly good enough shape to launch: I have the Rails app in a container and have swapped out SQLite3 with a Postgres container. The Rails app container isn't optimized yet, but I don't want to let that slow me down. It _will_, however, slow me down from publishing this for a few days: Git made a mess when I switched back to the master branch to write this so I'm just gonna get these local for a bit while I work out some of the deployment automation.

## Terraform

I've been wanting to try out Terraform for a while now. Tonight I started my first Terraform project: one project, two droplets and a tag all build through Terraform. From knowing basically nothing to having Terraform hooked up to DigitalOcean deploying my infrastructure was under three hours. I feel like for my needs, it'll only take me another day or two for me to learn everything I need to know in Terraform for the foreseeable future. This is incredibly refreshing after all of my Docker and Jenkins headaches. Next up is Ansible I guess.

## Onward

I've been thinking a lot about what the mountain I'm trying to climb is. I have a post in draft about it that I'll publish at some point. I don't know where I'm going or what I'm doing with all of this yet. Making decisions is hard. It's on my mind though.
