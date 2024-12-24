---
title: "My first pipeline is finally deploying to DigitalOcean"
slug: my-first-pipeline-is-finally-deploying-to-digitalocean
tags:
published: 2021-08-07
---

What a journey it has been. At 3:10 pm today, Jenkins ran `docker compose up -d` on a Droplet and started SacMusic's containers.

What a journey it's been to get here.

## Dirty little secrets: SSH keys

Yesterday I got stuck [when I needed to add an SSH key from Jenkins to the server](/journal/the-final-yard-docker-firewalls-and-ssh-keys). There isn't a great way to add a key that Docker could use through the Jenkins UI because of how Docker works. And I didn't want to generate a key inside the container that I'd need to spin up again every time I rebuilt it. I considered mounting my `~/.ssh` folder into the container, but I was worried that the container might do something to my host's keys. Then I'd really be in trouble.

I briefly went down the rabbit hole of trying to [mount the MacOS SSH socket into the container](https://medium.com/@nazrulworld/ssh-agent-forward-into-docker-container-on-macos-ff847ec660e2). After reading about it for over an hour, I didn't understand any of it.

Then I stumbled across [a Trabe blog post about Docker secrets](https://medium.com/trabe/use-your-local-ssh-keys-inside-a-docker-container-ea1d117515dc). Docker Secrets are managed in memory, and [mounted during run-time as a read-only volume](https://docs.docker.com/engine/swarm/secrets/#how-docker-manages-secrets) that is never stored as part of the image.

I used [Compose file secrets](https://docs.docker.com/compose/compose-file/compose-file-v3/#secrets) to add my host's public and private keys to the Jenkins container. I originally couldn't get Jenkins to connect to the server because the permissions were wrong on the keys and either the public or private key had mounted to the container belonging to `root`. So I ran `id -u username` and ` id -g username` to get the `jenkins` user UID and GID, then explicitly set the secret to use those when mounting the keys.

I ran the pipeline again. It failed: it needed my key's password. Crap.

I used `ssh-keygen` to generate a new password-less key for Jenkins, updated my compose file to point to the Jenkins key, then ran `ssh-copy-id` to push the Jenkins key to the target server.

Acess still denied. [I found a snippet for disabling strict host checking](https://askubuntu.com/a/87452), which I placed in `~/.ssh/config`.

```
Host *
    StrictHostKeyChecking no
```

Granted, this was also included in the original [Trabe blog post](https://medium.com/trabe/use-your-local-ssh-keys-inside-a-docker-container-ea1d117515dc) that told me about secrets. They included it in their `Dockerfile` with the following line:

```
RUN echo "Host remotehost\n\tStrictHostKeyChecking no\n" >> /home/user/.ssh/config
```

With that, I could finally connect to the target server.

## And then, Docker was broken

I tried to run `docker compose up -d` and got the following error message:

```
+ docker-compose --env-file .env up -d

Building frontend

error during connect: Post http://docker/v1.24/build?buildargs=%7B%7D&cachefrom=%5B%5D&cgroupparent=&cpuperiod=0&cpuquota=0&cpusetcpus=&cpusetmems=&cpushares=0&dockerfile=Dockerfile&labels=%7B%7D&memory=0&memswap=0&networkmode=default&rm=1&shmsize=0&t=tylerlwsmith%2Fsacmusic-frontend%3A2021-08-07_21-28-13&target=&ulimits=null&version=1: write |1: broken pipe

time="2021-08-07T21:29:08Z" level=error msg="Can't add file /var/jenkins_home/workspace/sacmusic-2021_master/frontend/package-lock.json to tar: io: read/write on closed pipe"

Service 'frontend' failed to build : Build failed

script returned exit code 1
```

I originally thought that Jenkins was trying to connect back to my local Docker but couldn't. I spent an hour going down that rabbit hole. I eventually realized I was looking at the wrong part of the error message: the important part was the broken pipe.

[A GitHub issue's comment](https://github.com/docker/compose/issues/8218#issuecomment-891429885) from only five days ago suggested I set `COMPOSE_DOCKER_CLI_BUILD=0` in the environment.

I did, and then it finally started to work. Had I been looking for this six days ago, I probably would have been screwed.

## The first success

Instead of pulling images from the registry, Docker built the same images again on the server. This was less than ideal: I thought Docker would only build the images if I ran `docker-compose build`. Nope.

I found a [GitHub issue](https://github.com/docker/compose/issues/3574#issuecomment-303459505) that seemed to kind of address this, but honestly I'm not 100% sure what the issue was about. The useful advice I got from it was the following snippet:

```sh
docker-compose pull && docker-compose up
```

I updated my Jenkinsfile and recommitted the code. This time it pulled the code from the repo. Unfortunately, actually booting the containers with `docker-compose up -d` took almost 10 minutes.

## Docker Compose performance

A ten minute boot time was far from ideal. I decided I'd nuke the containers on my server and do it again with `htop` running. [I found a code snippet on Coderwall that showed me how to stop and remove all of the containers on a box](https://coderwall.com/p/ewk0mq/stop-remove-all-docker-containers).

```sh
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

I pushed a change to the project repo, causing the pipeline to do a from-scratch redeploy of the app. As I watched `htop` on my tiny $5/mo droplet with 1 vCPU and 1 gig of RAM, the CPU and RAM were stuck between 90% and 100% for ten minutes. That's pretty bad.

Aside from my Plausible server ([set-up notes here](/journal/self-hosting-analytics-with-plausible-and-nginx-on-ubuntu-server)), I've never run Docker in production, so I really don't have a great idea of what kind of resources it uses. I decided to throw money at the problem and keep resizing my Droplet until it sucked less.

I upgraded from 1 gig of RAM to 2 gigs, doubling the price of my $5/mo droplet. I nuked the containers from the server again and ran the pipeline. The additional gig of RAM reduced the boot time from 9:05 (minutes:seconds) to 1:23. Then upgraded from 1vCPU to 2 and nuked the containers again. This took me from 1:23 to 1:10, which was less substantial of an improvement than I anticipated. It still felt like an unreasonably long time for Docker Compose to boot.

However, these containers are set up for development and completely unoptimized. In fact, the front-end container is running Next.js's Webpack dev server, which is a HUGE resource hog 🤦‍♂️ No wonder this is slow to boot.

Not only that, when I ran `docker ps` I saw that both the front-end and back-end containers were restarting a few times every minute. My guess is `docker compose up -d` is slow because these containers are restarting in an endless loop.

## Other things that went wrong along the way

These aren't important but they deserve honorable mentions. I originally got the public and private keys reversed when putting them in the container.

I also forgot to install Docker Compose on the server. Though truthfully, I don't think the server actually needs it. At some point I'll try deleting it and see what happens.

## Next steps

I obviously need to figure out why these apps are restarting on the server. I also need to adjust my Dockerfiles and Docker Compose files to be production ready, which they very much are not.

I know that after that, I'll need to finish setting up nginx, Certbot, and then switch the DNS for the main site. However, I feel like there are likely to be several intermediary steps that I haven't anticipated, because that's what this whole process has been like.

I also believe that `COMPOSE_DOCKER_CLI_BUILD=0` may be unnecessary. It's possible that I only needed that because I was accidentally building the images on the server. I'll test removing that soon.
