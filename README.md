# Let's eSign Verifier

Let's eSign Verifier is an open-source, client-side-only, static web app for verifying [Let's eSign](https://letsesign.org) eSignatures. You can access it at the following URL:

https://verifier.letsesign.org/

<p align="left">
<img src="https://user-images.githubusercontent.com/2587360/179999793-4008d989-8324-4d50-aa3e-531e2611a417.png" width="46%">
<img src="https://user-images.githubusercontent.com/2587360/179714911-226906b5-1909-4646-90d0-00687e27034a.png" width="46%">
</p>

Alternatively, you can install and run the pre-built container which hosts Let's eSign Verifier:

- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) in your computer
- Copy and paste this command into your terminal program:
   ```
   docker run -d -p 80:80 letsesign/letsesign-verifier
   ```
- Access Let's eSign Verifier at `http://localhost` using your browser


## Developer Options

If you are a developer, you can build Let's eSign Verifier directly from the source code:

   ```
   git clone https://github.com/letsesign/letsesign-verifier.git
   cd letsesign-verifier
   unzip pdfjs-2.14.305-dist-patched.zip -d public/pdfjs/
   npm run build
   ```

Alternatively, you can build and run the container which hosts Let's eSign Verifier:

```
git clone https://github.com/letsesign/letsesign-verifier.git
cd letsesign-verifier
unzip pdfjs-2.14.305-dist-patched.zip -d public/pdfjs/
docker build -t letsesign-verifier .
docker run -d -p 80:80 letsesign-verifier
```
