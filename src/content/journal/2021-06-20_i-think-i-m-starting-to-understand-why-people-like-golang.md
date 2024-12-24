---
title: "I think I'm starting to understand why people like Go"
slug: i-think-i-m-starting-to-understand-why-people-like-golang
tags:
published: 2021-06-20
---

I've spent the weekend engaged in my favorite hobby: rebuilding and over-engineering [SacMusic.com](https://sacmusic.com).

I tried to rearchitect SacMusic as a full-stack JS app with an Express API server late last year. After that, I put the app, Redis and Postgres in containers. While it technically _worked_, the whole thing got so unwieldy that [I seriously questioned the value of using JavaScript on the server](https://dev.to/raspberrytyler/reflecting-on-a-year-with-node-js-and-why-i-should-have-stuck-with-laravel-e5a). Most days, I also question the value of using much JavaScript on the client. I could probably retain 90% of SacMusic's user experience with 30% of the work by migrating the site to Laravel and using Turbo for page transitions.

So _naturally_ I didn't do that.

Instead, I finished rebuilding SacMusic's API layer in Django yesterday. Now I'm in the process of trying to containerize the application. Each app on Docker Hub works _slightly_ differently, and you have to learn their idiosyncrasies. Many applications present you with images for Alpine builds, Buster builds and more. Once you pick an image, you need to figure out how to get your dependencies in the container, what volumes to mount, what ports to expose etc. Truthfully, all of this complexity is difficult to justify from an engineering perspective when I could have just used Laravel and been done with it. However, being faced with all of this complexity did get me thinking:

What if I didn't have to do any of this?

## Go's super power: a single binary

[I recently wrote a post about not understanding when I'd use Golang](trying-to-understand-when-id-use-golang). Now I see how Go could eliminate an enormous amount of deployment complexity.

Go compiles to a single binary. It's runtime and dependencies get included in the binary, which means it doesn't need to be overly concerned with the state of the machine that it runs on as long as it's compiled for the right OS and CPU architecture. Rather than sacrificing a gigabyte of disk space to install a language interpreter and your application's dependencies on the server, you can instead upload a single 5-megabyte executable.

Being a compiled language doesn't mean that Go solves every problem: if we wanted to coordinate multiple services with Docker the way that SacMusic does, there will still be added complexity. But Go's executables afford an interesting capability: you can run a Go application in a container without a base image. Because the application dependencies are compiled into source, Go apps don't need anything else from the operating system's userspace: they can talk to the kernel directly. Yet running a Go application with Docker still provides the benefits of isolating the process from the host machine by shoving it in its own cgroup. For simple APIs, a Python/Flask image will likely be 100x larger than its Go counterpart, and the Python API will be much slower. Orchestrating multiple applications with Docker Compose may still be daunting, but configuring the Golang pieces theoretically may be simpler.

## I may have a use case for Go

Go's lightweight and high-performance characteristics make it seem like it could be a great fit for running small services on Raspberry Pis. Pis have inexpensive processors, and installing dependencies on Pis is painfully slow because of the limited I/O of the SD card. Golang's concurrency allows it to be fast on inexpensive processors, and a Go app can be install quickly because it's a small single-file binary.

While I don't see Go as a reasonable replacement for batteries-included frameworks like Django, Laravel or Rails, it could talk to one of these frameworks over REST or gRPC.

The deciding factor for if Go is a compelling option for Raspberry Pi development will be if it has support for the Pi's GPIO and hardware like the Pi Camera Module. Pis by themselves are great, but what makes them most exciting is their ability to make hardware do interesting things. I'll be excited if I can do that work with Go.
