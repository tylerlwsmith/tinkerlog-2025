---
title: "Trials and tribulations of sharing Django's static files with an nginx container"
slug: trials-and-tribulations-of-sharing-djangos-static-files-with-an-nginx-container
tags:
published: 2021-08-09
---

Today sucked. I thought I was close to getting this site over the finish line. I thought, "Oh, I just need to share these static files from the Django container with the nginx container. That shouldn't be that bad."

It _was_ that bad.

## File sharing nightmares

There's no obvious non-hacky way to share files between containers in Docker. The first thought, of course, is "I'll just use volumes." The problem with volumes is that once they're created, their files are independent of the container. This means that if you create a `static-files` volume and share it with both a Django container and an nginx container, it will never receive updates to the files from newer versions of the images after it's initially created. That's because its files are managed by the volume, not the containers (though the containers still have the ability to change the volume's files unless the volume is specified as read only).

You could get around this by deleting the volume between deploys. But volumes take a non-zero amount of time to create, leading to longer reboot times when redeploying. I think this is a bad option.

The next option that comes to mind is to mount _both_ the Django container's static directory and the nginx container's static directory to the host machine. This won't work either. When mounting a volume to the host, the host becomes the source of truth: Docker mounts your host directory's files _into_ the container, it does not mount the container's files into the host directory.

Another option is copying files. Using the `docker cp` command, you can copy files from a container to the host, or from the host to a container. However, you cannot copy files from one container to another container. Even if you could, I'm not 100% sure the copied files would still be there after rebooting the container unless they were copied to a volume. I haven't tried though.

Ultimately, I shared a host volume with the nginx container then used something like `docker cp django:/app/static-assets /srv/statc-assets` to copy the files to the mounted host volume where nginx could access them. I hate this solution: because the nginx container has a dependency on seemingly arbitrary files on the host machine, it is no-longer self-contained and independently deployable. It creates a tight coupling between the containers, the pipeline and the target server.

## Next steps

Tomorrow I'm going to optimize my Dockerfiles for production builds. During that process, I'm going to see if it's possible to use the fully-built Django image as an intermediate stage image for nginx so I can copy the files at build time. Thsi may require some extra work in the Jenkins pipeline to get this working: [build ordering is not an intended use case for Compose's `depends_on` attribute](https://github.com/docker/compose/issues/6332#issuecomment-437143989), so I may need to run the builds separately in the CD to ensure that the Django container exists before copying the files to nginx.

I'm desperately hoping that by optimizing these images I can speed up the boot time for the application when I deploy changes.
