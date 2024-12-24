---
title: "XML in Rails and funny ternary operators in Ruby"
slug: xml-in-rails-and-funny-ternary-operators-in-ruby
published: 2021-05-26
---

Today I decided that what this site really needed was a sitemap. That'll solve all of my problems. Or none of them. Either way it's what I decided to work on.

I started looking around for an elegant way to handle this in Rails.

## XML in Rails

I had fully expected that I would have to use an `.erb` template and type all of my XML by hand. That would have been fine. I've done that before with other tools in the past. But this is Rails, and this framework is full of mysteries and surprises.

Rails controller actions have an optional `respond_to` block, and you can set response types on there. I've used it to magically convert my posts to JSON by adding .json to the end of the post's url, just for the novelty of the feature.

Controllers can also respond to XML.

```ruby
respond_to do |format|
  format.xml
end
```

Like magic, this gives me an XML response. But what was surprising was the `.xml.builder` files that Rails provides. Rails seems to use some domain specific language for turning Ruby blocks into XML files. [I found a Gist that showed me how to use this to generate a sitemap](https://gist.github.com/maxivak/5f24052e49f0974dac9d).

Rails can take something like this block below:

```rb
entries.each do |entry|
  xml.url do
    xml.loc base_url + journal_entry_path(entry.slug)
  end
end
```

And use it to generate this:

```xml
<url>
  <loc>https://tinkerlog.dev/journal/this-site-is-on-a-server</loc>
</url>
<url>
  <loc>https://tinkerlog.dev/journal/tax-day-2021</loc>
</url>
<url>
  <loc>https://tinkerlog.dev/journal/finally-loading-content-into-the-sites-repo</loc>
</url>
```

Like most things in Rails, I'm not quite sure what this is doing under the hood. However, I understood very little of what Laravel did under the hood when I first started using it. Now, I understand _some_ of it, so that's a substantial improvement!

I suppose this Rails DSL is nice: XML is fairly verbose, and it's easy to create malformed XML when generating it by hand.

## Funny ternary operators in Ruby

I needed to provide my posts a base URL for the sitemap to work. I used `"#{request.protocol}#{request.host_with_port}"` to generate a base URL on my local machine, and when everything worked I pushed the code to production. But when I added my spiffy new sitemap to Google Search Console, it told me my URLs were all invalid.

I took a look at my `sitemap.xml` file on the like site.

```xml
<url>
  <loc>http://localhost:3000/journal/this-site-is-on-a-server</loc>
</url>
<url>
  <loc>http://localhost:3000/journal/tax-day-2021</loc>
</url>
<url>
  <loc>http://localhost:3000/journal/finally-loading-content-into-the-sites-repo</loc>
</url>
```

Crap. I have this site behind a reverse proxy so it's having an identity crisis.

I decided to set an environment variable that I'd only fill out on the production site to store the site's base URL. I reached for the ternary operators that power all of my React.js code and tried the following:

```rb
@base_url = ! ENV.fetch('RAILS_BASE_URL').empty?
  ?  ENV.fetch('RAILS_BASE_URL')
  : "#{request.protocol}#{request.host_with_port}"
```

Ruby didn't like that very much. It threw an error to make sure I knew it was angry at me.

The question mark needed to be on the same line as the condition. So I tried something goofier:

```rb
@base_url = ! ENV.fetch('RAILS_BASE_URL').empty? ?
  ENV.fetch('RAILS_BASE_URL') :
  "#{request.protocol}#{request.host_with_port}"
```

Ruby stopped throwing an error, but I hated everything about this. That's really hard for me to understand at a glance. It's not there yet...

After stumbling onto [RuboCop's ternary operator documentation](https://www.rubydoc.info/gems/rubocop/RuboCop/Cop/Style/MultilineTernaryOperator), I came up with the following:

```rb
@base_url = unless ENV.fetch('RAILS_BASE_URL').empty?
  ENV.fetch('RAILS_BASE_URL')
else
  "#{request.protocol}#{request.host_with_port}"
end
```

The JavaScript/PHP programmer inside me is repulsed by this code, but it does intuitively feel a little right. It's a lot more clear than the symbolic nonsense of the C-based ternary operator.

The `unless` statement instead of the bang is a nice Ruby-esque touch, too. Maybe COBOL was right and our code should read like a spoken real-world language. Who knows.
