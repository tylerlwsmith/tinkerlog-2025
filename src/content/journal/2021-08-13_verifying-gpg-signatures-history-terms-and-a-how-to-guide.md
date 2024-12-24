---
title: "Verifying GPG signatures: history, terms and a how-to guide"
slug: verifying-gpg-signatures-history-terms-and-a-how-to-guide
tags:
published: 2021-08-13
---

You may have seen GPG and PGP signatures on download pages of software. If you're like me, you may do a quick Google search to figure out what these are and how to use them. You quickly become overwhelmed by strange-sounding cryptographic terms, and then hope for the best as you download software that you haven't verified the authenticity of. You're busy, and you need the software now.

This post will explain what PGP and GPG are, their histories, and key terms that you should know. After that, we will walk through how to import a GPG key, check its fingerprint, and verify the authenticity of a file using a signature.

## History of GPG

Before we dive into GPG, lets go back in time to look at its predecessor, PGP.

**PGP** stands for **Pretty Good Privacy**. It provides encryption, decryption, and digital signing. PGP was created by Phil Zimmermann and released as free software in 1991. Zimmerman quickly found himself in several legal battles over his PGP software. At the time, cryptographic software was considered munitions by the United States, and its export was prohibited. Yet PGP's free and open source nature carried it across the ocean, to the strong disapproval of the federal government. Zimmerman was charged for munitions export without a license. [Zimmerman cleverly published his code as a hardcover](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#Criminal_investigation) book called _PGP Source Code and Internals_. While the export of cryptographic software was illegal, the export of books was protected by the first ammendment. [Charges against Zimmerman were dropped in the mid 90s](https://www.cnet.com/tech/services-and-software/feds-drop-charges-in-encryption-case/).

[Zimmerman was also sued by RSA](https://www.wired.com/1994/11/cypher-wars/) for patent infringement of the RSA public key encryption algorithm, though there was eventually some resolution when PGP replaced the patent algorithm with a version that RSA released in a free toolkit. Following these exhausting legal battles, Zimmerman decided that there needed to be an open standard for PGP, which became **OpenPGP**.

**GNU Privacy Guard** is a free software implementation of **OpenPGP**, and is often abbreviated **GnuPGP**, or simply **GPG**. Version 1.0.0 was released on [September 7, 1999](https://gnupg.org/download/release_notes.html#sec-2-41).

We'll spend the rest of this article focusing on GPG, as it is the [currently recommended implementation by Zimmerman](https://philzimmermann.com/EN/findpgp/). But for all intents and purposes, modern **PGP and GPG are interchangable** since they both follow the OpenPGP standard.

## Terms

A **GPG key** (or PGP key) is a text file used for encrypting and decrypting data. Keys are created in pairs, with a public and private key. When verifying a GPG signature, you'll be verifying against a **public GPG key**, which typically has a `.asc` file extension.

A **fingerprint** is a short sequence that is used to identify a longer public key, and it can be used to verify the authenticity of a key. Fingerprints create a more manageable way to refer to public keys. You can often find a fingerprint on the website near where you would find a public GPG key.

A **signature** is a way to verify the authenticity of a file and ensure that it has not been tampered with. A signature is created using the private GPG key of the signer and the original file to sign its authenticity. Signatures typically have a `.sig` file extension.

## How to verify a file using a GPG key and signature

Below I'll show you how to verify a GPG signature using Hashicorp's Terraform's SHA256 checksum file as an example. I found the download and signature on the [Download Terraform page](https://www.terraform.io/downloads.html) and found Hashicorp's public GPG key and fingerprint from [Hashicorp's Security page](https://www.hashicorp.com/security).

### 1. Import the key

Download the GPG public key, the file you want to verify, and its corresponding signature file. We'll name the key `hashicorp.asc`. Navigate to the directory where you saved `hashicorp.asc` and run the following command:

```sh
gpg --import hashicorp.asc
```

### 2. Check the key's fingerprint

Next, verify the key against the fingerprint for that key. The fingerprint may have spaces in it (example: `C874 011F 0AB4 0511 0D02 1055 3436 5D94 72D7 468F`); if it has spaces, remove them before running the following command.

```sh
gpg --fingerprint C874011F0AB405110D02105534365D9472D7468F
```

If the fingerprint matches the key you downloaded, you should see something like the following:

```
pub   rsa4096 2021-04-19 [SC] [expires: 2026-04-18]
      C874 011F 0AB4 0511 0D02  1055 3436 5D94 72D7 468F
uid           [ unknown] HashiCorp Security (hashicorp.com/security) <security@hashicorp.com>
sub   rsa4096 2021-04-19 [E] [expires: 2026-04-18]
sub   rsa4096 2021-04-19 [S] [expires: 2022-04-20]
sub   rsa4096 2021-04-21 [S] [expires: 2026-04-20]
```

If the fingerprint _does not_ match a key, you'll get the error message below. Check your key and the fingerprint to make sure that everything is what you expect. This may be telling you that the key you downloaded is not authentic.

```
gpg: error reading key: No public key
```

### 3. Verify the signature

Next, verify the file by passing it and the signature to the `gpg --verify` command, with the signature as the first argument.

```
gpg --verify terraform_1.0.4_SHA256SUMS.sig terraform_1.0.4_SHA256SUMS
```

You should see output similar to the following:

```
gpg: Signature made Wed Aug  4 14:15:46 2021 PDT
gpg:                using RSA key B36CBA91A2C0730C435FC280B0B441097685B676
gpg: Good signature from "HashiCorp Security (hashicorp.com/security) <security@hashicorp.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: C874 011F 0AB4 0511 0D02  1055 3436 5D94 72D7 468F
     Subkey fingerprint: B36C BA91 A2C0 730C 435F  C280 B0B4 4109 7685 B676
Aug 13 03:07 PM Downloads tylersmith$
```

This is what we want to see. The "trusted signature" warning looks a little concerning, but this is nothing to worry about. The warning simply means that [no one who we explicitly trust has signed the Hashicorp key](https://groups.google.com/g/vault-tool/c/-aEv1BsJv5g). This is based on PGP's [web of trust](https://en.wikipedia.org/wiki/Web_of_trust). The Hashicorp key is only the second key that I've imported, so this error is unsurprising. I feel comfortable ignoring it.

If all you're trying to do is validate the authenticity of a file, congratulations: you did it! However, we'll do one additional step below to finish verifying Terraform.

### 4. Verifying the checksum (optional)

Now that we've successfully validated the authenticity of the checksum file with GPG, we can find the checksum of the Terraform zip and check it against the validated list of checksums. **This is not a GPG feature**: it's specific to validating the authenticity of the Terraform download. Unless you are also validating the Terraform download, you can skip this step.

The `terraform_1.0.4_SHA256SUMS` file lists the following for the MacOS Terraform zip:

```
cf7c7750c6380a12d6a4534c63844c803f14f5c5a8f71e32f7ad237ae81ae7a9  terraform_1.0.4_darwin_amd64.zip
```

We can use `openssl` to find the SHA256 checksum of our downloaded Terraform zip:

```
openssl sha256 terraform_1.0.4_darwin_amd64.zip
```

It returns the following:

```
SHA256(terraform_1.0.4_darwin_amd64.zip)= cf7c7750c6380a12d6a4534c63844c803f14f5c5a8f71e32f7ad237ae81ae7a9
```

This matches the checksum from the validated checksum file. We can be confident that this zip file is indeed the authentic file that Hashicorp produced.

Alternatively, you could do all of this in one step:

```
shasum -a 256 -c terraform_1.0.4_SHA256SUMS
```

Which will return the following:

```
shasum -a 256 -c terraform_1.0.4_SHA256SUMS
terraform_1.0.4_darwin_amd64.zip: OK
...
```

There will be several lines of failures too, but look for the line that matches the file name that you are checking.

## Further reading

I read a lot of interesting articles while writing this post. Here are some of the articles I looked at that you may also find interesting.

https://en.wikipedia.org/wiki/Pretty_Good_Privacy
https://en.wikipedia.org/wiki/Phil_Zimmermann
https://n-o-d-e.net/verify.html
https://gnupg.org/download/integrity_check.html
https://academy.binance.com/en/articles/what-is-pgp
https://blog.ipswitch.com/the-difference-between-pgp-openpgp-and-gnupg-encryption
https://www.gnupg.org/gph/en/manual/x135.html
https://en.wikipedia.org/wiki/Public_key_fingerprint
