# Deployment
The ReactJS frontend is deployed via Cloudflare. The frontend will fetch (JS fetch API) 'database' information from an active backend web API deployed elsewhere.
This backend server is deployed via DigitalOcean, specifically as a virtual Ubuntu machine (DigitalOcean "Droplet") running a Docker image with an active ExpressJS 
server publicly exposed through its web port.

## Cloudflare Frontend
Manual deployment of changes to the frontend should be checked using the following steps. However, once CI/CD is set up, this should not be necessary.
1. Login to UNSW Quantsoc's Cloudflare account.

2. Under "Workers and Pages", select "mock-trading-game". This is a Cloudflare Page that was created by importing an existing GitHub repository: Quantsoc/mock-trading-game.

3. Go to "Settings" -> "Builds & deployments" -> "Configure Production deployments" and ensure the production branch is set to "digitalocean". This should be a duplicate of 
"main" albeit with frontend/src/constants.js modified to have ```BACKEND_ROUTE = mtg_backend_hostname.quantsoc.org```, the DigitalOcean droplet's IPv4 address rather
than the localhost server used in development.

4. Ensure automatic deployments of the production branch is enabled.

5. Under "Build configurations":
- Build command: ```npm run build```
- Build output directory: /build
- Root directory: /frontend 

## DigitalOcean Backend
Manual deployment is as follows. Once CI/CD is set up, this should not be necessary unless the build process becomes too expensive to be done via DigitalOcean.
1. Install Docker

2. Make DockerHub account

3. Build the Docker of the backend (see Dockerfile)

        docker build . -t shmu9/mtg:0.0
    replacing shmu9 with your DockerHub username, and 0.0 with a version number. You should run the build and test locally that it behaves as expected with

        docker run -p local_host_port:5005 shmu9/mtg:0.0

4. Login to docker via CLI:

        docker login -u "username" -p "password"

    or just

        docker login
    and follow the steps.

5. Push the recently built image to DockerHub

        docker push shmu9/mtg:0.0

6. SSH into Droplet (assuming Droplet has already been created, with ssh key authentication).

        ssh -i path/to/private/key root@public_IPv4_address_of_Droplet

7. Pull image from DockerHub into Droplet (assuming compatible Docker version has already been installed in the Droplet)

        docker run -p 80:5005 shmu9/mtg:0.0
        docker run -p 80:5005 -d shmu9/mtg:0.0  # to run as daemon in background??
    The above command will do this automatically if there is no current image in Droplet.
    For later versions or mistakes, might need/want to remove the old image. Be careful to keep database information safe.

        docker image rm shmu9/mtg:0.0 --force

### HTTPS (SSL) and DNS for Backend
By default, DigitalOcean will serve data with HTTP. We want HTTPS for security and because our Cloudflare frontend page is
loaded over HTTPS, which means it will not allow itself to request an insecure HTTP resource.

8. In the Cloudflare DNS, create an A record that maps mtg_backend_hostname.quantsoc.org -> the Droplet's IPv4 address.

9. (Wait for DNS record propagation).

10. Modify frontend/src/constants.js to have ```BACKEND_ROUTE = https://mtg_backend_hostname.quantsoc.org```. Note that Cloudflare should 
have issued this host an SSL certificate; and the connection should be secure.

11. Push changes to "digitalocean" branch.

12. Check steps under "Cloudflare Frontend" and wait for latest changes to deploy.


IGNORE (testing DigitalOcean DNS and SSL):
    Add ns1.digitalocean.com (and ns2, ns3) to the list of name servers on quantsoc.org namecheap. 
    Add a domain to the Droplet. 
    Add an A record that maps something.quantsoc.org -> the Droplet's IPv4 address.
    Under setting -> security on DigitalOcean, generate new SSL certificate using Let's Encrypt for the something.quantsoc.org subdomain?
    Nginx + certbot?

# Reading and Writing to Database Manually on DigitalOcean Droplet
The server (within the droplet) exists as a running Docker container, so accessing the database.json file requires some steps:
1. SSH into Droplet

        ssh -i path/to/private/key root@public_IPv4_address_of_Droplet

2. Get list of containers to find the MTG's container name

        docker ps

3. Access the docker container by attaching a shell

        docker exec -it <container-name> sh




# CI/CD
NOT YET IMPLEMENTED

## Frontend
- .git/hooks/pre-push and .git/hooks/post-merge (post-update??) keep frontend/src/constants.js to have ```BACKEND_ROUTE = https://mtg_backend_hostname.quantsoc.org```
at remote for production/deployment ```BACKEND_ROUTE = 'http://localhost:5005'``` and on local branches during development.


## Backend
- GitHub Actions workflow '??' to generate and deploy Docker image in the DigitalOcean Droplet
    - need to ensure database remains untouched
    - if backend changes affect the structure of database.json, existing data in the database (on the Droplet) must be modified (ideally by some parser) as to not lose client
    information. If reasonable, you can just delete/reset the .json file, but you should check with the QuantSoc Competitions director or any significant users/game-creators/admins of the mock-trading-game.
    - ideally ensure build cache is utilised in the Droplet
    - need to determine behaviour for while the Droplet is updating to match our newest backend changes. Should the website be unavailable during this period? Do we need to give a warning on 
    the frontend; like a conspicuous red banner notification that reads "WARNING: Upcoming scheduled maintenance outage between 16:00-18:00 AEST, 11th of November."


# Some helpful resources:
1. [Containerise a NodeJS and ExpressJS API with Docker](https://www.youtube.com/watch?v=waKaGikF_Ig&ab_channel=WithChanakya)
2. [Deploying a NodeJS REST API Docker Container to DigitalOcean](https://www.youtube.com/watch?v=RSI3v5YzPbc&ab_channel=WithChanakya)
3. [Docker image platform not matching detected host plaform](https://stackoverflow.com/questions/72152446/warning-the-requested-images-platform-linux-amd64-does-not-match-the-detecte)
4. https://stackoverflow.com/questions/65612411/forcing-docker-to-use-linux-amd64-platform-by-default-on-macos/69636473#69636473 
5. https://medium.com/swlh/how-to-deploy-your-application-to-digital-ocean-using-github-actions-and-save-up-on-ci-cd-costs-74b7315facc2
6. Email me: sam.axford02@gmail.com