---
title: "Setting up back-ups with an Ansible container in Jenkins"
slug: setting-up-back-ups-with-an-ansible-container-in-jenkins
tags:
published: 2021-08-23
---

I want database backups for SacMusic. A cron job could work while it's a single server. But it wouldn't notify me when it fails. And what about when I have multiple servers and I use a managed database? Which server do I put the cron on? How do I configure my pipelines to ensure that only one instance of it is running? What system dependencies do I need to install to interact with S3 buckets? An application server is a less-than-ideal fit.

I already have a Jenkins instance that can handle recurring jobs and notifications, so I decided I'd build my backup system there. As an added bonus, Jenkins handles containers alright too. I've been looking to play with Ansible as well. This project may not be the best fit for Ansible since its supposed to be completely idempotent and backups aren't reall that, but having a small project to start getting my hands around how Ansible works is more important to me right now than scoring points with the Hacker News crowd.

Here's what I learned today while digging into this:

- The Jenkins SSH Agent container is only useful if you want a general-purpose Docker Container for builds. You can do Jenkins things with any container by giving it the [image name or Dockerfile as the agent](https://www.jenkins.io/doc/book/pipeline/syntax/#agent).
- [Docker Compose secrets are a lie](https://github.com/docker/compose/issues/4994#issuecomment-313200509). Secrets are only a Swarm feature: on Docker Compose they're just a bind mount. The Compose error that tries to alert you when you use the Swarm-only features is less than crystal clear.
- Trying to mount a file from a Docker container on the host to another Docker container inside Docker-in-Docker doesn't work. You can get all the UIDs right, but since neither exists on the host file system, Docker is just guessing. It sets the files as root and gives 755 permissions. This is far less than ideal.
- SSH keys can be "too permissive" and error out in Ansible. I don't know if that's an Ansible quirk or something with open-ssh.
- You can get clever and use an entrypoint to create files from environment variables at boot time so they aren't commit to the build.
- There's an **exec form** of the Dockerfile `ENTRYPOINT` command (`ENTRYPOINT ["executable", "param1", "param2"]`) and a **shell form** (`ENTRYPOINT command param1 param2`). In my limited experience, the shell form doesn't work very well and it should be avoided.
- Shell variables echo different if you put quotes around them: `echo $MY_VAR` will strip the line breaks but `echo "$MY_VAR"` won't.
- `exec` replaces the current process with a new one. I think I've learned and forgotten that a few times.
- Docker rudely doesn't pass its environment variables down to its containers.
  You have to pass them in with the `-e` flag.
- `if[ -n $MY_VAR ]` will check if a variable is **not** empty (`-n` for not?).
- `if[ -z $MY_VAR ]` will check if a variable **is** empty (`-z` for... zero?).
- Ansible doesn't actually need roles: you can just put tasks in your main file.
- Installing Ansible takes a painfully long time, and installing pip sucks.

I also added `venv` to the Python back-end of SacMusic today. It's not actually used in the container though: it's just on the host machine for better autocomplete. It's a massive quality-of-life improvement compared to using the Microsoft Remote - Containers extension: my whole app is in a single editor.

Hopefully tomorrow I can dig further into Ansible for the backups. I saw that there's an [S3 collection](https://docs.ansible.com/ansible/latest/collections/amazon/aws/aws_s3_module.html#ansible-collections-amazon-aws-aws-s3-module), so that will hopefully get me most of the way there.
