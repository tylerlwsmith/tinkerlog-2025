---
title: "Homelab parts finally ordered in 2025"
slug: homelab-parts-finally-ordered-in-2025
tags: homelab
published: 2025-06-20
---

I've wanted to build some kind of a home lab since I started listening to [The Self-Hosted Podcast](https://selfhosted.show/) back in 2019. Unfortunately, building a home lab is expensive, and I could always find a good reason to not spend the money. Thankfully my month-to-month spending has decreased substantially over the past year, so it seemed like as good of a time as any to finally pull the trigger–even if I'm too busy to build the lab out at the moment. Home lab gear has a slightly longer shelf life than consumer gear, with many home labbers happily running 10-year-old gear in their stack with no plans to upgrade.

So on top of the Lenovo ThinkSystem ST250 that I talked about buying in my last post... I bought another Lenovo ThinkSystem ST250 off of ebay 🙃 After learning about the state of storage in 2025, I decided that the eight 2.5 inch drive bays will be good for experimenting with ZFS storage pools and RAID stuff, but 3.5 inch spinning rust discs is where the real capacity wins are realized. The computer I bought had another slot for a storage backplate, so I purchased a used ThinkSystem with the backplate for 2.5 inch drives so I can rip it out and use both. This could also solve the CPU cooler problem if the problem is indeed a problem with the fan header on the motherboard, I could instead move the 2.5 in backplate into the ebay machine.

After chatting with ChatGPT extensively about what I wanted out of my home network, I ordered a UniFi switch and access point, then I ordered a massively over provisioned Beelink EQR6 to run pfSense. Many folks on the forums were recommending some cheap fanless hardware appliances from AliExpress, but after creating and account and attempting to buy hardware on there for the first time today, my account was immediately flagged and locked from making purchases. I opened an appeal, but today Amazon got my money instead. Regardless, my thought is that I can use the Beelink as a router for now, and if I find a cheap appliance on Marketplace then I can use the Beelink for virtualization.

I still need to buy drives, drive caddys, and fans for my new Lenovo server(s), but for now that can wait. I'm going to start with openmediavault on an old Pi with SSD storage once I have my isolated lab network set up, then build my Lenovo ThinkSystem to be an ephemeral environment while I learn the ins-and-outs of TrueNAS Scale and ZFS. My immediate goal is to get all of my product manuals, Linux ISOs and WordPress plugins moved over to my openmediavault NAS, and eventually they'll find their way to TrueNAS.

After that I'll boot up my ThinkStation Mini running Proxmox and host... something? I know at the very least I want one of those service listing pages that I've seen folks like Techno Tim running.

Finally, today I was able to pick up a couple of Minix Z83-4 Max computers off of Facebook marketplace for free. I flashed Xubuntu to a USB to play with the live boot environment, but I could only load it in safe graphics mode. After I get my home network set up, I'm going to grab the Windows licenses off of both of them and then try to do a full Linux install to see if it'll work with proprietary drivers installed. My hope is that video playback on these is significantly better than my Pi 4. In safe graphics mode, it was pretty comparable. I did not attempt to load YouTube in the preinstalled Windows since I don't want a free computer touching my network. I may try that after I set up my router & switch so I can give it an isolated VLAN.

---

As an aside, using a markdown files as the backend for this website sucks. Verion control with flat files is such a nice experience, but you can't meaningfully sort or search. Keeping the slug and title synced up is manual and painful. You need to make your tag names line up perfectly on each post or the whole thing kind of falls over. 

I don't want to build a theme and I don't want to host a blog. I don't want to pay to host a blog. I'll managed apps in my home network where it doesn't matter if things fall over: I don't want to do it on the open web.

I stopped using this blog years ago because publishing, deploying, maintaining the site was painful. I may spend a bit of time seeing if there's a decent & simple serverless CMS in the wild, and if not I'll take 2 or 3 days and knock out the world's simplest CMS using Remix + Cloudflare.
