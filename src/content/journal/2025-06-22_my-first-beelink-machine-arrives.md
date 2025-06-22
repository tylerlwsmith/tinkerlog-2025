---
title: "My first Beelink machine arrives"
slug: my-first-beelink-machine-arrives
tags: homelab
published: 2025-06-22
---

My [Beelink EQR6 Mini PC AMD Ryzen 5 6600U](https://www.amazon.com/dp/B0BYJDFG5B) arrived today, along with some Enthernet cables and an unmanaged switch. My plan is to use the Beelink as a massively over-provisioned pfSense box while I look for something more sensible on Facebook Marketplace, then take advantage of its 24 gigs of RAM to be a versatile virtualization machine.

Last night while mindlessly watching YouTube I discovered that this box may be _slightly_ less versatile than I had hoped: it turns out that AMD's video encoding is pretty far behind Intel, which is beloved for its built-in "Quick Sync" video encoding and decoding capability on most of its consumer level processors. So far this is two misses in my home lab for video encoding: my ThinkStation Intel Xeon doesn't support Quick Sync either because its a server targeted at a small business that probably wouldn't need video encoding. Thankfully I don't currently need video encoding either, but it would sure be nice to have that capability if I ever did need it. I'll try to purchase mostly Intel gear moving forward.

I also learned in [a Hardware Haven Video](https://www.youtube.com/watch?v=PisIPpbMkTc) that the Intel N100 processor line _does_ have Quick Sync, supports virtualization, and uses about that the same amount of power as a Raspberry Pi all while having an x86 architecture. And N100 machines (and there are _many_ to chose from) even come with cases! The only downside seem to be that the processor seems to only support one stick of RAM, but that single stick can be 16 gigs, which is a lot more than you can get from a PI. Unless you need GPIO pins or just have an armada of old Raspberry Pis like I do, there's not a ton of reasons to pick the Raspberry Pi platform for new home lab projects in 2025.

Today I also received a cheap TP-Link 4-port unmanaged switch. Despite its sub $20 price, it comes in metal enclosure and feels pretty nice. I've heard some YouTubers talk about the cheap N100 machines feeling cheap because of the plastic enclosures, and it always made me roll my eyes a bit. When I hold the router in one and and my Beelink in the other, I kind of get it. That said, I bought Beelink because they have a reputation for beeing (lol) the best of the inexpensive mini computers, especially in the N100 category.

Armed with my new pfSense box and switch, I plan to create an isolated network for the Minix Z83-4 Max computers I got a few days ago, test the Windows performance on YouTube, grab the license keys, install Xubuntu on one of them to get a sense of how it might perform as a kiosk. The earliest I might get a chance to do that is Wednesday, and I've got more gear coming in the meantime.
