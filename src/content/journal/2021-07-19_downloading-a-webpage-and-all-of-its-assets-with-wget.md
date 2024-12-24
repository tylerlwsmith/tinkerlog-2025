---
title: "Downloading a webpage and all of its assets with wget"
slug: downloading-a-webpage-and-all-of-its-assets-with-wget
tags:
published: 2021-07-19
---

A friend of mine has a single-page website that he hasn't updated in over a year. He'd like to keep the website, but he'd _also_ like to save $20 a month. I told him I could probably help him get it on Netlify since he never changes it.

I needed a way to download the page with all of its assets. Chrome's "Save as..." menu option wasn't working: it wouldn't download content from the CDN because it was on a different domain. I thought `wget` might be a good option.

Here is the command I ultimately ended up using:

```sh
wget --page-requisites --convert-links --span-hosts --no-directories https://www.example.com
```

To go through the arguments one-by-one:

- `--page-requisites` downloads the images, css and js files
- `--convert-links` makes the links "suitable for local viewing," whatever that means (thank you, `man` page)
- `--span-hosts` is the magic here: this tells `wget` to download the files from different hosts like the CDN
- `--no-directories` downloads the files into a single flat and messy directory, which is perfect for my needs

If you open `index.html` the assets will be broken: `--convert-links` doesn't seem to make these relative to the root directory. So to view the page, you'll need to start a webserver in the download directory. You can use the following command:

```sh
python3 -m http.server
```

The output is pretty messy and it might be quicker to just build something with Tailwind than clean this download up, but at least I know how to do this now.
