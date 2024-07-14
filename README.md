# E-Commerce Site : https://ecom1-6xoekar3lq-uc.a.run.app/

Welcome to the E-Commerce Site repository! This project is an e-commerce web application built using Go for the backend and React for the frontend. 

## Features

- User Authentication: Secure login and registration system.
- Product Listing: Browse and search through a wide range of products.
- Shopping Cart: Add, remove, and update items in the shopping cart.
- Order Management: Place orders and view order history.
- Admin Panel: Manage products, categories, and user accounts (coming soon).
- Admin Insights.
- Responsive Design: Optimized for both desktop and mobile devices.
- Continuous Deployment with github actions in GCP.

## Technologies Used

- **Backend**: Go
- **Frontend**: React
- **Database**: PostgreSQL
- **API**: RESTful APIs

## Installation

### Prerequisites

- Go (1.21.5 or later)
- Node.js (16.x or later)
- PostgreSQL

### Backend Setup

1. Clone the repository:

- bash : git clone https://github.com/stonoy/E-Commerce-Go-React.git

2. Navigate to the backend directory and install dependencies

- cd root
- go mod tidy

3. Set up the database by applying migrations
- goose postgres <database-connection-string> up

4. Navigate to the frontend directory and install dependencies

- cd client
- npm install

5. Start the frontend

- npm run dev

6. Build the frontend and copy the dist to root directory

- npm run build

7. Build and start the server

- go build -o exam1 && ./exam1

# Feel free to customize it further according to your project's specifics and requirements.
