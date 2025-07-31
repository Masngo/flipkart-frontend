# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

=======
# flipkart-frontend
Flipkart-Frontend - A modern, responsive frontend for the Flipkart Clone project, built using React.js. It connects to the backend via REST APIs to provide a seamless e-commerce experience including product browsing, user authentication, cart functionality, and more.
>>>>>>> aa8d55ad759cd5027d247242e732871ca1d1037c


## Flipkart Frontend

A full-featured frontend for a Flipkart Clone built using **React.js**. It connects seamlessly with the backend API to deliver real-time e-commerce functionality, including user authentication, product browsing, and cart management.

## Part of the full-stack Flipkart Clone Project.

Backend Repository: [Flipkart-Backend](https://github.com/Masngo/Flipkart-Backend )


## Features

- User Registration & Login (with JWT)
- View product list from backend
- Add to Cart, View Cart
- Product details page (optional)
- Fully responsive layout (Tailwind CSS or Bootstrap)
- Axios-based API integration with Node.js backend



## Project Structure

Flipkart-Frontend/
├── public/
│ └── index.html
├── src/
│ ├── components/ # Navbar, Footer, ProductCard, etc.
│ ├── pages/ # Home, Login, Register, Cart, etc.
│ ├── services/ # Axios API calls (product, auth)
│ ├── App.js # Route config
│ └── index.js # Entry point
├── .env
├── package.json
└── tailwind.config.js # If using Tailwind CSS

## Tech Stack

- [React.js](https://reactjs.org/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/) or Bootstrap
- [React Router](https://reactrouter.com/)
- [Node.js Backend](https://github.com/Masngo/Flipkart-Backend)



##  Getting Started

### Prerequisites

- Node.js and npm installed
- Backend running on `http://localhost:5000`

### Installation

bash
# Clone the frontend repo
git clone https://github.com/Masngo/Flipkart-Frontend.git 
cd Flipkart-Frontend

# Install dependencies
npm install

# Start the development server
npm run dev  # or npm start
Set up .env
Create a .env file in the root:
VITE_API_URL=http://localhost:5000

Available Pages
•	/ – Home Page
•	/login – User Login
•	/register – User Registration
•	/cart – Shopping Cart
•	/products/:id – Product Detail Page (if implemented)


## Screenshots

<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/c10c733e-2668-4116-86a0-97601ad0a38e" />
<img width="1337" height="686" alt="frontend-render" src="https://github.com/user-attachments/assets/7d9462ca-66d3-47b4-9afe-c09bc0efd7b7" />  
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/8b10bdd2-1610-4bb9-b22f-94b06b9893e4" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/6b2bc846-4d79-4d6c-812f-93103f3816b0" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/1abda27e-21ea-42a1-a2b4-8db26e35f41d" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/7bc7bda5-6f2a-460f-82c9-95bbbcf096e5" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/d57b5998-9119-4998-84d0-0d57adf7b31c" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/f3433b19-5598-4998-9e2b-8f9117a07ed6" />


## Deployment
>>>>>>> aa8d55ad759cd5027d247242e732871ca1d1037c
You can deploy this frontend on:
•	Render
•	Netlify
•	Vercel
•	GitHub Pages


License
This project is licensed under the MIT License.

