---
title: Instant reloading added to this site in development mode
slug: instant-reloading-added-to-this-site-in-development-mode
tags: rails, webpack
published: 2021-05-19
---

The DX problems I laid out in the last post became too painful to deal with when proofreading half a dozen posts, so I added some new features.

## I used the `listen` Gem to watch for file changes in the content folder

Now when I make a change to any of the markdown files while the server is running in development mode, Rails re-runs my import script. 

I did some research for Ruby-based file watchers for this feature and settled on `listen`, though it was really a shot in the dark. I was pumped that I got an error when I installed it because it was already a core Rails module. That seems trustworthy enough.

## Instant front-end reloading on content changes

It was cool that my content automatically regenerated on the front-end, but I still had to manually refresh the page to see my changes. I now have Chokidar running in the Webpack Dev Server watching for content changes and sending a message to the client to reload when changes occur.

This took me a while to figure out because the way Webpack Dev Server works with Rails isn't intuitive. Rails has a "stub" for Webpack Dev Server that you run alongside your server. When you run it, it tells you that Webpack Dev Server is running on port 3035, but when you navigate to that port you just get a broken page.

You need to have the Rails server running in one terminal, Webpack Dev Server running in another, then use the normal Rails server to see your changes instantly. I didn't feel like any of this made sense.

This implementation currently has a race condition that I'll have to deal with at some point, because the file watchers both kick off at once. Maybe I should have Chokidar watch the sqlite database file instead of the content directory.

## More proofreading finished

With the new instant reloading features, I'm proofreading much faster. I'm hoping to launch this site soon.

I'm discovering that my System76 laptop hurts my wrist to type on, though. It makes my future with this laptop uncertain: I've never had this problem with my Macbook Pro. And the new [Framework Laptop](https://frame.work/) sure looks tempting...

My wrist is hurting so that's my update for today. Until next time!