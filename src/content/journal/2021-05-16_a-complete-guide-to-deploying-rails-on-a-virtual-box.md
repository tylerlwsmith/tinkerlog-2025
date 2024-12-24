---
title: A complete guide to deploying Rails on an Ubuntu VirtualBox VM
slug: a-complete-guide-to-deploying-rails-on-a-virtual-box
tags: rails, linux, virtualbox
published: 2021-05-16
---

This guide assumes you have a fresh host computer with VirtualBox installed and a Rails app on a public GitHub repo.

This guide will use Puma for the application server, nginx for the websever, and will not use Capistrano.

## Download Ubuntu Server

Download the Ubuntu Server image from the [Canonical Ubuntu Server page](https://ubuntu.com/download/server). You may need to look for a section like 'Manual server installation' to find the download.

## Configuring VirtualBox

Open VirtualBox then select the "New" icon using the application toolbar.

Enter an appropriate name for the VM, and keep the default machine folder.

Select **Linux** for **Type** and select **Ubuntu (64 bit)** for **Version**. This will not install the OS on your VM, but [it will set up a VM with sensible defaults](https://superuser.com/a/617346).

Next, select the default memory size of **1024 MB**, then select the **Create a virtual hard disk now** option.

It will present you with 3 options:

1. **VDI**: The native VirtualBox Image.
1. **VHD**: Microsoft's Virtual Hard Drive format.
1. **VMDK**: VMware's Virtual Machine Disk.

While each format has pros and cons, there is some amount of interoperability, and some amount of ability to convert between formats. Because of this, we will stick with the default **VDI**, then select **Dynamically allocated** size and keep the default **10.00 GB** disk size.

The VM is now created.

Select the VM from the left-hand sidebar, then click "Settings" from the application toolbar.

Navigate to the **Network** tab in the left-hand sidebar. Go to the **Advanced** settings under **Adapter 1**, then click the **Port Forwarding** button.

Add the following configuration, changing the **Host Port** values to whatever you please:

| Name | Protocol |   Host IP | Host Port | Guest IP | Guest Port |
| ---- | -------- | --------: | --------: | -------: | ---------: |
| SSH  | TCP      | 127.0.0.1 |      2222 |          |         22 |
| HTTP | TCP      | 127.0.0.1 |      2223 |          |         80 |

Click the "Start" icon in the application toolbar. A pop up will appear asking you to select a startup disk. Use the file selector to select the Ubuntu Server image you downloaded earlier, then click the **Start** button.

## Installing Ubuntu

Select your preferred language and keyboard. Keep the defaults for network connections, proxies, Ubuntu archive mirror, and storage configuration. The installer will prompt you to confirm that you understand that selecting the storage is a destructive action&ndash;confirm and proceed.

Choose your **name**, **server name**, **username** and **password**, then continue by selecting **Done**.

The installer will ask if you'd like to install OpenSSH server. Select **Install OpenSSH server** and continue. We won't import an SSH identity yet because we'll create ssh keys later in this guide. If you already have SSH keys, you can import them now using GitHub or Launchpad.

Next the installer will prompt you to install server Snaps. We will continue without installing any Snap packages.

The installer will finish installing software, then it will prompt you to restart.

Once Ubuntu has finished installing, select **Reboot Now**.

If you see the terminal hanging on CD unmounting errors, hit `enter` and the VM will proceed with the reboot.

After the VM reboots, you'll see a very busy screen. Hit enter and you should see the login prompt. Log in with the username and password that you created earlier.

## Generating SSH keys and connecting to the server

We will be using the terminal from your host machine for the rest of this guide.

If you've never generated an SSH key on your current computer, run the following command in the host machine's terminal:

```
ssh-keygen -b 4096
```

The `-b 4096` command gives you a 4096-bit key instead of the default 3072-bit key, with larger keys being more secure.

When prompted by the command, confirm the default directory and set a long, hard-to-guess passcode.

Next, copy the SSH key to the server with the following command, replacing `username` with your username. The `-p` flag specifies the SSH port we set when configuring our VirtualBox:

```
ssh-copy-id username@localhost -p 2222
```

Enter your password when prompted.

Now, we will SSH into the VM itself.

```
ssh username@localhost -p 2222
```

Next, we want to disable password access to make it difficult for hackers to gain control over the server. Edit `/etc/ssh/sshd_config` using `sudo vim /etc/ssh/sshd_config` and find the line that says `PasswordAuthentication yes` and set it to `PasswordAuthentication no`.

Save and quit Vim, then type `exit` to break the SSH connection, then SSH into the server again to confirm everything worked.

## Installing Nginx

First we will install Nginx. [Ubuntu's official guide](https://ubuntu.com/tutorials/install-and-configure-nginx#2-installing-nginx) recommends using the following installation method:

```
sudo apt install nginx
```

## Enabling the Firewall

We'll use UFW (uncomplicated firewall), a simplified wrapper around IP Tables, to limit access to the server.

Run the following to see the apps that UFW can allow:

```
sudo ufw app list
```

It should return the following:

```
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

Run the following commands:

```
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
```

This will enable the firewall. If you did this wrong, the VM will boot you off of SSH and you'll have to open the VirtualBox to fix it.

## Installing Node.js

We'll install Node.js with NodeSource's distributions. While NVM is also a powerful tool, the way it installs Node makes it difficult for system tasks to run node, whereas NodeSource installs Node as a standard package.

Navigate to the [NodeSource Distributions](https://github.com/nodesource/distributions#deb) GitHub and find the most recent LTS version of Node in the Debian section. LTS info can be found on the [releases page of the Node website](https://nodejs.org/en/about/releases/).

Run the Ubuntu install scripts:

```
# Using Ubuntu
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Installing Yarn

Now we'll install Yarn package manager.

Run the following commands:

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
```

## Installing Database Dependencies

If you need a local instance of MySQL or Postgres, install them now. SQLite3 will work without the system package installed.

## Installing rbenv, ruby-build, and rbenv-vars

We're eventually going to install Ruby with [rbenv](https://github.com/rbenv/rbenv), so install rbenv.

```
sudo apt install rbenv
```

Next, run `rbenv init` and follow the instructions by appending the following to your `~/.bashrc` file:

```
eval "$(rbenv init -)"
```

Reload the session by running `exec bash`. This will **replace** the current bash shell with a new bash shellS without having to log out and log in again.

Now we need to install Ruby. While rbenv has a built-in install command, don't let it trick you: you need the [ruby-build](https://github.com/rbenv/ruby-build) package to get recent versions of Ruby.

Install [ruby-build](https://github.com/rbenv/ruby-build) as a rbenv plugin:

```
mkdir -p "$(rbenv root)"/plugins
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
```

Next, download the [rbenv-vars](https://github.com/rbenv/rbenv-vars) plugin that lets us set Ruby enviornment variables.

```
git clone https://github.com/rbenv/rbenv-vars.git $(rbenv root)/plugins/rbenv-vars
```

## Creating a project directory

Create a folder for the project inside of the `/srv` directory.

```
sudo mkdir /srv/http
```

Next, create a `webadmin` group for the web application.

```
sudo groupadd webadmin
```

Now, add the `webadmin` group to the current user:

```
sudo usermod -aG webadmin tyler
```

To make the new group take effect without restarting the computer, run the following command (courtesy of [Stack Overflow](https://superuser.com/a/609141)):

```
exec su -l $USER
```

Next, change the group owner of the `http` directory to the `webadmin` group:

```
sudo chgrp webadmin /srv/http
```

Change the permissions of the directory so that the `webadmin` group has write access:

```
sudo chmod g+w /srv/http
```

Then change into the newly-created `http` directory:

```
cd /srv/http
```

## Cloning the Rails project

Inside the directory, clone your project using `git clone`. It should look similar to the following:

```
git clone  https://github.com/username/project.git
```

Change into the cloned project directory.

## Installing Ruby

Inside your project directory, run `bin/rails`. The console will display an error like the one below:

```
Warning: the running version of Bundler (2.1.2) is older than the version that created the lockfile (2.1.4). We suggest you to upgrade to the version that created the lockfile by running `gem install bundler:2.1.4`.
Your Ruby version is 2.7.0, but your Gemfile specified 2.7.2
```

Use the error to find what version of Ruby to install, then install it with rbenv.

```
rbenv install 2.7.2
```

This command will take a while to execute because it is compiling Ruby from source.

Once Ruby is compiled, run the `rehash` command then set the global Ruby version:

```
rbenv rehash
rbenv global 2.7.2
```

## Installing Gems

Next, install the missing Gems with Bundle:

```
bundle install
```

## Installing NPM Packages

Run `yarn`.

## Setting the app environment variables

Create `.rbenv-vars` in the root of the project directory. Add the following:

```
RAILS_ENV=production
RAILS_SERVE_STATIC_FILES=true
```

The second command will allow the Rails server to serve static files. This will simplify our nginx configuration, but it will have a negative impact on performance.

## Precompiling assets

If you ran the app now, you'd have an error. That's because in production, we must precompile our app.

Run the following command in your project folder:

```
bin/rails assets:precompile
```

## Copying the master key

In your local copy of the site, copy the contents of `config/master.key` and place in your projects `config` folder on the VM.

## Run migrations

If you already ran you migrations before you set your app to production, you'll need to run them again.

Run `bin/rails db:migrate`

After the migration, run any seeding scripts your app has.

## Testing

Run your app with `bin/rails server`. In another ssh session to the VM, run `curl localhost:3000`. You should see your markup displayed in the console.

## Creating a Puma systemd service

Next, we need to create a service to keep the Rails app alive. We'll use Puma for the application server and keep its default settings. Puma is more powerful than Passenger, and it's installed by default with Rails.

We'll use the [Puma systemd configuration docs](https://github.com/puma/puma/blob/master/docs/systemd.md) as a starting point.

Create `/etc/systemd/system/puma.service` and add the following, replacing the `WorkingDirectory` and `User` values with the appropriate settings from your server:

```rb
[Unit]
Description=Puma HTTP Server
After=network.target

[Service]
Type=simple
WorkingDirectory=<YOUR_APP_PATH>
User=<A_NON_PRIVILEGED_USER>
Restart=always
ExecStart=/usr/bin/bash -lc 'eval "$(rbenv init -)"; bin/rails server'

[Install]
WantedBy=multi-user.target
```

The `Type` must be set to `simple`. The `ExecStart` feels like a hack, but it's the best I can come up with right now.

The commands listed below can be used to control the newly-created Puma service. These were copied from the [Puma systemd configuration docs](https://github.com/puma/puma/blob/master/docs/systemd.md).

```
# After installing or making changes to puma.service
sudo systemctl daemon-reload

# Enable so it starts on boot
sudo systemctl enable puma.service

# Initial start up.
sudo systemctl start puma.service

# Check status
sudo systemctl status puma.service

# A normal restart. Warning: listeners sockets will be closed
# while a new puma process initializes.
sudo systemctl restart puma.service
```

## Configuring nginx

We're ready for the final step: configuring nginx.

Run `sudo vim /etc/nginx/sites-enabled/default` to edit the default nginx configuration.

Navigate to the `location /` block in the main server. Comment out `try_files $uri $uri/ =404;` and then add `proxy_pass http://localhost:3000;` on the next line.

It should look like this:

```
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                # try_files $uri $uri/ =404;
                proxy_pass http://localhost:3000;
        }
```

Test your configuration with `sudo nginx -t`. If the configuration looks good, reload nginx with `sudo systemctl reload nginx`.

On your host system, navigate to `http://localhost:2223` (we set up this port when we set up VirtualBox) and you should see your Rails app.
