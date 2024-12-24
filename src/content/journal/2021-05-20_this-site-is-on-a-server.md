---
title: "This site is on a server!"
slug: this-site-is-on-a-server
tags: rails
published: 2021-05-20
---

I'm happy to report that I got this site deployed to a Digitalocean droplet today, and it only took me in an hour and 15 minutes. I only had to look at my notes a few times, specifically for setting up the Puma systemd service.

I discovered a few interesting things:

## 1. `useradd` behaves differently than `adduser`

The `useradd` and `adduser` commands seem to function very differently. It looks to me like `useradd` only creates the user, while `adduser` creates the user, the group and the home directory. This seems more valuable.

I wonder what the differences are between `groupadd` and `addgroup`. For the time being, I plan to favor the `adduser` and `addgroup` commands.

## 2. You can hide directory contents

I guess I've always known thism but I've never seen it in action. I copied my root `.ssh` directory to my new user's directory, changed the owner to my new user, then I discovered no one else could access it. It made me think about the way I'm starting my Rails app right now. I created a `webadmin` group that could access the app folder, but since the Puma service runs as my user, it has access to everything my user has access to, including my `.ssh` folder.

I should rethink this setup, and maybe create a `webadmin` user than runs the app, and continue setting the app's folder group to `webadmin`. I'm not sure.

## 3. I didn't need to manually install Bundle

I guess Bundle came installed with `rbenv`. Curious.

## 4. I think I should set my `RAILS_ENV` to `production` before I run `bundle`

I'm not entirely sure how dependency management works in Ruby/Rails, but I think Bundle installs extra packages during development. Maybe if I set my environment before running `bundle`, it'll install fewer packages.

## New blog features: preventing filename drift

One of the things that bothered me about this blog was that it was really easy for the slugs and filenames to get out of sync. Now, when I run my import command, Ruby will check to see if the file name is the date plus the slug. If it's not, it will rename the file. Neat!

I also created a Rake command for new blog posts. This should help me get started on new posts faster.

Next up, I need to choose a domain for this site. I'm getting tired, so until next time!
