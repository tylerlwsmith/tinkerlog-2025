---
title: "What is going on with the Jenkins UI?"
slug: what-is-going-on-with-the-jenkins-ui
tags: jenkins, docker
published: 2021-07-22
---

After [spending days getting Jenkins to work with Docker](https://tinkerlog.dev/journal/docker-docker-in-docker-and-disappointment), I completely disregarded the Jenkins user guide and loaded it in a container using a compose file.

Right now it's minimal. It doesn't have a way of communicating with the host Docker. Nothing is set up. It just... loads. I've spent the day reading about pipelines and clicking around the UI.

## The Jenkins admin

Perhaps more than any web app that I've recently used, Jenkins feels like it was designed by a committee.

Actions such as "Build Now" and "Delete Pipeline" are interspersed in the sidebar with links to other pages such as "Configure." Typically in web UIs, actions that cause side effects would be represented as buttons instead of standard links, but not in Jenkins. In Jenkins, clicking regular-looking menu items can cause side effects.

Each type of build has a cryptic icon representing its status (or "weather," as Jenkins calls it 🤔). Rather than telling you what these icons represent as a tooltip when you hover over them, you have to click the link for "legend," which takes you to a completely separate page to explain the meanings of all 17 icons. At this point, you've completely lost context.

Seemingly non-critical features clutter the user interface. You can configure the icon size for your build types. Every page seems to have a link for its atom feed, though no links for the REST APIs. Are these really necessary?

And though it's not here-nor-there: almost all of the sidebar icons are pixelated. Except for the question mark icon for "Pipeline Syntax," which actually makes the pixelated icons look even worse by comparison.

Jenkins seems to have tried to solve these problems with an escape hatch: its Blue Ocean plugin that gives Jenkins a much more "modern" UI. Jenkins seems to actively be pushing its users towards this plugin. I can't help but feel that the reason this new UI is in a plugin instead of core is because there are conflicting interests within the project that prevented its functionality and UI from moving into core. So design continues by committee.

Granted, I know almost nothing about Jenkins or its community, so I could be _way_ off base.

## Shhh, do me a favor!

If you're reading this and feel compelled to share with the Jenkins community, maybe don't? Tinker log is a journal for me to write down what I'm working on and thinking about, and I'm sure that the Jenkins maintainers have enough to worry about without my criticisms. They're doing Gods work by making this software for free, and I appreciate them for it.

My hope is that by writing down my first experiences with Jenkins, I can reference this document in the future to help me remember what I struggled with and teach others how to use Jenkins more effectively. It's hard for me to teach things I know well because I often forget what it was like when I was new.
