# Installation Instructions

## 1.- Install git, github CLI and Docker

Check their current documentation on how to install each.

- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Github CLI](https://cli.github.com/)

### A.- Signup to your Github account using the CLI

See instructions in [Github CLI](https://cli.github.com/manual/gh_auth_login) documentation.

### B.- Clone the repository

Once you have your account logged in, you can clone the repository.

    gh repo clone Teachers-Discovery/Flangoo-Front-End

## 2.- Create .env.development file

Duplicate the `.env.development.example` file and rename it to `.env.development`
Change the variables to match your local environment.
If you are not working with a local copy of the backend use the staging server url.

```
REACT_APP_GRAPH_URL=https://apidev.flangoo.com/graphql
REACT_APP_API_URL=https://apidev.flangoo.com/api/v1
REACT_APP_CDN_URL=https://apidev.flangoo.com/
```

## 3.- Install dependencies

    npm install --legacy-peer-deps

## 4.- Run the app

        npm start
