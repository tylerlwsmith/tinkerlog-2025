---
title: "Over the finish line: Deploying Rails"
slug: over-the-finish-line-deploying-rails
tags: rails, linux
published: 2021-05-16
---

It's a new day, which means I've found a teasure trove of new problems while trying to deploy Rails to my Ubuntu Server VM.

## Setting the environment to production

The Rails `development` mode dumps a bunch of helpful error messages out to the browser when your application breaks. It super useful, but it's not the kind of thing you want in production.

I was pretty shocked to discover that Rails doesn't have a standard `.env` file. It expects environment variables to actually be set in the shell. What kind of animal does Rails think I am?

Thankfully, `rbenv` has a plugin for this called [rbenv-vars](https://github.com/rbenv/rbenv-vars) that will automatically load a `.rbenv-vars` file from your current directory and set its values in the environment. I installed that, and added a single line:

```
RAILS_ENV=production
```

I ran `bin/rails server` to test my change. Everything was broken.

## Rails Secrets

When the app is in production, Rails will try to read the `config/credentials.yml.enc` file, which relies on `config/master.key`. The encoded credentials file is stored in version control, while the master key is not. This is theoretically pretty nice because it means you can share one key with your team and have all of the relevant app credentials instead of messaging a bunch of keys over Slack. If you need to change all the project's keys, you can change them, generate a new `master.key` to share with your team, and then they'll have all of the credentials. Nifty.

I copied my local `master.key` up to the server, then again ran `bin/rails server`. In another terminal, I ran `curl localhost:3000`. Everything is broken again. Great.

## Precompiling assets

It turns out that when you're running in production, Rails expects you to have compiled your assets already. This was easy enough to fix with `bin/rails assets:precompile`.

I ran `curl` again. Still broken. Crap.

## Database migrations

Even though I ran my database migrations yesterday, the `RAILS_ENV` is now set to production, which means Rails is looking at a different database, so when I ran `curl`, Rails didn't have a database for the site.

This was an easy fix: I ran `bin/rails db:migrate` and then reran my content import script.

I ran `curl` again. Success!

## Me vs systemd

I needed to create a daemon to make sure that Puma would start when the system boots and restart if it crashed.

This is my first time using systemd, and I have no idea what I'm doing.

I created a new service at `/etc/systemd/system/puma.service` and I copied over the settings from [Puma's systemd docs](https://github.com/puma/puma/blob/master/docs/systemd.md).

Next updated the `User` and `WorkingDirectory`, then updated `ExecStart` command to run `bin/rails server`. 

I ran `sudo systemctl daemon-reload`, `sudo systemctl enable puma.service` then `sudo systemctl start puma.service`.

Everything crashed.

After plenty of Googling, I figured out my Puma service was crashing because `rbenv` wasn't loading the correct Ruby path. I saw several recommendations for having systemd do a login shell to run the command, something like `ExecStart=/usr/bin/bash -lc "bin/rails server"`. Theoretically, this should have loaded my `.bashrc` file, but it didn't seem to work at all.

After poking at it for an hour&ndash;playing with absolute paths, relative paths, and a dozen other things&ndash;**I gave up and got super hacky**.

```
ExecStart=/usr/bin/bash -lc 'eval "$(rbenv init -)"; bin/rails server'
```

**I wouldn't recommend this**, but it worked. I just manually loaded rbenv before running the command.

Finally, things seemed to work after I set `Type=simple`.

Another `sudo systemctl daemon-reload`, then `sudo systemctl restart puma.service`. Now `curl localhost:3000` returns my html.

To test that systemd restarts on crashes, you can find the puma process with htop, then run `kill` on its pid. Run curl again a few seconds later and you should still see the html in your terminal.

## Finally: nginx

I give up. I'm defeated. I'm just throwing my app in the default nginx config.

Here what I did:

I opened `vim /etc/nginx/sites-enabled/default`. I navigated to the `location /` block in the main server. I commented out `try_files $uri $uri/ =404;` and then I added `proxy_pass http://localhost:3000;` on the next line.

It should look like this:

```
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                # try_files $uri $uri/ =404;
                proxy_pass http://localhost:3000;
        }
```

I visited the site in my browser on my host machine. _Almost, but the files aren't loading!_

I know I can fix this through nginx. But I'm over it, and I'm bad at configuring nginx. A quick Google search tells me I can make Puma serve static files by setting an environment variable. I know this is _terrible_ for performance, but my blog isn't going to have much traffic and I want to be done with this.

In my app directory, I opened `.rbenv-vars` and added the following:

```
RAILS_SERVE_STATIC_FILES=true
```

I reloaded the browser.

**IT'S DONE**

**FDKAFLJPDSIAF;KDAFJAASL;DKFAJ;DFSA!!**

That was easily the most painful deployment process of my life. Let's never do that again.

## Reflecting on the deployment process

I'm in awe of how much time and learning this took. The first app I ever manually configured on a server was a Node.js app, and that was fairly straight forward. I figured all stacks would take roughly the same amount of effort. That fantasy was shattered the first time I set up a Laravel app on a droplet.

Compared to this experience deploying Rails, that Laravel app was a breeze.

Rails itself is opinionated and guides you towards a lot of reasonable decisions. The deployment process is something else. There's just so much you have to know about the ecosystem.

I hated it.

In fairness, using Capistrano may have made this all a lot easier. Or maybe it wouldn't have: either way I wanted to find out what it was like to set this up by hand. I was also fairly familiar with PHP and Node.js when I deployed sites built with those languages. At the time of writing this post, I've been developing with Ruby for about a week.

Now that I know how to use VirtualBox to build local VMs, I may play around with Capistrano at some point.

I plan to run through these steps again as best as I can remember on another local VM, and after that I'll get this set up on a production server.

This was painful. But at the very least, I think this was the most painful part of Rails. Here's to hoping that everything gets easier after this.