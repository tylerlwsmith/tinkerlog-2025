---
title: "I'm tired of sucking at deployment"
slug: i-m-tired-of-sucking-at-deployment
tags:
published: 2021-07-20
---

There were a lot of big changes for me as a developer as I branched out from WordPress. One of the biggest changes was deployment.

With WordPress, I would FTP some files up to a server, nuke the database, upload an export of my local DB, update two rows in the `wp_options` table, download the Better Find Replace plugin and update the URLs. It was clunky, but it was easy. And everything about WordPress is clunky, so it was fine.

Then I needed to deploy my first Laravel app. I had used Linux as a desktop OS in 2008-2012, but I was clueless on the command line. I ended up FTPing my app up to GoDaddy shared hosting. I knew it was janky. I didn't even have an SSL certificate. I felt guilty, but it was the best I could do.

I finally moved to Digitalocean droplets when I launched my first Node applications. The setups were long and painful, filled with following a half dozen tutorials online without understanding what I was actually doing.

I've gone on to develop Node, Laravel, Rails and Django applications since then, and in every single app my velocity comes to a screeching hault when it's time to deploy. I'm slowed down by my unfamiliarity with Linux; my lack of domain-specific knowledge in each language ecosystem; my inability to reason about the state of the server; and my lack of confidence that the software will work in production as I intended.

No more.

## Learning the tools of continuous delivery

About a month ago I wrote that [2021 will be the year I master continuous delivery](/journal/2021-the-year-i-master-continuous-delivery). In the month since then, I've rewritten a personal project using Docker Compose with separate images for Django, Next.js, Postgres and Nginx. I finished the rewrite a few days ago and now I'm learning how to build production Docker images with Jenkins.

Both Docker and Jenkins feel like impenetrable walls which I will never scale or pass. The feeling is familiar from Webpack. I use each of these tools so infrequently that every time I need to configure something, it seems like I need to learn the tools from scratch all over again.

My current plan to combat this is to force myself to use Docker and Jenkins on every project I build moving forward. I have no idea what that will take, but my hope is that it will become increasingly practical if I use these tools regularly. I do worry that might not be the case though.

The pace in which I currently develop and deploy software is too slow. I even get stuck when I need to add basic dependencies. I want to add Elasticsearch to this blog so I can find articles more easily. I've installed Elasticsearch locally: it's far too many steps. I don't want to even imagine doing this on multiple servers for multiple projects.

Even updating this blog is painful. I currently push to GitHub; ssh into my server; run an update script; then enter my password to restart the systemd server process. I could hand-roll some kind of a webhook system where GitHub pings the server when it gets updates, but that feels like a bandaid for a problem that requires a much more sophisticated and perscriptive solution.

Improving my skills with Docker, Jenkins, and general Linux systems administration will continue to be my main focus for the remainder of the year. If I can get good at these tools, it will fix the biggest bottlenecks preventing me from getting software into the world quickly. I'm ready to suck less.
