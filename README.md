# Frontend 'Slim op sollicitatie'

Frontend for 'Slim op sollicitatie'. This web application is build to practice job interviews without fear or pressure. Taking job interviews has never been this easy.

In this repository, all the files regarding the frontend of the 'Slim op sollicitatie' web application are uploaded.

Log in or register with a new account. Choose your preferred categories, turn on your camera and you're ready to go!

**[Pages](#Pages) | [Installation](#Installation) | [Prerequisites](#Prerequisites) | [FAQ](#FAQ) | [Secret](#Secret)**

## Pages

**[Home page](#Home page) | [Dashboard](#Dashboard) | [Take a job interview](#Take a job interview) | [Job interviews](#Job interviews) | [Categories](#Categories) | [My assignments](#My assignments) | [My profile](#My profile) | [Contact](#Contact)** 

### Home page

When not logged in, this page wil give you the option to log in or register with a new account. Just fill in your details and get started.

### Dashboard

Depending on the role you have as a user, you will see different functionalities on this page.
- As a student, you don't get to see this page in your navigation and you will also not be able to navigate to this page via the url.
- As a lecturer, you will see a list of all your students as well as a list of all the assignments.
- As an admin, this page shows all server information, a list of all the users and a list of all the comments that have been added under videos.

### Take a job interview

On this page, you can record a new video. 
There are two options for recording a job interview:
- Random questions. Five random questions based on your preferred categories will be asked during the recording of your video.
- Chosen category. Given the list of all possible categories, you can pick one you would like to record a video about.

### Job interviews

A list of all the recorded videos is given. Only the videos that are set public will be shown for students, admins and lecturers can also see private videos.

### Categories

This page shows a list of all the categories with the number of questions and the functionality to view the questions.
As a lecturer or admin, you can also add new categories to the list.

### My assignments

Students can see all the assignments they has to finish on this page.

### My profile

You can find all your personal information as well as your videos on this page.
There are also some functionalities on here, like edit profile, edit preferences or account deletion.
Dark mode can also be turned on/off on here.

### Contact

A simple page with an overview of all the people you can contact in case you have any problems when using the website.

## Secret

Create a `.env.local` file in the root of the project with following content:

```
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GOOGLE_ID="your_google_id"
GOOGLE_SECRET="your_google_secret"
AUTH_SECRET="your_random_auth_key"
JWT_SECRET="your_random_jwt_secret"
```

## Installation

```bash
# Install packages
npm install

# Start server
npm run dev

# Format project files
npm run format
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prerequisites

To start up the application you need:

- **[npm](https://www.npmjs.com/)** (v8.5.0 or later)
- **[Node.js](https://nodejs.org/en/)** (v16.13.1 or later)
- **[PostgreSQL](https://www.postgresql.org/)** (14 or later)

To install npm and node.js please refer to a tutorial. (**[Linux](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-20-04/)** | **[Windows](https://phoenixnap.com/kb/install-node-js-npm-on-windows)** | **[Mac](https://www.newline.co/@Adele/how-to-install-nodejs-and-npm-on-macos--22782681)**)

An installation guide for PostgreSQL is provided on their official **[website](https://www.postgresql.org/)**.
You may choose how to host the database server, this could be local or using a service.
