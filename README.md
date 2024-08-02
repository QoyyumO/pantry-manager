# Pantry Manager

Welcome to **Pantry Manager**! This app helps you manage your pantry items efficiently and effortlessly.

## Features

- **Add & Edit Items**: Add new items to your pantry and edit existing ones with ease.
- **Search Functionality**: Quickly find items using the built-in search feature.
- **User Authentication**: Securely sign up and log in to keep your data safe.
- **Responsive Design**: Works seamlessly on both desktop and mobile devices.

## Installation

Follow these steps to set up the project locally in Visual Studio Code (VS Code):

1. **Clone the repository**:
   ```sh
   git clone https://github.com/your-username/pantry-manager.git
   cd pantry-manager
   ```
2. **Open the project in VS Code**:
-   Open VS Code.
-   Go to File > Open Folder and select the pantry-manager folder.
3. **Install dependencies**:
   ```sh
   npm install
4. **Set up Firebase**:
-   Create a Firebase project at Firebase Console.
-   Create a .env file in the root directory of the project with the following environment variables:
   ```sh
    NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```
-  Replace the placeholder values (your-api-key, your-auth-domain, etc.) with your Firebase project credentials.
5. **Run the development server:**:
   ```sh
   npm run dev
6. **Open the app :**
-    Open your browser and go to http://localhost:3000.

## Usage

- **Sign Up / Sign In**: Create an account or log in to manage your pantry items.
- **Add Items**: Use the "Add Item" button to add new items to your pantry.
- **Edit Items**: Click the edit icon on an item to update its details.
- **Delete Items**: Click the delete icon on an item to remove it from your pantry.
- **Search Items**: Use the search bar to quickly find specific items.

## License
- This project is licensed under the MIT License. See the LICENSE file for details.
