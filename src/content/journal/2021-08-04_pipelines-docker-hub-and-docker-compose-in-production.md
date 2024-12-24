---
title: "Pipelines, Docker Hub, and Docker Compose in production"
slug: pipelines-docker-hub-and-docker-compose-in-production
tags:
published: 2021-08-04
---

It's slow, but I'm still trying to slam my head against Jenkins, Docker Compose, and CI/CD practices in general.

I've been stuck for a few days. Probably because I've been biting off more than I can chew. It doesn't help that I've basically decided that Jenkins was a bad choice for my CI/CD. Regardless, I'm suffering from sunk cost fallacy so I'm planning to get my pipeline over the finish line with Jenkins.

## Fighting against sidequests

I'm weak-willed and ended up on a two-or-three-day side quest looking at Ansible. I was looking at Ansible because I was trying to figure out what the best way to get my new `docker-compose.yml` file to the production server and restart Docker Compose. Yes: Ansible is overkill for this task. But I'm interested in Ansible for various Raspberry Pi projects, and I hadn't really found a great way to get Docker updates to the server other than SSH-ing into it and running a script.

But today I was fed up. I was tired of not having this done. I was tired of looking at Ansible. I was tired of trying to get this perfect. I was ready to use whatever hacky nonsense it would take to get SacMusic's pipeline finished and the app running with Docker Compose in production. I no longer cared if I got it perfect or was able to stage the whole thing locally. Seriously, why have I even been worried about that? Why did I even want to stage a registry on my local machine?

## Signing up for Docker Hub

I've been planning to host everything on Linode, which doesn't offer a container registry, so I decided that I should actually support the Docker project financially and sign up for [Docker Hub](https://hub.docker.com/).

The Docker Hub website kind of pisses me off. Like 99.99% of the time I visit the site, I just want to search for a specific Docker image, so I want the page to load with focus on the search box. Instead, the focus loads on the "Docker ID" field in the sign up form. But today was different: it was the 0.01% of the time I was there to sign up.

I'm about to start filling out the sign up form, and I'm struck by an enormous question:

"What the fuck is a Docker ID?"

Seriously, what is that? I had no idea. It wasn't immediately obvious to me, and I doubt it is immediately obvious to other people. There's no tooltip on the form. I open up my Docker Desktop app thinking it may be some kind of automatically assigned ID in there. I Google for a bit. It turns out a Docker ID is just a username, but they decided to call it something else. I can't help but wonder how many thousands of dollars Docker Hub has lost in sales by adding this unnecessary friction to their sign up form.

I sign up, confirm my email, and create a few private repositories. Done. Now how do I get Jenkins to push my images to these repositories, and how do I get those images running on my production server?

## Docker Compose in production

Unfortunately, I was back to Googling to figure out how to push my Docker images to the registry and then into production. I found a CloudBees YouTube video called [Using Jenkins and Docker Compose to Deploy to Amazon ECS](https://www.youtube.com/watch?v=UU4-TB7vR8s). The CloudBees staff from the video introduced me to something I hadn't seen before: Docker Contexts. The person in the video "switched contexts" on the deploy stage of the pipeline then ran `docker compose up`. Magically, it was running the app on the server instead of the agent 🤯 What??

An even bigger breakthrough came when I found a Docker blog post titled [How to deploy on remote Docker hosts with docker-compose](https://www.docker.com/blog/how-to-deploy-on-remote-docker-hosts-with-docker-compose/). Apparently, you can specify the Docker host as an SSH connection on a production machine like the example below:

```sh
$ DOCKER_HOST=“ssh://user@remotehost” docker-compose up -d
```

This basically removes my need for systems like Ansible for the deployment step. I can build the images in Jenkins, push them up to Docker Hub, then load `docker-compose up` on the production server.

I think my main remaining questions are around generating tags in the pipeline and making all of that work correctly on the server. This [Cloud 66 post](https://blog.cloud66.com/10-tips-for-docker-compose-hosting-in-production/#tip4keepimagesexplicitlyversioned) offers some suggestions around versioning, but I'll still need to figure out a Jenkins implementation. I'm also a little concerned about accidentally posting an image that's intended to be private as public, so I'll have to see if doing that on accident is possible and potentially take preventative measures.

## Second guessing Linode

I was a little bummed that Linode didn't have a container registry, though Docker Hub's registry does seem to be a better value than what Digitalocean offers. However, today I discovered that Linode doesn't have a managed database. I don't necessarily _need_ a managed database, but not having the option gives me pause. I may switch back to Digitalocean to leverage more of their features. I'm also more familiar with Digitalocean.
