---
title: "Mastering Ubuntu Server: notes from day 1"
slug: mastering-ubuntu-server-notes-from-day-1
tags:
published: 2021-08-12
---

I started reading Mastering Ubuntu Server by Jay LaCroix today. It's something to do while my carpal tunnel is flaring up. Here are some interesting things that I learned while reading Jay's book, without much elaboration and even less proofreading.

Partitions can be used to segregate logs from taking up the whole disk. I hadn't ever thought of that.

You can put the home folder in its own partition to make sure that it isn't destroyed if you nuke-and-pave your OS. I wonder if there's goofiness over the UID and GID when you put a new distro on the other partition, like a user can't access the files and folders unless they have the same UID and GID.

`adduser` isn't available on all distributions, so that's why `useradd` and `groupadd` might be good to use sometimes, despite being somewhat painful by comparison if you're trying to create a home directory and stuff. I wonder if Alpine has `adduser`?

`adduser` IS A FUCKING PERL SCRIPT!? Jesus, Perl is just out there powering Craigslist and `adduser`.

The `x` in the second column of `/etc/passwd` is where the passwords used to be in the past. Now those have been moved to `/etc/shadow`, where they are hashed and require root privileges to view.

`passwd -l` locks an account. This could be used to lock the root account on DigitalOcean, which is probably worth doing. Interestingly, when you run this command it leaves the old password hash in place in the `/etc/shadow` file but puts a bang (`!`) in front of it to designate it locked. Maybe that way it keeps the same password when you unlock it.

Users with locked accounts can still log in with SSH.

DigitalOcean enabling root by default is non-standard for Ubuntu

You can have passwords, locked passwords and no passwords. Wild.

`visudo` lets me modify exactly what sudo permissions a user has. This would have been really useful when I wanted to created an unprivileged user who could just run `sudo systemctl reload puma`. Though the sudo still makes it unscriptable (I think). There's gotta be a better way to do that.

## What octal file permissions do vary between files and directories (reference page 74).

That's all for today. If you wanna know more the buy the book. I'm two chapters in and so far it's pretty good.

Oh, I also learned that all child processes inherit their parent process's environment variables. That's concerning.

That's all.
