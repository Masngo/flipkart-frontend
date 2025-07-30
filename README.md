# flipkart-frontend
Flipkart-Frontend - A modern, responsive frontend for the Flipkart Clone project, built using React.js. It connects to the backend via REST APIs to provide a seamless e-commerce experience including product browsing, user authentication, cart functionality, and more.


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














Screenshots

<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/c10c733e-2668-4116-86a0-97601ad0a38e" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/8b10bdd2-1610-4bb9-b22f-94b06b9893e4" />
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/6b2bc846-4d79-4d6c-812f-93103f3816b0" />




  

 




 
________________________________________


Deployment
You can deploy this frontend on:
•	Netlify
•	Vercel
•	GitHub Pages


License
This project is licensed under the MIT License.




License
This project is licensed under the MIT License.
