---
title: "Christmas came early: my new home server"
slug: christmas-came-early-my-new-home-server
tags: homelab, nas
published: 2024-12-24
---

I got the following items today:

- A treadmill
- A bedframe for my guest bedroom
- All 7 seaons of Parks and Rec on DVD
- A Lenovo ThinkSystem ST250

I've recently become interested in home lab YouTube and self hosting again. This time it isn't philosphical because I believe in software ownership or local first. Nope: home lab YouTube is just my little santuary in tech where the conversation hasn't been overrun with AI hype and AI doom 24/7. As a matter of fact, I've even realized that self hosting is pretty antithetical to my ethos of "keep it simple" that I have in most other places in my life. When I played in a band, I didn't use effect pedals because it was just another problem. I write monolithic software to keep away from the problems of distributed systems. Home labs can become sprawling distributed systems.

My current home network is just the ISP-provided router and the devices connected to it. In a home lab version of that network, I could replace that single device with a modem, router, managed switch, and access point. That's four pieces of equipment that must be always on or the network falls over. Debugging that could be complicated. And if I set up my firewalls rules wrong on my router my whole home network is vulnerable. This is the opposite of "keep it simple," but these folks barely talk about AI so I'm happy to deal with it for now.

## Starting with storage

I've decided that I want to start my home lab with file sharing via a network attached storage device, or a NAS. I've heard good things about Synology, but listening to the 2.5 Admins podcast for years made me want to get hands on with something open source, preferably also using ZFS. 

I saw a listing on Facebook Marketplace for Lenovo ThinkSystem ST250 enterprise server with 8 2.5 inch drive bays on the front and 5 600gb HHDs pre-installed selling for $300, that seemed like a slam dunk. I spent a couple of days learning about different NAS appliances, network protocols, the state of drives, etc. Here are some of the things I learned:

1. TrueNAS is a ZFS based NAS OS. Don't use it if you don't want to use ZFS.
2. Synology and UGREEN are pretty locked down.
3. In 2025, you can buy 16 TB 3.5 inch HHDs for like $250.
4. You probably don't want 2.5 inch HHDs with more than a couple TB of storage because drive makers use SMR.
5. Noctua makes the best fans.
6. NAS operating systems like TrueNAS and openmediavault support many protocols for file sharing such as SMB, NTS, FTP, SFTP, HTTP(S)–all of which can be set up via the UI.
7. While some of these protocols restrict file access, many of them send the files in plain text over the network.
8. Encrypting transfer over some protocols requires use of something like Kerberos, which is yet another piece of the distributed home lab system.
9. Enterprise grade servers take a long time to boot up. Like over 5 minutes before you can get to the BIOS because it's doing system checks, intializing RAID, and doing lots of other stuff I don't understand.
10. Motherboards have 3 or 4 pin connects for fans. Often times the connector is designed so a 4 pin can still connect to a 3 pin. The 4th pin controls fan speed.
11. For some reason, the CPU fan + heatsink combo is called a "CPU" cooler instead of a fan + heatsink.
12. Enterprise server fans are LOUD.
13. RealTek ethernet drivers apparently suck.
14. Alpine Linux is _not_ GNU Linux.

This is probably only a fraction of what I learned over the past few days. I've been refamiliarizing myself with computer hardware: I haven't spent time inside the guts of a computer since I built my Linux machine in 2008 after my Windows machine died. I didn't have the money to replace it, so I made a franken computer from old parts. PCIe stuff is totally foreign to me. Same with network speeds. And apparently some Intel chips come with integrated graphics that are good enough for media transcoding?

Part of me figured if I was going to do a home lab, I should research and buy the perfect gear upfront. I make enough money that I can afford it. But I won't because I don't like spending lots of money (though you wouldn't be able to tell from the sheer number of things that arrived today). But working in less-than-perfect conditions is how you discover system limitations and strategies to mitigate them.

And as luck would have it, the Lenovo ThinkSystem ST250 was less-than-perfect. It's CPU fan doesn't run. The seller and I couldn't find anything in the BIOS that would control the fan speed, and I didn't have a working test fan handy. The seller was kind enough to knock the price down from $300 to $200 because of this. I may be able to fix the problem with a $20 CPU cooler. Alternatively, the fan headers on the motherboard could be fried and I'd need to replace a bunch of different parts of the box. At the very least I plan to replace the large fan in the back because my goodness that thing is loud.

I don't have much free time these days, but if I can't get TrueNAS up-and-running in the next month then I'll install openmediavault on a Raspberry Pi to start playing around. If nothing else, it will be a pleasant reprieve from the endless conversations about AI happening in the programming space.

## Retrospection

I started this blog in 2021 when I was very excited about self hosting, so I thought it might be a good place to post about my adventures in home labbing. My opinions on self hosting have changed considerably since I started this blog; I shut down my Digital Ocean Rails droplet it was hosted on and moved it to a serverless platform. But I'll learn a bunch of cool stuff along the way.
