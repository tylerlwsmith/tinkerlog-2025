---
title: "Replaced Tinkerlog's Rails backend with Astro"
slug: replaced-tinkerlogs-rails-backend-with-astro
tags:
published: 2024-12-24
---

I migrated the Tinkerlog site from Rails to Astro. I have been paying $5 a month to host the old Rails version of this site, and it's effectively sat abandoned for over 3 years. I can host this new Astro site on Cloudflare for free.

Tinkerlog was my first Rails project, and I built it during a time when I was very excited about learning how to manage servers. While I still believe that knowing how to manage servers is a very useful skill, I don't enjoy the maintenance burden. I enjoy paying for servers even less. It adds up when you look at how many projects I have! I'll often even stop myself from new building projects because I don't want to pay for a server or manage a database. As a result, most of my personal projects are static sites on Netlify that don't actually _do_ anything.

No more. The Astro + Cloudflare Workers + D1 database combo has provided me the tools I need to host most of my small projects for free and without managing servers. I'm not a serverless Zealot: I'll still reach for something like Laravel when I want to build an app that does something interesting. But starting this month, I'm going to begin migrating sites to this stack and shutting down projects on Flywheel, Digital Ocean, WordPress.com, and Netlify.

I can't say for sure that this site will get more new posts following its recent migration to Astro. But what I _can_ say is that I'll ship more small projects in 2025 that require less tooling and less maintenance.
