---
title: "First CI Pipeline: Complete"
slug: first-ci-pipeline-complete
tags:
published: 2021-08-05
---

Calling my pipeline "complete" might actually be a bit of a stretch, but my first CI pipeline with Jenkins is working. I did some hacky stuff to get there, but it runs.

The pipeline checks out the code, builds the images, creates a folder for test results, runs `docker-compose up -d`, runs tests (these are just stubs), pushes the built images to Docker Hub, then runs a clean-up.

I'm really proud of myself. And exhausted. Diving in on Jenkins/Docker/CI Basics/Django/Tailwind.css all within a month took a lot of work. I don't think I could have done it if I was working full time. I know other people could, but I'm not them.

I think CI/CD, testing and containerization have the potential to alleviate my biggest pain points as a developer. [I tweeted about it earlier](https://twitter.com/tylerlwsmith/status/1423490526754447362). My transition towards these techniques reminds me of when I was haphazardly naming CSS classes then discovered BEM. BEM didn't solve all of my problems, but it sure solved a lot of them and made my work more predictable.

It also feels like a big step towards growing up as a developer. It's like the first time going to a restaurant with my parents as a kid and ordering a steak instead of a burger off the kids menu. That was in no way the moment I became an adult. I don't even remember that moment. But that was a moment where I started doing an adult thing.

CI/CD, testing and containerization is an adult thing. I'm coming up on five years in the industry and I'm starting to feel like someday I might actually feel like I know what I'm doing.
