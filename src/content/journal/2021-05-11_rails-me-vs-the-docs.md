---
title: "Rails: Me vs the docs"
slug: rails-me-vs-the-docs
tags: Ruby on Rails, React.js, Open Source
published: 2021-05-11
---
Year-after-year, you see the same posts on Reddit: "Is Rails finally dead??"

And even with [Basecamp's recent implosion](https://www.platformer.news/p/-how-basecamp-blew-up), it seems unlikely that Rails is going anywhere. Its productivity benefits are unparalleled for those who are deeply familiar with the framework.

For those who aren't familiar, it may be a different story. A new user entering the Rails guides sees so many red elements on the page they might believe that they've stumbled onto an error page. Navigating between the guide pages is a difficult task: while modern projects like React and Laravel have Algolia for real-time full-text search, the Rails guide pages don't have a search of any kind. If you're looking for specific keywords, your best bet is Google.

The topics pages themselves are hidden behind a dropdown menu instead of being readily visible on a sidebar or sticky navigation. The pages seem to go for miles, with no easy way to scroll back to the top to navigate between topics.

The documentation content is top-notch, but the technology that powers these pages is lacking. The design looks old. Navigating back to the top where I can flip between topics is painful.

Any one of these issues by itself is fine. Together, they start to present a UX barrier to entry. They raise the cost of adoption by forcing a would-be Rails user to deal with a thousand papercuts while learning the framework. Why learn Rails when you already know Laravel, which has easy-to-navigate docs that are quickly searchable? Laravel even has a short guide on how to deploy an app, why isn't it in Ruby's docs? A new Rails user is left to ponder rbenv vs RVM, Puma vs passenger, and what on Earth is Capistrano?

Rails is not dying. But Rails isn't growing either. And that's a shame, because Rails is a joy to build with, and it seems extremely productive. But are the docs enabling new users to become productive quickly? I'd argue no.

So what do we do? Presumably, I could be a part of the solution: I believe the Rails docs site is open source and anyone can contribute. The Rails core team is busy doing other important work. Really if this bothers me, I should try to fix it.

I'm still learning Rails and fighting through the docs. But if this is a technology that I stay involved with, this may be something worth tackling. 