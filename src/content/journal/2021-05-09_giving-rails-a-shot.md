---
title: Giving Rails a shot
slug: giving-rails-a-shot
published: 2021-05-09
---

It's finally happening: I'm giving Rails a shot. I've wanted to try it for a long time, but I could never find a good project to try it on. Laravel is much more full-featured and I'm much more familiar with it, so on any important project it's going to be my first choice.

Yet here I am, building this blog in Rails.

## Why not WordPress?

A personal blog is the epitome of low-impact, meaning it's an ideal fit to try a new technology. I could use WordPress, but after building WordPress sites as my primary source of income for three years, I'm pretty burnt out on it. WordPress requires a lot of hand-holding and a lot of updates. It leaks enormous amounts of data, and it's not particularly secure. I also **strongly** dislike WordPress's architecture: it has loads of global state, uses inconsistent function names, and requires extensive graphical configuration for custom fields. Yikes.

I also want my posts to be in version control, and WordPress was built with the assumption of content in a database.

## Skipping static site generators

I've used static site generators in the past, and I like the idea of them. I've tried Gatsby, Next.js, Jigsaw, and Hugo. Gatsby and Next.js are both interesting, but both require more configuration than I'd prefer for creating a simple blog. Gatsby in particular makes you buy into far too many things: plugins, themes, GraphQL, slow builds, etc. It's far more tool than I need.

Hugo, on the other hand, is brilliant. It's nearly the perfect static site generator. It natively understands multiple content types, has a built-in theming engine based on template names, a theme repo where you can download free third-party themes, etc. Hugo has built-in asset compiling. What I particularly appreciate about Hugo is its page bundles: the ability to collocate a page's content with its images and other assets. All of this puts Hugo a mile ahead of the other static site generators I've tried.

Unfortunately, Hugo templates are extremely foreign to me. When I run into minor issues, debugging them can easily eat up a whole day. PHP and React have spoiled me with the full power of a programming language that I understand within my templates. I don't know Go or Go Templates. This was a deal-breaker for me.

It's also worth noting that the JAMstack solves problems I don't have. My blog won't have so much traffic that pre-rendered pages would make a noticeable impact on speed. The security promises of the JAMstack are also questionable: if an API that your site connects to is insecure, then your site is still insecure. Hosting static sites is pretty simple, though.

## Deciding on Rails

I wanted a blog that was simple, stored my content in plain text, had a story for compiling assets baked in, and was flexible enough to let me change anything I wanted. I don't know of any off-the-shelf platforms that fit this bill, and I've wanted to learn Rails for a long time.

So here I am, building this blog with Rails. I'm currently keeping the posts as markdown files within version control, and I run a Rake command to bulk import them into an SQLite database. It's a wonky setup, but I have a working (albeit minimal) blog.

## Rails first impressions

Rails is striking for a lot of reasons. One of the biggest is the thing that Rails is most famous for: there's an aggressively small amount of boiler plate. In some cases, I really like it: not having to specify the paths to my views is wonderful. It just works. 

Other things I'm more skeptical of. I don't need to import any of my classes: they all seem to be global. It's nice to not have to type `import` statements, but I do wonder if that will become a problem in bigger apps.

The other thing that strikes me is how small the surface area of Rails is compared to Laravel or Django. Rails gives you a great way to handle your models, views and controllers, and it has a few extra features like asset bundling, jobs and WebSockets. Auth isn't a part of the framework. From what I understand (which isn't much), [Devise](https://github.com/heartcombo/devise) is largely the community-accepted solution to auth, but having to research auth packages when you're new to an ecosystem is less than ideal. The Rails docs suggest you use a package like Devise or Authlogic for authentication, but Devise's docs suggest that if you're new to Rails you should roll your own (_as security researchers everywhere scream inside_). The free [Go Rails beginner tutorial](https://gorails.com/start) shows you how to roll your own auth. I'm exceptionally grateful that auth comes out-of-the-box with Laravel and Django.

One of the other things I'm enjoying about Rails is Ruby itself. Ruby is a beautiful language. I also understand that Ruby version 3 has some TypeScript-like features. I find that exciting, though I don't know if those features integrate cleanly with Rails.

## Thoughts on choosing Rails in 2021

I'm going to use this site as a playground for me to learn Ruby, Rails and the ecosystem surrounding those technologies. Though I'm excited to dig in, the timing of learning these is unfortunate given [the recent Basecamp blow up](https://www.platformer.news/p/-how-basecamp-blew-up). 

I'm hoping, though not optimistic, that Jason and David will rethink their policies. For some people, the very act of existing is political. Banning political discussion is banning the ability for employees to protect themselves and consumers. The ban itself is a strong political statement: it is an endorsement of the current inequities and injustices in the world. It takes away the ability to discuss or change those injustices in settings that matter. DHH knows that politics at work matters: [he was actively rooting for Amazon's employees to unionize](https://twitter.com/dhh/status/1376544493009301513). He has long criticized the privacy violations of companies like Google. Should Google's engineers be permitted to voice ethical concerns about the methods they use to collect data, or is that too political?

If there was any question about if banning political discussions at work was a political statement, just look at the reactions of those celebrating this as a win against "woke-ism" and "snowflakes." David and Jason's actions inspired mobs of the worst people on the Internet to harass the employees who quit, with the mobs making it known to former employees that their fight for inclusion & equity wasn't welcome at Basecamp, in America, or anywhere in the world. If I were David or Jason, I'm not sure I would be able to forgive myself for actively inviting that level of ridicule and harassment towards people who helped build my company for more than a decade.

Because of the Basecamp blowup, the future of Rails seems unclear. However, the Rails community is more than Basecamp, and the community has long-held a reputation for being open, inviting and inclusive. I'm hoping that the Rails community finds a way to pull together, keep the framework going, and retain the inclusiveness that it is so well known for. If not, I can move this blog to a different platform and nothing of value will be lost.