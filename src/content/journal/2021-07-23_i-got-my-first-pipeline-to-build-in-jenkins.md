---
title: "I got my first pipeline to build in Jenkins"
slug: i-got-my-first-pipeline-to-build-in-jenkins
tags:
published: 2021-07-23
---

It finally happened: I got a pipeline to build in Jenkins. The pipeline was just a `Jenkinsfile` that echoed some stuff to the console, but it worked.

## Stumbling my way through

I had some false starts. I knew that I needed to connect Jenkins to my GitHub repo. The freestyle jobs seemed to have a way to do this, but I had a few problems:

1. I didn't understand how authentication worked between Jenkins and GitHub.
1. I wanted a pipeline instead of a freestyle job.
1. Everything I was reading seemed to indicate that the way to trigger a build was using a webhook from GitHub, but I was running locally so a webhook wouldn't work.

I started tackling the GitHub/Jenkins authentication problem by Googling some tutorials. [A YouTube video](https://www.youtube.com/watch?v=SXzgJf8fjYE) told me to create a GitHub deploy key, so I ran `ssh-keygen` in the container and pasted the public key into GitHub. The video also showed pasting the private key into a textbox in Jenkins, which just felt... wrong. I decided to see if there was a less janky way to handle private keys.

In [two](http://pinter.org/archives/3707) [posts](https://mohitgoyal.co/2017/02/27/configuring-ssh-authentication-between-github-and-jenkins/), I saw a private key option labeled "From the Jenkins master ~/.ssh". This seemed like a reasonable option that wouldn't involve me pasting a private key into the Jenkins UI. Unfortunately, this option wasn't available in my installation of Jenkins. This led me down a multiple-hour rabbit hole trying to find if I was missing a plugin that would enable this option.

Several hours into my search, [I found this post](https://newbedev.com/unable-to-point-to-ssh-keys-in-ssh-on-jenkins-host), which pointed me to [this Jenkins security advisory](https://www.jenkins.io/security/advisory/2018-06-25/) that said this feature was removed from Jenkins entirely in 2018.

So far, the experience of learning Jenkins reminds me of trying to learn Drupal in 2017 during the big version 7 to 8 transition. Google was so littered with outdated information that it felt hopeless. Today, Jenkins seems to be in a similar spot by trying to support a decade of old workflows while still needing to evolve. At least that's what I'm guessing. On the bright side, the Jenkins community doesn't seem to carry the same vitriol towards newcomers that the Drupal community did when I was learning it.

I tried exploring the options for both freestyle jobs and pipelines. I pasted my private key into the Jenkins textbox. I couldn't get _anything_ to work. At this point I basically gave up.

## Trying Blue Ocean

I decided that since learning Jenkins was a lost cause, I'd install the Blue Ocean plugin and check that out. It had a **much** nicer UI than classic Jenkins. I hit the "New Pipeline" button in the Blue Ocean interface, and I'll be damned: it gave me **everything** that I had been looking for. It prompted me to tell it where I stored my code, and gave me options for GitHub, BitBucket and Git.

I told Blue Ocean that I stored my code in Git, figuring that the GitHub option might rely on webhooks to trigger builds on my non-Internet-accessible server. Blue Ocean then automatically generated a public key, and told me to add that public key to my Git server. I added the public key to GitHub as a deploy key. I was suspicious that this _might_ work, so I created a basic `Jenkinsfile` and pushed it to my repo. I finally hit the "Create Pipeline" button.

**Everything worked. I was able to run my `Jenkinsfile` pipeline.**

FK;LDASLKFABIUH;SADCSA

I've spent like a week on Jenkins so far and I've FINALLY made some progress 😁😁😁

## Polling

Next I needed a way to make the pipeline check the repo automatically for changes. I found a [Jenkinsfile Gist](https://gist.github.com/tacahiroy/cb93df93dd3ac14cb8a9fe495ddeb866) with some syntax that looked like it was for polling. I copied the code block from the Gist and modified the cron to run once a minute. I pushed the updated Jenkinsfile to GitHub. I then _manually_ triggered this build because I knew that the pipeline wasn't yet checking for changes. With the newest pipeline uploaded, I made another change to my Jenkins file so it would echo something different during the build. Then I waited.

A minute later, Jenkins saw the new changes and rebuilt the project with the new pipeline. I then looked up how to check [every five minutes](https://crontab.guru/every-5-minutes) and called it a day. It felt good.

Tomorrow I'll start working on making the containerize Jenkins play nice with the Docker host through a Unix socket.
