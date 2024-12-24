---
title: "Diving into the source"
slug: diving-into-the-source
tags:
published: 2021-06-24
---

One of the ways that I've changed as a programmer over the past three years has been my increased willingness to dive into third-party source code when I get stuck. This change was partially driven by my increased comfort as a developer. Not understanding someone else's code no longer sends me into a dangerous spiral of imposter syndrome. But I don't think that's the only reason I've gotten more comfortable with source diving.

One contributing factor is better tooling. I started coding on Sublime Text. Sublime has a special place in my heart. It's lightening-fast. It's minimal and stays out of your way. As I've switched to other code editors like Atom and VS code, I've always looked for a Monokai theme that would make me feel at home. Unfortunately, Sublimes speed and minimalism comes at the expense of power.

Like Sublime, VS Code is a text editor. Except it is _far_ more extendable. Using the VS Code extension repository, you can quickly hack together IDE-like experiences in JavaScript, PHP, Python, Ruby, etc. The amount of language-awareness that VS Code has through its extensions makes it extremely inexpensive to source-dive, even when the dependencies aren't colocated with the project like is often the case with Python and Ruby.

Another thing that helped me gain comfort with source diving was getting away from WordPress. WordPress's design makes it somewhat impractical to keep the whole project open at once. If you're working on a theme, you'd need to have three parent directories open in your editor to have the application's source loaded side-by-side with your project. It's bad DX. And even when you do source-dive on WordPress, what you find often isn't pretty. Maintaining 15+ years of compatability comes at a cost.

Better tooling has empowered me to feel comfortable source-diving. VS Code is powerful enough to make source-diving quick and inexpensive. Frameworks like Laravel, Django and Rails make it more practical to view the underlying packages, and the underlying packages are far more readible than WordPress's source.

WordPress drives an incredible amount of business value. It's unfortunate that it comes at the expense of good development practices. Countless developers like myself enter the industry through WordPress, then we have to spend years unlearning bad practices. The world deserves better than WordPress.
