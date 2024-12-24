---
title: Trying to understand when I'd use Golang
slug: trying-to-understand-when-id-use-golang
published: 2021-05-24
---

I've been perplexed. Every time I look at Golang, I ask the same question:

**Why?**

Why would I ever need this? I often hear people ask if they should learn Go or Rust, then someone inevitably comes along and explains that "Rust is a memory safe replacement for C, whereas Go replaces server-side languages like Python, Ruby and PHP."

That's all well and good, but Python, Ruby and PHP all have killer application frameworks and libraries. PHP has WordPress. Python has Django, Pandas, NumPy and TensorFlow. Ruby has Rails. Go has over a half-dozen web frameworks, an incomplete story on dependency management, and no immediately obvious story on how to architect a full-featured application.

With Docker and Kubernetes both powered by Go, it has clearly proven itself as a capable, high-performance language. But it's hard to figure out when I'd want to use Go: traditional monolithic frameworks may not be as fast, but they offer incredible developer productivity. You can get pretty far with these older batteries-included frameworks if you pair them with good caching and load-balancing.

## Maybe Go is about services?

Despite the fact that I use a traditional full-stack framework at my day job, there are places that we delegate to third-party services. We use third-party APIs to match elected officials to residential addresses.

If we were to build our own legislator matching system, building it into the core of our applications feels questionable. It would create a lot of load on the server. Our applications also currently run MySQL, but for legislator matching we'd almost certainly want a PostgreSQL database running PostGIS. It would be better off as a microservice.

This is what Ruby on Rails creator [DHH might refer to as an Outpost](https://m.signalvnoise.com/the-majestic-monolith-can-become-the-citadel/): or a piece of functionality that is sufficiently different from the core application that it is an ideal candidate for extraction.

Go could be an ideal fit to build a legislator-matching Outpost. While the service would still be I/O bound, you could probably do just fine with caching before you needed any load balancing at all. And Go's standard library includes everything you need to set up a small RESTful API.

Go would probably pair well with JAMstack architecture too: you could pair a high-performance statically-rendered website with small high-performance services that offered the same scaling characteristics.

## I still have no use for Golang

It's nice to know when a language might be the right tool for the job. Go doesn't look like the right tool for any job that I currently have.

When I use Cloudflare, I typically get a 95%+ cache rate. I'm also not building anything that is Internet scale. Go solves problems I don't have.

But maybe it'll be the right tool for me some day.
