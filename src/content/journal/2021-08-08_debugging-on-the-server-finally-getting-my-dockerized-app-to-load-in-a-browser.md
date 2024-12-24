---
title: "Debugging on the server: finally getting my Dockerized app to load in a browser"
slug: debugging-on-the-server-finally-getting-my-dockerized-app-to-load-in-a-browser
tags:
published: 2021-08-08
---

Yesterday I left off with my front-end and back-end apps restarting every few seconds on the server. Today I kicked off by debugging those containers. The logs were saying that some of the project files didn't exist.

## Booting and staying booted

The problem with debugging containers that won't boot is that you can't use `docker exec -it container_name /bin/bash` to run a shell inside of them because `docker exec` needs the container to already be running. Thankfully,
Suprit Shah did a great write-up on Medium about [debugging Docker containers that won’t start](https://medium.com/@supritshah1289/debugging-docker-container-that-wont-start-af429adbb568). You can add an `--entrypoint` flag to `docker run` to change the process it runs when it starts.

That ends up looking like this:

```sh
docker run -it --rm --entrypoint /bin/bash my-app:latest
```

I took a look inside of my containers, and the files that the logs were saying didn't exist most definitely _did_ exist. The problem hit me instantly: I had the project files mounted as volumes in my Compose file, but the project files don't exist anywhere on the server. So now I needed to deal with seperate Docker Compose settings for the server.

The [official "Use Compose in production" documentation](https://docs.docker.com/compose/production/#modify-your-compose-file-for-production) recommends stacking your compose files, having a production file that overrides specific settings for the base file:

```sh
docker-compose -f docker-compose.yml -f production.yml up -d
```

This felt dirty, and I've been on the fence about it since I first read the docs. And just this morning I listened to an [episode of Go Time](https://changelog.com/gotime/191) where the most popular "unpopular opinion" on the show of all time was that "inheritence is the biggest source of complexity in configuration languages."

After that, I started relistening to the [Go Time design philosophy episode](https://changelog.com/gotime/172) where the guest's main philosophy was that "we don't make things easy to do, we make things easy to understand." Stacking Compose files creates inheritence that makes the configuration harder to understand. With these&ndash;and the fact you can't remove volumes from a compose file up the inheritence chain&ndash;I decided to create a separate `docker-compose.prod.yml` that didn't contain the volumes. I pushed the code, and the containers stayed up without restarting.

## Migrations

Now that the containers were booted, I did a `curl` request to the Next.js front-end. It returned an error page. I checked the Next app's logs, and saw the markup for a massive Django error page.

After visually parsing the error, I realized I hadn't run the migrations, run my fixtures, or seeded the project with data from the live site. Oops. I felt fairly foolish.

I opened a bash shell in the Django container and ran the commands to get all of the data loaded. I then exited the container, ran `curl localhost:3000` and saw the homepage's markup. Success.

I'm wondering if I should make future Django migrations a Jenkins freestyle job so I can do it through the UI? 🤔

## Fixing nginx

Next I ran `curl localhost:8080`. Default nginx page. Damn. More debugging.

It turns out I had never copied my template files into the container: I had just mounted them using a local volume during development. I updated the Dockerfile, pushed my changes, then ran `curl localhost:8080`. I saw the homepage markup in my terminal. Sweet.

Then came the moment of truth: could I view the site in a browser? I logged into DigitalOcean, configured the firewall to allow inbound traffic on port 8080, and checked my browser.

And there it was: the site I've spent the past month of my life on, deployed to the server through a pipeline, and served to my browser.

## Next steps

For the first time in this project, I feel like I have a pretty good sense of what all of my next steps are. First and foremost: I need to optimize my containers for production. On the front-end specifically, I need to use a multi-stage container to ensure that the production image isn't running Next.js in development mode.

My hope is that with optimized containers, Docker will be able to bring up the services a bit faster. Even with the restart loops fixed, it's still taking the pipeline over a minute for `docker compose up -d` to bring up the application. That's longer than I'd like, especially if I'm pushing changes multiple times a day.

Here are the final steps between me and switching this new site to the main domain:

1. Optimize containers for production
1. Fix the broken CSS in Django admin (nginx container issue)
1. Add an out-of-date disclaimer to the top of the header
1. Manually update the venue addresses in the Django admin
1. Configure nginx on the host to proxy to the nginx container
1. Re-block port 8080 at the firewall
1. Update the DNS to point to the new site
1. Install certbot and generate certificates

The first step is the only step with unknowns: I've done all of the rest of these before in the past.

There may be one or two other things that come up along the way, but I can finally say with confidence: I'm really close. And I'm excited.
