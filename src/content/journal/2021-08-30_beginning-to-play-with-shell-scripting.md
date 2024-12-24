---
title: "Beginning to play with shell scripting"
slug: beginning-to-play-with-shell-scripting
tags:
published: 2021-08-30
---

I'm super tired. But I built a small Bash CLI today. It would have been way easier to build in JavaScript or Python, but I'm trying to build all of my SacMusic stuff for maximum compatability. I want to make very few assumptions about the development OS. I'm even going as far as putting Terraform and Ansible in containers so I don't have to install them on the host OS. The Bash CLI that I built was actually a wrapper around my containerized Terraform and Ansible that makes it nicer to interact with from the host.

I had originally worried that when I started learning Docker, Ansible and Terraform that I'd get much weaker with my shell skills, or at least stop improving. The completely opposite has been true: I've learned much more about Linux and the shell than I've ever known from using these tools. While I'm still new to all of these tools and I'm novice at shell scripting, it strikes me that I've learned more about development and operations than I ever reasonably imagined I would when I started programming five years ago. Wild.

## Shell scripting notes

- Variables are global by default, but you can use the `local` keyword inside of functions to scope variables to that function.
- The `shift` command nukes the first parameter that was passed through the shell. It's janky compared to named parameters. I messed this up a bunch causing weird errors
- Commands like `getopts` create magic global variables like `$OPTARG`. For magic variables like `$OPTIND`, you may want to explicitly declare it as `local OPTIND=1` within a function because it doesn't automatically reset itself (I think).
- I need to use quotes to reliably test strings for zero characters, using `[ -z "$variable" ]` instead of `[ -z $variable ]`.
- Even though `if` is closed with `fi` and `case` is closed with `esac`, `do` is closed with `done` instead of `od`. Tight.
- The whole `do-something > /dev/null 2>&1` always messed me up because it looked like I was redirecting `/dev/null` to standard out, but apparently it goes back to the start and sends everything to `/dev/null`. Wild.
- You shouldn't use `which` in shell scripts apparently. You actually want to use `command -v executable`. Stack Exchange has [a thorough writeup on this](https://unix.stackexchange.com/questions/85249/why-not-use-which-what-to-use-then/85250#85250).
- Functions don't hoist in Bash. I'm not surpised, but it kind of messes up my flow. I ended up creating a `main` function at the top and call it at the very bottom of the script. The whole script loads before `main` is called, so it works just fine when the function uses other functions declared below it.

I'm incredibly tired, so I'm going to hit published and go to bed without proofreading. Typos are freedm.

## Next steps

I published this and was getting ready to go to bed, but then I realized that I forgot to mention: I got Terraform all set up to provision my DigitalOcean infrastructure. And it works inside a container using the Bash CLI that I built.

Here are what I think my next few steps are for SacMusic to get to [the top of the mountain](https://tinkerlog.dev/journal/the-top-of-the-mountain):

- Create an Ansible playbook for configuring newly provisioned server.
- Make Jenkins pipeline tag newly built images as `latest` in addition to their current tags.
- Create a playbook that dynamically grabs DigitalOcean inventory and deploys the latest images to the server.
- Put the playbook in my Jenkins deployment pipeline.
- Configure DataDog for logging.
- Configure Rollbar (or _maybe_ Sentry) for error monitoring.
- Tighten up my Nginx config.
- _Maybe_ build out my tests.

Once I knock these out, I'll have basically met my goals for leveling up my DevOps skills to where I want them to be (for now). After this, I plan to switch to just-in-time learning for DevOps, picking up new skills as I need them and not before. This rabbit hole goes too deep, and the tools I'm learning solve most of the technical pain points from my last job.

Focusing on DevOps has caused me to stagnate on [application development](/journal/i-am-an-applications-programmer), which is what I'm actually passionate about. And none of the things I'm building enrich people's lives (though these skills will certainly make my life more tolerable).

I'm eager to resume building things that [break free of the glowing rectangle](/journal/bridging-the-glowing-rectangle-and-reality). I'm not sure what those things are yet. But I'm excited to find out.
