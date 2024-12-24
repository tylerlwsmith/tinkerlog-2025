---
title: Struggling to integrate Docker and Jenkins
slug: struggling-to-integrate-docker-and-jenkins
published: 2021-07-25
---

If you've been reading my recent posts, you'll know that I'm _really_ struggling with understanding how Jenkins and Docker work together. I'm starting to see that the answers may have been in front of me the whole time, but still managed to not be obvious.

## What I'm trying to do

It's becoming clear to me that there are a lot of things that you can do with Jenkins and Docker together. It's also become clear that that are a _lot_ of things you can do with Jenkins period.

Here's a complete picture of what I'm trying to build:

1. I want Jenkins to continually poll GitHub for new commits. I want polling because I'm running Jenkins locally where a webhook would not work.
2. I want Jenkins to build all the Docker containers.
3. I want Jenkins to use `docker compose up` so I can boot all my services and run each app's unit tests, and if those pass I want to run integration tests.
4. If all the tests pass, I want to:
   1. Build the production containers.
   2. Push the production containers to a container registry.
   3. Ship any updates to the production `docker-compose.yml` to the server.
   4. Have the production server fetch the newest containers
   5. Restart the app.
5. Run `docker compose down`.

I'm sure there are implementation details lost in here around environment variables and compose files between testing and live. I'll figure those out as I go along.

## Stumbling through my search

I've been trying to figure out how to build this pipeline in a linear sequence. I thought, "First, I'll figure out how to get Jenkins to work with Docker. Then, I'll figure out how to get Jenkins to work with Docker Compose. After I have this plumbing complete, I'll figure out the commands and syntax needed to wire up the necessary pipeline."

Unfortunately (or fortunately), there are a lot of ways to hook up Jenkins and Docker, and which method you use will likely depend on what outcome you're trying to achieve. Until today, I didn't really understand _what_ I was trying to achieve with my pipeline.

Unsure of what I was doing, I started reading the Jenkins User Handbook's [Installing Jenkins with Docker page](https://www.jenkins.io/doc/book/installing/docker/). I found the sheer number of command line arguments in the documentation challenging. With nearly a dozen arguments a piece for multiple `docker run` commands, this would have been a good candidate for Docker Compose. The example also recommended using the `dind` (Docker-in-Docker) image. I completely lost hope when I saw that the original developer behind Docker-in-Docker [strongly recommended against using Docker-in-Docker with Jenkins in a blog post](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/).

From there, I abandoned the official Jenkins User Handbook and Googled every variation of "use docker compose with jenkins" that I could think of. I found [pages like this](https://www.jenkins.io/doc/pipeline/steps/docker-compose-build-step/). Imagine being a brand new user to Jenkins and trying to make sense of this page.

I found the [Docker plugin](https://plugins.jenkins.io/docker-plugin/), but I really didn't understand what it did. I found the [Docker Pipeline plugin](https://plugins.jenkins.io/docker-workflow/), but while reading [its docs](https://docs.cloudbees.com/docs/admin-resources/latest/plugins/docker-workflow) I saw an unfamiliar syntax, which I discovered was the scripted pipeline DSL. This led me down a multi-hour rabbit hole of trying to understand the differences between the scripted pipeline and declarative pipeline syntaxes. I've already spent days understanding the differences between freestyle jobs and pipelines, then figuring out how to connect my project to a private git repo, so I'm not pumped.

The first potential breakthrough that I've had was [stumbling into this pipeline Gist](https://gist.github.com/bvis/68f3ab6946134f7379c80f1a9132057a) that showed a declarative pipeline where all the Docker and Compose commands were just run from the shell.

I then saw the Docker shell commands in a declarative pipeline in a [Nestybox post about integrating Jenkins with a system container](https://blog.nestybox.com/2019/09/29/jenkins.html). The post explains that you need to install the Docker CLI on the Jenkins container, but the CLI will talk to the host container because you mount the host socket as a volume, meaning you don't need the Docker Engine in the container. I reread the [post about not using Docker-in-Docker](https://jpetazzo.github.io/2015/09/03/do-not-use-docker-in-docker-for-ci/), and this was the author's suggestion as well, I just didn't have the context to understand his recommendation when I first read it. Heck, the [User Handbook Docker Installation Guide](https://www.jenkins.io/doc/book/installing/docker/) that I originally started with also installed Docker CLI in the Jenkins container: the CLI just talked to Docker-in-Docker instead of the host container. I saw on the [Using Docker with Pipeline](https://www.jenkins.io/doc/book/pipeline/docker/#using-a-remote-docker-server) page of the User Handbook that the [Docker Pipeline plugin](https://plugins.jenkins.io/docker-workflow) will communicate with a local Docker daemon, typically accessed through /var/run/docker.sock. I'm guessing its possible that the plugin doesn't need the CLI and issues commands directly to the socket.

The Nestybox post raised some issues about how connecting to Docker through this method can be a challenge due to permissions. However, [a post by ITNEXT](https://itnext.io/docker-inside-docker-for-jenkins-d906b7b5f527) shows how to deal with these permission issues.

Finally, I found this [nifty tutorial by Riot Games about building with Jenkins inside an ephemeral Docker container](https://technology.riotgames.com/news/tutorial-building-jenkins-inside-ephemeral-docker-container). I can't make heads or tails of it right now, but it looks like it may be useful later.

## My current understanding

I think my setup will ultimately look _something_ like this:

- Install Docker CLI & Docker Compose in the Jenkins container.
- Adjust any necessary permissions for UID & GID (or run as sudo but that's probably unwise).
- Mount the Docker socket as a volume into the Jenkins container.
- Run `docker compose build` to build my test containers.
- Run `docker compose up` as a shell command at the beginning of the pipeline.
- Run my tests with Docker using shell commands.
- Run `docker compose build` to build my production containers.
- Push my production containers to the container repository.
- Push updates to server and restart the app.
- Run `docker compose down` as a shell command at the end of the pipeline.

I don't think I need any of the Docker plugins to accomplish this, but I might be wrong. Also, it's possible that this entire approach is wrong.

## Jenkins has no happy path

Jenkins is drowning in features and configuration. It's what makes Jenkins powerful, but it also makes it daunting. I've spent nearly a week trying to understand freestyle jobs vs pipelines, scripted pipelines vs declarative pipelines, how to connect my project to a private GitHub repo (which varies per project type). I still don't know what a multibranch pipeline is or a multi-configuration project. And all the ways to integrate with Docker are leaving my brain fried.

GitHub Actions is proof that you don't need more features to win over users. You might actually benefit from less features. I haven't used Circle CI or Travis CI, but I imagine that they also aren't as feature-heavy. Focusing on building the happy path and cutting what is unnecessary is putting your users first.

I'd probably be better off using one of these options instead of Jenkins, but learning a self-hosted CI that I can run locally is important to me.

I wouldn't be able to figure this out if I were working full-time right now. I would have to go with something easier to learn. That's a shame.

I'm getting close though. And I'm hoping that there will be some benefit to writing all of this down, though I'm not sure what that will be yet. Either way, here's to hoping!
