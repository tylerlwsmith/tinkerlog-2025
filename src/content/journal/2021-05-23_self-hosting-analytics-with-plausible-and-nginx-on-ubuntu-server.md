---
title: Self-hosting analytics with Plausible & NGINX on Ubuntu Server
slug: self-hosting-analytics-with-plausible-and-nginx-on-ubuntu-server
published: 2021-05-23
---

Self-hosting is something that I find appealing. I want to have ownership of my data and services. Unfortunately, self-hosting is often impractical and expensive, but that shouldn't stop me from experimenting. In that spirit, I've decided to self-host this blog's analytics with Plausible. [You can view this site's public Plausible analytics dashboard here](https://analytics.tinkerlog.dev/tinkerlog.dev).

Plausible is a privacy-focused Google Analytics alternative. It's lightweight and straight-to-the-point. While it seemingly only has 1/10th of the features of Google Analytics, they're the Analytics features that I use most often.

This post covers more-or-less how I got everything set up. I spun up a new $5/mo Digitalocean Droplet running Ubuntu Server (x86), but any VPS should be pretty similar. I added my ssh keys during the set up process, so I was able to log in immediately.

## Creating a user account

You typically don't want to manage your server as the root user, so we'll start by creating a user account.

```sh
adduser tyler
```

Next, add your new user to the sudo group so it can run tasks as root.

```sh
usermod -aG sudo tyler
```

Next, copy the ssh keys from the root user to the new user so we can log in via ssh. We can use `rsync` to copy and change the ownership of the new files with a single command (you can see the [Digitalocean post I got this trick from here](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-18-04#if-the-root-account-uses-ssh-key-authentication)). The `-a` flag is for archive mode, which you can read about from the `rsync` help screen.

```sh
rsync -a --chown tyler:tyler ~/.ssh /home/tyler
```

Next, open a new terminal and test your users login.

```sh
ssh tyler@myserver.com
```

If this worked, close the root ssh session: we're going to disable root login. With your non-root user, open the ssh daemon configuration with `nano`.

```sh
sudo nano /etc/ssh/sshd_config
```

Find the line with `PermitRootLogin` and set the value to `no`.

```sh
PermitRootLogin no
```

Save the file, then restart the ssh daemon so these changes take effect.

```sh
sudo systemctl restart ssh
```

## Installing Docker & Docker Compose

I'm going to copy directly from their docs, so please feel free to reference the [Docker Installation Guide](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose Installation Guide](https://docs.docker.com/compose/install/) for the most up-to-date installation instructions.

First, remove any old versions of Docker:

```sh
sudo apt-get remove docker docker-engine docker.io containerd runc
```

Set up the Docker repository:

```sh
sudo apt-get update

sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

Add Docker’s official GPG key:

```sh
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Add the Docker repository:

```sh
 echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Install Docker engine:

```sh
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Copy Docker Compose onto your machine:

```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Make Docker Compose executable:

```sh
sudo chmod +x /usr/local/bin/docker-compose
```

Add your user to the `docker` group so you don't have to run Docker as root.

```sh
sudo usermod -aG docker tyler
```

Run the following command for the group change to take effect without having to log out and log back in:

```sh
exec su -l $USER
```

## Installing Plausible

Like Docker, I'm copying from the [Plausible Self-Hosting Guide](https://plausible.io/docs/self-hosting). Please reference the official guide for the most up-to-date installation instructions.

To keep things simple, we're going to install everything in our user's home directory. From your home directory, run the following:

```sh
git clone https://github.com/plausible/hosting
cd hosting
```

Next, we'll set up the config inside `plausible-conf.env`.

The `ADMIN_USER_EMAIL`, `ADMIN_USER_NAME` and `ADMIN_USER_PWD` fields will be used to create the Plausible user the first time you run the containers. **After you've started the containers for the first time, you need to set up SMPT to change the password, so choose a strong password while setting this up.**

Run `nano plausible-conf.env` to set these fields.

```sh
ADMIN_USER_EMAIL=tyler@example.com
ADMIN_USER_NAME=tyler
ADMIN_USER_PWD=kmw6W4nkuV!GqC-mczCyARYZ
```

Next, set the `BASE_URL` to the URL where you'd like to access the dashboard.

```sh
BASE_URL=https://your-site.com
```

Finally, you'll need to set a secret key to secure the app. In another terminal window, run the following command and copy its output to your clipboard:

```sh
openssl rand -base64 64
```

Put the command's output in your configuration file as the value for `SECRET_KEY_BASE`. **If the output of the command was broken into multiple lines, put it all on a single line.**

```txt
SECRET_KEY_BASE=WwnVrGNWl/Q2rqL18+tPqRP3hXInVpZ7uA9jywV5nGVqrdgJaSM5zAnA59c2oeDlGtu5NalOemWc+stD6M0IPg==
```

Start Docker Compose in detached mode:

```sh
docker-compose up -d
```

Plausible is now running, but we still have some extra steps before we can use it.

## Set an A record on your domain's DNS pointing to the server

How you'll go about this will vary depending on your registrar or where your DNS is hosted, but make sure your domain is pointing to the server's IP.

## Installing nginx

Run the following:

```sh
sudo apt update
sudo apt install nginx
```

Next we'll create an nginx configuration file for our site using `nano`.

```sh
sudo nano /etc/nginx/sites-available/your-site.com
```

We'll use the [Plausible nginx example](https://github.com/plausible/hosting/blob/master/reverse-proxy/nginx/plausible) as a template:

```txt
server {
	# replace example.com with your domain name
	server_name your-site.com;

	listen 80;
	listen [::]:80;

	location / {
		proxy_pass http://127.0.0.1:8000;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}
```

Next, link the site config to the `sites-enabled` folder.

```sh
sudo ln /etc/nginx/sites-available/your-site.com /etc/nginx/sites-enabled
```

Confirm that the configuration syntax is correct:

```sh
sudo nginx -t
```

Restart nginx:

```sh
sudo systemctl restart nginx
```

## SSL with Certbot

Certbot's official docs recommend installing Certbot with `snapd`, but nginx recommends installing with `apt`. We'll follow [nginx's Certbot installation instructions](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/).

```sh
sudo apt-get update
sudo apt-get install certbot
sudo apt-get install python3-certbot-nginx
```

Create a certificate for your domain. The `-d` flags are for domains. In the example below, we're creating a certificate for both the www and non-www versions of the domains. This is a good practice, but it isn't required.

[Make sure that your DNS has propagated](https://www.whatsmydns.net/) before running this command:

```sh
sudo certbot --nginx -d your-site.com -d www.your-site.com
```

## Setting up the firewall

Next, we'll protect the sever with `ufw`, short for Uncomplicated Firewall.

You can see your available apps with the following command:

```sh
sudo ufw app list
```

You should see the following returned:

```sh
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

Add nginx and OpenSSH

```sh
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
```

Next, enable the firewall. **Be sure that you've allowed OpenSSH before running this command, or you may be unable to access this server in the future**.

```sh
sudo ufw enable
```

Next, run `sudo ufw status`. You should see the following returned:

```txt
Status: active

To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
OpenSSH (v6)               ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
```

## A note about Docker and firewall security 

It's worth mentioning that any ports exposed by Docker can bypass the UFW firewall. In the case of Plausible, the only port that's exposed by Docker is for the Plausible web server, which means you can access it from the browser by using your server's IP address plus `:8000` (example: `143.198.111.211:8000`). This isn't the end of the world: you're not exposing any of the data stored in the database. It just means that if anyone were to visit the web server directly, their traffic would be unencrypted. Even still, it's worth knowing that Docker bypasses the system firewall.

If you leave this as it is, everything will probably be fine and you can move onto the next step. However, if you want to lock port 8000 down, you have a few options.

One option is using a network firewall. DigitalOcean and Linode both have network firewalls available in their dashboards, and they can be configured via the dashboard user interface. On DigitalOcean, I set up the following for my firewall's **Inbound Rules**:

|Type |Protocol|Port Range|Sources              |
|-----|--------|----------|---------------------|
|ICMB |ICMB    |          | All IPV4 / All IPV6 |
|SSH  |TCP     |22        | All IPV4 / All IPV6 |
|HTTP |TCP     |80        | All IPV4 / All IPV6 |
|HTTPS|TCP     |443       | All IPV4 / All IPV6 |

Using a network firewall is the most surefire method of locking down exposed Docker ports. However, Reddit user [ameer3141 suggested binding the port to localhost](https://www.reddit.com/r/docker/comments/m0opla/how_do_i_prevent_docker_bypassing_ufw_on_a_ubuntu/gqbgbtd/), which would prevent external devices from accessing it even if there was no firewall.

You can do this by opening `docker-compose.yml` using `nano docker-compose.yml`, changing the line that says `- 8000:8000` to `- 127.0.0.1:8000:8000`, then saving the file. After that, run `docker-compose down` then `docker-compose up -d`. I haven't read about this method in depth, but it seems to work from my testing.

## Logging into Plausible

Visit the URL that you set up for Plausible, then log in with the user credentials you created in `plausible-conf.env`.

When you log in, it will prompt you to enter a verification code that was emailed to you. We did not set up SMTP for email (though the docs has [email configuration instructions you can check out](https://plausible.io/docs/self-hosting-configuration#mailersmtp-setup)).

We can side-step the email verification by running the following command:

```sh
docker exec hosting_plausible_db_1 psql -U postgres -d plausible_db -c "UPDATE users SET email_verified = true;"
```

Plausible is now fully set up.

## Plausible First impressions

I like Plausible. I don't think I'm ready to leave Google Analytics behind for all of my websites just yet though.

Plausible shows you visitors by country. The United States is a pretty big country, and I'd like to know how many of my visitors are in Bakersfield, California (_me checking the site_) vs how many are elsewhere.

Plausible doesn't seem to offer that level of granularity. Truthfully, you can't offer that level of granularity and be privacy-focused, so it's a trade off.

With all of that said, I'm going to use Plausible on Tinker Log for the foreseeable future. If you haven't checked it out yet, take a look at [this site's public Plausible analytics dashboard](https://analytics.tinkerlog.dev/tinkerlog.dev)!
