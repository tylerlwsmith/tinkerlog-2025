---
title: "SSH and making my computer speak"
slug: ssh-and-making-my-computer-speak
tags: life
published: 2021-05-12
---
The Rails installation saga continues. My day was productive, but my progress happened in a different place than I had expected.

## SSH access to my VM

My first goal today was setting up SSH key access to my VM that I'm practicing my Rails installation on. I've only done this a couple of times: I created my SSH key for my Macbook Pro over a year ago, then I set up SSH access on a couple of Droplets for work. I don't have a lot of practice with this, and I found the procedure confusing since I was trying to follow along with a half-dozen Digitalocean help guides.

After some digging, I managed to find [the Digitalocean article for setting up SSH](https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04) that I originally used over a year ago.

It was simpler than I remember to set up SSH. It's probably only simpler because the first time I had almost no idea what I was doing.

### Step 1: ssh-keygen

Run `ssh-keygen`. If you want a more secure key, run `ssh-keygen -b 4096` to get a 4096-bit key instead of the standard 3072-bit. Set the key directory and enter your passcode. The passcode is optional, but offers more security so you should use it.

### Step 2: copy your public key

Apparently there's a `ssh-copy-id` command! I didn't know what I was doing last time: I `rsync`ed the key to the server. You can copy your key over by running `ssh-copy-id username@remotehost`. I got confused here because of my custom port. I had figured since I had mounted my VM to port 2222, I could tack `:2222` onto the end of the host and it would work. Nope: it needed a `-p` flag to specify the port. The command should be `ssh-copy-id username@127.0.0.1 -p 2222`.

### Step 3: Disable password access

Next we want to disable passwords so John the Ripper or whatever hackers use can't bust this thing open in three minutes. Edit `/etc/ssh/sshd_config` with sudo and find the line that says `PasswordAuthentication yes` and set it to `PasswordAuthentication no`. 

**Important:** make sure you're editing `sshd_config` and not `ssh_config`. They both have the `PasswordAuthentication` property, but it doesn't actually disable it if you do it on `ssh_config`. Yep, I messed that up.

## An unexpected turn of priorities: making my computer speak

I realized my next step in deploying this site was getting it into version control (_yes_, I _know_ that I'm playing with fire right now). 

Despite wanting to build in public, I haven't proofread any of these posts. I'm actually really bad at proofreading. A couple of years ago, I discovered that if you select text on a Mac and hold `alt` + `esc`, the computer will read the text to you out loud. This has become a critical step in my writing process, and I don't feel comfortable editing without it. 

This System76 machine doesn't have that feature.

My next step before committing to GitHub is proofreading, so this feature seemed critical. I hit the forums, copy and pasted some stuff, and learned just enough bash scripting to get a janky version of this feature working. [I wrote a blog post outlining how to set it up](https://dev.to/raspberrytyler/read-selected-text-out-loud-on-ubuntu-linux-45lj), which took maybe an hour. Now I have it all set up, and tomorrow I can start proofreading the blogs I've written before there are so many that it becomes a hopeless venture.

Every time I do bash scripting, I realize how little bash scripting I know. I'd like to know more, but with Python being so ubiquitous it feels like a lost cause. If I stick with coding long enough, I'm sure I'll pick it up eventually. I wonder how many years it'll be until I hit that eventually.