---
title: More Rails deployment heaches
slug: more-rails-deployment-headaches
tags: rails, linux
published: 2021-05-15
---

Rails is wild to install. I understand how Heroku got so popular.

Most of the deployment guides I've encountered use Passenger for the application server and Capistrano for deployment. For some reason, both of these tools offend my sensibilities. Puma comes bundled with Rails, and from what I've read it is technically superior to the free version of Passenger. Capistrano seems ubiquitous in the Ruby community, but since I haven't seen an equivalent tool commonly used in the PHP or Node.js communities, I'd rather try the deployment process by hand. After all, one of the major reasons I'm suffering my way through this is to improve my Linux sysadmin chops.

However, going against the grain has put me in a tight spot while figuring out deployment. I haven't found a comprehensive guide that covers all the steps to deploy Rails that didn't include Capistrano or Passenger. As I read deployment articles from around the web, it felt like everyone was just guessing how to deploy a Rails app. Random Internet guides make me nervous: I don't like installing system packages based on the suggestion of a random blog if I can avoid it.

## Installing Rails system dependencies

I had [questioned in another post why Rails didn't have a guide on how to deploy an app](rails-raising-the-cost-of-adoption-via-documentation-decisions). I felt that at bare minimum, there should be a guide that listed Rails dependencies. It turns out [Rails has a guide that _does_ have its dependencies](https://guides.rubyonrails.org/development_dependencies_install.html) geared toward Rails core contributors. However, I couldn't find it in the docs because it isn't in the Guide overview page or the dropdown guide list. Instead: it is hidden as a tiny link on the Contributing page with the text of "this other guide." I wish it was more prominent.

## Resuming the Rails installation on my VM

Armed with the hidden [Rails development guide](https://guides.rubyonrails.org/development_dependencies_install.html), I was able to install its dependencies on Ubuntu. I blindly copied and pasted, so I installed MySQL, Postgres, and SQLite even though I only need SQLite. I also installed nginx for good measure and configured `ufw` to play nice with it.

Then I installed Yarn. I had trouble with this because I didn't run `sudo apt update` before running `sudo apt install yarn`. Apt originally installed a testing package by the same name because I didn't update the package list.

The guide has [dependencies listed by Gem](https://guides.rubyonrails.org/development_dependencies_install.html#install-additional-tools-and-services). When I install the site on the production server, I plan to only install the packages that I actually need.

With my system dependencies installed, I _finally_ added my site to GitHub so that I could pull it into my server VM. 

## /srv folder and permissions

I've read on forums and articles that `/srv` is probably the most "correct" directory to store sites and services, possibly with subdirectories for each protocol (example: `/srv/http`). Every time I try to add anything to the `/var` or `/srv` directories, I end up  having to deal with permissions nightmares. However, dealing with these nightmares is the point of this exercise.

First, I created a `/srv/http` directory. Next, I struggled my way through permissions.

1. I created a new group using `sudo groupadd webadmin`. Maybe I should have just used the `www-data` group. I don't know.
1. I added myself to the new `webadmin` group with `sudo usermod -aG webadmin my_username`.
1. I changed the `/srv/http` group to `webadmin` using `sudo chgrp webadmin /srv/http`
1. I added group write permissions using `sudo chmod g+w /srv/http`. Apparently, you can specify `u` for user, `g` for group, `o` for other, or `a` for all to the add/subtraction action to target how those permissions are edited.
1.  I restarted the computer with `sudo reboot now`, because when I tried to clone my site into the `/srv/http` directory it failed.

## Installing Gems with Bundler

Next up, I tried to run `gem` or `bundle` (or is it `bundler`? are these the same?) `install` and `rbenv` yelled at me that my Ruby version different than what was specified in my project. This is a nice feature.

I ran `rbenv install 2.7.2`, `rbenv rehash`, and `rbenv global 2.7.2`. This fixed the error.

I ran `bundle install` and got a brand new error.

```
Your bundle is locked to mimemagic (0.3.5), but that version could not be found in any of the sources listed in your Gemfile. If you haven't changed sources, that means the author of mimemagic (0.3.5) has removed it. You'll need to update your
bundle to a version other than mimemagic (0.3.5) that hasn't been removed in order to install.
```

I don't know a thing about Gems or dependency management in Ruby. Yikes.

Apparently `mimemagic` 3.5 had a GPL dependency, which is a copyleft license, which meant the `mimemagic` was GPL licensed.  Does that mean that Rails was GPL licensed? Who knows. Either way, it appears [the author removed old versions of the code that had the MIT license](https://www.techradar.com/news/this-popular-code-library-is-causing-problems-for-hundreds-of-thousands-of-devs). This meant my Rails project wouldn't install.

I managed to get it to work by running `bundle update` on my local copy of the site, pushing to GitHub then pulling it back down on my server.

## Yarn (again)

Next, I ran `yarn` in the main project directory to install my JavaScript dependencies. The site won't work until you've done this. If you don't install yarn, you'll get an error that says `Webpacker compilation failed - ERROR: [Errno 21] Is a directory: 'bin'`.

Rails tries to give a helpful error. I got another error that said:

```
ActionView::Template::Error (Webpacker can't find application.js in /srv/http/personal-blog/public/packs/manifest.json. Possible causes:
1. You want to set webpacker.yml value of compile to true for your environment
   unless you are using the `webpack -w` or the webpack-dev-server.
2. webpack has not yet re-run to reflect updates.
3. You have misconfigured Webpacker's config/webpacker.yml file.
4. Your webpack configuration is not creating a manifest.
```

I should open a pull request and add option 5: "Tyler you're an idiot who forgot to install Yarn or your dependencies." I don't remember if it was Yarn or the dependencies that caused this issue, but it was one of those two things.

## Running the app

I ran my database migrations with `bin/rails db:migrate`, ran my content import script, then ran `bin/rails server`.

Using another terminal, I ssh-ed into the server and ran `curl localhost:3000`. It returned my site's content. Nice.

## Next steps

So far, I have the following steps completed:

1. I created an ssh-key on my computer
1. I copied my ssh key to my VM
1. I disabled password access to the server
1. I added `OpenSSH` to `ufw`
1. I enabled the `ufw` firewall
1. I installed Node.js via the NodeSource distributions repo
1. I installed rbenv
1. I installed ruby-build as an rbenv plugin
1. I compiled Ruby and set my system version
1. I installed bundler
1. I installed my Rails system dependencies
1. I installed nginx
1. I added `Nginx Full` to `ufw`
1. I created a `webadmin` group
1. I added my user to the `webadmin` group
1. I created a `/srv/http` directory
1. I changed the `/srv/http` directory's group to `webadmin`
1. I changed the `/srv/http` group permissions to include write access
1. I rebooted my computer for the group permissions to take effect on my user
1. I cloned my sites repo into the `/srv/http` directory
1. I installed the project's Gems
1. I installed my JavaScript dependencies with `yarn`

Here are the remaining steps that I know about:

1. Configure Puma
1. Ensure that Puma starts when the server starts and reboots when it crashes
1. Configure production settings in the Rails app
1. Configure nginx to work with Rails and proxy requests to Puma

I anticipate that setting up Puma will be challenging, but after that I believe I will be over the hump. Once I have the server completely configured, I plan to wipe the VM, spin up a new VM, then build it again. After that, I'll install it on a proper server.

I probably should have used Passenger and Capistrano, but look at how much I'm learning!