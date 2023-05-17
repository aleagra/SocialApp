# Social-Media-App

A fullstack JS social media app that simulates a real life one

### Frontend and Backend technologies

| Dependencies/libraries | Functionalities                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------- |
| ✅ React               | Creates the app                                                                                         |
| ✅ Vite                | Bootstraps the project                                                                                  |
| ✅ TailwindCSS         | CSS framework                                                                                           |
| ✅ Firebase            | Uploads and stores video files                                                                          |
| ✅ Axios               | for HTTP requests                                                                                       |
| ✅ Emoji-Picker-React  | An emoji picker component for React applications                                                        |
| ✅ Timeago.JS          | Date formatting                                                                                         |
| ✅ ReactRouterDom      | Used for routing and navigating the app                                                                 |
| ✅ react-toastify      | Display toasts notifications                                                                            |
| ✅ socket.IO           | Used for real time notifications                                                                        |
| ✅ MongoDB             | NOSQL language used for creating the DB                                                                 |
| ✅ Mongoose            | ODM that connects MongoDB and NodeJS environment                                                        |
| ✅ Multer.JS           | Middleware for handling multipart/form-data                                                             |
| ✅ CORS                | Provides a Connect/Express middleware that can be used to enable CORS                                   |
| ✅ Express             | Framework for Node JS                                                                                   |
| ✅ Bcrypt              | Used for password security                                                                              |
| ✅ Joi                 | Verifies that data input matches the one stored in DB                                                   |
| ✅ JWT                 | Implements Jsonwebtoken for NodeJS and used for generating a unique token that will be used by the user |

### Main Features

- Creating and verifing an account.
- Creating/liking/commenting a post.
- Posts includes text, emojis, pictures and video files (displaying in UI pending)
- Follow/unfollow users.
- Search other users.
- Light/Dark mode.
- Personalize app theme (lets users change the main color theme that the app will display)
- Personalize user data (change name/username/profile pic/password)

### Context

The app takes full advantage of React's Context API for managing different states such as the main theme chosen by the user. Once the user chooses the theme, it will be used in the rest of the app via Context. The same goes for the user, if it's succesfully logged in, the app will use this information i.e the user's id when different actions are performed, such as post creation or liking/commenting .

### Customization

The main feature is the possibility of customizing not only the user's profile but the entire app's look. There isn't a single color as the main theme, the user can choose up to four colors that will make up the most important sections and components. Besides this, one can choose it's own avatar profile pic from an API that randomly generates a set of avatars that are available to the user. Also the user can choose any image to set as background in the profile section.

### Styling

The app uses Tailwind as CSS framework, making it fully responsive for any kind of devices

### Usage

If you want to try this out, clone the repo and change the name. Type NPM install to use Vite, then npm run dev and npm start for the backend (you should have a Mongo DB up and running) and have fun!

### Fell free to contact us

<a href="https://www.linkedin.com/in/alejandro-agra//"><u>Alejandro Agra<u></a><br>
<a href="https://www.linkedin.com/in/juan-pablo-moscoloni-53a8b9245//"><u>Juan Pablo Moscoloni<u>
</a><br>
<a href="https://www.linkedin.com/in/federicorobledo13/"><u>Federico Robledo<u><a><br>
