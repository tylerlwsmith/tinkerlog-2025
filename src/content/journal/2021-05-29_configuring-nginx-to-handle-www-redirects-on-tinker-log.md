---
title: "Configuring nginx to handle www redirects on Tinker Log"
slug: configuring-nginx-to-handle-www-redirects-on-tinker-log
tags:
published: 2021-05-29
---

Messing with nginx configuration always gives me a hint of anxiety. The config file _looks_ like a C-based language. It has curly braces and semicolons. It has `if` statements.

But nginx config files aren't C-based. Properties aren't assigned by equal signs: they're assigned by putting the property name followed by the value you want to set. There are global magic variables that are prefixed with a `$` like it's PHP.

It's unnerving. Be a general purpose programming language or be nothing.

Regardless of my feelings, Google Search Console was picking up the www variation of the site so this was a problem I needed to fix.

I tried to simplify my nginx config as much as possible so I'd have less opportunities to confuse myself later or break something. Here's what I came up with:

```
server {
    server_name tinkerlog.dev www.tinkerlog.dev;

    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;

    location / {
        proxy_pass http://localhost:3000;
    }

    if ($host = www.tinkerlog.dev) {
        return 301 https://tinkerlog.dev$request_uri;
    }

    # Certbot stuff here...
}

server {
    server_name tinkerlog.dev www.tinkerlog.dev;

    listen 80;
    listen [::]:80;

    return 301 https://tinkerlog.dev$request_uri;
}
```

Cheers.
